/**
 * Records emails sent from tunelab.id (the waitlist confirmation mail) against
 * the shared `usage_counters` table, so the email meter in the dashboard
 * (dash.tunelab.id) counts every Cloudflare send — not just the blasts.
 *
 * Kept self-contained here (no cross-repo imports). It writes the same generic
 * counter dash.tunelab.id does, at the same DAILY granularity and UTC period
 * key (Cloudflare's daily cap resets 00:00 UTC), so both the daily-cap (200/day)
 * and monthly (3,000/month) views stay consistent. Source of truth for the table
 * is Nada-Backend (migration 0045).
 */

/** 'YYYY-MM-DD' in UTC — matches the dashboard meter and Cloudflare's reset. */
function utcDayPeriod(date: Date = new Date()): string {
	const year = date.getUTCFullYear();
	const month = String(date.getUTCMonth() + 1).padStart(2, "0");
	const day = String(date.getUTCDate()).padStart(2, "0");
	return `${year}-${month}-${day}`;
}

/**
 * Bump the email-send counter by one for `source`. Best-effort: a metering
 * failure must never break the signup/email flow, so it only logs on error.
 */
export async function recordEmailSend(db: D1Database, source: string): Promise<void> {
	try {
		const now = Math.floor(Date.now() / 1000);
		await db
			.prepare(
				`INSERT INTO usage_counters (metric, period, source, count, updated_at)
				 VALUES ('email_send', ?, ?, 1, ?)
				 ON CONFLICT(metric, period, source) DO UPDATE SET
				   count = count + 1,
				   updated_at = excluded.updated_at`,
			)
			.bind(utcDayPeriod(), source, now)
			.run();
	} catch (e) {
		console.error("[usage] email_send counter bump failed", e);
	}
}
