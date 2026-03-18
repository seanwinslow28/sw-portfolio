# CLAUDE.md -- SW Portfolio

## Read First

- **`DESIGN-SPEC.md`** is the single source of truth for all visual decisions. Read it before building any UI.
- **`docs/ProjectCard.md`** has the component mini-spec for the portfolio card component.

## Project Overview

| | |
|---|---|
| **Framework** | Astro 5 + React islands + Tailwind v4 |
| **Modes** | Light mode primary, dark mode toggle |
| **Audience** | Hiring managers, design leaders, recruiters |
| **Philosophy** | "Engineered precision that rewards you with moments of warmth" -- a tech-filled art museum |

## Non-Negotiable Rules

1. **No pure black (#000000) or pure white (#FFFFFF) as backgrounds.** Surface-0 dark is `#09090B`. Surface-0 light is `#FAFAF8`.
2. **No loading spinners.** Use skeleton placeholders.
3. **No emoji in UI.** Lucide icons only.
4. **Every animation respects `prefers-reduced-motion`.** No exceptions.
5. **Border radius:** 6px buttons/inputs, 12px portfolio cards. Never pill-shaped (exception: tag badges at 4px).
6. **GPU-only animations.** Only animate `transform` and `opacity`. Never animate height, width, or margin.
7. **Icon library:** Lucide only. 16px inline, 20px default, 24px hero. Use Astro-compatible imports.
8. **Spacing:** 4px base unit, shared token scale (space-1 through space-16).
9. **Error voice:** Calm, diagnostic, factual. No apologetic language, no humor.
10. **Form validation:** On submit only. No blur validation, no real-time validation.

## Color

| Role | Light | Dark |
|------|-------|------|
| **Primary (Blue)** | `#2563EB` | `#3B82F6` |
| **Secondary (Orange)** | `#C2410C` | `#F97316` |
| **Ratio** | 80% blue / 20% orange | 80% blue / 20% orange |

## Typography

| Role | Font | Weights |
|------|------|---------|
| **Headings** | Sora | 500, 600, 700 (hero only) |
| **Body** | Inter | 400, 500 |
| **Monospace** | JetBrains Mono | 400, 500 |

## Architecture

- **Astro 5** file-based routing -- pages in `src/pages/`, React islands via `client:*` directives
- **Tailwind v4** -- uses `@theme` directive in CSS, no `tailwind.config.js`
- **Theme toggle:** Persisted via cookie `sw-theme`, inline `<script>` in layout prevents FOUC
- **Design tokens** in CSS custom properties
- **lucide-react** installed for React island components

## Key Decisions (Completed Work)

These decisions were made during Phase 6 and should be maintained:

- **Hero section:** 90vh museum entrance, title uses `clamp(48px, 8vw, 72px)` for cinematic scale
- **Headshot:** 200px desktop / 180px mobile circle, "SW" initials as placeholder
- **Noise texture:** SVG `feTurbulence` at 0.025 opacity, 25s linear drift animation
- **Scroll cue:** `chevron-down` icon with 2s bounce animation
- **Featured card:** `grid-column: 1 / -1` full-width on desktop, title bumped to h3/SemiBold 600
- **Card thumbnails:** Warm `surface-2` backgrounds in light mode, no dark gradient overlays
- **Tag badges:** 4px border-radius (not pill-shaped), proper light mode token colors
- **Nav theme toggle:** Lucide Sun/Moon icons (desktop + mobile)
- **Contact dark mode:** Tokens were already correct, no changes needed

## Before Building Any UI

1. Read `DESIGN-SPEC.md`
2. Check `docs/` for component mini-specs
3. After building, verify against the spec
