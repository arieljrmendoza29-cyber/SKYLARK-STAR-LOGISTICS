import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { COMPANY_FACTS, NAV_ITEMS, RoutePath } from '../utils/companyData';
import { withBase } from '../utils/basePath';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: RoutePath) => void;
  hasDarkHero?: boolean;
}

export function Navbar({ currentPath, onNavigate, hasDarkHero = false }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [currentPath]);

  const isFloating = isScrolled && !mobileOpen;
  const useDarkText = !hasDarkHero || isScrolled || mobileOpen;

  const handleLinkClick = (e: React.MouseEvent, path: RoutePath) => {
    e.preventDefault();
    setMobileOpen(false);
    onNavigate(path);
  };

  return (
    <header
      data-scrolled={isFloating ? 'true' : 'false'}
      className={`nav-header-shell fixed top-0 inset-x-0 z-50 pointer-events-none ${
        isFloating ? 'is-floating' : ''
      }`}
    >
      <div
        data-testid="navbar-pill"
        className={`nav-pill-bar pointer-events-auto w-full flex items-center justify-between gap-4 lg:gap-8 backdrop-blur-md ${
          isFloating
            ? 'px-4 sm:px-6 bg-white/95 border border-[#EAD8C8] shadow-[0_12px_28px_rgba(23,23,23,0.12),0_2px_6px_rgba(23,23,23,0.06)]'
            : mobileOpen
              ? 'px-4 sm:px-6 bg-white border-b border-[#EAD8C8] shadow-sm'
              : hasDarkHero
                ? 'px-4 sm:px-8 lg:px-12 bg-[#171717]/80 border-b border-white/10'
                : 'px-4 sm:px-8 lg:px-12 bg-[#FFF5EB]/90 border-b border-[#EAD8C8]/70'
        }`}
      >
        <div className="w-full max-w-7xl mx-auto flex items-center justify-between gap-4 lg:gap-6">
          {/* Zone 1: Official Skylark Star Logistics Logo */}
          <a
            href={withBase('/')}
            onClick={(e) => handleLinkClick(e, '/')}
            className="shrink-0 inline-flex items-center focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FF6500] rounded-xl"
            aria-label="Skylark Star Logistics, LLC Home"
          >
            <img
              src={COMPANY_FACTS.logoPath}
              alt="Skylark Star Logistics, LLC logo"
              className={`w-auto object-contain transition-all duration-500 ${
                isFloating ? 'h-8 sm:h-9' : 'h-9 sm:h-10 lg:h-11'
              }`}
              referrerPolicy="no-referrer"
            />
          </a>

          {/* Zone 2: Single-line Editorial Navigation Links */}
          <nav aria-label="Primary Navigation" className="hidden md:flex items-center gap-5 lg:gap-7">
            {NAV_ITEMS.map((item) => {
              const isActive = currentPath === item.path;
              return (
                <a
                  key={item.path}
                  href={withBase(item.path)}
                  onClick={(e) => handleLinkClick(e, item.path)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`group relative py-1.5 text-sm font-semibold whitespace-nowrap shrink-0 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FF6500] ${
                    useDarkText
                      ? isActive
                        ? 'text-[#171717]'
                        : 'text-[#171717]/70 hover:text-[#171717]'
                      : isActive
                        ? 'text-white'
                        : 'text-white/80 hover:text-white'
                  }`}
                >
                  {item.label}
                  <span
                    aria-hidden="true"
                    className={`absolute left-0 right-0 bottom-0 h-[2.5px] rounded-full bg-[#FF6500] transition-transform duration-200 origin-left ${
                      isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                    }`}
                  />
                </a>
              );
            })}
          </nav>

          {/* Zone 3: Primary Orange CTA + Mobile Menu Toggle */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <a
              href={withBase('/contact')}
              onClick={(e) => handleLinkClick(e, '/contact')}
              className={`hidden sm:inline-flex items-center justify-center bg-[#FF6500] hover:bg-[#E05800] text-[#171717] text-xs font-bold tracking-wider uppercase whitespace-nowrap shrink-0 shadow-sm transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717] ${
                isFloating ? 'px-4 py-2 rounded-full' : 'px-5 py-2.5 rounded-xl'
              }`}
            >
              REQUEST A QUOTE
            </a>

            <button
              type="button"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-navigation-drawer"
              aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className={`md:hidden inline-flex items-center justify-center rounded-xl border transition-colors focus-visible:outline-2 focus-visible:outline-[#FF6500] ${
                isFloating ? 'w-10 h-10 rounded-full' : 'w-11 h-11 rounded-xl'
              } ${
                useDarkText
                  ? 'border-[#EAD8C8] bg-white/80 text-[#171717] hover:bg-[#EAD8C8]/50'
                  : 'border-white/20 bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {mobileOpen ? (
                <X className="w-5 h-5" aria-hidden="true" />
              ) : (
                <Menu className="w-5 h-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <div
          id="mobile-navigation-drawer"
          className="md:hidden pointer-events-auto bg-[#FFF5EB] border-t border-[#EAD8C8] shadow-lg"
        >
          <nav aria-label="Mobile Navigation" className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1.5">
            {NAV_ITEMS.map((item) => {
              const isActive = currentPath === item.path;
              return (
                <a
                  key={item.path}
                  href={withBase(item.path)}
                  onClick={(e) => handleLinkClick(e, item.path)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                    isActive
                      ? 'bg-[#FF6500] text-[#171717]'
                      : 'text-[#171717]/85 hover:bg-white hover:text-[#171717]'
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
            <div className="pt-3 mt-2 border-t border-[#EAD8C8]">
              <a
                href={withBase('/contact')}
                onClick={(e) => handleLinkClick(e, '/contact')}
                className="w-full inline-flex items-center justify-center px-5 py-3 rounded-xl bg-[#171717] hover:bg-[#2A2A2A] text-[#FFF5EB] text-xs font-bold tracking-wider uppercase transition-colors"
              >
                REQUEST A QUOTE
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
