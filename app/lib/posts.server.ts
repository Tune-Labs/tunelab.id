// Server-only data access for blog posts backed by Cloudflare D1.
// Ported from the original hand-rolled Worker (src/index.ts).

export interface PostListItem {
  slug: string;
  title: string;
  excerpt: string | null;
  coverImageUrl: string | null;
  category: string | null;
  tags: string[];
  author: string | null;
  readingMinutes: number | null;
  publishedAt: number | null;
}

export interface PostDetail extends PostListItem {
  content: string;
  metaTitle: string | null;
  metaDescription: string | null;
  canonicalUrl: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  ogImageUrl: string | null;
  noindex: boolean;
}

export interface ListResult {
  posts: PostListItem[];
  nextCursor: string | null;
}

// ── Cursor (opaque base64url of {t, id}) ──────────────────────────────────────

export function encodeCursor(t: number, id: string): string {
  const bytes = new TextEncoder().encode(JSON.stringify({ t, id }));
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function decodeCursor(s: string): { t: number; id: string } | null {
  try {
    const padded = s.replace(/-/g, "+").replace(/_/g, "/");
    const bin = atob(padded);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    const obj = JSON.parse(new TextDecoder().decode(bytes)) as { t: unknown; id: unknown };
    if (typeof obj.t === "number" && typeof obj.id === "string") {
      return { t: obj.t, id: obj.id };
    }
  } catch {}
  return null;
}

function parseTags(raw: string | null | undefined): string[] {
  if (!raw) return [];
  try {
    const arr = JSON.parse(raw);
    if (Array.isArray(arr)) return arr.filter((t): t is string => typeof t === "string");
  } catch {}
  return [];
}

// ── Column sets (no internal keys) ────────────────────────────────────────────

const LIST_COLS = [
  "id", "slug", "title", "excerpt",
  "cover_image_url", "category", "tags",
  "author", "reading_minutes", "published_at", "created_at",
].join(", ");

const DETAIL_COLS = [
  "slug", "title", "excerpt", "content",
  "cover_image_url", "category", "tags",
  "author", "reading_minutes", "published_at",
  "meta_title", "meta_description", "canonical_url",
  "og_title", "og_description", "og_image_url", "noindex",
].join(", ");

type Row = Record<string, unknown>;

function toListItem(r: Row): PostListItem {
  return {
    slug: r.slug as string,
    title: r.title as string,
    excerpt: (r.excerpt as string | null) ?? null,
    coverImageUrl: (r.cover_image_url as string | null) ?? null,
    category: (r.category as string | null) ?? null,
    tags: parseTags(r.tags as string | null),
    author: (r.author as string | null) ?? null,
    readingMinutes: (r.reading_minutes as number | null) ?? null,
    publishedAt: (r.published_at as number | null) ?? null,
  };
}

// ── Queries ───────────────────────────────────────────────────────────────────

export async function listPosts(
  db: D1Database,
  opts: { limit?: number; category?: string | null; cursor?: string | null },
): Promise<ListResult> {
  const limit = Math.min(Math.max(opts.limit ?? 12, 1), 50);
  const keyset = opts.cursor ? decodeCursor(opts.cursor) : null;

  const conditions: string[] = ["status = 'published'", "deleted_at IS NULL"];
  const params: (string | number | null)[] = [];

  if (opts.category) {
    conditions.push("category = ?");
    params.push(opts.category);
  }
  if (keyset) {
    conditions.push("(created_at < ? OR (created_at = ? AND id < ?))");
    params.push(keyset.t, keyset.t, keyset.id);
  }

  const sql = `SELECT ${LIST_COLS} FROM articles WHERE ${conditions.join(" AND ")} ORDER BY created_at DESC, id DESC LIMIT ?`;
  params.push(limit + 1);

  const { results } = await db.prepare(sql).bind(...params).all<Row>();

  const hasMore = results.length > limit;
  const items = hasMore ? results.slice(0, limit) : results;
  const last = items.at(-1);
  const nextCursor =
    hasMore && last
      ? encodeCursor(last.created_at as number, last.id as string)
      : null;

  return { posts: items.map(toListItem), nextCursor };
}

export async function getPost(db: D1Database, slug: string): Promise<PostDetail | null> {
  const row = await db
    .prepare(`SELECT ${DETAIL_COLS} FROM articles WHERE slug = ? AND status = 'published' AND deleted_at IS NULL LIMIT 1`)
    .bind(slug)
    .first<Row>();

  if (!row) return null;

  return {
    slug: row.slug as string,
    title: row.title as string,
    excerpt: (row.excerpt as string | null) ?? null,
    content: (row.content as string | null) ?? "",
    coverImageUrl: (row.cover_image_url as string | null) ?? null,
    category: (row.category as string | null) ?? null,
    tags: parseTags(row.tags as string | null),
    author: (row.author as string | null) ?? null,
    readingMinutes: (row.reading_minutes as number | null) ?? null,
    publishedAt: (row.published_at as number | null) ?? null,
    metaTitle: (row.meta_title as string | null) ?? null,
    metaDescription: (row.meta_description as string | null) ?? null,
    canonicalUrl: (row.canonical_url as string | null) ?? null,
    ogTitle: (row.og_title as string | null) ?? null,
    ogDescription: (row.og_description as string | null) ?? null,
    ogImageUrl: (row.og_image_url as string | null) ?? null,
    noindex: Boolean(row.noindex),
  };
}

/** Distinct published categories, for the blog filter bar. */
export async function listCategories(db: D1Database): Promise<string[]> {
  const { results } = await db
    .prepare(
      `SELECT DISTINCT category FROM articles
       WHERE status = 'published' AND deleted_at IS NULL AND category IS NOT NULL AND category != ''
       ORDER BY category ASC`,
    )
    .all<Row>();
  return results.map((r) => r.category as string).filter(Boolean);
}

/** All published slugs + timestamps, for sitemap generation. */
export async function listAllSlugs(
  db: D1Database,
): Promise<{ slug: string; updatedAt: number | null }[]> {
  const { results } = await db
    .prepare(
      `SELECT slug, published_at, created_at FROM articles
       WHERE status = 'published' AND deleted_at IS NULL AND noindex = 0
       ORDER BY created_at DESC LIMIT 5000`,
    )
    .all<Row>();
  return results.map((r) => ({
    slug: r.slug as string,
    updatedAt: ((r.published_at as number | null) ?? (r.created_at as number | null)) ?? null,
  }));
}
