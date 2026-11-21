import { ArrowLeft } from 'lucide-react';
import { COMPANY_FACTS, RoutePath } from '../utils/companyData';
import { SEOHead } from '../components/SEOHead';

interface LegalPageProps {
  mode: 'privacy' | 'terms';
  onNavigate: (path: RoutePath) => void;
}

export function LegalPage({ mode, onNavigate }: LegalPageProps) {
  const isPrivacy = mode === 'privacy';

  return (
    <>
      <SEOHead
        title={
          isPrivacy
            ? 'Privacy Policy | Skylark Star Logistics, LLC'
            : 'Terms and Conditions | Skylark Star Logistics, LLC'
        }
        description={
          isPrivacy
            ? 'Privacy notice for quote inquiries and business communications with Skylark Star Logistics, LLC.'
            : 'Website terms and conditions for Skylark Star Logistics, LLC.'
        }
        canonicalPath={isPrivacy ? '/privacy-policy' : '/terms-and-conditions'}
      />

      <section className="bg-[#FFF5EB] text-[#171717] pt-32 sm:pt-36 pb-14 border-b border-[#EAD8C8]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-widest text-[#FF6500]">
            Legal Information
          </p>
          <h1 className="mt-3 font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-[#171717]">
            {isPrivacy ? 'Privacy Policy' : 'Terms and Conditions'}
          </h1>
          <p className="mt-3 text-sm text-[#171717]/75">
            {COMPANY_FACTS.legalName} · {COMPANY_FACTS.locationDisplay}
          </p>
        </div>
      </section>

      <section className="py-14 lg:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-sm sm:text-base text-[#171717]/80 leading-relaxed">
          {isPrivacy ? (
            <>
              <div>
                <h2 className="font-display text-xl font-extrabold text-[#171717] mb-2">
                  1. Information Collected Through Quote Inquiries
                </h2>
                <p>
                  When you submit a freight quote request on the {COMPANY_FACTS.legalName} website,
                  we collect only the contact and shipment details you voluntarily provide—such as
                  your name, company name, email address, phone number, pickup location, delivery
                  destination, service selection, preferred pickup date, and freight description.
                </p>
              </div>
              <div>
                <h2 className="font-display text-xl font-extrabold text-[#171717] mb-2">
                  2. Purpose of Use
                </h2>
                <p>
                  Submitted details are used solely to evaluate freight requirements, confirm
                  operating coverage and scheduling availability, and respond to your business
                  inquiry. We do not sell or rent contact information to third-party marketers.
                </p>
              </div>
              <div>
                <h2 className="font-display text-xl font-extrabold text-[#171717] mb-2">
                  3. Data Handling &amp; Questions
                </h2>
                <p>
                  Automated form delivery is only active once authorized client email or CRM
                  credentials are connected. For privacy inquiries regarding {COMPANY_FACTS.legalName},
                  please reach out through our official contact channels once published, or write to
                  management in {COMPANY_FACTS.locationDisplay}.
                </p>
              </div>
            </>
          ) : (
            <>
              <div>
                <h2 className="font-display text-xl font-extrabold text-[#171717] mb-2">
                  1. Website Purpose &amp; Informational Scope
                </h2>
                <p>
                  This website provides corporate and service overview information for{' '}
                  {COMPANY_FACTS.legalName}, managed by {COMPANY_FACTS.managerName}. Submitting a
                  quote request does not create a binding carrier agreement, rate guarantee, or
                  dispatch commitment until confirmed in writing.
                </p>
              </div>
              <div>
                <h2 className="font-display text-xl font-extrabold text-[#171717] mb-2">
                  2. Operating Registration &amp; Coverage
                </h2>
                <p>
                  {COMPANY_FACTS.registrationStatusNote} Any transportation, logistics, freight
                  handling, or delivery service request is subject to confirmed operating coverage,
                  lane availability, and mutual written agreement.
                </p>
              </div>
              <div>
                <h2 className="font-display text-xl font-extrabold text-[#171717] mb-2">
                  3. Intellectual Property
                </h2>
                <p>
                  The Skylark Star Logistics name, brand logo, and website content are the property
                  of {COMPANY_FACTS.legalName}. Unauthorized reproduction or commercial misuse is
                  prohibited.
                </p>
              </div>
            </>
          )}

          <div className="pt-6 border-t border-[#EAD8C8]">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('/');
              }}
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#171717] hover:text-[#FF6500] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              <span>Return to Home</span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
