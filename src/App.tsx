import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { RoutePath } from './utils/companyData';
import { stripBase, withBase } from './utils/basePath';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { SoftSectionSnapController } from './components/SoftSectionSnapController';
import { HomePage } from './pages/HomePage';
import { ServicesPage } from './pages/ServicesPage';
import { AboutPage } from './pages/AboutPage';
import { ServiceAreaPage } from './pages/ServiceAreaPage';
import { ContactPage } from './pages/ContactPage';
import { LegalPage } from './pages/LegalPage';
import { NotFoundPage } from './pages/NotFoundPage';

const LIGHT_HERO_PATHS = new Set<string>([
  '/',
  '/services',
  '/about',
  '/service-area',
  '/contact',
  '/privacy-policy',
  '/terms-and-conditions',
]);

function normalizePath(rawPathname: string): string {
  const pathname = stripBase(rawPathname);
  if (pathname.length > 1 && pathname.endsWith('/')) {
    return pathname.slice(0, -1);
  }
  return pathname || '/';
}

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() =>
    normalizePath(window.location.pathname),
  );
  const [preselectedService, setPreselectedService] = useState<string | undefined>(undefined);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(normalizePath(window.location.pathname));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = useCallback((path: RoutePath, servicePreselect?: string) => {
    setPreselectedService(servicePreselect);
    const target = normalizePath(path);
    const url = withBase(target);
    if (window.location.pathname !== url) {
      window.history.pushState({}, '', url);
    }
    setCurrentPath(target);
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  const hasDarkHero = !LIGHT_HERO_PATHS.has(currentPath);

  const renderPage = () => {
    switch (currentPath) {
      case '/':
        return <HomePage onNavigate={navigate} />;
      case '/services':
        return <ServicesPage onNavigate={navigate} />;
      case '/about':
        return <AboutPage onNavigate={navigate} />;
      case '/service-area':
        return <ServiceAreaPage onNavigate={navigate} />;
      case '/contact':
        return <ContactPage onNavigate={navigate} preselectedService={preselectedService} />;
      case '/privacy-policy':
        return <LegalPage mode="privacy" onNavigate={navigate} />;
      case '/terms-and-conditions':
        return <LegalPage mode="terms" onNavigate={navigate} />;
      default:
        return <NotFoundPage onNavigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF5EB] text-[#171717] overflow-x-clip">
      <Navbar currentPath={currentPath} onNavigate={navigate} hasDarkHero={hasDarkHero} />

      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPath}
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>

      <SoftSectionSnapController currentPath={currentPath} />
      <Footer onNavigate={navigate} />
    </div>
  );
}
