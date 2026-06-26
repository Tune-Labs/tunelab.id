/**
 * Lightweight locale handling for the bilingual marketing pages (Android
 * waitlist + its confirm/unsubscribe screens). Deliberately tiny — no i18n
 * library — since only a handful of pages are bilingual. Each page carries its
 * own copy dictionary; this just decides which one to show.
 *
 * Indonesia-first: the default is "id" unless the `?lang=` override or the
 * visitor's browser clearly prefers English.
 */

export type Locale = "id" | "en";

export const LOCALES: readonly Locale[] = ["id", "en"];

export function isLocale(value: unknown): value is Locale {
	return value === "id" || value === "en";
}

/** Resolve the active locale from an explicit `?lang=` override, else the
 *  Accept-Language header, defaulting to Indonesian. */
export function pickLocale(request: Request, override?: string | null): Locale {
	if (isLocale(override)) return override;
	const first = (request.headers.get("accept-language") ?? "")
		.toLowerCase()
		.split(",")[0]
		?.trim();
	return first?.startsWith("en") ? "en" : "id";
}

/** The opposite locale — for the "switch language" toggle link. */
export function otherLocale(locale: Locale): Locale {
	return locale === "id" ? "en" : "id";
}
