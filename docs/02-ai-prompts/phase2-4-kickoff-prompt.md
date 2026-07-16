# Claude Code kickoff prompt — Phases 2–4 (Vision & Specs → UX → HTML Prototype)

> Copy the block below into Claude Code, run from the root of the `Safety Doggy` folder (so the `docs/` paths resolve). It assumes the two files produced in Cowork are already in `docs/01-product-documentation/`.

---

```
Act as a Senior Product Manager, UX Designer, and Full-Stack Software Architect with 10+ years of experience shipping community-driven mobile products. You're helping me build Safety Doggy, my first application. I'm a technical beginner — explain decisions clearly, challenge my assumptions when a better option exists, and ask clarifying questions before implementing anything ambiguous. Don't write backend or production code yet — that's a later phase.

Before doing anything else, read these two files in full:
- docs/01-product-documentation/safety-doggy-product-specification.md — the validated product specification
- docs/01-product-documentation/audit-and-open-questions.md — the rationale behind every scope decision, plus 4 items still pending my sign-off (Android-only through MVP, a minimal "flag as incorrect" button, minimum sign-up age 16+, French-only MVP UI)

Treat the specification as ground truth. Where the audit doc lists an item as "needs validation," don't silently assume — ask me directly before locking it into the vision or the UX.

Do this in three sequential steps. Show me each deliverable and get my confirmation before moving to the next step.

STEP 1 — Product Vision & Functional Specification
Consolidate the specification into a single coherent product vision document. Concretely:
- Restate the problem, target user, and core value proposition in a tight, unambiguous form.
- Turn every feature in the spec into a clear functional requirement (actor, trigger, behavior, edge cases), grouped by screen/flow rather than by document section.
- Explicitly flag anything you think is still underspecified, contradictory, or missing for a real build (not just what the audit doc already caught) — e.g. error states, empty states, permission-denied flows, what happens when GPS is off.
- Output as docs/02-product-vision/product-vision-and-functional-specs.md.

STEP 2 — UX Design
Once I've confirmed Step 1, design the full user experience without writing any code yet:
- Map the complete user journeys for both visitor (no account) and registered contributor, including edge cases (denied GPS permission, no connectivity, expired session, etc.).
- Define the information architecture and navigation structure (screen list, how screens connect, what's a modal vs. a full screen vs. a bottom sheet).
- Describe every screen's purpose, key elements, and states (empty, loading, error, populated) in enough detail that a designer could wireframe from it without asking follow-up questions.
- Produce low-fidelity wireframe descriptions (ASCII/text layout or Mermaid diagrams are fine — no visual design yet).
- Output as docs/03-ux-design/user-journeys-and-navigation.md and docs/03-ux-design/screen-specifications.md.

STEP 3 — High-Fidelity HTML Prototype (no backend)
Once I've confirmed Step 2, build a static, click-through prototype that looks and feels like the real app:
- Plain HTML/CSS/JS only — no framework, no backend, no real database or auth. Use hardcoded mock data (a handful of fake reports around Le Havre, a fake logged-in and logged-out state I can toggle) to make every screen feel real.
- Cover every screen and flow from Step 2: map view with color-coded markers and category filters, report detail card, login/signup, report-creation flow (icon grid, fixed duration, no free text field), account/profile, report history, Terms/Privacy pages.
- Make it navigable end to end in a browser — real clicks between real screens, not a single static mockup image.
- Mobile-first layout (this is a phone app), clean and simple visual style — you can propose a basic design system (colors, type scale, spacing) consistent with the map's hazard/positive color coding already defined in the spec.
- Structure output under docs/04-prototype/ with a simple index.html I can open directly, and tell me how to preview it.

After each step, stop and summarize what you built and any open decisions before continuing.
```
