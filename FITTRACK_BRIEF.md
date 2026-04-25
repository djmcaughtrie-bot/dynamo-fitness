# FitTrack — Claude Code Project Brief

## Project Overview

FitTrack is a single-file React PWA (~5,800 lines) deployed on Vercel. It is a personal fitness tracking app with 8 nav tabs, multiple workout types, AI-generated workouts, recovery protocols, progress analytics, and a 12-week pectus carinatum rehab programme. The entire app lives in one file: `src/FitTrack.jsx`.

**Live URL:** https://v0-fit-track-six.vercel.app  
**Repo:** GitHub → `src/FitTrack.jsx`  
**Deploy:** Push to GitHub → Vercel auto-deploys (~60s)

---

## Tech Stack

| Concern | Solution |
|---|---|
| Framework | React 18 (Vite) |
| Charts | Recharts (`LineChart`, `BarChart`, `ResponsiveContainer`) |
| Fonts | Bebas Neue + DM Sans via Google Fonts (injected at module level in FitTrack.jsx) |
| Styling | Inline styles + a single `<style>` block injected at module level |
| Persistence | `localStorage` via `useStorage` custom hook |
| AI | Anthropic API direct browser calls (`claude-sonnet-4-20250514`) |
| Deployment | Vercel (Vite template) |

**Imports — only two:**
```jsx
import { useState, useEffect, useRef } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
```

> **Critical:** `useEffect` must stay in the import. Removing it breaks RestTimer, BendSession, and GeneratorScreen.

---

## File Structure

Everything is in `src/FitTrack.jsx`. The file is organised top-to-bottom:

```
1.   Imports
2.   Font injection (IIFE using document.createElement)
3.   Style injection (single CSS const with all CSS classes)
4.   Utility functions: useStorage, today(), dateLabel(), kg()
5.   Icon object (SVG JSX)
6.   Data constants (TUTORIALS, HOME_ALTS, ROUTINES_ALL, GOLF_PROGRAMS, etc.)
7.   Component functions (30 total)
8.   Hub wrapper components (TrainHub, RecoverHub, StatsHub, AIHub)
9.   SettingsScreen
10.  export default function FitTrack() — root with 8-tab nav
```

### Known structural fragility
The root function `export default function FitTrack()` has been accidentally omitted in past edits. Always verify with:
```bash
grep -c "export default function FitTrack" src/FitTrack.jsx  # Must return 1
```

---

## Navigation Architecture

8 nav tabs. Some are direct screens; others are **hub wrappers** with an internal toggle.

```
Home     → HomeScreen
Train    → TrainHub (log | routines | programs)
Cardio   → CardioScreen
Golf     → GolfProgramsScreen
Recover  → RecoverHub (stretches | recovery | cable)
Stats    → StatsHub (progress | volume | lifts | 1rm)
AI       → AIHub (coach | generator)
Plan     → SchedulerScreen
```

### Hub pattern
All hubs use `HubToggle` and pass `embedded` prop to child screens. Embedded screens use `.ft-screen.embedded` CSS class which removes extra top padding.

---

## Data Layer

### localStorage keys

| Key | Contents |
|---|---|
| `fittrack_workouts` | `Workout[]` |
| `fittrack_cardio` | `CardioEntry[]` |
| `fittrack_schedule` | `{ [date]: ScheduledItem[] }` |
| `fittrack_stretch_streak` | `{ count, lastDate }` |
| `fittrack_stretch_today` | `string[]` (program IDs done today) |
| `fittrack_recovery_today` | `string[]` (protocol IDs done today) |
| `fittrack_prog_pectus` | `{ [week]: { [workoutId]: boolean } }` |
| `fittrack_prog_week` | `number` (current week 1–12) |
| `fittrack_api_key` | `string` |

### Workout object shape
```js
{
  id: Date.now(),
  name: "Push Day",
  group: "Chest",
  date: "2025-04-25",
  exercises: [{ name, sets, reps, weight, ssGroup: null | 0..7 }]
}
```

---

## AI Integration

Both AI features (CoachScreen, GeneratorScreen) require `fittrack_api_key` in localStorage.

**Required headers:**
```js
{
  "Content-Type": "application/json",
  "x-api-key": apiKey,
  "anthropic-version": "2023-06-01",
  "anthropic-dangerous-direct-browser-access": "true",
}
```

**Generator JSON parsing** — strip backtick fences before parsing:
```js
raw.replace(/```json|```/g, "").trim()
```

---

## Design Tokens

- Background: `#0a0a0f` | Card: `#13131e` | Border: `#1e1e2e`
- Accent (lime): `#c8f135` | Purple: `#6c63ff` | Orange: `#f5a623`
- Red: `#ff6b6b` | Teal: `#4ecdc4` | Green: `#38b87c` | Blue: `#63b3ed`
- Heading font: `Bebas Neue` | Body font: `DM Sans`

---

## Deployment Checklist

```bash
grep -c "export default function FitTrack" src/FitTrack.jsx  # → 1
head -1 src/FitTrack.jsx  # → must include useEffect
```
