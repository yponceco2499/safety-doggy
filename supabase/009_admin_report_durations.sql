-- SafetyPet — admin-adjustable report durations (feature #11, "safe" version)
-- Run this in the Supabase SQL editor after 008_purge_expired_reports.sql.
--
-- Per docs/05-future-improvements/feature-proposals.md #11: report
-- durations must stay non-editable by the user who creates a report (an
-- anti-abuse guardrail — see spec §4.5/§4.2), but the project owners
-- should be able to recalibrate a duration that turns out wrong in
-- practice, without shipping a new app build. Durations move from the
-- hardcoded values in mobile/src/constants/report-types.ts into this
-- table; the app reads it as a runtime override (falls back to the
-- constants file if a row is missing), so leaving this table untouched
-- changes nothing.

create table public.report_type_settings (
  type_id public.report_type primary key,
  duration_hours integer,
  updated_at timestamptz not null default now()
);

alter table public.report_type_settings enable row level security;

create policy "Anyone can read report type settings"
  on public.report_type_settings for select
  using (true);

-- profiles.is_admin gates who can change a duration — everyone else
-- (including anonymous browsers) can still read the current settings,
-- since the app needs them to compute/display expiry for every report.
alter table public.profiles add column if not exists is_admin boolean not null default false;

create policy "Admins can insert report type settings"
  on public.report_type_settings for insert
  to authenticated
  with check ((select is_admin from public.profiles where id = auth.uid()) = true);

create policy "Admins can update report type settings"
  on public.report_type_settings for update
  to authenticated
  using ((select is_admin from public.profiles where id = auth.uid()) = true);

-- Seed with the current defaults from mobile/src/constants/report-types.ts,
-- so this table starts out changing nothing until an admin edits a row.
insert into public.report_type_settings (type_id, duration_hours) values
  ('active_hunting', 4),
  ('caterpillars', 168),
  ('stray_animal', 24),
  ('foxtail_spot', 720),
  ('dangerous_bait', 48),
  ('blocked_road', 48),
  ('shaded_path', null),
  ('offleash_area', null),
  ('water_point', null),
  ('dog_friendly', null),
  ('pet_friendly_venue', null),
  ('veterinarian', null)
on conflict (type_id) do nothing;

-- ---------------------------------------------------------------------------
-- After running this file, make your own account(s) admin — nobody is an
-- admin by default. Find your user id in the Supabase dashboard under
-- Authentication > Users, then run (once per account):
--   update public.profiles set is_admin = true where id = '<your-user-id>';
-- ---------------------------------------------------------------------------
