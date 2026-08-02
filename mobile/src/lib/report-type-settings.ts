import type { ReportTypeId } from '@/constants/report-types';
import { supabase } from './supabase';

// Runtime overrides for report type durations, admin-editable in-app (see
// app/admin-durations.tsx) without shipping a new build — see
// supabase/009_admin_report_durations.sql. `undefined` (key absent) means
// "no override, use the static default in constants/report-types.ts";
// `null` is a real value meaning "permanent".
let overrides: Partial<Record<ReportTypeId, number | null>> | null = null;

// Fire-and-forget from app/_layout.tsx at boot. Not awaited before first
// render — worst case, the very first duration read on a cold start uses
// the static default instead of an admin override, self-correcting within
// about a second once this resolves. Blocking app startup on this fetch
// isn't worth it, especially with spotty connectivity.
export async function loadReportTypeDurationOverrides(): Promise<void> {
  const { data, error } = await supabase.from('report_type_settings').select('type_id, duration_hours');
  overrides = error ? {} : Object.fromEntries((data ?? []).map((row) => [row.type_id, row.duration_hours]));
}

export function getDurationOverride(typeId: ReportTypeId): number | null | undefined {
  return overrides?.[typeId];
}

export async function updateReportTypeDuration(typeId: ReportTypeId, durationHours: number | null): Promise<void> {
  const { error } = await supabase
    .from('report_type_settings')
    .upsert({ type_id: typeId, duration_hours: durationHours, updated_at: new Date().toISOString() });
  if (error) throw error;
  if (overrides) overrides[typeId] = durationHours;
}
