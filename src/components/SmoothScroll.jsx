import { useEffect } from 'react';

/**
 * SmoothScroll — Initializes Lenis smooth scrolling.
 * React island hydrated client:load.
 */
export default function SmoothScroll() {
  useEffect(() => {
    let lenis;

    async function init() {
      try {
        // Respect prefers-reduced-motion — don't override native scroll
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) return;

        const Lenis = (await import('lenis')).default;
        lenis = new Lenis({
          duration: 1.2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          direction: 'vertical',
          gestureDirection: 'vertical',
          smooth: true,
          smoothTouch: false,
          touchMultiplier: 2,
        });

        function raf(time) {
          lenis.raf(time);
          requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
      } catch (e) {
        console.warn('Lenis smooth scroll not available:', e);
      }
    }

    init();
    return () => {
      if (lenis) lenis.destroy();
    };
  }, []);

  return null;
}
