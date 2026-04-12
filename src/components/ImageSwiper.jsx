import { useState, useRef, useCallback, useEffect } from 'react';

/**
 * ImageSwiper — Stacked card deck with drag-to-dismiss interaction.
 * V3 spec: 360x480px cards, CSS perspective(700px), 50px drag threshold.
 *
 * Props:
 *   cards: Array<{ label: string }> — card data (placeholders for now)
 */
const CARD_WIDTH = 360;
const CARD_HEIGHT = 480;
const DRAG_THRESHOLD = 50;
const FLY_OFF_DURATION = 300;
const MAX_VISIBLE = 4;

export default function ImageSwiper({ cards = [] }) {
  const [stack, setStack] = useState(() => cards.map((_, i) => i));
  const [dragging, setDragging] = useState(false);
  const [dragX, setDragX] = useState(0);
  const [dragStartX, setDragStartX] = useState(0);
  const [flyingOff, setFlyingOff] = useState(false);
  const containerRef = useRef(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setReducedMotion(
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
  }, []);

  const topIndex = stack[0];

  const handlePointerDown = useCallback(
    (e) => {
      if (flyingOff) return;
      setDragging(true);
      setDragStartX(e.clientX);
      setDragX(0);
      e.currentTarget.setPointerCapture(e.pointerId);
    },
    [flyingOff]
  );

  const handlePointerMove = useCallback(
    (e) => {
      if (!dragging) return;
      setDragX(e.clientX - dragStartX);
    },
    [dragging, dragStartX]
  );

  const dismissCard = useCallback(() => {
    if (reducedMotion) {
      setStack((prev) => {
        const [top, ...rest] = prev;
        return [...rest, top];
      });
      setDragX(0);
      return;
    }

    setFlyingOff(true);
    setTimeout(() => {
      setStack((prev) => {
        const [top, ...rest] = prev;
        return [...rest, top];
      });
      setDragX(0);
      setFlyingOff(false);
    }, FLY_OFF_DURATION);
  }, [reducedMotion]);

  const handlePointerUp = useCallback(() => {
    if (!dragging) return;
    setDragging(false);

    if (Math.abs(dragX) > DRAG_THRESHOLD) {
      dismissCard();
    } else {
      setDragX(0);
    }
  }, [dragging, dragX, dismissCard]);

  // Desktop rotation proportional to drag
  const getTopCardStyle = () => {
    const rotation = (dragX / CARD_WIDTH) * 15; // max ~15deg
    const baseStyle = {
      transform: `translateX(${flyingOff ? dragX * 4 : dragX}px) rotate(${flyingOff ? rotation * 3 : rotation}deg)`,
      transition: dragging
        ? 'none'
        : flyingOff
          ? `transform ${FLY_OFF_DURATION}ms var(--ease-accelerate), opacity ${FLY_OFF_DURATION}ms var(--ease-accelerate)`
          : `transform ${FLY_OFF_DURATION}ms var(--ease-standard)`,
      opacity: flyingOff ? 0 : 1,
      zIndex: MAX_VISIBLE + 1,
      cursor: 'grab',
    };
    if (dragging) baseStyle.cursor = 'grabbing';
    return baseStyle;
  };

  const getCardStyle = (stackPosition) => {
    if (stackPosition === 0) return getTopCardStyle();

    const depth = Math.min(stackPosition, MAX_VISIBLE - 1);
    return {
      transform: `translateY(${depth * 8}px) scale(${1 - depth * 0.03})`,
      zIndex: MAX_VISIBLE - stackPosition,
      pointerEvents: 'none',
      transition: reducedMotion
        ? 'none'
        : `transform ${FLY_OFF_DURATION}ms var(--ease-standard)`,
    };
  };

  if (cards.length === 0) return null;

  return (
    <div
      ref={containerRef}
      className="swiper-container"
      style={{
        position: 'relative',
        width: CARD_WIDTH,
        height: CARD_HEIGHT + (MAX_VISIBLE - 1) * 8,
        perspective: '700px',
        margin: '0 auto',
        touchAction: 'pan-y',
      }}
    >
      {stack.slice(0, MAX_VISIBLE).map((cardIndex, stackPos) => (
        <div
          key={cardIndex}
          className="swiper-card"
          style={{
            position: stackPos === 0 ? 'relative' : 'absolute',
            top: 0,
            left: 0,
            width: CARD_WIDTH,
            height: CARD_HEIGHT,
            borderRadius: 'var(--radius-card)',
            backgroundColor: 'var(--surface-1)',
            border: '1px solid var(--surface-3)',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            userSelect: 'none',
            ...getCardStyle(stackPos),
          }}
          {...(stackPos === 0
            ? {
                onPointerDown: handlePointerDown,
                onPointerMove: handlePointerMove,
                onPointerUp: handlePointerUp,
                onPointerCancel: handlePointerUp,
              }
            : {})}
        >
          <span
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-small)',
              color: 'var(--text-tertiary)',
              textAlign: 'center',
              padding: 'var(--space-6)',
            }}
          >
            {cards[cardIndex]?.label || `Portrait ${cardIndex + 1}`}
          </span>
        </div>
      ))}

      {/* Swipe indicator — desktop only */}
      <p
        className="swiper-hint"
        style={{
          position: 'absolute',
          bottom: -40,
          left: '50%',
          transform: 'translateX(-50%)',
          fontFamily: 'var(--font-body)',
          fontSize: 'var(--text-caption)',
          color: 'var(--text-tertiary)',
          whiteSpace: 'nowrap',
          animation: reducedMotion ? 'none' : 'swiper-bob 2s var(--ease-smooth) infinite',
        }}
      >
        Drag to explore
      </p>

      <style>{`
        @keyframes swiper-bob {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(4px); }
        }
        @media (max-width: 767px) {
          .swiper-container {
            max-width: 280px !important;
          }
          .swiper-card {
            max-width: 280px !important;
            height: 380px !important;
          }
        }
        @media (min-width: 768px) {
          .swiper-hint {
            display: block;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .swiper-hint {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}
