import { useEffect, useRef } from 'react';

/**
 * SplitTextReveal — Manual word-split mask reveal animation.
 * Avoids paid GSAP SplitText plugin by splitting text into word-level spans
 * and animating translateY with GSAP .to() (free).
 *
 * Props:
 *   text: string — the text to animate
 *   as: string — HTML tag to render (default 'h1')
 *   className: string — classes for the outer element
 *   delay: number — delay in seconds before animation starts (default 0)
 *   onComplete: function — callback when animation finishes
 */
export default function SplitTextReveal({
  text,
  as: Tag = 'h1',
  className = '',
  delay = 0,
  onComplete,
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    // Check reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) {
      // Show immediately with simple fade
      const words = containerRef.current?.querySelectorAll('.split-word');
      words?.forEach((w) => {
        w.style.transform = 'translateY(0)';
        w.style.opacity = '1';
      });
      onComplete?.();
      return;
    }

    let ctx;
    async function animate() {
      try {
        const gsapModule = await import('gsap');
        const gsap = gsapModule.default || gsapModule.gsap || gsapModule;

        const words = containerRef.current?.querySelectorAll('.split-word');
        if (!words || words.length === 0) return;

        ctx = gsap.context(() => {
          gsap.set(words, { y: '100%', opacity: 0 });

          gsap.to(words, {
            y: '0%',
            opacity: 1,
            duration: 0.6,
            ease: 'power3.out', // approximates --ease-emphasized
            stagger: 0.08,
            delay,
            onComplete,
          });
        }, containerRef);
      } catch {
        // Fallback: show everything
        const words = containerRef.current?.querySelectorAll('.split-word');
        words?.forEach((w) => {
          w.style.transform = 'translateY(0)';
          w.style.opacity = '1';
        });
        onComplete?.();
      }
    }

    animate();
    return () => {
      if (ctx) ctx.revert();
    };
  }, [delay, onComplete]);

  const words = text.split(' ');

  return (
    <Tag ref={containerRef} className={className} aria-label={text}>
      {words.map((word, i) => (
        <span
          key={i}
          className="split-word-mask"
          style={{ overflow: 'hidden', display: 'inline-block' }}
        >
          <span
            className="split-word"
            style={{
              display: 'inline-block',
              transform: 'translateY(100%)',
              opacity: 0,
              willChange: 'transform, opacity',
            }}
            aria-hidden="true"
          >
            {word}
          </span>
          {i < words.length - 1 && (
            <span style={{ display: 'inline-block', width: '0.3em' }}>&nbsp;</span>
          )}
        </span>
      ))}
    </Tag>
  );
}
