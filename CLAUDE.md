# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# FitTrack — Project Memory

Personal fitness PWA with adaptive, condition-aware programming. React app deployed to Vercel.

## Stack
- **Vite + React 19** — no router; screens switched via `tab` state in the root `FitTrack` component
- **Recharts** — only charting library; already imported where needed
- **Anthropic API** called direct from browser with `anthropic-dangerous-direct-browser-access` header
- **Vercel** for deploy; every branch gets a preview URL
- **No Tailwind yet** — Phase 0 of the porting plan installs it; the design-system doc describes the target config

## Current implementation state (before porting)

`src/FitTrack.jsx` is a ~2,100-line monolith. All CSS lives in a template-literal `CSS` constant injected as `<style>{CSS}</style>` inside the root component. Current tokens:

| Token | Current (legacy) | Target (design system) |
|-------|-----------------|----------------------|
| Accent colour | `#c8f135` (lime) | `#95BFE5` (pale blue) |
| Display font | Bebas Neue | Barlow Condensed 900 |
| Body font | DM Sans | Geist |
| Mono / data font | — | Geist Mono |
| Background | `#0a0a0f` | `--bg` token (near-black) |

The porting plan migrates from this state to the new design language incrementally. **Do not touch the live screens** until their port branch is ready.

## Screen / navigation model

Root `FitTrack` component holds `tab` state. Tabs:

`home` · `train` · `cardio` · `golf` · `recover` · `stats` · `ai` · `schedule` · `settings`

Each tab renders one top-level screen component or hub. Sub-screens within a hub use local `view` state (e.g. `RoutinesScreen`, `StretchesScreen`). There is no client-side router.

## Locale
British English throughout. "programme" not "program", "colour" not "color", "minimise" not "minimize", "favourite" not "favorite". Applies to code comments, copy strings, and commit messages.

## Design system — non-negotiable

Full token and component spec in `docs/design-system.md`. Visual specimens in `design/README.md`.

**Hard rules:**
- **One accent colour.** `#95BFE5` (pale blue). Never introduce a second accent. Semantic colours (`--warm`, `--orange`, `--green`, `--red`) exist but have specific jobs — not decoration.
- **Barlow Condensed 900** for all display type. Not Inter. Not Roboto. Not system fonts.
- **Geist** for UI body text, **Geist Mono** for data / labels / timestamps.
- **Every top-level screen opens with a statement title** in italic accent:
  `LET'S MAKE IT COUNT` (Today) · `PICK YOUR PRESSURE` (Programmes) · `THE RECEIPTS` (Stats) · `STEADY DOES IT` (Adaptive Today). Preserve this pattern when adding screens.
- **All cards pull from tokens.** No ad-hoc hex values anywhere in JSX.
- **Mobile-first, 430px viewport.** Use desktop only for the design-system doc itself.

## Adaptive Mode — critical feature, not optional

The app serves someone managing a chronic inflammatory condition. Training reality fluctuates. Rules:
- **Rest days count toward streaks.** The streak is "smart training", not "session completed".
- **No PR prompts when a flare is flagged.** Hide them conditionally via the `adaptiveMode.hidePRsDuringFlare` flag.
- **Severity 3 flag on any joint defers loaded sessions automatically.** Severity 1–2 asks.
- **Pool / sauna / steam get promoted on flare days** — these are the primary surface, not "recovery" afterthoughts.
- **No judgemental copy.** The condition name doesn't appear in the UI. The system handles it by symptom.
- Reference screen: `design/06-adaptive-today.html`

## Porting approach
Incremental, one screen per PR. See `docs/porting-plan.md` for the ordered roadmap (Phase 0 foundations → Phase 1 primitives → Phase 2 data viz → Phase 3 screens → Phase 4 adaptive mode → Phase 5 cleanup).

Workflow per screen:
1. Create a branch `feat/port-<screen-name>`.
2. Open the matching `design/*.html` in a browser for visual reference.
3. Port using primitive components from `src/components/`.
4. Push → Vercel preview URL.
5. Eyeball preview against the HTML specimen side by side.
6. Merge when matched.

## Commands
```bash
npm run dev           # local dev server
npm run build         # production build
npm run preview       # local prod preview
npm run lint          # eslint
```

## Things to avoid

- **Don't install UI libraries** (shadcn, MUI, Chakra, Radix Themes). Components are hand-built from primitives in this repo. Radix *primitives* (unstyled) are acceptable if needed for a11y, but not themed libraries.
- **Don't add icon libraries** beyond what's in use. Prefer inline SVG at 1.8 stroke weight, 20px base size.
- **Don't introduce new accent colours.** If something needs to "stand out", work harder with hierarchy, size, and position first.
- **Don't refactor the live Today screen in one go.** Stage it behind a feature flag or route until the port is visually matched.
- **Don't use `localStorage` for adaptive data** without backup — medical-adjacent data needs persistence beyond a browser wipe.
- **Don't write ad-hoc hex values in JSX.** Always use CSS custom property tokens.

## When in doubt

- For visual questions → open the relevant `design/*.html` and match it.
- For tokens and component specs → `docs/design-system.md`.
- For what to build next → `docs/porting-plan.md`.
- For pattern questions not covered → ask me before improvising.
