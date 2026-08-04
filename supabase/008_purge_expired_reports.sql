-- SafetyPet — scheduled purge of expired reports (spec §4.6)
-- Run this in the Supabase SQL editor after 007_walk_distance_tracking.sql.
--
-- This was left as a comment in schema.sql ("wire this up as a Supabase
-- Edge Function + cron trigger") and never actually implemented. It has
-- no visible effect on what users see — fetchActiveReports() and
-- findNearbyDuplicate() (mobile/src/lib/reports.ts) already filter on
-- expires_at at query time, so expired reports never show up on the map
-- or in duplicate checks even without this. What this fixes is
-- `is_active` never reflecting the true expiry state in the database
-- itself (e.g. for direct dashboard inspection, or any future admin
-- tooling that trusts is_active alone).
--
-- Uses pg_cron (bundled with Supabase's Postgres) rather than an Edge
-- Function — a straight SQL statement run on a schedule, no separate
-- deploy step needed. If `create extension` below fails with a
-- permissions error, enable "pg_cron" first via Database > Extensions
-- in the Supabase dashboard, then re-run this file.

create extension if not exists pg_cron with schema extensions;

create or replace function public.purge_expired_reports()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.reports
  set is_active = false
  where is_active and expires_at is not null and expires_at <= now();
end;
$$;

-- Re-running this file is safe: unschedule any previous job with the same
-- name before scheduling it again, instead of accumulating duplicates.
select cron.unschedule('purge-expired-reports-hourly')
where exists (select 1 from cron.job where jobname = 'purge-expired-reports-hourly');

select cron.schedule(
  'purge-expired-reports-hourly',
  '0 * * * *',
  $$ select public.purge_expired_reports(); $$
);
