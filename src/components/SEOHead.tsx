import { useEffect } from 'react';
import { COMPANY_FACTS } from '../utils/companyData';

const SITE_ORIGIN = COMPANY_FACTS.websiteUrl.replace(/\/$/, '');

interface SEOHeadProps {
  title: string;
  description: string;
  canonicalPath: string;
  ogImage?: string;
}

export function SEOHead({
  title,
  description,
  canonicalPath,
  ogImage = '/brand/og-image.jpg',
}: SEOHeadProps) {
  useEffect(() => {
    document.title = title;

    const setMeta = (selector: string, attr: 'name' | 'property', key: string, content: string) => {
      let el = document.querySelector<HTMLMetaElement>(selector);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    setMeta('meta[name="description"]', 'name', 'description', description);
    setMeta('meta[property="og:title"]', 'property', 'og:title', title);
    setMeta('meta[property="og:description"]', 'property', 'og:description', description);
    setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', title);
    setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description);

    // Always point canonical URLs at the production domain, not preview/staging hosts.
    const canonicalUrl = `${SITE_ORIGIN}${canonicalPath}`;
    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', canonicalUrl);
    setMeta('meta[property="og:url"]', 'property', 'og:url', canonicalUrl);

    // Social crawlers require absolute image URLs.
    const absoluteImage = /^https?:\/\//.test(ogImage) ? ogImage : `${SITE_ORIGIN}${ogImage}`;
    setMeta('meta[property="og:image"]', 'property', 'og:image', absoluteImage);
    setMeta('meta[name="twitter:image"]', 'name', 'twitter:image', absoluteImage);
  }, [title, description, canonicalPath, ogImage]);

  return null;
}
