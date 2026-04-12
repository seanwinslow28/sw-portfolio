# Astro 5 View Transitions — Deep Reference

## Setup

Import `<ClientRouter />` in your layout's `<head>`:

```astro
---
import { ClientRouter } from 'astro:transitions';
---
<html lang="en">
  <head>
    <ClientRouter />
  </head>
  <body><slot /></body>
</html>
```

Note: `<ViewTransitions />` was renamed to `<ClientRouter />` in Astro 5.

## Transition Directives

```astro
<!-- Match elements across pages by name -->
<h1 transition:name="hero-title">{title}</h1>

<!-- Choose animation -->
<header transition:animate="slide">

<!-- Persist state across navigations (video, audio, canvas) -->
<video controls transition:persist>
```

## Built-in Animations

| Animation | Effect |
|-----------|--------|
| `fade` | Cross-fade (default) |
| `slide` | Slide in from side |
| `initial` | Browser default |
| `none` | No animation |

## Custom Duration/Easing

```astro
---
import { fade, slide } from 'astro:transitions';
---
<header transition:animate={fade({ duration: '0.4s' })}>
<main transition:animate={slide({ duration: '0.3s' })}>
```

## Programmatic Navigation

```javascript
import { navigate } from 'astro:transitions/client';
navigate('/about');
navigate('/work/campus-201', { history: 'replace' });
```

## Lifecycle Events (in order)

1. `astro:before-preparation` — navigation started, content loading
2. `astro:after-preparation` — content loaded
3. `astro:before-swap` — DOM swap about to happen
4. `astro:after-swap` — new DOM in place
5. `astro:page-load` — navigation complete, page visible

## Theme Persistence Pattern

Critical for this project's cookie-based theme system:

```javascript
document.addEventListener('astro:before-swap', (event) => {
  const match = document.cookie.match(/sw-theme=(light|dark)/);
  const theme = match ? match[1] : 'light';
  event.newDocument.documentElement.setAttribute('data-theme', theme);
});
```

## GSAP Re-initialization

When using view transitions with GSAP (as this project does), re-init animations after navigation:

```javascript
document.addEventListener('astro:page-load', () => {
  // Re-create GSAP ScrollTrigger instances
  // Re-init Lenis smooth scroll
  initAnimations();
});
```

## Forcing Full Page Reload

```html
<a href="/heavy-page" data-astro-reload>Full reload</a>
```

## Fallback for Unsupported Browsers

```astro
<ClientRouter fallback="swap" />
```

Options: `animate` (default), `swap` (instant), `none` (full page load).

## Accessibility

- ClientRouter includes a built-in route announcer for screen readers
- Automatically respects `prefers-reduced-motion`
- When reduced motion is preferred, transitions use instant swap
