-- Safety Doggy — walk distance tracking, full version (feature #5, full)
-- Run this in the Supabase SQL editor after 006_pets_and_walks.sql.
--
-- Builds on the light start/stop walk sessions from 006 by adding an
-- opt-in, explicit-consent GPS distance tracking, requested on top of the
-- lightweight version originally shipped. Per
-- docs/05-future-improvements/feature-proposals.md #5, this is the "full
-- version" the doc had deferred (difficulty 4/5) precisely because it
-- requires explicit GDPR consent, which this adds.
--
-- Privacy-by-design: only the final computed distance is stored, never a
-- raw GPS trace/path — a distance is derivable from a path, but a path is
-- not derivable back from a distance, so this keeps the stored data
-- footprint to the minimum needed for the "km per dog" dashboard.

alter table public.walks add column if not exists distance_km numeric;

-- Timestamp of the user's explicit opt-in to background GPS tracking
-- during a walk session. Null means never granted (or later revoked by
-- re-running a future migration that clears it, if that's ever needed) —
-- the app must re-request this consent screen before tracking again.
alter table public.profiles add column if not exists walk_tracking_consent_at timestamptz;
