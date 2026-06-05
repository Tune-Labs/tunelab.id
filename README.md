# tunelab.id

Marketing site + blog for TuneLab / Nada, running on **Cloudflare Workers**.

- **Landing** (`/nada`, privacy, terms): static HTML assets in `public/` — served
  directly by Cloudflare, untouched by the migration.
- **Blog** (`/blog`, `/blog/article/:slug`): **server-side rendered** with
  **React Router v7 + React 19 + Vite**, data from **Cloudflare D1** (`nada-db`).
- **JSON API** (`/api/posts`, `/api/posts/:slug`): resource routes (kept for the
  blog's "load more" pagination and any external consumers).
- **SEO**: `/sitemap.xml`, `/robots.txt`, per-article `<title>` / canonical /
  OpenGraph / Twitter tags + `Article` JSON-LD — all rendered at request time.

## Stack

React Router v7 (framework mode, SSR) · React 19 · Vite 8 ·
`@cloudflare/vite-plugin` · Cloudflare Workers + D1 · `marked` (Markdown).

## Project layout

```
app/
  root.tsx                 document shell, fonts, error boundary
  routes.ts                route table
  routes/
    home.tsx               "/"  → redirect to /nada
    blog.tsx               "/blog" list (SSR + load-more)
    article.tsx            "/blog/article/:slug" (SSR + full SEO + JSON-LD)
    api.posts.tsx          "/api/posts" (JSON)
    api.posts.$slug.tsx    "/api/posts/:slug" (JSON)
    sitemap.ts             "/sitemap.xml"
    robots.ts              "/robots.txt"
  components/              Nav, Footer, icons
  lib/
    posts.server.ts        D1 queries (server-only)
    markdown.server.ts     Markdown → HTML (server-only)
    format.ts              deterministic (UTC) date formatting
  app.css                  ported blog design system
workers/app.ts             Worker entry → React Router request handler
public/                    static assets (nada landing, images) → build/client
wrangler.toml              Worker + D1 + custom-domain config
```

## Develop

```sh
pnpm install
pnpm dev          # http://localhost:5173
```

`pnpm dev` runs the Worker in workerd with a **local** D1 (empty by default).
Seed it for testing:

```sh
# create the table + a couple of rows in the LOCAL D1
npx wrangler d1 execute nada-db --local --command "CREATE TABLE IF NOT EXISTS articles (...)"
# (production data lives in the remote nada-db; the dashboard owns the schema)
```

To develop against **remote** D1 data (like the old `wrangler dev --remote`),
enable remote bindings on the `[[d1_databases]]` entry — ask before wiring this,
as it requires `wrangler login`.

## Type-check / build / deploy

```sh
pnpm typecheck    # wrangler types + react-router typegen + tsc
pnpm build        # → build/client (assets) + build/server (worker)
pnpm deploy       # react-router build && wrangler deploy
```

`react-router build` writes `.wrangler/deploy/config.json`, so plain
`wrangler deploy` automatically picks up the built Worker + assets and inherits
the D1 binding and custom-domain routes from `wrangler.toml`.

## Security note

Article Markdown is rendered to HTML server-side with `marked`, which does **not**
sanitize HTML. This is safe only while content is authored by trusted admins. If
untrusted authoring is added, sanitize the output before `dangerouslySetInnerHTML`
(see `app/lib/markdown.server.ts`).
