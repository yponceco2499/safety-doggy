-- SafetyPet — enriched dog profile + vaccine reminder (feature #18)
-- Run this in the Supabase SQL editor after 012_custom_position_marker.sql.
--
-- Light version, matching feature #5's precedent of shipping the simple
-- case first: one upcoming vaccine date per dog (not a full multi-vaccine
-- history), reminder is a local device-scheduled notification 1 month
-- before — no push infrastructure, no server involved (see
-- lib/pet-reminders.ts).

alter table public.pets add column if not exists birth_date date;
alter table public.pets add column if not exists microchip_id text;
alter table public.pets add column if not exists next_vaccine_date date;
-- Local notification identifier, so it can be cancelled if the pet is
-- deleted or the date changes — never a push token, purely a handle
-- expo-notifications gives back from scheduleNotificationAsync().
alter table public.pets add column if not exists vaccine_reminder_notification_id text;
