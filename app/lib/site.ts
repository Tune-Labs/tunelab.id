const FALLBACK_ORIGIN = "https://tunelab.id";

/**
 * Base origin for the site's absolute URLs (canonical, OpenGraph, JSON-LD,
 * sitemap). Derived from the incoming request so the site works on any host
 * without code changes — apex, www, *.workers.dev, or a future domain. A leading
 * `www.` is dropped so canonical/OG URLs stay on a single canonical host.
 *
 * Change the marketing domain by pointing DNS / the Worker route at the new host;
 * no code edit needed. `FALLBACK_ORIGIN` is only used when no request is available.
 */
export function siteOrigin(request?: Request): string {
  if (request) {
    try {
      const { protocol, host } = new URL(request.url);
      return `${protocol}//${host}`.replace("://www.", "://");
    } catch {
      // fall through
    }
  }
  return FALLBACK_ORIGIN;
}
