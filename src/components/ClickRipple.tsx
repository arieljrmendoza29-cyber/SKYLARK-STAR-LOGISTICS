import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'motion/react';

/**
 * Orange ripple rings wherever the visitor clicks or taps, on every page.
 * Adapted from BrewedOps Motion Library "Click ripple" (cursor-click-ripple).
 *
 * - Works with mouse, trackpad and touch.
 * - Never blocks clicks (pointer-events: none); the normal cursor stays.
 * - Off for visitors with "reduce motion" turned on.
 */

const RING_COLOR = '#FF6500';
const CORE_FILL = '#FFE7D6';
const CORE_BORDER = '#FF8A3D';
const MAX_ELEMENTS = 30; // keeps rapid clicking from piling up elements

export function ClickRipple() {
  const layerRef = useRef<HTMLDivElement | null>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer || shouldReduceMotion || typeof layer.animate !== 'function') return;

    const spawn = (className: string, size: number, styles: Partial<CSSStyleDeclaration>) => {
      const el = document.createElement('i');
      el.className = className;
      Object.assign(el.style, {
        position: 'absolute',
        left: '0',
        top: '0',
        width: `${size}px`,
        height: `${size}px`,
        margin: `${-size / 2}px 0 0 ${-size / 2}px`,
        borderRadius: '50%',
        pointerEvents: 'none',
        ...styles,
      });
      layer.appendChild(el);
      return el;
    };

    const ripple = (x: number, y: number) => {
      while (layer.childElementCount > MAX_ELEMENTS) layer.firstElementChild?.remove();
      const at = `translate(${x}px, ${y}px)`;

      // Two expanding rings, the second slightly later and smaller
      for (let i = 0; i < 2; i++) {
        const ring = spawn('ripple-ring', 44, { border: `1.5px solid ${RING_COLOR}` });
        const a = ring.animate(
          [
            { opacity: 0.85, transform: `${at} scale(0.15)` },
            { opacity: 0, transform: `${at} scale(${3.4 - i * 0.9})` },
          ],
          { duration: 1100 + i * 150, delay: i * 140, easing: 'cubic-bezier(.2,.7,.1,1)', fill: 'both' },
        );
        a.onfinish = () => ring.remove();
      }

      // Small soft core that pops and fades
      const core = spawn('ripple-core', 12, { background: CORE_FILL, border: `1.5px solid ${CORE_BORDER}` });
      const b = core.animate(
        [
          { opacity: 1, transform: `${at} scale(1)` },
          { opacity: 0, transform: `${at} scale(2.2)` },
        ],
        { duration: 500, easing: 'ease-out', fill: 'both' },
      );
      b.onfinish = () => core.remove();
    };

    const onDown = (e: PointerEvent) => {
      if (e.button !== 0 && e.pointerType === 'mouse') return; // left click only
      ripple(e.clientX, e.clientY);
    };

    window.addEventListener('pointerdown', onDown, { passive: true, capture: true });
    return () => {
      window.removeEventListener('pointerdown', onDown, { capture: true });
      layer.replaceChildren();
    };
  }, [shouldReduceMotion]);

  if (shouldReduceMotion) return null;

  return <div ref={layerRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[100] overflow-hidden" />;
}
