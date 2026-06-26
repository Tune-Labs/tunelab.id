// Secrets/vars not present in the generated worker-configuration.d.ts
// (which only knows bindings declared in wrangler.toml). UNSUBSCRIBE_SECRET is
// set via `wrangler secret put` and MUST match the dashboard worker's secret
// of the same name — the dashboard signs unsubscribe tokens, this worker
// verifies them.
//
// The EMAIL (Cloudflare Email Service) binding is intentionally NOT augmented
// here: `wrangler types` generates it as the raw-MIME `SendEmail` type, and the
// Email Sending product's binding actually takes a structured message. To avoid
// a conflicting-declaration merge, waitlist-email.server.ts accesses it through
// a local cast instead.
declare namespace Cloudflare {
	interface Env {
		UNSUBSCRIBE_SECRET: string;
	}
}
