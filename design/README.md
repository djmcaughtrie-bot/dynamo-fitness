# /design — Visual Specimens

HTML reference files. **Not shipped.** These are the source of truth for how each screen should look. Open any of them in a browser and compare side-by-side with a Vercel preview during a port.

## Files

| # | File | Purpose |
|---|---|---|
| 01 | `01-today.html` | Today screen — the anchor. Statement title, streak block, today's session, train grid, weekly volume, AI suggestion card, recent activity, bottom nav with AI FAB. |
| 02 | `02-active-workout.html` | Live workout — rest timer with countdown, set table, previous-session comparison, steppers, RPE pips, next-up preview, full-width log CTA. |
| 03 | `03-programmes.html` | Programme catalog — continuing card, filter chips, 4 featured tiles with bespoke SVG covers, 17-row programme list with thumbnails, AI build-custom CTA. |
| 04 | `04-stats.html` | Stats deep-dive — "THE RECEIPTS", KPI hero, volume area chart with period comparison, adherence heatmap, top lifts 2×2 with sparklines, muscle balance bars, PR feed, golf mini-section. |
| 05 | `05-onboarding.html` | 10-step onboarding flow — welcome → name → focus → experience → frequency → equipment → limitations → units → calibrating → summary. Fully wired; tap through. |
| 06 | `06-adaptive-today.html` | Today screen in Adaptive Mode (flare state) — "STEADY DOES IT", readiness hero, adapted session suggestion, hydration strip, "What's on the table" grid with suggested/muted states, smart streak, flare log. |
| 07 | `07-checkin.html` | Morning check-in — 4 steps (energy → sleep → joints with severity → triggers, conditional) → logged confirmation. Fully wired. |
| 08 | `08-adaptive-setup.html` | One-time config for Adaptive Mode — master toggle, considerations profiles, tracked joints, triggers, hydration targets, facilities, intervention sensitivity, behaviour toggles, GP report export. |
| 09 | `09-flare-detail.html` | Flare history / pattern analysis — active episode with forecast, KPI row, 12-month day grid, trigger correlation bars, recovery duration chart, joint frequency, training impact, episode list, GP report CTA. |
| 10 | `10-design-system.html` | The system itself — tokens, typography, spacing, radii, all components live, data viz primitives, Tailwind config snippet. **Inspect the DOM to lift components directly.** |

## Workflow

1. Pick a screen from `@docs/porting-plan.md`.
2. Open its HTML specimen in one browser tab.
3. Work in VS Code with Claude Code.
4. Push branch → Vercel opens a preview URL.
5. Open preview URL in a second tab, side by side with the specimen.
6. Iterate until visually matched within 2px / 1° hue tolerance.
7. Merge.

## Hard rules

- **Do not import from these files at runtime.** They are specs, not source.
- **Do not edit these files to match the React port.** If the React port diverges, either:
  (a) bring the port back in line, or
  (b) discuss the change with the designer before updating the specimen.
- **Treat these as canonical.** Any disagreement between specimen and docs → specimen wins.

## When the specimen is wrong

Sometimes a spec is wrong or impractical. In that case:
1. Note the issue in the PR description.
2. Update the specimen HTML in the same PR.
3. Update `docs/design-system.md` if a token or component convention is affected.
