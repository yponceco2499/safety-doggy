import { supabase } from './supabase';

export interface Walk {
  id: string;
  user_id: string;
  pet_id: string | null;
  started_at: string;
  ended_at: string | null;
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

export async function endWalk(walkId: string): Promise<Walk> {
  const { data, error } = await supabase
    .from('walks')
    .update({ ended_at: new Date().toISOString() })
    .eq('id', walkId)
    .select()
    .single();

  if (error) throw error;
  return data as Walk;
}

export function walkDurationLabel(walk: Walk): string {
  if (!walk.ended_at) return 'En cours';
  const ms = new Date(walk.ended_at).getTime() - new Date(walk.started_at).getTime();
  const minutes = Math.max(1, Math.round(ms / 60000));
  if (minutes < 60) return `${minutes} min`;
  return `${Math.floor(minutes / 60)}h${String(minutes % 60).padStart(2, '0')}`;
}
