import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useReducedMotion } from 'motion/react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { CORE_SERVICES, RoutePath, SITE_IMAGES } from '../utils/companyData';
import { withBase } from '../utils/basePath';

interface ServicesJourneyProps {
  onNavigate: (path: RoutePath, servicePreselect?: string) => void;
  /** Shown instead when 3D can't run (no WebGL) or the visitor prefers reduced motion. */
  fallback?: ReactNode;
  /** Show the "Service Details" link (hidden on the Services page itself). */
  showDetailsLink?: boolean;
}

function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
const smooth = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};

/**
 * Scroll-driven 3D tour of the core services: the section pins to the screen while
 * the camera glides past one photo card per service, and each service's text
 * fades in as its card comes into focus.
 */
export function ServicesJourney({ onNavigate, fallback = null, showDetailsLink = true }: ServicesJourneyProps) {
  const shouldReduceMotion = useReducedMotion();
  const [enabled] = useState(() => supportsWebGL());
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const hostRef = useRef<HTMLDivElement | null>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const barRef = useRef<HTMLSpanElement | null>(null);
  const hintRef = useRef<HTMLDivElement | null>(null);
  const [failed, setFailed] = useState(false);

  const active = enabled && !shouldReduceMotion && !failed;

  useEffect(() => {
    if (!active) return;
    const section = sectionRef.current;
    const host = hostRef.current;
    if (!section || !host) return;

    let dispose: (() => void) | null = null;
    let cancelled = false;
    const count = CORE_SERVICES.length;

    const getTarget = () => {
      const r = section.getBoundingClientRect();
      const travel = r.height - window.innerHeight;
      return travel > 0 ? clamp01(-r.top / travel) : 0;
    };

    const onFrame = (progress: number, index: number) => {
      for (let i = 0; i < count; i++) {
        const el = panelRefs.current[i];
        if (!el) continue;
        const o = 1 - smooth(0.1, 0.5, Math.abs(index - i));
        const y = (index < i ? 1 : -1) * 26 * (1 - o);
        el.style.opacity = o.toFixed(3);
        el.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)`;
        el.style.visibility = o < 0.01 ? 'hidden' : 'visible';
        // Only the panel in focus can be clicked.
        el.style.pointerEvents = o > 0.6 ? 'auto' : 'none';
      }
      if (barRef.current) barRef.current.style.transform = `scaleX(${progress.toFixed(4)})`;
      if (hintRef.current) hintRef.current.style.opacity = (1 - smooth(0.01, 0.08, progress)).toFixed(2);
    };

    import('../three/servicesJourneyScene')
      .then(({ createServicesJourney }) => {
        if (cancelled) return;
        dispose = createServicesJourney(host, {
          focusCards: CORE_SERVICES.map((s) => ({ image: s.image, number: s.number, title: s.title })),
          extraCards: [SITE_IMAGES.editorialContainers, SITE_IMAGES.texasFreightHub, SITE_IMAGES.laporteCorridor].map(
            (image) => ({ image }),
          ),
          getTarget,
          onFrame,
        });
      })
      .catch(() => setFailed(true));

    return () => {
      cancelled = true;
      dispose?.();
    };
  }, [active]);

  if (!active) return <>{fallback}</>;

  return (
    <div
      ref={sectionRef}
      className="relative"
      // Roughly one screen of scrolling per service, plus one to settle.
      style={{ height: `${CORE_SERVICES.length * 85 + 100}svh` }}
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden bg-gradient-to-b from-[#FFF5EB] to-[#F7E6D5]">
        <div ref={hostRef} aria-hidden="true" className="absolute inset-0" />

        {/* Service text panels, one visible at a time */}
        {CORE_SERVICES.map((service, i) => (
          <div
            key={service.id}
            ref={(el) => {
              panelRefs.current[i] = el;
            }}
            className="absolute left-4 right-4 bottom-[7%] sm:left-8 sm:right-auto sm:max-w-md lg:left-[max(2rem,calc(50vw-36rem))] lg:max-w-lg"
            style={{ opacity: i === 0 ? 1 : 0, visibility: i === 0 ? 'visible' : 'hidden' }}
          >
            <div className="rounded-3xl bg-white/95 backdrop-blur-md border border-[#EAD8C8] shadow-[0_12px_32px_rgba(23,23,23,0.10)] p-6 sm:p-7">
              <p className="font-mono text-xs font-semibold uppercase tracking-widest text-[#FF6500]">
                {service.number} / {String(CORE_SERVICES.length).padStart(2, '0')} · Core Service
              </p>
              <h3 className="mt-2 font-display text-2xl sm:text-3xl font-extrabold tracking-tight leading-[1.08] text-[#171717]">
                {service.title}
              </h3>
              <p className="mt-3 text-sm sm:text-base leading-relaxed text-[#171717]/75">
                {service.shortDescription}
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <a
                  href={withBase('/contact')}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('/contact', service.title);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FF6500] hover:bg-[#E05800] text-[#171717] text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  <span>Request a Quote</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </a>
                {showDetailsLink && (
                  <a
                    href={withBase('/services')}
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate('/services');
                    }}
                    className="text-xs font-bold uppercase tracking-wider text-[#171717] underline decoration-[#FF6500] decoration-2 underline-offset-4 hover:text-[#FF6500] transition-colors"
                  >
                    Service Details
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Progress bar along the bottom */}
        <div className="absolute left-0 right-0 bottom-0 h-1 bg-[#EAD8C8]/60" aria-hidden="true">
          <span ref={barRef} className="block h-full bg-[#FF6500] origin-left" style={{ transform: 'scaleX(0)' }} />
        </div>

        {/* Scroll hint, fades out once the visitor starts scrolling */}
        <div
          ref={hintRef}
          aria-hidden="true"
          className="absolute right-6 sm:right-10 bottom-[8%] hidden sm:flex items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-[#171717]/60 animate-bounce"
        >
          Scroll
          <ChevronDown className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  );
}
