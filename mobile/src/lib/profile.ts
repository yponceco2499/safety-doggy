import { supabase } from './supabase';

export interface Profile {
  id: string;
  nickname: string | null;
  avatar_url: string | null;
  created_at: string;
  deleted_at: string | null;
  walk_tracking_consent_at: string | null;
  is_admin: boolean;
}

export async function fetchProfile(userId: string): Promise<Profile> {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
  if (error) throw error;
  return data as Profile;
}

export async function updateNickname(userId: string, nickname: string): Promise<void> {
  const { error } = await supabase.from('profiles').update({ nickname }).eq('id', userId);
  if (error) throw error;
}

// Records explicit, informed consent to background GPS tracking during a
// walk session (see the consent modal in app/walks.tsx for the explanation
// shown before this is called). Required before any tracked walk can start.
export async function grantWalkTrackingConsent(userId: string): Promise<void> {
  const { error } = await supabase
    .from('profiles')
    .update({ walk_tracking_consent_at: new Date().toISOString() })
    .eq('id', userId);
  if (error) throw error;
}

// Deletes the user's Supabase Auth credentials via the delete-account Edge
// Function (see supabase/functions/delete-account) — the client has no
// permission to remove an auth.users row directly, and never should (that
// requires the service_role key). Everything else — anonymizing the
// user's reports, removing their profile/pets/walks — happens
// automatically via the "on delete cascade"/"on delete set null" foreign
// keys already defined in the schema, not as separate client calls here.
// The caller should sign the user out immediately after this succeeds.
export async function deleteAccount(): Promise<void> {
  const { error } = await supabase.functions.invoke('delete-account', { method: 'POST' });
  if (error) throw error;
}
