/**
 * HeroB_ParallaxMultiplane.jsx
 * ============================
 * Design Arena Entry — Parallax Multiplane Hero
 *
 * DESIGN RATIONALE:
 * -----------------
 * Inspired by Disney's multiplane camera (1937). The hero is a layered composition
 * where 4 depth planes respond to mouse movement at different speeds, creating
 * real depth parallax. After the orchestrated entrance, the hero stays ALIVE —
 * continuously responding to the cursor position.
 *
 * LAYER STRUCTURE:
 *   Layer 0 (Background) — Paper texture + registration marks, 3px mouse multiplier
 *   Layer 1 (Mid-ground) — Teal gradient orb, 8px multiplier
 *   Layer 2 (Content)    — Name + tagline + descriptors, 5px multiplier
 *   Layer 3 (Foreground) — Headshot + amber accent, 12px multiplier
 *
 * FONT: Syne 700 (bold geometric, distinctive S and W letterforms). Self-injected.
 *
 * ANIMATION SYSTEM:
 *   - CSS keyframes for entrance choreography (1.3s total)
 *   - Mouse tracking via requestAnimationFrame with CSS transition smoothing
 *   - Touch devices: CSS idle drift animation as fallback
 *   - prefers-reduced-motion: everything appears instantly, no parallax
 *
 * WHAT MAKES THIS DISTINCT:
 *   - Persistent interactivity — hero is never "done," always responding
 *   - 4-layer parallax without any scroll library
 *   - Syne typeface brings geometric boldness vs. project Sora
 *   - Teal orb creates atmospheric "light source" depth cue
 */

import { useEffect, useRef, useState } from 'react';

/* -------------------------------------------------------------------------
   CSS-in-JS Styles (injected once via <style>)
   ------------------------------------------------------------------------- */
const STYLES = `
/* === HeroB Parallax Multiplane === */

.heroB-parallax {
  position: relative;
  height: 100dvh;
  min-height: 600px;
  overflow: hidden;
  background-color: #FAF8F2;
  color: #1A1A1E;
  font-family: 'Inter', system-ui, sans-serif;
}

[data-theme="dark"] .heroB-parallax {
  background-color: #0A0A0C;
  color: #F5F5F0;
}

/* --- Parallax Layer Base --- */
.heroB-parallax__layer {
  position: absolute;
  inset: 0;
  will-change: transform;
  transition: transform 150ms cubic-bezier(0.33, 1, 0.68, 1);
}

/* --- Layer 0: Background (paper + reg marks) --- */
.heroB-parallax__layer--bg {
  z-index: 0;
  opacity: 0;
}

.heroB-parallax__layer--bg-reveal {
  animation: heroB-layerBgIn 300ms cubic-bezier(0, 0, 0, 1) forwards;
}

@keyframes heroB-layerBgIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Paper texture via SVG filter */
.heroB-parallax__paper-texture {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.heroB-parallax__paper-texture svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

/* Registration marks */
.heroB-parallax__reg-marks {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

[data-theme="dark"] .heroB-parallax__reg-marks {
  display: none;
}

.heroB-parallax__reg-mark {
  position: absolute;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  line-height: 1;
  color: #1A1A1E;
  opacity: 0.15;
  user-select: none;
}

.heroB-parallax__reg-mark--crosshair {
  top: 32px;
  left: 32px;
  font-size: 18px;
  font-weight: 300;
}

.heroB-parallax__reg-mark--circle {
  top: 32px;
  right: 32px;
  width: 12px;
  height: 12px;
  border: 1px solid #1A1A1E;
  border-radius: 50%;
  opacity: 0.15;
}

.heroB-parallax__reg-mark--frame {
  bottom: 32px;
  left: 32px;
  color: #0D7377;
}

/* --- Layer 1: Mid-ground (teal orb) --- */
.heroB-parallax__layer--mid {
  z-index: 1;
  pointer-events: none;
  opacity: 0;
  transform: scale(0.8);
}

.heroB-parallax__layer--mid-reveal {
  animation: heroB-orbIn 400ms cubic-bezier(0, 0, 0, 1) 200ms forwards;
}

@keyframes heroB-orbIn {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.heroB-parallax__orb {
  position: absolute;
  top: 40%;
  left: 60%;
  width: 300px;
  height: 300px;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  background: radial-gradient(circle, rgba(13, 115, 119, 0.12) 0%, transparent 70%);
  pointer-events: none;
}

[data-theme="dark"] .heroB-parallax__orb {
  background: radial-gradient(circle, rgba(20, 184, 166, 0.18) 0%, transparent 70%);
}

/* --- Layer 2: Content (name + tagline) --- */
.heroB-parallax__layer--content {
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: 0 clamp(32px, 8vw, 120px);
}

/* Name — mask reveal per word */
.heroB-parallax__name-block {
  margin-bottom: 16px;
}

.heroB-parallax__name-line {
  display: block;
  overflow: hidden;
}

.heroB-parallax__name-word {
  display: block;
  font-family: 'Syne', system-ui, sans-serif;
  font-size: clamp(48px, 9vw, 88px);
  font-weight: 700;
  line-height: 1.05;
  letter-spacing: -0.02em;
  color: #1A1A1E;
  transform: translateY(110%);
  opacity: 0;
  will-change: transform, opacity;
}

[data-theme="dark"] .heroB-parallax__name-word {
  color: #F5F5F0;
}

.heroB-parallax__name-word--reveal {
  animation: heroB-nameMaskReveal 500ms cubic-bezier(0, 0, 0, 1) forwards;
}

.heroB-parallax__name-line:nth-child(1) .heroB-parallax__name-word--reveal {
  animation-delay: 400ms;
}

.heroB-parallax__name-line:nth-child(2) .heroB-parallax__name-word--reveal {
  animation-delay: 520ms;
}

@keyframes heroB-nameMaskReveal {
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

/* Tagline */
.heroB-parallax__tagline {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: clamp(16px, 2vw, 20px);
  font-weight: 400;
  line-height: 1.5;
  color: #4A4A52;
  max-width: 480px;
  margin-bottom: 16px;
  opacity: 0;
  transform: translateY(12px);
  will-change: transform, opacity;
}

[data-theme="dark"] .heroB-parallax__tagline {
  color: #9A9A9F;
}

.heroB-parallax__tagline--reveal {
  animation: heroB-fadeUp 400ms cubic-bezier(0, 0, 0, 1) 700ms forwards;
}

@keyframes heroB-fadeUp {
  from {
    transform: translateY(12px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Role descriptors */
.heroB-parallax__descriptors {
  display: flex;
  gap: 20px;
  align-items: center;
  opacity: 0;
  transform: translateY(10px);
  will-change: transform, opacity;
}

.heroB-parallax__descriptors--reveal {
  animation: heroB-fadeUp 400ms cubic-bezier(0, 0, 0, 1) 800ms forwards;
}

.heroB-parallax__descriptor-item {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  font-weight: 400;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #8A8A8F;
}

[data-theme="dark"] .heroB-parallax__descriptor-item {
  color: #636368;
}

.heroB-parallax__descriptor-sep {
  width: 16px;
  height: 1px;
  background-color: #8A8A8F;
  opacity: 0.5;
}

[data-theme="dark"] .heroB-parallax__descriptor-sep {
  background-color: #636368;
}

/* --- Layer 3: Foreground (headshot + amber dot) --- */
.heroB-parallax__layer--fg {
  z-index: 3;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: clamp(48px, 10vw, 160px);
}

.heroB-parallax__fg-group {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 40px;
  opacity: 0;
  transform: scale(0.92);
  will-change: transform, opacity;
}

.heroB-parallax__fg-group--reveal {
  animation: heroB-fgIn 400ms cubic-bezier(0, 0, 0, 1) 900ms forwards;
}

@keyframes heroB-fgIn {
  from {
    opacity: 0;
    transform: scale(0.92);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.heroB-parallax__headshot {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background-color: #E8E4DA;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  filter: grayscale(100%);
  transition: filter 300ms cubic-bezier(0.2, 0, 0, 1);
  pointer-events: auto;
  cursor: default;
}

[data-theme="dark"] .heroB-parallax__headshot {
  background-color: #232326;
}

.heroB-parallax__headshot:hover {
  filter: grayscale(0%);
}

.heroB-parallax__headshot-initials {
  font-family: 'Syne', system-ui, sans-serif;
  font-size: 48px;
  font-weight: 600;
  color: #8A8A8F;
  line-height: 1;
  user-select: none;
}

[data-theme="dark"] .heroB-parallax__headshot-initials {
  color: #636368;
}

.heroB-parallax__amber-dot {
  position: absolute;
  bottom: 16px;
  right: -8px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #B45309;
}

[data-theme="dark"] .heroB-parallax__amber-dot {
  background-color: #F59E0B;
}

/* --- Scroll Cue --- */
.heroB-parallax__scroll-cue {
  position: absolute;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 4;
  opacity: 0;
  will-change: opacity;
}

.heroB-parallax__scroll-cue--reveal {
  animation: heroB-scrollCueIn 400ms cubic-bezier(0, 0, 0, 1) 1300ms forwards;
}

@keyframes heroB-scrollCueIn {
  to { opacity: 1; }
}

.heroB-parallax__scroll-chevron {
  color: #8A8A8F;
  animation: heroB-chevronBounce 2000ms cubic-bezier(0.33, 1, 0.68, 1) 1600ms infinite;
  will-change: transform;
}

[data-theme="dark"] .heroB-parallax__scroll-chevron {
  color: #636368;
}

@keyframes heroB-chevronBounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(4px); }
}

/* --- Touch Device Idle Drift (no hover = no mouse) --- */
@media (hover: none) {
  .heroB-parallax__layer--bg {
    animation: heroB-driftSlow 8s cubic-bezier(0.33, 1, 0.68, 1) infinite alternate;
  }
  .heroB-parallax__layer--mid {
    animation: heroB-driftMid 12s cubic-bezier(0.33, 1, 0.68, 1) infinite alternate;
  }
  .heroB-parallax__layer--content {
    animation: heroB-driftContent 10s cubic-bezier(0.33, 1, 0.68, 1) infinite alternate;
  }
  .heroB-parallax__layer--fg {
    animation: heroB-driftFast 6s cubic-bezier(0.33, 1, 0.68, 1) infinite alternate;
  }

  /* Override entrance opacity — drift includes its own timing */
  .heroB-parallax__layer--bg-reveal {
    animation: heroB-layerBgIn 300ms cubic-bezier(0, 0, 0, 1) forwards,
               heroB-driftSlow 8s cubic-bezier(0.33, 1, 0.68, 1) 1.3s infinite alternate;
  }
  .heroB-parallax__layer--mid-reveal {
    animation: heroB-orbIn 400ms cubic-bezier(0, 0, 0, 1) 200ms forwards,
               heroB-driftMid 12s cubic-bezier(0.33, 1, 0.68, 1) 1.3s infinite alternate;
  }
}

@keyframes heroB-driftSlow {
  0% { transform: translate3d(0, 0, 0); }
  50% { transform: translate3d(3px, -2px, 0); }
  100% { transform: translate3d(-1px, 2px, 0); }
}

@keyframes heroB-driftMid {
  0% { transform: translate3d(0, 0, 0); }
  50% { transform: translate3d(-4px, 3px, 0); }
  100% { transform: translate3d(2px, -3px, 0); }
}

@keyframes heroB-driftContent {
  0% { transform: translate3d(0, 0, 0); }
  50% { transform: translate3d(2px, -2px, 0); }
  100% { transform: translate3d(-2px, 1px, 0); }
}

@keyframes heroB-driftFast {
  0% { transform: translate3d(0, 0, 0); }
  50% { transform: translate3d(-5px, 4px, 0); }
  100% { transform: translate3d(4px, -3px, 0); }
}

/* --- Reduced Motion --- */
@media (prefers-reduced-motion: reduce) {
  .heroB-parallax__layer {
    transition: none !important;
    animation: none !important;
    transform: none !important;
  }

  .heroB-parallax__layer--bg,
  .heroB-parallax__layer--mid {
    opacity: 1 !important;
    transform: none !important;
  }

  .heroB-parallax__name-word {
    animation: none !important;
    opacity: 1 !important;
    transform: none !important;
  }

  .heroB-parallax__tagline,
  .heroB-parallax__descriptors {
    animation: none !important;
    opacity: 1 !important;
    transform: none !important;
  }

  .heroB-parallax__fg-group {
    animation: none !important;
    opacity: 1 !important;
    transform: none !important;
  }

  .heroB-parallax__scroll-cue {
    animation: none !important;
    opacity: 1 !important;
  }

  .heroB-parallax__scroll-chevron {
    animation: none !important;
  }

  .heroB-parallax__reg-mark {
    opacity: 0.15 !important;
  }

  .heroB-parallax__orb {
    opacity: 1 !important;
  }
}

/* --- Responsive (mobile < 768px) --- */
@media (max-width: 768px) {
  .heroB-parallax__layer--content {
    justify-content: flex-end;
    align-items: center;
    text-align: center;
    padding: 0 24px;
    padding-bottom: 100px;
  }

  .heroB-parallax__name-block {
    width: 100%;
  }

  .heroB-parallax__name-word {
    font-size: clamp(40px, 12vw, 64px);
  }

  .heroB-parallax__tagline {
    max-width: 100%;
    text-align: center;
  }

  .heroB-parallax__descriptors {
    flex-wrap: wrap;
    justify-content: center;
    gap: 12px;
  }

  .heroB-parallax__layer--fg {
    justify-content: center;
    align-items: flex-start;
    padding-right: 0;
    padding-top: clamp(100px, 20vh, 180px);
  }

  .heroB-parallax__fg-group {
    margin-top: 0;
  }

  .heroB-parallax__headshot {
    width: 180px;
    height: 180px;
  }

  .heroB-parallax__headshot-initials {
    font-size: 40px;
  }

  .heroB-parallax__reg-mark--crosshair {
    top: 24px;
    left: 24px;
  }

  .heroB-parallax__reg-mark--circle {
    top: 24px;
    right: 24px;
  }

  .heroB-parallax__reg-mark--frame {
    bottom: 24px;
    left: 24px;
  }

  .heroB-parallax__orb {
    width: 200px;
    height: 200px;
    top: 30%;
    left: 50%;
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
export default function HeroB_ParallaxMultiplane() {
  const [animate, setAnimate] = useState(false);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const sectionRef = useRef(null);


  // Self-inject Syne font
  useEffect(() => {
    if (!document.querySelector('link[data-font-heroB]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&display=swap';
      link.setAttribute('data-font-heroB', '');
      document.head.appendChild(link);
    }
  }, []);

  // Trigger entrance animations after one frame
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      setAnimate(true);
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  // Mouse tracking for parallax
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    // Only track on devices with hover (mouse)
    const hasHover = window.matchMedia('(hover: hover)').matches;
    if (!hasHover) return;

    let rafId;
    const handleMouseMove = (e) => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const rect = section.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2; // -1 to 1
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2; // -1 to 1
        setMouse({ x, y });
      });
    };

    section.addEventListener('mousemove', handleMouseMove);
    return () => {
      section.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  const revealClass = (base, suffix = '--reveal') =>
    animate ? `${base} ${base}${suffix}` : base;

  // Layer parallax transforms
  const layerTransform = (multiplier) => ({
    transform: `translate3d(${mouse.x * multiplier}px, ${mouse.y * multiplier}px, 0)`,
  });

  return (
    <section
      ref={sectionRef}
      className="heroB-parallax"
      aria-label="Hero introduction"
    >
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      {/* Layer 0 — Background: paper texture + registration marks */}
      <div
        className={revealClass('heroB-parallax__layer heroB-parallax__layer--bg')}
        style={layerTransform(3)}
        aria-hidden="true"
      >
        {/* Paper texture via inline SVG feTurbulence */}
        <div className="heroB-parallax__paper-texture">
          <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
            <filter id="heroB-paperNoise">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.65"
                numOctaves="4"
                stitchTiles="stitch"
              />
              <feColorMatrix type="saturate" values="0" />
            </filter>
            <rect
              width="100%"
              height="100%"
              filter="url(#heroB-paperNoise)"
              opacity="0.03"
              style={{ mixBlendMode: 'multiply' }}
            />
          </svg>
        </div>

        {/* Registration marks — light mode only via CSS */}
        <div className="heroB-parallax__reg-marks">
          <span className="heroB-parallax__reg-mark heroB-parallax__reg-mark--crosshair">
            +
          </span>
          <div className="heroB-parallax__reg-mark heroB-parallax__reg-mark--circle" />
          <span className="heroB-parallax__reg-mark heroB-parallax__reg-mark--frame">
            A-1
          </span>
        </div>
      </div>

      {/* Layer 1 — Mid-ground: teal gradient orb */}
      <div
        className={revealClass('heroB-parallax__layer heroB-parallax__layer--mid')}
        style={layerTransform(8)}
        aria-hidden="true"
      >
        <div className="heroB-parallax__orb" />
      </div>

      {/* Layer 2 — Content: name + tagline + descriptors */}
      <div
        className="heroB-parallax__layer heroB-parallax__layer--content"
        style={layerTransform(5)}
      >
        <div className="heroB-parallax__name-block" aria-label="Sean Winslow">
          <span className="heroB-parallax__name-line">
            <span className={revealClass('heroB-parallax__name-word')}>
              Sean
            </span>
          </span>
          <span className="heroB-parallax__name-line">
            <span className={revealClass('heroB-parallax__name-word')}>
              Winslow
            </span>
          </span>
        </div>

        <p className={revealClass('heroB-parallax__tagline')}>
          I build products, animate stories, and obsess over the details between.
        </p>

        <div className={revealClass('heroB-parallax__descriptors')}>
          <span className="heroB-parallax__descriptor-item">Product Manager</span>
          <span className="heroB-parallax__descriptor-sep" aria-hidden="true" />
          <span className="heroB-parallax__descriptor-item">Creative Technologist</span>
          <span className="heroB-parallax__descriptor-sep" aria-hidden="true" />
          <span className="heroB-parallax__descriptor-item">Animator</span>
        </div>
      </div>

      {/* Layer 3 — Foreground: headshot + amber accent */}
      <div
        className="heroB-parallax__layer heroB-parallax__layer--fg"
        style={layerTransform(12)}
      >
        <div className={revealClass('heroB-parallax__fg-group')}>
          <div
            className="heroB-parallax__headshot"
            role="img"
            aria-label="Sean Winslow headshot placeholder"
          >
            <span className="heroB-parallax__headshot-initials">SW</span>
          </div>
          <div className="heroB-parallax__amber-dot" aria-hidden="true" />
        </div>
      </div>

      {/* Scroll Cue */}
      <div className={revealClass('heroB-parallax__scroll-cue')} aria-hidden="true">
        <svg
          className="heroB-parallax__scroll-chevron"
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
