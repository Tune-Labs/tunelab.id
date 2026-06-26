import { env } from "cloudflare:workers";
import { Form } from "react-router";
import { Footer, Nav } from "~/components/SiteChrome";
import { type Locale, pickLocale } from "~/lib/locale";
import { parsePlatformParam, platformLabel } from "~/lib/platform";
import { verifyWaitlistToken } from "~/lib/waitlist-token.server";
import type { Route } from "./+types/waitlist.unsubscribe";
import "~/styles/nada.css";

export function meta(): Route.MetaDescriptors {
	return [
		{ title: "Unsubscribe - Nada" },
		{ name: "robots", content: "noindex, nofollow" },
	];
}

// GET only verifies the token and shows a confirm button. We never opt anyone
// out on GET, so link scanners / prefetchers can't unsubscribe by accident. The
// write happens on POST, mirroring the user /unsubscribe route.
export async function loader({ request }: Route.LoaderArgs) {
	const url = new URL(request.url);
	const locale = pickLocale(request, url.searchParams.get("lang"));
	const token = url.searchParams.get("token");
	if (!token) return { state: "invalid" as const, locale };
	const payload = await verifyWaitlistToken(token, env.UNSUBSCRIBE_SECRET, "unsub");
	if (!payload) return { state: "invalid" as const, locale };
	const platform = parsePlatformParam(payload.list) ?? "other";
	return {
		state: "confirm" as const,
		locale,
		email: payload.email,
		token,
		label: platformLabel(platform, locale),
	};
}

export async function action({ request }: Route.ActionArgs) {
	const form = await request.formData();
	const locale: Locale = pickLocale(request, String(form.get("lang") ?? ""));
	const token = String(form.get("token") ?? "");
	const payload = await verifyWaitlistToken(token, env.UNSUBSCRIBE_SECRET, "unsub");
	if (!payload) return { state: "invalid" as const, locale };

	const now = Math.floor(Date.now() / 1000);
	await env.DB.prepare(
		"UPDATE waitlist SET unsubscribed_at = ?, updated_at = ? WHERE lower(email) = ? AND list = ?",
	)
		.bind(now, now, payload.email.toLowerCase(), payload.list)
		.run();

	const platform = parsePlatformParam(payload.list) ?? "other";
	return {
		state: "done" as const,
		locale,
		email: payload.email,
		label: platformLabel(platform, locale),
	};
}

type Copy = {
	confirmHeading: string;
	confirmDesc: (email: string, label: string) => React.ReactNode;
	button: string;
	doneHeading: string;
	doneDesc: (email: string, label: string) => React.ReactNode;
	invalidHeading: string;
	invalidDesc: string;
};

const COPY: Record<Locale, Copy> = {
	id: {
		confirmHeading: "Berhenti dapat kabar?",
		confirmDesc: (email, label) => (
			<>
				Klik di bawah untuk berhenti menerima email tentang Nada untuk {label} di{" "}
				<strong>{email}</strong>.
			</>
		),
		button: "Berhenti berlangganan",
		doneHeading: "Kamu sudah berhenti berlangganan",
		doneDesc: (email, label) => (
			<>
				<strong>{email}</strong> tidak akan lagi menerima email tentang Nada untuk{" "}
				{label}.
			</>
		),
		invalidHeading: "Tautan tidak valid",
		invalidDesc:
			"Tautan ini tidak valid atau sudah kedaluwarsa. Kalau kamu masih menerima email yang tidak diinginkan, balas saja salah satunya.",
	},
	en: {
		confirmHeading: "Stop these updates?",
		confirmDesc: (email, label) => (
			<>
				Click below to stop receiving emails about Nada for {label} at{" "}
				<strong>{email}</strong>.
			</>
		),
		button: "Unsubscribe me",
		doneHeading: "You're unsubscribed",
		doneDesc: (email, label) => (
			<>
				<strong>{email}</strong> won't receive any more emails about Nada for{" "}
				{label}.
			</>
		),
		invalidHeading: "Link not valid",
		invalidDesc:
			"This link is invalid or has expired. If you keep receiving emails you don't want, just reply to one of them.",
	},
};

export default function WaitlistUnsubscribe({
	loaderData,
	actionData,
}: Route.ComponentProps) {
	const data = actionData ?? loaderData;
	const t = COPY[data.locale];

	let heading: string;
	let body: React.ReactNode;
	if (data.state === "invalid") {
		heading = t.invalidHeading;
		body = <p className="hero-desc">{t.invalidDesc}</p>;
	} else if (data.state === "done") {
		heading = t.doneHeading;
		body = <p className="hero-desc">{t.doneDesc(data.email, data.label)}</p>;
	} else {
		heading = t.confirmHeading;
		body = (
			<>
				<p className="hero-desc">{t.confirmDesc(data.email, data.label)}</p>
				<Form method="post">
					<input type="hidden" name="token" value={data.token} />
					<input type="hidden" name="lang" value={data.locale} />
					<button
						type="submit"
						className="btn-primary"
						style={{ border: "none", cursor: "pointer" }}
					>
						{t.button}
					</button>
				</Form>
			</>
		);
	}

	return (
		<>
			<Nav active="nada" />
			<div className="nada-page">
				<section className="hero">
					<div className="hero-glow" />
					<div className="hero-ring r1" />
					<div className="hero-ring r2" />
					<h1>{heading}</h1>
					{body}
				</section>
			</div>
			<Footer />
		</>
	);
}
