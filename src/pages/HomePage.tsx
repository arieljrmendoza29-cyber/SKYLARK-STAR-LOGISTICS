import {
  ArrowRight,
  Building2,
  Compass,
  MapPin,
  Navigation,
  PackageCheck,
  Truck,
  UserCheck,
} from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import {
  COMPANY_FACTS,
  CORE_SERVICES,
  RoutePath,
  SITE_IMAGES,
  WORKING_PROCESS_STEPS,
} from '../utils/companyData';
import { AnimatedBrandLogo } from '../components/AnimatedBrandLogo';
import { GrowingSpineTimeline } from '../components/GrowingSpineTimeline';
import { KineticServiceMarquee } from '../components/KineticServiceMarquee';
import { ParticleDriftBackground } from '../components/ParticleDriftBackground';
import {
  AnimatedYearCounter,
  FloatingCargoGraphic,
  LetterByLetterText,
  OrangeAccentLine,
  RevealSection,
  SlideUpHeadline,
} from '../components/MotionPrimitives';
import { SafeImage } from '../components/SafeImage';
import { SEOHead } from '../components/SEOHead';
import { TexasCoverageMap } from '../components/TexasCoverageMap';

interface HomePageProps {
  onNavigate: (path: RoutePath, servicePreselect?: string) => void;
}

const SERVICE_ICONS = {
  Truck,
  Compass,
  PackageCheck,
  Navigation,
};

export function HomePage({ onNavigate }: HomePageProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <>
      <SEOHead
        title="Skylark Star Logistics, LLC | Moving Freight. Delivering Reliability."
        description="Dependable transportation, logistics coordination, freight handling, and delivery services in La Porte and Houston, Texas. Established 2022."
        canonicalPath="/"
      />

      {/* 1. HERO SECTION — Particle Drift Warm Cream Gradient + Handshake Port Editorial Image */}
      <section data-snap-section data-snap-label="Hero" className="relative bg-[#FFF5EB] text-[#171717] pt-28 sm:pt-32 lg:pt-36 pb-14 sm:pb-20 lg:pb-24 overflow-hidden">
        <ParticleDriftBackground />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Oversized Editorial Headline & Primary Actions */}
            <div className="md:col-span-6 min-w-0">
              <p className="text-[11px] sm:text-xs font-bold tracking-[0.16em] uppercase text-[#FF6500] mb-3 sm:mb-4">
                <LetterByLetterText
                  text="LA PORTE, TEXAS · ESTABLISHED 2022"
                  stagger={0.012}
                />
              </p>

              <motion.h1
                initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
                className="font-display text-[2.2rem] sm:text-5xl md:text-[2.45rem] lg:text-[3.35rem] xl:text-[3.85rem] font-extrabold tracking-tight text-[#171717] leading-[1.1] text-balance"
              >
                Moving Freight.
                <br />
                <span className="text-[#FF6500]">Delivering</span> Reliability.
              </motion.h1>

              <OrangeAccentLine className="w-16 sm:w-20 h-1.5 rounded-full bg-[#FF6500] my-5 sm:my-6" delay={0.25} />

              <motion.p
                initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
                className="text-sm sm:text-base lg:text-lg text-[#171717]/80 leading-relaxed max-w-lg"
              >
                Dependable transportation, logistics coordination, freight handling, and delivery
                services built to keep commercial operations moving forward.
              </motion.p>

              <motion.div
                initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="mt-7 sm:mt-9 flex flex-wrap items-center gap-3 sm:gap-4"
              >
                <a
                  href="/contact"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('/contact');
                  }}
                  className="inline-flex items-center justify-center gap-2.5 px-5 sm:px-7 py-3.5 sm:py-4 rounded-xl bg-[#FF6500] hover:bg-[#E05800] text-[#171717] text-xs sm:text-sm font-bold tracking-wider uppercase shadow-sm transition-all duration-200 hover:-translate-y-0.5 whitespace-nowrap"
                >
                  <span>REQUEST A QUOTE</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </a>
                <a
                  href="/services"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('/services');
                  }}
                  className="inline-flex items-center justify-center px-5 sm:px-7 py-3.5 sm:py-4 rounded-xl bg-white border-2 border-[#171717] hover:bg-[#171717] text-[#171717] hover:text-[#FFF5EB] text-xs sm:text-sm font-bold tracking-wider uppercase transition-all duration-200 whitespace-nowrap"
                >
                  EXPLORE SERVICES
                </a>
              </motion.div>

              <p className="mt-5 sm:mt-7 text-xs font-medium text-[#171717]/65">
                {COMPANY_FACTS.registrationStatusNote}
              </p>
            </div>

            {/* Right Column: Port Freight Partnership Handshake & Container Yard */}
            <div className="md:col-span-6 min-w-0 relative">
              <motion.div
                initial={shouldReduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.75, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-[#EAD8C8] bg-[#171717] aspect-[4/3] shadow-lg"
              >
                <SafeImage
                  src={SITE_IMAGES.heroLogisticsHandshake}
                  alt="Logistics partners shaking hands at a commercial port corridor with stacked orange and navy freight containers, a semi-truck, and dockside cranes at golden hour"
                  loading="eager"
                  className="w-full h-full object-cover object-center"
                />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* 1B. KINETIC SERVICE MARQUEE — Positioned Immediately Under First Section */}
      <KineticServiceMarquee onSelectService={() => onNavigate('/services')} />

      {/* 2. INTRODUCTION TO SKYLARK STAR LOGISTICS */}
      <section data-snap-section data-snap-label="Introduction" className="py-16 sm:py-20 lg:py-24 bg-white border-y border-[#EAD8C8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="md:col-span-5">
              <AnimatedBrandLogo />
            </div>

            <div className="md:col-span-7 min-w-0">
              <p className="text-xs font-bold uppercase tracking-widest text-[#FF6500]">
                Introduction
              </p>
              <SlideUpHeadline className="mt-3 font-display text-3xl sm:text-4xl lg:text-[2.65rem] font-extrabold text-[#171717] leading-[1.08] tracking-tight text-balance">
                Your Logistics Partner. Your Business Advantage.
              </SlideUpHeadline>
              <OrangeAccentLine className="w-16 h-1 rounded-full bg-[#FF6500] my-6" />

              <RevealSection delay={0.1}>
                <p className="text-base sm:text-lg text-[#171717]/80 leading-relaxed">
                  Skylark Star Logistics, LLC was established in 2022 and operates from La Porte,
                  Texas (77571). Led by Manager and Owner James Johnson, our company delivers
                  straightforward transportation, logistics coordination, freight handling, and
                  commercial delivery services.
                </p>
                <p className="mt-4 text-base text-[#171717]/75 leading-relaxed">
                  Formed as a Colorado LLC and currently completing Texas operating registration,
                  we emphasize clear communication, careful cargo stewardship, and honest schedule
                  commitments on every shipment.
                </p>

                <div className="mt-8">
                  <a
                    href="/about"
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate('/about');
                    }}
                    className="inline-flex items-center gap-2.5 text-sm font-bold uppercase tracking-wider text-[#171717] hover:text-[#FF6500] transition-colors group"
                  >
                    <span>LEARN MORE ABOUT US</span>
                    <ArrowRight
                      className="w-4 h-4 text-[#FF6500] transition-transform duration-200 group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </a>
                </div>
              </RevealSection>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FOUR SERVICE CARDS — Orange & White Editorial Variations */}
      <section data-snap-section data-snap-label="Core Services" className="py-16 sm:py-20 lg:py-28 bg-[#FFF5EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end mb-12 lg:mb-14">
            <div className="md:col-span-7">
              <p className="text-xs font-bold uppercase tracking-widest text-[#FF6500]">
                Core Services
              </p>
              <SlideUpHeadline className="mt-3 font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#171717] leading-[1.08] tracking-tight text-balance">
                Focused Solutions for Commercial Freight.
              </SlideUpHeadline>
            </div>
            <div className="md:col-span-5">
              <p className="text-base text-[#171717]/75 leading-relaxed">
                Four core capabilities coordinated with direct accountability from pickup through
                final dock delivery.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-7 lg:gap-8">
            {CORE_SERVICES.map((service, index) => {
              const Icon = SERVICE_ICONS[service.iconName];
              // Editorial checkerboard rhythm: 0 & 3 Vibrant Orange, 1 & 2 Pure White
              const isOrangeCard = index === 0 || index === 3;

              return (
                <RevealSection key={service.id} delay={index * 0.08}>
                  <article
                    className={`group h-full rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 ${
                      isOrangeCard
                        ? 'bg-[#FF6500] text-[#171717]'
                        : 'bg-white text-[#171717] border border-[#EAD8C8]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-4 mb-6">
                        <span
                          className={`font-mono text-sm font-bold ${
                            isOrangeCard ? 'text-[#171717]/80' : 'text-[#FF6500]'
                          }`}
                        >
                          {service.number}
                        </span>
                        <div
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                            isOrangeCard ? 'bg-white/90' : 'bg-[#FFF5EB] border border-[#EAD8C8]'
                          }`}
                        >
                          <Icon
                            className="w-5 h-5 text-[#171717]"
                            strokeWidth={2}
                            aria-hidden="true"
                          />
                        </div>
                      </div>

                      <div className="aspect-[16/10] rounded-2xl overflow-hidden mb-6 bg-[#171717]">
                        <SafeImage
                          src={service.image}
                          alt={service.imageAlt}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>

                      <h3 className="font-display text-2xl sm:text-[1.65rem] font-extrabold tracking-tight text-[#171717]">
                        {service.title}
                      </h3>
                      <p
                        className={`mt-3 text-sm sm:text-base leading-relaxed ${
                          isOrangeCard ? 'text-[#171717]/90' : 'text-[#171717]/75'
                        }`}
                      >
                        {service.shortDescription}
                      </p>
                    </div>

                    <div
                      className={`mt-7 pt-5 border-t flex items-center justify-between ${
                        isOrangeCard ? 'border-[#171717]/15' : 'border-[#EAD8C8]'
                      }`}
                    >
                      <a
                        href="/services"
                        onClick={(e) => {
                          e.preventDefault();
                          onNavigate('/services');
                        }}
                        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#171717] group-hover:underline underline-offset-4"
                      >
                        <span>Explore Capability</span>
                        <ArrowRight
                          className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
                          aria-hidden="true"
                        />
                      </a>
                      <a
                        href="/contact"
                        onClick={(e) => {
                          e.preventDefault();
                          onNavigate('/contact', service.title);
                        }}
                        className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${
                          isOrangeCard
                            ? 'bg-[#171717] text-[#FFF5EB] hover:bg-[#2A2A2A]'
                            : 'bg-[#FF6500] text-[#171717] hover:bg-[#E05800]'
                        }`}
                      >
                        Quote
                      </a>
                    </div>
                  </article>
                </RevealSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. FOUR-STEP WORKING PROCESS — GSAP ScrollTrigger Growing Spine Timeline */}
      <section data-snap-section data-snap-label="Working Process" className="py-16 sm:py-20 lg:py-28 bg-white border-y border-[#EAD8C8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
            <div className="md:col-span-5 md:sticky md:top-24 lg:top-28 min-w-0">
              <p className="text-xs font-bold uppercase tracking-widest text-[#FF6500]">
                How It Works
              </p>
              <SlideUpHeadline className="mt-3 font-display text-3xl sm:text-4xl md:text-[2.1rem] lg:text-[2.75rem] font-extrabold text-[#171717] leading-[1.08] tracking-tight text-balance">
                Four Clear Steps From Quote to Delivery.
              </SlideUpHeadline>
              <OrangeAccentLine className="w-16 h-1 rounded-full bg-[#FF6500] my-6" />
              <p className="text-sm sm:text-base text-[#171717]/75 leading-relaxed max-w-lg">
                Every shipment follows an organized coordination process so commercial shippers know
                exactly what is confirmed before dispatch.
              </p>

              <RevealSection delay={0.1} className="mt-7 sm:mt-8">
                <div className="rounded-2xl sm:rounded-3xl overflow-hidden border border-[#EAD8C8] aspect-[16/10] bg-[#171717]">
                  <SafeImage
                    src={SITE_IMAGES.editorialContainers}
                    alt="Stacked white, orange, and charcoal cargo containers arranged cleanly at a freight terminal"
                    className="w-full h-full object-cover"
                  />
                </div>
              </RevealSection>
            </div>

            <div className="md:col-span-7 min-w-0">
              <GrowingSpineTimeline steps={WORKING_PROCESS_STEPS} />
            </div>
          </div>
        </div>
      </section>

      {/* 5. COMPANY BACKGROUND AND MISSION */}
      <section data-snap-section data-snap-label="Mission & Background" className="py-16 sm:py-20 lg:py-28 bg-[#171717] text-[#FFF5EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="md:col-span-6 min-w-0">
              <p className="text-xs font-bold uppercase tracking-widest text-[#FF6500]">
                Background &amp; Mission
              </p>
              <SlideUpHeadline className="mt-3 font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#FFF5EB] leading-[1.06] tracking-tight text-balance">
                Built on Honesty. Focused on Execution.
              </SlideUpHeadline>
              <OrangeAccentLine className="w-16 h-1 rounded-full bg-[#FF6500] my-6" />

              <RevealSection delay={0.1}>
                <p className="text-base text-[#FFF5EB]/80 leading-relaxed">
                  Founded in 2022 as a Colorado limited liability company and currently completing
                  registration to operate in Texas, Skylark Star Logistics, LLC anchors its
                  coordination in La Porte, Texas 77571.
                </p>

                <div className="mt-8 rounded-3xl bg-[#FF6500] text-[#171717] p-7 sm:p-8">
                  <p className="text-xs font-bold uppercase tracking-widest text-[#171717]/75">
                    Company Mission
                  </p>
                  <blockquote className="mt-3 font-display text-lg sm:text-xl font-bold leading-snug">
                    &ldquo;{COMPANY_FACTS.missionStatement}&rdquo;
                  </blockquote>
                </div>
              </RevealSection>
            </div>

            <RevealSection delay={0.15} className="md:col-span-6">
              <div className="rounded-3xl overflow-hidden border border-white/10 aspect-[16/10] bg-[#242424]">
                <SafeImage
                  src={SITE_IMAGES.texasFreightHub}
                  alt="Southeast Texas commercial freight hub with neatly staged white and orange trailers at golden hour"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="mt-4 text-xs text-[#FFF5EB]/65">
                Headquartered in La Porte, Texas · Managed directly by {COMPANY_FACTS.managerName},{' '}
                {COMPANY_FACTS.managerTitle}.
              </p>
            </RevealSection>
          </div>
        </div>
      </section>

      {/* 6. SERVICE AREA SECTION */}
      <section data-snap-section data-snap-label="Service Area" className="py-20 lg:py-28 bg-[#FFF5EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-widest text-[#FF6500]">
                Service Area
              </p>
              <SlideUpHeadline className="mt-3 font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#171717] leading-[1.06] tracking-tight text-balance">
                Serving Businesses Across Texas.
              </SlideUpHeadline>
              <p className="mt-3 text-base text-[#171717]/75 leading-relaxed">
                Centered in La Porte, Texas, supporting Greater Houston commercial corridors and
                additional Texas routes subject to confirmed operating coverage.
              </p>
            </div>

            <a
              href="/service-area"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('/service-area');
              }}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border-2 border-[#171717] text-[#171717] hover:bg-[#171717] hover:text-[#FFF5EB] text-xs font-bold uppercase tracking-wider transition-colors whitespace-nowrap shrink-0 self-start md:self-auto"
            >
              <span>VIEW COVERAGE DETAILS</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </a>
          </div>

          <RevealSection>
            <TexasCoverageMap />
          </RevealSection>
        </div>
      </section>

      {/* 7. BUSINESS CREDIBILITY AND VERIFIED COMPANY INFORMATION */}
      <section data-snap-section data-snap-label="Verified Credentials" aria-label="Verified Company Credentials" className="py-20 lg:py-24 bg-white border-y border-[#EAD8C8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-[#FF6500]">
              Verified Company Record
            </p>
            <SlideUpHeadline className="mt-3 font-display text-3xl sm:text-4xl font-extrabold text-[#171717] tracking-tight text-balance">
              Transparent Business Credentials.
            </SlideUpHeadline>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <RevealSection className="min-w-0 rounded-3xl bg-[#FFF5EB] border border-[#EAD8C8] p-7">
              <Building2 className="w-5 h-5 text-[#171717] mb-5" strokeWidth={2} aria-hidden="true" />
              <p className="text-xs font-bold uppercase tracking-widest text-[#FF6500]">
                Established
              </p>
              <p className="mt-2 font-display text-4xl font-extrabold text-[#171717]">
                <AnimatedYearCounter targetYear={COMPANY_FACTS.establishedYear} startYear={2015} />
              </p>
              <p className="mt-2 text-sm text-[#171717]/75">
                Colorado LLC · Registering to operate in Texas
              </p>
            </RevealSection>

            <RevealSection delay={0.08} className="min-w-0 rounded-3xl bg-[#FFF5EB] border border-[#EAD8C8] p-7">
              <MapPin className="w-5 h-5 text-[#171717] mb-5" strokeWidth={2} aria-hidden="true" />
              <p className="text-xs font-bold uppercase tracking-widest text-[#FF6500]">
                Headquarters
              </p>
              <p className="mt-2 font-display text-2xl font-extrabold text-[#171717]">
                La Porte, TX
              </p>
              <p className="mt-2 text-sm text-[#171717]/75 tabular-nums">
                ZIP 77571 · Greater Houston Corridor
              </p>
            </RevealSection>

            <RevealSection delay={0.16} className="min-w-0 rounded-3xl bg-[#FFF5EB] border border-[#EAD8C8] p-7">
              <UserCheck className="w-5 h-5 text-[#171717] mb-5" strokeWidth={2} aria-hidden="true" />
              <p className="text-xs font-bold uppercase tracking-widest text-[#FF6500]">
                Leadership
              </p>
              <p className="mt-2 font-display text-2xl font-extrabold text-[#171717]">
                {COMPANY_FACTS.managerName}
              </p>
              <p className="mt-2 text-sm text-[#171717]/75">{COMPANY_FACTS.managerTitle}</p>
            </RevealSection>

            <RevealSection delay={0.24} className="min-w-0 rounded-3xl bg-[#FFF5EB] border border-[#EAD8C8] p-7">
              <Truck className="w-5 h-5 text-[#171717] mb-5" strokeWidth={2} aria-hidden="true" />
              <p className="text-xs font-bold uppercase tracking-widest text-[#FF6500]">
                Industry Scope
              </p>
              <p className="mt-2 font-display text-2xl font-extrabold text-[#171717]">
                Freight &amp; Logistics
              </p>
              <p className="mt-2 text-sm text-[#171717]/75">
                Transportation · Handling · Delivery
              </p>
            </RevealSection>
          </div>
        </div>
      </section>

      {/* 8. LARGE ORANGE-ACCENTED CTA SECTION */}
      <section data-snap-section data-snap-label="Request a Quote" className="py-16 lg:py-24 bg-[#FFF5EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealSection>
            <div className="relative overflow-hidden rounded-[2rem] bg-[#FF6500] text-[#171717] px-6 py-14 sm:px-12 sm:py-16 lg:px-16 lg:py-20">
              {/* Subtle Architectural Route Lines */}
              <svg
                aria-hidden="true"
                viewBox="0 0 800 300"
                className="pointer-events-none absolute right-0 top-0 h-full w-1/2 opacity-15"
              >
                <path
                  d="M40 260 C 200 220, 340 90, 760 40"
                  fill="none"
                  stroke="#171717"
                  strokeWidth="3"
                />
                <path
                  d="M120 290 C 280 245, 420 130, 780 95"
                  fill="none"
                  stroke="#171717"
                  strokeWidth="2"
                  strokeDasharray="10 10"
                />
              </svg>

              {/* Subtle Floating Cargo Container Graphic */}
              <FloatingCargoGraphic className="hidden lg:block absolute right-12 bottom-10 w-44 pointer-events-none" />

              <div className="relative z-10 max-w-3xl">
                <p className="text-xs font-bold uppercase tracking-widest text-[#171717]/80">
                  Direct Freight Inquiries
                </p>
                <SlideUpHeadline className="mt-3 font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#171717] leading-[1.08] tracking-tight text-balance">
                  Let&apos;s Get Your Freight Moving.
                </SlideUpHeadline>
                <p className="mt-5 text-base sm:text-lg text-[#171717]/85 max-w-xl leading-relaxed">
                  Share your origin, destination, and freight details to review availability and
                  coordinate directly with Skylark Star Logistics.
                </p>

                <div className="mt-9 flex flex-wrap items-center gap-4">
                  <a
                    href="/contact"
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate('/contact');
                    }}
                    className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-[#171717] hover:bg-[#2A2A2A] text-[#FFF5EB] text-xs sm:text-sm font-bold tracking-wider uppercase shadow-sm transition-colors whitespace-nowrap"
                  >
                    <span>REQUEST A QUOTE</span>
                    <ArrowRight className="w-4 h-4 text-[#FF6500]" aria-hidden="true" />
                  </a>
                  <a
                    href="/contact"
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate('/contact');
                    }}
                    className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-white hover:bg-[#FFF5EB] text-[#171717] text-xs sm:text-sm font-bold tracking-wider uppercase transition-colors whitespace-nowrap"
                  >
                    CONTACT OUR TEAM
                  </a>
                </div>
              </div>
            </div>
          </RevealSection>
        </div>
      </section>
    </>
  );
}
