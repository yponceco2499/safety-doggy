-- SafetyPet — flag-threshold auto-removal
-- Run this in the Supabase SQL editor after schema.sql.
--
-- The `flags` table has no public SELECT policy (flaggers' identities stay
-- private, reviewed manually by the project owners — see schema.sql), so the
-- app can't just count rows client-side. This function inserts the flag and
-- checks the threshold in one atomic, security-definer step, without ever
-- exposing individual flag rows to regular users.
--
-- Threshold: a report is auto-deactivated (is_active = false, same as a
-- manual delete — soft, reversible via the dashboard) once it has 4 flags.

create or replace function public.flag_report(p_report_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  flag_count int;
begin
  insert into public.flags (report_id, flagged_by)
  values (p_report_id, auth.uid())
  on conflict (report_id, flagged_by) do nothing;

  select count(*) into flag_count from public.flags where report_id = p_report_id;

  if flag_count >= 4 then
    update public.reports set is_active = false where id = p_report_id;
  end if;
end;
$$;

grant execute on function public.flag_report(uuid) to authenticated;
