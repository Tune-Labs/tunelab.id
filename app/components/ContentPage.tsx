import type { MetaDescriptor } from "react-router";
import { Nav, Footer, type NavActive } from "./SiteChrome";

/** Shared layout for text/legal pages, using the blog design system. */
export function ContentPage({
  title,
  effectiveDate,
  intro,
  active,
  children,
}: {
  title: string;
  effectiveDate?: { label: string; value: string };
  intro?: React.ReactNode;
  active?: NavActive;
  children: React.ReactNode;
}) {
  return (
    <>
      <Nav active={active} />
      <article className="article-wrap">
        <h1 className="article-title">{title}</h1>
        {effectiveDate && (
          <p className="content-date">
            <strong>{effectiveDate.label}</strong> {effectiveDate.value}
          </p>
        )}
        {intro && <div className="content-callout">{intro}</div>}
        <div className="prose">{children}</div>
      </article>
      <Footer />
    </>
  );
}

/** Build canonical + OpenGraph meta tags for a content page. */
export function contentMeta(
  origin: string,
  path: string,
  title: string,
  description: string,
): MetaDescriptor[] {
  const url = `${origin}${path}`;
  return [
    { title: `${title} - Nada` },
    { name: "description", content: description },
    { tagName: "link", rel: "canonical", href: url },
    { property: "og:type", content: "website" },
    { property: "og:url", content: url },
    { property: "og:title", content: `${title} - Nada` },
    { property: "og:description", content: description },
    { name: "twitter:card", content: "summary" },
    { name: "twitter:title", content: `${title} - Nada` },
    { name: "twitter:description", content: description },
  ];
}
