import { env } from "cloudflare:workers";
import { type MetaDescriptor, Form, Link, useSearchParams } from "react-router";
import { Footer, Nav } from "~/components/SiteChrome";
import { type Locale, otherLocale, pickLocale } from "~/lib/locale";
import {
	type Platform,
	detectPlatform,
	parsePlatformParam,
	platformLabel,
	platformMode,
} from "~/lib/platform";
import { siteOrigin } from "~/lib/site";
import { sendWaitlistConfirmation } from "~/lib/waitlist-email.server";
import type { Route } from "./+types/coming-soon";
import "~/styles/nada.css";

// Dedicated always-App-Store link (NOT /download). /download may device-route
// non-Apple users to this very page; /ios is unconditional, so the badge here
// can never loop back.
const APPSTORE_URL = "https://go.tunelab.id/ios";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Decorative waveform bar heights (px), matching the /nada landing hero —
// rendered deterministically so SSR and client hydration agree (no Math.random).
const WAVE = [
	6, 10, 18, 28, 42, 54, 48, 36, 24, 16, 10, 8, 14, 26, 40, 52, 56, 44, 32, 20,
	14, 10, 18, 32, 46, 54, 48, 36, 24, 14,
];

type Strings = {
	// shared form + chrome
	placeholder: string;
	submit: string;
	note: string;
	successHeading: string;
	successBody: (email: string) => React.ReactNode;
	successNote: string;
	errInvalid: string;
	errGeneric: string;
	switchTo: string;
	iosPre: string;
	// available (Apple) mode
	availTag: string;
	availHeading: (label: string) => string;
	availDesc: string;
	availCta: string;
	// android mode
	androidTag: string;
	androidH1Post: string;
	androidDesc: string;
	// neutral mode (windows / linux / other)
	neutralTag: string;
	neutralH1Pre: string;
	neutralDesc: (label: string) => string;
};

const COPY: Record<Locale, Strings> = {
	id: {
		placeholder: "kamu@email.com",
		submit: "Beri tahu saya",
		note: "Kami cuma kirim email saat sudah siap. Tanpa spam.",
		successHeading: "Cek email kamu",
		successBody: (email) => (
			<>
				Kami sudah mengirim email konfirmasi ke <strong>{email}</strong>. Klik
				tautan di dalamnya supaya kamu resmi masuk daftar dan pasti dapat kabar.
			</>
		),
		successNote: "Tidak ada emailnya? Cek folder spam atau promosi.",
		errInvalid: "Masukkan alamat email yang valid.",
		errGeneric: "Ada yang salah. Coba lagi sebentar.",
		switchTo: "English",
		iosPre: "Pakai iPhone atau Mac?",
		availTag: "Sudah Tersedia",
		availHeading: (label) => `Nada sudah hadir untuk ${label}`,
		availDesc: "Kabar baik! Nada sudah bisa kamu unduh sekarang.",
		availCta: "Unduh Nada",
		androidTag: "Android • Segera Hadir",
		androidH1Post: "lagi kami siapkan",
		androidDesc:
			"Nada saat ini tersedia untuk iPhone, iPad, dan Mac. Versi Android sedang kami kembangkan. Tinggalkan email kamu, dan kami kabari begitu siap diunduh.",
		neutralTag: "Belum Tersedia",
		neutralH1Pre: "Nada belum ada di",
		neutralDesc: (label) =>
			`Untuk sekarang Nada ada di iPhone, iPad, dan Mac. Tinggalkan email kamu, dan kalau kami merilis untuk ${label}, kamu yang pertama tahu.`,
	},
	en: {
		placeholder: "you@email.com",
		submit: "Notify me",
		note: "We'll only email you when it's ready. No spam.",
		successHeading: "Check your inbox",
		successBody: (email) => (
			<>
				We've sent a confirmation email to <strong>{email}</strong>. Click the
				link inside to lock in your spot and make sure you hear from us.
			</>
		),
		successNote: "Don't see it? Check your spam or promotions folder.",
		errInvalid: "Please enter a valid email address.",
		errGeneric: "Something went wrong. Please try again.",
		switchTo: "Bahasa Indonesia",
		iosPre: "On iPhone or Mac?",
		availTag: "Available Now",
		availHeading: (label) => `Nada is here for ${label}`,
		availDesc: "Good news! Nada is ready to download right now.",
		availCta: "Get Nada",
		androidTag: "Android • Coming Soon",
		androidH1Post: "is on the way",
		androidDesc:
			"Nada is available on iPhone, iPad, and Mac today. The Android version is in active development. Drop your email and we'll let you know the moment it's ready.",
		neutralTag: "Not Available Yet",
		neutralH1Pre: "Nada isn't on",
		neutralDesc: (label) =>
			`For now Nada is on iPhone, iPad, and Mac. Leave your email, and if we ship for ${label}, you'll be the first to know.`,
	},
};

export function meta({ data }: Route.MetaArgs): MetaDescriptor[] {
	const locale: Locale = data?.locale ?? "id";
	const platform: Platform = data?.platform ?? "other";
	const origin = data?.origin ?? "";
	const t = COPY[locale];
	const label = platformLabel(platform, locale);
	const mode = platformMode(platform);
	const title =
		mode === "available"
			? `${t.availHeading(label)}`
			: mode === "android"
				? locale === "id"
					? "Nada untuk Android: Segera Hadir"
					: "Nada for Android: Coming Soon"
				: `${t.neutralH1Pre} ${label}`.trim();
	const description =
		mode === "available"
			? t.availDesc
			: mode === "android"
				? t.androidDesc
				: t.neutralDesc(label);
	const url = `${origin}/nada/coming-soon`;
	return [
		{ title },
		{ name: "description", content: description },
		{ tagName: "link", rel: "canonical", href: url },
		{ property: "og:type", content: "website" },
		{ property: "og:url", content: url },
		{ property: "og:title", content: title },
		{ property: "og:description", content: description },
		{ property: "og:locale", content: locale === "id" ? "id_ID" : "en_US" },
		{ name: "twitter:card", content: "summary" },
		{ name: "twitter:title", content: title },
		{ name: "twitter:description", content: description },
	];
}

export function loader({ request }: Route.LoaderArgs) {
	const url = new URL(request.url);
	const locale = pickLocale(request, url.searchParams.get("lang"));
	const forced = parsePlatformParam(url.searchParams.get("platform"));
	const platform = forced ?? detectPlatform(request.headers.get("user-agent") ?? "");
	return { locale, platform, origin: siteOrigin(request) };
}

export async function action({ request }: Route.ActionArgs) {
	const form = await request.formData();
	const locale: Locale = pickLocale(request, String(form.get("lang") ?? ""));
	const platform: Platform = parsePlatformParam(String(form.get("platform") ?? "")) ?? "other";
	const email = String(form.get("email") ?? "")
		.trim()
		.toLowerCase();

	if (!EMAIL_RE.test(email) || email.length > 254) {
		return { status: "error" as const, locale, platform, error: "invalid" as const };
	}

	// The waitlist is bucketed by platform via the `list` column.
	const list = platform;
	const now = Math.floor(Date.now() / 1000);
	try {
		await env.DB.prepare(
			`INSERT INTO waitlist (id, email, list, locale, source, created_at, updated_at)
			 VALUES (?, ?, ?, ?, ?, ?, ?)
			 ON CONFLICT(email, list) DO UPDATE SET
			   locale = excluded.locale,
			   unsubscribed_at = NULL,
			   updated_at = excluded.updated_at`,
		)
			.bind(crypto.randomUUID(), email, list, locale, "/nada/coming-soon", now, now)
			.run();
	} catch {
		return { status: "error" as const, locale, platform, error: "generic" as const };
	}

	// The row is saved regardless; a failed confirmation send must not lose the
	// signup. We just won't surface a hard error to the user.
	try {
		await sendWaitlistConfirmation(env, {
			email,
			list,
			platform,
			locale,
			origin: siteOrigin(request),
		});
	} catch {
		// swallow — the lead is captured; they can re-submit to retry the email.
	}

	return { status: "ok" as const, locale, platform, email };
}

function AppStoreBadge() {
	return (
		<a href={APPSTORE_URL} className="download-badge">
			<img src="/nada/img/download-appstore.svg" alt="Download on the App Store" />
		</a>
	);
}

export default function ComingSoon({ loaderData, actionData }: Route.ComponentProps) {
	const [params] = useSearchParams();
	const locale: Locale = actionData?.locale ?? loaderData.locale;
	const platform: Platform = actionData?.platform ?? loaderData.platform;
	const t = COPY[locale];
	const mode = platformMode(platform);
	const label = platformLabel(platform, locale);
	const other = otherLocale(locale);
	const toggleHref = `/nada/coming-soon?lang=${other}&platform=${platform}`;
	// Preserve the active language + platform across the POST.
	const formLang = params.get("lang") ?? locale;

	const success = actionData?.status === "ok" ? actionData : null;
	const errorKey = actionData?.status === "error" ? actionData.error : null;

	return (
		<>
			<Nav active="nada" />
			<div className="nada-page">
				<section className="hero">
					<div className="hero-glow" />
					<div className="hero-ring r1" />
					<div className="hero-ring r2" />
					<div className="hero-ring r3" />

					{mode === "available" ? (
						<>
							<span className="hero-tag">
								<span className="pulse" />
								{t.availTag}
							</span>
							<h1>{t.availHeading(label)}</h1>
							<p className="hero-desc">{t.availDesc}</p>
							<div className="hero-actions">
								<AppStoreBadge />
							</div>
						</>
					) : (
						<>
							<span className="hero-tag">
								<span className="pulse" />
								{mode === "android" ? t.androidTag : t.neutralTag}
							</span>

							<h1>
								{mode === "android" ? (
									<>
										Nada untuk <span className="accent">Android</span>
										<br />
										{t.androidH1Post}
									</>
								) : (
									<>
										{t.neutralH1Pre} <span className="accent">{label}</span>
									</>
								)}
							</h1>

							{success ? (
								<div className="waitlist-success">
									<h2>{t.successHeading}</h2>
									<p>{t.successBody(success.email)}</p>
									<p className="waitlist-success-note">{t.successNote}</p>
								</div>
							) : (
								<>
									<p className="hero-desc">
										{mode === "android" ? t.androidDesc : t.neutralDesc(label)}
									</p>

									<Form method="post" className="waitlist-form" replace>
										<input type="hidden" name="lang" value={formLang} />
										<input type="hidden" name="platform" value={platform} />
										<input
											type="email"
											name="email"
											required
											autoComplete="email"
											inputMode="email"
											placeholder={t.placeholder}
											aria-label={t.placeholder}
											className="waitlist-input"
										/>
										<button type="submit" className="btn-primary">
											{t.submit}
										</button>
									</Form>

									{errorKey && (
										<p className="waitlist-error" role="alert">
											{errorKey === "invalid" ? t.errInvalid : t.errGeneric}
										</p>
									)}

									<p className="waitlist-note">{t.note}</p>

									<div className="waitlist-ios">
										<span>{t.iosPre}</span>
										<AppStoreBadge />
									</div>
								</>
							)}
						</>
					)}

					<div className="hero-bottom">
						<div className="waveform" aria-hidden="true">
							{WAVE.map((h, i) => (
								<span
									key={i}
									className="bar"
									style={
										{
											"--h": `${h}px`,
											"--dur": `${(0.7 + (i % 5) * 0.18).toFixed(2)}s`,
											"--delay": `${(i * 0.038).toFixed(2)}s`,
										} as React.CSSProperties
									}
								/>
							))}
						</div>
					</div>

					<Link to={toggleHref} className="lang-toggle" prefetch="intent">
						{t.switchTo}
					</Link>
				</section>
			</div>
			<Footer />
		</>
	);
}
