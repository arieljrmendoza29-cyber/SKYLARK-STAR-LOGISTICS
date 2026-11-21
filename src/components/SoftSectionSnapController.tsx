import { useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from 'motion/react';
import {
  computeSnapTargets,
  easeOutCubic,
  findNearestSectionIndex,
  shouldSoftSnap,
} from '../utils/sectionSnap';

/**
 * When true, the page automatically glides to the nearest section after scrolling stops.
 * Off for a natural, iPhone-like feel: the page stops exactly where the visitor lets go.
 * The section rail on the right still glides to a section when clicked.
 */
const AUTO_SNAP_TO_SECTIONS = false;

gsap.registerPlugin(ScrollTrigger);

interface SectionMeta {
  id: string;
  label: string;
}

interface SoftSectionSnapControllerProps {
  currentPath: string;
}

export function SoftSectionSnapController({ currentPath }: SoftSectionSnapControllerProps) {
  const shouldReduceMotion = useReducedMotion();
  const [sections, setSections] = useState<SectionMeta[]>([]);
  const lenisRef = useRef<Lenis | null>(null);
  const railRef = useRef<HTMLDivElement | null>(null);
  const dotRef = useRef<HTMLSpanElement | null>(null);
  const tickRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const targetsRef = useRef<number[]>([]);

  useEffect(() => {
    // Allow page transition animation to mount new route sections before measuring
    let mounted = true;
    const collectTimer = window.setTimeout(() => {
      if (!mounted) return;
      const nodes = Array.from(document.querySelectorAll<HTMLElement>('[data-snap-section]'));
      const collected: SectionMeta[] = nodes.map((el, idx) => ({
        id: el.id || `snap-section-${idx + 1}`,
        label: el.dataset.snapLabel || `Section ${String(idx + 1).padStart(2, '0')}`,
      }));
      setSections(collected);
    }, 60);

    return () => {
      mounted = false;
      window.clearTimeout(collectTimer);
    };
  }, [currentPath]);

  useEffect(() => {
    if (shouldReduceMotion) {
      if (dotRef.current) {
        dotRef.current.style.transform = '';
      }
      return;
    }

    // iPhone-style glide for mouse wheels and trackpads. Phones and tablets keep their own
    // native touch scrolling (syncTouch: false), which already has real iOS/Android momentum.
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: false,
    });
    lenisRef.current = lenis;

    let railTravel = 0;
    let lastInput = performance.now();
    let snapping = false;
    let targetIndex = -1;
    let rafId = 0;

    const measure = () => {
      const nodes = Array.from(document.querySelectorAll<HTMLElement>('[data-snap-section]'));
      const offsets = nodes.map((el) => {
        const rect = el.getBoundingClientRect();
        return rect.top + window.scrollY;
      });
      const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      targetsRef.current = computeSnapTargets(offsets, 72, maxScroll);

      if (railRef.current) {
        railTravel = Math.max(0, railRef.current.clientHeight - 10);
      }
      lenis.resize();
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    window.addEventListener('resize', measure, { passive: true });

    const offScroll = lenis.on('scroll', ScrollTrigger.update);

    const offVirtual = lenis.on('virtual-scroll', () => {
      lastInput = performance.now();
      // Any new user wheel/touch input cancels active snap glide cleanly
      snapping = false;
      targetIndex = -1;
    });

    const loop = (t: number) => {
      rafId = requestAnimationFrame(loop);
      lenis.raf(t);

      const targets = targetsRef.current;
      if (targets.length < 2) return;

      const currentScroll = lenis.scroll;
      const nearIdx = findNearestSectionIndex(currentScroll, targets);
      const nearTarget = targets[nearIdx];

      if (
        AUTO_SNAP_TO_SECTIONS &&
        shouldSoftSnap({
          scrollY: currentScroll,
          targetY: nearTarget,
          velocity: lenis.velocity,
          timeSinceLastInputMs: t - lastInput,
          isSnapping: snapping,
          reducedMotion: Boolean(shouldReduceMotion),
          viewportHeight: window.innerHeight,
        })
      ) {
        snapping = true;
        targetIndex = nearIdx;
        lenis.scrollTo(nearTarget, {
          duration: 0.7,
          easing: easeOutCubic,
          onComplete: () => {
            snapping = false;
            targetIndex = -1;
          },
        });
      }

      if (dotRef.current) {
        const progress = Math.max(0, Math.min(1, lenis.progress || 0));
        dotRef.current.style.transform = `translateY(${(progress * railTravel).toFixed(1)}px)`;
      }

      const activeIdx = targetIndex > -1 ? targetIndex : nearIdx;
      for (let i = 0; i < tickRefs.current.length; i++) {
        const tick = tickRefs.current[i];
        if (!tick) continue;
        const isActive = i === activeIdx;
        tick.dataset.active = isActive ? 'true' : 'false';
      }

      if (railRef.current) {
        railRef.current.dataset.activeSection = String(activeIdx + 1);
      }
    };

    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      window.removeEventListener('resize', measure);
      offScroll();
      offVirtual();
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [currentPath, sections.length, shouldReduceMotion]);

  const handleTickClick = (idx: number) => {
    const targetY = targetsRef.current[idx] ?? 0;
    if (shouldReduceMotion || !lenisRef.current) {
      window.scrollTo({ top: targetY, behavior: 'auto' });
      return;
    }
    lenisRef.current.scrollTo(targetY, {
      duration: 0.7,
      easing: easeOutCubic,
    });
  };

  if (sections.length < 2) {
    return null;
  }

  return (
    <aside
      aria-label="Page section progress"
      className="hidden xl:flex fixed right-4 top-1/2 -translate-y-1/2 z-40 items-center pointer-events-auto"
    >
      <div
        ref={railRef}
        data-testid="section-snap-rail"
        className="relative h-48 w-5 flex flex-col justify-between items-end py-[3px]"
      >
        {sections.map((section, idx) => (
          <button
            key={section.id}
            ref={(el) => {
              tickRefs.current[idx] = el;
            }}
            type="button"
            onClick={() => handleTickClick(idx)}
            title={section.label}
            aria-label={`Scroll to ${section.label}`}
            data-active={idx === 0 ? 'true' : 'false'}
            className="group relative flex items-center justify-end w-5 h-3 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#FF6500] rounded-sm"
          >
            <span
              className="block h-[2.5px] w-2.5 rounded-full bg-[#171717]/25 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] origin-right group-hover:bg-[#FF6500] group-hover:scale-x-150 group-data-[active=true]:bg-[#171717] group-data-[active=true]:scale-x-[1.8]"
            />
          </button>
        ))}

        {/* Moving Vibrant Orange Progress Dot synced to Lenis progress */}
        <span
          ref={dotRef}
          aria-hidden="true"
          className="pointer-events-none absolute right-[1px] top-0 w-2.5 h-2.5 rounded-full bg-[#FF6500] ring-2 ring-[#FFF5EB] shadow-sm will-change-transform"
        />
      </div>
    </aside>
  );
}
