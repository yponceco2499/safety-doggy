# Safety Doggy — Documentation Audit & Open Questions

**Purpose:** This document records every ambiguity, inline doubt, inconsistency, and gap found while converting the original source document into `safety-doggy-product-specification.md`. For each item: what was found, the recommendation applied in the clean spec, and its validation status.

Status key:
- **Applied** — recommendation has been written into the clean specification. Reversible if you disagree.
- **Needs your validation** — a judgment call with real trade-offs (legal, budget, or product-strategy weight) that you should explicitly confirm, even though a default has been applied.

---

## 1. Naming

| Item | Finding | Resolution |
|---|---|---|
| Product name | Source document is titled and branded "PawMap" throughout (cover, footer, AI-prompt section). Project is named "Safety Doggy." | **Applied** — all references renamed to Safety Doggy. "PawMap" preserved only in the archived original for traceability. |

---

## 2. Author's inline doubts (originally embedded as comments in the source text)

### 2.1 Should anonymous (no-account) users be able to contribute too?
**Source:** §1.3 — "shouldn't people not be passive... maybe account users could have history and other advanced features."
**Finding:** This doubt is actually already resolved elsewhere in the same document (§2.2, §4.4, §6.1): reporting requires an account; account holders get history as a benefit. The aside reads as the author thinking out loud, not a contradiction.
**Recommendation:** Keep reporting gated behind an account. This is the standard trust/accountability mechanism for community safety data (Waze does the same) — anonymous reporting would remove any way to rate-limit abuse, resolve disputes, or hold contributors accountable for false hazard reports.
**Status: Applied** (no change to scope; documented explicitly in the clean spec so it reads as a decision, not an open thread).

### 2.2 Android-only at launch — does excluding iPhone hurt adoption?
**Source:** §2.1 — "not including iPhone could hurt us a lot?"
**Finding:** This creates friction with §5.6, where the same author later says they'd be "fine investing now" in the Apple Developer Program, ahead of the V2 plan. That's a real contradiction against the document's own non-negotiable constraint: *zero budget, Android priority, MVP only*.
**Recommendation:** Keep MVP strictly Android-only. Rationale: (1) the target launch audience is a specific local community (Le Havre) where reach outside that group doesn't matter yet; (2) validating the product with zero iOS investment is the entire point of an MVP; (3) paying for Apple Developer enrollment before you know if anyone wants the app is spending against an unproven hypothesis. Revisit iOS as soon as the V2 go/no-go criteria (§8.3) are met — not before.
**Status: Needs your validation** — this is a budget/timing call, not just a documentation fix. Confirm you're comfortable holding the line on Android-only until MVP validation.

### 2.3 "Aggressive dog reported" category — legal/reputational risk
**Source:** §4.2 — "maybe rather 'stray dog/animal' — owners of aggressive dogs might react badly to being identified."
**Finding:** Real risk: a public, geolocated, timestamped report labeling a specific animal "aggressive" is close to making a defamatory claim about a specific owner, with no verification step in the MVP. This is a legal exposure gap, not just a UX one.
**Recommendation:** Rename the category to **"Stray / loose animal"** and add an explicit content rule: reports must describe the hazard and location only — no owner names, no identifying description of a specific animal (breed/color used to point at "that one dog" is still identifying). This is now written into the clean spec as a hard content-moderation rule, not just a naming tweak.
**Status: Applied**, recommend legal read-through before launch given it touches liability.

### 2.4 "Pleasant view" category — low value
**Source:** §4.2 — "not useful, I think."
**Finding:** Agree — of the five positive categories, this is the only one with no safety or practical-utility angle (it's subjective and doesn't help a decision about where to walk the dog).
**Recommendation:** Drop it from the MVP category list. Keep: tree-lined/shaded path, off-leash area, water point, dog-friendly place.
**Status: Applied.**

### 2.5 Account-creation banner on first "Report" tap — adds friction
**Source:** §4.3 — "I worry this will discourage people who are 'too lazy to create an account.'"
**Finding:** Valid UX concern. A banner or interstitial that fires reactively (before the user has even tried to act) adds a step that isn't necessary — the user will hit the login wall anyway the moment they try to submit.
**Recommendation:** Remove the proactive banner. Let anonymous users browse completely uninterrupted. Only surface the "create an account to report" prompt at the point the user actually taps "Report" and would otherwise hit a dead end — i.e., make the login/signup screen itself the prompt, with a one-line explanation of why an account is needed (accountability for the community, not paywall).
**Status: Applied.**

### 2.6 Displaying nickname on reports — risk of chilling contributions
**Source:** §4.4 — "if we get a lot of reports, I worry names will clutter reports, and people will hesitate to report if their identity is attached."
**Finding:** Agree — this directly conflicts with the goal of maximizing contribution volume. Identity attached to a hazard report (especially anything touching another owner's dog, see 2.3) increases the contributor's perceived risk for no product benefit at MVP stage.
**Recommendation:** Reports are displayed **anonymously by default** in the MVP — no nickname shown on markers or report detail cards. The nickname field still exists at the account level (useful later for reputation/history features in V2) but is not surfaced publicly next to report content.
**Status: Applied.**

### 2.7 Free-text description — clutter and moderation risk
**Source:** §4.5 — "too much detail might clutter reports; maybe just icons, and users could message moderators to request new categories."
**Finding:** Agree with the underlying instinct. A free-text field is also the single biggest content-moderation and legal-risk surface in the whole app (harassment, defamation, spam, links) for a two-person team with no moderation tooling in the MVP.
**Recommendation:** **Remove the free-text description field from the MVP entirely.** Reports are category/icon-only. Add a lightweight "Suggest a new report type" contact link (mailto, reviewed by you) so users can request categories or icons that don't exist yet — this is cheap to build and channels the same need without an open text box in the wild. The `description` column can stay in the data model (nullable, unused for now) so this isn't a hard technical wall if you change your mind later.
**Status: Applied** — this is a meaningful scope reduction from the original document, flag if you want it back.

### 2.8 User-editable report duration — abuse potential
**Source:** §4.5 — "maybe we should pre-set the duration ourselves so there's no room for abuse."
**Finding:** Agree. A user-editable duration on top of no free text and no moderation tooling is an easy way for a report to overstay its accuracy (e.g., marking a "hunting" hazard active for a self-chosen week).
**Recommendation:** Duration is **fixed per report type**, not user-editable at creation. The existing "extend from the report's own detail card" feature is kept (so a genuinely still-valid report can be renewed by its creator without being able to invent an arbitrary duration up front).
**Status: Applied.**

### 2.9 Anti-spam limit (5 reports/hour/account)
**Source:** §4.5, added directly by the author as a firm rule, not a doubt.
**Finding:** No ambiguity — this was already a decision.
**Status: Applied as-is**, carried into the clean spec as a locked requirement.

### 2.10 Apple Developer Program — invest now vs. V2
**Source:** §5.6 — "if needed, I'm fine investing now — I think a lot of people have iPhones."
**Finding:** Same underlying tension as 2.2. Duplicated concern, one resolution.
**Recommendation:** See 2.2 — hold at V2, gated by the go/no-go criteria in §8.3.
**Status: Needs your validation** (same item as 2.2).

### 2.11 Duplicate-report handling within 50m
**Source:** §4.1, added directly by the author as a firm rule.
**Finding:** No ambiguity — a decision, not a question.
**Status: Applied as-is.**

### 2.12 Moderation flagging — removal after 5 flags, moderators see who flagged
**Source:** §9.2 (V2), added directly by the author as a firm rule.
**Finding:** No ambiguity — a decision, not a question. Worth noting this pairs well with item 2.3 (the aggressive-dog category being a legal risk) — see the new item below about pulling a minimal version of this into the MVP.
**Status: Applied as-is, in V2 scope.**

### 2.13 Optional photo on a report (V2 reputation feature)
**Source:** §9.2 (V2), added directly by the author.
**Finding:** No ambiguity — a decision, not a question.
**Status: Applied as-is, in V2 scope.**

---

## 3. Additional inconsistencies and gaps found during the audit (not flagged by the author, found independently)

### 3.1 "Zero budget" claim vs. one-time store fees
**Finding:** §5.1 states "no dedicated budget... free/open-source only," but §5.2 and §7.3 both list a mandatory one-time $25 Google Play developer fee, and §9.1 lists a $99/year Apple fee for V2.
**Recommendation:** Reword the constraint to: *"Zero recurring service budget — all cloud/backend/API services must run on free tiers. One-time platform registration fees (Google Play: $25) are accepted as unavoidable costs of distribution."* This removes the apparent contradiction without changing anything you're actually planning to spend.
**Status: Applied.**

### 3.2 No basic abuse-reporting mechanism in the MVP
**Finding:** The MVP has rate-limiting (2.9) and duplicate-detection (2.11), but zero mechanism for a user to flag a report as false or malicious — "Report as incorrect" is V2-only (§9.2). Combined with the aggressive-dog category risk (2.3) and no free text (2.7), a malicious or wrong report about a specific location has no correction path except contacting you directly, for the entire MVP period.
**Recommendation:** Pull a **minimal version** of "flag as incorrect" into the MVP: a single button on any report's detail card, no threshold logic, no auto-deactivation — it just emails/logs a flag to you for manual review via the Supabase dashboard. This is a small addition (no new screens, no moderation dashboard) that closes a real gap given you have no other moderation tooling until V2.
**Status: Needs your validation** — this is a scope addition to the MVP (§3.1 table), not just a doc cleanup, so I've marked it as **proposed** in the clean spec rather than silently adding it to the "included" column.

### 3.3 Age target is ambiguous
**Finding:** §7.3 says "13+ minimum, 18+ recommended" — two different numbers with no decision between them, for an app whose content (hazard reports, potentially about people's pets) is more sensitive than typical 13+ fare.
**Recommendation:** Set minimum age at **16+** at sign-up (above France's GDPR digital-consent threshold of 15, and appropriate given the app lets users publish public, geolocated content about real-world incidents).
**Status: Needs your validation** — set a firm number before the Play Store "Data Safety" / age-rating forms are filled in; treat this as a compliance decision, not a UX preference.

### 3.4 No minimum Android OS version specified
**Finding:** Not mentioned anywhere in the source.
**Recommendation:** Default to Android 8.0 (API 26) as the floor — current Expo/React Native defaults support this comfortably and it covers effectively all active Android devices in France as of 2026.
**Status: Applied** (default, low-stakes — revisit only if you have a specific reason to support older devices).

### 3.5 App/legal-document language not explicitly decided
**Finding:** §7.2 mandates the Terms/Privacy Policy be in French, but nothing states whether the app UI itself is French-only, despite the project now carrying an English name ("Safety Doggy").
**Recommendation:** MVP UI and legal documents in **French only** (matches the Le Havre launch market); keep the codebase i18n-ready (no hardcoded strings) so English can be added later without rework. The English product name is fine to keep regardless — plenty of apps used in France carry English names (Uber, Deliveroo, etc.).
**Status: Needs your validation** — confirm French-only MVP UI is intended.

### 3.6 Data retention timeline — clarified, not contradictory
**Finding:** §6.3 (soft-delete, reports anonymized and kept) and §7.1 (personal data deleted within 30 days of account closure) read as slightly at odds until you separate "personal account data" from "report content." They're actually compatible.
**Recommendation:** Spec now states explicitly: account/personal data (email, nickname) is purged within 30 days of closure; report content is retained indefinitely in anonymized form for community value. No functional change, just removed the ambiguity.
**Status: Applied.**

---

## 4. Summary — items requiring your explicit decision

1. **Android-only through MVP, defer all iOS/Apple spend to V2** (2.2 / 2.10) — recommended: yes, hold the line.
2. **Add a minimal "flag as incorrect" button to the MVP scope** (3.2) — recommended: yes, add it.
3. **Minimum sign-up age: 16+** (3.3) — recommended: yes, lock this number in.
4. **MVP UI and legal docs in French only, codebase i18n-ready** (3.5) — recommended: yes.

Everything else in this document has already been applied to `safety-doggy-product-specification.md`. Reply with any of these you want changed and I'll update the spec.
