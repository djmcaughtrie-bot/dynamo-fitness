# FitTrack Porting Plan

Ordered migration from the existing FitTrack React app to the new design language. One PR per step, Vercel preview URL for visual QA against the matching `design/*.html` specimen.

Each step is independently shippable. Don't start a step until the previous one is merged.

---

## Phase 0 — Foundations

### Step 0.1 · Install fonts

- Add Barlow Condensed (700, 800, 900, 900 italic), Geist (400, 500, 600, 700), Geist Mono (400, 500, 600) to `index.html` via Google Fonts preconnect + `<link>`.
- **Acceptance:** Fonts load on first paint; no FOUT visible on refresh.

### Step 0.2 · Apply Tailwind config

- Merge the `tailwind.config.js` block from `@docs/design-system.md` § 1.2.
- Verify existing screens still compile (no colour/class conflicts).
- **Acceptance:** `bg-accent`, `text-fg-dim`, `rounded-xl`, `font-display` all resolve.

### Step 0.3 · Global styles

- Set `body` background to `bg-bg`, default text to `text-fg`, default font to `font-sans`.
- Add the noise overlay `body::before` (see `@docs/design-system.md` § 1.7).
- Enable `font-feature-settings: "ss01", "tnum"` globally.
- **Acceptance:** App frame looks the part before any component work.

---

## Phase 1 — Primitives

Build these as standalone, storybook-free components in `src/components/primitives/`. Each has its own file, default export, TypeScript props.

### Step 1.1 · `<Button />`

Variants: `primary`, `secondary`, `cta` (full-width), `icon`.
- **Acceptance:** All 4 variants render as in `design/10-design-system.html` §2.1. Keyboard focus ring uses `ring-accent`.

### Step 1.2 · `<Chip />`

Props: `active`, `count?`, `onClick`. Pill variant by default.
- **Acceptance:** Filter row from `design/03-programmes.html` reproduces 1:1.

### Step 1.3 · `<Card />`

Variants: `base`, `accent` (with left bar + radial gradient), `attention` (for AI-suggested content).
- **Acceptance:** Renders as `design/10-design-system.html` § Cards.

### Step 1.4 · `<Eyebrow />` · `<SectionHeader />` · `<PageHead />`

Three layout primitives used on every screen.
- `<PageHead eyebrow="Stats · Apr 2026" title="The" accent="receipts." sub="..." />`
- **Acceptance:** All three render identically across Today, Programmes, and Stats.

### Step 1.5 · `<StatusChip />` · `<Toggle />` · `<ProgressBar />`

Small stateful primitives.
- **Acceptance:** Pulse animation on status chip runs at 1.8s infinite loop; toggle slides smoothly.

### Step 1.6 · `<Scale />` · `<Stepper />`

Form primitives for readiness logging and workout entry.
- **Acceptance:** Stepper respects 2.5kg weight increments; scale updates active/filled states correctly.

### Step 1.7 · `<KPICell />`

Data display primitive with label / value / delta rhythm.
- **Acceptance:** `tnum` feature applied; digits don't jitter on value change.

### Step 1.8 · `<BottomNav />`

5-destination nav with AI FAB. Accepts `activeRoute` prop.
- **Acceptance:** Blurred glass backdrop; active state flips icon to accent; FAB has subtle glow + pulse ring.

---

## Phase 2 — Data viz

Build once, reuse everywhere.

### Step 2.1 · `<Sparkline />`

Props: `data: number[]`, `glow?: boolean`. SVG-based, no recharts.
- **Acceptance:** Renders top lifts cards in `design/04-stats.html` exactly.

### Step 2.2 · `<AdherenceHeatmap />`

Props: `weeks: number`, `data: number[][]` (0–4 intensity).
- **Acceptance:** Matches Stats screen heatmap; horizontal scroll works on mobile.

### Step 2.3 · `<BarWithTarget />`

Used for muscle balance and trigger correlation.
- **Acceptance:** Under-target bars flip to `--orange`; target marker sits at correct position.

### Step 2.4 · `<AreaChart />`

Used for volume trend. Supports dual-period comparison (current solid, previous ghosted dashed).
- **Acceptance:** Matches Stats volume chart, including callout label on latest point.

---

## Phase 3 — Screens

Port in this order. Keep existing routes intact; stage each new screen behind a feature flag `NEXT_PUBLIC_V2=true` until all are done, then flip globally.

### Step 3.1 · Today screen → `design/01-today.html`

The anchor screen. Uses nearly every primitive.
- **Acceptance:** Streak counter animates up; bars in week chart stagger in; bottom nav renders.

### Step 3.2 · Active workout → `design/02-active-workout.html`

Live rest timer with ticking countdown.
- **Acceptance:** Timer counts down with real JS interval; colour shifts to `--orange` at ≤10s; −15s/+15s/Skip buttons work.

### Step 3.3 · Programme catalog → `design/03-programmes.html`

17 programme rows with bespoke SVG thumbnails. Filter chips.
- **Acceptance:** All 17 thumbnails render; filter chips update visible programmes (even if logic is faked for now).

### Step 3.4 · Stats deep-dive → `design/04-stats.html`

Heaviest screen. Uses every viz primitive.
- **Acceptance:** Volume chart, heatmap, sparklines, muscle bars, PR list, golf section all render; period selector switches (even if faked).

### Step 3.5 · Onboarding → `design/05-onboarding.html`

10-screen multi-step flow. Use React state or a small state machine lib (XState if already in the project).
- **Acceptance:** Back button works; "Calibrating" screen cycles messages before revealing summary; name persists into summary title.

---

## Phase 4 — Adaptive Mode

The condition-aware layer. Treat this as a set of features, not extra screens — they slot into existing surfaces.

### Step 4.1 · Morning check-in → `design/07-checkin.html`

4-step daily flow (Energy → Sleep → Joints → Triggers).
- Trigger screen only shown if a *newly flagged* joint appears vs. yesterday's reading.
- Persist to local store (IndexedDB, not localStorage — medical-adjacent, needs durability).
- **Acceptance:** Flow completes and the summary reflects the user's answers; "Trigger" step auto-skips when no new joint flagged.

### Step 4.2 · Adaptive Today variant → `design/06-adaptive-today.html`

When Adaptive Mode is on AND a joint is flagged, Today flexes:
- Greeting softens to "Steady does it."
- Readiness check-in card becomes hero (replaces streak block)
- Today's session adapts (`Pool + Upper Mobility` instead of scheduled `Upper Push A`)
- Hydration module promoted to first-class
- Train grid becomes "What's on the table" with `suggested` and `muted` states
- Smart Streak reframes credits (check-in, hydration, any movement all count)
- Flare log card appears
- **Acceptance:** The same Today route renders differently based on `adaptiveMode.enabled && hasActiveFlag`; reverts cleanly when all joints clear.

### Step 4.3 · Adaptive Setup → `design/08-adaptive-setup.html`

Settings screen for configuring conditions, tracked joints, triggers, hydration targets, facilities, intervention sensitivity.
- **Acceptance:** All toggles persist; sensitivity radio defaults to "Balanced".

### Step 4.4 · Flare detail → `design/09-flare-detail.html`

Pattern analysis — trigger correlations, recovery trend, joint frequency, episode list, GP report export.
- **Acceptance:** 12-month day grid renders; trigger bars calculate from logged data; "Generate PDF" stub is present (real PDF gen is a later step).

---

## Phase 5 — Cleanup

### Step 5.1 · Remove v1 code

Once all v2 screens are merged and `NEXT_PUBLIC_V2` has been true in production for 2 weeks without regressions, delete the legacy routes and the feature flag.

### Step 5.2 · Remove `/design/` folder from runtime

Move to `docs/design/` or a sibling directory outside the build. Keep in git, don't ship.

### Step 5.3 · Update README

Link to `@docs/design-system.md` as the canonical reference.

---

## Commit conventions

```
feat(design): add Barlow Condensed + Geist fonts
feat(primitive): Button component with 4 variants
feat(primitive): Chip with filter count
feat(screen): port Today to v2 design
feat(adaptive): morning check-in flow
chore(design): retire v1 Today route
```

## PR template

```md
## What
Port of `design/XX-screen-name.html` to React.

## Visual check
- Preview URL: [link]
- Specimen: `design/XX-screen-name.html`
- Diff: side-by-side screenshots attached

## Checklist
- [ ] Uses primitives only (no ad-hoc styles)
- [ ] No new accent colours
- [ ] British English in all copy
- [ ] Mobile-first at 430px; degrades on desktop
- [ ] Matches specimen within 2px / 1° hue tolerance
```
