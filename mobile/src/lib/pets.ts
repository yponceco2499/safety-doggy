import { supabase } from './supabase';

export interface Pet {
  id: string;
  user_id: string;
  name: string;
  breed: string | null;
  created_at: string;
  birth_date: string | null;
  microchip_id: string | null;
  next_vaccine_date: string | null;
  vaccine_reminder_notification_id: string | null;
}

export interface CreatePetInput {
  name: string;
  breed?: string | null;
  birthDate?: string | null;
  microchipId?: string | null;
  nextVaccineDate?: string | null;
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

export async function createPet(userId: string, input: CreatePetInput): Promise<Pet> {
  const { data, error } = await supabase
    .from('pets')
    .insert({
      user_id: userId,
      name: input.name,
      breed: input.breed || null,
      birth_date: input.birthDate || null,
      microchip_id: input.microchipId || null,
      next_vaccine_date: input.nextVaccineDate || null,
    })
    .select()
    .single();

  if (error) throw error;
  return data as Pet;
}

// Persists the identifier scheduleVaccineReminder() returned, so it can be
// cancelled later (see lib/pet-reminders.ts) if the pet is deleted.
export async function updatePetVaccineReminder(petId: string, notificationId: string | null): Promise<void> {
  const { error } = await supabase
    .from('pets')
    .update({ vaccine_reminder_notification_id: notificationId })
    .eq('id', petId);
  if (error) throw error;
}

export async function deletePet(petId: string): Promise<void> {
  const { error } = await supabase.from('pets').delete().eq('id', petId);
  if (error) throw error;
}
