# CLAUDE.md -- SW Portfolio

## Read First

- **`DESIGN-SPEC-V3.md`** is the single source of truth for all visual decisions. Read it before building any UI.
- **`docs/ProjectCard.md`** has the component mini-spec for the portfolio card component.

## Project Overview

| | |
|---|---|
| **Framework** | Astro 5 + React islands + Tailwind v4 |
| **Modes** | Light mode primary, dark mode toggle |
| **Audience** | Hiring managers, design leaders, recruiters |
| **Philosophy** | "An animator's pencil test, mounted in a Vercel-grade frame" -- a natural history museum of creative evolution |

## Non-Negotiable Rules

1. **No pure black (#000000) or pure white (#FFFFFF) as backgrounds.** Surface-0 dark is `#0A0A0C`. Surface-0 light is `#FAF8F2`.
2. **No loading spinners.** Use skeleton placeholders (`.skeleton` class with shimmer).
3. **No emoji in UI.** Lucide icons only.
4. **Every animation respects `prefers-reduced-motion`.** No exceptions.
5. **Border radius:** 6px buttons/inputs, 12px portfolio cards, 4px tag badges. Never pill-shaped.
6. **GPU-only animations.** Only animate `transform` and `opacity`. Never animate height, width, or margin.
7. **Icon library:** Lucide only. 16px inline, 20px default, 24px hero.
8. **Spacing:** 4px base unit, shared token scale (space-1 through space-16).
9. **Error voice:** Calm, diagnostic, factual. No apologetic language, no humor.
10. **Form validation:** On submit only. No blur validation, no real-time validation.
11. **No bare easing.** Never use `ease`, `ease-in-out`. Use named curves: `--ease-standard`, `--ease-emphasized`, `--ease-decelerate`, `--ease-accelerate`, `--ease-smooth`.
12. **No pure gray neutrals.** All grays are tinted. `#666666` is banned.
13. **No purple/indigo gradients.** Not welcome here.
14. **No simultaneous entrance animations.** Elements always enter in staggered sequence.

## Color (V3 — Teal/Amber)

| Role | Light | Dark |
|------|-------|------|
| **Primary (Teal)** | `#0D7377` | `#14B8A6` |
| **Accent (Amber)** | `#B45309` | `#F59E0B` |
| **Ratio** | 80% teal / 20% amber | 80% teal / 20% amber |

## Typography

| Role | Font | Weights |
|------|------|---------|
| **Headings** | Sora | 500, 600, 700 (hero only) |
| **Body** | Inter | 400, 500 |
| **Monospace** | JetBrains Mono | 400, 500 |

## Architecture

- **Astro 5** file-based routing -- pages in `src/pages/`, React islands via `client:*` directives
- **Tailwind v4** -- uses `@theme` directive in CSS, no `tailwind.config.js`
- **Astro View Transitions** -- `<ClientRouter />` in BaseLayout, 250ms crossfade
- **Theme toggle:** Persisted via cookie `sw-theme`, inline `<script>` in layout prevents FOUC
- **Design tokens** in CSS custom properties (`src/styles/global.css`)
- **GSAP** for scroll choreography + split-text reveals
- **Lenis** for smooth scrolling (reinits on `astro:page-load`)
- **lucide-react** for React island components

## Key Decisions (V3 Implementation)

- **Hero:** Asymmetric 60/40 grid layout, `SplitTextReveal` for name (manual word-split, free GSAP), orchestrated 1.5s entrance sequence
- **Texture:** Inline SVG `feTurbulence` (baseFrequency 0.65), light: 0.03 opacity multiply, dark: 0.015 screen. 25s drift animation.
- **Registration marks:** Light mode only, CSS pseudo-elements. Crosshair, circle, "A-1" frame number. Max 3 visible, opacity < 0.2.
- **Cards:** Layered shadow in light (shadow + ring), border-only in dark. Hover: translateY(-2px). 250ms ease-standard.
- **Buttons:** 4 variants: `.btn-primary`, `.btn-accent`, `.btn-secondary`, `.btn-ghost`. Hover: translateY(-1px). Active: scale(0.98).
- **Scroll reveal:** 16px translateY, 400ms, 60ms stagger, IntersectionObserver at 15%.
- **Case study:** ScrollProgress bar (2px, CSS scroll-timeline with JS fallback), parallax zoom on images.
- **About page:** ImageSwiper drag-to-dismiss card deck (360x480px, perspective 700px).
- **Headshot:** 200px desktop / 180px mobile circle, grayscale→color hover, "SW" placeholder.

## Before Building Any UI

1. Read `DESIGN-SPEC-V3.md`
2. Check `docs/` for component mini-specs
3. After building, verify against the spec
