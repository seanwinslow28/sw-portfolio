/**
 * HeroB_KineticScroll.jsx
 * ========================
 * Design Direction: Kinetic Scroll — Scroll IS the interaction
 *
 * DESIGN RATIONALE:
 * The hero is a pinned, scroll-scrubbed reveal sequence inspired by Apple product
 * launches and traditional animation pencil tests. Nothing appears on load — the
 * visitor "earns" the content by scrolling through animation frames. Each scroll
 * position is a new frame in the sequence, echoing the site's animator-pencil-test
 * philosophy.
 *
 * FONT CHOICES:
 * - Headings: Sora (project default — its geometric warmth suits the pencil-test vibe)
 * - Body: Inter (project default)
 * - Mono: JetBrains Mono (registration marks, frame numbers)
 *
 * SCROLL CHOREOGRAPHY TIMELINE (over ~250vh of scroll):
 * 0-10%:    Background shifts from warm paper to slightly cooler
 * 10-25%:   Registration marks fade in (crosshair, circle, frame "A-1")
 * 25-50%:   Name "Sean Winslow" reveals word-by-word
 * 50-65%:   Tagline fades in with subtle upward translate
 * 65-80%:   Headshot scales from 0.3 to 1.0, opacity 0 to 1
 * 75-85%:   Background shifts to teal-tinted
 * 80-90%:   Frame number increments A-1 -> A-2 -> A-3
 * 90-100%:  Scroll cue pulses, background settles to final color
 *
 * COLOR TRANSITIONS (scroll-driven):
 * Light: #FAF8F2 (paper) -> #F3F0E8 (warm) -> teal-tinted #E8F0EF -> amber accent #FFF7ED
 * Dark:  #0A0A0C (void) -> #161618 -> teal-dark #0A1A1A -> amber-dark #1A1408
 *
 * REDUCED MOTION: Everything shows immediately in a single viewport, no scroll pinning.
 */

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';

/* --------------------------------------------------------------------------
   EASING & CONSTANTS
   -------------------------------------------------------------------------- */
const TOTAL_HEIGHT_VH = 250; // scroll distance in viewport-heights

/* Utility: clamp a value between 0 and 1 */
function clamp01(v) {
  return Math.min(1, Math.max(0, v));
}

/* Utility: map scroll progress within a sub-range to 0-1 */
function rangeProgress(progress, start, end) {
  return clamp01((progress - start) / (end - start));
}

/* Utility: interpolate between two values */
function lerp(a, b, t) {
  return a + (b - a) * t;
}

/* Utility: interpolate between hex colors */
function lerpColor(hexA, hexB, t) {
  const parse = (h) => [
    parseInt(h.slice(1, 3), 16),
    parseInt(h.slice(3, 5), 16),
    parseInt(h.slice(5, 7), 16),
  ];
  const [rA, gA, bA] = parse(hexA);
  const [rB, gB, bB] = parse(hexB);
  const r = Math.round(lerp(rA, rB, t));
  const g = Math.round(lerp(gA, gB, t));
  const b = Math.round(lerp(bA, bB, t));
  return `rgb(${r}, ${g}, ${b})`;
}

/* Utility: multi-stop color interpolation */
function multiLerpColor(stops, t) {
  // stops: [{at: 0, color: '#xxx'}, {at: 0.5, color: '#yyy'}, ...]
  if (t <= stops[0].at) return stops[0].color;
  if (t >= stops[stops.length - 1].at) return stops[stops.length - 1].color;
  for (let i = 0; i < stops.length - 1; i++) {
    if (t >= stops[i].at && t <= stops[i + 1].at) {
      const local = (t - stops[i].at) / (stops[i + 1].at - stops[i].at);
      return lerpColor(stops[i].color, stops[i + 1].color, local);
    }
  }
  return stops[stops.length - 1].color;
}

/* --------------------------------------------------------------------------
   REDUCED MOTION HOOK
   -------------------------------------------------------------------------- */
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const handler = (e) => setReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return reduced;
}

/* --------------------------------------------------------------------------
   DARK MODE HOOK (reads data-theme attribute)
   -------------------------------------------------------------------------- */
function useDarkMode() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const check = () => {
      setDark(document.documentElement.getAttribute('data-theme') === 'dark');
    };
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);
  return dark;
}

/* --------------------------------------------------------------------------
   REGISTRATION MARK COMPONENT
   -------------------------------------------------------------------------- */
function RegistrationMark({ type, opacity, style, frameNumber }) {
  const baseStyle = {
    position: 'absolute',
    opacity,
    transition: 'none', // scroll-driven, no CSS transition
    fontFamily: "'JetBrains Mono', monospace",
    pointerEvents: 'none',
    willChange: 'opacity',
  };

  if (type === 'crosshair') {
    return (
      <div style={{ ...baseStyle, ...style }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
          <line x1="12" y1="0" x2="12" y2="24" />
          <line x1="0" y1="12" x2="24" y2="12" />
        </svg>
      </div>
    );
  }

  if (type === 'circle') {
    return (
      <div style={{ ...baseStyle, ...style }}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1">
          <circle cx="10" cy="10" r="8" />
        </svg>
      </div>
    );
  }

  if (type === 'frame') {
    return (
      <div
        style={{
          ...baseStyle,
          ...style,
          fontSize: '11px',
          letterSpacing: '0.05em',
          lineHeight: 1,
        }}
      >
        A-{frameNumber}
      </div>
    );
  }

  return null;
}

/* --------------------------------------------------------------------------
   SCROLL CUE COMPONENT
   -------------------------------------------------------------------------- */
function ScrollCue({ opacity }) {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: '40px',
        left: '50%',
        transform: 'translateX(-50%)',
        opacity,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
        willChange: 'opacity',
      }}
    >
      <span
        style={{
          fontFamily: "'Inter', system-ui, sans-serif",
          fontSize: '12px',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'var(--text-tertiary)',
        }}
      >
        Continue scrolling
      </span>
      <svg
        width="16"
        height="24"
        viewBox="0 0 16 24"
        fill="none"
        stroke="var(--text-tertiary)"
        strokeWidth="1.5"
        strokeLinecap="round"
        style={{
          animation: opacity > 0.5 ? 'herob-bounce 1.5s cubic-bezier(0.33, 1, 0.68, 1) infinite' : 'none',
        }}
      >
        <line x1="8" y1="4" x2="8" y2="18" />
        <polyline points="3,14 8,19 13,14" />
      </svg>
    </div>
  );
}

/* --------------------------------------------------------------------------
   HEADSHOT PLACEHOLDER
   -------------------------------------------------------------------------- */
function HeadshotPlaceholder({ scale, opacity, isDark }) {
  return (
    <div
      style={{
        width: '200px',
        height: '200px',
        borderRadius: '50%',
        background: isDark
          ? 'linear-gradient(135deg, #232326 0%, #161618 100%)'
          : 'linear-gradient(135deg, #E8E4DA 0%, #D1CCBF 100%)',
        border: isDark ? '2px solid #2a2a2e' : '2px solid #D1CCBF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: `scale(${scale})`,
        opacity,
        willChange: 'transform, opacity',
      }}
    >
      <span
        style={{
          fontFamily: "'Sora', system-ui, sans-serif",
          fontWeight: 600,
          fontSize: '48px',
          color: isDark ? '#14B8A6' : '#0D7377',
          letterSpacing: '-0.02em',
          userSelect: 'none',
        }}
      >
        SW
      </span>
    </div>
  );
}

/* --------------------------------------------------------------------------
   GRAIN OVERLAY (subtle, only during color transitions)
   -------------------------------------------------------------------------- */
function GrainOverlay({ opacity }) {
  if (opacity <= 0) return null;
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        opacity: opacity * 0.03,
        pointerEvents: 'none',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E")`,
        willChange: 'opacity',
      }}
    />
  );
}

/* --------------------------------------------------------------------------
   MAIN COMPONENT
   -------------------------------------------------------------------------- */
export default function HeroB_KineticScroll() {
  const reducedMotion = usePrefersReducedMotion();
  const isDark = useDarkMode();
  const containerRef = useRef(null);
  const stickyRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const rafRef = useRef(null);

  /* ---- Scroll handler (RAF-throttled) ---- */
  const handleScroll = useCallback(() => {
    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const totalScroll = containerRef.current.offsetHeight - window.innerHeight;
      if (totalScroll <= 0) { setProgress(1); return; }
      const scrolled = -rect.top;
      setProgress(clamp01(scrolled / totalScroll));
    });
  }, []);

  useEffect(() => {
    if (reducedMotion) { setProgress(1); return; }
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [handleScroll, reducedMotion]);

  /* ---- Derived animation values ---- */
  const derived = useMemo(() => {
    const p = progress;

    // Registration marks: fade in 10-25%
    const regMarkOpacity = rangeProgress(p, 0.10, 0.25) * 0.18;

    // Name reveal: 25-50% (word-by-word, 2 words)
    const word1 = rangeProgress(p, 0.25, 0.37);
    const word2 = rangeProgress(p, 0.37, 0.50);

    // Tagline: 50-65%
    const tagline = rangeProgress(p, 0.50, 0.65);

    // Headshot: 65-80%
    const headshot = rangeProgress(p, 0.65, 0.80);
    const headshotScale = lerp(0.3, 1, headshot);
    const headshotOpacity = headshot;

    // Frame number: A-1 (25%), A-2 (50%), A-3 (75%)
    let frameNumber = 1;
    if (p >= 0.75) frameNumber = 3;
    else if (p >= 0.50) frameNumber = 2;

    // Scroll cue: 90-100%
    const scrollCue = rangeProgress(p, 0.90, 0.98);

    // Grain: peaks during color transitions (around 40% and 80%)
    const grain1 = 1 - Math.abs(p - 0.4) * 5;
    const grain2 = 1 - Math.abs(p - 0.8) * 5;
    const grainOpacity = clamp01(Math.max(grain1, grain2));

    return {
      regMarkOpacity,
      word1,
      word2,
      tagline,
      headshotScale,
      headshotOpacity,
      frameNumber,
      scrollCue,
      grainOpacity,
    };
  }, [progress]);

  /* ---- Color stops for background ---- */
  const bgColor = useMemo(() => {
    const lightStops = [
      { at: 0, color: '#FAF8F2' },
      { at: 0.3, color: '#F3F0E8' },
      { at: 0.7, color: '#E8F0EF' }, // teal-tinted
      { at: 1.0, color: '#FAF8F2' }, // return to paper
    ];
    const darkStops = [
      { at: 0, color: '#0A0A0C' },
      { at: 0.3, color: '#161618' },
      { at: 0.7, color: '#0A1A1A' }, // teal-dark
      { at: 1.0, color: '#0A0A0C' }, // return to void
    ];
    return multiLerpColor(isDark ? darkStops : lightStops, progress);
  }, [progress, isDark]);

  /* ---- Text color derived from theme ---- */
  const textPrimary = isDark ? '#F5F5F0' : '#1A1A1E';
  const textSecondary = isDark ? '#9A9A9F' : '#4A4A52';
  const textTertiary = isDark ? '#636368' : '#8A8A8F';
  const tealColor = isDark ? '#14B8A6' : '#0D7377';

  /* ---- Reduced motion: static layout ---- */
  if (reducedMotion) {
    return (
      <section
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '32px',
          padding: '64px 24px',
          backgroundColor: isDark ? '#0A0A0C' : '#FAF8F2',
          color: textPrimary,
          position: 'relative',
        }}
      >
        {/* Registration marks (static) */}
        <RegistrationMark type="crosshair" opacity={0.15} style={{ top: '32px', left: '32px', color: textTertiary }} />
        <RegistrationMark type="circle" opacity={0.12} style={{ top: '32px', right: '32px', color: textTertiary }} />
        <RegistrationMark type="frame" opacity={0.15} frameNumber={1} style={{ bottom: '32px', left: '32px', color: textTertiary }} />

        <HeadshotPlaceholder scale={1} opacity={1} isDark={isDark} />

        <h1
          style={{
            fontFamily: "'Sora', system-ui, sans-serif",
            fontSize: 'clamp(48px, 8vw, 72px)',
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
            textAlign: 'center',
            color: textPrimary,
          }}
        >
          Sean Winslow
        </h1>

        <p
          style={{
            fontFamily: "'Inter', system-ui, sans-serif",
            fontSize: '18px',
            lineHeight: 1.6,
            maxWidth: '520px',
            textAlign: 'center',
            color: textSecondary,
          }}
        >
          I build products, animate stories, and obsess over the details between.
        </p>
      </section>
    );
  }

  /* ---- Full scroll choreography ---- */
  return (
    <>
      {/* Keyframes for scroll cue bounce */}
      <style>{`
        @keyframes herob-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(6px); }
        }
      `}</style>

      <section
        ref={containerRef}
        style={{
          height: `${TOTAL_HEIGHT_VH}vh`,
          position: 'relative',
        }}
      >
        {/* Sticky viewport */}
        <div
          ref={stickyRef}
          style={{
            position: 'sticky',
            top: 0,
            height: '100vh',
            width: '100%',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: bgColor,
            transition: 'none',
          }}
        >
          {/* Grain overlay */}
          <GrainOverlay opacity={derived.grainOpacity} />

          {/* Registration marks */}
          <RegistrationMark
            type="crosshair"
            opacity={derived.regMarkOpacity}
            style={{ top: '32px', left: '32px', color: textTertiary }}
          />
          <RegistrationMark
            type="circle"
            opacity={derived.regMarkOpacity * 0.8}
            style={{ top: '32px', right: '32px', color: textTertiary }}
          />
          <RegistrationMark
            type="frame"
            opacity={derived.regMarkOpacity}
            frameNumber={derived.frameNumber}
            style={{ bottom: '32px', left: '32px', color: textTertiary }}
          />

          {/* Content container */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '32px',
              padding: '0 24px',
              maxWidth: '960px',
              width: '100%',
            }}
          >
            {/* Headshot */}
            <div
              style={{
                transform: `scale(${derived.headshotScale})`,
                opacity: derived.headshotOpacity,
                willChange: 'transform, opacity',
              }}
            >
              <HeadshotPlaceholder scale={1} opacity={1} isDark={isDark} />
            </div>

            {/* Name — word-by-word reveal */}
            <h1
              style={{
                fontFamily: "'Sora', system-ui, sans-serif",
                fontSize: 'clamp(48px, 8vw, 72px)',
                fontWeight: 700,
                lineHeight: 1.05,
                letterSpacing: '-0.02em',
                textAlign: 'center',
                display: 'flex',
                gap: '0.25em',
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}
            >
              <span
                style={{
                  opacity: derived.word1,
                  transform: `translateY(${lerp(16, 0, derived.word1)}px)`,
                  display: 'inline-block',
                  willChange: 'transform, opacity',
                  color: textPrimary,
                }}
              >
                Sean
              </span>
              <span
                style={{
                  opacity: derived.word2,
                  transform: `translateY(${lerp(16, 0, derived.word2)}px)`,
                  display: 'inline-block',
                  willChange: 'transform, opacity',
                  color: textPrimary,
                }}
              >
                Winslow
              </span>
            </h1>

            {/* Tagline */}
            <p
              style={{
                fontFamily: "'Inter', system-ui, sans-serif",
                fontSize: '18px',
                lineHeight: 1.6,
                maxWidth: '520px',
                textAlign: 'center',
                color: textSecondary,
                opacity: derived.tagline,
                transform: `translateY(${lerp(12, 0, derived.tagline)}px)`,
                willChange: 'transform, opacity',
              }}
            >
              I build products, animate stories, and obsess over the details between.
            </p>

            {/* Decorative teal line that grows with scroll (GPU-only: scaleX) */}
            <div
              style={{
                width: '64px',
                height: '2px',
                backgroundColor: tealColor,
                opacity: rangeProgress(progress, 0.65, 0.80),
                transform: `scaleX(${rangeProgress(progress, 0.65, 0.85)})`,
                willChange: 'transform, opacity',
                borderRadius: '1px',
              }}
            />
          </div>

          {/* Scroll cue */}
          <ScrollCue opacity={derived.scrollCue} />

          {/* Progress indicator — thin line at bottom (GPU-only: scaleX) */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              height: '2px',
              width: '100%',
              backgroundColor: tealColor,
              opacity: 0.4,
              transform: `scaleX(${progress})`,
              transformOrigin: 'left',
              willChange: 'transform, opacity',
            }}
          />
        </div>
      </section>
    </>
  );
}
