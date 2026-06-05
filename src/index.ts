interface D1Database {
	prepare(query: string): D1PreparedStatement;
}
interface D1PreparedStatement {
	bind(...values: (string | number | null)[]): D1PreparedStatement;
	all<T = Record<string, unknown>>(): Promise<{ results: T[] }>;
	first<T = Record<string, unknown>>(): Promise<T | null>;
}

interface Env {
	ASSETS: Fetcher;
	DB: D1Database;
}

// ── Cursor (opaque base64url of {t, id}) ──────────────────────────────────────

function encodeCursor(t: number, id: string): string {
	const bytes = new TextEncoder().encode(JSON.stringify({ t, id }));
	let bin = "";
	for (const b of bytes) bin += String.fromCharCode(b);
	return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function decodeCursor(s: string): { t: number; id: string } | null {
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

// ── List columns (no content / internal keys) ─────────────────────────────────

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

// ── Handlers ──────────────────────────────────────────────────────────────────

async function handleListPosts(db: D1Database, url: URL): Promise<Response> {
	const limit = Math.min(parseInt(url.searchParams.get("limit") ?? "12", 10) || 12, 50);
	const category = url.searchParams.get("category") || null;
	const cursorParam = url.searchParams.get("cursor");
	const keyset = cursorParam ? decodeCursor(cursorParam) : null;

	const conditions: string[] = ["status = 'published'", "deleted_at IS NULL"];
	const params: (string | number | null)[] = [];

	if (category) {
		conditions.push("category = ?");
		params.push(category);
	}
	if (keyset) {
		conditions.push("(created_at < ? OR (created_at = ? AND id < ?))");
		params.push(keyset.t, keyset.t, keyset.id);
	}

	const sql = `SELECT ${LIST_COLS} FROM articles WHERE ${conditions.join(" AND ")} ORDER BY created_at DESC, id DESC LIMIT ?`;
	params.push(limit + 1);

	type Row = Record<string, unknown>;
	const { results } = await db.prepare(sql).bind(...params).all<Row>();

	const hasMore = results.length > limit;
	const items = hasMore ? results.slice(0, limit) : results;
	const last = items.at(-1);
	const nextCursor =
		hasMore && last
			? encodeCursor(last.created_at as number, last.id as string)
			: null;

	const posts = items.map((r) => ({
		slug: r.slug,
		title: r.title,
		excerpt: r.excerpt ?? null,
		coverImageUrl: r.cover_image_url ?? null,
		category: r.category ?? null,
		tags: parseTags(r.tags as string | null),
		author: r.author ?? null,
		readingMinutes: r.reading_minutes ?? null,
		publishedAt: r.published_at ?? null,
	}));

	return json({ posts, nextCursor });
}

async function handleGetPost(db: D1Database, slug: string): Promise<Response> {
	const row = await db
		.prepare(`SELECT ${DETAIL_COLS} FROM articles WHERE slug = ? AND status = 'published' AND deleted_at IS NULL LIMIT 1`)
		.bind(slug)
		.first<Record<string, unknown>>();

	if (!row) return json({ error: { code: "not_found", message: "Post not found" } }, 404);

	return json({
		post: {
			slug: row.slug,
			title: row.title,
			excerpt: row.excerpt ?? null,
			content: row.content,
			coverImageUrl: row.cover_image_url ?? null,
			category: row.category ?? null,
			tags: parseTags(row.tags as string | null),
			author: row.author ?? null,
			readingMinutes: row.reading_minutes ?? null,
			publishedAt: row.published_at ?? null,
			metaTitle: row.meta_title ?? null,
			metaDescription: row.meta_description ?? null,
			canonicalUrl: row.canonical_url ?? null,
			ogTitle: row.og_title ?? null,
			ogDescription: row.og_description ?? null,
			ogImageUrl: row.og_image_url ?? null,
			noindex: Boolean(row.noindex),
		},
	});
}

function json(data: unknown, status = 200): Response {
	return new Response(JSON.stringify(data), {
		status,
		headers: {
			"Content-Type": "application/json;charset=UTF-8",
			"Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
		},
	});
}

// ── Entry point ───────────────────────────────────────────────────────────────

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const url = new URL(request.url);
		const { pathname } = url;

		if (request.method !== "GET") {
			return env.ASSETS.fetch(request);
		}

		// /api/posts           → list published posts
		// /api/posts/:slug     → single post detail
		if (pathname === "/api/posts") {
			return handleListPosts(env.DB, url);
		}

		const postMatch = pathname.match(/^\/api\/posts\/([^/]+)$/);
		if (postMatch) {
			return handleGetPost(env.DB, decodeURIComponent(postMatch[1]));
		}

		// Clean URL: /blog/article/:slug → serve article.html without redirect
		if (pathname.match(/^\/blog\/article\/.+$/)) {
			return env.ASSETS.fetch(new Request(new URL("/blog/article", url), request));
		}

		return env.ASSETS.fetch(request);
	},
};
