-- SafetyPet — personalized position marker (feature #14)
-- Run this in the Supabase SQL editor after 011_shelter_vet_emergency_types.sql.
--
-- Purely cosmetic, strictly personal preference — null keeps the default
-- native "blue dot" (react-native-maps' showsUserLocation).

alter table public.profiles add column if not exists marker_icon text;
