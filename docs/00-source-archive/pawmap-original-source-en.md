# [ARCHIVED SOURCE] PawMap — MVP Specification (Original Draft)

> **Archive note:** This is a faithful English translation of the original source document (`PawMap_CahierDesCharges_MVP.docx`, French, v1.0, April 2026). It is preserved here for traceability only. It is **not** the current specification — see `../01-product-documentation/safety-doggy-product-specification.md` for the validated, cleaned-up version.
>
> The original author left informal comments and open doubts directly inside the document text. They are preserved below exactly where they appeared, marked as **[Author's note: ...]**. All of these have been extracted, analyzed, and resolved (with recommendations) in `audit-and-open-questions.md`.

---

**🐾 PawMap** — Community mobile geolocation app for dog owners

**SPECIFICATION — ANDROID MVP**

| Item | Detail |
|---|---|
| Document version | 1.0 |
| Drafting date | April 2026 |
| Launch area | Le Havre and surrounding area (Normandy, France) |
| Target platform | Android — Google Play Store |
| Development mode | Fully autonomous via AI tools (Claude Code, Cursor) |
| Dedicated budget | None — free / open-source solutions only |
| Project owners | 2 people, no technical background |

> ⚠️ *This document was designed to be used directly as a reference prompt in Claude Code, Cursor, or any AI development tool. It should be read in full before any development session.*

## 1. Project Overview

### 1.1 Context

Dog owners regularly walk their dogs in urban and suburban areas. They currently have no dedicated, centralized tool to get real-time information about the state of walking areas: temporary hazards, community reports, or positive points of interest.

This lack of information leads to avoidable situations: exposure to active hunting zones, contact with dangerous processionary caterpillars, encounters with reported aggressive dogs, or simply taking less pleasant routes when better options exist nearby.

### 1.2 Problem Solved

PawMap answers a simple, concrete need: knowing, before heading out for a walk, whether an area is safe and pleasant for one's dog.

- No mainstream mobile app centralizes this information for dog owners.
- Hazard alerts (hunting, caterpillars) are scattered across local Facebook groups or unstructured forums.
- Positive points of interest (off-leash areas, water points, tree-lined paths) are not collaboratively mapped.
- There is no automatic expiration system for temporary events in this context.

### 1.3 Application Goal

Create a community interactive map, inspired by Waze, allowing dog owners to:

- View active reports on a map, with no account required.
- Report an event (hazard or positive point) after creating an account **[Author's note: shouldn't people not be passive about others with an account making reports? Maybe account users could have history and other advanced features]**.
- Benefit from automatic expiration of temporary reports.
- Contribute to a useful, evolving local community database.

> 📌 *PawMap is NOT a GPS navigation app. There is no route calculation. The user views the map, chooses their route knowingly, and moves freely.*

## 2. Target Users

### 2.1 Primary Profile

| Criterion | Description |
|---|---|
| Profile | Dog owner, adult (25–60 years) |
| Geographic area | Le Havre and surrounding towns (Normandy) |
| Usage context | Before or during a walk, on the move |
| Equipment | Android smartphone **[Author's note: not including iPhone could hurt us a lot?]**, mobile data or Wi-Fi |
| Technical level | User of mainstream apps (Maps, Waze, Leboncoin) |
| Main motivation | Safety and well-being of their dog |

### 2.2 Expected Behaviors

**Reader user (no account)**
- Opens the app to check the map before going out.
- Filters reports by type (hazards / positive points).
- Visually assesses the area they want to walk through.
- Doesn't create an account if not necessary.

**Contributor user (with account)**
- Creates an account in order to report an event.
- Reports an event quickly, in a few seconds, from the field.
- Sets the estimated validity duration of the report.
- Can edit or delete their own reports.

### 2.3 Key Needs

| Need | Priority | Detail |
|---|---|---|
| Quick map consultation | Critical | Accessible without an account, at app startup |
| Simple reporting | Critical | Maximum 3 clicks from the map |
| Automatic expiration | Critical | No outdated reports visible |
| Filtering by type | Important | Separation of alerts / positive points |
| Data reliability | Important | Recent reports highlighted |
| Privacy | Important | GDPR compliant from the MVP |
| Push notifications | Optional, V2 | Proximity alerts |

## 3. Android MVP Scope

### 3.1 What's Included in the MVP

| Feature | Included in MVP |
|---|---|
| Interactive map with reports | ✅ Yes |
| Browsing without an account | ✅ Yes |
| Account creation (email + Google) | ✅ Yes |
| Creating a geolocated report | ✅ Yes |
| Categories: hazard / positive point | ✅ Yes |
| Automatic event expiration | ✅ Yes |
| Deletion/editing by the creator | ✅ Yes |
| Defined list of report types | ✅ Yes |
| Category filter on the map | ✅ Yes |
| Terms of Use / Privacy Policy page | ✅ Yes |
| Proximity push notifications | ❌ V2 |
| Walk history | ❌ V2 |
| User reputation system | ❌ V2 |
| Offline mode | ❌ V2 |
| iOS version | ❌ V2 |
| Monetization / advertising | ❌ V2 |

### 3.2 MVP Development Principle

The MVP must be functional, stable, and publishable on the Google Play Store. It doesn't aim to be exhaustive. The goal is to validate real usage by users in the launch area before investing in advanced features.

> 🎯 *Golden rule of the MVP: if a feature isn't essential to basic usage (browse + report), it is deferred to V2.*

## 4. Detailed Features

### 4.1 Interactive Map

**Description**

The app's main screen is a map centered on the user's GPS position (with their consent). Active reports are shown as colored markers differentiated by category.

**Business Logic**

- The map loads by default on Le Havre (launch location).
- If GPS permission is granted: automatic centering on the user's position.
- Expired reports are not shown.
- Reports are updated in real time (or near real time) via the database.
- Clicking a marker opens a detail card: type, description, creation date, estimated duration.
- Two main colors: red/orange for hazards, green/blue for positive points.
- Quick category filter accessible from the map.
- *[Added by author, underlined in source]* Duplicate report handling: if two reports of the same type are created within a 50m radius, confirmation is requested from the user before publishing, to avoid duplication.

**Recommended Mapping Library**

- React Native Maps (Google Maps wrapper) or Mapbox GL (free tier sufficient).
- Base map tiles: OpenStreetMap (free, open source).
- Budget alternative: Leaflet via WebView if API budget is very constrained.

### 4.2 Report Types

| Category | Type | Suggested Icon | Default Duration |
|---|---|---|---|
| ⚠️ Hazard | Active hunting | 🔴 | 4 hours |
| ⚠️ Hazard | Processionary caterpillars | 🔴 | 7 days |
| ⚠️ Hazard | Aggressive dog reported **[Author's note: maybe rather "stray dog/animal" — owners of aggressive dogs might react badly to being identified on an app]** | 🟠 | 24 hours |
| ⚠️ Hazard | Dangerous area (other) | 🟠 | 48 hours |
| ✅ Positive | Tree-lined / shaded path | 🟢 | Permanent* |
| ✅ Positive | Pleasant view **[Author's note: not useful, I think]** | 🟢 | Permanent* |
| ✅ Positive | Off-leash area | 🔵 | Permanent* |
| ✅ Positive | Water point for dogs | 🔵 | Permanent* |
| ✅ Positive | Dog-friendly place | 🔵 | Permanent* |

> \* "Permanent" reports remain visible until manually deleted by the creator or moderation. They may be subject to review after 6 months of inactivity.

### 4.3 Browsing Without an Account

**Description**

Any user can open the app and view the map with all active reports, without creating an account or logging in.

**Business Logic**

- Read-only access to all active reports.
- Category filtering available without an account.
- Detail card viewing available without an account.
- No personal data collected for a non-logged-in user.
- A banner inviting account creation appears on the first click on "Report" **[Author's note: as mentioned, I worry this will discourage people who are "too lazy to create an account"]**.

### 4.4 User Account Management

**Sign-up Methods**
- Email + password (with email confirmation).
- Google Sign-In (OAuth 2.0).

**Data Collected at Sign-up**
- Email (required).
- Nickname or first name (optional, displayed on reports) **[Author's note: if we ever get a lot of reports, I worry names will clutter the reports, and that people will hesitate to report if their identity is attached]**.
- Sign-up date.

> 🔒 *No phone number, no postal address, no profile photo are requested in the MVP. GDPR compliance ensured from the start.*

**Features Reserved for Logged-in Users**
- Create a report.
- Edit a report they created.
- Delete a report they created.
- View their report history (simple list).

### 4.5 Creating a Report

**User Journey**

- The user taps the "Report" button (floating button on the map).
- If not logged in: redirect to the login/sign-up screen.
- If logged in: a report form opens.
- The user chooses the report type (dropdown list or icon grid).
- GPS position is pre-filled (manually adjustable via a pin on the map).
- The user adds a short description (optional, 280 characters max) **[Author's note: same concern — too much detail might clutter reports; maybe just icons, and users could message moderators (us) to request new features/icons, which we'd then address]**.
- The validity duration is pre-filled based on type (editable) **[Author's note: maybe we should pre-set the duration ourselves so there's no room for abuse]**.
- Validation → the report is published immediately on the map.

**Validation Rules**
- Report type: required.
- Position: required (GPS or manual selection).
- Description: optional.
- Duration: required (default value per type, user-editable) **[Author's note: see above — maybe not user-editable]**.
- *[Added by author, underlined in source]* Anti-spam limit: maximum 5 reports per hour per account.

### 4.6 Automatic Event Expiration

**Description**

Reports have a defined lifespan. Upon expiration, they automatically disappear from the map with no manual action.

**Business Logic**

- Each report has an `expires_at` field (timestamp).
- The report-loading query automatically filters: `WHERE expires_at > NOW() OR expires_at IS NULL`.
- For permanent reports: `expires_at = NULL`.
- The user can extend the validity duration from their report's detail card.
- A scheduled job (Cloud Function or Supabase cron) cleans the database hourly to remove expired reports.

> ⚙️ *Expiration must be handled server-side, not only client-side, to guarantee data consistency across all users.*

## 5. Architecture and Technical Stack

### 5.1 Non-negotiable Technical Constraints

- Zero budget: no paid service without a sufficient free tier.
- Android-compatible as priority (React Native + Expo recommended).
- Architecture extensible to iOS without major rework.
- 100% autonomous development via AI tools.
- GDPR compliance from the start.

### 5.2 Recommended Stack

| Layer | Technology | Justification | Cost |
|---|---|---|---|
| Mobile frontend | React Native + Expo | Cross-platform, extensive docs, simple CLI, Claude Code-compatible | Free |
| Mapping | React Native Maps + OpenStreetMap | Open source, no paid API key for OSM tiles | Free |
| Backend / DB | Supabase | Managed PostgreSQL, built-in auth, Row Level Security, generous free tier | Free (free tier) |
| Authentication | Supabase Auth + Google OAuth | Native email/password and Google Sign-In, GDPR compliant | Included with Supabase |
| File storage | Supabase Storage | For future images (report photos in V2) | Included with Supabase |
| Scheduled jobs | Supabase Edge Functions (cron) | Cleanup of expired events, serverless | Included with Supabase |
| Push notifications | Expo Notifications (V2) | Built into Expo, free Firebase FCM | Free (V2) |
| Distribution | Google Play Store | Main MVP Android target | $25 one-time |

### 5.3 Mapping Alternative if API-constrained

| Solution | Advantage | Limitation |
|---|---|---|
| Mapbox GL (free tier) | High-quality rendering, 50k free tiles/month | API key required, monthly limit |
| OpenStreetMap + Leaflet (WebView) | 100% free, open source | Less native, lower performance |
| Google Maps (free tier) | Native React Native Maps integration | $300/month credit, then paid |

> 📌 *Recommendation: Start with OpenStreetMap + react-native-maps for the MVP. Migrate to Mapbox if map quality becomes a retention factor.*

### 5.4 Data Architecture (Supabase / PostgreSQL)

**Table: users (managed by Supabase Auth)**

| Field | Type | Description |
|---|---|---|
| id | UUID | Unique identifier (managed by Supabase Auth) |
| email | TEXT | User's email |
| pseudo | TEXT (nullable) | Displayed nickname |
| created_at | TIMESTAMP | Sign-up date |
| deleted_at | TIMESTAMP (nullable) | GDPR soft delete |

**Table: reports**

| Field | Type | Description |
|---|---|---|
| id | UUID | Unique report identifier |
| user_id | UUID (FK) | Reference to the creating user |
| type | TEXT (enum) | Report type (e.g. 'hunting', 'water_point') |
| category | TEXT (enum) | Category: 'danger' or 'positive' |
| description | TEXT (nullable) | Free description (max 280 characters) |
| latitude | FLOAT8 | Report GPS latitude |
| longitude | FLOAT8 | Report GPS longitude |
| created_at | TIMESTAMP | Creation date |
| expires_at | TIMESTAMP (nullable) | Automatic expiration date (NULL = permanent) |
| is_active | BOOLEAN | Active / manually disabled |

### 5.5 Security and Data Access

- Row Level Security (RLS) enabled on all Supabase tables.
- Reading active reports: public (no authentication).
- Creating a report: authentication required.
- Editing / deleting: only by the creating user_id or moderators (us).
- Administration: via the Supabase dashboard (no admin interface in the MVP).

### 5.6 Architecture Extensible to iOS

The React Native + Expo stack is natively cross-platform. To publish on iOS in V2:

- No code rewrite needed.
- Add the iOS build via Expo Application Services (EAS Build).
- Enroll in the Apple Developer Program ($99/year, cost to plan for in V2) **[Author's note: if needed, I'm fine investing now — I think a lot of people have iPhones...]**.
- Minor UI adaptation to follow iOS guidelines (Human Interface Guidelines).
- Testing on iOS simulator via Xcode.

## 6. User Account Management

### 6.1 Rights Matrix

| Action | Visitor (no account) | Logged-in user |
|---|---|---|
| View the map | ✅ Yes | ✅ Yes |
| Read report cards | ✅ Yes | ✅ Yes |
| Filter by category | ✅ Yes | ✅ Yes |
| Create a report | ❌ No | ✅ Yes |
| Edit their report | ❌ No | ✅ Yes (their own) |
| Delete their report | ❌ No | ✅ Yes (their own) |
| View their history | ❌ No | ✅ Yes |
| Delete their account | ❌ No | ✅ Yes (GDPR) |

### 6.2 Sign-up Journey

- Email + password: simple form, email confirmation (verification link).
- Google Sign-In: OAuth 2.0, no password required.
- Nickname: requested at first login (optional, auto-generated if empty).
- Acceptance of Terms of Use: required at sign-up (checkbox + link to Terms).

### 6.3 Account Deletion (GDPR)

- The user can delete their account from settings.
- Soft deletion: the `deleted_at` field is set, the account is disabled.
- Reports created are anonymized (`user_id` set to NULL) but kept for community use.
- Permanent deletion possible upon written request (dedicated email address to be specified in the Terms).

## 7. Regulatory Constraints

### 7.1 GDPR — Mandatory Compliance from the MVP

| GDPR Obligation | Implementation in PawMap |
|---|---|
| Data minimization | Only email and nickname are collected. No phone number, no location stored at login |
| Legal basis for processing | Explicit consent at sign-up (Terms checkbox) |
| Right of access | The user can view their data from their profile |
| Right to portability | Export possible via email request (MVP) or dedicated feature (V2) |
| Right to erasure | Account deletion available in settings |
| Retention period | Active data kept as long as the account is active. Deletion within 30 days after closure |
| Subprocessors | Supabase (EU hosting possible), Google (OAuth) — to be mentioned in the privacy policy |
| DPO | Not mandatory for an organization of this size, but a dedicated contact email is required |

### 7.2 Mandatory Legal Documents

- Terms of Use: accessible from the app and the Play Store listing.
- Privacy Policy: same, mentioning data collected, purposes, retention period, subprocessors.
- These documents must be written in French, in accessible language.

> 📋 *These documents can be generated via AI tools (Claude, Iubenda, etc.) and customized based on the data actually collected. They must be in place before publishing on the Play Store.*

### 7.3 Google Play Store Requirements

| Requirement | Detail |
|---|---|
| Developer account | One-time $25 fee — to plan for |
| Privacy policy | URL required in the Play Store listing |
| Android permissions | GPS: explicit request with justification. No unjustified permission |
| App content | No violent, hateful, or inappropriate content — compliant with Google guidelines |
| User data | "Data Safety" form to complete in Play Console (data types, usage, sharing) |
| Age target | Adult app (13+ minimum, 18+ recommended given potentially sensitive report content) |
| Internal testing | Use the Play Console internal testing track before public release |

## 8. MVP Success Criteria

### 8.1 Technical Criteria (non-negotiable)

- The app compiles and installs without error on an Android device.
- The map loads in under 3 seconds on a 4G connection.
- A user can create an account, log in, and create a report in under 2 minutes.
- Expired reports automatically disappear from the map.
- The app is published and accessible on the Google Play Store.
- No personal data is exposed without authentication.

### 8.2 Usage Criteria (measured over 30 days post-launch)

| Indicator | MVP Success Threshold | Measurement Method |
|---|---|---|
| Downloads | > 50 in the launch area | Google Play Console |
| Active users (MAU) | > 20 active users/month | Supabase Analytics |
| Reports created | > 30 reports in 30 days | Supabase `reports` table |
| D7 retention rate | > 30% of sign-ups returning at D+7 | Analytics or manual tracking |
| Crash rate | < 1% of sessions | Expo / Sentry (free) |
| User feedback | 10+ qualitative responses collected | Google Forms linked to the app |

### 8.3 Go/No-Go Criteria for V2

V2 (iOS port + advanced features) will launch if the following conditions are met:

- At least 2 of the usage indicators above are reached.
- No unresolved blocking bug for more than 7 days.
- Mostly positive user feedback on the concept.
- The project owners have validated the viability of the local community model.

## 9. Future Evolutions — V2 and Beyond

### 9.1 iOS Port (V2 priority)

| Step | Required Action | Estimated Effort |
|---|---|---|
| iOS build | Configure EAS Build for the iOS target in expo.json | Low |
| Testing | Test on iOS simulator (Xcode required, macOS needed) | Medium |
| Apple account | Subscribe to the Apple Developer Program ($99/year) | Administrative |
| App Store publishing | Write App Store listing, iOS screenshots | Medium |
| App Store compliance | Follow Apple's Human Interface Guidelines | Low to medium |

### 9.2 V2 Features

**Proximity push notifications**
- Alert the user when a hazard is reported less than X km from their position.
- Implementation via Expo Notifications + Firebase Cloud Messaging (FCM) — free.
- The user chooses their alert radius and notification categories.

**Walk history**
- Recording GPS traces (explicit opt-in, GDPR consent required).
- Visualization of frequented areas on the map.
- Personal statistics (distance, frequency).

**Community moderation system**
- "Report as incorrect" button on each marker + *[added by author]* report removed after 5 removal requests in a row, and moderators can see who requested removal, to prevent people from "obstructing" our work.
- Report threshold → automatic deactivation pending verification.
- Simple moderation dashboard for administrators.

**User reputation system**
- Reliability score based on report history and confirmations.
- Reliability level displayed on report cards.
- *[Added by author, underlined in source]* Allow adding an optional photo to a report — strengthens reliability and engagement.

### 9.3 Monetization Options (V2/V3)

| Option | Description | Prerequisite |
|---|---|---|
| Premium features | Access to advanced filters, statistics, extended alerts | Established user base |
| Local partnerships | Vets, pet stores, dog-sitters featured on the map | Significant local audience |
| Targeted local advertising | Non-intrusive ads for pet professionals | Reinforced GDPR compliance |
| Pro subscription | Access to statistics for professionals (dog-sitters, trainers) | V3 |

## 10. Instructions for the AI Development Tool

> 📣 *This section is meant to be copied directly into Claude Code, Cursor, or any AI development tool as reference context at the start of each session.*

### 10.1 AI Prompt Summary

When using this document as a reference in an AI tool, use the following instruction at the start of a session:

> You are developing PawMap, a community geolocation Android mobile app (React Native + Expo) for dog owners. The backend is Supabase (PostgreSQL + Auth + Edge Functions). The map uses OpenStreetMap. Users can browse reports without an account, and create them with an account. Reports automatically expire. GDPR compliance is mandatory. No budget: everything must be free or open source. Refer to the full specification for any architecture or feature decision.

### 10.2 Development Kickoff Checklist

- [ ] Create the Expo project: `npx create-expo-app pawmap`
- [ ] Configure Supabase: create a project, enable Auth (email + Google OAuth)
- [ ] Create the `reports` tables and configure RLS
- [ ] Install `react-native-maps` and configure OpenStreetMap
- [ ] Build the map screen (marker display)
- [ ] Build the authentication flow (sign-up / login)
- [ ] Build the report creation form
- [ ] Implement expiration logic (query + cron Edge Function)
- [ ] Integrate category filters
- [ ] Add Terms of Use and Privacy Policy pages
- [ ] Test on a real Android device
- [ ] Configure EAS Build and generate the APK/AAB
- [ ] Publish on the Google Play Store (internal testing track first)

*— End of document —*

PawMap © 2026 — Confidential document for internal use
