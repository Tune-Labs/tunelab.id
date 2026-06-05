import { env } from "cloudflare:workers";
import { listPosts } from "~/lib/posts.server";
import type { Route } from "./+types/api.posts";

// GET /api/posts?limit=&category=&cursor=  → published post list (keyset paginated)
export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const limit = Math.min(parseInt(url.searchParams.get("limit") ?? "12", 10) || 12, 50);
  const category = url.searchParams.get("category") || null;
  const cursor = url.searchParams.get("cursor");

  const { posts, nextCursor } = await listPosts(env.DB, { limit, category, cursor });

  return Response.json(
    { posts, nextCursor },
    { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } },
  );
}
