-- Safety Doggy — add "pet_friendly_venue" report type
-- Run this in the Supabase SQL editor after schema.sql and 002_flag_threshold.sql.
--
-- Feature #8 (docs/05-future-improvements/feature-proposals.md): restaurants
-- and other businesses that welcome dogs, reported the same way as an
-- existing positive point of interest (e.g. dog_friendly) — no separate
-- directory, same permanent duration.
--
-- Postgres requires new enum values to be added outside a transaction block
-- and can't be used in the same transaction they're added in, so this must
-- be run as its own statement (which the Supabase SQL editor already does).

alter type public.report_type add value if not exists 'pet_friendly_venue';
