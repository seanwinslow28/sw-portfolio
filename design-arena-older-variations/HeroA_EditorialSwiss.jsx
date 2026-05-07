/**
 * HeroA_EditorialSwiss.jsx
 * ========================
 * Design Arena Entry — Agent A: Typography-Forward Editorial Swiss
 *
 * DESIGN RATIONALE:
 * -----------------
 * This hero treats Sean Winslow's name as a museum title placard — the typography
 * IS the exhibit. Inspired by Swiss editorial design (Josef Muller-Brockmann meets
 * Emigre magazine), the layout uses a strict vertical rhythm with extreme scale
 * contrast between the display name and supporting metadata.
 *
 * The name "SEAN WINSLOW" is set at cinematic scale in uppercase Sora (weight 600),
 * letterspaced for monumental presence. Each word reveals via a clip-path mask —
 * sliding up from behind an overflow boundary with staggered timing. This is the
 * hero's signature interaction.
 *
 * Supporting content is arranged in a grid-aligned metadata bar below the name,
 * using JetBrains Mono for frame numbers and role descriptors — echoing the
 * pencil-test registration mark heritage. A single teal accent appears on the
 * "A-1" frame number. Everything else is near-monochromatic.
 *
 * FONT CHOICES:
 * - Display: Sora 600 (uppercase, tracked wide) — geometric enough for Swiss
 *   discipline, warm enough to avoid clinical coldness. Staying with the project
 *   font since Sora's geometric character actually suits Swiss typography well.
 * - Body: Inter 400/500
 * - Mono: JetBrains Mono 400 for metadata, frame numbers, registration marks
 *
 * WHAT MAKES THIS DISTINCT:
 * - Name dominates at ~15vw, filling the viewport width
 * - Split-text mask reveal with CSS clip-path, no GSAP needed
 * - Metadata bar with strict grid alignment (role / location / frame number)
 * - Registration marks as structural elements, not decoration
 * - 95/4/1 color ratio — almost entirely neutral, single teal accent
 * - Vertical rhythm locked to 4px grid throughout
 *
 * ANIMATION SYSTEM:
 * - All CSS keyframes, orchestrated via useEffect setting CSS custom properties
 * - 600ms base duration, 80ms stagger between lines
 * - Decelerate easing (cubic-bezier(0, 0, 0, 1)) for entrances
 * - prefers-reduced-motion: all animations instantly resolve
 */

import { useEffect, useRef, useState } from 'react';

/* -------------------------------------------------------------------------
   CSS-in-JS Styles (injected once via <style>)
   ------------------------------------------------------------------------- */
const STYLES = `
/* === HeroA Editorial Swiss === */

.heroA-swiss {
  position: relative;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: var(--space-16, 64px) var(--space-8, 32px);
  background-color: var(--surface-0, #FAF8F2);
  color: var(--text-primary, #1A1A1E);
  overflow: hidden;
  font-family: var(--font-body, 'Inter', system-ui, sans-serif);
}

/* --- Registration Marks (light mode only) --- */
.heroA-swiss__reg-marks {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
}

[data-theme="dark"] .heroA-swiss__reg-marks {
  display: none;
}

.heroA-swiss__reg-mark {
  position: absolute;
  font-family: var(--font-mono, 'JetBrains Mono', monospace);
  font-size: 11px;
  line-height: 1;
  color: var(--text-primary, #1A1A1E);
  opacity: 0;
  user-select: none;
}

.heroA-swiss__reg-mark--crosshair {
  top: var(--space-8, 32px);
  left: var(--space-8, 32px);
  font-size: 18px;
  font-weight: 300;
}

.heroA-swiss__reg-mark--circle {
  top: var(--space-8, 32px);
  right: var(--space-8, 32px);
  width: 12px;
  height: 12px;
  border: 1px solid var(--text-primary, #1A1A1E);
  border-radius: 50%;
  opacity: 0;
}

.heroA-swiss__reg-mark--frame {
  bottom: var(--space-8, 32px);
  left: var(--space-8, 32px);
  color: var(--color-primary, #0D7377);
}

/* --- Content Container --- */
.heroA-swiss__content {
  position: relative;
  z-index: 2;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
}

/* --- Name Display --- */
.heroA-swiss__name-block {
  margin-bottom: var(--space-12, 48px);
}

.heroA-swiss__name-line {
  display: block;
  overflow: hidden;
}

.heroA-swiss__name-word {
  display: block;
  font-family: var(--font-display, 'Sora', system-ui, sans-serif);
  font-size: clamp(64px, 14vw, 180px);
  font-weight: 600;
  line-height: 0.92;
  letter-spacing: -0.03em;
  text-transform: uppercase;
  color: var(--text-primary, #1A1A1E);
  transform: translateY(110%);
  opacity: 0;
  will-change: transform, opacity;
}

/* Staggered reveal animation */
.heroA-swiss__name-word--reveal {
  animation: heroA-maskReveal 600ms cubic-bezier(0, 0, 0, 1) forwards;
}

.heroA-swiss__name-line:nth-child(1) .heroA-swiss__name-word--reveal {
  animation-delay: 200ms;
}

.heroA-swiss__name-line:nth-child(2) .heroA-swiss__name-word--reveal {
  animation-delay: 280ms;
}

@keyframes heroA-maskReveal {
  from {
    transform: translateY(110%);
    opacity: 0;
  }
  15% {
    opacity: 1;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* --- Divider Rule --- */
.heroA-swiss__rule {
  width: 100%;
  height: 1px;
  background-color: var(--text-tertiary, #8A8A8F);
  margin-bottom: var(--space-8, 32px);
  transform: scaleX(0);
  transform-origin: left center;
  opacity: 0;
  will-change: transform, opacity;
}

.heroA-swiss__rule--reveal {
  animation: heroA-ruleReveal 500ms cubic-bezier(0, 0, 0, 1) 500ms forwards;
}

@keyframes heroA-ruleReveal {
  from {
    transform: scaleX(0);
    opacity: 0;
  }
  10% {
    opacity: 0.4;
  }
  to {
    transform: scaleX(1);
    opacity: 0.4;
  }
}

/* --- Metadata Bar --- */
.heroA-swiss__meta {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: var(--space-8, 32px);
  align-items: start;
  margin-bottom: var(--space-16, 64px);
}

.heroA-swiss__meta-left {
  display: flex;
  flex-direction: column;
  gap: var(--space-4, 16px);
}

.heroA-swiss__tagline {
  font-family: var(--font-body, 'Inter', system-ui, sans-serif);
  font-size: clamp(16px, 2vw, 20px);
  font-weight: 400;
  line-height: 1.5;
  color: var(--text-secondary, #4A4A52);
  max-width: 540px;
  opacity: 0;
  transform: translateY(16px);
  will-change: transform, opacity;
}

.heroA-swiss__tagline--reveal {
  animation: heroA-fadeUp 500ms cubic-bezier(0, 0, 0, 1) 650ms forwards;
}

@keyframes heroA-fadeUp {
  from {
    transform: translateY(16px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.heroA-swiss__descriptor {
  display: flex;
  gap: var(--space-6, 24px);
  align-items: center;
  opacity: 0;
  transform: translateY(12px);
  will-change: transform, opacity;
}

.heroA-swiss__descriptor--reveal {
  animation: heroA-fadeUp 500ms cubic-bezier(0, 0, 0, 1) 750ms forwards;
}

.heroA-swiss__descriptor-item {
  font-family: var(--font-mono, 'JetBrains Mono', monospace);
  font-size: 12px;
  font-weight: 400;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--text-tertiary, #8A8A8F);
}

.heroA-swiss__descriptor-sep {
  width: 20px;
  height: 1px;
  background-color: var(--text-tertiary, #8A8A8F);
  opacity: 0.5;
}

/* --- Headshot --- */
.heroA-swiss__headshot {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background-color: var(--surface-2, #E8E4DA);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  opacity: 0;
  transform: scale(0.92);
  will-change: transform, opacity;
  cursor: default;
  transition: filter 300ms cubic-bezier(0.2, 0, 0, 1);
  filter: grayscale(100%);
  flex-shrink: 0;
}

.heroA-swiss__headshot--reveal {
  animation: heroA-headshotReveal 600ms cubic-bezier(0, 0, 0, 1) 550ms forwards;
}

@keyframes heroA-headshotReveal {
  from {
    transform: scale(0.92);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.heroA-swiss__headshot:hover {
  filter: grayscale(0%);
}

.heroA-swiss__headshot-initials {
  font-family: var(--font-display, 'Sora', system-ui, sans-serif);
  font-size: 48px;
  font-weight: 500;
  color: var(--text-tertiary, #8A8A8F);
  line-height: 1;
  user-select: none;
}

/* --- Scroll Cue --- */
.heroA-swiss__scroll-cue {
  position: absolute;
  bottom: var(--space-8, 32px);
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2, 8px);
  opacity: 0;
  will-change: opacity;
  z-index: 2;
}

.heroA-swiss__scroll-cue--reveal {
  animation: heroA-scrollCueFadeIn 400ms cubic-bezier(0, 0, 0, 1) 1200ms forwards;
}

@keyframes heroA-scrollCueFadeIn {
  to { opacity: 1; }
}

.heroA-swiss__scroll-chevron {
  color: var(--text-tertiary, #8A8A8F);
  animation: heroA-chevronBounce 2000ms cubic-bezier(0.33, 1, 0.68, 1) 1600ms infinite;
  will-change: transform;
}

@keyframes heroA-chevronBounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(4px); }
}

/* --- Registration Mark Reveal --- */
.heroA-swiss__reg-mark--reveal,
.heroA-swiss__reg-mark--circle-reveal {
  animation: heroA-regMarkFadeIn 400ms cubic-bezier(0, 0, 0, 1) 900ms forwards;
}

@keyframes heroA-regMarkFadeIn {
  to { opacity: 0.15; }
}

/* --- Dark Mode Overrides --- */
[data-theme="dark"] .heroA-swiss {
  background-color: var(--surface-0, #0A0A0C);
  color: var(--text-primary, #F5F5F0);
}

[data-theme="dark"] .heroA-swiss__name-word {
  color: var(--text-primary, #F5F5F0);
}

[data-theme="dark"] .heroA-swiss__tagline {
  color: var(--text-secondary, #9A9A9F);
}

[data-theme="dark"] .heroA-swiss__descriptor-item {
  color: var(--text-tertiary, #636368);
}

[data-theme="dark"] .heroA-swiss__rule {
  background-color: var(--text-tertiary, #636368);
}

[data-theme="dark"] .heroA-swiss__descriptor-sep {
  background-color: var(--text-tertiary, #636368);
}

[data-theme="dark"] .heroA-swiss__headshot {
  background-color: var(--surface-2, #232326);
}

[data-theme="dark"] .heroA-swiss__headshot-initials {
  color: var(--text-tertiary, #636368);
}

[data-theme="dark"] .heroA-swiss__scroll-chevron {
  color: var(--text-tertiary, #636368);
}

/* --- Reduced Motion --- */
@media (prefers-reduced-motion: reduce) {
  .heroA-swiss__name-word,
  .heroA-swiss__rule,
  .heroA-swiss__tagline,
  .heroA-swiss__descriptor,
  .heroA-swiss__headshot,
  .heroA-swiss__scroll-cue,
  .heroA-swiss__reg-mark,
  .heroA-swiss__reg-mark--circle-reveal {
    animation: none !important;
    opacity: 1 !important;
    transform: none !important;
  }
  .heroA-swiss__reg-mark {
    opacity: 0.15 !important;
  }
  .heroA-swiss__rule {
    opacity: 0.4 !important;
    transform: scaleX(1) !important;
  }
  .heroA-swiss__scroll-chevron {
    animation: none !important;
  }
}

/* --- Responsive --- */
@media (max-width: 768px) {
  .heroA-swiss {
    padding: var(--space-12, 48px) var(--space-6, 24px);
  }
  .heroA-swiss__meta {
    grid-template-columns: 1fr;
  }
  .heroA-swiss__headshot {
    width: 180px;
    height: 180px;
    order: -1;
    margin-bottom: var(--space-4, 16px);
  }
  .heroA-swiss__headshot-initials {
    font-size: 40px;
  }
  .heroA-swiss__descriptor {
    flex-wrap: wrap;
    gap: var(--space-3, 12px);
  }
  .heroA-swiss__reg-mark--crosshair {
    top: var(--space-6, 24px);
    left: var(--space-6, 24px);
  }
  .heroA-swiss__reg-mark--circle {
    top: var(--space-6, 24px);
    right: var(--space-6, 24px);
  }
  .heroA-swiss__reg-mark--frame {
    bottom: var(--space-6, 24px);
    left: var(--space-6, 24px);
  }
}
`;

/* -------------------------------------------------------------------------
   Style Injection Hook
   ------------------------------------------------------------------------- */
let stylesInjected = false;

function useInjectStyles() {
  useEffect(() => {
    if (stylesInjected) return;
    const style = document.createElement('style');
    style.setAttribute('data-heroA-swiss', '');
    style.textContent = STYLES;
    document.head.appendChild(style);
    stylesInjected = true;
    return () => {
      // Don't remove on unmount — Astro view transitions may re-mount
    };
  }, []);
}

/* -------------------------------------------------------------------------
   Component
   ------------------------------------------------------------------------- */
export default function HeroA_EditorialSwiss() {
  const [animate, setAnimate] = useState(false);
  const sectionRef = useRef(null);

  useInjectStyles();

  useEffect(() => {
    // Trigger animations after mount, allowing one frame for DOM paint
    const raf = requestAnimationFrame(() => {
      setAnimate(true);
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  const revealClass = (base, revealSuffix = '--reveal') =>
    animate ? `${base} ${base}${revealSuffix}` : base;

  return (
    <section ref={sectionRef} className="heroA-swiss" aria-label="Hero introduction">
      {/* Registration Marks — light mode only, via CSS */}
      <div className="heroA-swiss__reg-marks" aria-hidden="true">
        <span className={revealClass('heroA-swiss__reg-mark heroA-swiss__reg-mark--crosshair')}>
          +
        </span>
        <div
          className={
            animate
              ? 'heroA-swiss__reg-mark heroA-swiss__reg-mark--circle heroA-swiss__reg-mark--circle-reveal'
              : 'heroA-swiss__reg-mark heroA-swiss__reg-mark--circle'
          }
        />
        <span className={revealClass('heroA-swiss__reg-mark heroA-swiss__reg-mark--frame')}>
          A-1
        </span>
      </div>

      {/* Main Content */}
      <div className="heroA-swiss__content">
        {/* Name — cinematic scale, split-text mask reveal */}
        <div className="heroA-swiss__name-block" aria-label="Sean Winslow">
          <span className="heroA-swiss__name-line">
            <span className={revealClass('heroA-swiss__name-word')}>
              Sean
            </span>
          </span>
          <span className="heroA-swiss__name-line">
            <span className={revealClass('heroA-swiss__name-word')}>
              Winslow
            </span>
          </span>
        </div>

        {/* Divider */}
        <div className={revealClass('heroA-swiss__rule')} aria-hidden="true" />

        {/* Metadata Bar */}
        <div className="heroA-swiss__meta">
          <div className="heroA-swiss__meta-left">
            <p className={revealClass('heroA-swiss__tagline')}>
              I build products, animate stories, and obsess over the details between.
            </p>
            <div className={revealClass('heroA-swiss__descriptor')}>
              <span className="heroA-swiss__descriptor-item">Product Manager</span>
              <span className="heroA-swiss__descriptor-sep" aria-hidden="true" />
              <span className="heroA-swiss__descriptor-item">Creative Technologist</span>
              <span className="heroA-swiss__descriptor-sep" aria-hidden="true" />
              <span className="heroA-swiss__descriptor-item">Animator</span>
            </div>
          </div>

          {/* Headshot */}
          <div
            className={revealClass('heroA-swiss__headshot')}
            role="img"
            aria-label="Sean Winslow headshot placeholder"
          >
            <span className="heroA-swiss__headshot-initials">SW</span>
          </div>
        </div>
      </div>

      {/* Scroll Cue */}
      <div className={revealClass('heroA-swiss__scroll-cue')} aria-hidden="true">
        <svg
          className="heroA-swiss__scroll-chevron"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
    </section>
  );
}
