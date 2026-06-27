/**
 * Lightweight platform detection for the "coming soon / notify me" page. Pure
 * function over the User-Agent string so it runs in the SSR loader. We only need
 * coarse buckets — enough to (a) show the right copy and (b) tag the waitlist
 * signup with the platform someone is waiting for.
 */

export type Platform = "ios" | "macos" | "android" | "windows" | "linux" | "other";

/** How the page should frame itself for a given platform. */
export type PlatformMode = "available" | "android" | "neutral";

export function detectPlatform(ua: string): Platform {
	const s = ua.toLowerCase();
	// iOS/iPadOS first (their UA also contains "mac"/"like mac").
	if (/iphone|ipad|ipod/.test(s)) return "ios";
	// Android before Linux — Android UAs contain "linux".
	if (/android/.test(s)) return "android";
	if (/windows|win32|win64/.test(s)) return "windows";
	if (/macintosh|mac os x/.test(s)) return "macos";
	if (/cros/.test(s)) return "other"; // ChromeOS
	if (/linux/.test(s)) return "linux";
	return "other";
}

/** Validate a `?platform=` / form override; null if not a known platform. */
export function parsePlatformParam(value: string | null): Platform | null {
	switch (value) {
		case "ios":
		case "macos":
		case "android":
		case "windows":
		case "linux":
		case "other":
			return value;
		default:
			return null;
	}
}

export function platformMode(p: Platform): PlatformMode {
	if (p === "ios" || p === "macos") return "available"; // already shipped
	if (p === "android") return "android"; // genuinely coming
	return "neutral"; // windows / linux / other — no promise, just collect interest
}

/** Human label for the platform, used in headings and emails. */
export function platformLabel(p: Platform, locale: "id" | "en"): string {
	switch (p) {
		case "ios":
			return "iOS";
		case "macos":
			return "iPad";
		case "android":
			return "Android";
		case "windows":
			return "Windows";
		case "linux":
			return "Linux";
		default:
			return locale === "id" ? "platform kamu" : "your platform";
	}
}
