import { supabase } from './supabase';

export interface Pet {
  id: string;
  user_id: string;
  name: string;
  breed: string | null;
  created_at: string;
}

export async function fetchMyPets(userId: string): Promise<Pet[]> {
  const { data, error } = await supabase
    .from('pets')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function createPet(userId: string, name: string, breed?: string | null): Promise<Pet> {
  const { data, error } = await supabase
    .from('pets')
    .insert({ user_id: userId, name, breed: breed || null })
    .select()
    .single();

  if (error) throw error;
  return data as Pet;
}

export async function deletePet(petId: string): Promise<void> {
  const { error } = await supabase.from('pets').delete().eq('id', petId);
  if (error) throw error;
}
