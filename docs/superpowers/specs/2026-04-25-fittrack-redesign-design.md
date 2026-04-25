# FitTrack Full Redesign — Design Spec

**Date:** 2026-04-25  
**Scope:** Full migration of the live FitTrack PWA to the new design language, all screens.

---

## 1. Objective

Port the FitTrack PWA from its current single-file implementation to the new design system defined in `docs/design-system.md` and visualised in `design/01–13`. All 11 target screens are redesigned or built from scratch. Five existing screens without design specimens (Cardio, Golf, Recovery, Stats, Scheduler) are moved to separate files but left visually unchanged.

---

## 2. Approach

- **All screens in one branch** — single PR, no incremental merging
- **Split into screen files** — one component per screen in `src/screens/`
- **CSS strategy** — `src/tokens.css` (CSS custom properties) + screen-local `const CSS` template literal per screen. No Tailwind. No ad-hoc hex values in JSX.

---

## 3. File structure

```
src/
  tokens.css                — CSS custom properties (all design tokens)
  index.css                 — global resets, body styles, @import tokens.css
  main.jsx                  — unchanged
  FitTrack.jsx              — nav shell only: state, routing, adaptive logic (~120 lines)

  components/
    Nav.jsx                 — 5-tab bottom nav + AI FAB + "More" drawer
    Button.jsx              — primary / secondary / ghost / danger / cta variants
    Card.jsx                — base / accent / attention variants
    PageHead.jsx            — eyebrow + statement title + sub pattern

  screens/
    Today.jsx               — design/01  · replaces HomeScreen
    ActiveWorkout.jsx       — design/02  · replaces LogScreen
    Programmes.jsx          — design/03  · replaces RoutinesScreen + ProgramsScreen
    Onboarding.jsx          — design/05  · NEW
    AdaptiveToday.jsx       — design/06  · NEW
    CheckIn.jsx             — design/07  · NEW
    AdaptiveSetup.jsx       — design/08  · NEW
    FlareDetail.jsx         — design/09  · NEW
    AICoach.jsx             — design/11  · replaces CoachScreen
    Settings.jsx            — design/12  · replaces SettingsScreen
    StretchRoutine.jsx      — design/13  · replaces StretchesScreen
    Cardio.jsx              — moved as-is (no design specimen)
    Recovery.jsx            — moved as-is
    Stats.jsx               — moved as-is
    Golf.jsx                — moved as-is
    Scheduler.jsx           — moved as-is
```

---

## 4. Token layer (`src/tokens.css`)

All CSS custom properties. Imported once in `index.css`. No component may use a raw hex value.

### Colours
```css
:root {
  --bg:          #0B0B0C;
  --surface:     #141416;
  --surface-2:   #1B1B1E;
  --surface-3:   #26262A;
  --border:      #2A2A2E;
  --border-soft: #1E1E22;
  --text:        #FAFAF5;
  --text-dim:    #8E8E94;
  --text-muted:  #54545A;
  --accent:      #95BFE5;
  --accent-dim:  #6FA0CC;
  --warm:        #E8B473;
  --orange:      #FF7A3D;
  --green:       #3CE89C;
  --red:         #FF4A5E;
}
```

### Radii
```css
:root {
  --r-xs:   4px;
  --r-sm:   8px;
  --r-md:   12px;
  --r-lg:   16px;
  --r-xl:   20px;
  --r-2xl:  24px;
  --r-pill: 100px;
}
```

### Fonts

Loaded in `index.html` via Google Fonts preconnect + `<link>`:
- **Barlow Condensed** — weights 700, 800, 900, 900 italic
- **Geist** — weights 400, 500, 600, 700
- **Geist Mono** — weights 400, 500, 600

```css
:root {
  --font-display: 'Barlow Condensed', sans-serif;
  --font-sans:    'Geist', sans-serif;
  --font-mono:    'Geist Mono', monospace;
}
```

### Motion
```css
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
.fade-up  { animation: fadeUp 0.6s cubic-bezier(.2,.8,.2,1) forwards; }
.delay-1  { animation-delay: 0.05s; }
.delay-2  { animation-delay: 0.10s; }
.delay-3  { animation-delay: 0.15s; }
```

---

## 5. Shared components

### 5.1 `<Nav>`

Props: `tab`, `setTab`

5-tab bottom bar in a blurred-glass pill. Layout: **Today · Train · [AI FAB] · Stats · More**.

- AI FAB: 58px circle, `bg: var(--accent)`, black glyph, tapping sets `tab = 'ai'`
- Active tab icon gets `stroke: var(--accent)`; label gets `color: var(--text)`
- "More" tap opens a slide-up sheet listing: Cardio · Golf · Recovery · Schedule · Settings · Adaptive Setup · Flare Detail

### 5.2 `<Button>`

Props: `variant` (`primary` | `secondary` | `ghost` | `danger` | `cta`), `size` (`sm` | `md`), `onClick`, `children`, `icon?`

- `primary` — `bg: var(--accent)`, black text, display font, uppercase, 6px/20px shadow
- `secondary` — `bg: var(--surface-2)`, `border: var(--border)`, `color: var(--text)`
- `ghost` — transparent, `border: var(--border)`, `color: var(--text-dim)`
- `danger` — `bg: var(--red)/12`, `color: var(--red)`, `border: var(--red)/30`
- `cta` — full-width primary, 18px padding, used as bottom-of-screen action
- All: `border-radius: var(--r-md)`, 44px min-height, `active:scale(0.985)` transition

### 5.3 `<Card>`

Props: `variant` (`base` | `accent` | `attention`), `children`, `className?`

- `base` — `bg: var(--surface)`, `border: var(--border-soft)`, `border-radius: var(--r-xl)`, padding 20px
- `accent` — base + 3px left `var(--accent)` bar (inset, top 20px / bottom 20px) + radial gradient top-right. Use for: continuing programme, today's suggestion, active flare episode
- `attention` — base + `border-color: var(--accent)/20` + subtle `var(--accent)/8` background. Use for AI-generated content

### 5.4 `<PageHead>`

Props: `eyebrow`, `title`, `accent`, `sub?`

Renders: eyebrow tag (mono, accent line prefix) → statement title split as `title` in `--text` + `accent` in italic `--accent` → optional sub line in `--text-dim`. Used as the first element on every top-level screen, 22px horizontal padding.

Example: `<PageHead eyebrow="Friday · 25 Apr" title="LET'S MAKE IT" accent="COUNT." />`

---

## 6. Navigation and routing (`FitTrack.jsx`)

`FitTrack.jsx` holds all top-level state and renders the active screen. Tab values: `today` · `train` · `ai` · `stats` · `more` · `cardio` · `golf` · `recover` · `schedule` · `settings` · `adaptive-setup` · `flare-detail` · `onboarding` · `checkin`

### Adaptive routing rule

```
todayScreen():
  if !onboardingComplete        → <Onboarding />
  if !todayCheckinDone          → <Today /> with check-in prompt banner
  if todayMaxSeverity >= 1      → <AdaptiveToday />
  else                          → <Today />
```

`todayMaxSeverity` = highest joint severity in today's check-in entry from `ft-checkins`.

---

## 7. Adaptive state model

All stored in `localStorage`. No raw values in components — read/write via the existing `useStorage(key, init)` hook.

| Key | Shape | Written by |
|---|---|---|
| `ft-adaptive-config` | `{ trackedJoints: string[], triggers: string[], hydrationTargetMl: number, facilities: string[], sensitivityLevel: 1\|2\|3 }` | AdaptiveSetup |
| `ft-checkins` | `Array<{ date: string, energy: 1–5, sleep: 1–5, joints: Array<{ id: string, severity: 0–3 }>, triggers: string[] }>` | CheckIn |
| `ft-onboarding` | `{ complete: boolean, name: string, focus: string, experience: string, frequency: number, equipment: string[], limitations: string[], units: 'kg'\|'lbs' }` | Onboarding |

`ft-flares` is derived in `FitTrack.jsx` from `ft-checkins`: consecutive days where any joint severity ≥ 1 form an episode. An episode ends when a check-in records severity 0 on all joints, or when 2 or more consecutive days pass with no check-in (assumed recovery). This computed value is passed as a prop to `FlareDetail` and `AdaptiveToday`.

**Streak logic:** the streak is "smart training days" — incremented by any day that has either a completed workout session OR a check-in entry (rest days where the user engaged with the app count). Only days with no check-in and no session break the streak.

**Backup mechanism:** Settings screen includes an "Export data" button that serialises all `ft-*` keys to a downloadable JSON file.

---

## 8. Screen inventory

### 8.1 Today (`design/01`)
Statement title: *LET'S MAKE IT COUNT.*  
Sections: PageHead → readiness KPI row → today's session card (accent variant) → weekly volume sparkline → AI suggestion card (attention variant) → recent activity list → lane divider.  
Adaptive prompt banner: if no check-in today, a dismissable banner at top offers to start the morning check-in.

### 8.2 Active Workout (`design/02`)
No statement title — this is a full-screen modal-style view launched from Today.  
Sections: live status chip → exercise name + set counter → rest timer ring → set table (reps/weight steppers) → RPE scale (1–5 segments) → next-up preview card → full-width CTA ("Log set").

### 8.3 Programmes (`design/03`)
Statement title: *PICK YOUR PRESSURE.*  
Sections: PageHead → continuing programme card (accent variant) → filter chips → featured programme tiles (2×2 grid) → full programme list → AI build CTA at bottom.

### 8.4 Onboarding (`design/05`) — NEW
10-step flow, one question per screen. Steps: welcome → name → focus → experience → frequency → equipment → limitations → units → calibrating (AI spinner) → summary.  
On completion writes to `ft-onboarding` with `complete: true`. Navigation: no bottom nav shown during onboarding.

### 8.5 Adaptive Today (`design/06`) — NEW
Statement title: *STEADY DOES IT.*  
Replaces normal Today when flare severity ≥ 1.  
Sections: PageHead → readiness hero (large severity indicator) → adapted session card → hydration strip (bar-with-target viz) → "what's on the table" grid (pool · sauna · steam promoted) → smart streak block (rest days count) → flare log link.  
PR prompts hidden via `adaptiveMode.hidePRsDuringFlare` — severity 3 auto-defers loaded sessions, severity 1–2 asks.

### 8.6 Check-in (`design/07`) — NEW
4-step morning flow: energy (1–5 scale) → sleep (1–5 scale) → joints (tap each tracked joint, set severity 0–3 for each) → triggers (multi-select chips).  
Writes one entry to `ft-checkins` dated today. Accessible from: Today banner prompt, and More drawer.

### 8.7 Adaptive Setup (`design/08`) — NEW
Statement title: *YOUR RULES.*  
Sections: tracked joints selector → trigger chips (multi-select) → hydration target (stepper) → facilities (pool/sauna/steam toggles) → intervention sensitivity (1–3 scale).  
Writes to `ft-adaptive-config`. Accessible from More drawer.

### 8.8 Flare Detail (`design/09`) — NEW
Statement title: *THE PATTERN.*  
Sections: active episode card (accent variant, if flare active) → KPI row (episodes YTD, avg duration, longest streak) → 12-month day grid (GitHub-style heatmap) → trigger correlation bars → recovery trend sparkline → joint frequency table → "Generate GP report" CTA (calls Anthropic API).  
Accessible from More drawer and from AdaptiveToday.

### 8.9 AI Coach (`design/11`)
Statement title: *YOUR MOVE.*  
Sections: context card (today's training context, accent variant) → message thread (user bubbles right, AI bubbles left with rich routine cards inline) → suggested replies strip → sticky input bar.  
Calls Anthropic API with `anthropic-dangerous-direct-browser-access` header.

### 8.10 Settings (`design/12`)
Statement title: *THE CONTROLS.*  
Sections: profile hero → KPI row → grouped sections: Training · Adaptive · Connections · AI Coach · Notifications · Appearance · Data · Support.  
Data section includes: "Export data" (downloads all `ft-*` keys as JSON) + destructive account actions (clear data, reset onboarding).

### 8.11 Stretch Routine (`design/13`)
No statement title — launched from Today or Train hub.  
Two views: overview (grouped exercise list with durations) → player (full-screen timer with prev/next controls + position-switch screen).

---

## 9. Constraints and non-negotiables

- No ad-hoc hex values in any JSX or CSS block — all values via `var(--token)` or `var(--token)/opacity`
- No judgemental copy; condition name never appears in UI
- Rest days count toward streaks — streak logic must reflect "smart training" not "session completed"
- Severity 3 on any tracked joint defers loaded sessions automatically; severity 1–2 prompts
- Pool / sauna / steam are primary surfaces on AdaptiveToday — not buried in a recovery section
- All tap targets minimum 44×44pt
- British English throughout (programme, colour, minimise, favourite)
- Noise overlay (`body::before`) at 4% opacity, blend mode `overlay`, from `design/10`

---

## 10. Out of scope

- Tailwind CSS (Phase 0 of porting plan — separate PR after this)
- Light mode
- React Router (tab state stays in FitTrack.jsx)
- Stats screen redesign (no design specimen exists)
- Cardio, Golf, Recovery, Scheduler screen redesigns (moved as-is)
