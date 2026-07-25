# 🐾 Safety Doggy — Product Specification (MVP)

**Community mobile app for dog owners to check the safety and quality of walking areas in real time.**

| Item | Detail |
|---|---|
| Document version | 2.0 (cleaned up from original draft v1.0, April 2026) |
| Status | Draft for validation — see `audit-and-open-questions.md` for 4 items needing your explicit sign-off |
| Launch area | Le Havre and surrounding area (Normandy, France) |
| Target platform | Android — Google Play Store (MVP) |
| Development mode | Fully autonomous, AI-assisted (Claude Code, Cursor) |
| Budget | Zero recurring service budget — free tiers / open source only. One-time platform fees (Google Play $25) accepted. |
| Project owners | 2 people, no prior technical background |
| UI / legal language | French (MVP), codebase built i18n-ready for future languages |

> This document is the single source of truth for Safety Doggy's product scope. It supersedes the original "PawMap" draft (archived at `../00-source-archive/pawmap-original-source-en.md`). Every change from the original is explained in `audit-and-open-questions.md`.

---

## 1. Project Overview

### 1.1 Context

Dog owners regularly walk their dogs in urban, suburban, and rural areas. They have no centralized, dedicated tool to get real-time information about the safety and quality of walking areas: temporary hazards, community reports, or positive points of interest.

This gap leads to avoidable situations: exposure to active hunting zones, contact with dangerous processionary caterpillars, encounters with loose or aggressive animals, or simply less pleasant routes when better options exist nearby. The information already exists — it's just scattered across Facebook groups, local forums, and word of mouth.

### 1.2 Problem Statement

Before heading out, a dog owner should be able to quickly tell whether an area is safe and enjoyable for their dog. Today:

- No mainstream app centralizes this information for dog owners.
- Hazard alerts are scattered across unstructured local social media groups.
- Positive locations (off-leash areas, water points, shaded trails) aren't collaboratively mapped.
- No existing mapping platform is built around temporary dog-related events with automatic expiration.

### 1.3 Application Goal

A community-powered interactive map, inspired by Waze's collaborative model:

- **Anyone** can view the map and browse active reports, filter by category, and read report details — no account required.
- **Registered users** can additionally submit, edit, and delete their own reports, and view their reporting history.
- Reporting requires an account by design: it's the mechanism that makes rate-limiting, accountability, and dispute resolution possible at all. Anonymous users are full first-class consumers of the map; they are simply not contributors until they register — this is a deliberate trust/accountability trade-off, not a limitation to work around.
- Temporary reports expire automatically to keep the map trustworthy and current.

> 📌 Safety Doggy is **not** a GPS navigation app. It does not calculate routes. Users view the map, make an informed decision, and choose their own route.

---

## 2. Target Users

### 2.1 Primary Profile

| Criterion | Description |
|---|---|
| Profile | Dog owner, adult (25–60) |
| Geographic area | Le Havre and surrounding towns (Normandy) — MVP launch zone |
| Usage context | Before or during a walk, on the move |
| Equipment | Android smartphone, mobile data or Wi-Fi |
| Technical level | Comfortable with mainstream consumer apps (Maps, Waze, Leboncoin) |
| Main motivation | Safety and well-being of their dog |

Android-only is a deliberate MVP constraint, not a permanent exclusion — see §9.1 for the iOS plan and the conditions that trigger it.

### 2.2 Expected Behaviors

**Visitor (no account)**
- Opens the app to check the map before heading out.
- Filters reports by category.
- Visually assesses the area before walking through it.
- Never forced to create an account to browse.

**Contributor (registered)**
- Creates an account specifically to report something.
- Reports an event in a few seconds, from the field.
- Can edit or delete their own reports.
- Builds a personal report history over time.

### 2.3 Key Needs

| Need | Priority | Detail |
|---|---|---|
| Fast map access | Critical | No account required, available at app startup |
| Simple reporting | Critical | 3 taps or fewer from the map |
| Automatic expiration | Critical | No stale reports ever visible |
| Category filtering | Important | Clear separation of hazards vs. positive points |
| Data trustworthiness | Important | Recent reports surfaced prominently |
| Privacy | Important | GDPR-compliant from day one |
| Push notifications | Optional (V2) | Proximity alerts |

---

## 3. MVP Scope (Android)

### 3.1 Included in the MVP

| Feature | Included |
|---|---|
| Interactive map with reports | ✅ Yes |
| Browsing without an account | ✅ Yes |
| Account creation (email + Google) | ✅ Yes |
| Creating a geolocated report | ✅ Yes |
| Categories: hazard / positive point | ✅ Yes |
| Automatic report expiration | ✅ Yes |
| Edit/delete by the report's creator | ✅ Yes |
| Fixed, predefined list of report types | ✅ Yes |
| Category filter on the map | ✅ Yes |
| Duplicate-report confirmation (50m radius) | ✅ Yes |
| Anti-spam limit (5 reports/hour/account) | ✅ Yes |
| Terms of Use / Privacy Policy pages | ✅ Yes |
| **"Flag as incorrect" button, auto-deactivates at 4 flags** *(see §4.7)* | ✅ Yes |
| Optional profile photo (avatar) | ✅ Yes *(added 2026-07-16, see §4.4)* |
| Free-text description on reports | ❌ Removed from MVP (see §4.5) |
| Nickname displayed on reports | ❌ Not shown publicly (see §4.4) |
| Proximity push notifications | ❌ V2 |
| Walk history | ❌ V2 |
| User reputation system | ❌ V2 |
| Report photos | ❌ V2 |
| Offline mode | ❌ V2 |
| iOS version | ❌ V2 |
| Monetization / advertising | ❌ V2/V3 |

### 3.2 MVP Development Principle

The MVP must be functional, stable, and publishable on the Google Play Store — it does not need to be exhaustive. The goal is validating real usage in the launch area before investing further.

> 🎯 Golden rule: if a feature isn't essential to the core loop (browse + report), it's deferred to V2.

---

## 4. Detailed Features

### 4.1 Interactive Map

**Description:** The main screen is a map centered on the user's GPS position (with consent). Active reports appear as color-coded markers by category.

**Business logic:**
- Default map center: Le Havre (launch location), before GPS permission is resolved.
- If GPS permission is granted: auto-center on the user's position.
- Expired reports are never shown.
- Reports update in near real time via the database.
- Tapping a marker opens a detail card: type, creation date, estimated remaining duration. (No free-text description — see §4.5.)
- Two color families: red/orange for hazards, green/blue for positive points.
- Quick category filter accessible directly from the map.
- **Duplicate handling:** if two reports of the same type are created within a 50m radius, the second creator is asked to confirm before publishing, to reduce duplicate clutter.
- **No user-to-user location visibility:** the map only ever shows the fixed location of published reports and the current user's own position marker. No other user's live or current location is ever visible to anyone — there is no "nearby users," proximity, or user-tracking feature, in the MVP or planned for V2.

**Recommended mapping stack:**
- React Native Maps (Google Maps wrapper) or Mapbox GL (free tier).
- Base tiles: OpenStreetMap (free, open source).
- Budget fallback: Leaflet via WebView if API constraints appear.

### 4.2 Report Types

| Category | Type | Icon | Default Duration |
|---|---|---|---|
| ⚠️ Hazard | Active hunting | 🔴 | 4 hours |
| ⚠️ Hazard | Processionary caterpillars | 🔴 | 7 days |
| ⚠️ Hazard | Stray / loose animal *(renamed from "aggressive dog reported" — see rationale below)* | 🟠 | 24 hours |
| ⚠️ Hazard | Foxtail / grass-awn spot (*coin épillet*) | 🟠 | 30 days |
| ⚠️ Hazard | Dangerous bait (*appât dangereux*) | 🔴 | 48 hours |
| ⚠️ Hazard | Blocked / hard-to-access road (*route barrée / difficile d'accès*) | 🟠 | 48 hours |
| ✅ Positive | Tree-lined / shaded path | 🟢 | Permanent* |
| ✅ Positive | Off-leash area | 🔵 | Permanent* |
| ✅ Positive | Water point for dogs | 🔵 | Permanent* |
| ✅ Positive | Dog-friendly place | 🔵 | Permanent* |

\* Permanent reports stay visible until manually deleted by their creator or by moderation, and may be reviewed after 6 months of inactivity.

**Content rule (hard requirement):** reports must describe the hazard and its location only. They must never name, identify, or describe a specific animal or owner (including distinguishing details like breed + color that would let someone point at "that one dog"). This is why "aggressive dog reported" was renamed to "stray / loose animal" — a report naming a specific animal as dangerous, published publicly with no verification step, is a real defamation and reputational-harm risk for a two-person team with no moderation capacity at MVP stage. Animal-related danger is covered by "Stray / loose animal."

> ⚠️ **Note on removing the generic "Dangerous area (other)" catch-all (2026-07-16):** the type list no longer has a catch-all category for hazards that don't fit the named types. The "Suggest a new report type" mailto link (§4.5) is the intended escape valve if a real gap shows up in practice — flag if you'd rather keep a generic fallback category alongside the named ones.

*Dropped from MVP: "Pleasant view" — purely subjective, no safety or route-decision value; not worth the added category noise.*

### 4.3 Browsing Without an Account

**Description:** Anyone can open the app and view all active reports without creating an account.

**Business logic:**
- Read-only access to all active reports.
- Category filtering available with no account.
- Report detail cards viewable with no account.
- Zero personal data collected from non-logged-in users.
- No interstitial or banner interrupts browsing. The prompt to create an account appears only at the moment a visitor actually taps "Report" and would otherwise hit a dead end — framed as "an account keeps reports accountable," not as a paywall.

### 4.4 User Account Management

**Sign-up methods:**
- Email + password (with email confirmation).
- Google Sign-In (OAuth 2.0).

**Data collected at sign-up:**
- Email (required).
- Nickname (optional, stored on the account — **not shown publicly on reports**, see rationale below).
- Sign-up date.

**Optional profile photo:** users may add a photo to their account from the Profile screen at any time after sign-up (never required, never requested during sign-up itself). Like the nickname, it is stored at the account level only and **never shown publicly on reports** — same rationale as §4.4's nickname policy: attaching any identity to a public hazard claim discourages contribution for no functional benefit at MVP stage. It can be removed at any time from the profile.

> 🔒 No phone number or postal address requested in the MVP. Profile photo is optional and user-initiated, not collected at sign-up. GDPR-compliant by design.

**Public anonymity of reports:** reports are displayed on the map and in detail cards without any contributor identity attached. Rationale: as report volume grows, attaching visible identities would (a) clutter the report card with no functional benefit, and (b) discourage contributions from people who don't want their name next to a public hazard claim — directly undermining the goal of maximizing community contribution. The nickname is retained at the account level for future features (history, reputation in V2) but never surfaced next to report content in the MVP.

**Reserved for logged-in users:**
- Create a report.
- Edit / delete a report they created.
- View their own report history (simple list).

### 4.5 Creating a Report

**User journey:**
1. User taps the floating "Report" button on the map.
2. If not logged in → redirected to login/sign-up.
3. If logged in → report form opens.
4. User selects a report type from an icon grid (see §4.2) — **no free-text field in the MVP**.
5. Position is filled in **automatically from GPS by default** (primary method). Dragging the pin is a **secondary, manual option** for when the automatic position needs adjusting (e.g. GPS drift) or GPS is unavailable; a "Use my location" action snaps the pin back to the GPS position at any time.
6. Duration is fixed per type (see §4.2) — **not user-editable at creation**, to prevent a report from being kept "active" longer than warranted. A user *can* extend an already-published report's duration from its own detail card if it's still genuinely valid.
7. Submit → published immediately on the map.
8. Below the type grid, a **"Suggest a new report type"** link opens a pre-filled mailto to `contact@safetydoggy.app` — the escape valve referenced in §4.2 for gaps in the named type list. *(Implemented 2026-07-25.)*

**Why no free-text description:** a free-text field is the single largest content-moderation and legal-risk surface in the app (harassment, defamation, spam, links) — for a two-person team with no moderation tooling at MVP stage, this isn't worth the risk relative to the value it adds. Instead, provide a simple "Suggest a new report type" contact link (e.g. a mailto), so users can request categories/icons that don't yet exist; you review and add them centrally. The `description` field stays in the data model, unused for now, so this isn't a hard technical wall if you revisit it later.

**Validation rules:**
- Report type: required.
- Position: required (GPS or manual pin).
- Duration: fixed per type, not editable at creation.
- **Anti-spam:** maximum 5 reports per hour per account.

### 4.6 Automatic Event Expiration

**Description:** Reports have a defined lifespan and disappear automatically at expiration — no manual action required.

**Business logic:**
- Each report has an `expires_at` timestamp field.
- The load query filters: `WHERE expires_at > NOW() OR expires_at IS NULL`.
- Permanent reports: `expires_at = NULL`.
- Creators can extend an active report's duration from its own detail card.
- A scheduled job (Supabase Edge Function / cron) runs hourly to purge expired reports.

> ⚙️ Expiration is enforced server-side, not just client-side, so all users see a consistent map regardless of device or cache state.

### 4.7 Flagging an Incorrect Report *(implemented in the MVP)*

**Why:** with no free-text field and a strict no-identification content rule, the MVP still needs a way for a user to flag a wrong or malicious report, rather than relying solely on manual review via the Supabase dashboard.

**Implemented version:**
- A single "Flag as incorrect" button on each report's detail card (hidden for the report's own creator, and for visitors — registered users only).
- **Auto-deactivation at 4 flags** *(moved up from V2 into the MVP, threshold set to 4 rather than the originally planned 5 — decision made 2026-07-16 during build)*: once a report accumulates 4 flags, it's automatically deactivated (`is_active = false`) — same soft-delete state as the creator manually deleting it, reversible from the dashboard.
- One flag per user per report (enforced by a unique constraint on `flags(report_id, flagged_by)`).
- No moderation dashboard yet, no visibility into who flagged what — that part of §9.2's fuller moderation system is still V2. The threshold check itself runs server-side via a `flag_report()` Postgres function (`security definer`) so the `flags` table can stay unreadable to regular clients — flagger identity is never exposed to other users, only to the project owners via the Supabase dashboard.

---

## 5. Architecture and Technical Stack

### 5.1 Non-negotiable Constraints

- Zero recurring service budget: every backend/cloud service must run on a free tier.
- Android-first (React Native + Expo).
- Architecture extensible to iOS without a rewrite.
- 100% AI-assisted, autonomous development.
- GDPR compliance from day one.

### 5.2 Recommended Stack

| Layer | Technology | Why | Cost |
|---|---|---|---|
| Mobile frontend | React Native + Expo | Cross-platform, well-documented, AI-tool-friendly | Free |
| Mapping | React Native Maps + OpenStreetMap | Open source, no paid tile API key | Free |
| Backend / DB | Supabase (PostgreSQL) | Managed Postgres, built-in auth, Row Level Security, generous free tier | Free tier |
| Authentication | Supabase Auth + Google OAuth | Native email/password + Google Sign-In, GDPR-compliant | Included |
| File storage | Supabase Storage | Optional MVP profile avatars; reserved for V2 report photos | Included |
| Scheduled jobs | Supabase Edge Functions (cron) | Hourly expired-report cleanup | Included |
| Push notifications | Expo Notifications (V2) | Built into Expo, free FCM | Free (V2) |
| Distribution | Google Play Store | MVP launch channel | $25 one-time |

### 5.3 Mapping Alternatives (if API constraints arise)

| Option | Advantage | Limitation |
|---|---|---|
| Mapbox GL (free tier) | High-quality rendering, 50k tiles/month free | Requires API key, monthly cap |
| OpenStreetMap + Leaflet (WebView) | 100% free, open source | Less native feel, lower performance |
| Google Maps (free tier) | Native React Native Maps integration | $300/month credit, then paid |

**Recommendation:** start with OpenStreetMap + react-native-maps; migrate to Mapbox only if map quality becomes a measurable retention issue.

### 5.4 Data Model (Supabase / PostgreSQL)

**Table: `users`** (managed by Supabase Auth)

| Field | Type | Description |
|---|---|---|
| id | UUID | Unique identifier |
| email | TEXT | User's email |
| nickname | TEXT (nullable) | Account-level nickname (not shown publicly on reports) |
| avatar_url | TEXT (nullable) | Optional profile photo, stored in Supabase Storage (not shown publicly on reports) |
| created_at | TIMESTAMP | Sign-up date |
| deleted_at | TIMESTAMP (nullable) | GDPR soft-delete marker |

**Table: `reports`**

| Field | Type | Description |
|---|---|---|
| id | UUID | Unique report identifier |
| user_id | UUID (FK, nullable) | Creator reference; set to NULL on account deletion |
| type | TEXT (enum) | Report type (e.g. `stray_animal`, `foxtail_spot`, `water_point`) |
| category | TEXT (enum) | `hazard` or `positive` |
| description | TEXT (nullable) | Reserved for future use — unused in MVP UI |
| latitude | FLOAT8 | GPS latitude |
| longitude | FLOAT8 | GPS longitude |
| created_at | TIMESTAMP | Creation date |
| expires_at | TIMESTAMP (nullable) | Auto-expiration date; NULL = permanent |
| is_active | BOOLEAN | Active / manually disabled |

**Table: `flags`**

| Field | Type | Description |
|---|---|---|
| id | UUID | Unique flag identifier |
| report_id | UUID (FK) | Report being flagged |
| flagged_by | UUID (FK) | User who flagged it |
| created_at | TIMESTAMP | Flag timestamp |

### 5.5 Security and Data Access

- Row Level Security (RLS) enabled on every table.
- Reading active reports: public, no authentication required.
- Creating a report: authentication required.
- Editing/deleting: only the creating `user_id`, or moderators (project owners).
- Administration: via the Supabase dashboard — no dedicated admin UI in the MVP.

### 5.6 Path to iOS (V2)

React Native + Expo is natively cross-platform — no rewrite required to add iOS. When the go/no-go criteria in §8.3 are met:

- Add the iOS build target via Expo Application Services (EAS Build).
- Enroll in the Apple Developer Program ($99/year) — **not before V2 validation**, to avoid spending against an unproven hypothesis (see `audit-and-open-questions.md` §2.2/2.10 for the reasoning).
- Minor UI adaptation for Apple's Human Interface Guidelines.
- Test on iOS simulator via Xcode.

---

## 6. User Account Management

### 6.1 Rights Matrix

| Action | Visitor | Registered user |
|---|---|---|
| View the map | ✅ | ✅ |
| Read report detail cards | ✅ | ✅ |
| Filter by category | ✅ | ✅ |
| Create a report | ❌ | ✅ |
| Edit own report | ❌ | ✅ |
| Delete own report | ❌ | ✅ |
| View own report history | ❌ | ✅ |
| Flag a report | ❌ | ✅ |
| Delete own account | ❌ | ✅ (GDPR) |

### 6.2 Sign-up Journey

- Email + password: simple form, email confirmation link.
- Google Sign-In: OAuth 2.0, no password needed.
- Nickname requested at first login (optional, auto-generated if left blank).
- Terms of Use acceptance required at sign-up (checkbox + link).
- **Minimum age: 16** at sign-up (above France's GDPR digital-consent threshold of 15; appropriate given the app publishes public, geolocated, real-world content) — *pending your confirmation, see audit doc §3.3.*

### 6.3 Account Deletion (GDPR)

- Self-service deletion from account settings.
- Soft delete: `deleted_at` set, account disabled.
- Reports created are anonymized (`user_id` → NULL) but retained for community value.
- Personal account data (email, nickname) purged within 30 days of closure; anonymized report content is retained indefinitely.
- Full/immediate deletion available on written request via a dedicated contact email (specified in the Terms).

---

## 7. Regulatory Constraints

### 7.1 GDPR Compliance (mandatory from MVP)

| Obligation | Implementation |
|---|---|
| Data minimization | Only email + nickname + optional user-initiated avatar collected; no phone, no address, no tracked location history |
| Location privacy | No user's live/current location is ever exposed to other users — only fixed report positions and each user's own on-device position marker. No user-to-user tracking or proximity feature exists |
| Legal basis | Explicit consent at sign-up (Terms checkbox) |
| Right of access | Users can view their own data from their profile |
| Right to portability | Export on request via email (MVP); dedicated feature possible in V2 |
| Right to erasure | Self-service account deletion |
| Retention | Personal data purged within 30 days of account closure; anonymized reports retained indefinitely |
| Subprocessors | Supabase (EU hosting option), Google (OAuth) — disclosed in the Privacy Policy |
| DPO | Not legally required at this scale; a dedicated contact email is required regardless |

### 7.2 Mandatory Legal Documents

- Terms of Use — accessible from the app and the Play Store listing.
- Privacy Policy — data collected, purposes, retention, subprocessors, all disclosed.
- Both in French, in plain accessible language, in place before Play Store submission.

### 7.3 Google Play Store Requirements

| Requirement | Detail |
|---|---|
| Developer account | One-time $25 fee |
| Privacy policy | URL required in the store listing |
| Android permissions | GPS requested with explicit justification only |
| App content | No violent, hateful, or inappropriate content |
| Data Safety form | Completed in Play Console (data types, usage, sharing) |
| Age target | **16+ minimum** (see §6.2) |
| Internal testing | Play Console internal testing track before public release |

---

## 8. MVP Success Criteria

### 8.1 Technical Criteria (non-negotiable)

- App compiles and installs without error on Android.
- Map loads in under 3 seconds on a 4G connection.
- A user can sign up, log in, and create a report in under 2 minutes.
- Expired reports disappear automatically.
- App is published and live on the Google Play Store.
- No personal data exposed without authentication.

### 8.2 Usage Criteria (measured over 30 days post-launch)

| Indicator | Success Threshold | Measurement |
|---|---|---|
| Downloads | > 50 in the launch area | Google Play Console |
| Active users (MAU) | > 20/month | Supabase Analytics |
| Reports created | > 30 in 30 days | Supabase `reports` table |
| D7 retention | > 30% of sign-ups return at D+7 | Analytics / manual tracking |
| Crash rate | < 1% of sessions | Expo / Sentry (free) |
| User feedback | 10+ qualitative responses | Google Forms linked in-app |

### 8.3 Go/No-Go Criteria for V2

V2 (iOS port + advanced features) launches only when:

- At least 2 of the usage indicators above are met.
- No unresolved blocking bug for more than 7 days.
- User feedback on the core concept is majority positive.
- You've validated the local community model is viable.

---

## 9. Future Evolutions — V2 and Beyond

### 9.1 iOS Port (V2 priority)

| Step | Action | Effort |
|---|---|---|
| iOS build | Configure EAS Build for iOS in `expo.json` | Low |
| Testing | iOS simulator via Xcode (macOS required) | Medium |
| Apple account | Apple Developer Program ($99/year) | Administrative |
| Store listing | App Store listing + iOS screenshots | Medium |
| Compliance | Apple Human Interface Guidelines | Low–Medium |

### 9.2 V2 Features

**Proximity push notifications** — alert users to hazards within a configurable radius, via Expo Notifications + Firebase Cloud Messaging (free).

**Walk history** — opt-in GPS trace recording, frequented-area visualization, personal stats (distance, frequency). Requires explicit GDPR consent.

**Full moderation dashboard** — a simple UI over the `flags` table (currently only reviewable via the raw Supabase dashboard), plus visibility for moderators into who flagged what, to catch coordinated abuse of the flagging system itself. The auto-deactivation threshold (4 flags) is already live in the MVP as of §4.7; this V2 item is just the dashboard layer on top.

**User reputation system** — reliability score from report/confirmation history, shown on report cards. Includes the option to attach an optional photo to a report, to strengthen credibility and engagement.

### 9.3 Monetization Options (V2/V3)

| Option | Description | Prerequisite |
|---|---|---|
| Premium features | Advanced filters, stats, extended alerts | Established user base |
| Local partnerships | Vets, pet stores, dog-sitters featured on the map | Meaningful local audience |
| Targeted local ads | Non-intrusive, for pet professionals | Reinforced GDPR compliance |
| Pro subscription | Stats access for professionals (dog-sitters, trainers) | V3 |

---

## 10. Reference for AI Development Tools

### 10.1 Session-start prompt summary

> You are developing Safety Doggy, a community geolocation Android app (React Native + Expo) for dog owners. Backend: Supabase (PostgreSQL + Auth + Edge Functions). Map: OpenStreetMap. Visitors browse reports with no account; registered users create/edit/delete their own reports. Reports auto-expire server-side. No free-text fields on reports — category/icon only. Reports are shown anonymously (no contributor identity). GDPR compliance is mandatory. Zero recurring budget: free tiers / open source only. Refer to the full specification for any architecture or feature decision.

### 10.2 Development Kickoff Checklist

- [ ] Create the Expo project: `npx create-expo-app safety-doggy`
- [ ] Configure Supabase: project setup, enable Auth (email + Google OAuth)
- [ ] Create `users`, `reports`, `flags` tables; configure RLS
- [ ] Install `react-native-maps`, configure OpenStreetMap tiles
- [ ] Build the map screen (marker rendering, category filter)
- [ ] Build the authentication flow (sign-up / login, age gate)
- [ ] Build the report creation form (icon grid, fixed duration, no free text)
- [ ] Implement expiration logic (query filter + hourly cron Edge Function)
- [ ] Implement anti-spam (5/hour) and duplicate-detection (50m) rules
- [ ] Add Terms of Use and Privacy Policy pages (French)
- [ ] Test on a real Android device
- [ ] Configure EAS Build, generate APK/AAB
- [ ] Publish to Google Play Store (internal testing track first)

---

*Safety Doggy — confidential internal document. Supersedes the original "PawMap" draft.*
