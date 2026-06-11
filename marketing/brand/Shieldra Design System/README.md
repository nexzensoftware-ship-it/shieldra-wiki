# Shieldra Design System

> The regulatory AI that shields your business.

Shieldra is an enterprise compliance automation platform — an AI-powered SaaS for healthcare and regulated industries that automates **HIPAA, SOC 2, PCI DSS, ISO 27001, and GDPR** compliance end-to-end. It scans policies, monitors infrastructure, surfaces findings with calibrated AI confidence scores, and includes a self-learning engine that gets smarter with every audit.

The product is marketed by parent company **Nexzen Software** and leads with the positioning *"the regulatory AI that shields your business."*

## Products in this system

| Surface | What it is | Tech |
|---|---|---|
| **Landing** (`apps/landing`) | Marketing site — hero, features, frameworks, HIPAA coverage, pricing, testimonials | React + Vite + Tailwind, custom theme (`brand`, `accent`, `violet`, `surface`) |
| **Web dashboard** (`apps/web`) | The product itself — dashboard, compliance scans, findings, remediation, evidence, vendor risk, AI assistant, 40+ pages | React 19 + TypeScript + TanStack Router + shadcn/ui + Radix |
| **API** (`apps/api`) | FastAPI + Python backend (not design-relevant) | — |

## Sources

- **Codebase:** `github.com/nexzensoftware-ship-it/shieldra` (private). Key paths imported/inspected:
  - `apps/landing/tailwind.config.ts` — authoritative colour palette + animation keyframes
  - `apps/landing/src/styles/globals.css` — landing utility classes (`.glass`, `.mesh-bg`, `.gradient-text`, `.dot-pattern`)
  - `apps/web/src/styles/globals.css` — shadcn HSL tokens + dark-mode variables
  - `apps/landing/src/components/hero.tsx`, `navbar.tsx` — hero pattern, floating cards, beam animations
  - `apps/web/src/components/ui/*` — shadcn primitives (button, card, badge)
  - `apps/web/src/components/layout/sidebar.tsx` — product navigation structure + icon choices (Lucide)
  - `apps/web/src/components/dashboard/score-gauge.tsx` — compliance score gauge pattern
  - `brand-assets/**` — all official SVG logos, favicons, social banners (all imported into `/assets/`)
- **User-uploaded logo:** `uploads/logo.svg` (also copied to `assets/logo/shieldra-logo-uploaded.svg`)

---

## Content fundamentals

**Voice.** Clear, confident, and authoritative — a *trusted advisor* tone, not a casual SaaS buddy. Addresses the reader as **"you"**; the product as **Shieldra** (never "we"). Avoids hype-speak in favor of crisp claims backed by numbers.

**Copywriting style.**
- **Title Case** for navigation, menu items, button labels, feature names, and headings inside cards: *"Book a Demo", "Start Free Trial", "Compliance Score", "HIPAA Readiness", "Audit Trail", "Risk Register"*.
- **Sentence case** for paragraph-length subtitles and descriptions.
- **All-caps** only for short eyebrow labels + tier pills: `AI`, `PRO`, `ENT`, `COMPLIANCE SCORE` (with `letter-spacing: wider`).
- Headline formula: short verb-driven phrase with a single **gradient-highlighted** word. Example from hero: *"The regulatory AI that shields your business."* — "shields" is the gradient word.
- Sub-headline formula: one concrete sentence, then a supporting clause with a bold phrase. Example: *"Shieldra automates HIPAA compliance end-to-end — scanning your policies, monitoring your infrastructure, and **learning from every audit** to keep you a step ahead of every regulator."*
- **Numbers + units** carry weight: `98%`, `99.2%`, `324 controls monitored`, `Multi-model: Claude · GPT · Gemini`. Always show the unit (`%`, `controls`, `regulators`).
- Badges/pills use em-dashes or middle dots (`·`) as dividers inside a single pill: `AI-Powered Compliance Platform · Multi-model: Claude · GPT · Gemini`.

**Terminology.** *Compliance score, readiness, findings, controls, frameworks, evidence, remediation, auto-remediation, regulatory radar, knowledge graph, learning engine, drift detection, peer benchmarking, BAA, PHI.* Prefer the specific regulatory term over a generic one.

**Personality.** Serious, precise, enterprise-grade — but with quiet craft (glass cards, soft gradients, animated counters) that signals "modern, fast-moving AI company."

**Emoji.** Never. The only "glyph-like" elements are Lucide icons and a single `Sparkles` glyph beside the `AI` pill.

---

## Visual foundations

**Colors.** Four families; **every** product surface uses these.

- **Brand** (Blue `#3b82f6 → #2563eb`) — primary CTAs, active states, links, logo accent.
- **Accent** (Cyan `#22d3ee → #06b6d4`) — the "shield" highlight; pulses, live indicators, success adjacents, logo nodes.
- **Violet** (`#8b5cf6 → #7c3aed`) — AI/intelligence signalling, paired with brand in gradients.
- **Surface** (Slate `#f8fafc → #020617`) — all neutrals. Light mode is `surface-0` on `surface-50`, dark mode pivots to `surface-900`/`surface-800`.
- **Semantic**: success `#22c55e`, warning `#eab308`, high `#f97316`, danger `#ef4444` (from `score-gauge.tsx` thresholds).

**Signature gradient.** `linear-gradient(90deg, brand-600, violet-600, brand-600)` with `background-size: 200%` + `gradient-shift` keyframe. Used on: primary CTA, highlighted words in headlines (`.gradient-text`), `AI` pill. Secondary: `readiness` gradient (`violet-500 → brand-500 → accent-500`).

**Typography.**
- **Inter** (300–900) for all UI text. OpenType features enabled: `cv02, cv03, cv04, cv11, rlig, calt`.
- **JetBrains Mono** for code and occasional numerical callouts.
- Headlines: `font-extrabold`, `tracking-tight` (`-0.02em`), `leading-[1.1]`, `text-wrap: balance`.
- Body: `text-base`/`text-lg`, `leading-relaxed` (1.65).
- Eyebrows: `text-xs font-semibold uppercase tracking-wider text-surface-500`.

**Backgrounds.**
- **Mesh gradient orbs** (`.mesh-bg`): seven radial gradients in brand/violet/cyan at low opacity (3–8%) — the default canvas under the hero.
- **Dot pattern** (`.dot-pattern`): `radial-gradient(circle, #cbd5e1 1px, transparent 1px) 24px 24px` at `opacity: 0.35`.
- **Noise overlay** (`.noise-bg`): SVG fractal-noise filter at `opacity: 0.02` for subtle grain.
- **Animated vertical beams**: 1px vertical gradient lines falling top-to-bottom, varied delay, `via-brand-400/40`.
- **Drifting orbs**: four large blurred circles (`blur-3xl`) in brand/violet/cyan/purple, animated via `drift-1..4` on 18–25s loops.

**Animation.** Easing = `cubic-bezier(0.22, 1, 0.36, 1)` for entrances; standard `ease-in-out` for ambient loops.
- Entrance: 700ms with staggered delays (200ms, 320ms, 440ms, 560ms, 680ms) + `translateY(32px) → 0`.
- Floats: `float-sm/md/lg` on 5/6/7s loops, `translateY(-8/-12/-16px)`.
- Drifts: 18–25s position/scale loops for background orbs.
- Counters: numeric `useCounter` ramps to target over 2.0–2.4s.
- Gradient shift: 8s infinite `ease` on CTA backgrounds.
- No bounces, no springy overshoots — motion is smooth and confident.

**Hover & press.**
- Buttons: gradient shifts position (`bg-[length:200%] group-hover:bg-[position:100%_0]`, 500–700ms), add outer blurred glow (`-inset-2 blur-xl opacity-25`), subtle `shadow-glow → shadow-glow-lg`.
- Cards: `hover:-translate-y-1`, `hover:shadow-card-hover`, `hover:border-white/50` (on glass), 300–500ms.
- Nav links: underline scales from `scale-x-0 origin-left` on hover (300ms).
- Icon buttons: `hover:bg-surface-100` at `--radius-md`.
- No "press" shrink — the design relies on shadow + gradient shifts, not scale.

**Borders & shadows.**
- Borders default to `var(--surface-200)` / `0.5 opacity` on glass; `var(--surface-300)` on hover.
- Glass cards: `rgba(255,255,255,0.8)` + `backdrop-blur-2xl` + `border-white/40` + `shadow-glass-lg`.
- Elevated dashboard cards: `shadow-sm` default, `shadow-elevated` when hero.
- Glow shadows: `0 0 20px rgba(59,130,246,0.15)` (brand) and `0 0 20px rgba(6,182,212,0.15)` (accent).

**Transparency & blur.** Glass is used intentionally — navbar when scrolled, floating stat cards over the hero, dropdown popovers. Always paired with a subtle gradient rim (`absolute inset-0 bg-gradient-to-br from-brand-500/10 via-transparent to-violet-500/10`) and `backdrop-blur-xl` or `-2xl`.

**Corner radii.** 4 → 8 → 12 → 16 → 24 → 32 → 40 → pill. Most product UI is at 8–12 (shadcn default). Hero and marketing surfaces push to 16–32 for a softer, premium feel. Pills always full.

**Card anatomy.**
- Product (dashboard) cards: `rounded-lg border bg-card text-card-foreground shadow-sm` (shadcn default).
- Landing glass cards: `rounded-2xl bg-white/80 backdrop-blur-2xl border border-white/40 shadow-glass-lg` + gradient rim.
- Stat cards: icon in colored 28×28 rounded-lg tile (`bg-{accent}-100`, `text-{accent}-600`) + uppercase eyebrow label + large number + unit in accent color.

**Imagery vibe.** Cool-toned (blue → cyan → violet). No photography in the codebase — the brand relies on illustrations built from the network-of-nodes logo motif: dots connected by thin lines over a dark gradient background. Avoid warm tones, no film grain beyond the 2% noise overlay.

**Layout rules.**
- Max width `max-w-7xl` (1280px) centered.
- Horizontal padding: `px-4 sm:px-6 lg:px-8`.
- Section vertical rhythm: `pt-20 pb-10 sm:pt-24 sm:pb-16 lg:pt-32 lg:pb-24`.
- Navbar: `h-16 lg:h-18`, fixed, glass when scrolled.
- Sidebar: `lg:w-64` expanded, `lg:w-16` collapsed; grouped nav with chevron-down section headers.

---

## Iconography

**Primary system: Lucide React** (`lucide-react`). Every icon in the codebase comes from this library. Strokes are `currentColor`, default `width/height 16–20px` in UI, `3.5–5` Tailwind size (`w-3.5 h-3.5` for small pills, `w-4 h-4` for sidebar, `w-5 h-5` for prominent features).

**Commonly used icons:** `Shield, ShieldCheck, ShieldAlert, ShieldQuestion, Sparkles, Activity, Bell, Bot, Brain, Building2, ChevronDown, ChevronRight, ClipboardList, FileText, LayoutDashboard, ListChecks, Map, Network, Plug, Radio, Server, Settings, Target, UserCheck, Wrench, Zap, Play, CheckCircle2, TrendingUp, BookOpen, Library, Globe, Menu, X, AlertTriangle, GraduationCap, Archive, BarChart3`.

**No emoji. No ad-hoc SVGs.** When an icon isn't in Lucide, the team uses the nearest match rather than drawing one. Decorative shapes (orbs, beams, dot grids) are built from CSS/SVG primitives but are not "icons."

**Logo as icon.** The square logo (`assets/logo/icon-primary.svg`) works at any size; monochrome (`icon-monochrome-white.svg`) is available for dark surfaces. The logo shows a network of cyan nodes connected by thin lines on a dark blue gradient — the visual echo of the "connected compliance graph" the product builds.

**CDN substitution flag.** None — all icons come from `lucide-react`. If rendering in static HTML without React, use the [Lucide CDN](https://unpkg.com/lucide@latest) or inline their SVG strings (`https://lucide.dev/icons/`).

---

## Font substitution note

**No font files needed.** Inter and JetBrains Mono are both loaded from Google Fonts (see `apps/landing/index.html` + `colors_and_type.css`). If you need a local fallback for offline use, both are freely available as OFL:

- [Inter](https://fonts.google.com/specimen/Inter)
- [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono)

No substitutions were made.

---

## Index / Manifest

```
Shieldra Design System/
├── README.md                   # you are here
├── SKILL.md                    # Agent-Skills manifest
├── colors_and_type.css         # CSS variables + semantic type styles
├── assets/
│   ├── logo/                   # 6 SVG logos (icon, monochrome, lockups H/V)
│   ├── favicon/                # 3 favicon SVGs
│   ├── social/                 # FB / LI / Twitter / profile
│   ├── email/                  # email-header.svg
│   └── web/                    # og-image.svg
├── preview/                    # design-system cards (registered assets)
│   ├── colors-brand.html
│   ├── colors-accent.html
│   ├── ...
├── ui_kits/
│   ├── landing/                # Marketing-site UI kit (hero + navbar + feature cards)
│   │   ├── index.html
│   │   ├── Navbar.jsx
│   │   ├── Hero.jsx
│   │   ├── FeatureCard.jsx
│   │   └── FloatingStatCard.jsx
│   └── dashboard/              # Product UI kit (sidebar + dashboard + score gauge)
│       ├── index.html
│       ├── Sidebar.jsx
│       ├── Header.jsx
│       ├── ScoreGauge.jsx
│       ├── StatCard.jsx
│       └── FindingsTable.jsx
```
