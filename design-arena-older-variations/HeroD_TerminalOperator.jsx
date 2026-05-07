/**
 * HeroD_TerminalOperator.jsx
 * ============================================================================
 * DESIGN DIRECTION: Terminal Operator DNA
 *
 * Font choice: JetBrains Mono throughout. Every element uses monospace —
 * this isn't monospace-as-accent, it IS the design language. JetBrains Mono
 * was chosen over alternatives (Berkeley Mono, IBM Plex Mono) because it's
 * already loaded in the project and has excellent legibility at both display
 * and body sizes, with distinctive character shapes that read well at 600-700
 * weight for headings.
 *
 * CONCEPT: "Pencil-test paper meets Vercel deployment logs" — taken literally.
 * Sean's identity is rendered as structured terminal output. The artist's
 * portfolio displayed through the engineer's lens. Light mode reads like
 * thermal printer paper / old green-screen CRT. Dark mode is the natural
 * habitat — a Bloomberg Terminal redesigned with taste.
 *
 * TEXTURE: Subtle scanlines (repeating-linear-gradient, 3% opacity) create
 * CRT phosphor feel. Radial gradient vignette darkens edges at 5% for that
 * curved-glass monitor depth. Registration marks from animation production
 * become system metadata — frame numbers, sequence IDs, timestamps.
 *
 * MOTION: Typewriter effect at 40ms/char with a blinking block cursor (530ms).
 * Data fields populate sequentially like a system booting. Numbers snap to
 * values. Everything respects prefers-reduced-motion — text shows immediately.
 *
 * COLOR: Near-monochrome restraint. Teal only as text color for key values
 * and thin 1px borders — never as fills. Amber reserved for the single
 * STATUS indicator. The monochrome discipline IS the aesthetic.
 * ============================================================================
 */

import { useState, useEffect, useRef } from 'react';

// ---------------------------------------------------------------------------
// CONSTANTS
// ---------------------------------------------------------------------------

const CHAR_DELAY = 40;       // ms per character typed
const CURSOR_BLINK = 530;    // ms cursor blink cycle
const LINE_PAUSE = 200;      // ms pause between lines
const FIELD_DELAY = 120;     // ms pause before each data field starts typing

const FONT = "'JetBrains Mono', monospace";

const NAME = 'Sean Winslow';
const TAGLINE = '"I build products, animate stories, and obsess over the details between."';

const DATA_FIELDS = [
  { key: 'ROLE', value: 'Product Manager \u00d7 Creative Technologist', color: 'primary' },
  { key: 'STACK', value: 'Animation | Product | Engineering', color: 'default' },
  { key: 'STATUS', value: 'Available', color: 'accent' },
  { key: 'FRAME', value: 'A-1', color: 'primary' },
  { key: 'SEQ', value: '001', color: 'default' },
];

// ---------------------------------------------------------------------------
// REDUCED MOTION DETECTION
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// DARK MODE DETECTION (reads data-theme attribute)
// ---------------------------------------------------------------------------

function useDarkMode() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const check = () => setDark(document.documentElement.getAttribute('data-theme') === 'dark');
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);
  return dark;
}

// ---------------------------------------------------------------------------
// TYPEWRITER HOOK
// ---------------------------------------------------------------------------

function useTypewriter(text, { delay = CHAR_DELAY, startDelay = 0, enabled = true }) {
  const [displayed, setDisplayed] = useState(enabled ? '' : text);
  const [done, setDone] = useState(!enabled);
  const indexRef = useRef(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!enabled) {
      setDisplayed(text);
      setDone(true);
      return;
    }
    setDisplayed('');
    setDone(false);
    indexRef.current = 0;

    const startTimeout = setTimeout(() => {
      intervalRef.current = setInterval(() => {
        indexRef.current += 1;
        if (indexRef.current > text.length) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          setDone(true);
          return;
        }
        setDisplayed(text.slice(0, indexRef.current));
      }, delay);
    }, startDelay);

    return () => {
      clearTimeout(startTimeout);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [text, delay, startDelay, enabled]);

  return { displayed, done };
}

// ---------------------------------------------------------------------------
// BLINKING CURSOR
// ---------------------------------------------------------------------------

function Cursor({ active, dark }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!active) { setVisible(true); return; }
    const interval = setInterval(() => setVisible(v => !v), CURSOR_BLINK);
    return () => clearInterval(interval);
  }, [active]);

  return (
    <span
      aria-hidden="true"
      style={{
        opacity: visible ? 1 : 0,
        transition: 'opacity 0ms steps(1)',
        color: dark ? '#14B8A6' : '#0D7377',
        fontWeight: 700,
      }}
    >
      {'\u2588'}
    </span>
  );
}

// ---------------------------------------------------------------------------
// SCANLINE + CRT OVERLAYS (pure CSS, no images)
// ---------------------------------------------------------------------------

function CRTOverlay({ dark }) {
  return (
    <>
      {/* Scanlines */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            ${dark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.025)'} 2px,
            ${dark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.025)'} 4px
          )`,
          zIndex: 2,
        }}
      />
      {/* Vignette */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background: `radial-gradient(ellipse at center, transparent 50%, ${dark ? 'rgba(10,10,12,0.15)' : 'rgba(0,0,0,0.05)'} 100%)`,
          zIndex: 2,
        }}
      />
    </>
  );
}

// ---------------------------------------------------------------------------
// SW MONOGRAM (bordered box, not circle — terminal aesthetic)
// ---------------------------------------------------------------------------

function Monogram({ dark }) {
  return (
    <div
      style={{
        width: 80,
        height: 80,
        border: `1px solid ${dark ? '#14B8A6' : '#0D7377'}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: FONT,
        fontSize: 28,
        fontWeight: 600,
        letterSpacing: '0.05em',
        color: dark ? '#14B8A6' : '#0D7377',
        background: dark ? '#161618' : '#F3F0E8',
        flexShrink: 0,
      }}
    >
      SW
    </div>
  );
}

// ---------------------------------------------------------------------------
// DATA FIELD LINE
// ---------------------------------------------------------------------------

function DataFieldLine({ field, startDelay, enabled, dark, showCursor }) {
  const { displayed, done } = useTypewriter(`${field.key}: ${field.value}`, {
    delay: CHAR_DELAY,
    startDelay,
    enabled,
  });

  const colorMap = {
    primary: dark ? '#14B8A6' : '#0D7377',
    accent: dark ? '#F59E0B' : '#B45309',
    default: dark ? '#F5F5F0' : '#1A1A1E',
  };

  // Split displayed text into key and value parts
  const colonIdx = displayed.indexOf(':');
  const keyPart = colonIdx >= 0 ? displayed.slice(0, colonIdx) : displayed;
  const valuePart = colonIdx >= 0 ? displayed.slice(colonIdx) : '';

  return (
    <div style={{ minHeight: 24, lineHeight: '24px' }}>
      <span style={{ color: dark ? '#636368' : '#8A8A8F' }}>{'> '}</span>
      <span style={{ color: dark ? '#9A9A9F' : '#4A4A52', fontWeight: 500 }}>
        {keyPart}
      </span>
      <span style={{ color: colorMap[field.color] || colorMap.default }}>
        {valuePart}
      </span>
      {showCursor && !done && <Cursor active dark={dark} />}
    </div>
  );
}

// ---------------------------------------------------------------------------
// TIMESTAMP
// ---------------------------------------------------------------------------

function Timestamp({ dark }) {
  const [time, setTime] = useState('');
  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(now.toISOString().replace('T', ' ').slice(0, 19) + 'Z');
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span style={{ color: dark ? '#636368' : '#8A8A8F', fontSize: 12 }}>
      {time}
    </span>
  );
}

// ---------------------------------------------------------------------------
// MAIN COMPONENT
// ---------------------------------------------------------------------------

export default function HeroD_TerminalOperator() {
  const dark = useDarkMode();
  const reducedMotion = usePrefersReducedMotion();
  const animated = !reducedMotion;

  // Sequencing state
  const [phase, setPhase] = useState(animated ? 0 : 99);
  // 0: waiting, 1: typing name, 2: name done - typing tagline, 3: tagline done - fields, 99: all done

  const nameResult = useTypewriter(NAME, {
    delay: CHAR_DELAY,
    startDelay: 400,
    enabled: animated && phase >= 1,
  });

  const taglineResult = useTypewriter(TAGLINE, {
    delay: 30,
    startDelay: LINE_PAUSE,
    enabled: animated && phase >= 2,
  });

  // Kick off phase 1 on mount
  useEffect(() => {
    if (!animated) return;
    const t = setTimeout(() => setPhase(1), 200);
    return () => clearTimeout(t);
  }, [animated]);

  // Advance phases
  useEffect(() => {
    if (nameResult.done && phase === 1) setPhase(2);
  }, [nameResult.done, phase]);

  useEffect(() => {
    if (taglineResult.done && phase === 2) setPhase(3);
  }, [taglineResult.done, phase]);

  // Calculate staggered start delays for data fields
  const nameTypingDuration = NAME.length * CHAR_DELAY + 400;
  const taglineTypingDuration = TAGLINE.length * 30 + LINE_PAUSE;
  const fieldsBaseDelay = 0; // relative to phase 3

  // Scroll cue blink
  const [scrollVisible, setScrollVisible] = useState(true);
  useEffect(() => {
    const interval = setInterval(() => setScrollVisible(v => !v), 800);
    return () => clearInterval(interval);
  }, []);

  // Colors
  const bg = dark ? '#0A0A0C' : '#FAF8F2';
  const textPrimary = dark ? '#F5F5F0' : '#1A1A1E';
  const textSecondary = dark ? '#9A9A9F' : '#4A4A52';
  const textTertiary = dark ? '#636368' : '#8A8A8F';
  const borderColor = dark ? '#232326' : '#E8E4DA';
  const teal = dark ? '#14B8A6' : '#0D7377';

  return (
    <section
      aria-label="Hero introduction"
      style={{
        position: 'relative',
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: bg,
        fontFamily: FONT,
        color: textPrimary,
        overflow: 'hidden',
        padding: '64px 24px',
      }}
    >
      <CRTOverlay dark={dark} />

      {/* Terminal window */}
      <div
        style={{
          position: 'relative',
          zIndex: 3,
          width: '100%',
          maxWidth: 720,
          border: `1px solid ${borderColor}`,
          background: dark ? '#161618' : '#F3F0E8',
        }}
      >
        {/* Title bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 16px',
            borderBottom: `1px solid ${borderColor}`,
            fontSize: 12,
            color: textTertiary,
            letterSpacing: '0.05em',
          }}
        >
          <span>sw-portfolio v3.0</span>
          <Timestamp dark={dark} />
        </div>

        {/* Terminal body */}
        <div
          style={{
            padding: '32px 24px',
            fontSize: 14,
            lineHeight: '24px',
            letterSpacing: '0.01em',
          }}
        >
          {/* Boot sequence header */}
          <div style={{ color: textTertiary, fontSize: 12, marginBottom: 24 }}>
            {'// SYSTEM BOOT — PORTFOLIO RENDER ENGINE'}
          </div>

          {/* Monogram + Name row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 24,
              marginBottom: 24,
            }}
          >
            <Monogram dark={dark} />
            <div style={{ flex: 1, minWidth: 0 }}>
              {/* Name */}
              <div
                style={{
                  fontSize: 'clamp(28px, 5vw, 40px)',
                  fontWeight: 700,
                  lineHeight: 1.1,
                  letterSpacing: '-0.02em',
                  color: textPrimary,
                  marginBottom: 8,
                }}
              >
                {animated ? nameResult.displayed : NAME}
                {phase === 1 && <Cursor active dark={dark} />}
              </div>

              {/* Tagline */}
              <div
                style={{
                  fontSize: 13,
                  color: textSecondary,
                  fontWeight: 400,
                  fontStyle: 'italic',
                  minHeight: 20,
                }}
              >
                {animated ? taglineResult.displayed : TAGLINE}
                {phase === 2 && <Cursor active dark={dark} />}
              </div>
            </div>
          </div>

          {/* Separator */}
          <div
            style={{
              borderTop: `1px solid ${borderColor}`,
              margin: '8px 0 16px',
            }}
          />

          {/* Data fields */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {DATA_FIELDS.map((field, i) => {
              const fieldStart = fieldsBaseDelay + i * (field.value.length * CHAR_DELAY + FIELD_DELAY);
              const shouldAnimate = animated && phase >= 3;
              const showCursor = shouldAnimate && i === DATA_FIELDS.length - 1; // cursor on last active field

              if (!animated) {
                return (
                  <DataFieldLine
                    key={field.key}
                    field={field}
                    startDelay={0}
                    enabled={false}
                    dark={dark}
                    showCursor={false}
                  />
                );
              }

              if (phase < 3) {
                return (
                  <div key={field.key} style={{ minHeight: 24 }} />
                );
              }

              return (
                <DataFieldLine
                  key={field.key}
                  field={field}
                  startDelay={fieldStart}
                  enabled={true}
                  dark={dark}
                  showCursor={true}
                />
              );
            })}
          </div>

          {/* Separator */}
          <div
            style={{
              borderTop: `1px solid ${borderColor}`,
              margin: '16px 0 12px',
            }}
          />

          {/* Bottom prompt with persistent blinking cursor */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: teal, fontWeight: 500 }}>{'>'}</span>
            <Cursor active dark={dark} />
          </div>
        </div>

        {/* Status bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '6px 16px',
            borderTop: `1px solid ${borderColor}`,
            fontSize: 11,
            color: textTertiary,
            letterSpacing: '0.03em',
          }}
        >
          <span>UTF-8 | LF | JetBrains Mono</span>
          <span>FRAME A-1 | SEQ 001</span>
        </div>
      </div>

      {/* Scroll cue */}
      <div
        style={{
          position: 'relative',
          zIndex: 3,
          marginTop: 48,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
          fontFamily: FONT,
          fontSize: 12,
          color: textTertiary,
          letterSpacing: '0.05em',
        }}
      >
        <span
          style={{
            opacity: scrollVisible ? 0.7 : 0.2,
            transition: 'opacity 0ms steps(1)',
          }}
        >
          [SCROLL]
        </span>
        <span
          style={{
            fontSize: 16,
            opacity: scrollVisible ? 0.7 : 0.2,
            transition: 'opacity 0ms steps(1)',
          }}
        >
          {'\u25BC'}
        </span>
      </div>

      {/* Ambient corner registration metadata */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 24,
          left: 24,
          fontFamily: FONT,
          fontSize: 11,
          color: textTertiary,
          opacity: 0.4,
          zIndex: 3,
          letterSpacing: '0.03em',
        }}
      >
        {'>'} INIT
      </div>
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: 24,
          right: 24,
          fontFamily: FONT,
          fontSize: 11,
          color: textTertiary,
          opacity: 0.4,
          zIndex: 3,
          letterSpacing: '0.03em',
          textAlign: 'right',
        }}
      >
        PID 2026.04<br />
        OUT 0
      </div>
    </section>
  );
}
