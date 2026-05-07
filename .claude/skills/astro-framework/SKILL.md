---
name: astro-framework
description: Astro 5 framework patterns for building pages, components, layouts, content collections, React islands, view transitions, and image optimization. Use when creating .astro files, adding pages, configuring routing, hydrating React components with client directives, setting up content collections, working with Astro slots/props, optimizing images with astro:assets, or debugging Astro build errors.
---

# Astro 5 Framework Patterns

## Purpose

Build correct, performant Astro 5 sites using islands architecture, zero-JS-by-default rendering, React islands for interactivity, Tailwind v4 styling, and content collections. Every pattern targets the project's static-first, performance-obsessed architecture.

## When to Use

- Creating or editing `.astro` pages, layouts, or components
- Adding React interactive islands with `client:*` directives
- Setting up or querying content collections
- Configuring file-based routing (static or dynamic)
- Adding view transitions between pages
- Optimizing images with `astro:assets`
- Debugging Astro build or hydration errors
- Writing API endpoints or middleware

## Examples

**Example 1: New page with layout**
```
User: "Create an about page"
Claude: [Uses astro-framework] Creates src/pages/about.astro with
BaseLayout, typed props, proper head slot usage, and scoped styles.
No client:* directives unless interactivity is needed.
```

**Example 2: Adding a React island**
```
User: "Make the project gallery interactive with filtering"
Claude: [Uses astro-framework] Creates React component in
src/components/ProjectGallery.tsx, imports it in the .astro page
with client:visible (below fold) or client:load (above fold).
Passes only serializable props. Keeps static wrapper in .astro.
```

**Example 3: Dynamic case study routes**
```
User: "Set up dynamic routes for case studies"
Claude: [Uses astro-framework] Creates src/pages/work/[slug].astro
with getStaticPaths() returning params + props from content collection.
Uses render() imported from astro:content for markdown body.
```

## Project Stack Context

This project uses a specific combination. All patterns must work within this stack:

| Layer | Technology | Integration Notes |
|-------|-----------|-------------------|
| Framework | Astro 5 | `output: 'static'`, file-based routing |
| Islands | React | `@astrojs/react`, `client:*` directives for interactivity |
| Styling | Tailwind v4 | `@tailwindcss/vite` plugin, `@theme` in CSS, no config file |
| Animation | GSAP + Lenis | Scroll-triggered, smooth scrolling |
| Icons | lucide-react | For React islands; Lucide Astro imports for .astro components |
| Theme | Cookie-based | `sw-theme` cookie, inline script prevents FOUC |
| Hosting | Netlify | Static output, directory format |

## .astro File Anatomy

Every `.astro` file has two sections separated by code fences:

```astro
---
// FRONTMATTER — runs on server at build time
// Import components, fetch data, define types, compute values
import BaseLayout from '../layouts/BaseLayout.astro';
import Card from '../components/Card.astro';
import InteractiveWidget from '../components/Widget.tsx';

interface Props {
  title: string;
  description?: string;
}

const { title, description = 'Default' } = Astro.props;
const data = await fetch('https://api.example.com').then(r => r.json());
---

<!-- TEMPLATE — outputs HTML, supports {expressions} -->
<BaseLayout title={title}>
  <h1>{title}</h1>
  <Card title="Static" />
  <InteractiveWidget client:visible data={data} />
</BaseLayout>
```

Key rules:
- Frontmatter runs server-side only, never reaches browser
- Top-level `await` works directly in frontmatter
- Template uses JSX-like syntax but outputs pure HTML
- Without `client:*`, framework components render to static HTML with zero JS

## Client Hydration Directives

Choose the lightest directive that satisfies the interaction need:

| Directive | When JS Loads | Use For |
|-----------|--------------|---------|
| *(none)* | Never — static HTML only | Display-only components, no interactivity |
| `client:load` | Immediately on page load | Critical above-fold UI: nav, theme toggle |
| `client:idle` | After browser idle (`requestIdleCallback`) | Soon-needed but not critical elements |
| `client:visible` | Component enters viewport | **Default choice** for below-fold interactive content |
| `client:media="(max-width: 768px)"` | Media query matches | Mobile-only interactions |
| `client:only="react"` | Client-only, skips SSR | Components using browser APIs in render |

Advanced options:
- `client:visible={{rootMargin: "200px"}}` — start hydrating 200px before viewport
- `client:idle={{timeout: 500}}` — force hydration after 500ms

**Prop constraint:** Only serializable values can pass to hydrated components (objects, arrays, strings, numbers, Date, Map, Set). Functions cannot be passed.

<HARD-GATE>
NEVER add client:load to components below the fold. Use client:visible instead.
NEVER add a client:* directive to a component that has no interactivity.
Static display = no directive = zero JS. This is the entire point of islands architecture.
</HARD-GATE>

## Routing

Pages in `src/pages/` map directly to URLs:

| File | URL |
|------|-----|
| `src/pages/index.astro` | `/` |
| `src/pages/about.astro` | `/about` |
| `src/pages/work/[slug].astro` | `/work/campus-201` etc. |
| `src/pages/404.astro` | 404 page |

Dynamic routes require `getStaticPaths()`:

```astro
---
export function getStaticPaths() {
  return [
    { params: { slug: 'campus-201' }, props: { title: 'Campus 201' } },
  ];
}
const { slug } = Astro.params;
const { title } = Astro.props;
---
```

Prefix files with `_` (e.g., `_helpers.ts`) to exclude from routing.

## Slots

**Default slot:**
```astro
<!-- Layout.astro -->
<main><slot /></main>

<!-- Usage -->
<Layout><p>Goes into slot</p></Layout>
```

**Named slots:**
```astro
<!-- Layout.astro -->
<header><slot name="header" /></header>
<main><slot /></main>

<!-- Usage -->
<Layout>
  <h1 slot="header">Title</h1>
  <p>Main content</p>
</Layout>
```

**Fallback content:** `<slot>Default if empty</slot>`

## Styling in This Project

Tailwind v4 is configured via `@tailwindcss/vite` plugin — no `tailwind.config.js`. All tokens live in CSS:

```css
@import "tailwindcss";

@theme {
  --font-display: 'Sora', system-ui, sans-serif;
  --color-primary: #2563EB;
}
```

**Scoped styles** in `.astro` files are automatically scoped via `data-astro-cid-*` attributes:

```astro
<style>
  h1 { color: var(--color-primary); }  /* Only affects this component's h1 */
</style>
```

**Global styles:** Use `<style is:global>` or import a CSS file in frontmatter.

**Dynamic CSS variables:** Use `define:vars`:

```astro
---
const accentColor = '#F97316';
---
<style define:vars={{ accentColor }}>
  .accent { color: var(--accentColor); }
</style>
```

## Scripts

```astro
<!-- Bundled, deduped, module (default) -->
<script>
  console.log('Processed by Astro bundler');
</script>

<!-- Inline, unprocessed, renders as-is — use for FOUC prevention -->
<script is:inline>
  document.documentElement.dataset.theme =
    document.cookie.match(/sw-theme=(light|dark)/)?.[1] || 'light';
</script>

<!-- Pass server variables to client -->
<script define:vars={{ apiUrl }}>
  fetch(apiUrl);
</script>
```

`is:inline` is critical for theme scripts — prevents Astro from hoisting/bundling, keeping execution immediate.

## Content Collections (Astro 5)

For detailed content collection patterns including schema definitions, loaders, querying, cross-references, and route generation, see [references/content-collections.md](references/content-collections.md).

Key v5 changes to remember:
- Config file is `src/content.config.ts` (not `src/content/config.ts`)
- `render()` is imported from `astro:content`, not called as `entry.render()`
- `slug` field renamed to `id`
- Collections must define a `loader` property (`glob()` or `file()`)

## View Transitions

For the full view transitions API including custom animations, lifecycle events, theme persistence, and programmatic navigation, see [references/view-transitions.md](references/view-transitions.md).

Quick setup:
```astro
---
import { ClientRouter } from 'astro:transitions';
---
<head>
  <ClientRouter />
</head>
```

Note: `<ViewTransitions />` was renamed to `<ClientRouter />` in Astro 5.

## Image Optimization

```astro
---
import { Image, Picture } from 'astro:assets';
import hero from '../assets/hero.png';
---
<!-- Local image — auto-optimized, dimensions inferred -->
<Image src={hero} alt="Hero" />

<!-- Multiple formats -->
<Picture src={hero} formats={['avif', 'webp']} alt="Hero" />

<!-- Remote — must specify dimensions + authorize domain in config -->
<Image src="https://example.com/img.jpg" alt="" width={800} height={600} />
```

For responsive layouts: `<Image src={hero} alt="" layout="constrained" />`

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Adding `client:load` to everything | Most components need no directive or `client:visible` |
| Passing functions as props to islands | Only serializable values work — lift handlers into the React component |
| Using `entry.render()` | Import `render` from `astro:content` and call `render(entry)` |
| Creating `tailwind.config.js` | Tailwind v4 uses `@theme` in CSS, configured via `@tailwindcss/vite` |
| Using `<ViewTransitions />` | Renamed to `<ClientRouter />` in Astro 5 |
| Using `Astro.glob()` | Deprecated — use `getCollection()` or `import.meta.glob()` |
| Animating height/width in .astro styles | GPU-only: animate `transform` and `opacity` per project rules |
| Using `output: 'hybrid'` | Removed in v5 — use `output: 'static'` with per-route `prerender = false` |

## API Endpoints

For API route patterns and middleware, see [references/api-and-middleware.md](references/api-and-middleware.md).

## Success Criteria

- [ ] No `client:*` directive on display-only components
- [ ] `client:visible` used for below-fold interactive content (not `client:load`)
- [ ] All `.astro` frontmatter uses proper TypeScript interface for Props
- [ ] Content collections use v5 API (`render()` import, `id` not `slug`, loader property)
- [ ] Tailwind configured via `@tailwindcss/vite` and `@theme` in CSS, no config file
- [ ] Theme script uses `is:inline` to prevent FOUC
- [ ] Images use `astro:assets` Image/Picture components, not raw `<img>`
- [ ] Animations only use `transform` and `opacity` (project rule)
- [ ] `prefers-reduced-motion` respected on all animations (project rule)

## Copy/Paste Ready

```
"Create an Astro page for [route]"
"Add a React island component"
"Set up content collections for [content type]"
"Add view transitions between pages"
"Fix this Astro build error"
"Make this component interactive"
"Set up dynamic routes for case studies"
```
