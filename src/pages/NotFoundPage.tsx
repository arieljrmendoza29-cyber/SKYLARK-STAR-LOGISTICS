import { ArrowRight, Compass } from 'lucide-react';
import { RoutePath } from '../utils/companyData';
import { SEOHead } from '../components/SEOHead';
import { withBase } from '../utils/basePath';

interface NotFoundPageProps {
  onNavigate: (path: RoutePath) => void;
}

export function NotFoundPage({ onNavigate }: NotFoundPageProps) {
  return (
    <>
      <SEOHead
        title="Page Not Found | Skylark Star Logistics, LLC"
        description="The requested page could not be found on the Skylark Star Logistics, LLC website."
        canonicalPath="/404"
      />

      <section className="min-h-[75vh] bg-[#171717] text-[#FFF5EB] flex items-center pt-[76px]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#FF6500]/15 border border-[#FF6500]/40 mb-6">
            <Compass className="w-7 h-7 text-[#FF6500]" aria-hidden="true" />
          </div>
          <p className="font-mono text-sm font-semibold tracking-widest text-[#FF6500] uppercase">
            Error 404
          </p>
          <h1 className="mt-3 font-display text-3xl sm:text-5xl font-extrabold tracking-tight">
            Route Not Found
          </h1>
          <p className="mt-4 text-base text-[#FFF5EB]/75 max-w-xl mx-auto leading-relaxed">
            The page you are looking for may have moved or does not exist. Use the links below to
            return to our main routes or request a freight quote.
          </p>

          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <a
              href={withBase('/')}
              onClick={(e) => {
                e.preventDefault();
                onNavigate('/');
              }}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#FF6500] hover:bg-[#E05800] text-[#171717] text-xs font-bold uppercase tracking-wider transition-colors"
            >
              <span>Return Home</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </a>
            <a
              href={withBase('/contact')}
              onClick={(e) => {
                e.preventDefault();
                onNavigate('/contact');
              }}
              className="inline-flex items-center px-6 py-3.5 rounded-xl border border-white/25 hover:border-[#FF6500] text-[#FFF5EB] hover:text-[#FF6500] text-xs font-bold uppercase tracking-wider transition-colors"
            >
              Request a Quote
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
