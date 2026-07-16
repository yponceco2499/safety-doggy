# Safety Doggy — Screen Specifications

| Item | Detail |
|---|---|
| Document version | 1.0 |
| Status | Draft — awaiting your confirmation before Step 3 (HTML prototype) |
| Companion document | `user-journeys-and-navigation.md` — how these screens connect |

**How to read this document:** one entry per screen/component from the navigation inventory. Each has a **Purpose**, **Key elements**, **States** (empty / loading / error / populated, where applicable to that screen), and a low-fidelity **wireframe** (text layout, mobile portrait, not to scale). Wireframes are structural only — no colors, fonts, or spacing decisions; that's Step 3.

---

## S1 — Splash

**Purpose:** Bridge the moment between tapping the app icon and the Map being ready.

**Key elements:** App logo/name, nothing interactive.

**States:** Single transient state, auto-advances to S2 once the app is initialized (or to permission prompts if this is first launch, per FR-1.1/1.2).

```
┌───────────────────────────┐
│                           │
│                           │
│         🐾                │
│     Safety Doggy          │
│                           │
│                           │
└───────────────────────────┘
```

---

## S2 — Map (Home)

**Purpose:** The app's root and primary screen — browse active reports, launch every other flow.

**Key elements:**
- Full-bleed map (OpenStreetMap tiles), centered per FR-2.1/2.2.
- Filter icon (top-left).
- Language icon + Account icon (top-right, grouped).
- Report FAB (bottom-right, most visually prominent element on screen).
- Color-coded, icon-differentiated markers for active reports.
- Location-unavailable banner (conditional, FR-1.3).
- Network-error banner (conditional, FR-2.6 / E1).

**States:**
- **Loading:** map tiles + report data still fetching — show map skeleton/spinner, not a blank white screen.
- **Populated:** markers rendered per current filter.
- **Empty (FR-2.5):** map renders normally with zero markers in view — no overlay, no "nothing here" message blocking the map itself.
- **Error (FR-2.6):** map (tiles) still shown; inline banner "Can't load reports — check your connection" + Retry, dismissible.
- **Location unavailable (FR-1.3):** small persistent banner/icon "Location unavailable — tap to enable," non-blocking.

```
┌───────────────────────────┐
│ [≡ Filter]      [🌐][👤]  │
│                           │
│        🔴                │
│              🔵           │
│   🟢                      │
│         📍(you)           │
│                           │
│  ⚠ Can't load reports     │
│    [Retry]                │
│                           │
│                     ( + ) │ <- Report FAB
└───────────────────────────┘
```

---

## C1 — Category Filter (bottom sheet)

**Purpose:** Let any user narrow which report types show on the map.

**Key elements:** List/grid of report types grouped under "Hazards" and "Positive points," each with icon + label + toggle. "Select all" / "Clear" shortcuts. Applies live (FR-3.2).

**States:** Populated only (static list) — no loading/error, since it operates on already-known report types, not live data.

```
┌───────────────────────────┐
│  ⚠ Hazards                │
│  [🔴] Active hunting   ✓  │
│  [🔴] Caterpillars     ✓  │
│  [🟠] Stray animal     ✓  │
│  [🟠] Foxtail spot     ✓  │
│  [🔴] Dangerous bait   ✓  │
│  [🟠] Blocked road     ✓  │
│                           │
│  ✅ Positive points       │
│  [🟢] Shaded path      ✓  │
│  [🔵] Off-leash area   ✓  │
│  [🔵] Water point      ✓  │
│  [🔵] Dog-friendly     ✓  │
│                           │
│  [Clear all] [Select all] │
└───────────────────────────┘
```

---

## C2 — Report Detail (bottom sheet)

**Purpose:** Show a single report's information and, if applicable, the actions the current user is allowed to take on it (FR-4.1–4.5).

**Key elements:** Icon + type name, "Reported [date/time]," remaining duration ("Active for another ~3h" / "Permanent"), and a conditional action row.

**States:**
- **Visitor viewing:** detail only, no action row.
- **Registered, not the creator:** detail + "Flag as incorrect" button.
- **Registered, is the creator:** detail + "Extend duration" (hidden if permanent or already expired) + "Delete."
- **Flag just submitted:** "Flag as incorrect" replaced by a disabled "Flagged — thanks" label (FR-5.1).
- **Extend just submitted:** remaining-duration text updates in place, brief toast "Duration extended."
- **Expired while open (FR-4.5):** action row disabled/hidden, replaced by "This report has expired."

```
┌───────────────────────────┐
│           ▔▔▔              │  <- drag handle
│  🟠  Stray / loose animal  │
│  Reported today at 14:20   │
│  Active for another ~18h   │
│                           │
│  [ Extend duration ]      │
│  [ Delete ]               │
└───────────────────────────┘
```

---

## G1 — Language Switcher (bottom sheet)

**Purpose:** Switch UI language, reachable from the map (all users) or Profile (logged-in users).

**Key elements:** Two options, French / English, current selection marked.

**States:** Populated only.

```
┌───────────────────────────┐
│  Language / Langue        │
│                           │
│  ( ) Français              │
│  (•) English               │
└───────────────────────────┘
```

---

## S3 — Auth Landing

**Purpose:** Single entry point into authentication, reached whenever a visitor needs an account (report attempt, or tapping the account icon).

**Key elements:** One-line framing text ("An account keeps reports accountable"), "Continue with Google" button, "Sign up with email" button, "Log in" link/button for existing users, age (16+) checkbox, Terms/Privacy acceptance checkbox with inline links — both checkboxes gate both sign-up buttons (per the design decision in the journeys doc §4).

**States:**
- **Default:** both checkboxes unchecked, sign-up actions disabled.
- **Gates satisfied:** sign-up actions enabled.
- **Existing user path:** "Log in" is always enabled regardless of checkboxes (checkboxes only gate account *creation*).

```
┌───────────────────────────┐
│  An account keeps reports │
│  accountable.              │
│                           │
│  [ ] I'm 16 or older       │
│  [ ] I accept the Terms    │
│      of Use & Privacy      │
│      Policy                │
│                           │
│  [ Continue with Google ] │
│  [ Sign up with email  ]  │
│                           │
│  Already have an account? │
│  [ Log in ]                │
└───────────────────────────┘
```

---

## S4 — Sign Up (Email)

**Purpose:** Create an email/password account.

**Key elements:** Email field, password field (with visibility toggle), Submit button. Age/Terms gates already satisfied on S3, not repeated here.

**States:**
- **Default/populated:** empty form.
- **Validation error:** inline, field-level (e.g., "Enter a valid email," "Password too short").
- **Submit error — email in use (FR-6.2):** inline error with a "Log in instead" link to S5.
- **Submit error — network:** banner + retry, form contents preserved.
- **Submitting:** button shows a loading state, disabled to prevent double-submit.

```
┌───────────────────────────┐
│  Sign up                  │
│                           │
│  Email                    │
│  [______________________] │
│                           │
│  Password                 │
│  [______________________] │
│                           │
│  This email is already    │
│  registered. [Log in]     │
│                           │
│  [       Sign up        ] │
└───────────────────────────┘
```

---

## S4b — Nickname Prompt

**Purpose:** One-time optional nickname capture right after first successful sign-up/login (FR-9.2).

**Key elements:** Explanation that the nickname is private (never shown publicly), text field, "Skip" and "Save" — both proceed to the Map.

**States:** Populated only; no validation beyond basic length/character limits.

```
┌───────────────────────────┐
│  What should we call you?  │
│  (Only visible to you)     │
│                           │
│  [______________________] │
│                           │
│  [ Skip ]     [  Save  ]  │
└───────────────────────────┘
```

---

## S5 — Login (Email)

**Purpose:** Authenticate a returning email/password user.

**Key elements:** Email field, password field, "Forgot password?" link, Submit button, link back to sign-up.

**States:**
- **Default:** empty form.
- **Error — wrong credentials (FR-6.6):** generic "Incorrect email or password."
- **Error — disabled account (FR-6.8):** "Your account has been disabled — contact [support email]."
- **Resuming an interrupted action (FR-6.9):** small contextual note, e.g., "Log in to finish your report."

```
┌───────────────────────────┐
│  Log in                   │
│  (Log in to finish your    │
│   report)                  │
│                           │
│  Email                    │
│  [______________________] │
│  Password                 │
│  [______________________] │
│  Forgot password?          │
│                           │
│  [        Log in        ] │
└───────────────────────────┘
```

---

## S6 — Forgot Password

**Purpose:** Self-service password reset (FR-6.7).

**Key elements:** Email field, Submit ("Send reset link").

**States:**
- **Default:** empty form.
- **Sent:** confirmation message ("If that email exists, a reset link has been sent") — deliberately non-committal about whether the account exists, standard security practice.

```
┌───────────────────────────┐
│  Reset your password       │
│                           │
│  Email                    │
│  [______________________] │
│                           │
│  [   Send reset link    ] │
└───────────────────────────┘
```

---

## S7 — Email Confirmation Pending

**Purpose:** Block reporting (not browsing) until an email/password account's email is confirmed (FR-6.4).

**Key elements:** Explanation, "Resend confirmation email" action, way back to the Map (browsing still allowed).

**States:**
- **Default:** waiting.
- **Resent:** brief confirmation ("Email sent").
- **Confirmed (detected on return to app):** auto-advances to the originally intended screen (e.g., S8) rather than stranding the user here.

```
┌───────────────────────────┐
│  Confirm your email        │
│                           │
│  We sent a confirmation    │
│  link to you@example.com   │
│                           │
│  [ Resend email ]          │
│  [ Back to map ]           │
└───────────────────────────┘
```

---

## S8 — Report Creation

**Purpose:** The core contribution flow — type, position, duration, submit, in a single screen (per the "3 taps or fewer" design decision).

**Key elements:** Icon grid of report types (grouped hazard/positive), mini-map with a pin **auto-placed from GPS by default**, draggable as a secondary manual override, plus a "Use my location" action to snap back to the GPS position; read-only duration label (updates once a type is picked), Submit button, small "Suggest a new report type" link (X1, mailto).

**States:**
- **Default:** no type selected yet, Submit disabled. Pin already auto-placed at the GPS position if available (FR-7.2) — this happens before type selection.
- **Type selected:** duration label populates, mini-map pin remains active and draggable.
- **GPS position (default):** label reads "Position detected automatically"; "Use my location" hidden (nothing to reset to).
- **Manually adjusted:** label reads "Position manually adjusted"; "Use my location" appears, tap to snap the pin back to the GPS position.
- **GPS unavailable:** pin falls back to the last-known map center; label warns location is unavailable and the user must place the pin manually; "Use my location" stays hidden.
- **Pin dragged outside launch area (FR-7.2):** pin snaps back or Submit blocked with "Safety Doggy currently covers the Le Havre area only."
- **Anti-spam blocked (FR-7.5):** Submit disabled, inline message with retry time.
- **Submitting:** Submit shows loading state.
- **Submit error — network (FR-7.7):** banner + retry, all selections preserved.
- **Submit error — duplicate found:** see M2 below.

```
┌───────────────────────────┐
│  New report                │
│                           │
│  ⚠ Hazards                │
│  [🔴][🔴][🟠][🟠][🔴][🟠] │
│  ✅ Positive               │
│  [🟢][🔵][🔵][🔵]         │
│                           │
│  Selected: Stray animal    │
│  Duration: 24 hours        │
│                           │
│  [   mini-map + pin    ]  │
│                           │
│  Suggest a new type →      │
│                           │
│  [       Submit         ] │
└───────────────────────────┘
```

---

## M2 — Duplicate Confirmation (modal)

**Purpose:** Prevent accidental duplicate reports within 50m of the same type (FR-7.3).

**Key elements:** Short explanation, reference to the existing report (type + how long ago), "Publish anyway" and "Cancel" actions.

```
┌───────────────────────────┐
│  A similar report already  │
│  exists nearby             │
│  (Stray animal, 20 min ago)│
│                           │
│  [ Cancel ] [Publish anyway]│
└───────────────────────────┘
```

---

## T1 — Report Created (toast)

**Purpose:** Confirm success without blocking, then return to the map (FR-7.6).

```
┌───────────────────────────┐
│  ✓ Report published        │
└───────────────────────────┘
```

---

## S9 — Profile / Account

**Purpose:** Central hub for a logged-in user's account-level actions.

**Key elements:** Optional profile photo/avatar (tap to add/change/remove — FR-9.1a), email (read-only), nickname (editable inline, S10), sign-up date, language row (opens G1), links to Terms/Privacy (S12/S13), "My reports" (S11), "Log out," "Delete my account."

**States:**
- **No photo set:** placeholder avatar (e.g., initial or paw icon) with a subtle "Add photo" affordance.
- **Photo set:** photo displayed, tap opens change/remove options.
- **Uploading:** brief loading state on the avatar.
- **Upload error:** inline error, previous photo (or placeholder) unchanged.
- Otherwise populated only — no empty/loading/error states beyond the avatar itself.

```
┌───────────────────────────┐
│  Profile                  │
│                           │
│      ( 📷 photo )         │  <- tap to add/change
│                           │
│  you@example.com          │
│  Nickname: Dog Walker 42   │
│  Member since Jan 2026     │
│  Language: English  >      │
│                           │
│  My reports          >    │
│  Terms of Use         >    │
│  Privacy Policy       >    │
│                           │
│  [ Log out ]               │
│  [ Delete my account ]     │
└───────────────────────────┘
```

---

## S10 — Edit Nickname (inline within Profile)

**Purpose:** Change the account-level nickname (never shown publicly).

```
┌───────────────────────────┐
│  Nickname                  │
│  [______________________] │
│  [ Cancel ]     [ Save ]  │
└───────────────────────────┘
```

---

## S11 — Report History

**Purpose:** A user's own reports, with status.

**Key elements:** List, each row: type icon, status (Active / Expired / Deleted), date. Tapping an active report opens C2.

**States:**
- **Populated:** list of past/current reports.
- **Empty (FR-9.4):** encouraging message + shortcut to Report Creation, not a blank list.

```
Populated:                   Empty:
┌───────────────────────────┐ ┌───────────────────────────┐
│  My reports                │ │  My reports                │
│                           │ │                           │
│  🟠 Stray animal  Active   │ │  No reports yet.           │
│     2h ago                 │ │  Spotted something on your │
│  🔵 Water point   Active   │ │  walk?                     │
│     3 days ago             │ │  [ Create your first       │
│  🔴 Hunting       Expired  │ │    report ]                │
│     1 week ago             │ │                           │
└───────────────────────────┘ └───────────────────────────┘
```

---

## M3 — Delete Report Confirmation (modal)

```
┌───────────────────────────┐
│  Delete this report?       │
│  This can't be undone.     │
│                           │
│  [ Cancel ]   [ Delete ]  │
└───────────────────────────┘
```

---

## M4 — Delete Account Confirmation (modal)

**Key elements:** Explanation of consequences (personal data purged within 30 days, reports anonymized and kept), re-authentication (password re-entry for email accounts, typed "DELETE" confirmation for Google accounts), confirm/cancel.

```
┌───────────────────────────┐
│  Delete your account?      │
│  Your reports stay on the  │
│  map, anonymized. Your     │
│  personal data is purged   │
│  within 30 days.           │
│                           │
│  Password: [___________]  │
│                           │
│  [ Cancel ]   [ Delete ]  │
└───────────────────────────┘
```

---

## S12 — Terms of Use / S13 — Privacy Policy

**Purpose:** Legal documents, French text authoritative, English convenience translation shown when UI language is English (per Step 1 §2, decision 5).

**Key elements:** Document title, body text, and — only in English UI mode — a labeled banner above the English text: "Unofficial translation — the French version is legally binding," with a toggle/link to view the French original.

```
┌───────────────────────────┐
│  Terms of Use              │
│  ⓘ Unofficial translation. │
│    French version is       │
│    binding. [View French]  │
│                           │
│  1. Introduction...        │
│  2. ...                    │
└───────────────────────────┘
```

---

## X1 — Suggest a Report Type

**Purpose:** Not a screen — a `mailto:` link from S8 that opens the device's email client pre-addressed to the project contact (FR-7.8). No fallback UI beyond showing the plain email address as text near the link, in case no email client is configured.

---

## Reusable Components

**E1 — Network error banner** (used on S2): inline, dismissible, "Can't load reports — check your connection" + Retry.

**E2 — Retry error banner** (used on S4/S8, or wherever a form submission can fail): inline, "Something went wrong — try again" + Retry, never clears form contents.

---

## Open Items

None. This document and `user-journeys-and-navigation.md` together resolve every screen-level ambiguity found; nothing here should require a follow-up question before Step 3.
