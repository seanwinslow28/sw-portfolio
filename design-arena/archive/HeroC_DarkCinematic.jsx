/**
 * HeroC_DarkCinematic.jsx
 * ========================
 * Design Arena — Agent C: Dark Cinematic DNA
 *
 * FONT CHOICES:
 * - Heading: Bricolage Grotesque 700 — cinematic weight, expressive contrast,
 *   feels like a title card from a Fincher opening sequence. Fallback to Sora.
 * - Body: DM Sans 400/500 — geometric, clean, slightly warmer than Inter.
 *   Pairs well with the moody atmosphere without feeling sterile.
 * - Mono: JetBrains Mono 400 — for film metadata (timecodes, frame counters).
 *
 * CINEMATIC APPROACH:
 * Dark mode is the hero. The entire viewport is a dark stage. Content appears
 * in spotlights — the name revealed via a teal wipe, the headshot illuminated
 * by a cursor-tracked radial gradient. Film grain overlay via inline SVG
 * feTurbulence. Vignette darkens the edges. Registration marks become film
 * sprocket holes and timecodes. The pencil-test paper heritage becomes aged
 * film stock being viewed on a lightbox in a dark studio at night.
 *
 * Light mode inverts the metaphor: the film negative becomes a warm sepia
 * print — the same composition with warm paper tones.
 *
 * SIGNATURE INTERACTIONS:
 * 1. Cinematic wipe — teal overlay sweeps L→R across the name, revealing text
 *    with a subtle scale(1.03)→scale(1) settle.
 * 2. Spotlight hover — radial-gradient follows cursor over the headshot circle,
 *    illuminating the "SW" initials from darkness.
 *
 * MOTION:
 * - clip-path: inset() reveals (GPU-composited)
 * - transform + opacity only
 * - Named easing curves from design system
 * - All motion gated behind prefers-reduced-motion check
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';

/* --------------------------------------------------------------------------
   CONSTANTS & TOKENS
   -------------------------------------------------------------------------- */

const EASING = {
  standard: 'cubic-bezier(0.2, 0, 0, 1)',
  emphasized: 'cubic-bezier(0.05, 0.7, 0.1, 1)',
  decelerate: 'cubic-bezier(0, 0, 0, 1)',
  smooth: 'cubic-bezier(0.33, 1, 0.68, 1)',
};

const COLORS = {
  dark: {
    surface0: '#0A0A0C',
    surface1: '#161618',
    surface2: '#232326',
    textPrimary: '#F5F5F0',
    textSecondary: '#9A9A9F',
    textTertiary: '#636368',
    teal: '#14B8A6',
    amber: '#F59E0B',
  },
  light: {
    surface0: '#FAF8F2',
    surface1: '#F3F0E8',
    surface2: '#E8E4DA',
    textPrimary: '#1A1A1E',
    textSecondary: '#4A4A52',
    textTertiary: '#8A8A8F',
    teal: '#0D7377',
    amber: '#B45309',
  },
};

/* --------------------------------------------------------------------------
   FILM GRAIN SVG FILTER (inline)
   -------------------------------------------------------------------------- */
function FilmGrainFilter() {
  return (
    <svg
      aria-hidden="true"
      style={{
        position: 'absolute',
        width: 0,
        height: 0,
        overflow: 'hidden',
      }}
    >
      <defs>
        <filter id="film-grain-c" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.65"
            numOctaves="4"
            stitchTiles="stitch"
            result="noise"
          >
            <animate
              attributeName="seed"
              from="0"
              to="100"
              dur="8s"
              repeatCount="indefinite"
            />
          </feTurbulence>
          <feColorMatrix
            type="saturate"
            values="0"
            in="noise"
            result="mono"
          />
          <feComponentTransfer in="mono" result="grain">
            <feFuncR type="linear" slope="1.5" intercept="-0.25" />
            <feFuncG type="linear" slope="1.5" intercept="-0.25" />
            <feFuncB type="linear" slope="1.5" intercept="-0.25" />
          </feComponentTransfer>
        </filter>
      </defs>
    </svg>
  );
}

/* --------------------------------------------------------------------------
   FILM METADATA — sprocket holes, timecodes, frame counters
   -------------------------------------------------------------------------- */
function FilmMetadata({ isDark }) {
  const c = isDark ? COLORS.dark : COLORS.light;
  const metaColor = isDark ? 'rgba(245,245,240,0.08)' : 'rgba(26,26,30,0.07)';
  const monoFont = "'JetBrains Mono', monospace";

  return (
    <>
      {/* Left sprocket column */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: 20,
          top: '10%',
          bottom: '10%',
          width: 16,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            style={{
              width: 12,
              height: 8,
              borderRadius: 2,
              border: `1px solid ${metaColor}`,
              marginLeft: 2,
            }}
          />
        ))}
      </div>

      {/* Right sprocket column */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          right: 20,
          top: '10%',
          bottom: '10%',
          width: 16,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            style={{
              width: 12,
              height: 8,
              borderRadius: 2,
              border: `1px solid ${metaColor}`,
              marginLeft: 2,
            }}
          />
        ))}
      </div>

      {/* Top-left timecode */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 48,
          left: 52,
          fontFamily: monoFont,
          fontSize: 11,
          letterSpacing: '0.08em',
          color: metaColor,
          pointerEvents: 'none',
          zIndex: 1,
        }}
      >
        01:00:24:07
      </div>

      {/* Top-right frame counter */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 48,
          right: 52,
          fontFamily: monoFont,
          fontSize: 11,
          letterSpacing: '0.08em',
          color: metaColor,
          pointerEvents: 'none',
          zIndex: 1,
        }}
      >
        FRM 1247
      </div>

      {/* Bottom-left film stock code */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: 80,
          left: 52,
          fontFamily: monoFont,
          fontSize: 10,
          letterSpacing: '0.12em',
          color: metaColor,
          pointerEvents: 'none',
          zIndex: 1,
          textTransform: 'uppercase',
        }}
      >
        KODAK 5219 500T
      </div>

      {/* Bottom-right edge number */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: 80,
          right: 52,
          fontFamily: monoFont,
          fontSize: 10,
          letterSpacing: '0.12em',
          color: metaColor,
          pointerEvents: 'none',
          zIndex: 1,
        }}
      >
        KD 87 4271 2843
      </div>
    </>
  );
}

/* --------------------------------------------------------------------------
   SPOTLIGHT HEADSHOT
   -------------------------------------------------------------------------- */
function SpotlightHeadshot({ isDark }) {
  const containerRef = useRef(null);
  const [spotPos, setSpotPos] = useState({ x: 50, y: 50 });
  const [isHovering, setIsHovering] = useState(false);

  const c = isDark ? COLORS.dark : COLORS.light;

  const handleMouseMove = useCallback((e) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setSpotPos({ x, y });
  }, []);

  const spotlightBg = isDark
    ? `radial-gradient(circle 80px at ${spotPos.x}% ${spotPos.y}%, rgba(20,184,166,0.25), transparent 70%)`
    : `radial-gradient(circle 80px at ${spotPos.x}% ${spotPos.y}%, rgba(13,115,119,0.15), transparent 70%)`;

  const baseBg = isDark
    ? COLORS.dark.surface1
    : COLORS.light.surface2;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      style={{
        width: 200,
        height: 200,
        borderRadius: '50%',
        position: 'relative',
        cursor: 'default',
        overflow: 'hidden',
        flexShrink: 0,
      }}
    >
      {/* Base circle */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          backgroundColor: baseBg,
          border: isDark
            ? '1px solid rgba(245,245,240,0.06)'
            : '1px solid rgba(26,26,30,0.08)',
        }}
      />

      {/* Spotlight overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          background: isHovering ? spotlightBg : 'none',
          transition: `opacity 300ms ${EASING.standard}`,
          opacity: isHovering ? 1 : 0,
        }}
      />

      {/* Initials */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: "'Bricolage Grotesque', 'Sora', system-ui, sans-serif",
          fontWeight: 700,
          fontSize: 56,
          letterSpacing: '-0.02em',
          color: isHovering ? c.teal : (isDark ? 'rgba(245,245,240,0.12)' : 'rgba(26,26,30,0.12)'),
          transition: `color 400ms ${EASING.emphasized}`,
          userSelect: 'none',
        }}
      >
        SW
      </div>

      {/* Subtle ring on hover */}
      <div
        style={{
          position: 'absolute',
          inset: -2,
          borderRadius: '50%',
          border: `2px solid ${c.teal}`,
          opacity: isHovering ? 0.3 : 0,
          transition: `opacity 400ms ${EASING.standard}`,
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}

/* --------------------------------------------------------------------------
   SCROLL CUE
   -------------------------------------------------------------------------- */
function ScrollCue({ isDark }) {
  const c = isDark ? COLORS.dark : COLORS.light;

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 32,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
        zIndex: 2,
      }}
    >
      <span
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 10,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: c.textTertiary,
        }}
      >
        Scroll
      </span>
      <div
        style={{
          width: 1,
          height: 32,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          className="hero-c-scroll-line"
          style={{
            width: 1,
            height: '100%',
            backgroundColor: c.textTertiary,
            transformOrigin: 'top',
          }}
        />
      </div>
    </div>
  );
}

/* --------------------------------------------------------------------------
   MAIN HERO COMPONENT
   -------------------------------------------------------------------------- */
export default function HeroC_DarkCinematic() {
  const [isDark, setIsDark] = useState(true);
  const [phase, setPhase] = useState(0); // 0=hidden, 1=wipe, 2=revealed, 3=tagline, 4=complete
  const prefersReducedMotion = useRef(false);
  const heroRef = useRef(null);

  const c = isDark ? COLORS.dark : COLORS.light;

  // Detect dark mode from document or cookie
  useEffect(() => {
    const checkDark = () => {
      const html = document.documentElement;
      const hasDark = html.classList.contains('dark') || html.getAttribute('data-theme') === 'dark';
      setIsDark(hasDark);
    };
    checkDark();
    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-theme'] });
    return () => observer.disconnect();
  }, []);

  // Detect prefers-reduced-motion
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    prefersReducedMotion.current = mq.matches;
    const handler = (e) => { prefersReducedMotion.current = e.matches; };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Orchestrated entrance sequence
  useEffect(() => {
    if (prefersReducedMotion.current) {
      setPhase(4);
      return;
    }

    const timers = [];
    // Phase 1: start wipe at 300ms
    timers.push(setTimeout(() => setPhase(1), 300));
    // Phase 2: name revealed at 1100ms (800ms wipe)
    timers.push(setTimeout(() => setPhase(2), 1100));
    // Phase 3: tagline enters at 1400ms
    timers.push(setTimeout(() => setPhase(3), 1400));
    // Phase 4: everything settled at 2000ms
    timers.push(setTimeout(() => setPhase(4), 2000));

    return () => timers.forEach(clearTimeout);
  }, []);

  const noMotion = prefersReducedMotion.current;

  return (
    <>
      {/* Inject fonts */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;600;700&family=DM+Sans:wght@400;500&family=JetBrains+Mono:wght@400;500&display=swap"
      />

      {/* Inject keyframes */}
      <style>{`
        @keyframes hero-c-wipe {
          from { clip-path: inset(0 100% 0 0); }
          to   { clip-path: inset(0 0 0 0); }
        }
        @keyframes hero-c-settle {
          from { transform: scale(1.03); opacity: 0.7; }
          to   { transform: scale(1); opacity: 1; }
        }
        @keyframes hero-c-fade-up {
          from { transform: translateY(16px); opacity: 0; }
          to   { transform: translateY(0); opacity: 1; }
        }
        @keyframes hero-c-scroll-pulse {
          0%, 100% { transform: scaleY(0); transform-origin: top; opacity: 0; }
          30% { transform: scaleY(1); transform-origin: top; opacity: 1; }
          60% { transform: scaleY(1); transform-origin: bottom; opacity: 1; }
          90% { transform: scaleY(0); transform-origin: bottom; opacity: 0; }
        }
        .hero-c-scroll-line {
          animation: hero-c-scroll-pulse 2.5s ${EASING.smooth} infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-c-scroll-line {
            animation: none !important;
          }
        }
      `}</style>

      <FilmGrainFilter />

      <section
        ref={heroRef}
        role="banner"
        style={{
          position: 'relative',
          width: '100%',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: c.surface0,
          overflow: 'hidden',
          transition: `background-color 400ms ${EASING.standard}`,
        }}
      >
        {/* Film grain overlay */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            filter: 'url(#film-grain-c)',
            mixBlendMode: isDark ? 'overlay' : 'multiply',
            opacity: isDark ? 0.07 : 0.04,
            pointerEvents: 'none',
            zIndex: 3,
          }}
        />

        {/* Vignette */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            background: isDark
              ? 'radial-gradient(ellipse 70% 60% at 50% 50%, transparent 0%, rgba(10,10,12,0.6) 100%)'
              : 'radial-gradient(ellipse 70% 60% at 50% 50%, transparent 0%, rgba(250,248,242,0.3) 100%)',
            pointerEvents: 'none',
            zIndex: 2,
          }}
        />

        {/* Subtle horizontal lines — film scan lines */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: isDark
              ? 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(245,245,240,0.012) 3px, rgba(245,245,240,0.012) 4px)'
              : 'none',
            pointerEvents: 'none',
            zIndex: 2,
          }}
        />

        {/* Film metadata (sprockets, timecodes) */}
        <FilmMetadata isDark={isDark} />

        {/* Main content */}
        <div
          style={{
            position: 'relative',
            zIndex: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 40,
            padding: '0 24px',
            maxWidth: 720,
            textAlign: 'center',
          }}
        >
          {/* Headshot with spotlight */}
          <div
            style={{
              opacity: noMotion || phase >= 1 ? 1 : 0,
              transform: noMotion || phase >= 1 ? 'translateY(0)' : 'translateY(16px)',
              transition: noMotion ? 'none' : `transform 600ms ${EASING.emphasized}, opacity 600ms ${EASING.emphasized}`,
            }}
          >
            <SpotlightHeadshot isDark={isDark} />
          </div>

          {/* Name — cinematic wipe reveal */}
          <div style={{ position: 'relative', overflow: 'hidden' }}>
            {/* Teal wipe overlay */}
            {phase >= 1 && phase < 2 && !noMotion && (
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: c.teal,
                  zIndex: 2,
                  animation: `hero-c-wipe 800ms ${EASING.emphasized} forwards`,
                }}
              />
            )}

            <h1
              style={{
                fontFamily: "'Bricolage Grotesque', 'Sora', system-ui, sans-serif",
                fontWeight: 700,
                fontSize: 'clamp(48px, 8vw, 80px)',
                lineHeight: 1.05,
                letterSpacing: '-0.03em',
                color: phase >= 2 ? c.teal : 'transparent',
                margin: 0,
                padding: '4px 0',
                animation: noMotion
                  ? 'none'
                  : phase >= 2
                    ? `hero-c-settle 500ms ${EASING.decelerate} forwards`
                    : 'none',
                opacity: noMotion ? 1 : phase >= 2 ? undefined : 0,
                transition: noMotion ? 'none' : `color 100ms ${EASING.standard}`,
              }}
            >
              Sean Winslow
            </h1>
          </div>

          {/* Tagline */}
          <p
            style={{
              fontFamily: "'DM Sans', system-ui, sans-serif",
              fontWeight: 400,
              fontSize: 'clamp(16px, 2.2vw, 20px)',
              lineHeight: 1.6,
              color: c.textSecondary,
              maxWidth: 520,
              margin: 0,
              opacity: noMotion || phase >= 3 ? 1 : 0,
              transform: noMotion || phase >= 3 ? 'translateY(0)' : 'translateY(16px)',
              transition: noMotion ? 'none' : `transform 500ms ${EASING.decelerate}, opacity 500ms ${EASING.decelerate}`,
            }}
          >
            I build products, animate stories, and obsess over the details between.
          </p>

          {/* CTA — amber accent, the single most important action */}
          <div
            style={{
              display: 'flex',
              gap: 16,
              flexWrap: 'wrap',
              justifyContent: 'center',
              opacity: noMotion || phase >= 4 ? 1 : 0,
              transform: noMotion || phase >= 4 ? 'translateY(0)' : 'translateY(16px)',
              transition: noMotion ? 'none' : `transform 400ms ${EASING.decelerate}, opacity 400ms ${EASING.decelerate}`,
            }}
          >
            <a
              href="#work"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '12px 28px',
                borderRadius: 6,
                backgroundColor: c.amber,
                color: isDark ? '#0A0A0C' : '#FAF8F2',
                fontFamily: "'DM Sans', system-ui, sans-serif",
                fontWeight: 500,
                fontSize: 15,
                letterSpacing: '0.01em',
                textDecoration: 'none',
                border: 'none',
                cursor: 'pointer',
                transition: `transform 150ms ${EASING.standard}, opacity 150ms ${EASING.standard}`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = 'scale(0.98)';
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
            >
              View Work
            </a>

            <a
              href="#about"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '12px 28px',
                borderRadius: 6,
                backgroundColor: 'transparent',
                color: c.textSecondary,
                fontFamily: "'DM Sans', system-ui, sans-serif",
                fontWeight: 500,
                fontSize: 15,
                letterSpacing: '0.01em',
                textDecoration: 'none',
                border: `1px solid ${isDark ? 'rgba(245,245,240,0.1)' : 'rgba(26,26,30,0.12)'}`,
                cursor: 'pointer',
                transition: `transform 150ms ${EASING.standard}, border-color 150ms ${EASING.standard}, color 150ms ${EASING.standard}`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.borderColor = c.teal;
                e.currentTarget.style.color = c.teal;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = isDark ? 'rgba(245,245,240,0.1)' : 'rgba(26,26,30,0.12)';
                e.currentTarget.style.color = c.textSecondary;
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = 'scale(0.98)';
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
            >
              About
            </a>
          </div>
        </div>

        {/* Scroll cue */}
        <ScrollCue isDark={isDark} />

        {/* Thin horizontal accent line at very bottom */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            bottom: 0,
            left: '10%',
            right: '10%',
            height: 1,
            backgroundColor: isDark ? 'rgba(245,245,240,0.04)' : 'rgba(26,26,30,0.05)',
          }}
        />
      </section>
    </>
  );
}
