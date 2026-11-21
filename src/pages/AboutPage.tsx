import { ArrowRight, Building2, CheckCircle2, MapPin, Shield, UserCheck } from 'lucide-react';
import { COMPANY_FACTS, RoutePath, SITE_IMAGES } from '../utils/companyData';
import { AnimatedBrandLogo } from '../components/AnimatedBrandLogo';
import { OrangeAccentLine, RevealSection, SlideUpHeadline } from '../components/MotionPrimitives';
import { SafeImage } from '../components/SafeImage';
import { SEOHead } from '../components/SEOHead';

interface AboutPageProps {
  onNavigate: (path: RoutePath) => void;
}

const COMPANY_VALUES = [
  {
    title: 'Accountability',
    description:
      'Every freight inquiry and scheduled movement receives direct ownership and honest communication.',
  },
  {
    title: 'Reliability',
    description:
      'We build schedules around realistic transit plans so commercial clients can count on steady follow-through.',
  },
  {
    title: 'Cargo Stewardship',
    description:
      'Careful freight handling and organized loading procedures protect goods from origin to destination.',
  },
  {
    title: 'Transparency',
    description:
      'Clear business standing, straightforward quoting, and accurate operational expectations from day one.',
  },
];

const GALLERY_ITEMS = [
  {
    src: SITE_IMAGES.heroCargoTruck,
    alt: 'Commercial semi-truck hauling a vibrant orange container on a Texas highway',
    caption: 'Highway Freight Transportation',
  },
  {
    src: SITE_IMAGES.logistics,
    alt: 'Logistics operations and route planning center',
    caption: 'Dispatch & Logistics Coordination',
  },
  {
    src: SITE_IMAGES.freightHandling,
    alt: 'Clean freight warehouse floor with wrapped commercial pallets',
    caption: 'Orderly Freight Handling',
  },
  {
    src: SITE_IMAGES.delivery,
    alt: 'Commercial delivery truck positioned at a business distribution bay',
    caption: 'Scheduled Dock Delivery',
  },
];

export function AboutPage({ onNavigate }: AboutPageProps) {
  return (
    <>
      <SEOHead
        title="About Us | Skylark Star Logistics, LLC – La Porte, Texas"
        description="Learn about Skylark Star Logistics, LLC, established in 2022 and led by James Johnson in La Porte, Texas."
        canonicalPath="/about"
      />

      {/* Editorial Hero */}
      <section data-snap-section data-snap-label="About Overview" className="bg-[#FFF5EB] text-[#171717] pt-28 sm:pt-36 pb-14 lg:pb-20 border-b border-[#EAD8C8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-10 items-center">
            <div className="md:col-span-7">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#FF6500]">
                About Our Company · Established 2022
              </p>
              <SlideUpHeadline
                as="h1"
                className="mt-4 font-display text-3xl sm:text-5xl md:text-[2.5rem] lg:text-6xl font-extrabold tracking-tight text-[#171717] leading-[1.08] text-balance"
              >
                Built on Reliability. Driven by Purpose.
              </SlideUpHeadline>
              <OrangeAccentLine className="w-20 h-1.5 rounded-full bg-[#FF6500] my-6" />
              <p className="text-base sm:text-lg text-[#171717]/80 max-w-2xl leading-relaxed">
                Skylark Star Logistics, LLC is dedicated to dependable transportation, thoughtful
                logistics coordination, and attentive customer service for commercial shippers.
              </p>
            </div>

            <div className="md:col-span-5">
              <AnimatedBrandLogo />
            </div>
          </div>
        </div>
      </section>

      {/* Company Background & Registration Transparency */}
      <section data-snap-section data-snap-label="Background & Leadership" className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-7">
              <p className="text-xs font-bold uppercase tracking-widest text-[#FF6500]">
                Company Background
              </p>
              <h2 className="mt-2 font-display text-3xl sm:text-4xl font-extrabold text-[#171717] tracking-tight">
                Structured for Dependable Commercial Service
              </h2>
              <div className="w-14 h-1 rounded-full bg-[#FF6500] my-5" aria-hidden="true" />

              <div className="space-y-4 text-base text-[#171717]/80 leading-relaxed">
                <p>
                  Skylark Star Logistics, LLC was established in 2022 as a Colorado limited
                  liability company with a clear purpose: to provide businesses with dependable
                  freight transportation, logistics coordination, cargo handling, and delivery
                  support.
                </p>
                <p>
                  From our operations base in La Porte, Texas (77571), we serve businesses across
                  the Greater Houston corridor while completing our formal registration to operate in
                  the State of Texas. We believe trust starts with accuracy—so we communicate our
                  standing, operating status, and route availability clearly at every stage.
                </p>
              </div>

              {/* Mission Block */}
              <div className="mt-8 p-7 sm:p-9 rounded-3xl bg-[#FF6500] text-[#171717]">
                <p className="text-xs font-bold uppercase tracking-widest text-[#171717]/80">
                  Our Mission
                </p>
                <blockquote className="mt-3 font-display text-lg sm:text-xl font-bold leading-snug">
                  &ldquo;{COMPANY_FACTS.missionStatement}&rdquo;
                </blockquote>
              </div>
            </div>

            {/* Verified Leadership Card */}
            <div className="lg:col-span-5 space-y-6">
              <RevealSection>
                <div className="rounded-3xl bg-[#171717] text-[#FFF5EB] p-7 sm:p-9">
                  <div className="flex items-center gap-3 text-[#FF6500]">
                    <UserCheck className="w-5 h-5" aria-hidden="true" />
                    <span className="text-xs font-bold uppercase tracking-widest">Leadership</span>
                  </div>
                  <h3 className="mt-4 font-display text-2xl sm:text-3xl font-extrabold text-[#FFF5EB]">
                    {COMPANY_FACTS.managerName}
                  </h3>
                  <p className="text-sm font-semibold text-[#FF6500]">
                    {COMPANY_FACTS.managerTitle}
                  </p>
                  <div className="w-12 h-1 rounded-full bg-[#FF6500] my-5" aria-hidden="true" />
                  <p className="text-sm text-[#FFF5EB]/80 leading-relaxed">
                    James Johnson leads Skylark Star Logistics, LLC with hands-on oversight across
                    dispatch coordination, client communication, and operational standards.
                  </p>

                  <div className="mt-6 pt-5 border-t border-white/10 space-y-3 text-sm text-[#FFF5EB]/85">
                    <div className="flex items-start gap-3">
                      <Building2 className="w-4 h-4 text-[#FF6500] mt-0.5 shrink-0" aria-hidden="true" />
                      <span>
                        Established 2022 (Colorado LLC) · Currently registering to operate in Texas
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-[#FF6500] mt-0.5 shrink-0" aria-hidden="true" />
                      <span>{COMPANY_FACTS.locationDisplay}</span>
                    </div>
                  </div>
                </div>
              </RevealSection>
            </div>
          </div>
        </div>
      </section>

      {/* Company Values */}
      <section data-snap-section data-snap-label="Core Principles" className="py-16 lg:py-20 bg-[#FFF5EB] border-y border-[#EAD8C8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-widest text-[#FF6500]">
              Core Principles
            </p>
            <SlideUpHeadline className="mt-2 font-display text-3xl sm:text-4xl font-extrabold text-[#171717]">
              Values That Guide Every Shipment
            </SlideUpHeadline>
          </div>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {COMPANY_VALUES.map((val, idx) => (
              <RevealSection key={val.title} delay={idx * 0.08}>
                <div className="h-full bg-white rounded-3xl border border-[#EAD8C8] p-7">
                  <Shield className="w-5 h-5 text-[#171717] mb-5" strokeWidth={2} aria-hidden="true" />
                  <h3 className="font-display text-lg font-extrabold text-[#171717]">{val.title}</h3>
                  <p className="mt-2.5 text-sm text-[#171717]/75 leading-relaxed">
                    {val.description}
                  </p>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* Logistics Photography Gallery */}
      <section data-snap-section data-snap-label="Operations Gallery" className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#FF6500]">
                Operations Gallery
              </p>
              <h2 className="mt-2 font-display text-3xl sm:text-4xl font-extrabold text-[#171717]">
                Freight, Coordination &amp; Delivery Focus
              </h2>
            </div>
            <a
              href="/contact"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('/contact');
              }}
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#171717] hover:text-[#FF6500] transition-colors"
            >
              <span>Connect With Our Team</span>
              <ArrowRight className="w-4 h-4 text-[#FF6500]" aria-hidden="true" />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {GALLERY_ITEMS.map((item, idx) => (
              <RevealSection key={item.caption} delay={idx * 0.07}>
                <figure className="group rounded-3xl overflow-hidden border border-[#EAD8C8] bg-[#FFF5EB]">
                  <div className="aspect-[4/3] overflow-hidden bg-[#171717]">
                    <SafeImage
                      src={item.src}
                      alt={item.alt}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <figcaption className="px-5 py-4 text-sm font-bold text-[#171717] flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#FF6500] shrink-0" aria-hidden="true" />
                    <span>{item.caption}</span>
                  </figcaption>
                </figure>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
