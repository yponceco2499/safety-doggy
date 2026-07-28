-- Safety Doggy — report photos (feature #10)
-- Run this in the Supabase SQL editor after 004_veterinarian_type.sql.
--
-- Photos are optional and must never block publishing a report (product
-- decision confirmed 2026-07-16, see docs/05-future-improvements/
-- feature-proposals.md #10) — this only adds the storage plumbing; the
-- app enforces optionality client-side (Publish stays enabled with no
-- photo picked).

alter table public.reports add column if not exists photo_url text;

-- Public bucket: report photos are shown on public report detail cards,
-- same visibility as the report itself (see "Anyone can read active
-- reports" policy on public.reports in schema.sql).
insert into storage.buckets (id, name, public)
values ('report-photos', 'report-photos', true)
on conflict (id) do nothing;

create policy "Anyone can view report photos"
on storage.objects for select
using (bucket_id = 'report-photos');

-- Uploads must land under a folder named after the uploader's own user id
-- (enforced client-side as the first path segment) — mirrors the "own
-- rows only" pattern used by the reports/profiles RLS policies.
create policy "Users can upload photos into their own folder"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'report-photos'
  and (storage.foldername(name))[1] = auth.uid()::text
);
