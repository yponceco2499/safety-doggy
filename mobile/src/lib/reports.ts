import type { ReportCategory, ReportTypeId } from '@/constants/report-types';
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
