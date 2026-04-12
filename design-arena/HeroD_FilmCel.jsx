/**
 * HeroD_FilmCel.jsx
 * =================
 * Design Arena Entry — "Film Cel" Hero Variation
 *
 * DESIGN RATIONALE:
 * -----------------
 * The hero is an immersive dark cinema environment. Content sits within a literal
 * "film cel" frame — sprocket holes, cel registration pins, film grain, scanlines.
 * This is the ONLY dark-first variation; it forces a dark aesthetic regardless of
 * the global theme toggle. The cinematic metaphor mirrors the pencil test concept
 * in a different medium (film production).
 *
 * FONT CHOICES:
 * - Display: Bricolage Grotesque 700 (contemporary, slightly quirky letterforms)
 * - Body: Inter 400 for tagline
 * - Mono: JetBrains Mono 400 for role descriptors
 *
 * ANIMATION SYSTEM:
 * - Phase-based via useState + setTimeout chain
 * - clip-path wipe for name reveal
 * - Opacity/transform for all other elements
 * - prefers-reduced-motion: all elements appear immediately
 *
 * COLOR:
 * - Teal #14B8A6 for name (emissive on dark)
 * - Amber #F59E0B for CTA button
 * - Dark surface #0A0A0C background (always, even in light mode)
 * - Cel area #0E0E10 (slightly lighter)
 * - Text: #F5F5F0 primary, #9A9A9F secondary, #636368 tertiary
 */

import { useEffect, useRef, useState } from 'react';

/* -------------------------------------------------------------------------
   CSS-in-JS Styles (injected once via <style>)
   ------------------------------------------------------------------------- */
const STYLES = `
/* === HeroD Film Cel === */

.heroD {
  position: relative;
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #0A0A0C;
  color: #F5F5F0;
  overflow: hidden;
  font-family: var(--font-body, 'Inter', system-ui, sans-serif);
  isolation: isolate;
}

/* --- Vignette Overlay --- */
.heroD__vignette {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse 70% 70% at 50% 50%,
    transparent 0%,
    rgba(10, 10, 12, 0.4) 60%,
    rgba(10, 10, 12, 0.85) 100%
  );
  pointer-events: none;
  z-index: 1;
}

/* --- Film Grain Overlay --- */
.heroD__grain {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 10;
  opacity: 0.06;
  mix-blend-mode: multiply;
}

/* --- Scanlines Overlay --- */
.heroD__scanlines {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 0, 0, 0.03) 2px,
    rgba(0, 0, 0, 0.03) 4px
  );
  pointer-events: none;
  z-index: 2;
}

/* --- Film Cel Frame --- */
.heroD__cel {
  position: relative;
  z-index: 3;
  width: 100%;
  max-width: 960px;
  margin: 0 auto;
  border: 1px solid #38383D;
  background-color: #0E0E10;
  padding: 48px 56px;
  opacity: 0;
  transition: opacity 400ms cubic-bezier(0, 0, 0, 1);
}

.heroD__cel--visible {
  opacity: 1;
}

/* --- Sprocket Holes --- */
.heroD__sprockets {
  position: absolute;
  top: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  padding: 24px 0;
  pointer-events: none;
}

.heroD__sprockets--left {
  left: -20px;
}

.heroD__sprockets--right {
  right: -20px;
}

.heroD__sprocket {
  width: 8px;
  height: 12px;
  border-radius: 2px;
  border: 1px solid #38383D;
  background: transparent;
  opacity: 0;
  transition: opacity 300ms cubic-bezier(0, 0, 0, 1);
}

.heroD__sprocket--visible {
  opacity: 1;
}

/* --- Registration Pins --- */
.heroD__pins {
  position: absolute;
  top: -14px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 16px;
  pointer-events: none;
}

.heroD__pin {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  border: 1px solid #38383D;
  background: transparent;
  opacity: 0;
  transition: opacity 300ms cubic-bezier(0, 0, 0, 1);
}

.heroD__pin--visible {
  opacity: 1;
}

/* --- Content Layout --- */
.heroD__content {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 40px;
  align-items: center;
}

.heroD__text {
  display: flex;
  flex-direction: column;
  gap: 0;
}

/* --- Name (Teal Wipe) --- */
.heroD__name {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-weight: 700;
  font-size: clamp(36px, 6vw, 64px);
  line-height: 1.1;
  color: #14B8A6;
  margin: 0;
  clip-path: inset(0 50% 0 50%);
  will-change: clip-path;
}

.heroD__name--reveal {
  animation: heroD-tealWipe 600ms cubic-bezier(0.2, 0, 0, 1) forwards;
}

@keyframes heroD-tealWipe {
  from { clip-path: inset(0 50% 0 50%); }
  to { clip-path: inset(0 0 0 0); }
}

/* --- Tagline --- */
.heroD__tagline {
  font-family: var(--font-body, 'Inter', system-ui, sans-serif);
  font-size: 18px;
  font-weight: 400;
  line-height: 1.6;
  color: #9A9A9F;
  margin: 16px 0 0 0;
  opacity: 0;
  transform: translateY(16px);
  will-change: transform, opacity;
}

.heroD__tagline--reveal {
  animation: heroD-fadeUp 400ms cubic-bezier(0, 0, 0, 1) forwards;
}

@keyframes heroD-fadeUp {
  from {
    transform: translateY(16px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* --- CTA Button --- */
.heroD__cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-top: 24px;
  padding: 12px 28px;
  background-color: #F59E0B;
  color: #0A0A0C;
  font-family: var(--font-body, 'Inter', system-ui, sans-serif);
  font-size: 15px;
  font-weight: 600;
  line-height: 1;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  text-decoration: none;
  opacity: 0;
  transform: translateY(16px);
  will-change: transform, opacity;
  transition: transform 200ms cubic-bezier(0.2, 0, 0, 1);
  align-self: flex-start;
}

.heroD__cta--reveal {
  animation: heroD-fadeUp 400ms cubic-bezier(0, 0, 0, 1) forwards;
}

.heroD__cta:hover {
  transform: translateY(-1px);
}

.heroD__cta:active {
  transform: scale(0.98);
}

/* --- Role Descriptors --- */
.heroD__roles {
  display: flex;
  gap: 20px;
  align-items: center;
  margin-top: 20px;
  opacity: 0;
  transform: translateY(12px);
  will-change: transform, opacity;
}

.heroD__roles--reveal {
  animation: heroD-fadeUp 400ms cubic-bezier(0, 0, 0, 1) forwards;
}

.heroD__role {
  font-family: var(--font-mono, 'JetBrains Mono', monospace);
  font-size: 11px;
  font-weight: 400;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #636368;
}

.heroD__role-sep {
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background-color: #636368;
  flex-shrink: 0;
}

/* --- Headshot --- */
.heroD__headshot-wrap {
  position: relative;
  width: 180px;
  height: 180px;
  flex-shrink: 0;
  border-radius: 50%;
  overflow: hidden;
  opacity: 0;
  will-change: opacity;
}

.heroD__headshot-wrap--reveal {
  animation: heroD-fadeIn 500ms cubic-bezier(0, 0, 0, 1) forwards;
}

@keyframes heroD-fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.heroD__headshot {
  --spot-x: 50%;
  --spot-y: 50%;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #1A1A1E;
  background-image: radial-gradient(
    circle 60px at var(--spot-x) var(--spot-y),
    rgba(20, 184, 166, 0.15),
    transparent 70%
  );
  filter: grayscale(1);
  transition: filter 400ms cubic-bezier(0.2, 0, 0, 1);
  position: relative;
}

.heroD__headshot:hover {
  filter: grayscale(0.5);
}

.heroD__headshot-placeholder {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-weight: 700;
  font-size: 48px;
  color: #38383D;
  user-select: none;
  pointer-events: none;
}

/* --- Reduced Motion --- */
@media (prefers-reduced-motion: reduce) {
  .heroD__name {
    clip-path: inset(0 0 0 0) !important;
    animation: none !important;
  }

  .heroD__cel {
    opacity: 1 !important;
    transition: none !important;
  }

  .heroD__sprocket,
  .heroD__pin {
    opacity: 1 !important;
    transition: none !important;
  }

  .heroD__tagline,
  .heroD__cta,
  .heroD__roles,
  .heroD__headshot-wrap {
    opacity: 1 !important;
    transform: none !important;
    animation: none !important;
  }

  .heroD__scanlines {
    animation: none !important;
  }
}

/* --- Responsive (<768px) --- */
@media (max-width: 768px) {
  .heroD__cel {
    max-width: 100%;
    margin: 0 16px;
    padding: 32px 24px;
    border-left: none;
    border-right: none;
  }

  .heroD__sprockets {
    display: none;
  }

  .heroD__pins {
    display: none;
  }

  .heroD__content {
    grid-template-columns: 1fr;
    gap: 24px;
    text-align: center;
  }

  .heroD__headshot-wrap {
    width: 140px;
    height: 140px;
    justify-self: center;
    order: -1;
  }

  .heroD__cta {
    align-self: center;
  }

  .heroD__roles {
    justify-content: center;
    flex-wrap: wrap;
    gap: 12px;
  }

  .heroD__tagline {
    font-size: 16px;
  }

  .heroD__text {
    align-items: center;
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
export default function HeroD_FilmCel() {
  const [phase, setPhase] = useState(0);
  const headshotRef = useRef(null);

  // Self-inject Bricolage Grotesque font
  useEffect(() => {
    if (!document.querySelector('link[data-font-heroD]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;600;700;800&display=swap';
      link.setAttribute('data-font-heroD', '');
      document.head.appendChild(link);
    }
  }, []);

  // Phase-based animation choreography
  useEffect(() => {
    const timers = [];
    // Phase 0 is initial state (dark stage + grain)
    // Phase 1 (300ms): Cel frame border draws in
    timers.push(setTimeout(() => setPhase(1), 300));
    // Phase 2 (600ms): Sprocket holes + registration pins
    timers.push(setTimeout(() => setPhase(2), 600));
    // Phase 3 (800ms): Name teal-wipe
    timers.push(setTimeout(() => setPhase(3), 800));
    // Phase 4 (1200ms): Tagline fades up
    timers.push(setTimeout(() => setPhase(4), 1200));
    // Phase 5 (1400ms): Headshot fades in
    timers.push(setTimeout(() => setPhase(5), 1400));
    // Phase 6 (1600ms): CTA button fades up
    timers.push(setTimeout(() => setPhase(6), 1600));
    // Phase 7 (2000ms): Role descriptors fade in
    timers.push(setTimeout(() => setPhase(7), 2000));

    return () => timers.forEach(clearTimeout);
  }, []);

  // Spotlight interaction on headshot
  const handleSpotlight = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    e.currentTarget.style.setProperty('--spot-x', `${x}%`);
    e.currentTarget.style.setProperty('--spot-y', `${y}%`);
  };

  // Sprocket holes: 6 per side
  const sprocketCount = 6;
  const sprockets = Array.from({ length: sprocketCount }, (_, i) => i);

  return (
    <section className="heroD" aria-label="Hero introduction">
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      {/* Vignette */}
      <div className="heroD__vignette" aria-hidden="true" />

      {/* Scanlines */}
      <div className="heroD__scanlines" aria-hidden="true" />

      {/* Film Grain — inline SVG feTurbulence */}
      <svg className="heroD__grain" aria-hidden="true">
        <filter id="heroD-grain-filter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="4"
            stitchTiles="stitch"
          />
          <feColorMatrix
            type="saturate"
            values="0.1"
          />
        </filter>
        <rect
          width="100%"
          height="100%"
          filter="url(#heroD-grain-filter)"
        />
      </svg>

      {/* Film Cel Frame */}
      <div className={`heroD__cel${phase >= 1 ? ' heroD__cel--visible' : ''}`}>
        {/* Sprocket Holes — Left */}
        <div className="heroD__sprockets heroD__sprockets--left" aria-hidden="true">
          {sprockets.map((i) => (
            <div
              key={`l-${i}`}
              className={`heroD__sprocket${phase >= 2 ? ' heroD__sprocket--visible' : ''}`}
            />
          ))}
        </div>

        {/* Sprocket Holes — Right */}
        <div className="heroD__sprockets heroD__sprockets--right" aria-hidden="true">
          {sprockets.map((i) => (
            <div
              key={`r-${i}`}
              className={`heroD__sprocket${phase >= 2 ? ' heroD__sprocket--visible' : ''}`}
            />
          ))}
        </div>

        {/* Registration Pins */}
        <div className="heroD__pins" aria-hidden="true">
          <div className={`heroD__pin${phase >= 2 ? ' heroD__pin--visible' : ''}`} />
          <div className={`heroD__pin${phase >= 2 ? ' heroD__pin--visible' : ''}`} />
          <div className={`heroD__pin${phase >= 2 ? ' heroD__pin--visible' : ''}`} />
        </div>

        {/* Content Grid */}
        <div className="heroD__content">
          {/* Text Column */}
          <div className="heroD__text">
            {/* Name */}
            <h1 className={`heroD__name${phase >= 3 ? ' heroD__name--reveal' : ''}`}>
              Sean Winslow
            </h1>

            {/* Tagline */}
            <p className={`heroD__tagline${phase >= 4 ? ' heroD__tagline--reveal' : ''}`}>
              I build products, animate stories, and obsess over the details between.
            </p>

            {/* CTA */}
            <a
              href="#work"
              className={`heroD__cta${phase >= 6 ? ' heroD__cta--reveal' : ''}`}
            >
              View Work
            </a>

            {/* Role Descriptors */}
            <div className={`heroD__roles${phase >= 7 ? ' heroD__roles--reveal' : ''}`}>
              <span className="heroD__role">Product Manager</span>
              <span className="heroD__role-sep" aria-hidden="true" />
              <span className="heroD__role">Creative Technologist</span>
              <span className="heroD__role-sep" aria-hidden="true" />
              <span className="heroD__role">Animator</span>
            </div>
          </div>

          {/* Headshot */}
          <div
            ref={headshotRef}
            className={`heroD__headshot-wrap${phase >= 5 ? ' heroD__headshot-wrap--reveal' : ''}`}
          >
            <div
              className="heroD__headshot"
              onMouseMove={handleSpotlight}
            >
              <span className="heroD__headshot-placeholder" aria-hidden="true">
                SW
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
