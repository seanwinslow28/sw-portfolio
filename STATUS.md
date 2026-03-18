# SW Portfolio — Project Status

## Overview

This is Sean Winslow's PM portfolio website built with Astro 5, React islands, Tailwind CSS v4, GSAP ScrollTrigger, and Lenis smooth scrolling. The design concept is "a tech-filled art museum" with light mode (Origin Story) and dark mode (Present) narrative duality.

---

## What Has Been Completed

### Architecture & Config
- [x] Astro 5 project scaffolded with `@astrojs/react` integration
- [x] Tailwind CSS v4 configured via `@tailwindcss/vite` plugin
- [x] Static output mode with directory-based routing
- [x] Design system tokens imported from `sw-design-system` repo and adapted into `src/styles/global.css`
- [x] Cookie-based theme persistence (works in sandboxed/iframe environments where `localStorage` is blocked)

### Design System (`src/styles/global.css`)
- [x] Full CSS custom property token system: colors, typography scale (`clamp()`-based), spacing (4px grid), radii, transitions
- [x] Light mode palette: `#FAFAF8` surface, `#1E40AF` primary, `#C2410C` accent
- [x] Dark mode palette via `[data-theme="dark"]`: `#09090B` surface, `#3B82F6` primary, `#F97316` accent
- [x] 200–300ms crossfade theme transition on all elements
- [x] Base reset, font smoothing, selection styles, focus-visible styles
- [x] `prefers-reduced-motion` media query kill switch
- [x] Component styles: `.tag-badge`, `.top-nav`, `.mobile-menu-overlay`, `.metric-value`/`.metric-label`, `.contact-input`/`.contact-btn`, `.project-card` hover effects, `.horizontal-gallery`

### Layout (`src/layouts/BaseLayout.astro`)
- [x] Shared HTML shell: meta tags, Google Fonts preconnect (Inter, Sora, JetBrains Mono), OG tags
- [x] Inline theme-detection script (prevents flash of wrong theme)
- [x] Fixed nav via `NavIsland` React island (`client:load`)
- [x] Lenis smooth scroll via `SmoothScroll` React island (`client:load`)
- [x] Skip-to-content link for accessibility
- [x] Semantic `<main>` and `<footer>`

### React Island Components (`src/components/`)
- [x] **NavIsland.jsx** — Fixed header with desktop nav links, dark/light mode toggle (cookie-based), mobile hamburger menu with full-screen overlay, scroll-hide behavior, active page highlighting
- [x] **ScrollReveal.jsx** — GSAP ScrollTrigger integration that progressively reveals `.reveal-section` elements on scroll. Falls back gracefully if GSAP fails to load
- [x] **SmoothScroll.jsx** — Lenis smooth scrolling wrapper, respects `prefers-reduced-motion`
- [x] **MetricCounter.jsx** — Animated count-up for metric values, using IntersectionObserver to trigger
- [x] **HorizontalGallery.jsx** — Horizontal scroll gallery with scroll-snap, arrow button, drag support

### Pages

#### Homepage (`src/pages/index.astro`)
- [x] Hero section: "Sean Winslow" + "Product Manager. Animator. Builder."
- [x] Project gallery: 5 project cards (Campus 201, 16BitFit, Animation Pipeline, Pocket PM, Superuser Pack) with hover effects, gradient thumbnails, tag badges, "View Project →" CTA
- [x] Responsive 2-column grid at 768px+
- [x] All styles in `<style is:global>` block

#### Campus 201 Case Study (`src/pages/work/campus-201.astro`)
- [x] Full cinematic linear-scroll case study layout
- [x] Back link to homepage
- [x] Hero: title, subtitle, metadata (Role, Timeline, Company)
- [x] Hero image placeholder (16:9)
- [x] "The Challenge" text section
- [x] "Process & Approach" section with HorizontalGallery (6 artifact cards with captions)
- [x] "Design Evolution" section with mockup grid (1 full-width 16:9 + 2-column before/after 4:3)
- [x] "Outcomes" section with MetricCounter grid (4 metrics: 47% completion rate, 3.2× engagement, 35% fewer support tickets, 12-day launch)
- [x] "Reflection" section with personal learnings
- [x] All styles in `<style is:global>` block

#### About (`src/pages/about.astro`)
- [x] Three-chapter narrative structure:
  - Chapter 1: Origin — "Where I Started" (film school, storytelling roots)
  - Chapter 2: Evolution — "How I Work" (skills grid with 8 capabilities)
  - Chapter 3: Present — "What Drives Me" (current philosophy)
- [x] Hero with name, subtitle, decorative initials
- [x] Skills grid (responsive: 1→2→4 columns)
- [x] All styles in `<style is:global>` block

#### Contact (`src/pages/contact.astro`)
- [x] Header with title + description
- [x] Contact form: Name, Email, Message fields with styled inputs
- [x] "Send Message" button with accent color
- [x] "Other ways to connect" section with email/LinkedIn/GitHub links
- [x] All styles in `<style is:global>` block

#### Coming Soon Pages (`src/pages/work/{16bitfit,animation-pipeline,pocket-pm,superuser-pack}.astro`)
- [x] Minimal "coming soon" placeholder pages for each project

---

## What Still Needs To Be Done

### Critical — Must Fix Before Launch

1. **Build the project locally** — The Astro build was failing in the sandbox environment (see "The Problem" below). You need to run `npm install && npm run build` locally.

2. **Verify the `reveal-section` CSS fix works** — I changed `.reveal-section` from `opacity: 0` (invisible by default) to visible-by-default. The `ScrollReveal.jsx` component now uses `gsap.set()` to hide elements before animating them in. This is the correct progressive-enhancement pattern. After building locally, check that:
   - Pages are fully visible without JavaScript
   - Scroll animations still work with JavaScript enabled

3. **Visual QA all pages** — The pages were built and structured correctly, but I was unable to complete visual QA due to the build failure. Check:
   - Homepage: hero text, project cards, hover effects, responsive grid
   - Campus 201: all sections render, metrics animate, horizontal gallery scrolls
   - About: three chapters, skills grid layout, responsive breakpoints
   - Contact: form styling, button colors, link section
   - Dark mode toggle on all pages
   - Mobile layout (375px) on all pages

### Nice-to-Have / Polish

4. **Replace placeholder images** — All project thumbnails and case study images are placeholder divs with text labels. Replace with real screenshots/mockups.

5. **Add real project content** — The 4 "coming soon" case study pages need to be built out with full content like Campus 201.

6. **Favicon** — No favicon has been added yet.

7. **Deployment** — Once built and QA'd, deploy to your hosting of choice. The `dist/` output is fully static.

---

## The Problem

### Symptom
When deployed to the S3 static hosting proxy, the homepage rendered correctly but the **About**, **Contact**, and **Campus 201** pages appeared completely unstyled — white page with raw unstyled text.

### Root Cause (Two Issues)

#### Issue 1: `reveal-section` opacity trap (PRIMARY CAUSE)

The CSS in `global.css` had:
```css
.reveal-section {
  opacity: 0;
  transform: translateY(20px);
}
```

This hides ALL content inside `.reveal-section` elements by default. The content is supposed to become visible when the `ScrollReveal` React component loads GSAP and triggers scroll-based animations.

**However**, the React island components are loaded from absolute paths like `/_astro/ScrollReveal._ooTqtYq.js`. On the S3 proxy deployment (which uses a long nested URL path), these absolute `/_astro/` paths resolve to the wrong location — they point to the root of `sites.pplx.app` instead of the deployed site's directory. So **JavaScript never loads → GSAP never runs → content stays at opacity: 0 → pages appear blank**.

The homepage appeared to work because either:
- The browser had those JS files cached from a previous deployment
- The proxy resolved paths differently for the root `index.html`

#### Issue 2: Astro build hanging in sandbox

The `npx astro build` command consistently hangs at "Building static entrypoints..." in the 2-vCPU / 8GB sandbox environment. The Vite bundler likely hits a resource constraint when processing the React islands + GSAP + Lenis + Tailwind v4 pipeline simultaneously. This prevented rebuilding after applying the fix.

### Why `<style is:global>` Was Needed

Earlier in development, page styles were written as standard Astro scoped `<style>` blocks. Astro scoping works by adding `[data-astro-cid-xxxx]` attribute selectors to both the CSS rules and the HTML elements. But elements rendered **inside React islands** (like `ScrollReveal`) don't receive these scoping attributes — they're rendered by React, not Astro's template compiler. So scoped CSS rules like `.case-title[data-astro-cid-abc123]` never matched elements that React rendered as just `.case-title`.

Switching to `<style is:global>` removed the scoping attributes, making the CSS work with React-rendered content. This was the correct fix.

---

## How To Fix It

### Step 1: Build Locally

```bash
cd sw-portfolio
npm install
npm run build
```

This generates the `dist/` folder with all static output.

### Step 2: Verify the Fix

Open `dist/index.html` in a browser (use a local server like `npx serve dist` or `npx astro preview`). Check that:

1. All pages render with full styling (typography, spacing, colors)
2. Content is visible immediately on page load (no invisible/hidden sections)
3. As you scroll, sections animate in with a subtle fade+slide
4. Dark mode toggle works on all pages
5. Mobile layout works at narrow widths

### Step 3: If Content Is Still Invisible

If for some reason `.reveal-section` elements are still hidden, the fix is already in `src/styles/global.css` (line ~189):

```css
.reveal-section {
  /* Visible by default — GSAP sets opacity:0 before animating */
}
```

And in `src/components/ScrollReveal.jsx`, the component now calls `gsap.set(section, { opacity: 0, y: 20 })` programmatically before animating. This is the correct "progressive enhancement" pattern — content is visible without JS, and JS enhances the experience.

### Step 4: Deploy

The `dist/` folder is a fully static site. Deploy to:
- **GitHub Pages**: Push `dist/` to your `sw-portfolio` repo's `gh-pages` branch
- **Vercel/Netlify**: Connect the repo and set build command to `npm run build`, output to `dist`
- **Any static host**: Upload the contents of `dist/`

**Note on asset paths**: Astro generates absolute paths (`/_astro/file.js`). If deploying to a subdirectory (e.g., `username.github.io/sw-portfolio/`), add this to `astro.config.mjs`:

```js
export default defineConfig({
  base: '/sw-portfolio/',  // or whatever your subdirectory is
  // ... rest of config
});
```

Then rebuild. For root-domain hosting (e.g., `seanwinslow.com`), no `base` change is needed.

---

## File Structure Reference

```
sw-portfolio/
├── astro.config.mjs          # Astro 5 + React + Tailwind v4 config
├── package.json               # Dependencies (astro, react, gsap, lenis, tailwind)
├── tsconfig.json
├── public/                    # Static assets (currently empty — add favicon here)
├── src/
│   ├── components/
│   │   ├── HorizontalGallery.jsx   # Scroll gallery with snap + drag
│   │   ├── MetricCounter.jsx       # Animated count-up numbers
│   │   ├── NavIsland.jsx           # Fixed nav, theme toggle, mobile menu
│   │   ├── ScrollReveal.jsx        # GSAP scroll-triggered reveals
│   │   └── SmoothScroll.jsx        # Lenis smooth scrolling
│   ├── layouts/
│   │   └── BaseLayout.astro        # Shared HTML shell
│   ├── pages/
│   │   ├── index.astro             # Homepage — hero + project gallery
│   │   ├── about.astro             # Three-chapter about page
│   │   ├── contact.astro           # Contact form + links
│   │   └── work/
│   │       ├── campus-201.astro    # Full case study
│   │       ├── 16bitfit.astro      # Coming soon
│   │       ├── animation-pipeline.astro
│   │       ├── pocket-pm.astro
│   │       └── superuser-pack.astro
│   └── styles/
│       └── global.css              # Design tokens + component styles
└── dist/                           # Build output (run `npm run build`)
```
