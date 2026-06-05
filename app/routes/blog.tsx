import { useState } from "react";
import { Link } from "react-router";
import { env } from "cloudflare:workers";

import type { Route } from "./+types/blog";
import { listCategories, listPosts, type PostListItem } from "~/lib/posts.server";
import { siteOrigin } from "~/lib/site";
import { Nav, Footer } from "~/components/SiteChrome";
import { EmptyDocIcon, ImagePlaceholderIcon, UserIcon } from "~/components/icons";
import { formatDate } from "~/lib/format";

const PAGE_SIZE = 12;

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const category = url.searchParams.get("category") || "";

  const [{ posts, nextCursor }, categories] = await Promise.all([
    listPosts(env.DB, { limit: PAGE_SIZE, category: category || null }),
    listCategories(env.DB),
  ]);

  return { posts, nextCursor, categories, category, origin: siteOrigin(request) };
}

export function meta({ data }: Route.MetaArgs) {
  const title = "Blog - TuneLab";
  const description = "Stories, updates, and insights from the TuneLab team.";
  const url = `${data?.origin ?? ""}/blog`;
  return [
    { title },
    { name: "description", content: description },
    { tagName: "link", rel: "canonical", href: url },
    { property: "og:type", content: "website" },
    { property: "og:url", content: url },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { name: "twitter:card", content: "summary" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
  ];
}

export default function Blog({ loaderData }: Route.ComponentProps) {
  const { posts, nextCursor, categories, category } = loaderData;

  return (
    <>
      <Nav active="blog" />

      <section className="hero">
        <div className="hero-glow" />
        <div className="hero-tag">TuneLab Blog</div>
        <h1>
          Ideas &amp; <span className="accent">Updates</span>
        </h1>
        <p>Stories, insights, and behind-the-scenes from the team building Nada.</p>
      </section>

      <div className="filter-bar">
        <FilterLink label="All" to="/blog" active={!category} />
        {categories.map((c) => (
          <FilterLink
            key={c}
            label={c}
            to={`/blog?category=${encodeURIComponent(c)}`}
            active={category === c}
          />
        ))}
      </div>

      {/* keyed by category so paginated state resets cleanly on filter change */}
      <PostList
        key={category}
        initial={posts}
        initialCursor={nextCursor}
        category={category}
      />

      <Footer />
    </>
  );
}

function FilterLink({ label, to, active }: { label: string; to: string; active: boolean }) {
  return (
    <Link to={to} className={active ? "filter-btn active" : "filter-btn"}>
      {label}
    </Link>
  );
}

function PostList({
  initial,
  initialCursor,
  category,
}: {
  initial: PostListItem[];
  initialCursor: string | null;
  category: string;
}) {
  const [extra, setExtra] = useState<PostListItem[]>([]);
  const [cursor, setCursor] = useState(initialCursor);
  const [loading, setLoading] = useState(false);

  const posts = [...initial, ...extra];

  async function loadMore() {
    if (!cursor || loading) return;
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: String(PAGE_SIZE), cursor });
      if (category) params.set("category", category);
      const res = await fetch(`/api/posts?${params}`);
      if (!res.ok) throw new Error("network");
      const data = (await res.json()) as { posts: PostListItem[]; nextCursor: string | null };
      setExtra((prev) => [...prev, ...data.posts]);
      setCursor(data.nextCursor);
    } catch {
      // keep the button; user can retry
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      {posts.length === 0 ? (
        <div className="posts-grid">
          <div className="state-empty">
            <EmptyDocIcon />
            <p className="state-title">No posts yet</p>
            <p className="state-sub">Check back soon.</p>
          </div>
        </div>
      ) : (
        <div className="posts-grid">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      )}

      {cursor && (
        <div className="load-more-wrap">
          <button className="btn-load" onClick={loadMore} disabled={loading}>
            {loading ? "Loading..." : "Load more"}
          </button>
        </div>
      )}
    </main>
  );
}

function PostCard({ post }: { post: PostListItem }) {
  return (
    <Link
      className="post-card"
      to={`/blog/article/${encodeURIComponent(post.slug)}`}
      aria-label={post.title}
    >
      {post.coverImageUrl ? (
        <img className="post-cover" src={post.coverImageUrl} alt={post.title} loading="lazy" />
      ) : (
        <div className="post-cover-placeholder">
          <ImagePlaceholderIcon />
        </div>
      )}
      <div className="post-body">
        {(post.category || post.tags.length > 0) && (
          <div className="post-meta-top">
            {post.category && <span className="post-cat">{post.category}</span>}
            {post.tags.slice(0, 2).map((t) => (
              <span key={t} className="post-tag">
                {t}
              </span>
            ))}
          </div>
        )}
        <h2 className="post-title">{post.title}</h2>
        {post.excerpt && <p className="post-excerpt">{post.excerpt}</p>}
        <div className="post-meta-bottom">
          <span className="post-author">
            <UserIcon size={13} />
            {post.author || "TuneLab"}
          </span>
          <span className="post-stats">
            {post.publishedAt && <span>{formatDate(post.publishedAt, "short")}</span>}
            {post.readingMinutes && <span>{post.readingMinutes} min read</span>}
          </span>
        </div>
      </div>
    </Link>
  );
}
