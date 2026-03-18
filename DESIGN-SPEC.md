# SW Portfolio — Design Specification

> **Version:** 2.0
> **Date:** March 12, 2026
> **Scope:** This spec governs all design decisions for the PM Portfolio (`sw-portfolio/`). It is self-contained — read this file and nothing else before building.

---

## 1. Design Philosophy

**"Engineered precision that rewards you with moments of warmth."**

The portfolio is a **tech-filled art museum** — pristine, minimal containers that let expressive content shine. It draws from Linear and Vercel's engineering-grade UI patterns while introducing a signature blue-and-orange color identity rooted in Sean's creative background and NYC roots.

A narrative duality runs through the design: **light mode tells the origin story** (the artist — tactile, warm, pencils on construction paper), while **dark mode represents the present** (the creative technologist — precise, engineered, cool). This isn't decoration; it's storytelling through interface design.

**Core narrative:** "A creative who learned to think like a product manager." Creativity leads, PM rigor supports. The first 5 seconds should feel *creative* — visual, intriguing, alive. The PM substance reveals itself as you scroll deeper into case studies.

---

## 2. Shared Foundations

These fundamentals are consistent across all Sean Winslow projects.

### Spacing System

**4px base unit.** All spacing derives from multiples of 4px.

| Token | Value | Common Use |
|-------|-------|------------|
| `--space-1` | 4px | Tight internal padding (badge padding) |
| `--space-2` | 8px | Icon gaps, compact element spacing |
| `--space-3` | 12px | Default internal padding |
| `--space-4` | 16px | Standard element spacing |
| `--space-5` | 20px | Card internal padding |
| `--space-6` | 24px | Section padding, card gaps |
| `--space-8` | 32px | Major section gaps |
| `--space-10` | 40px | Large section dividers |
| `--space-12` | 48px | Page section spacing |
| `--space-16` | 64px | Hero spacing, major section breaks |

### Breakpoints

| Token | Value | Target |
|-------|-------|--------|
| `--bp-mobile` | 640px | Mobile devices |
| `--bp-tablet` | 768px | Tablets |
| `--bp-desktop` | 1024px | Desktop |
| `--bp-wide` | 1280px | Wide screens |

### Accessibility (Non-Negotiable)

- WCAG AA contrast ratios minimum on all text.
- All interactive elements have visible focus indicators: `2px solid var(--color-primary)` with `2px offset`.
- Keyboard navigation support on all interactive elements.
- Minimum `44x44px` touch targets on mobile.
- **Mandatory reduced-motion kill switch:**

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

### Motion Principles

- **Max transition duration:** 400ms. Nothing longer.
- **Micro-interactions (hover, focus):** 150–200ms.
- **Easing:** `ease-out` for entrances, `ease-in` for exits, `ease-in-out` for state changes.
- **GPU-only properties:** Only animate `transform` and `opacity`. Never animate `height`, `width`, or `margin`.

### Icon Library: Lucide

All icons use **Lucide** ([lucide.dev](https://lucide.dev)). Astro-compatible imports for this project.

| Token | Size | Usage |
|-------|------|-------|
| `--icon-sm` | 16px | Inline with text (badges, metadata) |
| `--icon-md` | 20px | Default. Navigation, buttons, card actions |
| `--icon-lg` | 24px | Page headers, standalone icon buttons |

**Rules:**
- Stroke only (Lucide default outline style, 2px stroke weight).
- No decorative icons — every icon serves a functional purpose.
- Consistent metaphors — once an icon is assigned to a concept, that mapping is fixed.

### Font Loading

Google Fonts — Sora, Inter, JetBrains Mono. Use `font-display: swap` and preload critical fonts.

### No Emoji

Emoji are never used in UI — not in copy, not in status labels, not in navigation. Use Lucide icons for visual accents.

### Micro-Copy Consistency

| Pattern | Rule | Example |
|---------|------|---------|
| Dates | Always ISO-ish: "Mar 3, 2026" | Not "3/3/26" or "March 3rd, 2026" |
| Times | 12-hour with am/pm, no space | "6:00am" not "6:00 AM" or "18:00" |
| Currency | Dollar sign, no space, 2 decimals | "$0.12" not "$ 0.12" or "$0.1" |
| Duration | Compact: "2m 5s" or "45s" | Not "2 minutes and 5 seconds" |
| Relative time | Use within last 24h: "3 hours ago" | Beyond 24h: absolute date |
| Percentages | No space before % | "33%" not "33 %" |

### Form Validation Timing

All form validation triggers **on submit**. No validation on blur, no real-time validation.

| Behavior | Spec |
|---------|------|
| Trigger | Validation runs when submit button is clicked. All errors appear at once. |
| Error display | All invalid fields show errors simultaneously. First invalid field receives focus. |
| Error clearing | Field error clears when user modifies that field's value (on `input` event). |
| Invalid field styling | Border color transitions to `--color-error` at `150ms ease`. Error text beneath field fades in at `150ms`. |
| Submit button | Always enabled. No disabled state based on validation. |

---

## 3. Color System

### Primary Palette

| Role | Token | Light Mode | Dark Mode | Usage |
|------|-------|------------|-----------|-------|
| Primary Blue | `--color-primary` | `#2563EB` | `#3B82F6` | Links, active states, primary buttons, selected items |
| Primary Blue Muted | `--color-primary-muted` | `#1E40AF` | `#60A5FA` | Hover states, secondary emphasis |
| Accent Orange | `--color-accent` | `#C2410C` | `#F97316` | CTAs, attention signals |
| Accent Orange Muted | `--color-accent-muted` | `#9A3412` | `#FB923C` | Hover states on accent elements |

### Semantic Colors

| Role | Token | Value | Usage |
|------|-------|-------|-------|
| Success | `--color-success` | `#22C55E` | Positive indicators |
| Warning | `--color-warning` | `#F97316` | Maps to accent orange |
| Error | `--color-error` | `#EF4444` | Form errors, failure states |
| Info | `--color-info` | `#3B82F6` | Maps to primary blue |

### Light Mode Surfaces (Primary Mode)

The portfolio's light mode uses an off-white canvas with subtle warmth — evoking construction paper, not sterile white.

| Token | Hex | Usage |
|-------|-----|-------|
| `--surface-0-light` | `#FAFAF8` | Page background (warm off-white) |
| `--surface-1-light` | `#F5F5F0` | Card backgrounds |
| `--surface-2-light` | `#EBEBE4` | Elevated elements, hover states |
| `--surface-3-light` | `#D4D4CC` | Borders, dividers |
| `--text-primary-light` | `#18181B` | Primary text |
| `--text-secondary-light` | `#52525B` | Secondary text |
| `--text-tertiary-light` | `#A1A1AA` | Captions, metadata |

### Dark Mode Surfaces (Toggle Mode)

| Token | Hex | Usage |
|-------|-----|-------|
| `--surface-0` | `#09090B` | App background (near-black, NOT pure black) |
| `--surface-1` | `#18181B` | Cards, elevated surfaces |
| `--surface-2` | `#27272A` | Hover states, secondary containers |
| `--surface-3` | `#3F3F46` | Borders, dividers |
| `--text-primary` | `#FAFAFA` | Primary text |
| `--text-secondary` | `#A1A1AA` | Secondary/muted text |
| `--text-tertiary` | `#71717A` | Placeholder, disabled states |

### Color Behavior Across Modes

The accent colors shift between modes to reinforce the narrative:

- **Light mode:** Blues and oranges are **deeper/muted** — slate-blue (`#1E40AF`), terracotta-orange (`#C2410C`). Sophisticated, earthy, analog.
- **Dark mode:** Blues and oranges are **brighter/saturated** — electric blue (`#3B82F6`), vivid amber-orange (`#F97316`). The creative technologist wakes up.

### Usage Ratio: 80/20 Blue/Orange

- **Blue: ~80% of accent usage.** Links, selections, primary actions, active states.
- **Orange: ~20% of accent usage.** CTAs, attention signals. Used for "View Project" buttons and contact CTA. Never use them at equal weight.

---

## 4. Typography

### Font Stack

| Role | Font | Weight Range |
|------|------|--------------|
| Display/Headings | **Sora** | 500 (Medium), 600 (SemiBold), 700 (Bold — hero display only) |
| Body | **Inter** | 400 (Regular), 500 (Medium) |
| Monospace | **JetBrains Mono** | 400 (Regular), 500 (Medium) |

### Type Scale

| Token | Size | Line Height | Usage |
|-------|------|-------------|-------|
| `--text-display` | 48px / 3rem | 1.1 | Hero headings only |
| `--text-h1` | 36px / 2.25rem | 1.2 | Page titles |
| `--text-h2` | 28px / 1.75rem | 1.3 | Section headings |
| `--text-h3` | 22px / 1.375rem | 1.4 | Subsection headings |
| `--text-h4` | 18px / 1.125rem | 1.4 | Card titles, labels |
| `--text-body` | 16px / 1rem | 1.6 | Body text |
| `--text-small` | 14px / 0.875rem | 1.5 | Metadata, captions |
| `--text-caption` | 12px / 0.75rem | 1.4 | Labels, badges, timestamps |
| `--text-mono` | 14px / 0.875rem | 1.6 | Code, data values |

### Font Weight Rules

- **Headings:** Sora Medium 500 for most headings. SemiBold 600 for hero/display only. Bold 700 reserved for the hero display text only.
- **Body:** Inter Regular 400. Medium 500 sparingly for inline emphasis.
- **Monospace:** JetBrains Mono Regular 400. Medium 500 for highlighted entries.
- **Never use font weights below 400.**

### Typographic Signature

Sora is the portfolio's visual signature — it separates this portfolio from 95% of developer/PM portfolios using Inter or system fonts.

| Approach | Spec |
|---------|------|
| Scale contrast | Hero headings at display scale (`48px+`), creating dramatic ratio against `16px` body. Like a museum title card beside its description placard. |
| Spatial relationship | Headings positioned in deliberate relationship to adjacent visuals — composed layouts where type and image create visual triangles. |
| Weight restraint | Sora at Medium 500 and SemiBold 600 only. The restraint *is* the sophistication. |
| Consistency | Every page uses Sora for headings. Section headings, case study titles, About page — Sora does the identity work everywhere. |

---

## 5. Layout & Grid

- **Max content width:** 1200px
- **Single column for case study text:** 720px max, full-width for media
- **Homepage project grid:** Responsive, 1–2 columns
- **Horizontal padding:** 24px (mobile), 48px (tablet), 64px (desktop)

### Information Density

Spacious. Generous whitespace. Content breathes. The museum analogy — space between exhibits.

---

## 6. Component Patterns

### Cards

```
Portfolio Cards (Light Mode):
- Background: var(--surface-1-light)
- Border: 1px solid var(--surface-3-light)
- Border Radius: 12px
- Shadow: 0 1px 3px rgba(0,0,0,0.04)
- Hover: subtle lift (translateY -2px) + shadow increase
- Padding: var(--space-6)

Portfolio Cards (Dark Mode):
- Background: var(--surface-1)
- Border: 1px solid var(--surface-3)
- Border Radius: 12px
- Shadow: none (borders define edges in dark mode)
- Hover: border color lightens to var(--text-tertiary)
- Padding: var(--space-6)
```

### Buttons

| Variant | Background | Text | Border | Usage |
|---------|-----------|------|--------|-------|
| Primary | `var(--color-primary)` | `#FFFFFF` | none | Main actions |
| Accent | `var(--color-accent)` | `#FFFFFF` | none | CTAs ("View Project") |
| Secondary | transparent | `var(--text-primary)` | 1px `var(--surface-3)` | Cancel, secondary |
| Ghost | transparent | `var(--text-secondary)` | none | Tertiary, icon buttons |

- Border radius: 6px (all buttons)
- Padding: 8px 16px
- Transition: 150ms ease on background and border color
- No pill-shaped buttons.

### Input Fields

- Background: `var(--surface-0)` with 1px border `var(--surface-3)`
- Focus: border color transitions to `var(--color-primary)`
- Border radius: 6px
- Height: 40px
- Placeholder text: `var(--text-tertiary)`

### Navigation — Minimal Top Bar

| Element | Spec |
|---------|------|
| Position | Fixed top, hides on scroll down, reveals on scroll up |
| Left | "Sean Winslow" in Sora Medium 500 |
| Right | Work \| About \| Contact — Inter Medium 500 |
| Background | `var(--surface-0-light)` with subtle backdrop-blur |
| Height | 64px |
| Dark mode toggle | Lucide Sun/Moon icons in nav |

---

## 7. Motion & Interaction

### Portfolio-Specific Motion

- **Scroll-triggered reveals:** Content sections fade in and translate up slightly as they enter the viewport. Staggered timing for multi-element sections.
- **Video-as-hero thumbnails:** Project cards show a static image by default. On hover, autoplay a short loop. Proves work is real, not mockups.
- **Cinematic scroll:** Lenis for smooth scrolling. GSAP ScrollTrigger for parallax and timeline-based scroll sequences.
- **Metric count-up:** Key metrics count up from 0 when entering the viewport. Max 2.0s duration, ease-out curve.
- **Page transitions:** Subtle crossfade between pages (200–300ms).

---

## 8. Portfolio Hero & Creative Signature

### Atmospheric Entrance

The homepage hero is the museum entrance — a welcoming atmosphere that invites the visitor to scroll down and explore.

| Element | Spec |
|---------|------|
| Name/Title | "Sean Winslow" in Sora SemiBold 600, `clamp(48px, 8vw, 72px)`. Typography is the dominant visual element — oversized, confident, museum-title-card energy. |
| Tagline | One authored line beneath the name. Sora Medium 500, `--text-h3` (22px), `--text-secondary-light`. Should feel written by a person, not generated. |
| Headshot | 200px desktop / 180px mobile circle. Black-and-white by default (`filter: grayscale(100%)`). "SW" initials as placeholder until real photo. |
| Background | Subtle animated construction paper texture on `--surface-0-light`. Low-opacity noise texture (2–3% via SVG feTurbulence at 0.025 opacity) with slow drift (25s linear, infinite). |
| Vertical height | 85–95vh to fill the viewport and create "scroll to enter" beat. |
| Scroll cue | Lucide chevron-down with 2s bounce animation. |

### Headshot Interaction: B&W to Color Reveal

| Element | Spec |
|---------|------|
| Default | `filter: grayscale(100%)` |
| Hover/tap | `filter: grayscale(0%)` over `400ms ease-out`. Full color blooms. |
| Reduced motion | Instant toggle (no animation), but hover still works. |

### Construction Paper Texture — Accessibility

When `prefers-reduced-motion: reduce` is active, the background texture is static (no drift animation). The texture itself remains visible.

---

## 9. Image Swiper (About Page)

| Element | Spec |
|---------|------|
| Card size | 360x480px desktop, responsive scaling on mobile |
| Stack | CSS `perspective(700px)` with depth offset per card. 3D fan/cascade effect. |
| Interaction | Drag/swipe to dismiss top card. Auto-triggers at 50px drag threshold. Cards rotate proportionally to drag distance. |
| Content | Art-style portraits — illustrated, stylized, or filtered variations. Full color. |
| Swipe indicator | "Swipe me" label with gentle bob animation. Desktop only. |
| Mobile | Touch-native swipe. Simplified animation (no rotation). |
| Reduced motion | Swipe still works but cards transition instantly. |

---

## 10. Creative Differentiation

The portfolio's personality comes from the **content** displayed inside the museum's clean containers — not from decorating the containers themselves.

### Museum Architecture vs. Exhibition Content

The spec defines the museum architecture: clean surfaces, precise typography, consistent spacing. The exhibitions are what make the museum worth visiting.

### Content as Personality

- **Case study exhibits:** Each case study page is a curated exhibition. Find and adapt standout interactive components from CodePen, 21st.dev, and creative GitHub repos. Scroll-triggered animations, interactive data visualizations, creative transitions — these live INSIDE the case study pages, not in the site-level UI.
- **Creative assets:** Sean's art, animations, and original work displayed within the clean containers. The contrast between the museum's restraint and the content's expressiveness is the signature.
- **Interactive components:** Hand-picked interactive components (CodePen trending, 21st.dev, GitHub repos) adapted and displayed as exhibit pieces. They are content, not UI chrome.

### What This Means in Practice

- The site-level navigation, cards, typography, and layout stay clean and restrained.
- Inside a case study page, an embedded interactive CodePen or creative animation is welcome — it's an exhibit.
- Retro content (pixel art, 16BitFit screenshots) appears as CONTENT inside case study exhibits, never as UI decoration.

---

## 11. Error Patterns

Limited to the contact form (portfolio is primarily static Astro SSR).

### Error Voice: Calm & Diagnostic

Factual, unemotional, precise. No apologetic language, no humor, no exclamation marks.

| Context | Error Copy |
|---------|-----------|
| Form field required | "This field is required." |
| Form submission failure | "Message couldn't be sent. Try emailing sean@seanwinslow.com directly." |
| Network error | "Can't reach the server. Check your connection and try again." |

### Error Display

- **Inline field error:** Beneath the invalid field. Inter Regular 400, `--text-small` (14px), `--color-error`.

---

## 12. Loading States

The portfolio uses **skeleton placeholders** for content sections. Pages are primarily static (Astro SSR) and load fast. No spinners. No illustrated loading states (those are for the SPA dashboards).

---

## 13. Anti-Patterns

These are specific things to **never do** on the portfolio.

1. **No Cheesecake Factory menus.** Never overwhelm with equally-weighted options. Curate ruthlessly.
2. **No shader/gradient hero backgrounds.** Heroes are clean with intentional content, not decorative effects.
3. **No pixel fonts or retro UI chrome.** Retro/pixel art appears only as *content* in case studies, never as UI decoration, buttons, icons, or typography.
4. **No fire-alarm alerts.** Errors are communicated calmly.
5. **No pure white backgrounds.** Use warm off-white (`#FAFAF8`), never `#FFFFFF`.
6. **No pure black backgrounds.** Use near-black (`#09090B`), never `#000000`.
7. **No choose-your-own-adventure case studies.** Case studies are cinematic linear scrolls — guided narrative, not tabbed exploration.
8. **No excessive bold text or bullet-heavy layouts.** Keep text natural and readable.
9. **No gratuitous animation.** Every animation must serve a purpose.
10. **No competing accent colors.** Blue and orange at 80/20 ratio. Never equal weight.

---

## 14. Reference Board

### Structural & UI References

| Reference | What to Draw From |
|-----------|------------------|
| **Linear** | Dark mode surface hierarchy, information density, card patterns |
| **Vercel** | Dark grid patterns, engineering feel, premium dark marketing pages |

### Portfolio References

| Reference | What to Draw From |
|-----------|------------------|
| **Brittany Chiang** | Dark portfolio, clean hierarchy, monospace accents, lets work speak |
| **Fine Thought** | Minimal, experimental, subtle interactivity, clean canvas |
| **Keita Yamada** | Clean, concise, light/dark toggle, tasteful restraint |

### Typography References

| Font | What It Brings |
|------|---------------|
| **Sora** | Geometric precision with human warmth. "A creative who thinks systematically." |
| **Inter** | Body text standard. Engineering clarity. |
| **JetBrains Mono** | Monospace for code and data. Highly readable. |

---

## 15. Tech Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Framework | **Astro 5** | Ships zero JS by default. Islands Architecture hydrates only interactive components. |
| Interactive Islands | **React** (within Astro) | Reuse React skills for interactive pieces (galleries, AI demos). |
| Styling | **Tailwind CSS v4** | Tiny CSS payload, shared token system. |
| Scroll/Animation | **GSAP** + **Lenis** | GSAP for scroll-triggered storytelling. Lenis for smooth scrolling (~3KB). |
| Hosting | **Netlify** (free tier) | Simple, fast CDN deployment. |

### Structure

| Page | Route | Purpose |
|------|-------|---------|
| Homepage | `/` | Hero + 5 project cards gallery (museum lobby) |
| Case Study | `/work/campus-201` | Cinematic scroll: hero, challenge, process, solution, outcomes |
| About | `/about` | Three chapters: Origin (artist), Evolution (skills), Present (philosophy) |
| Contact | `/contact` | Form + social links |

### Theme Persistence

Dark/light mode toggle uses cookies (`sw-theme`). Inline script in `<head>` prevents flash on load.

---

*This specification represents committed design decisions for the SW Portfolio. Every choice was made deliberately. When in doubt, return to the core philosophy: "Engineered precision that rewards you with moments of warmth." The museum architecture stays clean — the content inside the exhibits provides the personality.*
