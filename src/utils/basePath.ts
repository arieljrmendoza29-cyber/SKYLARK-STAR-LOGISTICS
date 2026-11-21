/**
 * The folder the site is served from, always ending in "/".
 *
 * - "/" on a custom domain (https://skylarkstarlogistics.com/) or a Node server
 * - "/SKYLARK-STAR-LOGISTICS/" on https://<user>.github.io/SKYLARK-STAR-LOGISTICS/
 *
 * Set at build time through VITE_BASE_PATH (see vite.config.ts). Falls back to "/"
 * outside Vite (e.g. unit tests running under Node).
 */
export const BASE_PATH: string = (() => {
  const raw = import.meta.env?.BASE_URL ?? '/';
  return raw.endsWith('/') ? raw : `${raw}/`;
})();

export function addBase(base: string, path: string): string {
  if (/^(https?:|mailto:|tel:|#)/.test(path)) return path;
  return base + path.replace(/^\/+/, '');
}

export function removeBase(base: string, pathname: string): string {
  const baseNoSlash = base.slice(0, -1);
  if (baseNoSlash && (pathname === baseNoSlash || pathname.startsWith(base))) {
    return `/${pathname.slice(base.length)}`;
  }
  return pathname || '/';
}

/** "/services" -> "/SKYLARK-STAR-LOGISTICS/services" (or unchanged on a root domain). */
export const withBase = (path: string): string => addBase(BASE_PATH, path);

/** "/SKYLARK-STAR-LOGISTICS/services" -> "/services". */
export const stripBase = (pathname: string): string => removeBase(BASE_PATH, pathname);
