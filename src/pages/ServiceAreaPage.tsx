import { ArrowRight, CheckCircle2, MapPin } from 'lucide-react';
import { COMPANY_FACTS, COVERAGE_ZONES, RoutePath, SITE_IMAGES } from '../utils/companyData';
import { OrangeAccentLine, RevealSection, SlideUpHeadline } from '../components/MotionPrimitives';
import { SafeImage } from '../components/SafeImage';
import { SEOHead } from '../components/SEOHead';
import { TexasCoverageMap } from '../components/TexasCoverageMap';

interface ServiceAreaPageProps {
  onNavigate: (path: RoutePath) => void;
}

export function ServiceAreaPage({ onNavigate }: ServiceAreaPageProps) {
  return (
    <>
      <SEOHead
        title="Service Area | Skylark Star Logistics, LLC – La Porte & Houston, TX"
        description="Explore Skylark Star Logistics service coverage in La Porte, TX 77571, Greater Houston, and broader Texas regions subject to confirmed coverage."
        canonicalPath="/service-area"
      />

      {/* Editorial Hero */}
      <section data-snap-section data-snap-label="Service Area" className="bg-[#FFF5EB] text-[#171717] pt-28 sm:pt-36 pb-14 lg:pb-20 border-b border-[#EAD8C8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-10 items-center">
            <div className="md:col-span-7">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#FF6500]">
                Service Area · La Porte, Texas 77571
              </p>
              <SlideUpHeadline
                as="h1"
                className="mt-4 font-display text-3xl sm:text-5xl md:text-[2.5rem] lg:text-6xl font-extrabold tracking-tight text-[#171717] leading-[1.08] text-balance"
              >
                Connecting Businesses Across Texas.
              </SlideUpHeadline>
              <OrangeAccentLine className="w-20 h-1.5 rounded-full bg-[#FF6500] my-6" />
              <p className="text-base sm:text-lg text-[#171717]/80 max-w-2xl leading-relaxed">
                Centered in La Porte, Texas, we coordinate transportation and logistics inquiries
                across the Greater Houston metropolitan area and additional Texas locations subject
                to confirmed operating coverage.
              </p>
            </div>

            <div className="md:col-span-5">
              <div className="rounded-3xl overflow-hidden border border-[#EAD8C8] aspect-[16/10] bg-[#171717]">
                <SafeImage
                  src={SITE_IMAGES.texasFreightHub}
                  alt="Texas freight distribution corridor near La Porte and Houston"
                  loading="eager"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Texas Map */}
      <section data-snap-section data-snap-label="Interactive Texas Map" className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealSection>
            <TexasCoverageMap />
          </RevealSection>
        </div>
      </section>

      {/* Location Highlights */}
      <section data-snap-section data-snap-label="Regional Highlights" className="py-16 lg:py-24 bg-[#FFF5EB] border-t border-[#EAD8C8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-[#FF6500]">
              Regional Highlights
            </p>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl font-extrabold text-[#171717]">
              Focused Coverage Without Overstatement
            </h2>
            <p className="mt-3 text-base text-[#171717]/75">
              {COMPANY_FACTS.registrationStatusNote} Every lane inquiry is confirmed individually
              before dispatch.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {COVERAGE_ZONES.map((zone, idx) => {
              const isOrange = idx === 0;
              return (
                <RevealSection key={zone.id} delay={idx * 0.08}>
                  <div
                    className={`h-full rounded-3xl p-8 flex flex-col justify-between ${
                      isOrange
                        ? 'bg-[#FF6500] text-[#171717]'
                        : 'bg-white border border-[#EAD8C8] text-[#171717]'
                    }`}
                  >
                    <div>
                      <div
                        className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider ${
                          isOrange ? 'text-[#171717]/80' : 'text-[#FF6500]'
                        }`}
                      >
                        <MapPin className="w-4 h-4 shrink-0 text-[#171717]" aria-hidden="true" />
                        <span>{zone.statusLabel}</span>
                      </div>
                      <h3 className="mt-3 font-display text-2xl font-extrabold text-[#171717]">
                        {zone.name}
                      </h3>
                      <div
                        className={`w-12 h-1 rounded-full my-5 ${
                          isOrange ? 'bg-[#171717]' : 'bg-[#FF6500]'
                        }`}
                        aria-hidden="true"
                      />
                      <p className="text-sm text-[#171717]/85 leading-relaxed">{zone.summary}</p>
                      <ul className="mt-5 space-y-2.5">
                        {zone.details.map((detail) => (
                          <li
                            key={detail}
                            className="flex items-start gap-2.5 text-sm text-[#171717]/85"
                          >
                            <CheckCircle2
                              className="w-4 h-4 text-[#171717] mt-0.5 shrink-0"
                              aria-hidden="true"
                            />
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </RevealSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section data-snap-section data-snap-label="Request a Quote" className="py-16 bg-white border-t border-[#EAD8C8]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-[2rem] bg-[#171717] text-[#FFF5EB] p-8 sm:p-12 text-center">
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold">
              Need Freight Support in La Porte or Greater Houston?
            </h2>
            <p className="mt-3 text-base text-[#FFF5EB]/80 max-w-2xl mx-auto">
              Submit your origin, destination, and freight details to verify coverage and schedule
              availability.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <a
                href="/contact"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('/contact');
                }}
                className="inline-flex items-center gap-2 px-7 py-4 rounded-xl bg-[#FF6500] hover:bg-[#E05800] text-[#171717] text-xs font-bold uppercase tracking-wider transition-colors"
              >
                <span>REQUEST A QUOTE</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
