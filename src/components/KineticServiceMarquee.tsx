import { CORE_SERVICES, ServiceItem } from '../utils/companyData';

interface KineticServiceMarqueeProps {
  services?: ServiceItem[];
  onSelectService?: () => void;
}

function FourPointStar({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M12 1l2.2 8.8L23 12l-8.8 2.2L12 23l-2.2-8.8L1 12l8.8-2.2z" />
    </svg>
  );
}

export function KineticServiceMarquee({
  services = CORE_SERVICES,
  onSelectService,
}: KineticServiceMarqueeProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onSelectService) {
      e.preventDefault();
      onSelectService();
    }
  };

  const renderGroup = (isDuplicate: boolean, row: 'top' | 'bottom') => (
    <div
      aria-hidden={isDuplicate ? true : undefined}
      className="flex items-center gap-6 sm:gap-9 pr-6 sm:pr-9 shrink-0"
    >
      {services.map((service) => (
        <span key={`${row}-${isDuplicate ? 'dup' : 'main'}-${service.id}`} className="inline-flex items-center gap-6 sm:gap-9">
          <a
            href="/services"
            tabIndex={isDuplicate ? -1 : undefined}
            onClick={handleClick}
            className={`font-display font-extrabold uppercase tracking-[-0.03em] text-3xl sm:text-5xl lg:text-[3.4rem] leading-[1.06] whitespace-nowrap transition-opacity duration-200 hover:opacity-80 ${
              row === 'top' ? 'text-[#171717]' : 'kinetic-marquee-outline'
            }`}
          >
            {service.title}
          </a>
          <FourPointStar
            className={`w-5 h-5 sm:w-7 sm:h-7 shrink-0 ${
              row === 'top' ? 'text-[#FF6500]' : 'text-[#171717]'
            }`}
          />
        </span>
      ))}
    </div>
  );

  return (
    <section
      aria-label="Core Services Kinetic Marquee"
      data-testid="kinetic-service-marquee"
      className="bg-white border-t border-[#EAD8C8] py-7 sm:py-9 overflow-hidden select-none"
    >
      <div className="group flex flex-col gap-2.5 sm:gap-3.5">
        {/* Row 1: Solid Charcoal Ink + Vibrant Orange Stars, Scrolling Left */}
        <div className="overflow-hidden">
          <div className="flex w-max items-center animate-kinetic-left group-hover:[animation-play-state:paused] will-change-transform">
            {renderGroup(false, 'top')}
            {renderGroup(true, 'top')}
          </div>
        </div>

        {/* Row 2: Vibrant Orange Outlined White Text + Charcoal Stars, Scrolling Right */}
        <div className="overflow-hidden">
          <div className="flex w-max items-center animate-kinetic-right group-hover:[animation-play-state:paused] will-change-transform">
            {renderGroup(false, 'bottom')}
            {renderGroup(true, 'bottom')}
          </div>
        </div>
      </div>
    </section>
  );
}
