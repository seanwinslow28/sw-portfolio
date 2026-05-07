/**
 * HeroE_KineticTicker.jsx
 * =======================
 * Design Arena Entry — "Kinetic Ticker" Hero Variation
 *
 * DESIGN RATIONALE:
 * -----------------
 * Motion as language. The hero features a perpetually scrolling horizontal
 * ticker/marquee of role descriptors that creates kinetic energy. The name
 * entrance uses a character-by-character blur-to-sharp reveal. This variation
 * has PERPETUAL MOTION after load — the ticker never stops (except on hover
 * or when prefers-reduced-motion is active).
 *
 * LAYOUT:
 * - Top zone (60%): Name with per-character blur reveal + tagline + reg marks
 * - Bottom zone (40%): Full-width teal ticker strip with infinite marquee
 *
 * FONT CHOICES:
 * - Display: Space Grotesk 700 (clean geometric, excellent for motion)
 * - Body: Inter 400 for tagline
 * - Mono: JetBrains Mono 400 for registration marks
 *
 * ANIMATION SYSTEM:
 * - useState for animate trigger, set via requestAnimationFrame in useEffect
 * - Character-by-character blur-to-sharp with 30ms stagger
 * - Infinite CSS marquee with hover-to-pause
 * - prefers-reduced-motion: all animations disabled, ticker stops
 *
 * COLOR:
 * - Primary teal: #0D7377 (light) / #14B8A6 (dark) — ticker strip bg
 * - Accent amber: #B45309 (light) / #F59E0B (dark) — dot separators
 * - Surfaces: #FAF8F2 light bg, #0A0A0C dark bg
 * - Text: #1A1A1E light / #F5F5F0 dark
 * - Ticker text: #FAF8F2 (light cream on teal)
 */

import { useEffect, useState } from 'react';

/* -------------------------------------------------------------------------
   CSS-in-JS Styles (injected once via <style>)
   ------------------------------------------------------------------------- */
const STYLES = `
/* === HeroE Kinetic Ticker === */

.heroE {
  position: relative;
  height: 100dvh;
  display: flex;
  flex-direction: column;
  background-color: #FAF8F2;
  color: #1A1A1E;
  overflow: hidden;
  font-family: var(--font-body, 'Inter', system-ui, sans-serif);
  isolation: isolate;
}

[data-theme="dark"] .heroE {
  background-color: #0A0A0C;
  color: #F5F5F0;
}

/* --- Top Zone (60%) --- */
.heroE__top {
  flex: 0 0 60%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 0 24px;
}

/* --- Registration Marks --- */
.heroE__reg-crosshair,
.heroE__reg-frame {
  position: absolute;
  font-family: 'JetBrains Mono', monospace;
  color: #8A8A8F;
  opacity: 0;
  transition: none;
  pointer-events: none;
  user-select: none;
}

[data-theme="dark"] .heroE__reg-crosshair,
[data-theme="dark"] .heroE__reg-frame {
  color: #636368;
}

.heroE__reg-crosshair {
  top: 24px;
  left: 24px;
  font-size: 18px;
  line-height: 1;
}

.heroE__reg-frame {
  top: 24px;
  right: 24px;
  font-size: 11px;
  letter-spacing: 0.05em;
}

.heroE__reg-crosshair--reveal,
.heroE__reg-frame--reveal {
  animation: heroE-regFadeIn 300ms cubic-bezier(0, 0, 0, 1) forwards;
  animation-delay: 500ms;
}

@keyframes heroE-regFadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 0.15;
  }
}

/* --- Name --- */
.heroE__name {
  font-family: 'Space Grotesk', system-ui, sans-serif;
  font-weight: 700;
  font-size: clamp(48px, 8vw, 80px);
  line-height: 1.1;
  text-align: center;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

/* Individual character span */
.heroE__char {
  display: inline-block;
  opacity: 0;
  filter: blur(8px);
  will-change: opacity, filter;
}

.heroE__char--reveal {
  animation: heroE-charReveal 400ms cubic-bezier(0, 0, 0, 1) forwards;
  animation-delay: calc(var(--char-index) * 30ms);
}

@keyframes heroE-charReveal {
  from {
    opacity: 0;
    filter: blur(8px);
  }
  to {
    opacity: 1;
    filter: blur(0);
  }
}

/* --- Tagline --- */
.heroE__tagline {
  font-family: var(--font-body, 'Inter', system-ui, sans-serif);
  font-weight: 400;
  font-size: clamp(16px, 2vw, 20px);
  line-height: 1.5;
  color: #4A4A52;
  max-width: 540px;
  text-align: center;
  margin: 20px 0 0;
  opacity: 0;
  transform: translateY(16px);
  transition: none;
}

[data-theme="dark"] .heroE__tagline {
  color: #9A9A9F;
}

.heroE__tagline--reveal {
  animation: heroE-fadeUp 300ms cubic-bezier(0, 0, 0, 1) forwards;
  animation-delay: 400ms;
}

@keyframes heroE-fadeUp {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* --- Scroll Cue (chevron) --- */
.heroE__scroll-cue {
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  opacity: 0;
  transition: none;
}

.heroE__scroll-cue--reveal {
  animation: heroE-cueFadeIn 400ms cubic-bezier(0, 0, 0, 1) forwards;
  animation-delay: 900ms;
}

@keyframes heroE-cueFadeIn {
  from { opacity: 0; }
  to { opacity: 0.5; }
}

.heroE__scroll-cue svg {
  width: 24px;
  height: 24px;
  color: #4A4A52;
  animation: heroE-bounce 2s cubic-bezier(0.34, 1.56, 0.64, 1) infinite;
  animation-delay: 1.4s;
}

[data-theme="dark"] .heroE__scroll-cue svg {
  color: #9A9A9F;
}

@keyframes heroE-bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(6px); }
}

/* --- Bottom Zone / Ticker Strip (40%) --- */
.heroE__ticker {
  flex: 0 0 40%;
  display: flex;
  align-items: center;
  background-color: rgba(13, 115, 119, 0.9);
  overflow: hidden;
  position: relative;
  opacity: 0;
  transform: translateY(100%);
  transition: none;
  cursor: default;
}

[data-theme="dark"] .heroE__ticker {
  background-color: rgba(20, 184, 166, 0.9);
}

.heroE__ticker--reveal {
  animation: heroE-tickerSlideUp 400ms cubic-bezier(0, 0, 0, 1) forwards;
  animation-delay: 700ms;
}

@keyframes heroE-tickerSlideUp {
  from {
    opacity: 0;
    transform: translateY(100%);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* --- Ticker Track (infinite marquee) --- */
.heroE__ticker-track {
  display: flex;
  align-items: center;
  gap: 0;
  width: max-content;
  animation: heroE-scroll 25s linear infinite;
  animation-delay: 1100ms;
  animation-play-state: running;
  will-change: transform;
}

.heroE__ticker:hover .heroE__ticker-track {
  animation-play-state: paused;
}

@keyframes heroE-scroll {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

/* --- Ticker Item --- */
.heroE__ticker-item {
  font-family: 'Space Grotesk', system-ui, sans-serif;
  font-weight: 500;
  font-size: clamp(20px, 3vw, 36px);
  color: #FAF8F2;
  white-space: nowrap;
  padding: 0 16px;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

.heroE__ticker-item:hover {
  transform: scale(1.08);
}

/* --- Amber Dot Separator --- */
.heroE__ticker-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #B45309;
  flex-shrink: 0;
}

[data-theme="dark"] .heroE__ticker-dot {
  background-color: #F59E0B;
}

/* ===========================
   Responsive (<768px)
   =========================== */
@media (max-width: 767px) {
  .heroE__reg-crosshair {
    top: 16px;
    left: 16px;
    font-size: 14px;
  }

  .heroE__reg-frame {
    top: 16px;
    right: 16px;
    font-size: 9px;
  }

  .heroE__top {
    padding: 0 16px;
  }

  .heroE__tagline {
    margin-top: 16px;
  }

  .heroE__ticker-track {
    animation-duration: 20s;
  }

  .heroE__ticker-item {
    padding: 0 12px;
    gap: 12px;
  }

  .heroE__ticker-dot {
    width: 6px;
    height: 6px;
  }
}

/* ===========================
   Reduced Motion
   =========================== */
@media (prefers-reduced-motion: reduce) {
  .heroE__char {
    opacity: 1;
    filter: none;
  }

  .heroE__char--reveal {
    animation: none;
    opacity: 1;
    filter: none;
  }

  .heroE__tagline {
    opacity: 1;
    transform: none;
  }

  .heroE__tagline--reveal {
    animation: none;
    opacity: 1;
    transform: none;
  }

  .heroE__reg-crosshair--reveal,
  .heroE__reg-frame--reveal {
    animation: none;
    opacity: 0.15;
  }

  .heroE__ticker {
    opacity: 1;
    transform: none;
  }

  .heroE__ticker--reveal {
    animation: none;
    opacity: 1;
    transform: none;
  }

  .heroE__ticker-track {
    animation: none;
  }

  .heroE__ticker-item:hover {
    transform: none;
  }

  .heroE__scroll-cue {
    opacity: 0.5;
  }

  .heroE__scroll-cue--reveal {
    animation: none;
    opacity: 0.5;
  }

  .heroE__scroll-cue svg {
    animation: none;
  }
}
`;

/* -------------------------------------------------------------------------
   Style Injection Hook
   ------------------------------------------------------------------------- */
/* Style injection via JSX <style> tag in render */

/* -------------------------------------------------------------------------
   Ticker Items
   ------------------------------------------------------------------------- */
const TICKER_ITEMS = [
  'Product Designer',
  'Animator',
  'Builder',
  'Detail Obsessive',
  'Creative Technologist',
  'Storyteller',
];

/* -------------------------------------------------------------------------
   Component
   ------------------------------------------------------------------------- */
export default function HeroE_KineticTicker() {
  const [animate, setAnimate] = useState(false);



  // Self-inject Space Grotesk font
  useEffect(() => {
    if (!document.querySelector('link[data-font-heroE]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap';
      link.setAttribute('data-font-heroE', '');
      document.head.appendChild(link);
    }
  }, []);

  // Trigger animations on first frame
  useEffect(() => {
    requestAnimationFrame(() => {
      setAnimate(true);
    });
  }, []);

  /** Helper: returns base class + reveal modifier when animate is true */
  const revealClass = (base, suffix = '--reveal') =>
    animate ? `${base} ${base}${suffix}` : base;

  /** Render a single set of ticker items with dot separators */
  const renderTickerItems = (keyPrefix) =>
    TICKER_ITEMS.map((item, i) => (
      <span key={`${keyPrefix}-${i}`} className="heroE__ticker-item">
        <span>{item}</span>
        <span className="heroE__ticker-dot" aria-hidden="true" />
      </span>
    ));

  return (
    <section className="heroE" aria-label="Hero — Sean Winslow, Product Designer">
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      {/* --- Top Zone: Name + Tagline --- */}
      <div className="heroE__top">
        {/* Registration marks (light mode visual detail) */}
        <span
          className={revealClass('heroE__reg-crosshair')}
          aria-hidden="true"
        >
          +
        </span>
        <span
          className={revealClass('heroE__reg-frame')}
          aria-hidden="true"
        >
          A-1
        </span>

        {/* Name — character-by-character blur reveal */}
        <h1 className="heroE__name">
          {'Sean Winslow'.split('').map((char, i) => (
            <span
              key={i}
              className={animate ? 'heroE__char heroE__char--reveal' : 'heroE__char'}
              style={{ '--char-index': i }}
            >
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </h1>

        {/* Tagline */}
        <p className={revealClass('heroE__tagline')}>
          Designing products that move — from pixel to production,
          with intention in every frame.
        </p>

        {/* Scroll cue */}
        <div className={revealClass('heroE__scroll-cue')} aria-hidden="true">
          <svg
            xmlns="http://www.w3.org/2000/svg"
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
      </div>

      {/* --- Bottom Zone: Ticker Strip --- */}
      <div className={revealClass('heroE__ticker')}>
        <div className="heroE__ticker-track" aria-label="Role descriptors">
          {/* Duplicate content for seamless infinite scroll */}
          {renderTickerItems('a')}
          {renderTickerItems('b')}
        </div>
      </div>
    </section>
  );
}
