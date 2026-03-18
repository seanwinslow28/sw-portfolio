# ProjectCard — Component Mini-Spec

> **Project:** PM Portfolio
> **Mode:** Light mode primary, dark mode toggle available
> **Spec references:** Sections 2, 3, 4, 5, 6, 7, 8, 15
> **Audit reference:** Practice 7 ("featured exhibit" card — breaking the equal-weight grid)

---

## Design Intent

The ProjectCard is a **museum exhibit door** — each card in the homepage gallery is an invitation to enter a project's story. The card must create intrigue (what's inside?) without revealing too much. Video-on-hover brings the work alive and proves it's real, not mockups. One card can be designated as "featured" to break the equal-weight grid and signal "start here" — this is the signature detail from the audit's Practice 7 that separates this portfolio from template grids.

---

## Variants

| Variant | Usage | Grid Behavior |
|---------|-------|---------------|
| **Standard** | Default project card in the gallery grid. | Occupies 1 column in the grid. |
| **Featured** | One card per page, designated as the lead project. | Spans 2 columns (desktop) or full width (mobile). Visually larger thumbnail. |

---

## Component Anatomy

```
┌─────────────────────────────────────┐
│                                     │
│  ┌─────────────────────────────┐    │
│  │                             │    │
│  │     Thumbnail / Video       │    │
│  │        (16:9 ratio)         │    │
│  │                             │    │
│  └─────────────────────────────┘    │
│                                     │
│  Project Title                      │
│  Short description (1-2 lines)      │
│                                     │
│  [Tag] [Tag] [Tag]                  │
│                                     │
│  View Project →                     │
│                                     │
└─────────────────────────────────────┘
```

| # | Element | Required | Description |
|---|---------|----------|-------------|
| 1 | Thumbnail container | Yes | 16:9 aspect ratio area. Shows a static image by default; autoplays a video loop on hover. |
| 2 | Project title | Yes | The project's display name. |
| 3 | Description | Yes | 1-2 sentence summary of the project. |
| 4 | Tags | Yes | Small badges showing project categories (e.g., "Product Design", "Animation", "Pixel Art"). Max 4 visible. |
| 5 | CTA link | Yes | "View Project →" link that navigates to the case study. |

---

## Spacing

### Standard Variant

| Property | Token | Value | Notes |
|----------|-------|-------|-------|
| Card padding | `--space-6` | 24px | All sides (portfolio cards are more spacious than dashboard). |
| Thumbnail to title gap | `--space-5` | 20px | Vertical, below thumbnail container. |
| Title to description gap | `--space-2` | 8px | Vertical, tight relationship. |
| Description to tags gap | `--space-4` | 16px | Vertical. |
| Tag gap (between tags) | `--space-2` | 8px | Horizontal. |
| Tags to CTA gap | `--space-4` | 16px | Vertical. |
| Thumbnail border radius | — | 8px | Inner element radius (card is 12px, content area is 8px). |

### Featured Variant

Same internal spacing as standard, but:

| Property | Token | Value | Notes |
|----------|-------|-------|-------|
| Thumbnail height | — | Taller (auto from 16:9 on wider span) | The 2-column span creates a naturally larger thumbnail. |
| Title size | Sora SemiBold 600 | `--text-h3` (22px) | Bumped up one step from standard's `--text-h4`. |

---

## Typography

### Light Mode

| Element | Font | Weight | Size Token | Color Token |
|---------|------|--------|------------|-------------|
| Project title (standard) | Sora | Medium 500 | `--text-h4` (18px) | `--text-primary-light` (`#18181B`) |
| Project title (featured) | Sora | SemiBold 600 | `--text-h3` (22px) | `--text-primary-light` (`#18181B`) |
| Description | Inter | Regular 400 | `--text-body` (16px) | `--text-secondary-light` (`#52525B`) |
| Tag text | Inter | Medium 500 | `--text-caption` (12px) | `--text-secondary-light` (`#52525B`) |
| CTA link | Inter | Medium 500 | `--text-small` (14px) | `--color-accent` (`#C2410C`) |
| CTA arrow (→) | Inter | Medium 500 | `--text-small` (14px) | `--color-accent` (`#C2410C`) |

### Dark Mode

Same fonts and weights. Color tokens switch to dark mode variants:

| Element | Color Token (Dark) |
|---------|-------------------|
| Project title | `--text-primary` (`#FAFAFA`) |
| Description | `--text-secondary` (`#A1A1AA`) |
| Tag text | `--text-secondary` (`#A1A1AA`) |
| CTA link | `--color-accent` (`#F97316`) |

---

## Tag Badges

| Property | Light Mode | Dark Mode |
|----------|------------|-----------|
| Background | `--surface-2-light` (`#EBEBE4`) | `--surface-2` (`#27272A`) |
| Text color | `--text-secondary-light` (`#52525B`) | `--text-secondary` (`#A1A1AA`) |
| Padding | `--space-1` (4px) vertical, `--space-2` (8px) horizontal | Same |
| Border radius | 4px | Same |
| Font | Inter Medium 500, `--text-caption` (12px) | Same |
| Max visible | 4 tags. If more exist, show 3 + "+2 more" in `--text-tertiary` | Same |

---

## Thumbnail / Video Behavior

### Static State (Default)

| Property | Value |
|----------|-------|
| Content | Static image (project screenshot or hero visual). |
| Aspect ratio | 16:9, enforced via `aspect-ratio: 16/9` or padding trick. |
| Object-fit | `cover` (image fills container, cropped if needed). |
| Border radius | 8px (inner container). |
| Overflow | `hidden` (clips image/video to rounded corners). |

### Hover State (Video Reveal)

| Property | Value |
|----------|-------|
| Content | `<video>` element with a short loop (3-10 seconds) of the project in action. |
| Trigger | Mouse enters the card (not just the thumbnail). |
| Load | Video `<source>` is present in DOM but `preload="none"`. On first hover, start loading. On subsequent hovers, play from last position or restart. |
| Playback | Autoplay, muted, loop. No controls visible. |
| Transition | Static image fades out (`opacity 0`) over 300ms while video fades in (`opacity 1`). |
| Fallback | If no video is provided, the static image remains on hover (no error state). |
| Exit | On mouse leave, video pauses. Static image fades back in over 300ms. |

### Featured Variant Video

Same behavior but the video is larger due to the 2-column span. Consider providing higher-resolution video for the featured card.

---

## Visual States

### Default (Light Mode)

| Property | Value |
|----------|-------|
| Background | `--surface-1-light` (`#F5F5F0`) |
| Border | `1px solid --surface-3-light` (`#D4D4CC`) |
| Border radius | 12px (portfolio card standard) |
| Shadow | `0 1px 3px rgba(0, 0, 0, 0.04)` |

### Default (Dark Mode)

| Property | Value |
|----------|-------|
| Background | `--surface-1` (`#18181B`) |
| Border | `1px solid --surface-3` (`#3F3F46`) |
| Border radius | 12px |
| Shadow | none (borders define edges in dark mode) |

### Hover

| Property | Light Mode | Dark Mode |
|----------|------------|-----------|
| Transform | `translateY(-2px)` | `translateY(-2px)` |
| Shadow | `0 4px 12px rgba(0, 0, 0, 0.08)` | `0 4px 12px rgba(0, 0, 0, 0.3)` |
| Border | no change | border color lightens to `--text-tertiary` |
| CTA arrow | shifts right 4px (`translateX(4px)`) | same |
| Transition | 200ms ease-out | same |

### Active (mouse down)

| Property | Value |
|----------|-------|
| Transform | `translateY(0px)` (returns to resting position) |
| Shadow | reverts to default shadow |
| Transition | 100ms ease |

### Focus (keyboard)

| Property | Value |
|----------|-------|
| Outline | `2px solid --color-primary` at 50% opacity |
| Outline offset | 2px |
| Transform | none (no lift on focus, only on hover) |

### Loading

| Property | Value |
|----------|-------|
| Thumbnail | Skeleton placeholder, `--surface-2-light` / `--surface-2`, 16:9 ratio |
| Title | Skeleton line, 60% width |
| Description | Skeleton lines (2), 80% and 50% width |
| Tags | 3 skeleton pills, 60px each |
| CTA | Skeleton line, 100px wide |
| Pulse | opacity `0.3 → 0.5`, 1.8s, ease-in-out |

---

## Featured Variant Differences

| Property | Standard | Featured |
|----------|----------|----------|
| Grid span | 1 column | 2 columns (desktop), full width (mobile) |
| Title font | Sora Medium 500, `--text-h4` (18px) | Sora SemiBold 600, `--text-h3` (22px) |
| Visual weight | Equal with other cards | Clearly dominant — the first thing the eye hits |
| Video | Optional | Strongly recommended (the featured card should show the work in motion) |
| Position in grid | Any | First position (top-left on desktop). Always the entry point to the gallery. |

---

## Responsive Behavior

| Breakpoint | Behavior |
|------------|----------|
| ≥1024px (`--bp-desktop`) | 2-column grid. Featured card spans both columns. Standard cards: 1 column each. |
| 768px–1023px | 2-column grid narrows. Featured card still spans both columns. |
| <768px (`--bp-tablet`) | Single column. Featured and standard cards are full-width. Featured card loses the column span advantage but retains the larger title and visual priority by being first. Video-on-hover disabled (touch devices) — static thumbnail only. |

### Touch Device Behavior

On devices without hover capability (`@media (hover: none)`):
- Video does not autoplay on touch. The static thumbnail is the permanent display.
- The hover lift (`translateY(-2px)`) does not apply.
- The CTA arrow does not shift on touch — it stays in position.
- Tap triggers navigation directly (no intermediate hover state).

---

## Animation Specs

| Animation | Property | Duration | Easing | Trigger |
|-----------|----------|----------|--------|---------|
| Hover lift | `transform: translateY` | 200ms | ease-out | Mouse enter |
| Hover shadow | `box-shadow` | 200ms | ease-out | Mouse enter |
| Hover border (dark) | `border-color` | 200ms | ease-out | Mouse enter |
| CTA arrow shift | `transform: translateX` | 200ms | ease-out | Mouse enter on card |
| Video crossfade | `opacity` | 300ms | ease | Mouse enter/leave |
| Active press | `transform: translateY` | 100ms | ease | Mouse down |
| Skeleton pulse | `opacity` | 1.8s | ease-in-out | Loading state (infinite) |

### Reduced Motion

When `prefers-reduced-motion: reduce` is active:

- Hover lift: no `translateY` change, shadow changes instantly
- Video crossfade: instant swap (no opacity transition), or disable video entirely and keep static image
- CTA arrow: no shift
- Active press: no transform
- Skeleton pulse: static at 40% opacity
- Scroll-triggered entrance: card is visible immediately (no fade-in/translate-up on viewport entry)

---

## Do Not List

1. **Do not use 8px border radius.** Portfolio cards use `12px`. Dashboard cards use 8px. This is a portfolio component.
2. **Do not use equal-weight for all cards.** One card should be designated as featured, visually breaking the grid. Equal-weight grids are explicitly flagged in the audit as generic.
3. **Do not autoplay video with sound.** All hover videos are muted. No audio under any circumstances.
4. **Do not use a "Play" button overlay** on the thumbnail. The video-on-hover is seamless — no controls, no play button, no progress bar.
5. **Do not use pill-shaped tags.** Tag badges use `4px` border radius.
6. **Do not use orange for the project title.** Orange is reserved for the CTA link only ("View Project →"). This maintains the 80/20 ratio.
7. **Do not use Sora for the description or tags.** Sora is for headings only (title). Description and tags use Inter.
8. **Do not use pure white (`#FFFFFF`) for the card background** in light mode. It's `--surface-1-light` (`#F5F5F0`).
9. **Do not add a border-left accent** to portfolio cards. The instrument border is an Agent Control Center pattern, not a portfolio pattern.
10. **Do not lazy-load the featured card's image.** The featured card is above the fold — its image should load immediately. Standard cards below the fold can use `loading="lazy"`.
