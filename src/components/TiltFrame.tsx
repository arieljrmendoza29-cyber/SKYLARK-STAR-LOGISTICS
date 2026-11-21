import { useEffect, useRef, type ReactNode } from 'react';
import { useReducedMotion } from 'motion/react';

/**
 * Weighted 3D tilt + soft light glare that follows the mouse.
 * Adapted from BrewedOps Motion Library "3D tilt" (cards-tilt).
 *
 * - Mouse / trackpad only: phones and tablets are left alone (no tilt on touch).
 * - Respects "reduce motion" accessibility settings.
 * - Animates only while the pointer is over the frame or settling back,
 *   so idle frames cost nothing.
 */

// Strength of the effect. The original demo uses 30° / 26° on a small card;
// large photos look better with a gentler angle.
const TILT_Y_DEG = 12; // left / right
const TILT_X_DEG = 10; // up / down
const HOVER_SCALE = 1.02;
const EASE = 0.12; // how quickly the tilt follows the pointer (0–1)
const PERSPECTIVE_PX = 900;
const GLARE_OPACITY = 0.45;

interface TiltFrameProps {
  children: ReactNode;
  className?: string;
  as?: 'div' | 'figure';
}

export function TiltFrame({ children, className = '', as = 'div' }: TiltFrameProps) {
  const ref = useRef<HTMLElement | null>(null);
  const glareRef = useRef<HTMLSpanElement | null>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    const glare = glareRef.current;
    if (!el || !glare || shouldReduceMotion) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    let px = 0.5;
    let py = 0.5;
    let cx = 0.5;
    let cy = 0.5;
    let hovering = false;
    let rafId = 0;

    const render = () => {
      el.style.transform = `perspective(${PERSPECTIVE_PX}px) rotateY(${((cx - 0.5) * 2 * TILT_Y_DEG).toFixed(2)}deg) rotateX(${((0.5 - cy) * 2 * TILT_X_DEG).toFixed(2)}deg) scale(${HOVER_SCALE})`;
      glare.style.background = `radial-gradient(circle at ${(cx * 100).toFixed(1)}% ${(cy * 100).toFixed(1)}%, rgba(255,255,255,${GLARE_OPACITY}), rgba(255,255,255,0) 55%)`;
    };

    const tick = () => {
      cx += (px - cx) * EASE;
      cy += (py - cy) * EASE;
      const settled = Math.abs(px - cx) + Math.abs(py - cy) < 1e-3;

      if (settled && !hovering) {
        // Back at rest: hand the element back to normal styling.
        el.style.transform = '';
        el.style.willChange = '';
        rafId = 0;
        return;
      }

      render();
      rafId = settled ? 0 : requestAnimationFrame(tick);
    };

    const start = () => {
      if (!rafId) rafId = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      const r = el.getBoundingClientRect();
      px = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
      py = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height));
      if (!hovering) {
        hovering = true;
        el.style.willChange = 'transform';
        glare.style.opacity = '1';
      }
      start();
    };

    const onLeave = () => {
      hovering = false;
      px = 0.5;
      py = 0.5;
      glare.style.opacity = '0';
      start();
    };

    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    return () => {
      cancelAnimationFrame(rafId);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
      el.style.transform = '';
      el.style.willChange = '';
    };
  }, [shouldReduceMotion]);

  const Tag = as;
  return (
    <Tag
      ref={(node: HTMLElement | null) => {
        ref.current = node;
      }}
      // isolation keeps rounded corners clipped while tilted (Safari).
      className={`relative isolate ${className}`}
    >
      {children}
      <span
        ref={glareRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] opacity-0 transition-opacity duration-300"
      />
    </Tag>
  );
}
