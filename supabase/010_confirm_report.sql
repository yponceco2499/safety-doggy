-- SafetyPet — positive "still there" confirmation (feature #21)
-- Run this in the Supabase SQL editor after 009_admin_report_durations.sql.
--
-- Per docs/05-future-improvements/feature-proposals.md #21: the only
-- community signal on a report today is negative ("flag as incorrect",
-- §4.7 / 002_flag_threshold.sql). This adds its positive counterpart —
-- any user (not just the report's creator, unlike #13) can confirm a
-- report is still accurate, shown as a count on the detail card.
--
-- Same table, same privacy pattern as flags: individual confirmations are
-- never exposed (who confirmed stays private, same as who flagged), only
-- an aggregate count via a dedicated function. No auto-deactivation on
-- this signal — confirmations are purely informational, unlike the
-- 4-flag auto-deactivation threshold on 'incorrect'.

alter table public.flags add column if not exists kind text not null default 'incorrect' check (kind in ('incorrect', 'confirm'));

-- Widen the uniqueness constraint so a user's "incorrect" flag and
-- "confirm" vote on the same report are tracked independently.
alter table public.flags drop constraint if exists flags_report_id_flagged_by_key;
alter table public.flags add constraint flags_report_id_flagged_by_kind_key unique (report_id, flagged_by, kind);

create or replace function public.confirm_report(p_report_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.flags (report_id, flagged_by, kind)
  values (p_report_id, auth.uid(), 'confirm')
  on conflict (report_id, flagged_by, kind) do nothing;
end;
$$;

grant execute on function public.confirm_report(uuid) to authenticated;

-- Public read of the aggregate count only — never the individual rows
-- (flags keeps its "no public select policy", see schema.sql). Anonymous
-- browsers can call this too, same as they can read reports themselves.
create or replace function public.get_confirmation_count(p_report_id uuid)
returns int
language sql
security definer
set search_path = public
stable
as $$
  select count(*)::int from public.flags where report_id = p_report_id and kind = 'confirm';
$$;

grant execute on function public.get_confirmation_count(uuid) to authenticated, anon;
