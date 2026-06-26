import { env } from "cloudflare:workers";
import { Link } from "react-router";
import { Footer, Nav } from "~/components/SiteChrome";
import { type Locale, pickLocale } from "~/lib/locale";
import { parsePlatformParam, platformLabel } from "~/lib/platform";
import { verifyWaitlistToken } from "~/lib/waitlist-token.server";
import type { Route } from "./+types/waitlist.confirm";
import "~/styles/nada.css";

// Always-App-Store link (see /nada/coming-soon), never /download, which may
// device-route non-Apple users back into the waitlist funnel.
const APPSTORE_URL = "https://go.tunelab.id/ios";

export function meta(): Route.MetaDescriptors {
	return [
		{ title: "Confirm - Nada" },
		{ name: "robots", content: "noindex, nofollow" },
	];
}

export async function loader({ request }: Route.LoaderArgs) {
	const url = new URL(request.url);
	const locale = pickLocale(request, url.searchParams.get("lang"));
	const token = url.searchParams.get("token");
	if (!token) return { state: "invalid" as const, locale };

	const payload = await verifyWaitlistToken(token, env.UNSUBSCRIBE_SECRET, "confirm");
	if (!payload) return { state: "invalid" as const, locale };

	// Stamp confirmed_at once. Idempotent: a second click (or a prefetch) is a
	// no-op because of the `confirmed_at IS NULL` guard.
	const now = Math.floor(Date.now() / 1000);
	await env.DB.prepare(
		"UPDATE waitlist SET confirmed_at = ?, unsubscribed_at = NULL, updated_at = ? WHERE lower(email) = ? AND list = ? AND confirmed_at IS NULL",
	)
		.bind(now, now, payload.email.toLowerCase(), payload.list)
		.run();

	const platform = parsePlatformParam(payload.list) ?? "other";
	return {
		state: "confirmed" as const,
		locale,
		email: payload.email,
		label: platformLabel(platform, locale),
	};
}

type Copy = {
	heading: string;
	desc: (email: string, label: string) => React.ReactNode;
	cta: string;
	invalidHeading: string;
	invalidDesc: string;
	invalidCta: string;
};

const COPY: Record<Locale, Copy> = {
	id: {
		heading: "Kamu resmi masuk daftar",
		desc: (email, label) => (
			<>
				Kami akan mengabari kamu di <strong>{email}</strong> soal Nada untuk{" "}
				{label}. Sampai jumpa!
			</>
		),
		cta: "Pakai iPhone atau Mac? Unduh Nada",
		invalidHeading: "Tautan tidak valid",
		invalidDesc:
			"Tautan konfirmasi ini tidak valid atau sudah kedaluwarsa. Coba daftar lagi ya.",
		invalidCta: "Daftar lagi",
	},
	en: {
		heading: "You're on the list",
		desc: (email, label) => (
			<>
				We'll keep <strong>{email}</strong> posted about Nada for {label}. See you
				there!
			</>
		),
		cta: "On iPhone or Mac? Get Nada",
		invalidHeading: "Link not valid",
		invalidDesc: "This confirmation link is invalid or has expired. Try signing up again.",
		invalidCta: "Sign up again",
	},
};

export default function WaitlistConfirm({ loaderData }: Route.ComponentProps) {
	const t = COPY[loaderData.locale];

	return (
		<>
			<Nav active="nada" />
			<div className="nada-page">
				<section className="hero">
					<div className="hero-glow" />
					<div className="hero-ring r1" />
					<div className="hero-ring r2" />
					{loaderData.state === "invalid" ? (
						<>
							<h1>{t.invalidHeading}</h1>
							<p className="hero-desc">{t.invalidDesc}</p>
							<Link to="/nada/coming-soon" className="btn-primary">
								{t.invalidCta}
							</Link>
						</>
					) : (
						<>
							<h1>{t.heading}</h1>
							<p className="hero-desc">{t.desc(loaderData.email, loaderData.label)}</p>
							<a href={APPSTORE_URL} className="btn-primary">
								{t.cta}
							</a>
						</>
					)}
				</section>
			</div>
			<Footer />
		</>
	);
}
