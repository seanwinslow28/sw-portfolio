import { useEffect } from 'react';

/**
 * SmoothScroll — Initializes Lenis smooth scrolling.
 * React island hydrated client:load.
 * Reinitializes on astro:page-load for View Transition support.
 */
export default function SmoothScroll() {
  useEffect(() => {
    let lenis;
    let rafId;

    async function init() {
      // Destroy previous instance if navigating via View Transitions
      if (lenis) {
        lenis.destroy();
        lenis = null;
      }
      if (rafId) {
        cancelAnimationFrame(rafId);
      }

      try {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) return;

        const Lenis = (await import('lenis')).default;
        lenis = new Lenis({
          lerp: 0.1,
          duration: 1.2,
          smoothWheel: true,
        });

        function raf(time) {
          lenis.raf(time);
          rafId = requestAnimationFrame(raf);
        }
        rafId = requestAnimationFrame(raf);
      } catch (e) {
        console.warn('Lenis smooth scroll not available:', e);
      }
    }

    init();

    // Reinit after Astro View Transition navigation
    document.addEventListener('astro:page-load', init);

    return () => {
      document.removeEventListener('astro:page-load', init);
      if (lenis) lenis.destroy();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return null;
}
