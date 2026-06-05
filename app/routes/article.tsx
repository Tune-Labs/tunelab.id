import { Link, type MetaDescriptor } from "react-router";
import { env } from "cloudflare:workers";

import type { Route } from "./+types/article";
import { getPost } from "~/lib/posts.server";
import { renderMarkdown } from "~/lib/markdown.server";
import { siteOrigin } from "~/lib/site";
import { Nav, Footer } from "~/components/SiteChrome";
import { CalendarIcon, ChevronLeftIcon, ClockIcon, UserIcon } from "~/components/icons";
import { formatDate } from "~/lib/format";

export async function loader({ params, request }: Route.LoaderArgs) {
  const full = await getPost(env.DB, decodeURIComponent(params.slug));
  if (!full) {
    throw new Response("Article not found", { status: 404 });
  }

  const contentHtml = renderMarkdown(full.content);
  // Drop the raw Markdown from the client payload — only contentHtml is rendered,
  // so shipping `content` too would duplicate the whole article in the HTML.
  const { content: _raw, ...post } = full;

  const origin = siteOrigin(request);
  const url = `${origin}/blog/article/${encodeURIComponent(post.slug)}`;
  return { post, contentHtml, url, origin };
}

export function meta({ data }: Route.MetaArgs) {
  if (!data) {
    return [{ title: "Article not found - TuneLab Blog" }];
  }

  const { post, url, origin } = data;
  const title = post.metaTitle || post.title;
  const desc = post.metaDescription || post.excerpt || "";
  const image = post.ogImageUrl || post.coverImageUrl || "";
  const canonical = post.canonicalUrl || url;
  const ogTitle = post.ogTitle || title;
  const ogDesc = post.ogDescription || desc;

  const tags: MetaDescriptor[] = [
    { title: `${title} - TuneLab Blog` },
    { name: "description", content: desc },
    { tagName: "link", rel: "canonical", href: canonical },
    { property: "og:type", content: "article" },
    { property: "og:url", content: url },
    { property: "og:title", content: ogTitle },
    { property: "og:description", content: ogDesc },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: ogTitle },
    { name: "twitter:description", content: ogDesc },
  ];

  if (image) {
    tags.push({ property: "og:image", content: image });
    tags.push({ name: "twitter:image", content: image });
  }
  if (post.noindex) {
    tags.push({ name: "robots", content: "noindex" });
  }

  // Article structured data. The `script:ld+json` descriptor is JSON-serialized
  // and HTML-escaped by React Router (patched for CVE-2025-59057), so this is safe.
  tags.push({
    "script:ld+json": {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: post.title,
      ...(desc ? { description: desc } : {}),
      ...(image ? { image } : {}),
      author: { "@type": "Person", name: post.author || "TuneLab" },
      publisher: {
        "@type": "Organization",
        name: "TuneLab",
        logo: { "@type": "ImageObject", url: `${origin}/nada/img/logo.png` },
      },
      ...(post.publishedAt
        ? { datePublished: new Date(post.publishedAt).toISOString() }
        : {}),
      mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
    },
  });

  return tags;
}

export default function Article({ loaderData }: Route.ComponentProps) {
  const { post, contentHtml } = loaderData;

  return (
    <>
      <Nav active="blog" />

      <article className="article-wrap">
        <Link to="/blog" className="back-link">
          <ChevronLeftIcon size={16} />
          Back to Blog
        </Link>

        {(post.category || post.tags.length > 0) && (
          <div className="article-meta-top">
            {post.category && <span className="post-cat">{post.category}</span>}
            {post.tags.slice(0, 3).map((t) => (
              <span key={t} className="post-tag">
                {t}
              </span>
            ))}
          </div>
        )}

        <h1 className="article-title">{post.title}</h1>

        {post.excerpt && <p className="article-excerpt">{post.excerpt}</p>}

        <div className="article-byline">
          {post.author && (
            <span className="byline-item">
              <UserIcon size={14} />
              {post.author}
            </span>
          )}
          {post.publishedAt && (
            <span className="byline-item">
              <CalendarIcon size={14} />
              {formatDate(post.publishedAt, "long")}
            </span>
          )}
          {post.readingMinutes && (
            <span className="byline-item">
              <ClockIcon size={14} />
              {post.readingMinutes} min read
            </span>
          )}
        </div>

        {post.coverImageUrl && (
          <img className="article-cover" src={post.coverImageUrl} alt={post.title} />
        )}

        {/* contentHtml is server-rendered Markdown — see markdown.server.ts security note. */}
        <div className="prose" dangerouslySetInnerHTML={{ __html: contentHtml }} />
      </article>

      <Footer />
    </>
  );
}
