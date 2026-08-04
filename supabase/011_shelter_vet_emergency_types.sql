-- SafetyPet — animal shelter & emergency vet report types (features #16 + #17)
-- Run this in the Supabase SQL editor after 010_confirm_report.sql.
--
-- Per docs/05-future-improvements/feature-proposals.md #16/#20 (option (a)
-- chosen: simple community pin, not a maintained directory) and #17
-- (option chosen: a new report type, not a static FAQ entry) — same
-- mechanism as #8/#9, a community-reported permanent positive point.

alter type public.report_type add value if not exists 'animal_shelter';
alter type public.report_type add value if not exists 'veterinarian_emergency';

-- No seed row needed in report_type_settings (#11): admin-durations.tsx and
-- getReportType() already fall back to the static default in
-- constants/report-types.ts when no override row exists, and
-- updateReportTypeDuration() upserts on first save. Also avoids using a
-- freshly-added enum value in the same transaction it was created in,
-- which Postgres rejects.
