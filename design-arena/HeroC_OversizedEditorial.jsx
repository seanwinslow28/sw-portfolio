/**
 * HeroC_OversizedEditorial.jsx
 * ============================
 * Design Arena Entry — Oversized Editorial Hero
 *
 * DESIGN RATIONALE:
 * -----------------
 * Typography IS the design. No images compete. The name fills and breaks the
 * viewport with intentional asymmetry. Inspired by editorial magazine layouts
 * and Swiss typography. This is the most restrained, confident variation.
 *
 * The layout creates a broken grid: "Sean" in Instrument Serif italic bleeds
 * off the left edge while "Winslow" in Space Grotesk aligns right, producing
 * diagonal tension. A single teal horizontal rule bisects the two words.
 *
 * FONT CHOICES:
 * - "Sean": Instrument Serif 400 italic — elegant, editorial
 * - "Winslow": Space Grotesk 600 — geometric, modern
 * - Body: Inter 400
 * - Mono: JetBrains Mono 400 for metadata, frame numbers
 *
 * SIGNATURE INTERACTION:
 * - "Sean" reveals via clip-path wipe from left
 * - "Winslow" reveals via clip-path wipe from right
 * - Opposing directions create visual collision tension
 *
 * COLOR RATIO: 95/4/1 — near monochrome. Single teal accent on the rule.
 *
 * ANIMATION SYSTEM:
 * - All CSS keyframes, no GSAP
 * - Decelerate easing (cubic-bezier(0, 0, 0, 1))
 * - prefers-reduced-motion: all animations instantly resolve
 */

import { useEffect, useRef, useState } from 'react';

/* -------------------------------------------------------------------------
   CSS-in-JS Styles (injected once via <style>)
   ------------------------------------------------------------------------- */
const STYLES = `
/* === HeroC Oversized Editorial === */

@keyframes heroC-wipeFromLeft {
  from { clip-path: inset(0 100% 0 0); }
  to { clip-path: inset(0 0 0 0); }
}

@keyframes heroC-wipeFromRight {
  from { clip-path: inset(0 0 0 100%); }
  to { clip-path: inset(0 0 0 0); }
}

@keyframes heroC-ruleScaleIn {
  from {
    transform: scaleX(0);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  to {
    transform: scaleX(1);
    opacity: 1;
  }
}

@keyframes heroC-fadeUp {
  from {
    transform: translateY(16px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes heroC-fadeUpSmall {
  from {
    transform: translateY(12px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes heroC-regFadeIn {
  to { opacity: 0.15; }
}

/* --- Root Section --- */
.heroC-editorial {
  position: relative;
  height: 100dvh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
  background-color: #FAF8F2;
  color: #1A1A1E;
  font-family: 'Inter', system-ui, sans-serif;
}

/* --- Registration Marks (light mode only) --- */
.heroC-editorial__reg-marks {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
}

[data-theme="dark"] .heroC-editorial__reg-marks {
  display: none;
}

.heroC-editorial__reg-crosshair {
  position: absolute;
  bottom: 32px;
  left: 32px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 18px;
  font-weight: 300;
  line-height: 1;
  color: #1A1A1E;
  opacity: 0;
  user-select: none;
}

.heroC-editorial__reg-crosshair--reveal {
  animation: heroC-regFadeIn 300ms cubic-bezier(0, 0, 0, 1) 1000ms forwards;
}

.heroC-editorial__reg-frame {
  position: absolute;
  top: 32px;
  right: 32px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  font-weight: 400;
  line-height: 1;
  color: #8A8A8F;
  opacity: 0;
  user-select: none;
  transition: color 250ms cubic-bezier(0.2, 0, 0, 1);
  cursor: default;
}

.heroC-editorial__reg-frame--reveal {
  animation: heroC-regFadeIn 300ms cubic-bezier(0, 0, 0, 1) 1000ms forwards;
}

.heroC-editorial__reg-frame:hover {
  color: #B45309;
}

/* --- Typography Container --- */
.heroC-editorial__typography {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  width: 100%;
}

/* --- "Sean" --- */
.heroC-editorial__sean {
  font-family: 'Instrument Serif', Georgia, serif;
  font-style: italic;
  font-weight: 400;
  font-size: clamp(80px, 20vw, 240px);
  line-height: 0.85;
  color: #1A1A1E;
  margin-left: -5%;
  padding-left: 32px;
  clip-path: inset(0 100% 0 0);
  will-change: clip-path;
}

.heroC-editorial__sean--reveal {
  animation: heroC-wipeFromLeft 600ms cubic-bezier(0, 0, 0, 1) 0ms forwards;
}

/* --- Horizontal Rule --- */
.heroC-editorial__rule {
  width: 100%;
  height: 1px;
  background-color: #0D7377;
  opacity: 0;
  transform: scaleX(0);
  transform-origin: center center;
  will-change: transform, opacity;
  margin: 16px 0;
}

.heroC-editorial__rule--reveal {
  animation: heroC-ruleScaleIn 300ms cubic-bezier(0, 0, 0, 1) 500ms forwards;
}

/* --- "Winslow" --- */
.heroC-editorial__winslow {
  font-family: 'Space Grotesk', system-ui, sans-serif;
  font-weight: 600;
  font-size: clamp(60px, 15vw, 180px);
  line-height: 0.85;
  color: #1A1A1E;
  text-align: right;
  padding-right: 10%;
  clip-path: inset(0 0 0 100%);
  will-change: clip-path;
}

.heroC-editorial__winslow--reveal {
  animation: heroC-wipeFromRight 600ms cubic-bezier(0, 0, 0, 1) 300ms forwards;
}

/* --- Tagline --- */
.heroC-editorial__tagline {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: clamp(16px, 2vw, 20px);
  font-weight: 400;
  line-height: 1.5;
  color: #4A4A52;
  max-width: 480px;
  text-align: right;
  margin-left: auto;
  padding-right: 10%;
  margin-top: -0.4em;
  position: relative;
  opacity: 0;
  transform: translateY(16px);
  will-change: transform, opacity;
}

.heroC-editorial__tagline--reveal {
  animation: heroC-fadeUp 400ms cubic-bezier(0, 0, 0, 1) 700ms forwards;
}

/* --- Metadata Bar --- */
.heroC-editorial__meta {
  position: absolute;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 24px;
  z-index: 2;
  opacity: 0;
  will-change: transform, opacity;
}

.heroC-editorial__meta--reveal {
  animation: heroC-fadeUpSmall 300ms cubic-bezier(0, 0, 0, 1) 900ms forwards;
}

.heroC-editorial__meta-item {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  font-weight: 400;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: #8A8A8F;
  white-space: nowrap;
}

.heroC-editorial__meta-sep {
  width: 16px;
  height: 1px;
  background-color: #8A8A8F;
  opacity: 0.4;
  flex-shrink: 0;
}

/* --- Teal Rule Opacity --- */
.heroC-editorial__rule--visible {
  opacity: 0.4;
}

/* =================================================================
   DARK MODE
   ================================================================= */
[data-theme="dark"] .heroC-editorial {
  background-color: #0A0A0C;
  color: #F5F5F0;
}

[data-theme="dark"] .heroC-editorial__sean {
  color: #F5F5F0;
}

[data-theme="dark"] .heroC-editorial__winslow {
  color: #F5F5F0;
}

[data-theme="dark"] .heroC-editorial__rule {
  background-color: #14B8A6;
}

@keyframes heroC-ruleScaleInDark {
  from {
    transform: scaleX(0);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  to {
    transform: scaleX(1);
    opacity: 0.3;
  }
}

[data-theme="dark"] .heroC-editorial__rule--reveal {
  animation-name: heroC-ruleScaleInDark;
}

[data-theme="dark"] .heroC-editorial__tagline {
  color: #9A9A9F;
}

[data-theme="dark"] .heroC-editorial__meta-item {
  color: #636368;
}

[data-theme="dark"] .heroC-editorial__meta-sep {
  background-color: #636368;
}

[data-theme="dark"] .heroC-editorial__reg-frame {
  color: #636368;
}

[data-theme="dark"] .heroC-editorial__reg-frame:hover {
  color: #F59E0B;
}

/* =================================================================
   REDUCED MOTION
   ================================================================= */
@media (prefers-reduced-motion: reduce) {
  .heroC-editorial__sean,
  .heroC-editorial__winslow {
    clip-path: inset(0 0 0 0) !important;
    animation: none !important;
  }

  .heroC-editorial__rule {
    animation: none !important;
    opacity: 0.4 !important;
    transform: scaleX(1) !important;
  }

  [data-theme="dark"] .heroC-editorial__rule {
    opacity: 0.3 !important;
  }

  .heroC-editorial__tagline {
    animation: none !important;
    opacity: 1 !important;
    transform: none !important;
  }

  .heroC-editorial__meta {
    animation: none !important;
    opacity: 1 !important;
    transform: translateX(-50%) !important;
  }

  .heroC-editorial__reg-crosshair,
  .heroC-editorial__reg-frame {
    animation: none !important;
    opacity: 0.15 !important;
  }
}

/* =================================================================
   RESPONSIVE (<768px)
   ================================================================= */
@media (max-width: 768px) {
  .heroC-editorial__sean {
    margin-left: 0;
    padding-left: 24px;
    padding-right: 24px;
    text-align: center;
  }

  .heroC-editorial__winslow {
    text-align: center;
    padding-right: 24px;
    padding-left: 24px;
  }

  .heroC-editorial__tagline {
    text-align: center;
    padding-right: 24px;
    padding-left: 24px;
    margin-left: auto;
    margin-right: auto;
    margin-top: 8px;
  }

  .heroC-editorial__meta {
    flex-direction: column;
    gap: 8px;
    bottom: 24px;
  }

  .heroC-editorial__meta-sep {
    display: none;
  }

  .heroC-editorial__reg-crosshair {
    bottom: 24px;
    left: 24px;
  }

  .heroC-editorial__reg-frame {
    top: 24px;
    right: 24px;
  }
}
`;

/* -------------------------------------------------------------------------
   Style Injection Hook
   ------------------------------------------------------------------------- */
/* Style injection via JSX <style> tag in render */

/* -------------------------------------------------------------------------
   Component
   ------------------------------------------------------------------------- */
export default function HeroC_OversizedEditorial() {
  const [animate, setAnimate] = useState(false);
  const sectionRef = useRef(null);

  // Self-inject Google Fonts
  useEffect(() => {
    if (!document.querySelector('link[data-font-heroC]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@1&family=Space+Grotesk:wght@400;500;600;700&display=swap';
      link.setAttribute('data-font-heroC', '');
      document.head.appendChild(link);
    }
  }, []);

  // Trigger animations after mount
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      setAnimate(true);
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  const revealClass = (base, suffix = '--reveal') =>
    animate ? `${base} ${base}${suffix}` : base;

  return (
    <section
      ref={sectionRef}
      className="heroC-editorial"
      aria-label="Hero introduction"
    >
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      {/* Registration Marks — light mode only, hidden in dark via CSS */}
      <div className="heroC-editorial__reg-marks" aria-hidden="true">
        <span className={revealClass('heroC-editorial__reg-crosshair')}>
          +
        </span>
        <span className={revealClass('heroC-editorial__reg-frame')}>
          A-1
        </span>
      </div>

      {/* Typography Block */}
      <div className="heroC-editorial__typography">
        {/* "Sean" — Instrument Serif italic, wipes from left */}
        <div
          className={revealClass('heroC-editorial__sean')}
          aria-label="Sean"
        >
          Sean
        </div>

        {/* Horizontal Rule — teal at 40% opacity */}
        <div
          className={revealClass('heroC-editorial__rule')}
          aria-hidden="true"
        />

        {/* "Winslow" — Space Grotesk 600, wipes from right */}
        <div
          className={revealClass('heroC-editorial__winslow')}
          aria-label="Winslow"
        >
          Winslow
        </div>

        {/* Tagline — overlaps bottom of "Winslow" */}
        <p className={revealClass('heroC-editorial__tagline')}>
          I build products, animate stories, and obsess over the details between.
        </p>
      </div>

      {/* Metadata Bar — bottom of viewport */}
      <div className={revealClass('heroC-editorial__meta')} aria-hidden="true">
        <span className="heroC-editorial__meta-item">Product Manager</span>
        <span className="heroC-editorial__meta-sep" />
        <span className="heroC-editorial__meta-item">Creative Technologist</span>
        <span className="heroC-editorial__meta-sep" />
        <span className="heroC-editorial__meta-item">Animator</span>
      </div>
    </section>
  );
}
