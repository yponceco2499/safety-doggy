import { supabase } from './supabase';

export interface Profile {
  id: string;
  nickname: string | null;
  avatar_url: string | null;
  created_at: string;
  deleted_at: string | null;
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

// Anonymizes the user's reports and soft-deletes their profile row.
// Note: this does not remove the underlying Supabase Auth credentials
// (email/password) — that still needs a manual dashboard step or a future
// admin-privileged Edge Function. The caller should sign the user out
// immediately after this succeeds.
export async function deleteAccount(userId: string): Promise<void> {
  const { error: reportsError } = await supabase.from('reports').update({ user_id: null }).eq('user_id', userId);
  if (reportsError) throw reportsError;

  const { error: profileError } = await supabase
    .from('profiles')
    .update({ deleted_at: new Date().toISOString(), nickname: null, avatar_url: null })
    .eq('id', userId);
  if (profileError) throw profileError;
}
