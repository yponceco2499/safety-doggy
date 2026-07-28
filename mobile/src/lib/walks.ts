import { supabase } from './supabase';

export interface Walk {
  id: string;
  user_id: string;
  pet_id: string | null;
  started_at: string;
  ended_at: string | null;
  distance_km: number | null;
}

// Explicit start/stop session tracking — no location data recorded, per the
// "light" version of feature #5 (see supabase/006_pets_and_walks.sql).
export async function fetchMyWalks(userId: string): Promise<Walk[]> {
  const { data, error } = await supabase
    .from('walks')
    .select('*')
    .eq('user_id', userId)
    .order('started_at', { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function fetchActiveWalk(userId: string): Promise<Walk | null> {
  const { data, error } = await supabase
    .from('walks')
    .select('*')
    .eq('user_id', userId)
    .is('ended_at', null)
    .order('started_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function startWalk(userId: string, petId: string | null): Promise<Walk> {
  const { data, error } = await supabase
    .from('walks')
    .insert({ user_id: userId, pet_id: petId })
    .select()
    .single();

  if (error) throw error;
  return data as Walk;
}

// distanceKm is omitted for a walk that wasn't GPS-tracked (light version) —
// its distance_km stays null, distinct from a tracked walk that measured 0.
export async function endWalk(walkId: string, distanceKm?: number): Promise<Walk> {
  const { data, error } = await supabase
    .from('walks')
    .update({ ended_at: new Date().toISOString(), ...(distanceKm != null ? { distance_km: distanceKm } : {}) })
    .eq('id', walkId)
    .select()
    .single();

  if (error) throw error;
  return data as Walk;
}

function durationMs(walk: Walk): number {
  const end = walk.ended_at ? new Date(walk.ended_at).getTime() : Date.now();
  return end - new Date(walk.started_at).getTime();
}

export function formatDurationMs(ms: number): string {
  const minutes = Math.max(1, Math.round(ms / 60000));
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest === 0 ? `${hours}h` : `${hours}h${String(rest).padStart(2, '0')}`;
}

export function walkDurationLabel(walk: Walk): string {
  if (!walk.ended_at) return 'En cours';
  return formatDurationMs(durationMs(walk));
}

export interface PetWalkStats {
  petId: string | null;
  count: number;
  totalKm: number;
  totalDurationMs: number;
}

// Groups completed + in-progress walks by dog (null = no dog selected),
// for the "3 sorties, 15km avec Rex" style dashboard summary.
export function statsByPet(walks: Walk[]): PetWalkStats[] {
  const byPet = new Map<string | null, PetWalkStats>();
  for (const walk of walks) {
    const key = walk.pet_id;
    const entry = byPet.get(key) ?? { petId: key, count: 0, totalKm: 0, totalDurationMs: 0 };
    entry.count += 1;
    entry.totalKm += walk.distance_km ?? 0;
    entry.totalDurationMs += durationMs(walk);
    byPet.set(key, entry);
  }
  return Array.from(byPet.values()).sort((a, b) => b.count - a.count);
}
