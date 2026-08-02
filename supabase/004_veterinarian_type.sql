-- SafetyPet — add "veterinarian" report type
-- Run this in the Supabase SQL editor after schema.sql, 002_flag_threshold.sql
-- and 003_pet_friendly_venue_type.sql.
--
-- Feature #9 (docs/05-future-improvements/feature-proposals.md): same
-- reasoning as #8 (pet_friendly_venue) — a veterinarian is reported as a
-- community point of interest, not a full directory entry with hours,
-- emergency info or reviews (a Google Maps link already covers that
-- better than a hand-maintained database would).
--
-- Postgres requires new enum values to be added outside a transaction block
-- and can't be used in the same transaction they're added in, so this must
-- be run as its own statement (which the Supabase SQL editor already does).

alter type public.report_type add value if not exists 'veterinarian';
