import { useEffect, useRef } from 'react';
import { CheckCircle2, FileText, MapPin, Truck } from 'lucide-react';
import { useReducedMotion } from 'motion/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ProcessStepItem } from '../utils/companyData';

gsap.registerPlugin(ScrollTrigger);

interface GrowingSpineTimelineProps {
  steps: ProcessStepItem[];
}

const STEP_ICONS = {
  FileText,
  MapPin,
  Truck,
  CheckCircle2,
};

export function GrowingSpineTimeline({ steps }: GrowingSpineTimelineProps) {
  const shouldReduceMotion = useReducedMotion();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const fillRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    const fill = fillRef.current;
    if (!root || !fill) return;

    if (shouldReduceMotion) {
      gsap.set(fill, { scaleY: 1 });
      const dots = root.querySelectorAll<HTMLElement>('[data-timeline-dot]');
      const reveals = root.querySelectorAll<HTMLElement>('[data-timeline-reveal]');
      gsap.set(dots, { scale: 1 });
      gsap.set(reveals, { opacity: 1, x: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        fill,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: root,
            start: 'top 72%',
            end: 'bottom 72%',
            scrub: 0.4,
            invalidateOnRefresh: true,
          },
        },
      );

      const items = gsap.utils.toArray<HTMLElement>('[data-timeline-item]', root);
      items.forEach((item) => {
        const dot = item.querySelector<HTMLElement>('[data-timeline-dot]');
        const reveals = item.querySelectorAll<HTMLElement>('[data-timeline-reveal]');

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: item,
            start: 'top 78%',
            // Reveal once and stay visible; scrolling back up no longer hides the step text.
            toggleActions: 'play none none none',
          },
        });

        if (dot) {
          tl.fromTo(
            dot,
            { scale: 0 },
            { scale: 1, duration: 0.36, ease: 'back.out(3)' },
            0,
          );
        }

        if (reveals.length > 0) {
          tl.fromTo(
            reveals,
            { opacity: 0, x: 16 },
            {
              opacity: 1,
              x: 0,
              duration: 0.48,
              stagger: 0.06,
              ease: 'power3.out',
            },
            0.08,
          );
        }
      });
    }, root);

    const handleRefresh = () => {
      ScrollTrigger.refresh();
    };

    // Recalculate trigger points whenever the page above changes height
    // (photos loading, the 3D services tour starting), so reveals fire at the right spot.
    let refreshTimer = 0;
    const scheduleRefresh = () => {
      window.clearTimeout(refreshTimer);
      refreshTimer = window.setTimeout(handleRefresh, 150);
    };
    const ro = new ResizeObserver(scheduleRefresh);
    ro.observe(root);
    ro.observe(document.body);

    let cancelled = false;
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        if (!cancelled) {
          ScrollTrigger.refresh();
        }
      });
    }

    return () => {
      cancelled = true;
      window.clearTimeout(refreshTimer);
      ro.disconnect();
      ctx.revert();
    };
  }, [shouldReduceMotion, steps.length]);

  return (
    <div
      ref={rootRef}
      data-testid="working-process-timeline"
      className="relative pl-9 sm:pl-12"
    >
      {/* Background Spine Track */}
      <div
        aria-hidden="true"
        className="absolute left-[11px] sm:left-[15px] top-6 bottom-6 w-[2px] rounded-full bg-[#EAD8C8] overflow-hidden"
      >
        <div
          ref={fillRef}
          data-testid="timeline-spine-fill"
          className="w-full h-full rounded-full bg-[#FF6500] origin-top will-change-transform"
        />
      </div>

      <ol className="space-y-6 sm:space-y-7 list-none m-0 p-0">
        {steps.map((step) => {
          const Icon = STEP_ICONS[step.iconName];
          return (
            <li
              key={step.number}
              data-timeline-item
              className="relative"
            >
              {/* Milestone Dot on Spine */}
              <span
                aria-hidden="true"
                data-timeline-dot
                className="absolute -left-8 sm:-left-10 top-7 w-4 h-4 rounded-full bg-[#FF6500] ring-4 ring-white shadow-sm will-change-transform"
              />

              <article className="rounded-3xl bg-[#FFF5EB] border border-[#EAD8C8] p-6 sm:p-8 transition-colors duration-200 hover:border-[#FF6500]/60">
                <div
                  data-timeline-reveal
                  className="flex items-center justify-between gap-4 mb-4"
                >
                  <span className="font-mono text-xs sm:text-sm font-bold uppercase tracking-widest text-[#FF6500]">
                    Step {step.number}
                  </span>
                  <div className="w-11 h-11 rounded-2xl bg-white border border-[#EAD8C8] flex items-center justify-center shrink-0">
                    <Icon
                      className="w-5 h-5 text-[#171717]"
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                  </div>
                </div>

                <h3
                  data-timeline-reveal
                  className="font-display text-xl sm:text-2xl font-extrabold text-[#171717] tracking-tight"
                >
                  {step.title}
                </h3>

                <p
                  data-timeline-reveal
                  className="mt-2.5 text-sm sm:text-base text-[#171717]/75 leading-relaxed"
                >
                  {step.description}
                </p>
              </article>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
