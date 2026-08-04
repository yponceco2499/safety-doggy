import { decode } from 'base64-arraybuffer';
import * as FileSystem from 'expo-file-system/legacy';

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
  photo_url: string | null;
}

// Uploads a picked image to the "report-photos" bucket and returns its
// public URL. The path is namespaced under the uploader's own user id to
// match the storage RLS policy (see supabase/005_report_photo.sql).
export async function uploadReportPhoto(userId: string, localUri: string): Promise<string> {
  const base64 = await FileSystem.readAsStringAsync(localUri, { encoding: 'base64' });
  const extension = localUri.split('.').pop()?.toLowerCase() ?? 'jpg';
  const path = `${userId}/${Date.now()}-${Math.round(Math.random() * 1e9)}.${extension}`;

  const { error } = await supabase.storage.from('report-photos').upload(path, decode(base64), {
    contentType: `image/${extension === 'jpg' ? 'jpeg' : extension}`,
  });
  if (error) throw error;

  const { data } = supabase.storage.from('report-photos').getPublicUrl(path);
  return data.publicUrl;
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

export type ReportStatus = 'active' | 'expired' | 'deleted';

export function reportStatus(report: Report): ReportStatus {
  if (!report.is_active) return 'deleted';
  if (report.expires_at && new Date(report.expires_at).getTime() <= Date.now()) return 'expired';
  return 'active';
}

// Feature #13 (light version — in-app prompt, not a push notification: no
// server/scheduling infrastructure needed). A report is worth asking its
// creator to revalidate once it's past the halfway point of its own
// lifespan — early enough to still be useful, without nagging right after
// creation. Permanent reports (no expires_at) are never included: there's
// no natural "halfway" point for something meant to stay indefinitely.
export function needsRevalidation(report: Report): boolean {
  if (!report.is_active || !report.expires_at) return false;
  const start = new Date(report.created_at).getTime();
  const end = new Date(report.expires_at).getTime();
  const now = Date.now();
  if (now >= end) return false;
  const halfway = start + (end - start) / 2;
  return now >= halfway;
}

// Full history for the current user, including expired/deleted reports —
// unlike fetchActiveReports, not filtered by is_active/expires_at.
export async function fetchMyReports(userId: string): Promise<Report[]> {
  const { data, error } = await supabase
    .from('reports')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

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
  photoUrl?: string | null,
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
      photo_url: photoUrl ?? null,
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

// Inserts the flag and auto-deactivates the report once it reaches the
// threshold, via the flag_report() RPC (see supabase/002_flag_threshold.sql) —
// the flags table itself isn't readable by regular clients.
export async function flagReport(reportId: string): Promise<void> {
  const { error } = await supabase.rpc('flag_report', { p_report_id: reportId });
  if (error) throw error;
}

// Positive counterpart to flagReport() — any user can confirm a report is
// still accurate (see supabase/010_confirm_report.sql). Purely
// informational, no auto-deactivation threshold like flags has.
export async function confirmReport(reportId: string): Promise<void> {
  const { error } = await supabase.rpc('confirm_report', { p_report_id: reportId });
  if (error) throw error;
}

export async function getConfirmationCount(reportId: string): Promise<number> {
  const { data, error } = await supabase.rpc('get_confirmation_count', { p_report_id: reportId });
  if (error) throw error;
  return data ?? 0;
}
