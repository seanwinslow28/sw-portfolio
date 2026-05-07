import { useEffect, useRef } from 'react';

/**
 * ScrollProgress — 2px progress bar at top of page.
 * Uses CSS animation-timeline: scroll() with JS fallback.
 * For case study pages.
 */
export default function ScrollProgress() {
  const barRef = useRef(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    // Check reduced motion
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReducedMotion) {
      bar.style.display = 'none';
      return;
    }

    // Check if CSS scroll-timeline is supported
    const supportsScrollTimeline = CSS.supports('animation-timeline', 'scroll()');
    if (supportsScrollTimeline) {
      bar.classList.add('scroll-progress-css');
      return;
    }

    // JS fallback
    function onScroll() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? scrollTop / docHeight : 0;
      bar.style.transform = `scaleX(${progress})`;
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <div
        ref={barRef}
        className="scroll-progress-bar"
        aria-hidden="true"
      />
      <style>{`
        .scroll-progress-bar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background-color: color-mix(in srgb, var(--color-primary) 60%, transparent);
          transform-origin: left;
          transform: scaleX(0);
          z-index: 9998;
          pointer-events: none;
        }

        @keyframes scroll-progress-fill {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }

        .scroll-progress-css {
          animation: scroll-progress-fill linear;
          animation-timeline: scroll();
          transform: none;
        }

        @media (prefers-reduced-motion: reduce) {
          .scroll-progress-bar {
            display: none;
          }
        }
      `}</style>
    </>
  );
}
