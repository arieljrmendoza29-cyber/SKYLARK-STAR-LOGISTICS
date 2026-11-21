import { ReactNode, useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';

const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function RevealSection({
  children,
  className = '',
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.55, delay, ease: EASE_OUT_EXPO }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function SlideUpHeadline({
  children,
  className = '',
  delay = 0,
  as = 'h2',
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: 'h1' | 'h2' | 'h3';
}) {
  const shouldReduceMotion = useReducedMotion();
  const Tag = motion[as];

  if (shouldReduceMotion) {
    const StaticTag = as;
    return <StaticTag className={className}>{children}</StaticTag>;
  }

  return (
    <Tag
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6, delay, ease: EASE_OUT_EXPO }}
      className={className}
    >
      {children}
    </Tag>
  );
}

export function LetterByLetterText({
  text,
  className = '',
  delay = 0,
  stagger = 0.015,
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
}) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <span className={className}>{text}</span>;
  }

  const words = text.split(' ');
  let charCursor = 0;

  return (
    <span className={className} aria-label={text}>
      {words.map((word, wordIdx) => {
        const wordStart = charCursor;
        charCursor += word.length + 1;
        return (
          <span key={`${wordIdx}-${word}`} className="inline-block whitespace-nowrap">
            {word.split('').map((char, charIdx) => (
              <motion.span
                key={`${wordIdx}-${charIdx}-${char}`}
                aria-hidden="true"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.24,
                  delay: delay + (wordStart + charIdx) * stagger,
                  ease: EASE_OUT_EXPO,
                }}
                className="inline-block"
              >
                {char}
              </motion.span>
            ))}
            {wordIdx < words.length - 1 ? '\u00A0' : ''}
          </span>
        );
      })}
    </span>
  );
}

export function OrangeAccentLine({
  className = 'w-16 h-1 bg-[#FF6500] rounded-full',
  delay = 0.1,
}: {
  className?: string;
  delay?: number;
}) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className} aria-hidden="true" />;
  }

  return (
    <motion.div
      aria-hidden="true"
      initial={{ scaleX: 0, originX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.65, delay, ease: EASE_OUT_EXPO }}
      className={className}
    />
  );
}

export function AnimatedYearCounter({
  targetYear,
  startYear = 2015,
}: {
  targetYear: number;
  startYear?: number;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const shouldReduceMotion = useReducedMotion();
  const [displayValue, setDisplayValue] = useState(shouldReduceMotion ? targetYear : startYear);

  useEffect(() => {
    if (shouldReduceMotion) {
      setDisplayValue(targetYear);
      return;
    }
    if (!isInView) return;

    let frameId = 0;
    const duration = 900;
    const startTime = performance.now();

    const step = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startYear + (targetYear - startYear) * eased);
      setDisplayValue(current);
      if (progress < 1) {
        frameId = requestAnimationFrame(step);
      }
    };

    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [isInView, shouldReduceMotion, startYear, targetYear]);

  return (
    <span ref={ref} className="tabular-nums font-mono">
      {displayValue}
    </span>
  );
}

/**
 * Counts up from `from` to `value` once the number scrolls into view.
 * Screen readers get the final value straight away.
 */
export function AnimatedCounter({
  value,
  from = 0,
  suffix = '',
  durationMs = 1400,
  className = '',
}: {
  value: number;
  from?: number;
  suffix?: string;
  durationMs?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const isInView = useInView(ref, { once: true, amount: 0.6 });
  const shouldReduceMotion = useReducedMotion();
  const [displayValue, setDisplayValue] = useState(shouldReduceMotion ? value : from);

  useEffect(() => {
    if (shouldReduceMotion) {
      setDisplayValue(value);
      return;
    }
    if (!isInView) return;

    let frameId = 0;
    const startTime = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - startTime) / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setDisplayValue(Math.round(from + (value - from) * eased));
      if (progress < 1) frameId = requestAnimationFrame(step);
    };
    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [isInView, shouldReduceMotion, from, value, durationMs]);

  return (
    <span ref={ref} className={className}>
      <span aria-hidden="true" className="tabular-nums">
        {displayValue}
        {suffix}
      </span>
      <span className="sr-only">
        {value}
        {suffix}
      </span>
    </span>
  );
}

export function FloatingCargoGraphic({ className = '' }: { className?: string }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      aria-hidden="true"
      animate={shouldReduceMotion ? undefined : { y: [0, -8, 0] }}
      transition={
        shouldReduceMotion
          ? undefined
          : { duration: 4.5, repeat: Infinity, ease: 'easeInOut' }
      }
      className={className}
    >
      <svg
        viewBox="0 0 180 110"
        fill="none"
        className="w-full h-auto drop-shadow-sm"
      >
        {/* Minimalist Isometric/Architectural Cargo Container Illustration */}
        <rect
          x="10"
          y="22"
          width="160"
          height="74"
          rx="12"
          fill="#FF6500"
          stroke="#171717"
          strokeWidth="2.5"
        />
        {/* Corrugated ribs */}
        <g stroke="#171717" strokeOpacity="0.22" strokeWidth="2.5" strokeLinecap="round">
          <line x1="34" y1="34" x2="34" y2="84" />
          <line x1="54" y1="34" x2="54" y2="84" />
          <line x1="74" y1="34" x2="74" y2="84" />
          <line x1="94" y1="34" x2="94" y2="84" />
          <line x1="114" y1="34" x2="114" y2="84" />
          <line x1="134" y1="34" x2="134" y2="84" />
          <line x1="154" y1="34" x2="154" y2="84" />
        </g>
        {/* Top corner rigging latches */}
        <rect x="20" y="12" width="16" height="10" rx="3" fill="#171717" />
        <rect x="144" y="12" width="16" height="10" rx="3" fill="#171717" />
        {/* Route stripe */}
        <line x1="22" y1="59" x2="158" y2="59" stroke="#FFF5EB" strokeWidth="3" strokeDasharray="8 6" />
      </svg>
    </motion.div>
  );
}
