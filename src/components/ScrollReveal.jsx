import { useEffect, useRef } from 'react';

/**
 * ScrollReveal — Uses GSAP ScrollTrigger to reveal sections on scroll.
 * React island hydrated client:visible.
 * 
 * Progressive enhancement: content is visible by default in CSS.
 * GSAP sets opacity:0 then animates to 1 on scroll.
 * If JS fails, content remains visible.
 */
export default function ScrollReveal({ children }) {
  const containerRef = useRef(null);

  useEffect(() => {
    let ctx;
    async function init() {
      try {
        const gsapModule = await import('gsap');
        const gsap = gsapModule.default || gsapModule.gsap || gsapModule;
        const { ScrollTrigger } = await import('gsap/ScrollTrigger');
        
        gsap.registerPlugin(ScrollTrigger);

        const sections = containerRef.current?.querySelectorAll('.reveal-section');
        if (!sections || sections.length === 0) return;

        ctx = gsap.context(() => {
          sections.forEach((section, i) => {
            // Set initial hidden state via GSAP (not CSS)
            gsap.set(section, { opacity: 0, y: 20 });
            
            gsap.to(section, {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: section,
                start: 'top 85%',
                end: 'top 50%',
                toggleActions: 'play none none none',
              },
              delay: i * 0.05,
            });
          });
        }, containerRef);
      } catch (e) {
        // Fallback: ensure everything is visible
        const sections = containerRef.current?.querySelectorAll('.reveal-section');
        sections?.forEach(s => {
          s.style.opacity = '1';
          s.style.transform = 'none';
        });
      }
    }

    init();
    return () => { if (ctx) ctx.revert(); };
  }, []);

  return (
    <div ref={containerRef}>
      {children}
    </div>
  );
}
