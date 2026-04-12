import { useEffect, useRef } from 'react';

/**
 * CaseStudyChoreography — GSAP ScrollTrigger effects for case study pages.
 * - Hero image: scale(1.1) → scale(1) parallax on scroll
 * - Solution images: scale(1.1) → scale(1) on scroll
 * - Respects prefers-reduced-motion
 */
export default function CaseStudyChoreography() {
  const hasInit = useRef(false);

  useEffect(() => {
    if (hasInit.current) return;
    hasInit.current = true;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReducedMotion) return;

    let ctx;
    async function init() {
      try {
        const gsapModule = await import('gsap');
        const gsap = gsapModule.default || gsapModule.gsap || gsapModule;
        const { ScrollTrigger } = await import('gsap/ScrollTrigger');
        gsap.registerPlugin(ScrollTrigger);

        ctx = gsap.context(() => {
          // Hero image parallax zoom
          const heroImage = document.querySelector('.case-hero-image');
          if (heroImage) {
            gsap.set(heroImage, { scale: 1.05 });
            gsap.to(heroImage, {
              scale: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: heroImage,
                start: 'top 80%',
                end: 'bottom 20%',
                scrub: 0.5,
              },
            });
          }

          // Solution mockup images — scale down on scroll
          const mockups = document.querySelectorAll('.case-mockup');
          mockups.forEach((mockup) => {
            gsap.set(mockup, { scale: 1.05 });
            gsap.to(mockup, {
              scale: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: mockup,
                start: 'top 85%',
                end: 'top 30%',
                scrub: 0.5,
              },
            });
          });
        });
      } catch {
        // Silent fallback — static layout
      }
    }

    init();

    // Reinit after View Transition navigation
    const handlePageLoad = () => {
      hasInit.current = false;
      if (ctx) ctx.revert();
      init();
    };
    document.addEventListener('astro:page-load', handlePageLoad);

    return () => {
      document.removeEventListener('astro:page-load', handlePageLoad);
      if (ctx) ctx.revert();
    };
  }, []);

  return null;
}
