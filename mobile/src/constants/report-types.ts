import { getDurationOverride } from '@/lib/report-type-settings';

export type ReportCategory = 'hazard' | 'positive';

export type ReportTypeId =
  | 'active_hunting'
  | 'caterpillars'
  | 'stray_animal'
  | 'foxtail_spot'
  | 'dangerous_bait'
  | 'blocked_road'
  | 'shaded_path'
  | 'offleash_area'
  | 'water_point'
  | 'dog_friendly'
  | 'pet_friendly_venue'
  | 'veterinarian';

export interface ReportTypeConfig {
  id: ReportTypeId;
  category: ReportCategory;
  color: string;
  icon: string;
  labelFr: string;
  durationHours: number | null;
}

export const REPORT_TYPES: ReportTypeConfig[] = [
  { id: 'active_hunting', category: 'hazard', color: '#E53935', icon: '🎯', labelFr: 'Chasse en cours', durationHours: 4 },
  { id: 'caterpillars', category: 'hazard', color: '#E53935', icon: '🐛', labelFr: 'Chenilles processionnaires', durationHours: 168 },
  { id: 'stray_animal', category: 'hazard', color: '#FB8C00', icon: '🐕', labelFr: 'Animal errant', durationHours: 24 },
  { id: 'foxtail_spot', category: 'hazard', color: '#FB8C00', icon: '🌾', labelFr: 'Coin épillet', durationHours: 720 },
  { id: 'dangerous_bait', category: 'hazard', color: '#E53935', icon: '☠️', labelFr: 'Appât dangereux', durationHours: 48 },
  { id: 'blocked_road', category: 'hazard', color: '#FB8C00', icon: '🚧', labelFr: "Route barrée / difficile d'accès", durationHours: 48 },
  { id: 'shaded_path', category: 'positive', color: '#43A047', icon: '🌳', labelFr: 'Chemin ombragé', durationHours: null },
  { id: 'offleash_area', category: 'positive', color: '#1E88E5', icon: '🐾', labelFr: 'Zone sans laisse', durationHours: null },
  { id: 'water_point', category: 'positive', color: '#1E88E5', icon: '💧', labelFr: "Point d'eau", durationHours: null },
  { id: 'dog_friendly', category: 'positive', color: '#1E88E5', icon: '🏠', labelFr: 'Lieu dog-friendly', durationHours: null },
  { id: 'pet_friendly_venue', category: 'positive', color: '#1E88E5', icon: '🍽️', labelFr: 'Restaurant / commerce pet-friendly', durationHours: null },
  { id: 'veterinarian', category: 'positive', color: '#1E88E5', icon: '🩺', labelFr: 'Vétérinaire', durationHours: null },
];

export function getReportType(id: ReportTypeId): ReportTypeConfig {
  const found = REPORT_TYPES.find((t) => t.id === id);
  if (!found) throw new Error(`Unknown report type: ${id}`);
  // Admin-adjustable duration override (see lib/report-type-settings.ts and
  // supabase/009_admin_report_durations.sql) — applied here so every
  // existing caller of getReportType() picks it up automatically, with no
  // other call site needing to know this exists. Safe against import
  // cycles: report-type-settings.ts only imports the ReportTypeId *type*
  // from this file, which TypeScript erases before bundling.
  const override = getDurationOverride(id);
  return override === undefined ? found : { ...found, durationHours: override };
}

// Le Havre, France — MVP launch area default map center.
export const DEFAULT_REGION = {
  latitude: 49.4938,
  longitude: 0.1077,
  latitudeDelta: 0.08,
  longitudeDelta: 0.08,
};
