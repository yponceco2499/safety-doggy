import type { ReportCategory, ReportTypeId } from '@/constants/report-types';
import { getReportType } from '@/constants/report-types';
import { supabase } from './supabase';

export interface Report {
  id: string;
  user_id: string | null;
  type: ReportTypeId;
  category: ReportCategory;
  latitude: number;
  longitude: number;
  created_at: string;
  expires_at: string | null;
  is_active: boolean;
}

export async function fetchActiveReports(): Promise<Report[]> {
  const { data, error } = await supabase
    .from('reports')
    .select('*')
    .eq('is_active', true)
    .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`);

  if (error) throw error;
  return data ?? [];
}

// Haversine distance in meters.
export function distanceMeters(a: { latitude: number; longitude: number }, b: { latitude: number; longitude: number }) {
  const R = 6371000;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export async function findNearbyDuplicate(
  type: ReportTypeId,
  coords: { latitude: number; longitude: number },
): Promise<Report | null> {
  const { data, error } = await supabase
    .from('reports')
    .select('*')
    .eq('type', type)
    .eq('is_active', true)
    .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`);
  if (error) throw error;
  const match = (data ?? []).find((r) => distanceMeters(r, coords) < 50);
  return match ?? null;
}

export async function countReportsLastHour(userId: string): Promise<number> {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { count, error } = await supabase
    .from('reports')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gt('created_at', oneHourAgo);
  if (error) throw error;
  return count ?? 0;
}

export async function createReport(
  userId: string,
  type: ReportTypeId,
  coords: { latitude: number; longitude: number },
) {
  const config = getReportType(type);
  const expiresAt = config.durationHours == null ? null : new Date(Date.now() + config.durationHours * 3600 * 1000).toISOString();

  const { data, error } = await supabase
    .from('reports')
    .insert({
      user_id: userId,
      type,
      category: config.category,
      latitude: coords.latitude,
      longitude: coords.longitude,
      expires_at: expiresAt,
      is_active: true,
    })
    .select()
    .single();

  if (error) throw error;
  return data as Report;
}

export async function extendReport(report: Report): Promise<Report> {
  const config = getReportType(report.type);
  if (config.durationHours == null) return report;

  const expiresAt = new Date(Date.now() + config.durationHours * 3600 * 1000).toISOString();
  const { data, error } = await supabase
    .from('reports')
    .update({ expires_at: expiresAt })
    .eq('id', report.id)
    .select()
    .single();

  if (error) throw error;
  return data as Report;
}

export async function deleteReport(reportId: string): Promise<void> {
  const { error } = await supabase.from('reports').update({ is_active: false }).eq('id', reportId);
  if (error) throw error;
}
