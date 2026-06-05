import type { Route } from "./+types/robots";
import { siteOrigin } from "~/lib/site";

export function loader({ request }: Route.LoaderArgs) {
  const origin = siteOrigin(request);
  const body = [
    "User-agent: *",
    "Allow: /",
    "Disallow: /api/",
    "",
    `Sitemap: ${origin}/sitemap.xml`,
    "",
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=UTF-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
