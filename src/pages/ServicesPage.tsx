import { ArrowRight, CheckCircle2, Compass, Navigation, PackageCheck, Truck } from 'lucide-react';
import { CORE_SERVICES, RoutePath, SITE_IMAGES } from '../utils/companyData';
import { OrangeAccentLine, RevealSection, SlideUpHeadline } from '../components/MotionPrimitives';
import { SafeImage } from '../components/SafeImage';
import { SEOHead } from '../components/SEOHead';
import { withBase } from '../utils/basePath';
import { TiltFrame } from '../components/TiltFrame';

interface ServicesPageProps {
  onNavigate: (path: RoutePath, servicePreselect?: string) => void;
}

const SERVICE_ICONS = {
  Truck,
  Compass,
  PackageCheck,
  Navigation,
};

export function ServicesPage({ onNavigate }: ServicesPageProps) {
  return (
    <>
      <SEOHead
        title="Services | Skylark Star Logistics, LLC – Transportation & Freight Handling"
        description="Explore Transportation Services, Logistics Solutions, Freight Handling, and Delivery Services in La Porte and Houston, TX."
        canonicalPath="/services"
      />

      {/* Editorial Page Header */}
      <section data-snap-section data-snap-label="Services Overview" className="bg-[#FFF5EB] text-[#171717] pt-28 sm:pt-36 pb-14 lg:pb-20 border-b border-[#EAD8C8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-10 items-center">
            <div className="md:col-span-7">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#FF6500]">
                Our Services · La Porte &amp; Greater Houston, TX
              </p>
              <SlideUpHeadline
                as="h1"
                className="mt-4 font-display text-3xl sm:text-5xl md:text-[2.5rem] lg:text-6xl font-extrabold tracking-tight text-[#171717] leading-[1.08] text-balance"
              >
                Transportation &amp; Logistics Solutions You Can Count On.
              </SlideUpHeadline>
              <OrangeAccentLine className="w-20 h-1.5 rounded-full bg-[#FF6500] my-6" />
              <p className="text-base sm:text-lg text-[#171717]/80 max-w-2xl leading-relaxed">
                Skylark Star Logistics delivers straightforward freight transportation, dispatch
                coordination, cargo handling, and commercial delivery support.
              </p>
            </div>

            <div className="md:col-span-5">
              <TiltFrame className="rounded-3xl overflow-hidden border border-[#EAD8C8] aspect-[4/3] bg-[#171717]">
                <SafeImage
                  src={SITE_IMAGES.heroCargoTruck}
                  alt="Commercial semi-truck hauling a cargo container on an open Texas highway"
                  loading="eager"
                  className="w-full h-full object-cover"
                />
              </TiltFrame>
            </div>
          </div>
        </div>
      </section>

      {/* Four Detailed Service Sections */}
      <section data-snap-section data-snap-label="Capabilities" className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 lg:space-y-28">
          {CORE_SERVICES.map((service, index) => {
            const Icon = SERVICE_ICONS[service.iconName];
            const isReversed = index % 2 === 1;
            const isOrangeAccent = index === 1 || index === 3;

            return (
              <RevealSection key={service.id}>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-14 items-center">
                  <div className={`md:col-span-6 ${isReversed ? 'md:order-2' : ''}`}>
                    <TiltFrame className="aspect-[4/3] rounded-3xl overflow-hidden border border-[#EAD8C8] bg-[#171717]">
                      <SafeImage
                        src={service.image}
                        alt={service.imageAlt}
                        className="w-full h-full object-cover"
                      />
                    </TiltFrame>
                  </div>

                  <div
                    className={`md:col-span-6 rounded-3xl p-7 sm:p-10 ${
                      isOrangeAccent
                        ? 'bg-[#FF6500] text-[#171717]'
                        : 'bg-[#FFF5EB] text-[#171717] border border-[#EAD8C8]'
                    } ${isReversed ? 'md:order-1' : ''}`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span
                        className={`font-mono text-xs font-bold tracking-widest uppercase ${
                          isOrangeAccent ? 'text-[#171717]/80' : 'text-[#FF6500]'
                        }`}
                      >
                        Service {service.number}
                      </span>
                      <div className="w-11 h-11 rounded-2xl bg-white flex items-center justify-center border border-[#EAD8C8]/60">
                        <Icon className="w-5 h-5 text-[#171717]" strokeWidth={2} aria-hidden="true" />
                      </div>
                    </div>

                    <h2 className="mt-4 font-display text-2xl sm:text-3xl font-extrabold text-[#171717] tracking-tight">
                      {service.title}
                    </h2>

                    <div
                      className={`w-14 h-1 rounded-full my-5 ${
                        isOrangeAccent ? 'bg-[#171717]' : 'bg-[#FF6500]'
                      }`}
                      aria-hidden="true"
                    />

                    <p
                      className={`text-base leading-relaxed ${
                        isOrangeAccent ? 'text-[#171717]/90' : 'text-[#171717]/80'
                      }`}
                    >
                      {service.detailedDescription}
                    </p>

                    <ul className="mt-6 space-y-3">
                      {service.highlights.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-3 text-sm text-[#171717]/90"
                        >
                          <CheckCircle2
                            className="w-4 h-4 text-[#171717] mt-0.5 shrink-0"
                            aria-hidden="true"
                          />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-8">
                      <a
                        href={withBase('/contact')}
                        onClick={(e) => {
                          e.preventDefault();
                          onNavigate('/contact', service.title);
                        }}
                        className={`inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${
                          isOrangeAccent
                            ? 'bg-[#171717] hover:bg-[#2A2A2A] text-[#FFF5EB]'
                            : 'bg-[#FF6500] hover:bg-[#E05800] text-[#171717]'
                        }`}
                      >
                        <span>Request a Quote</span>
                        <ArrowRight className="w-4 h-4" aria-hidden="true" />
                      </a>
                    </div>
                  </div>
                </div>
              </RevealSection>
            );
          })}
        </div>
      </section>

      {/* Orange CTA Banner */}
      <section data-snap-section data-snap-label="Request a Quote" className="py-16 bg-[#FFF5EB] border-t border-[#EAD8C8]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-[2rem] bg-[#FF6500] text-[#171717] p-8 sm:p-12 text-center">
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold">
              Have Specific Shipment Requirements?
            </h2>
            <p className="mt-3 text-base text-[#171717]/85 max-w-2xl mx-auto">
              Share your pickup location, destination, and freight details to coordinate directly
              with our team.
            </p>
            <div className="mt-7">
              <a
                href={withBase('/contact')}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('/contact');
                }}
                className="inline-flex items-center gap-2 px-7 py-4 rounded-xl bg-[#171717] hover:bg-[#2A2A2A] text-[#FFF5EB] text-xs font-bold uppercase tracking-wider transition-colors"
              >
                <span>REQUEST A QUOTE</span>
                <ArrowRight className="w-4 h-4 text-[#FF6500]" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
