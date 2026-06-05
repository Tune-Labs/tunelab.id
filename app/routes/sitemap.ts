import { env } from "cloudflare:workers";
import type { Route } from "./+types/sitemap";
import { listAllSlugs } from "~/lib/posts.server";
import { siteOrigin } from "~/lib/site";

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function loader({ request }: Route.LoaderArgs) {
  const origin = siteOrigin(request);
  const slugs = await listAllSlugs(env.DB);

  const staticPaths = [
    "/nada",
    "/blog",
    "/nada/terms-of-use.html",
    "/nada/privacy-policy.html",
    "/nada/support.html",
  ];

  const entries = [
    ...staticPaths.map((p) => ({ loc: `${origin}${p}`, lastmod: null as string | null })),
    ...slugs.map((s) => ({
      loc: `${origin}/blog/article/${encodeURIComponent(s.slug)}`,
      lastmod: s.updatedAt ? new Date(s.updatedAt).toISOString() : null,
    })),
  ];

  const body =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    entries
      .map(
        (u) =>
          `  <url><loc>${escapeXml(u.loc)}</loc>` +
          (u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : "") +
          `</url>`,
      )
      .join("\n") +
    `\n</urlset>\n`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=UTF-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
