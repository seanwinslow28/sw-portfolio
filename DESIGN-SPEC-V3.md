# SW Portfolio — Design Specification

> **Version:** 3.0
> **Date:** April 2, 2026
> **Scope:** This spec governs all design decisions for the PM Portfolio (`sw-portfolio/`). It is self-contained — read this file and nothing else before building.
> **Evolution from V2:** Refined color identity (deep teal + warm amber), pencil-test paper texture system, signature character animation, scroll choreography, editorial layout, and premium interaction details. The museum metaphor deepens — now it's a *natural history museum of creativity*, where pencil-test animation paper is the material language.

---

## 1. Design Philosophy

**"An animator's pencil test, mounted in a Vercel-grade frame."**

The portfolio is a **natural history museum of creative evolution** — engineering-precise containers that showcase expressive, hand-made content. The site architecture channels Vercel's crisp, dark engineering aesthetic while the content and texture language draws from traditional animation: pencil tests, registration marks, aged paper, frame numbers.

A narrative duality runs through the design: **light mode tells the origin story** (the animator — tactile, warm, pencil on animation paper), while **dark mode represents the present** (the creative technologist — precise, engineered, luminous). This isn't decoration; it's autobiography through interface design.

**Core narrative:** "A creative who learned to think like a product manager." The first 5 seconds should feel *handmade* — the pencil-test texture, the illustrated character, the warmth of aged paper. Then as you scroll, the museum's engineering precision reveals itself. The PM substance lives deeper in the case studies.

**The duality in one sentence:** Pencil-test paper meets Vercel deployment logs.

### Design Movements This Draws From

| Movement | What We Take | What We Leave Behind |
|----------|-------------|---------------------|
| **Minimal Luxury** | Extreme whitespace, muted tones, restraint | The coldness, the impersonality |
| **Editorial / Swiss** | Strong typographic hierarchy, grid discipline | Rigid symmetry |
| **Vercel Engineering** | Dark mode precision, monospace accents, card patterns | The corporate anonymity |
| **Animation Studio** | Pencil-test textures, registration marks, frame numbers | Cartoon aesthetics in UI chrome |

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

- **Max transition duration:** 400ms for micro-interactions. Up to 800ms for page entrance sequences only.
- **Micro-interactions (hover, focus):** 150–200ms.
- **GPU-only properties:** Only animate `transform` and `opacity`. Never animate `height`, `width`, or `margin`.

#### Easing Curves (Named, Not Generic)

Never use bare `ease` or `ease-in-out`. Use these named curves:

| Token | Value | Use Case |
|-------|-------|----------|
| `--ease-standard` | `cubic-bezier(0.2, 0, 0, 1)` | Most UI transitions |
| `--ease-emphasized` | `cubic-bezier(0.05, 0.7, 0.1, 1)` | Entrances, important state changes |
| `--ease-decelerate` | `cubic-bezier(0, 0, 0, 1)` | Elements entering the viewport |
| `--ease-accelerate` | `cubic-bezier(0.3, 0, 1, 1)` | Elements leaving the viewport |
| `--ease-smooth` | `cubic-bezier(0.33, 1, 0.68, 1)` | Scroll-linked animations |

#### Duration Scale

| Category | Duration | Use Case |
|----------|----------|----------|
| Micro | 100–150ms | Button press, toggle, icon state change |
| Small | 200–300ms | Hover states, tooltips, card hover lift |
| Medium | 300–400ms | Panel reveals, card transitions, B&W-to-color |
| Large | 500–800ms | Page entrance sequence, hero reveal |
| Dramatic | 800–1200ms | First-load character animation (hero only) |

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

Google Fonts — Sora, Inter, JetBrains Mono. Use `font-display: swap` and preload critical fonts (Sora 500/600, Inter 400).

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
| Invalid field styling | Border color transitions to `--color-error` at `150ms var(--ease-standard)`. Error text beneath field fades in at `150ms`. |
| Submit button | Always enabled. No disabled state based on validation. |

---

## 3. Color System

### Evolution from V2

V2 used standard blue (#2563EB) and orange (#C2410C). V3 shifts to a **deep teal** primary and **warm amber** accent — inspired by the Stitch color exploration. This palette is more distinctive, more "museum curator," and more harmonious with the pencil-test paper warmth. Teal reads as *thoughtful and precise* without being corporate blue. Amber reads as *creative warmth* without being generic orange.

### Primary Palette

| Role | Token | Light Mode | Dark Mode | Usage |
|------|-------|------------|-----------|-------|
| Primary Teal | `--color-primary` | `#0D7377` | `#14B8A6` | Links, active states, primary buttons, selected items |
| Primary Teal Deep | `--color-primary-deep` | `#0A5B5E` | `#0D9488` | Hover states, secondary emphasis |
| Primary Teal Muted | `--color-primary-muted` | `#0D737714` | `#14B8A614` | Tinted backgrounds (8% opacity) |
| Accent Amber | `--color-accent` | `#B45309` | `#F59E0B` | CTAs, attention signals, creative warmth |
| Accent Amber Deep | `--color-accent-deep` | `#92400E` | `#D97706` | Hover states on accent elements |

### Tinted Neutrals (Not Pure Gray)

Every neutral picks up a hint of the teal hue. Pure grays (#666, #888, #AAA) are banned — they feel lifeless against the warm paper texture.

### Light Mode Surfaces (Primary Mode)

The portfolio's light mode uses a warm **animation paper** canvas — the slightly yellowed, fibrous surface of a traditional pencil test sheet. Not sterile white, not aggressive cream. The color of paper that's been handled, worked on, lived with.

| Token | Hex | Usage |
|-------|-----|-------|
| `--surface-0-light` | `#FAF8F2` | Page background (animation paper warm) |
| `--surface-1-light` | `#F3F0E8` | Card backgrounds (slightly aged paper) |
| `--surface-2-light` | `#E8E4DA` | Elevated elements, hover states |
| `--surface-3-light` | `#D1CCBF` | Borders, dividers (pencil-line gray) |
| `--text-primary-light` | `#1A1A1E` | Primary text (near-black with warmth) |
| `--text-secondary-light` | `#4A4A52` | Secondary text (teal-tinted dark) |
| `--text-tertiary-light` | `#8A8A8F` | Captions, metadata |

### Dark Mode Surfaces (Toggle Mode)

Dark mode shifts the museum into its evening exhibition — cool, precise, luminous accents against deep surfaces. The pencil-test warmth recedes; the engineering precision advances.

| Token | Hex | Usage |
|-------|-----|-------|
| `--surface-0-dark` | `#0A0A0C` | App background (near-black, warm undertone) |
| `--surface-1-dark` | `#161618` | Cards, elevated surfaces |
| `--surface-2-dark` | `#232326` | Hover states, secondary containers |
| `--surface-3-dark` | `#38383D` | Borders, dividers |
| `--text-primary-dark` | `#F5F5F0` | Primary text (warm white, not blue-white) |
| `--text-secondary-dark` | `#9A9A9F` | Secondary/muted text |
| `--text-tertiary-dark` | `#636368` | Placeholder, disabled states |

### Semantic Colors

| Role | Token | Light | Dark | Usage |
|------|-------|-------|------|-------|
| Success | `--color-success` | `#15803D` | `#22C55E` | Positive indicators |
| Warning | `--color-warning` | `#B45309` | `#F59E0B` | Maps to accent amber |
| Error | `--color-error` | `#DC2626` | `#EF4444` | Form errors, failure states |
| Info | `--color-info` | `#0D7377` | `#14B8A6` | Maps to primary teal |

### Color Behavior Across Modes

The accent colors shift between modes to reinforce the narrative:

- **Light mode:** Teal and amber are **deeper/muted** — forest teal (`#0D7377`), dark amber (`#B45309`). Earthy, analog, the warm studio. Colors feel like they could have been mixed from pigment.
- **Dark mode:** Teal and amber are **brighter/saturated** — electric teal (`#14B8A6`), vivid amber (`#F59E0B`). The creative technologist's screen glow. Colors feel emissive, like LEDs.

### Usage Ratio: 80/20 Teal/Amber

- **Teal: ~80% of accent usage.** Links, selections, primary actions, active states, focus rings.
- **Amber: ~20% of accent usage.** CTAs, "View Project" buttons, contact CTA, attention moments. Never equal weight with teal.

### Color + Texture Harmony

The teal-and-amber palette was chosen specifically because both colors look natural against aged paper. Teal reads like a deliberate ink choice; amber reads like warm lamplight on the page. This harmony between color and texture is the spec's visual foundation.

---

## 4. Typography

### Font Stack

| Role | Font | Weight Range | Character |
|------|------|--------------|-----------|
| Display/Headings | **Sora** | 500 (Medium), 600 (SemiBold), 700 (Bold — hero display only) | Geometric precision with human warmth — "a creative who thinks systematically" |
| Body | **Inter** | 400 (Regular), 500 (Medium) | Engineering clarity, disappears into readability |
| Monospace | **JetBrains Mono** | 400 (Regular), 500 (Medium) | Code and data — the engineer's notation |

### Type Scale

| Token | Size | Line Height | Letter Spacing | Usage |
|-------|------|-------------|----------------|-------|
| `--text-display` | `clamp(48px, 8vw, 72px)` | 1.05 | `-0.02em` (tracking-tight) | Hero heading only. Cinematic scale. |
| `--text-h1` | 36px / 2.25rem | 1.15 | `-0.015em` | Page titles |
| `--text-h2` | 28px / 1.75rem | 1.25 | `-0.01em` | Section headings |
| `--text-h3` | 22px / 1.375rem | 1.35 | `normal` | Subsection headings, featured card titles |
| `--text-h4` | 18px / 1.125rem | 1.4 | `normal` | Card titles, labels |
| `--text-body` | 16px / 1rem | 1.625 | `normal` | Body text |
| `--text-small` | 14px / 0.875rem | 1.5 | `normal` | Metadata, captions |
| `--text-caption` | 12px / 0.75rem | 1.4 | `0.01em` (tracking-wide) | Labels, badges, timestamps, registration marks |
| `--text-mono` | 14px / 0.875rem | 1.6 | `normal` | Code, data values |

### Font Weight Rules

- **Headings:** Sora Medium 500 for most headings. SemiBold 600 for hero/display and featured card titles. Bold 700 reserved exclusively for the hero display text.
- **Body:** Inter Regular 400. Medium 500 sparingly for inline emphasis.
- **Monospace:** JetBrains Mono Regular 400. Medium 500 for highlighted entries.
- **Never use font weights below 400.**

### Typographic Signature

Sora is the portfolio's visual identity. Combined with the teal palette and paper texture, it creates a look that no other PM/dev portfolio has.

| Approach | Spec |
|---------|------|
| Scale contrast | Hero heading at `clamp(48px, 8vw, 72px)` against `16px` body — a 4.5:1 ratio. Museum title card energy. |
| Tight tracking on headings | All h1-display headings use negative letter-spacing (`-0.01em` to `-0.02em`). Tightened type reads as confident and intentional. |
| Spatial relationship | Headings positioned in deliberate relationship to adjacent visuals — composed layouts where type and image create visual triangles. |
| Weight restraint | Sora at Medium 500 and SemiBold 600. The restraint *is* the sophistication. |
| Monospace accents | JetBrains Mono for metadata, dates, frame numbers — the "engineer's handwriting" alongside the artist's display type. Creates the duality in miniature. |

### Typography as Entrance (Hero Only)

The hero heading uses a **split-text mask reveal** on page load via GSAP SplitText:

1. Each line of "Sean Winslow" is masked (overflow hidden on line container)
2. Lines translate up from below the mask, staggered 80ms apart
3. Easing: `--ease-emphasized` (`cubic-bezier(0.05, 0.7, 0.1, 1)`)
4. Duration: 600ms per line
5. Tagline fades in 200ms after name completes
6. `prefers-reduced-motion`: simple opacity fade, no translate

---

## 5. Layout & Grid

### Content Widths

| Context | Max Width | Rationale |
|---------|-----------|-----------|
| Global max | 1200px | Comfortable reading, generous margins |
| Case study prose | 720px | Optimal reading line length |
| Full-bleed media | 100vw | Case study images/videos break out of prose width |
| Hero content | 960px | Slightly narrower than max for intimacy |

### Grid Strategy: Editorial, Not Card Grid

The homepage layout uses an **asymmetric editorial composition**, not a uniform card grid. This is a museum gallery wall — pieces are hung at different scales and positions to create visual flow.

| Section | Layout |
|---------|--------|
| Hero | Full-width, centered content, 90vh |
| Featured project | Full-width card spanning the grid (`grid-column: 1 / -1`), asymmetric 60/40 split between thumbnail and text |
| Project grid | 2-column on desktop, but with **varied card heights** — some cards have thumbnails, some are text-dominant. The grid breathes. |
| About page | Three-chapter scroll. Each chapter uses a different layout: portrait-left for Origin, centered for Evolution, full-width for Present |
| Case study | Single-column editorial with full-bleed breakouts for media. Like a long-form magazine article. |

### Horizontal Padding

| Breakpoint | Padding |
|------------|---------|
| Mobile (<640px) | 24px |
| Tablet (640-1024px) | 48px |
| Desktop (>1024px) | 64px |

### Information Density

Spacious. Generous whitespace. Content breathes. The museum analogy — space between exhibits. **But not empty** — the pencil-test paper texture fills negative space with warmth, so whitespace never feels cold or sparse.

---

## 6. Texture System: Pencil-Test Paper

This is the portfolio's most distinctive visual layer — the thing that makes someone say "I've never seen a portfolio that looks like this."

### The Concept

Traditional animation pencil tests are drawn on specialized paper: slightly off-white, lightly textured, with pre-printed registration marks (the circles and crosshairs that keep frames aligned). The paper ages with handling — edges soften, surfaces warm. This portfolio uses that material language as its canvas.

### Implementation Layers

#### Layer 1: Paper Base Color
- Light mode: `--surface-0-light` (`#FAF8F2`) — the warm base of animation paper
- Dark mode: `--surface-0-dark` (`#0A0A0C`) — the paper is gone; you're looking at the lightbox underneath

#### Layer 2: Paper Grain (SVG feTurbulence)

```css
/* Inline SVG noise texture — no network request */
.paper-texture::before {
  content: '';
  position: fixed;
  inset: 0;
  opacity: 0.03; /* Subtle — felt, not seen */
  pointer-events: none;
  z-index: 9999;
  background-image: url("data:image/svg+xml,..."); /* feTurbulence baseFrequency="0.65" */
  mix-blend-mode: multiply;
}
```

- Light mode: `opacity: 0.03`, `mix-blend-mode: multiply` — adds fiber texture to the warm paper
- Dark mode: `opacity: 0.015`, `mix-blend-mode: screen` — barely-there film grain, like sensor noise

#### Layer 3: Paper Drift Animation

A very slow positional shift on the noise layer creates the sense of living, organic texture — like paper fibers catching light as you shift your viewing angle.

- Transform: `translateX` oscillation, ±10px over 25s
- Easing: `linear` (constant, ambient motion)
- `prefers-reduced-motion`: static position, texture remains visible

#### Layer 4: Registration Marks (Light Mode Only)

Subtle registration-mark motifs appear at structural boundaries — the pre-printed alignment guides from animation paper. These are **CSS-only decorative elements**, not images.

| Element | Where It Appears | How |
|---------|-----------------|-----|
| Cross-hair mark | Top-left corner of the hero section | Thin `+` shape in `--text-tertiary-light`, 20px, `opacity: 0.15` |
| Circle mark | Near section transitions | 12px circle outline, `--text-tertiary-light`, `opacity: 0.12` |
| Frame number | Bottom-right of hero | JetBrains Mono `--text-caption`, "A-1" in `--text-tertiary-light` |

**Rules for registration marks:**
- Light mode only. In dark mode, the metaphor is the lightbox, not the paper.
- Maximum 3 visible at any scroll position. Never cluttered.
- Always `--text-tertiary-light` color, always below 0.2 opacity. Peripheral vision, not focal.
- They are architectural detail, like seams in a museum wall. Not decoration.

---

## 7. Component Patterns

### Cards

```
Portfolio Cards (Light Mode):
- Background: var(--surface-1-light)
- Border: 1px solid var(--surface-3-light)
- Border Radius: 12px
- Shadow: 0 1px 3px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.02)  /* layered: shadow + ring */
- Hover: translateY(-2px) + shadow deepens to 0 4px 12px rgba(0,0,0,0.08)
- Hover transition: 250ms var(--ease-standard)
- Padding: var(--space-6)

Portfolio Cards (Dark Mode):
- Background: var(--surface-1-dark)
- Border: 1px solid var(--surface-3-dark)
- Border Radius: 12px
- Shadow: none (borders define edges in dark mode — lighter surface = higher elevation)
- Hover: border color transitions to var(--text-tertiary-dark), background lightens to var(--surface-2-dark)
- Hover transition: 250ms var(--ease-standard)
- Padding: var(--space-6)
```

#### Card Entrance Animation (Scroll-Triggered)

Cards fade up as they enter the viewport, staggered within the grid:

- `opacity: 0` → `1`, `translateY(16px)` → `0`
- Duration: 400ms, easing: `--ease-decelerate`
- Stagger: 60ms between sibling cards
- Trigger: Intersection Observer at 15% visibility threshold
- `prefers-reduced-motion`: instant appearance, no translate

### Buttons

| Variant | Background | Text | Border | Usage |
|---------|-----------|------|--------|-------|
| Primary | `var(--color-primary)` | `#FFFFFF` | none | Main actions |
| Accent | `var(--color-accent)` | `#FFFFFF` | none | CTAs ("View Project") |
| Secondary | transparent | `var(--text-primary)` | 1px `var(--surface-3)` | Cancel, secondary |
| Ghost | transparent | `var(--text-secondary)` | none | Tertiary, icon buttons |

#### Button Interaction States

| State | Spec |
|-------|------|
| Default | As specified above |
| Hover | `translateY(-1px)`, background darkens 10%. 200ms `--ease-standard` |
| Active/Press | `translateY(1px)`, `scale(0.98)`. 100ms `--ease-standard` |
| Focus-visible | `ring-2 ring-primary/50 ring-offset-2 ring-offset-surface-0` |
| Disabled | `opacity: 0.5`, `cursor: not-allowed` |

- Border radius: 6px (all buttons)
- Padding: 8px 16px
- No pill-shaped buttons.

### Input Fields

- Background: `var(--surface-0)` with 1px border `var(--surface-3)`
- Focus: border color transitions to `var(--color-primary)`, `ring-2 ring-primary/20`
- Border radius: 6px
- Height: 40px
- Placeholder text: `var(--text-tertiary)`
- Transition: 150ms `--ease-standard` on border and ring

### Navigation — Minimal Top Bar

| Element | Spec |
|---------|------|
| Position | Fixed top, hides on scroll down, reveals on scroll up |
| Left | "Sean Winslow" in Sora Medium 500 |
| Right | Work \| About \| Contact — Inter Medium 500 |
| Background | `var(--surface-0-light)` / `var(--surface-0-dark)` with `backdrop-filter: blur(12px)` and `background-color` at 85% opacity |
| Height | 64px |
| Dark mode toggle | Lucide Sun/Moon icons in nav |
| Scroll hide/reveal | 300ms `--ease-standard`, transforms only |
| Active link | `--color-primary` text color, no underline |

---

## 8. Portfolio Hero & Creative Signature

### The Signature Moment

Every Awwwards-caliber site has ONE interaction that makes someone screenshot it. This portfolio's signature is the **pencil-test character** — an illustrated, hand-drawn Sean that bridges the artist origin story with the polished museum architecture.

### Hero Layout: The Museum Entrance

The homepage hero is a full-viewport entrance that establishes the duality: hand-drawn character on engineering-precise typography.

| Element | Spec |
|---------|------|
| Layout | Asymmetric. Name/tagline left-aligned (60% width). Character illustration right-positioned. Not centered — editorial composition. |
| Name | "Sean Winslow" in Sora Bold 700, `clamp(48px, 8vw, 72px)`. The dominant element. Tight tracking (`-0.02em`). |
| Tagline | One authored line beneath the name. Sora Medium 500, `--text-h3` (22px), `--text-secondary`. Should feel written by a person, not generated. |
| Character | The pencil-test Sean illustration. MP4/GIF animation loop. Positioned right of text, vertically centered. ~300px wide on desktop, scales down on mobile. |
| Background | Pencil-test paper texture (Layer 1-3 from texture system). Registration marks visible (Layer 4). |
| Frame number | "A-1" in JetBrains Mono `--text-caption` near the character, like a pencil-test frame label. `opacity: 0.2`. |
| Vertical height | 90vh — fill the viewport, create "scroll to enter" beat. |
| Scroll cue | Lucide `chevron-down` with 2s bounce animation, positioned center-bottom. |

### Character Animation Behavior

| State | Spec |
|-------|------|
| Format | MP4 (primary) with GIF fallback. Transparent background or paper-matched background. |
| Loop | Subtle idle animation — breathing, pencil twirl, slight weight shift. 4-8s loop. |
| Loading | Static first frame displayed immediately (poster frame). Animation loads progressively. |
| Mobile | Smaller scale (~200px), positioned above the name/tagline (stacked layout). |
| Reduced motion | Static illustration (first frame / poster), no animation playback. |

### Headshot Fallback (Until Character Is Ready)

If the animated character isn't available yet, fall back to the V2 headshot spec:

| Element | Spec |
|---------|------|
| Size | 200px desktop / 180px mobile circle |
| Default | `filter: grayscale(100%)` |
| Hover/tap | `filter: grayscale(0%)` over `400ms --ease-standard`. Full color blooms. |
| Placeholder | "SW" initials in Sora SemiBold on `--surface-2` background |

### Page Entrance Choreography

The hero doesn't just appear — it's **orchestrated**. Elements enter in sequence, building anticipation:

| Step | Element | Delay | Animation |
|------|---------|-------|-----------|
| 1 | Paper texture | 0ms | Instant — it's the canvas, already there |
| 2 | Navigation | 0ms | Fade in, `opacity: 0 → 1`, 300ms `--ease-decelerate` |
| 3 | Name ("Sean Winslow") | 200ms | Split-text line mask reveal, 600ms per line, 80ms stagger |
| 4 | Tagline | 600ms | Fade up from `translateY(8px)`, 400ms `--ease-decelerate` |
| 5 | Character illustration | 400ms | Fade in from `opacity: 0`, 500ms `--ease-decelerate`. Animation loop begins. |
| 6 | Registration marks | 800ms | Fade in at `opacity: 0 → 0.15`, 400ms |
| 7 | Scroll cue | 1200ms | Fade in, then 2s bounce loop begins |

Total sequence: ~1.5s. Feels deliberate, not slow.

`prefers-reduced-motion`: All elements appear immediately at their final positions. No stagger, no translate. Character shows static frame.

---

## 9. Motion & Scroll Choreography

### Smooth Scrolling

**Lenis** wraps the entire page. Config:

```js
const lenis = new Lenis({
  lerp: 0.1,
  duration: 1.2,
  smoothWheel: true,
});
```

### Scroll-Triggered Sections

Every content section below the hero uses Intersection Observer-based fade-up:

| Property | Value |
|----------|-------|
| Initial state | `opacity: 0`, `translateY(16px)` |
| Final state | `opacity: 1`, `translateY(0)` |
| Duration | 400ms |
| Easing | `--ease-decelerate` |
| Trigger | 15% of element visible in viewport |
| Stagger (multi-element) | 60ms between siblings |

### Case Study Scroll Choreography (GSAP ScrollTrigger)

Case study pages are **cinematic linear scrolls** — each section is a scene in a narrative:

| Scene | Scroll Behavior |
|-------|----------------|
| Hero | Pinned. Title scrubs opacity 1→0 as user scrolls past. Background image parallaxes at 0.3x speed. |
| Challenge | Fade-up reveal. Key metrics count up from 0 when entering viewport (max 2.0s, `--ease-decelerate`). |
| Process | Timeline visualization builds left-to-right as user scrolls through. Each step appears when its position is reached. |
| Solution | Full-bleed media with caption overlay. Image zoom from `scale(1.1)` to `scale(1)` on scroll. |
| Outcomes | Metrics and quotes stagger in. Final CTA ("Next Project") fades up last. |

### Scroll Progress Indicator

A thin (2px) progress bar at the top of case study pages fills left-to-right as the user scrolls:

- Color: `var(--color-primary)` at 60% opacity
- Implementation: CSS `animation-timeline: scroll()` (progressive enhancement)
- Fallback: hidden if `scroll-timeline` unsupported
- `prefers-reduced-motion`: static, no animation (or hidden)

### Page Transitions

Subtle crossfade between routes via Astro View Transitions:

- Duration: 250ms
- Easing: `--ease-standard`
- No shared element morphing (keep it simple)

---

## 10. Image Swiper (About Page)

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

## 11. Creative Differentiation

The portfolio's personality comes from the **content** displayed inside the museum's clean containers — not from decorating the containers themselves. The pencil-test texture is the ONE exception: it's architectural (the museum's walls), not decorative.

### Museum Architecture vs. Exhibition Content

The spec defines the museum architecture: paper-textured surfaces, precise typography, teal-and-amber wayfinding, consistent spacing. The exhibitions are what make the museum worth visiting.

### Content as Personality

- **The character:** Sean's pencil-test illustrated self is the portfolio's mascot — appearing in the hero, potentially in the About page, and as Easter eggs in case studies.
- **Case study exhibits:** Each case study page is a curated exhibition. Scroll-triggered animations, interactive data visualizations, creative transitions — these live INSIDE the case study pages, not in the site-level UI.
- **Creative assets:** Sean's art, animations, and original work displayed within the clean containers. The contrast between the museum's restraint and the content's expressiveness is the signature.

### What This Means in Practice

- The site-level navigation, cards, typography, and layout stay clean and restrained.
- Inside a case study page, an embedded interactive CodePen or creative animation is welcome — it's an exhibit.
- Retro content (pixel art, 16BitFit screenshots) appears as CONTENT inside case study exhibits, never as UI decoration.
- The pencil-test character can appear as a subtle presence (small, low-opacity) in page corners or transitions, but never competes with the case study content.

---

## 12. Error Patterns

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

## 13. Loading States

The portfolio uses **skeleton placeholders** for content sections. Pages are primarily static (Astro SSR) and load fast. No spinners. No illustrated loading states.

Skeleton placeholders match the final layout dimensions and use:
- Background: `var(--surface-2)` / `var(--surface-2-light)`
- A subtle shimmer animation (`translateX` of a gradient overlay, 1.5s, `--ease-smooth`, infinite)
- `prefers-reduced-motion`: static background color, no shimmer

---

## 14. Anti-Patterns

These are specific things to **never do** on the portfolio.

1. **No Cheesecake Factory menus.** Never overwhelm with equally-weighted options. Curate ruthlessly.
2. **No shader/gradient hero backgrounds.** Heroes are textured paper, not decorative effects. No aurora, no mesh gradients, no glassmorphism on the hero.
3. **No pixel fonts or retro UI chrome.** Retro/pixel art appears only as *content* in case studies, never as UI decoration, buttons, icons, or typography.
4. **No fire-alarm alerts.** Errors are communicated calmly.
5. **No pure white backgrounds.** Use warm paper (`#FAF8F2`), never `#FFFFFF`.
6. **No pure black backgrounds.** Use near-black (`#0A0A0C`), never `#000000`.
7. **No choose-your-own-adventure case studies.** Case studies are cinematic linear scrolls — guided narrative, not tabbed exploration.
8. **No excessive bold text or bullet-heavy layouts.** Keep text natural and readable.
9. **No gratuitous animation.** Every animation must serve a purpose — the pencil-test texture drifts because real paper has subtle life. The character animates because animation is Sean's origin.
10. **No competing accent colors.** Teal and amber at 80/20 ratio. Never equal weight.
11. **No pure gray neutrals.** All grays are tinted. `#666666` is banned — use teal-tinted or warm-tinted alternatives.
12. **No generic easing.** Never use bare `ease`, `ease-in-out`, or `transition: all 0.3s ease`. Use the named easing curves from the motion system.
13. **No simultaneous entrance animations.** Elements always enter in staggered sequence, never all at once.
14. **No purple/indigo gradients.** These are the unofficial flag of AI-generated UI. Not welcome here.
15. **No cards nested inside cards.** One level of containment only.

---

## 15. Reference Board

### Structural & UI References

| Reference | What to Draw From |
|-----------|------------------|
| **Vercel** | Dark mode precision, engineering feel, premium marketing pages, crisp card patterns |
| **Linear** | Surface hierarchy, information density, motion discipline |
| **Stripe Press** | Editorial layout, typographic scale, full-bleed media in long-form content |

### Portfolio References

| Reference | What to Draw From |
|-----------|------------------|
| **Brittany Chiang** | Dark portfolio, clean hierarchy, monospace accents, lets work speak |
| **Fine Thought** | Minimal, experimental, subtle interactivity, clean canvas |
| **Keita Yamada** | Clean, concise, light/dark toggle, tasteful restraint |

### Material / Texture References

| Reference | What to Draw From |
|-----------|------------------|
| **Traditional animation pencil tests** | Paper warmth, registration marks, frame numbers, the tactile humanity of hand-drawn art |
| **Museum exhibition design** | How curators mount work — generous spacing, precise labels, the architecture serves the art |
| **Aged paper / archival documents** | The warm yellowing, the fiber texture, the feeling of something that was *made* by hand |

### Typography References

| Font | What It Brings |
|------|---------------|
| **Sora** | Geometric precision with human warmth. "A creative who thinks systematically." |
| **Inter** | Body text standard. Engineering clarity. |
| **JetBrains Mono** | Monospace for code, data, and registration marks. The engineer's notation. |

### Color References

| Source | What It Informed |
|--------|-----------------|
| **Google Stitch exploration** | Deep teal primary, warm amber accent — more "museum curator" than generic blue/orange |
| **Pencil-test animation paper** | Warm surface palette (`#FAF8F2`), tinted neutrals — colors that feel natural against aged paper |
| **Vercel dark mode** | Near-black surfaces, luminous accent colors on dark backgrounds |

---

## 16. Tech Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Framework | **Astro 5** | Ships zero JS by default. Islands Architecture hydrates only interactive components. |
| Interactive Islands | **React** (within Astro) | Reuse React skills for interactive pieces (galleries, AI demos). |
| Styling | **Tailwind CSS v4** | Tiny CSS payload, shared token system. |
| Scroll/Animation | **GSAP** + **Lenis** | GSAP for scroll-triggered storytelling and split-text reveals. Lenis for smooth scrolling (~3KB). |
| Hosting | **Netlify** (free tier) | Simple, fast CDN deployment. |

### Structure

| Page | Route | Purpose |
|------|-------|---------|
| Homepage | `/` | Hero (character + name) + project gallery (museum lobby) |
| Case Study | `/work/campus-201` | Cinematic scroll: hero, challenge, process, solution, outcomes |
| About | `/about` | Three chapters: Origin (animator), Evolution (skills), Present (philosophy) |
| Contact | `/contact` | Form + social links |

### Theme Persistence

Dark/light mode toggle uses cookies (`sw-theme`). Inline script in `<head>` prevents flash on load.

---

## 17. The Awwwards Delta — What Makes This Portfolio Award-Worthy

This section exists to ensure the spec doesn't settle for "good." Every element should push toward the award-winning threshold.

| Dimension | Good Portfolio | This Portfolio |
|-----------|---------------|----------------|
| **Texture** | Flat surfaces | Pencil-test paper with registration marks — a material language no other portfolio uses |
| **Color** | Blue and orange | Deep teal + warm amber — curator-grade, harmonizes with paper texture |
| **Character** | Headshot photo | Hand-drawn animated illustration — bridges the artist origin story |
| **Typography** | Clean hierarchy | Split-text reveals, tight tracking, monospace accents for frame numbers |
| **Scroll** | Fade-in sections | Orchestrated choreography — pinned heroes, scrubbed timelines, staggered reveals |
| **Entrance** | Everything appears | 1.5s orchestrated sequence — paper first, then name, then character, then scroll cue |
| **Cards** | Uniform grid | Varied heights, featured card at full width, editorial composition |
| **Dark mode** | Color swap | Narrative shift — paper metaphor recedes, lightbox metaphor emerges |
| **Signature** | B&W headshot reveal | Pencil-test character animation on textured paper — something no one else has |

---

*This specification represents committed design decisions for the SW Portfolio V3. Every choice was made deliberately. When in doubt, return to the core duality: pencil-test paper meets Vercel deployment logs. The museum architecture stays clean and engineering-precise — the content, the character, and the paper texture provide the soul.*
