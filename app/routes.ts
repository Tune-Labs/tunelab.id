import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),                            // /                       → redirect to /nada
  route("nada", "routes/nada.tsx"),                    // /nada                   → SSR landing
  route("nada/terms-of-use.html", "routes/terms.tsx"), // /nada/terms-of-use.html
  route("nada/privacy-policy.html", "routes/privacy.tsx"), // /nada/privacy-policy.html
  route("nada/support.html", "routes/support.tsx"),    // /nada/support.html
  route("blog", "routes/blog.tsx"),                    // /blog                   → SSR list
  route("blog/article/:slug", "routes/article.tsx"),   // /blog/article/:slug     → SSR detail
  route("unsubscribe", "routes/unsubscribe.tsx"),      // /unsubscribe?token=…    → email opt-out
  route("api/posts", "routes/api.posts.tsx"),          // /api/posts              → JSON list
  route("api/posts/:slug", "routes/api.posts.$slug.tsx"), // /api/posts/:slug     → JSON detail
  route("sitemap.xml", "routes/sitemap.ts"),           // /sitemap.xml
  route("robots.txt", "routes/robots.ts"),             // /robots.txt
] satisfies RouteConfig;
