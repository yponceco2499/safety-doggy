-- Safety Doggy — pets profile & lightweight walk stats (features #2 + #5)
-- Run this in the Supabase SQL editor after 005_report_photo.sql.
--
-- Per docs/05-future-improvements/feature-proposals.md:
-- - #2 "mes chiens" is strictly personal — never attached to a report, so
--   it does not touch the anonymity rule on public.reports.
-- - #5 ships the "light" version recommended in the doc: an explicit
--   start/stop walk session (no continuous background GPS, no distance
--   tracking, no location data recorded at all) — this sidesteps the GDPR
--   consent question the doc flags for the full tracking version, since
--   nothing here is location data.

create table public.pets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  breed text,
  created_at timestamptz not null default now()
);

alter table public.pets enable row level security;

create policy "Users can view their own pets"
  on public.pets for select
  using (auth.uid() = user_id);

create policy "Users can insert their own pets"
  on public.pets for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can delete their own pets"
  on public.pets for delete
  to authenticated
  using (auth.uid() = user_id);

-- No update policy: a pet's name/breed can just be deleted and re-added —
-- keeps this table's RLS surface minimal for a feature this small.

create table public.walks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  pet_id uuid references public.pets (id) on delete set null,
  started_at timestamptz not null default now(),
  ended_at timestamptz
);

create index walks_user_idx on public.walks (user_id);

alter table public.walks enable row level security;

create policy "Users can view their own walks"
  on public.walks for select
  using (auth.uid() = user_id);

create policy "Users can insert their own walks"
  on public.walks for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update their own walks"
  on public.walks for update
  to authenticated
  using (auth.uid() = user_id);
