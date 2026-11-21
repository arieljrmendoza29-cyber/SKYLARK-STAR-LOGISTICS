import { Mail, MapPin, Phone } from 'lucide-react';
import { COMPANY_FACTS, CORE_SERVICES, NAV_ITEMS, RoutePath } from '../utils/companyData';
import { withBase } from '../utils/basePath';

interface FooterProps {
  onNavigate: (path: RoutePath) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const handleLink = (e: React.MouseEvent, path: RoutePath) => {
    e.preventDefault();
    onNavigate(path);
  };

  return (
    <footer className="bg-[#171717] text-[#FFF5EB] border-t border-[#EAD8C8]/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-4">
            <a
              href={withBase('/')}
              onClick={(e) => handleLink(e, '/')}
              className="inline-block mb-5 focus-visible:outline-2 focus-visible:outline-[#FF6500] rounded-xl"
              aria-label="Skylark Star Logistics, LLC Home"
            >
              <img
                src={COMPANY_FACTS.logoPath}
                alt="Skylark Star Logistics, LLC"
                className="h-12 w-auto object-contain"
                referrerPolicy="no-referrer"
              />
            </a>
            <p className="text-sm text-[#FFF5EB]/75 leading-relaxed max-w-xs">
              Dependable transportation, logistics coordination, freight handling, and delivery
              services based in La Porte, Texas.
            </p>
            <p className="mt-4 text-xs text-[#FF6500] font-semibold leading-relaxed">
              {COMPANY_FACTS.registrationStatusNote}
            </p>
          </div>

          {/* Navigation */}
          <div className="lg:col-span-2">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#FF6500] mb-4">
              Navigation
            </h2>
            <ul className="space-y-2.5 text-sm">
              {NAV_ITEMS.map((item) => (
                <li key={item.path}>
                  <a
                    href={withBase(item.path)}
                    onClick={(e) => handleLink(e, item.path)}
                    className="text-[#FFF5EB]/80 hover:text-[#FF6500] transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="lg:col-span-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#FF6500] mb-4">
              Services
            </h2>
            <ul className="space-y-2.5 text-sm">
              {CORE_SERVICES.map((service) => (
                <li key={service.id}>
                  <a
                    href={withBase('/services')}
                    onClick={(e) => handleLink(e, '/services')}
                    className="text-[#FFF5EB]/80 hover:text-[#FF6500] transition-colors"
                  >
                    {service.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Verified Contact Details */}
          <div className="lg:col-span-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#FF6500] mb-4">
              Location & Management
            </h2>
            <ul className="space-y-3.5 text-sm text-[#FFF5EB]/80">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#FF6500] mt-0.5 shrink-0" aria-hidden="true" />
                <span>{COMPANY_FACTS.locationDisplay}</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-[#FF6500] mt-0.5 shrink-0" aria-hidden="true" />
                <span className="text-[#FFF5EB]/65">
                  Phone: {COMPANY_FACTS.contactPlaceholders.phone}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#FF6500] mt-0.5 shrink-0" aria-hidden="true" />
                <span className="text-[#FFF5EB]/65">
                  Email: {COMPANY_FACTS.contactPlaceholders.email}
                </span>
              </li>
            </ul>
            <p className="mt-4 text-xs text-[#FFF5EB]/60">
              {COMPANY_FACTS.managerName}, {COMPANY_FACTS.managerTitle}
            </p>
          </div>
        </div>

        {/* Minimalist Bottom Legal Bar */}
        <div className="mt-12 pt-7 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#FFF5EB]/65">
          <p>{COMPANY_FACTS.copyright}</p>
          <div className="flex items-center gap-6">
            <a
              href={withBase('/privacy-policy')}
              onClick={(e) => handleLink(e, '/privacy-policy')}
              className="hover:text-[#FF6500] transition-colors whitespace-nowrap"
            >
              Privacy Policy
            </a>
            <a
              href={withBase('/terms-and-conditions')}
              onClick={(e) => handleLink(e, '/terms-and-conditions')}
              className="hover:text-[#FF6500] transition-colors whitespace-nowrap"
            >
              Terms and Conditions
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
