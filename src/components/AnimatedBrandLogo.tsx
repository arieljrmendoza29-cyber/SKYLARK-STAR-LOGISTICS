import { motion, useReducedMotion } from 'motion/react';
import { COMPANY_FACTS } from '../utils/companyData';

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function AnimatedBrandLogo({ className = '' }: { className?: string }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      className={`relative overflow-hidden rounded-3xl bg-white border border-[#EAD8C8] shadow-sm px-6 py-7 sm:px-9 sm:py-8 ${className}`}
      aria-label="Skylark Star Logistics, LLC official brand logo"
    >
      {/* Subtle sheen finishing animation */}
      {!shouldReduceMotion && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-[#FF6500]/10 to-transparent animate-route-sheen z-10"
        />
      )}

      {/* Official Navy & Gold Transparent Logo */}
      <motion.div
        initial={shouldReduceMotion ? { opacity: 1, x: 0, scale: 1 } : { opacity: 0, x: -14, scale: 0.97 }}
        whileInView={{ opacity: 1, x: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7, ease: EASE_OUT }}
        className="relative flex items-center justify-center"
      >
        <img
          src={COMPANY_FACTS.logoPath}
          alt="Skylark Star Logistics, LLC official logo"
          className="w-full max-w-[380px] h-auto object-contain"
          referrerPolicy="no-referrer"
        />
      </motion.div>

      {/* Road-inspired vibrant orange motion line drawing left-to-right */}
      <div className="mt-6 flex items-center gap-3" aria-hidden="true">
        <motion.span
          initial={shouldReduceMotion ? { scaleX: 1 } : { scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.75, delay: 0.25, ease: EASE_OUT }}
          className="h-[3px] flex-1 rounded-full bg-gradient-to-r from-[#FF6500]/25 via-[#FF6500] to-[#FF6500]/25 origin-left"
        />
      </div>
    </div>
  );
}
