# FitTrack Design System — Reference

Paired with the interactive reference at `design/10-design-system.html`. This doc is the authoritative spec for tokens, typography, components, and motion.

---

## 1. Design tokens

### 1.1 Colour tokens

| Token | Hex | Role |
|---|---|---|
| `--bg` | `#0B0B0C` | App background, near-black with slight warmth |
| `--surface` | `#141416` | Default card surface |
| `--surface-2` | `#1B1B1E` | Nested surface, hover states |
| `--surface-3` | `#26262A` | Inactive chips, stepper buttons, scale segments |
| `--border` | `#2A2A2E` | Primary border |
| `--border-soft` | `#1E1E22` | Subtle borders, card outlines |
| `--text` | `#FAFAF5` | Primary text, warm off-white |
| `--text-dim` | `#8E8E94` | Secondary text, descriptions |
| `--text-muted` | `#54545A` | Tertiary text, placeholder, chrome |
| `--accent` | `#95BFE5` | **Sole brand accent** — use generously |
| `--accent-dim` | `#6FA0CC` | Hover / pressed states |
| `--warm` | `#E8B473` | Mild flags, severity 1–2 joints |
| `--orange` | `#FF7A3D` | Alerts, active flares, severity 3, countdown warning |
| `--green` | `#3CE89C` | Success, PRs, completions |
| `--red` | `#FF4A5E` | Destructive actions only |

### 1.2 Tailwind config

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        bg: '#0B0B0C',
        surface: { DEFAULT: '#141416', 2: '#1B1B1E', 3: '#26262A' },
        border: { DEFAULT: '#2A2A2E', soft: '#1E1E22' },
        fg: { DEFAULT: '#FAFAF5', dim: '#8E8E94', muted: '#54545A' },
        accent: { DEFAULT: '#95BFE5', dim: '#6FA0CC' },
        warm: '#E8B473',
        orange: '#FF7A3D',
        green: '#3CE89C',
        red: '#FF4A5E',
      },
      fontFamily: {
        display: ['Barlow Condensed', 'sans-serif'],
        sans: ['Geist', 'sans-serif'],
        mono: ['Geist Mono', 'monospace'],
      },
      borderRadius: {
        xs: '4px', sm: '8px', md: '12px',
        lg: '16px', xl: '20px', '2xl': '24px',
      },
    },
  },
}
```

### 1.3 Typography scale

| Role | Family | Weight | Size | Line | Tracking | Transform |
|---|---|---|---|---|---|---|
| Display XL | Barlow Condensed | 900 | 82–96px | 0.85 | -0.035em | uppercase |
| Display L | Barlow Condensed | 900 | 54–64px | 0.88 | -0.025em | uppercase |
| Display M | Barlow Condensed | 800–900 | 28–36px | 0.95 | -0.015em | uppercase |
| Display S | Barlow Condensed | 800 | 18–22px | 1 | 0.02–0.04em | uppercase |
| Body | Geist | 400 | 14px | 1.5 | 0 | — |
| Body dim | Geist | 400 | 13px | 1.5 | 0 | — |
| Data / Label | Geist Mono | 500 | 11px | — | 0.14em | uppercase |
| Eyebrow | Geist Mono | 400 | 10.5px | — | 0.22em | uppercase |

All digits should use `font-feature-settings: "tnum"` for tabular figures.

### 1.4 Spacing (4px scale)

Screen padding default: **22px**. All other spacing in 4px increments (4, 8, 12, 16, 20, 24, 28, 32).

### 1.5 Radii

| Token | Value | Typical use |
|---|---|---|
| `--r-xs` | 4px | Small pills, badges |
| `--r-sm` | 8px | Small tags |
| `--r-md` | 12px | Icon buttons, steppers, chips |
| `--r-lg` | 16px | Medium cards |
| `--r-xl` | 20px | Primary cards |
| `--r-2xl` | 24px | Hero cards |
| `--r-pill` | 100px | Chips, nav |

### 1.6 Motion

```css
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
.fade-up { animation: fadeUp 0.6s cubic-bezier(.2,.8,.2,1) forwards; }
.delay-1 { animation-delay: 0.05s; }
.delay-2 { animation-delay: 0.10s; }
.delay-3 { animation-delay: 0.15s; }
/* ...continue at 50ms intervals */
```

Standard easing: `cubic-bezier(.2,.8,.2,1)`. Fast transitions: 150ms. Medium: 350ms. Entrance: 600ms.

### 1.7 Noise overlay

Applied globally via `body::before` at 4% opacity, blend mode `overlay`. See `design/10-design-system.html` for the inline SVG data URI.

---

## 2. Component specs

### 2.1 Button — primary

```tsx
<button className="
  bg-accent text-black rounded-md
  px-5 py-3.5
  font-display font-extrabold text-[18px] uppercase tracking-wider
  inline-flex items-center gap-2.5
  shadow-[0_6px_20px_rgba(149,191,229,0.2)]
  active:scale-[0.985] transition-transform
">
  Resume <Icon />
</button>
```

### 2.2 Button — full-width CTA

Bottom-of-screen primary action. 18px padding, 20px font, 16px radius, subtle glow.

### 2.3 Card — base

```tsx
<div className="bg-surface border border-border-soft rounded-xl p-5">
```

### 2.4 Card — accent bar (primary content)

Left-edge 3px accent bar, top-right radial gradient. Use for: "Continuing" programme card, "Today's suggestion", "Active episode" in flare detail.

```tsx
<div className="
  bg-surface border border-accent/20 rounded-xl
  p-5 pl-[26px] relative overflow-hidden
  bg-[radial-gradient(circle_at_110%_-10%,rgba(149,191,229,0.1),transparent_55%)]
  before:content-[''] before:absolute before:left-0 before:top-5 before:bottom-5 before:w-[3px] before:bg-accent
">
```

### 2.5 Chip

- Default: `bg-surface-2 border border-border text-fg-dim`
- Active: `bg-accent text-black border-accent font-semibold`
- Filter variant includes a count pill inside: `bg-surface-3 px-[7px] py-0.5 rounded-lg text-[10px]`

### 2.6 Option card

Radio-style single-select, used in onboarding. 16px radius, 16–18px padding, icon + title + sub + check circle. Selected state flips icon background to accent with black glyph.

### 2.7 Toggle

52×30px pill. `.on` state: background flips to accent, knob slides right and becomes white.

### 2.8 Scale segmented (1–5)

Used for energy, sleep, RPE. 5 segments, `gap: 5px`, 34px height. Active segment gets solid accent with black text. "Filled" (below selection) segments use `bg-accent/12` + `text-fg-dim`.

### 2.9 Stepper

44×44pt buttons (Apple HIG minimum for one-handed gym use). Weight default increment 2.5kg (standard plate), reps increment 1.

### 2.10 Progress bar

4px height, accent fill with `box-shadow: 0 0 8px rgba(149,191,229,0.4)` for subtle glow.

### 2.11 Status chip (live indicator)

Pill-shaped with pulsing accent dot:
```tsx
<span className="
  inline-flex items-center gap-1.5
  px-2.5 py-1
  bg-accent/10 border border-accent/25 rounded-full
  text-accent font-mono text-[10.5px] uppercase tracking-[0.12em]
">
  <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse shadow-[0_0_6px_currentColor]" />
  Training live
</span>
```

### 2.12 KPI cell

Vertical rhythm: tiny label (mono, uppercase, tracking-wide) → big value (display 800, tabular nums) → small delta (mono, accent or orange). Use dashed border-top separator when grouped in a row.

### 2.13 Section header pattern

```tsx
<div className="flex justify-between items-center px-[22px] my-8 mb-3">
  <h3 className="
    font-display font-extrabold text-[19px] uppercase tracking-[0.04em]
    flex items-center gap-2.5
    before:content-[''] before:w-1.5 before:h-1.5 before:bg-accent before:rounded-full
  ">Today's Session</h3>
  <a className="font-mono text-[10.5px] text-fg-dim tracking-[0.14em] uppercase">Change →</a>
</div>
```

### 2.14 Eyebrow tag

```tsx
<div className="
  inline-flex items-center gap-2.5
  font-mono text-[10.5px] text-fg-dim uppercase tracking-[0.22em]
  before:content-[''] before:w-5 before:h-px before:bg-accent
">
  Morning, Dave
</div>
```

### 2.15 Lane divider

Running-track-inspired divider, masked at edges:
```css
height: 18px;
background-image: repeating-linear-gradient(90deg, transparent 0, transparent 10px, var(--border) 10px, var(--border) 22px);
opacity: 0.5;
mask-image: linear-gradient(90deg, transparent, black 15%, black 85%, transparent);
```

### 2.16 Bottom nav (5-tab + FAB)

Blurred-glass pill container. 5 destinations: Today · Train · **AI** · Stats · More. AI is a 58px floating centre action in accent (FAB). Active tab icon turns accent.

---

## 3. Data viz primitives

### 3.1 Sparkline

Inline SVG, `viewBox="0 0 W H"`, `preserveAspectRatio="none"`. Line path + gradient area fill. Dot on latest data point. Keep stroke-linecap/linejoin as `round`.

### 3.2 Adherence heatmap

GitHub-style: columns = weeks, rows = days (7). 5 intensity levels:
- 0: `bg-surface-3`
- L1: `bg-accent/18`
- L2: `bg-accent/42`
- L3: `bg-accent/72`
- L4: `bg-accent` + `shadow-[0_0_6px_rgba(149,191,229,0.4)]` on today

Cell: 20×20px with 4px gap.

### 3.3 Bar with target

Horizontal bar filled to current value, with a vertical tick marker indicating target. If current < target threshold → bar colour `--orange`, count text also `--orange`. Otherwise accent.

### 3.4 Area chart

Used for volume trend. Current period in accent with gradient area fill + glow filter. Previous period ghosted behind (dashed grey line, 0.08 opacity fill). Data point dot on most recent reading with concentric ring.

---

## 4. Layout conventions

- **Screen container:** `max-w-[430px] mx-auto` mobile-first. On desktop, stays centered with optional subtle phone-frame at min-width 431px.
- **Screen padding:** `22px` horizontal is the default.
- **Card gaps:** 10–14px between cards in a stack.
- **Section spacing:** 32–40px between major sections (`mt-8` to `mt-10`).
- **Sticky top bar:** background `--bg`, z-index 10.
- **Bottom CTA bar:** background fades from `--bg` at 60% to transparent at top.

---

## 5. Accessibility notes

- Minimum tap target: **44×44pt** (Apple HIG). Primary CTAs exceed this.
- Text contrast: All body text on `--bg` meets WCAG AA.
- Focus states: Use `ring-accent ring-2 ring-offset-2 ring-offset-bg` for keyboard focus.
- Motion: respect `prefers-reduced-motion` — disable fade-up animations for users who request it.
- Status indicators (live dots, pulsing animations): always pair with text labels, never colour-only.

---

## 6. Copy tone

- **Coach, not cheerleader.** Language should sound observant and practical, not motivational.
- **Statement titles carry personality.** Short, declarative, slightly cheeky. British sensibility.
- **Microcopy is honest.** "Be honest — better to nail 3 than miss 5" beats "Choose your frequency".
- **Data is paired with ratios, not just percentages.** "14 / 16 sessions · 88% adherence" not just "88%".
- **No medical language in the UI.** The word "gout" doesn't appear; symptoms do.

---

## 7. What's out of scope (for now)

- Light mode (dark-only until further notice)
- Empty states (covered in a future doc)
- Form error / validation states (none of the current screens use inputs that validate)
- Internationalisation (UK English only)
- Icon library consolidation (inline SVGs for now)
