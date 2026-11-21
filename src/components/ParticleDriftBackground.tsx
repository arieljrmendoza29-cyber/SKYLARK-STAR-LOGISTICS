import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'motion/react';

interface Particle {
  x: number;
  y: number;
  z: number;
  ph: number;
}

interface ParticleDriftBackgroundProps {
  particleCount?: number;
  className?: string;
}

function createParticles(count: number): Particle[] {
  const particles: Particle[] = [];
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random(),
      y: Math.random(),
      z: Math.random(),
      ph: Math.random() * Math.PI * 2,
    });
  }
  return particles;
}

export function ParticleDriftBackground({
  particleCount = 70,
  className = '',
}: ParticleDriftBackgroundProps) {
  const shouldReduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    const particles = createParticles(particleCount);

    const fit = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = container.clientWidth;
      height = container.clientHeight;
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
    };

    const drawFrame = (timeSec: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      for (const p of particles) {
        const x = (p.x + Math.sin(timeSec * 0.5 + p.ph) * 0.012 * (0.4 + p.z)) * width;
        const y = p.y * height;
        const radius = 0.9 + p.z * 2.6;
        const alpha = (0.14 + p.z * 0.42).toFixed(2);

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 101, 0, ${alpha})`;
        ctx.fill();
      }
    };

    fit();

    if (shouldReduceMotion) {
      drawFrame(0);
      return;
    }

    const ro = new ResizeObserver(() => {
      fit();
    });
    ro.observe(container);

    let rafId = 0;
    let last = performance.now();
    let elapsed = 0;

    const loop = (now: number) => {
      rafId = requestAnimationFrame(loop);
      const dt = now - last;
      last = now;
      if (dt > 200 || dt < 0) return;

      if (container.clientWidth !== width || container.clientHeight !== height) {
        fit();
      }

      elapsed += dt / 1000;
      const dtSec = dt / 1000;

      for (const p of particles) {
        p.y -= dtSec * (0.02 + p.z * 0.09);
        if (p.y < -0.05) {
          p.y = 1.05;
          p.x = Math.random();
        }
      }

      drawFrame(elapsed);
    };

    drawFrame(0);
    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
    };
  }, [particleCount, shouldReduceMotion]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      data-paused={shouldReduceMotion ? '1' : undefined}
      className={`pointer-events-none absolute inset-0 overflow-hidden bg-gradient-to-b from-[#FFF5EB] via-[#FFF2E5] to-[#F6E2CE] ${className}`}
    >
      <canvas
        ref={canvasRef}
        data-testid="hero-particle-canvas"
        className="block w-full h-full"
      />
    </div>
  );
}
