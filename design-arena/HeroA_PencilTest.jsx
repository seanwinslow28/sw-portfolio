/**
 * HeroA_PencilTest.jsx
 * ====================
 * Design Arena Entry — "Pencil Test" Hero Variation
 *
 * DESIGN RATIONALE:
 * -----------------
 * The entire hero *draws itself in* via SVG stroke-dashoffset animation. The page
 * isn't loaded — it's sketched. This is the most literal interpretation of the
 * "animator's pencil test" metaphor from the project philosophy.
 *
 * The hero area is a centered single-column layout on warm paper (#FAF8F2 light /
 * #0A0A0C dark). SVG elements — registration crosshairs, a dashed frame border,
 * the name rendered as stroked text, an "A-1" frame number, and a rough character
 * silhouette — all draw on in a choreographed sequence using stroke-dashoffset.
 *
 * After the SVG sketch completes, the tagline and metadata row fade up as standard
 * HTML text, grounding the animation in readable content.
 *
 * FONT CHOICES:
 * - Display: Fraunces 700 (variable serif — thick/thin strokes evoke pencil
 *   pressure). Self-injected via useEffect.
 * - Body: Inter 400 for tagline
 * - Mono: JetBrains Mono 400 for metadata row, small caps
 *
 * ANIMATION SYSTEM:
 * - All CSS keyframes, zero GSAP dependency
 * - stroke-dashoffset drives the "drawing" effect for every SVG element
 * - Orchestrated via animation-delay on each element group
 * - prefers-reduced-motion: all elements appear immediately, no animation
 *
 * COLOR:
 * - Teal (#0D7377 light / #14B8A6 dark) for SVG strokes
 * - Amber (#B45309 light / #F59E0B dark) exclusively for "A-1" frame number
 * - Near-monochromatic outside those accents
 */

import { useEffect, useRef, useState } from 'react';

/* -------------------------------------------------------------------------
   CSS-in-JS Styles (injected once via <style>)
   ------------------------------------------------------------------------- */
const STYLES = `
/* === HeroA Pencil Test === */

.heroA-pencil {
  position: relative;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-16, 64px) var(--space-8, 32px);
  background-color: #FAF8F2;
  color: #1A1A1E;
  overflow: hidden;
  font-family: var(--font-body, 'Inter', system-ui, sans-serif);
}

[data-theme="dark"] .heroA-pencil {
  background-color: #0A0A0C;
  color: #F5F5F0;
}

/* --- SVG Canvas --- */
.heroA-pencil__svg {
  width: 100%;
  max-width: 960px;
  height: auto;
  overflow: visible;
}

/* --- Draw Stroke Keyframe --- */
@keyframes heroA-drawStroke {
  from { stroke-dashoffset: var(--path-length); }
  to { stroke-dashoffset: 0; }
}

@keyframes heroA-fillFadeIn {
  from { fill-opacity: 0; }
  to { fill-opacity: 1; }
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

@keyframes heroA-chevronBounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(4px); }
}

/* --- Registration Crosshairs --- */
.heroA-pencil__crosshair {
  stroke: #1A1A1E;
  stroke-width: 1;
  fill: none;
  --path-length: 20;
  stroke-dasharray: 20;
  stroke-dashoffset: 20;
  will-change: stroke-dashoffset;
}

[data-theme="dark"] .heroA-pencil__crosshair {
  stroke: #F5F5F0;
}

.heroA-pencil__crosshair--reveal {
  animation: heroA-drawStroke 400ms cubic-bezier(0, 0, 0, 1) forwards;
}

.heroA-pencil__crosshair--tl--reveal { animation-delay: 0ms; }
.heroA-pencil__crosshair--tr--reveal { animation-delay: 60ms; }
.heroA-pencil__crosshair--br--reveal { animation-delay: 120ms; }
.heroA-pencil__crosshair--bl--reveal { animation-delay: 180ms; }

/* --- Frame Border --- */
.heroA-pencil__frame-line {
  stroke: #1A1A1E;
  stroke-width: 1;
  fill: none;
  stroke-dasharray: 6 4;
  opacity: 0;
  will-change: opacity;
}

[data-theme="dark"] .heroA-pencil__frame-line {
  stroke: #F5F5F0;
}

.heroA-pencil__frame-line--reveal {
  animation: heroA-frameDraw 500ms cubic-bezier(0.2, 0, 0, 1) 300ms forwards;
}

@keyframes heroA-frameDraw {
  from { opacity: 0; }
  to { opacity: 0.25; }
}

/* --- A-1 Frame Number --- */
.heroA-pencil__frame-num {
  font-family: var(--font-mono, 'JetBrains Mono', monospace);
  font-size: 12px;
  stroke: #B45309;
  fill: none;
  --path-length: 120;
  stroke-dasharray: 120;
  stroke-dashoffset: 120;
  stroke-width: 1;
  will-change: stroke-dashoffset;
}

[data-theme="dark"] .heroA-pencil__frame-num {
  stroke: #F59E0B;
}

.heroA-pencil__frame-num--reveal {
  animation:
    heroA-drawStroke 200ms cubic-bezier(0, 0, 0, 1) 500ms forwards,
    heroA-fillFadeIn 300ms cubic-bezier(0.2, 0, 0, 1) 700ms forwards;
}

.heroA-pencil__frame-num--fill {
  fill: #B45309;
  fill-opacity: 0;
}

[data-theme="dark"] .heroA-pencil__frame-num--fill {
  fill: #F59E0B;
}

/* --- Name Text --- */
.heroA-pencil__name {
  font-family: 'Fraunces', serif;
  font-weight: 700;
  font-size: 1px; /* SVG units, actual size set via inline font-size attr */
  stroke: #0D7377;
  fill: none;
  stroke-width: 1.5;
  --path-length: 800;
  stroke-dasharray: 800;
  stroke-dashoffset: 800;
  will-change: stroke-dashoffset;
}

[data-theme="dark"] .heroA-pencil__name {
  stroke: #14B8A6;
}

.heroA-pencil__name--reveal {
  animation:
    heroA-drawStroke 1000ms cubic-bezier(0.2, 0, 0, 1) 600ms forwards,
    heroA-fillFadeIn 400ms cubic-bezier(0.2, 0, 0, 1) 1400ms forwards;
}

.heroA-pencil__name--fill {
  fill: #1A1A1E;
  fill-opacity: 0;
}

[data-theme="dark"] .heroA-pencil__name--fill {
  fill: #F5F5F0;
}

/* --- Character Silhouette --- */
.heroA-pencil__figure {
  stroke: #0D7377;
  stroke-width: 1.5;
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
  --path-length: 600;
  stroke-dasharray: 600;
  stroke-dashoffset: 600;
  will-change: stroke-dashoffset;
}

[data-theme="dark"] .heroA-pencil__figure {
  stroke: #14B8A6;
}

.heroA-pencil__figure--reveal {
  animation: heroA-drawStroke 600ms cubic-bezier(0.2, 0, 0, 1) 1200ms forwards;
}

/* --- Tagline --- */
.heroA-pencil__tagline {
  font-family: var(--font-body, 'Inter', system-ui, sans-serif);
  font-size: clamp(16px, 2vw, 20px);
  font-weight: 400;
  line-height: 1.5;
  color: #4A4A52;
  max-width: 540px;
  text-align: center;
  margin-top: var(--space-10, 40px);
  opacity: 0;
  transform: translateY(16px);
  will-change: transform, opacity;
}

[data-theme="dark"] .heroA-pencil__tagline {
  color: #9A9A9F;
}

.heroA-pencil__tagline--reveal {
  animation: heroA-fadeUp 400ms cubic-bezier(0, 0, 0, 1) 1600ms forwards;
}

/* --- Metadata Row --- */
.heroA-pencil__meta {
  display: flex;
  gap: var(--space-6, 24px);
  align-items: center;
  justify-content: center;
  margin-top: var(--space-4, 16px);
  opacity: 0;
  transform: translateY(12px);
  will-change: transform, opacity;
}

.heroA-pencil__meta--reveal {
  animation: heroA-fadeUp 400ms cubic-bezier(0, 0, 0, 1) 1800ms forwards;
}

.heroA-pencil__meta-item {
  font-family: var(--font-mono, 'JetBrains Mono', monospace);
  font-size: 12px;
  font-weight: 400;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-variant: small-caps;
  color: #8A8A8F;
}

[data-theme="dark"] .heroA-pencil__meta-item {
  color: #636368;
}

.heroA-pencil__meta-sep {
  width: 20px;
  height: 1px;
  background-color: #8A8A8F;
  opacity: 0.4;
  flex-shrink: 0;
}

[data-theme="dark"] .heroA-pencil__meta-sep {
  background-color: #636368;
}

/* --- Scroll Cue --- */
.heroA-pencil__scroll-cue {
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

.heroA-pencil__scroll-cue--reveal {
  animation: heroA-fadeUp 400ms cubic-bezier(0, 0, 0, 1) 2200ms forwards;
}

.heroA-pencil__scroll-chevron {
  color: #8A8A8F;
  will-change: transform;
}

[data-theme="dark"] .heroA-pencil__scroll-chevron {
  color: #636368;
}

.heroA-pencil__scroll-chevron--bounce {
  animation: heroA-chevronBounce 2000ms cubic-bezier(0.33, 1, 0.68, 1) 2600ms infinite;
}

/* --- Reduced Motion --- */
@media (prefers-reduced-motion: reduce) {
  .heroA-pencil__crosshair,
  .heroA-pencil__frame-line,
  .heroA-pencil__frame-num,
  .heroA-pencil__name,
  .heroA-pencil__figure,
  .heroA-pencil__tagline,
  .heroA-pencil__meta,
  .heroA-pencil__scroll-cue {
    animation: none !important;
    opacity: 1 !important;
    transform: none !important;
    stroke-dashoffset: 0 !important;
    fill-opacity: 1 !important;
  }

  .heroA-pencil__frame-line {
    opacity: 0.25 !important;
  }

  .heroA-pencil__name--fill {
    fill-opacity: 1 !important;
  }

  .heroA-pencil__frame-num--fill {
    fill-opacity: 1 !important;
  }

  .heroA-pencil__scroll-chevron {
    animation: none !important;
  }
}

/* --- Responsive --- */
@media (max-width: 768px) {
  .heroA-pencil {
    padding: var(--space-12, 48px) var(--space-4, 16px);
  }

  .heroA-pencil__figure {
    display: none;
  }

  .heroA-pencil__meta {
    flex-wrap: wrap;
    justify-content: center;
    gap: var(--space-3, 12px);
  }

  .heroA-pencil__meta-sep {
    display: none;
  }

  .heroA-pencil__meta-item {
    font-size: 11px;
  }
}
`;

/* -------------------------------------------------------------------------
   Style Injection Hook
   ------------------------------------------------------------------------- */
/* Style injection via JSX <style> tag in render — more reliable than useEffect */

/* -------------------------------------------------------------------------
   Component
   ------------------------------------------------------------------------- */
export default function HeroA_PencilTest() {
  const [animate, setAnimate] = useState(false);
  const sectionRef = useRef(null);

  // Self-inject Fraunces font
  useEffect(() => {
    if (!document.querySelector('link[data-font-heroA]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;700&display=swap';
      link.setAttribute('data-font-heroA', '');
      document.head.appendChild(link);
    }
  }, []);

  // Trigger animations after mount, allowing one frame for DOM paint
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      setAnimate(true);
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  const revealClass = (base, suffix = '--reveal') =>
    animate ? `${base} ${base}${suffix}` : base;

  // SVG viewBox dimensions
  const vw = 960;
  const vh = 520;
  const pad = 40; // inner frame padding
  const frameX = pad;
  const frameY = pad;
  const frameW = vw - pad * 2;
  const frameH = vh - pad * 2;

  return (
    <section ref={sectionRef} className="heroA-pencil" aria-label="Hero introduction">
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      {/* SVG Drawing Area */}
      <svg
        className="heroA-pencil__svg"
        viewBox={`0 0 ${vw} ${vh}`}
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        role="img"
        aria-label="Pencil test sketch of Sean Winslow"
      >
        {/* --- Registration Crosshairs (4 corners) --- */}
        {/* Top-left */}
        <g className={revealClass('heroA-pencil__crosshair heroA-pencil__crosshair--tl')}>
          <line x1="10" y1="20" x2="30" y2="20" />
          <line x1="20" y1="10" x2="20" y2="30" />
        </g>
        {/* Top-right */}
        <g className={revealClass('heroA-pencil__crosshair heroA-pencil__crosshair--tr')}>
          <line x1={vw - 30} y1="20" x2={vw - 10} y2="20" />
          <line x1={vw - 20} y1="10" x2={vw - 20} y2="30" />
        </g>
        {/* Bottom-right */}
        <g className={revealClass('heroA-pencil__crosshair heroA-pencil__crosshair--br')}>
          <line x1={vw - 30} y1={vh - 20} x2={vw - 10} y2={vh - 20} />
          <line x1={vw - 20} y1={vh - 30} x2={vw - 20} y2={vh - 10} />
        </g>
        {/* Bottom-left */}
        <g className={revealClass('heroA-pencil__crosshair heroA-pencil__crosshair--bl')}>
          <line x1="10" y1={vh - 20} x2="30" y2={vh - 20} />
          <line x1="20" y1={vh - 30} x2="20" y2={vh - 10} />
        </g>

        {/* --- Frame Border (dashed rectangle) --- */}
        <rect
          className={revealClass('heroA-pencil__frame-line')}
          x={frameX}
          y={frameY}
          width={frameW}
          height={frameH}
          rx="2"
          ry="2"
        />

        {/* --- A-1 Frame Number (amber, top-left of frame) --- */}
        <text
          className={`${revealClass('heroA-pencil__frame-num')} heroA-pencil__frame-num--fill`}
          x={frameX + 12}
          y={frameY + 20}
          fontSize="14"
        >
          A-1
        </text>

        {/* --- "Sean Winslow" Name (teal stroked text) --- */}
        <text
          className={`${revealClass('heroA-pencil__name')} heroA-pencil__name--fill`}
          x={vw / 2}
          y={vh * 0.42}
          textAnchor="middle"
          dominantBaseline="central"
          style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: 'clamp(48px, 10vw, 96px)' }}
          fontSize="80"
        >
          Sean Winslow
        </text>

        {/* --- Character Silhouette (simplified standing figure) --- */}
        <g
          className={revealClass('heroA-pencil__figure')}
          transform={`translate(${vw - 160}, ${vh - 220})`}
        >
          {/* Head */}
          <ellipse cx="40" cy="20" rx="14" ry="16" />
          {/* Neck */}
          <line x1="40" y1="36" x2="40" y2="48" />
          {/* Shoulders */}
          <line x1="18" y1="52" x2="62" y2="52" />
          {/* Torso */}
          <line x1="40" y1="48" x2="40" y2="100" />
          {/* Left arm */}
          <polyline points="18,52 10,85 20,100" fill="none" />
          {/* Right arm — holding pencil gesture */}
          <polyline points="62,52 72,78 65,95" fill="none" />
          {/* Pencil in right hand */}
          <line x1="65" y1="95" x2="58" y2="115" />
          {/* Left leg */}
          <polyline points="40,100 28,145 22,170" fill="none" />
          {/* Right leg */}
          <polyline points="40,100 52,145 58,170" fill="none" />
        </g>
      </svg>

      {/* --- Tagline (HTML below SVG) --- */}
      <p className={revealClass('heroA-pencil__tagline')}>
        I build products, animate stories, and obsess over the details between.
      </p>

      {/* --- Metadata Row --- */}
      <div className={revealClass('heroA-pencil__meta')}>
        <span className="heroA-pencil__meta-item">Product Manager</span>
        <span className="heroA-pencil__meta-sep" aria-hidden="true" />
        <span className="heroA-pencil__meta-item">Creative Technologist</span>
        <span className="heroA-pencil__meta-sep" aria-hidden="true" />
        <span className="heroA-pencil__meta-item">Animator</span>
      </div>

      {/* --- Scroll Cue --- */}
      <div className={revealClass('heroA-pencil__scroll-cue')} aria-hidden="true">
        <svg
          className={`heroA-pencil__scroll-chevron ${animate ? 'heroA-pencil__scroll-chevron--bounce' : ''}`}
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
