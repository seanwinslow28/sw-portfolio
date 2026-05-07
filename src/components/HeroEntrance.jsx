import { useEffect, useRef, useState } from 'react';
import SplitTextReveal from './SplitTextReveal.jsx';

/**
 * HeroEntrance — Orchestrates the V3 hero entrance choreography.
 *
 * Timeline (1.5s total):
 *   0ms   — Paper texture (already present, instant)
 *   0ms   — Nav fade-in (handled by NavIsland, 300ms)
 *   200ms — Name split-text reveal (600ms)
 *   600ms — Tagline fade-up (400ms)
 *   400ms — Headshot fade-in (500ms)
 *   800ms — Registration marks fade-in (400ms)
 *   1200ms — Scroll cue fade-in + bounce loop
 *
 * prefers-reduced-motion: all elements appear immediately.
 */
export default function HeroEntrance({ tagline }) {
  const [nameComplete, setNameComplete] = useState(false);
  const taglineRef = useRef(null);
  const headshotRef = useRef(null);
  const regMarksRef = useRef(null);
  const scrollCueRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) {
      // Show everything immediately
      [taglineRef, headshotRef, regMarksRef, scrollCueRef].forEach((ref) => {
        if (ref.current) {
          ref.current.style.opacity = '1';
          ref.current.style.transform = 'none';
        }
      });
      return;
    }

    async function orchestrate() {
      try {
        const gsapModule = await import('gsap');
        const gsap = gsapModule.default || gsapModule.gsap || gsapModule;

        // Tagline fade-up at 600ms
        if (taglineRef.current) {
          gsap.set(taglineRef.current, { opacity: 0, y: 8 });
          gsap.to(taglineRef.current, {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: 'power4.out',
            delay: 0.6,
          });
        }

        // Headshot fade-in at 400ms
        if (headshotRef.current) {
          gsap.set(headshotRef.current, { opacity: 0 });
          gsap.to(headshotRef.current, {
            opacity: 1,
            duration: 0.5,
            ease: 'power4.out',
            delay: 0.4,
          });
        }

        // Registration marks at 800ms
        if (regMarksRef.current) {
          const marks = regMarksRef.current.querySelectorAll('.reg-mark');
          gsap.set(marks, { opacity: 0 });
          gsap.to(marks, {
            opacity: 1,
            duration: 0.4,
            ease: 'power2.out',
            delay: 0.8,
          });
        }

        // Scroll cue at 1200ms
        if (scrollCueRef.current) {
          gsap.set(scrollCueRef.current, { opacity: 0 });
          gsap.to(scrollCueRef.current, {
            opacity: 1,
            duration: 0.4,
            ease: 'power2.out',
            delay: 1.2,
          });
        }
      } catch {
        // Fallback: show everything
        [taglineRef, headshotRef, regMarksRef, scrollCueRef].forEach((ref) => {
          if (ref.current) {
            ref.current.style.opacity = '1';
            ref.current.style.transform = 'none';
          }
        });
      }
    }

    orchestrate();
  }, []);

  return (
    <section className="hero-section">
      {/* Paper texture layers handled via CSS */}
      <div className="hero-paper-texture" aria-hidden="true"></div>

      {/* Registration marks — light mode only */}
      <div ref={regMarksRef} className="hero-reg-marks" aria-hidden="true">
        <span className="reg-mark reg-crosshair">+</span>
        <span className="reg-mark reg-circle"></span>
        <span className="reg-mark reg-frame-number">A-1</span>
      </div>

      {/* Hero content — asymmetric 60/40 */}
      <div className="hero-content">
        <div className="hero-text">
          <SplitTextReveal
            text="Sean Winslow"
            as="h1"
            className="hero-title"
            delay={0.2}
            onComplete={() => setNameComplete(true)}
          />
          <p ref={taglineRef} className="hero-tagline" style={{ opacity: 0 }}>
            {tagline}
          </p>
        </div>

        <div
          ref={headshotRef}
          className="hero-headshot"
          role="img"
          aria-label="Sean Winslow headshot placeholder"
          style={{ opacity: 0 }}
        >
          <span className="hero-headshot-placeholder">SW</span>
        </div>
      </div>

      {/* Scroll cue */}
      <div
        ref={scrollCueRef}
        className="hero-scroll-cue"
        aria-hidden="true"
        style={{ opacity: 0 }}
      >
        <svg
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
