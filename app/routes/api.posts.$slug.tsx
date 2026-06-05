import { env } from "cloudflare:workers";
import { getPost } from "~/lib/posts.server";
import type { Route } from "./+types/api.posts.$slug";

// GET /api/posts/:slug  → single published post detail
export async function loader({ params }: Route.LoaderArgs) {
  const post = await getPost(env.DB, decodeURIComponent(params.slug));

  if (!post) {
    return Response.json(
      { error: { code: "not_found", message: "Post not found" } },
      { status: 404 },
    );
  }

  return Response.json(
    { post },
    { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } },
  );
}
