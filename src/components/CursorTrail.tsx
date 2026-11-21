import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'motion/react';

/**
 * Orange dot trail that follows the mouse across the whole site.
 * Adapted from BrewedOps Motion Library "Dot trail" (cursor-trail).
 *
 * - Mouse / trackpad only: never shown on phones or tablets.
 * - Never blocks clicks (pointer-events: none) and keeps the normal cursor.
 * - Off for visitors with "reduce motion" turned on.
 * - Sleeps when the mouse is still, so it costs nothing while idle.
 */

const DOT_COUNT = 14;
const DOT_COLOR = '#FF6500';
const FOLLOW = 0.34; // how tightly each dot follows the one before it (0–1)

export function CursorTrail() {
  const layerRef = useRef<HTMLDivElement | null>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer || shouldReduceMotion) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const dots = Array.from(layer.children) as HTMLElement[];
    const pos = dots.map(() => ({ x: -100, y: -100 }));
    const target = { x: -100, y: -100 };
    let visible = false;
    let rafId = 0;

    const show = (on: boolean) => {
      if (visible === on) return;
      visible = on;
      layer.style.opacity = on ? '1' : '0';
    };

    const loop = () => {
      pos[0].x = target.x;
      pos[0].y = target.y;
      let moving = false;
      for (let i = 1; i < pos.length; i++) {
        const dx = pos[i - 1].x - pos[i].x;
        const dy = pos[i - 1].y - pos[i].y;
        pos[i].x += dx * FOLLOW;
        pos[i].y += dy * FOLLOW;
        if (Math.abs(dx) + Math.abs(dy) > 0.1) moving = true;
      }
      for (let i = 0; i < dots.length; i++) {
        dots[i].style.transform = `translate3d(${pos[i].x.toFixed(1)}px, ${pos[i].y.toFixed(1)}px, 0)`;
      }
      rafId = moving ? requestAnimationFrame(loop) : 0;
    };

    const start = () => {
      if (!rafId) rafId = requestAnimationFrame(loop);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
      if (!visible) {
        // Jump the whole trail to the pointer instead of streaking in from a corner.
        for (const p of pos) {
          p.x = e.clientX;
          p.y = e.clientY;
        }
      }
      target.x = e.clientX;
      target.y = e.clientY;
      show(true);
      start();
    };

    const onLeave = () => show(false);
    const onOut = (e: PointerEvent) => {
      if (!e.relatedTarget) show(false); // left the browser window
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    document.addEventListener('pointerout', onOut);
    window.addEventListener('blur', onLeave);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
      document.removeEventListener('pointerout', onOut);
      window.removeEventListener('blur', onLeave);
    };
  }, [shouldReduceMotion]);

  if (shouldReduceMotion) return null;

  return (
    <div
      ref={layerRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[100] opacity-0 transition-opacity duration-300 hidden [@media(hover:hover)_and_(pointer:fine)]:block"
    >
      {Array.from({ length: DOT_COUNT }, (_, i) => {
        const size = 14 - i * 0.8;
        return (
          <i
            key={i}
            className="absolute left-0 top-0 rounded-full will-change-transform"
            style={{
              width: size,
              height: size,
              marginLeft: -size / 2,
              marginTop: -size / 2,
              background: DOT_COLOR,
              opacity: 1 - i * 0.07,
              transform: 'translate3d(-100px, -100px, 0)',
            }}
          />
        );
      })}
    </div>
  );
}
