// Secrets/vars not present in the generated worker-configuration.d.ts
// (which only knows bindings declared in wrangler.toml). UNSUBSCRIBE_SECRET is
// set via `wrangler secret put` and MUST match the dashboard worker's secret
// of the same name — the dashboard signs unsubscribe tokens, this worker
// verifies them.
declare namespace Cloudflare {
	interface Env {
		UNSUBSCRIBE_SECRET: string;
	}
}
