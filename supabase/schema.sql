-- Safety Doggy — initial schema
-- Run this in the Supabase SQL editor (or via `supabase db push` once the CLI is linked).
-- Matches docs/01-product-documentation/safety-doggy-product-specification.md §5.4/§5.5.

-- ---------------------------------------------------------------------------
-- Extensions
-- ---------------------------------------------------------------------------
create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- profiles (extends auth.users, which Supabase Auth manages already)
-- ---------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  nickname text,
  avatar_url text,
  created_at timestamptz not null default now(),
  deleted_at timestamptz
);

alter table public.profiles enable row level security;

create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-create a profile row whenever a new auth user signs up.
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, nickname)
  values (new.id, 'Dog Walker ' || floor(random() * 9000 + 1000)::text);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---------------------------------------------------------------------------
-- reports
-- ---------------------------------------------------------------------------
create type public.report_category as enum ('hazard', 'positive');

create type public.report_type as enum (
  'active_hunting',
  'caterpillars',
  'stray_animal',
  'foxtail_spot',
  'dangerous_bait',
  'blocked_road',
  'shaded_path',
  'offleash_area',
  'water_point',
  'dog_friendly'
);

create table public.reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  type public.report_type not null,
  category public.report_category not null,
  description text,
  latitude double precision not null,
  longitude double precision not null,
  created_at timestamptz not null default now(),
  expires_at timestamptz,
  is_active boolean not null default true
);

create index reports_active_idx on public.reports (is_active, expires_at);
create index reports_user_idx on public.reports (user_id);

alter table public.reports enable row level security;

create policy "Anyone can read active reports"
  on public.reports for select
  using (is_active and (expires_at is null or expires_at > now()));

create policy "Logged-in users can create reports"
  on public.reports for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Creators can update their own reports"
  on public.reports for update
  to authenticated
  using (auth.uid() = user_id);

create policy "Creators can delete their own reports"
  on public.reports for delete
  to authenticated
  using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- flags ("flag as incorrect" — spec §4.7)
-- ---------------------------------------------------------------------------
create table public.flags (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null references public.reports (id) on delete cascade,
  flagged_by uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (report_id, flagged_by)
);

alter table public.flags enable row level security;

create policy "Logged-in users can flag a report"
  on public.flags for insert
  to authenticated
  with check (auth.uid() = flagged_by);

-- No public select policy: flags are reviewed manually via the Supabase dashboard
-- by the project owners (service role bypasses RLS).

-- ---------------------------------------------------------------------------
-- Scheduled cleanup — hourly purge of expired reports (spec §4.6)
-- Wire this up as a Supabase Edge Function + cron trigger (pg_cron or
-- Supabase's scheduled Edge Functions), calling:
--   update public.reports set is_active = false
--   where is_active and expires_at is not null and expires_at <= now();
-- Kept as a comment here rather than a pg_cron job so it's visible in one
-- place; move to an actual Edge Function when that's set up.
-- ---------------------------------------------------------------------------
