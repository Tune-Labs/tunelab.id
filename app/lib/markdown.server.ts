import { marked } from "marked";

marked.setOptions({ gfm: true, breaks: false });

/**
 * Render Markdown to an HTML string on the server.
 *
 * SECURITY NOTE: `marked` does NOT sanitize HTML — raw HTML in the source passes
 * through verbatim. This is intentional parity with the previous client-side
 * rendering, and is acceptable because article content is authored only by trusted
 * admins via the dashboard. If untrusted authoring is ever introduced, pipe this
 * output through a Workers-compatible sanitizer (e.g. DOMPurify) before handing it
 * to `dangerouslySetInnerHTML`.
 */
export function renderMarkdown(md: string | null | undefined): string {
  if (!md) return "";
  const html = marked.parse(md, { async: false }) as string;
  return minifyContentHtml(html);
}

/**
 * Collapse the inter-block whitespace `marked` emits (newlines + indentation), so
 * the SSR document isn't padded with blank, indented lines.
 *
 * Safe by construction: `<pre>` blocks are protected verbatim (their whitespace is
 * significant), and remaining newlines become a single space rather than being
 * deleted — so multi-line paragraphs and spaces between inline elements (em, code,
 * links) are preserved. This content is injected via `dangerouslySetInnerHTML`,
 * which React does not hydrate, so collapsing it cannot cause a hydration mismatch.
 */
function minifyContentHtml(html: string): string {
  const preserved: string[] = [];

  // Replace <pre>...</pre> with a whitespace-free token that survives the collapse
  // and trim passes unchanged (and won't realistically collide with article text).
  const guarded = html.replace(/<pre[\s\S]*?<\/pre>/gi, (block) => {
    preserved.push(block);
    return `@@PRE${preserved.length - 1}PRE@@`;
  });

  const collapsed = guarded
    .replace(/[\t ]*\r?\n[\t ]*/g, " ")
    .replace(/ {2,}/g, " ")
    .trim();

  return collapsed.replace(/@@PRE(\d+)PRE@@/g, (_match, i) => preserved[Number(i)]);
}
