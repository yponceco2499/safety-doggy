# Safety Doggy — Product Vision & Functional Specification

| Item | Detail |
|---|---|
| Document version | 1.0 |
| Status | Draft — awaiting your confirmation before Step 2 (UX Design) |
| Source of truth | `../01-product-documentation/safety-doggy-product-specification.md` + `../01-product-documentation/audit-and-open-questions.md` |
| Scope decisions locked this session | See §2 |

**How to read this document:** §1 restates the product in plain terms. §2 records every scope decision made so far (including the ones you just confirmed) so there's one place that reflects the current truth. §3 is the real substance — every feature broken into functional requirements (who does it, what triggers it, what happens, what can go wrong) grouped by screen/flow instead of by document section, so it maps directly onto what you'll see in Step 2 (UX). §4 lists smaller gaps I found and resolved with a sensible default — flagged for your awareness, not blocking. §5–§7 are supporting reference material.

---

## 1. Product Vision

**Problem:** Dog owners have no dedicated, centralized way to know — before or during a walk — whether a nearby area currently has a hazard (hunting, loose animals, caterpillars) or a worthwhile feature (shade, water, off-leash space). That information exists today, scattered across Facebook groups and word of mouth, effectively invisible at the moment it's needed.

**Target user:** An adult dog owner (25–60) in Le Havre and the surrounding area, walking their dog with an Android phone in hand, who wants a fast safety check before or during a walk — not a route planner, not a social network.

**Core value proposition:** A live, community-maintained map of temporary hazards and permanent points of interest for dog walking, trustworthy because reports expire automatically and contributors are accountable — usable instantly by anyone, contributable to only by registered users.

**What it deliberately is not:** Not a GPS navigation app (no routing, no turn-by-turn). Not a social network (no profiles, no feeds, no comments). Not a general pet app (no vet finder, no walk tracking in MVP).

---

## 2. Scope Decisions Locked In This Phase

These consolidate every open item from the audit doc plus new gaps found while writing this specification. Nothing below is silently assumed — all were either explicitly in the audit doc or raised with you directly before being written here.

| # | Decision | Resolution | Source |
|---|---|---|---|
| 1 | Platform for MVP | **Android-only.** All iOS/Apple Developer spend deferred to V2, gated by §8.3 go/no-go criteria. | Audit §2.2/2.10 |
| 2 | "Flag as incorrect" | **Included in MVP.** Single button on report detail card, logs to a `flags` table, no auto-moderation, checked manually via Supabase dashboard. | Audit §3.2 |
| 3 | Minimum sign-up age | **16+.** Enforced at sign-up; tied to Play Store Data Safety / age-rating forms. | Audit §3.3 |
| 4 | UI language | **Bilingual French/English from MVP** (upgrade from the spec's original French-only recommendation — real scope addition: translation, layout for both languages, a language switcher). | This session |
| 5 | Legal document language | **Terms of Use / Privacy Policy remain in French as the legally binding text** (mandatory for Play Store France listing). An **English convenience translation** is shown alongside when the UI is set to English, clearly labeled as non-binding. | This session |
| 6 | Permanent report inactivity | **Auto-expire after 6 months of no activity** (edit/extend resets the clock), purged by the same hourly cron job as timed reports. Removes the original "may be reviewed" language, which had no owner or mechanism. | This session |
| 7 | Report pin placement limit | **Capped to the launch area** (Le Havre + surrounding towns, ~30 km radius). Prevents reports being dropped into the launch community from anywhere in the world while still allowing normal GPS-drift correction. | This session |
| 8 | Email verification vs. reporting | **Confirmed email required before a user's first report.** Browsing remains open to everyone regardless of verification status. | This session |
| 9 | "Edit" scope on a report | Clarified: since type, category, and position are immutable after creation (changing them would functionally be a new report), **"edit" means extending an active report's duration** — not a general-purpose edit form. Delete remains separately available. | This session, resolving spec ambiguity |

**Everything else** (report types, no free-text field, fixed durations, anonymous reports, anti-spam 5/hour, duplicate detection 50m, GDPR data handling, Android 8.0/API 26 floor) carries over unchanged from the specification — see it directly for full detail rather than duplicated here.

---

## 3. Functional Requirements by Flow

Each requirement: **Actor** (who) · **Trigger** (what starts it) · **Behavior** (what happens) · **Edge cases** (what could go wrong and what happens then).

### 3.1 App Launch & Permissions

**FR-1.1 — First launch: language**
- Actor: Any user, first ever launch.
- Trigger: App opens for the first time on the device.
- Behavior: App reads device locale. If French or English, use it as default UI language. Otherwise, default to French (launch market). Preference stored locally and changeable anytime (§3.12).
- Edge cases: Device locale is neither FR nor EN → default French, not a crash or blank state.

**FR-1.2 — Location permission request**
- Actor: Any user, first launch (or first time reaching the map if deferred).
- Trigger: Map screen is about to render for the first time.
- Behavior: OS-native permission prompt requests location access, with a one-line justification ("used to center the map on you and pre-fill report locations"). Requested once proactively; not re-nagged every session.
- Edge cases: See FR-1.3.

**FR-1.3 — Location permission denied or unavailable**
- Actor: Any user who denies permission, or whose device has GPS/location services off.
- Trigger: Permission denial, or location fetch failure/timeout.
- Behavior: Map falls back to default center (Le Havre). A persistent, non-blocking banner or icon indicates "location unavailable — tap to enable" that deep-links to app settings. Browsing and filtering work fully without location. Report creation still works via manual pin placement (§3.7, FR-7.2).
- Edge cases: User grants permission later mid-session → map re-centers on next GPS fix without requiring app restart.

**FR-1.4 — Returning user launch**
- Actor: Any returning user.
- Trigger: App reopened.
- Behavior: Skips onboarding/permission prompts already resolved; goes straight to the map with last-used language and filter settings restored.
- Edge cases: None beyond normal app-state restore.

### 3.2 Map & Browsing

**FR-2.1 — Default map view**
- Actor: Visitor or registered user.
- Trigger: Map screen opens, GPS not yet resolved or denied.
- Behavior: Map centers on Le Havre at a fixed default zoom.

**FR-2.2 — GPS-centered map view**
- Actor: Any user with location granted.
- Trigger: GPS fix obtained.
- Behavior: Map auto-centers on user's current position.

**FR-2.3 — Marker rendering**
- Actor: Any user.
- Trigger: Map has one or more active reports in the current viewport.
- Behavior: Each active, non-expired report renders as a color-coded marker (red/orange = hazard, green/blue = positive), icon matching its type (§4.2 of the spec).
- Edge cases: Two+ reports at the same coordinates cluster visually (exact clustering behavior to be defined at wireframe stage in Step 2) rather than fully overlapping into an unreadable stack.

**FR-2.4 — Live updates**
- Actor: Any user with the map open.
- Trigger: Another user creates, edits, or the system expires a report.
- Behavior: Map reflects the change in near real time without requiring a manual refresh (via Supabase real-time subscription).
- Edge cases: If real-time updates fail (connectivity blip), the map still reflects the correct state on next load/reopen — staleness is capped by that, not indefinite.

**FR-2.5 — Empty map (no active reports in view)**
- Actor: Any user.
- Trigger: Map viewport contains zero active reports (e.g., a very quiet area, or immediately post-launch with low adoption).
- Behavior: Map renders normally with no markers — no error, no "no data" overlay blocking the view. *(New gap — not in original spec; simplest correct behavior, flagged here for visibility.)*

**FR-2.6 — Network failure loading reports**
- Actor: Any user.
- Trigger: Map cannot reach Supabase (no connectivity, backend unreachable).
- Behavior: Map still renders (base tiles may be cached by the map SDK) with a clear, dismissible banner: "Can't load reports — check your connection" and a manual retry action. No offline cache of report data in MVP (offline mode is V2) — this is a real gap the spec didn't address, resolved here with the simplest honest option rather than pretending offline works.
- Edge cases: Retry succeeds mid-session → banner clears automatically once reports load.

**FR-2.7 — No user-to-user location visibility**
- Actor: Any user.
- Trigger: N/A — a standing constraint, not a triggered behavior.
- Behavior: The only positions ever rendered on the map are (a) the fixed coordinates of published reports and (b) the current device's own "you are here" marker. No other user's live or current position is ever transmitted, stored per-session, or rendered — there is no "nearby users," friends-map, or presence feature, in the MVP or planned for V2. *(Added 2026-07-16 per explicit product decision.)*

### 3.3 Category Filter

**FR-3.1 — Open filter**
- Actor: Any user.
- Trigger: Taps the filter control on the map.
- Behavior: Presents the list of report types (or category groups: hazards / positive) as toggle-able choices.

**FR-3.2 — Apply filter**
- Actor: Any user.
- Trigger: Selects/deselects one or more types.
- Behavior: Map markers update immediately to reflect only selected types. Default state (no filter applied) shows all active types.

**FR-3.3 — Filter persistence**
- Actor: Any user.
- Trigger: Closes and reopens the app.
- Behavior: Last-used filter selection is remembered locally (device-level, not account-level — applies to visitors too).

### 3.4 Report Detail Card

**FR-4.1 — Open report detail**
- Actor: Any user.
- Trigger: Taps a marker.
- Behavior: Opens a card/bottom sheet showing: type/icon, creation date, estimated remaining duration (or "Permanent" for non-expiring types). No free-text description field exists to show.

**FR-4.2 — Actions available: report creator**
- Actor: The registered user who created this specific report.
- Trigger: Opens their own report's detail card.
- Behavior: Sees "Extend duration" (if not permanent and not yet expired) and "Delete" actions. Does **not** see "Flag as incorrect" on their own report — flagging your own report is a no-op, since delete already covers it. *(New gap, resolved here.)*

**FR-4.3 — Actions available: any other user**
- Actor: Visitor, or a registered user who did not create this report.
- Trigger: Opens someone else's report's detail card.
- Behavior: Visitors see detail only, no actions. Registered users additionally see "Flag as incorrect" (§3.5).

**FR-4.4 — Extend duration**
- Actor: Report creator, logged in.
- Trigger: Taps "Extend duration" on their own active, non-permanent report.
- Behavior: Duration resets to the type's full default duration from the moment of extension (e.g., a 24h "stray animal" report extended at hour 20 becomes active for another full 24h from that point). Extending a permanent report resets its 6-month inactivity clock (§2, decision 6).
- Edge cases: Attempting to extend an already-expired report is not possible — an expired report is already removed from view (report would need to be recreated).

**FR-4.5 — Report expires while card is open**
- Actor: Any user.
- Trigger: A report's `expires_at` passes while its detail card is open on screen.
- Behavior: Card either closes automatically with a brief note ("This report has expired") or visually marks itself expired and disables remaining actions — exact treatment decided at wireframe stage (Step 2), but it must not silently keep showing stale actionable buttons. *(New gap, flagged for Step 2 wireframing decision, not blocking here.)*

### 3.5 Flagging a Report

**FR-5.1 — Flag as incorrect**
- Actor: Registered, logged-in user, viewing a report they did not create.
- Trigger: Taps "Flag as incorrect" on the report detail card.
- Behavior: Writes a row to the `flags` table (report_id, flagged_by, timestamp). Button shows a brief confirmation ("Thanks, we'll review this") and then disables for that report/user combination — no further UI, no in-app moderation, no visible flag count to other users.
- Edge cases: **One flag per user per report** — re-tapping after already flagging does nothing (or is already disabled). No automated action results from any number of flags in the MVP (that's the V2 threshold system, §9.2 of the spec) — a flag is purely a signal for your manual dashboard review.

### 3.6 Authentication

**FR-6.1 — Report button while logged out**
- Actor: Visitor (not logged in).
- Trigger: Taps the floating "Report" button.
- Behavior: Redirected directly to the login/sign-up screen — no interstitial banner beforehand (audit §2.5). Screen carries a one-line explanation: "An account keeps reports accountable" (not framed as a paywall).

**FR-6.2 — Sign up: email + password**
- Actor: Visitor.
- Trigger: Chooses "Sign up with email" from the auth screen.
- Behavior: Collects email, password, age confirmation (FR-6.3), Terms/Privacy acceptance checkbox (§3.11). Sends confirmation email. Account created in an unverified state.
- Edge cases: Email already registered → clear inline error ("This email is already in use — log in instead?") rather than a generic failure. Weak/invalid password → inline validation before submission attempt. *(New gap, resolved here.)*

**FR-6.3 — Age gate**
- Actor: Any user signing up.
- Trigger: Reaches the age-confirmation step of sign-up.
- Behavior: User must confirm they are 16 or older (checkbox or birthdate field — exact UI decided in Step 2) before an account can be created. Rejecting/declining halts sign-up with a clear, non-punitive message.

**FR-6.4 — Email confirmation gate on reporting**
- Actor: Registered user with an unconfirmed email (email/password sign-up only).
- Trigger: Attempts to submit their first report.
- Behavior: Blocked with a clear message ("Please confirm your email to start reporting") and a "resend confirmation email" action. Browsing remains fully available regardless of confirmation status.
- Edge cases: User confirms email in a separate tab/app while report form is open → next submit attempt succeeds without forcing a full re-login. **Google sign-ups are exempt from this gate** — Google already verifies the account's email, and the gate exists specifically to stop disposable/fake-email abuse, which doesn't apply to OAuth accounts. (Confirmed in Step 2, UX Design.)

**FR-6.5 — Sign up / login with Google**
- Actor: Visitor.
- Trigger: Chooses "Continue with Google."
- Behavior: OAuth 2.0 flow via Supabase Auth; on success, account created (first time) or logged in (returning), skipping password entirely. Age gate (FR-6.3) still applies on first-time Google sign-up.
- Edge cases: User cancels the Google flow midway, or it fails (no network, Google account issue) → returned to the auth screen with no partial account created, no confusing error. *(New gap, resolved here.)*

**FR-6.6 — Login: email + password**
- Actor: Returning registered user.
- Trigger: Enters credentials on the login screen.
- Behavior: Standard authentication; success returns user to the screen they came from (e.g., straight into the report form if that's what triggered login).
- Edge cases: Wrong password → generic "incorrect email or password" (no hint which one is wrong, standard security practice). Account with unconfirmed email → allowed to log in (browsing works either way) but flagged per FR-6.4 when reporting is attempted.

**FR-6.7 — Forgot password**
- Actor: Returning registered user (email/password accounts only — Google accounts have no app password).
- Trigger: Taps "Forgot password?" on the login screen.
- Behavior: Enters email, receives a reset link, sets a new password. *(New gap — not mentioned anywhere in the original spec despite email/password being a supported sign-up method. Standard flow applied as the default; flagged here since it was missing entirely.)*

**FR-6.8 — Disabled account**
- Actor: A user whose account you have manually disabled via the Supabase dashboard (the only moderation mechanism in the MVP).
- Trigger: Attempts to log in.
- Behavior: Clear message ("Your account has been disabled — contact [support email] for details") rather than a generic login failure. *(New gap, resolved here — matters because manual dashboard moderation is the only enforcement tool available in the MVP.)*

**FR-6.9 — Session expires mid-use**
- Actor: Logged-in user with a stale/expired session token.
- Trigger: Performs an action requiring auth (submit report, extend, delete, flag) after the session has expired.
- Behavior: Redirected to login with as much of their in-progress input preserved as is technically reasonable (e.g., selected report type and pin position kept, so they don't have to redo the whole form); resumes the original action after successful re-login where feasible.
- Edge cases: If preserving form state isn't feasible technically, at minimum the user must be told clearly why they were bounced, not silently dropped. *(New gap; exact technical feasibility to be confirmed in the later build phase — this FR sets the product expectation.)*

### 3.7 Report Creation

**FR-7.1 — Select report type**
- Actor: Logged-in, email-confirmed user.
- Trigger: Report form opens (after FR-6.1/6.4 gates pass).
- Behavior: Icon grid of the fixed report types (§4.2 of spec), grouped visually by hazard vs. positive. One selection required to proceed.

**FR-7.2 — Position**
- Actor: Logged-in user, mid-report-creation.
- Trigger: After selecting a type.
- Behavior: GPS position **automatically** pre-fills the pin on a small map — this is the primary, default method, requiring no action from the user. Dragging the pin is a **secondary, manual option**, for adjusting the auto-detected position or placing it from scratch when GPS isn't available. A "Use my location" action is available to snap the pin back to the GPS-detected position after a manual adjustment. Pin placement is capped to the launch area (~30 km around Le Havre, decision 7 in §2).
- Edge cases: GPS denied/unavailable (FR-1.3) → pin defaults to the last-known map center (e.g., Le Havre), a clear inline message states location is unavailable, and the user must manually place it — creation is never blocked purely by lack of GPS, and the "Use my location" action is hidden since there is no GPS fix to snap back to. Pin dragged outside the allowed radius → snapped back or blocked with a message ("Safety Doggy currently covers the Le Havre area only"). *(Auto/manual distinction and "Use my location" action added 2026-07-16 per explicit product decision.)*

**FR-7.3 — Duplicate detection**
- Actor: Logged-in user submitting a report.
- Trigger: An active report of the **same type** already exists within 50m of the selected position.
- Behavior: User is shown the existing report and asked to confirm before publishing a second one ("A similar report already exists nearby — publish anyway?").

**FR-7.4 — Duration**
- Actor: Logged-in user, mid-report-creation.
- Trigger: Type already selected.
- Behavior: Duration is displayed (read-only) as determined by type — never editable at creation.

**FR-7.5 — Anti-spam limit**
- Actor: Logged-in user.
- Trigger: Attempts to submit a 6th report within a rolling 60-minute window.
- Behavior: Blocked with a clear message stating the limit and roughly when they can report again.

**FR-7.6 — Submit success**
- Actor: Logged-in, email-confirmed user, valid form.
- Trigger: Taps submit.
- Behavior: Report published immediately, visible on the map in near real time (FR-2.4); user returned to the map centered on their new report.

**FR-7.7 — Submit failure**
- Actor: Logged-in user.
- Trigger: Network/backend failure during submission.
- Behavior: Clear retry option; form contents preserved, not lost on failure. *(New gap, resolved here.)*

**FR-7.8 — Suggest a new report type**
- Actor: Any logged-in user (or arguably any user — see edge case).
- Trigger: Taps "Suggest a new report type" link, present somewhere in or near the report creation flow.
- Behavior: Opens a pre-filled `mailto:` link to a project contact address. Purely client-side, no backend involved.
- Edge cases: Device has no email client configured → link fails silently in most OSes; acceptable for MVP given this is a low-traffic secondary path, but worth a fallback (e.g., show the email address as plain text too) at wireframe stage.

### 3.8 Editing, Extending, Deleting a Report

**FR-8.1 — "Edit" = extend only**
- Covered by FR-4.4. No other editable fields exist post-creation (see §2, decision 9).

**FR-8.2 — Delete own report**
- Actor: Report creator.
- Trigger: Taps "Delete" on their own report's detail card.
- Behavior: Confirmation prompt ("Delete this report? This can't be undone") then immediate removal from the map for all users.

**FR-8.3 — Automatic expiration**
- Actor: System (hourly cron job).
- Trigger: `expires_at` timestamp passes.
- Behavior: Report excluded from all future load queries; effectively invisible even before physical deletion/cleanup.

**FR-8.4 — Permanent report inactivity expiry**
- Actor: System.
- Trigger: A permanent report (`expires_at = NULL`) has had no creator edit/extend activity for 6 months.
- Behavior: Auto-expires exactly like a timed report (§2, decision 6).

### 3.9 Account / Profile / Report History

**FR-9.1 — View profile**
- Actor: Logged-in user.
- Trigger: Opens profile/account screen.
- Behavior: Shows email, nickname (editable), optional profile photo (editable), sign-up date, language preference, links to Terms/Privacy, logout, and account deletion.

**FR-9.1a — Optional profile photo**
- Actor: Logged-in user.
- Trigger: Taps the avatar/photo element on their own profile screen.
- Behavior: Can pick an image from the device gallery or camera to set as their profile photo, replace an existing one, or remove it entirely. Never requested or required at sign-up. Stored at account level in Supabase Storage; never shown publicly on reports or anywhere else outside the user's own profile — same anonymity rationale as the nickname (FR-9.2, spec §4.4).
- Edge cases: Upload failure (network/file-too-large) → clear inline error, previous photo (if any) unchanged. *(Added 2026-07-16 per explicit product decision.)*

**FR-9.2 — Nickname**
- Actor: Logged-in user, first login or later via profile.
- Trigger: First login (prompted) or manual edit later.
- Behavior: Optional; if left blank at signup, auto-generated (e.g., "Dog Walker" + a random number) so the field is never empty in the data model. Editable anytime from profile. Never shown publicly regardless (spec §4.4). *(Auto-generation format is a new gap, resolved here with a placeholder pattern — exact copy to be finalized in Step 2/3.)*

**FR-9.3 — Report history**
- Actor: Logged-in user.
- Trigger: Opens "My reports" from profile.
- Behavior: List of reports they've created, showing status (active / expired / deleted), type, and creation date.

**FR-9.4 — Empty report history**
- Actor: Logged-in user who has never created a report.
- Trigger: Opens "My reports" with zero history.
- Behavior: Empty state with a short prompt encouraging their first report, not a blank list. *(New gap, resolved here.)*

**FR-9.5 — Logout**
- Actor: Logged-in user.
- Trigger: Taps "Log out."
- Behavior: Session cleared, returned to the map in visitor mode (browsing remains available).

### 3.10 Account Deletion (GDPR)

**FR-10.1 — Self-service deletion**
- Actor: Logged-in user.
- Trigger: Taps "Delete my account" in profile.
- Behavior: Explicit confirmation step (re-enter password or a typed confirmation, to prevent accidental taps) before proceeding. On confirmation: `deleted_at` set, account disabled, user logged out immediately.

**FR-10.2 — Data handling on deletion**
- Behavior: Reports created by the account are anonymized (`user_id` → NULL) and retained; personal account data (email, nickname, profile photo) purged within 30 days.

**FR-10.3 — Full/immediate deletion on request**
- Actor: Any user (including one who can't access the app to self-delete).
- Trigger: Emails the contact address specified in the Terms.
- Behavior: Manual, immediate deletion handled by the project owners outside the app.

### 3.11 Legal Pages

**FR-11.1 — Terms of Use / Privacy Policy access**
- Actor: Any user.
- Trigger: Taps the relevant link from sign-up or profile.
- Behavior: Displays the document. French text is always present and authoritative; if UI language is English, an English convenience translation is shown alongside/above it, clearly labeled "Unofficial translation — the French version is legally binding" (§2, decision 5).

**FR-11.2 — Acceptance at sign-up**
- Actor: Visitor signing up.
- Trigger: Sign-up form.
- Behavior: Checkbox (unchecked by default, not pre-ticked) linking to both documents; sign-up blocked until checked.

### 3.12 Language Switching

**FR-12.1 — Manual language switch**
- Actor: Any user.
- Trigger: Changes language from a setting (in profile for logged-in users; needs an accessible equivalent for visitors too, since browsing doesn't require an account — exact placement decided in Step 2).
- Behavior: All UI strings update immediately; preference persisted locally (and, for logged-in users, ideally synced to their account so it follows them across devices — nice-to-have, not a hard MVP requirement).

**FR-12.2 — Default language logic**
- Covered by FR-1.1.

---

## 4. Additional Gaps Found & Defaults Applied (Summary)

These were not present in the audit doc; each was either escalated to you directly (already reflected in §2) or resolved here with a low-stakes default because it has no real trade-off worth your time. Listed together for visibility — override any of them if you disagree:

| Gap | Default applied | Where |
|---|---|---|
| No password-reset flow existed anywhere in the spec | Standard email-link reset flow added | FR-6.7 |
| Duplicate email / invalid password at signup had no defined error | Inline, specific error messages | FR-6.2 |
| Google Sign-In cancellation/failure undefined | Return to auth screen cleanly, no partial account | FR-6.5 |
| Disabled/moderated account had no login-time message | Explicit "account disabled" message with contact | FR-6.8 |
| Session expiry mid-action undefined | Preserve in-progress input where feasible, resume after re-login | FR-6.9 |
| Can a user flag their own report? | No — hidden on own reports (delete already covers it) | FR-4.2 |
| Report expiring while its detail card is open | Must not leave stale actionable buttons live | FR-4.5 (exact treatment deferred to Step 2) |
| Empty map view (zero reports) had no defined state | Render normally, no blocking overlay | FR-2.5 |
| Network failure loading the map had no defined state | Non-blocking banner + manual retry, no offline cache (offline is V2) | FR-2.6 |
| Submission failure (network) mid-report-creation | Preserve form contents, offer retry | FR-7.7 |
| Empty report history had no defined state | Encouraging empty state, not a blank list | FR-9.4 |
| Nickname auto-generation format unspecified | Placeholder pattern (e.g. "Dog Walker" + number), editable later | FR-9.2 |
| Where does a visitor (no account) change language? | Needs an accessible entry point outside the profile screen | FR-12.1 (placement decided in Step 2) |

---

## 5. Non-Functional Requirements (carried from spec, restated for completeness)

- Map loads in under 3 seconds on 4G.
- Sign-up → login → first report achievable in under 2 minutes end to end (now including the email-confirmation gate, FR-6.4 — worth watching in testing, since this adds a real step to that 2-minute budget compared to the original spec).
- Expiration enforced server-side (hourly cron), never purely client-side.
- Zero personal data exposed to unauthenticated requests.
- Minimum Android OS: 8.0 (API 26).
- GDPR compliance from day one (data minimization, right to access/erasure/portability — see spec §7.1, unchanged).
- Codebase i18n-ready from the start, now actively serving two languages (FR/EN) rather than just architected for future ones.

---

## 6. Out of Scope for MVP (unchanged from spec, restated for reference)

Free-text descriptions, publicly visible nicknames, proximity push notifications, walk history, user reputation, report photos, offline mode, iOS, monetization, full moderation dashboard/threshold-based flagging. All deferred to V2 per spec §3.1/§9.

---

## 7. Open Items

None remaining as of this draft — every item from the audit doc and every new gap found while writing this specification has either been resolved with your explicit input (§2) or flagged with a stated default you can override (§4). If anything below the surface still bothers you, now is the moment to raise it — Step 2 (UX Design) will treat everything above as settled.
