import { useEffect, useRef, useState } from 'react';

/**
 * MetricCounter — Animates a number from 0 to target with GSAP.
 * React island hydrated client:visible.
 */
export default function MetricCounter({ target, prefix = '', suffix = '', label = '' }) {
  const [displayValue, setDisplayValue] = useState(0);
  const containerRef = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (hasAnimated.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          animateCount();
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  function animateCount() {
    const numTarget = parseFloat(target);
    const duration = 2000; // 2 seconds max
    const startTime = performance.now();

    function easeOutExpo(t) {
      return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    }

    function step(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutExpo(progress);
      const current = numTarget * easedProgress;

      // Format: if target is integer, show integer. If decimal, show 1 decimal.
      if (Number.isInteger(numTarget)) {
        setDisplayValue(Math.round(current));
      } else {
        setDisplayValue(Math.round(current * 10) / 10);
      }

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  }

  return (
    <div ref={containerRef} style={{ textAlign: 'center' }}>
      <div className="metric-value">
        {prefix}{displayValue}{suffix}
      </div>
      {label && <div className="metric-label">{label}</div>}
    </div>
  );
}
