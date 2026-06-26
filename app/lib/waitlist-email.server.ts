/**
 * Sends the waitlist confirmation email (the "notify me" double-opt-in step).
 * The signup row is already stored when this runs; this email just lets the
 * person confirm genuine interest by clicking through to /waitlist/confirm,
 * which stamps `confirmed_at`. Bilingual (id/en) to match the page they came
 * from. Uses the same Cloudflare Email Service binding and brand styling as the
 * dashboard's email-blast worker.
 */

import { type Locale } from "./locale";
import { type Platform, platformLabel } from "./platform";
import { signWaitlistToken } from "./waitlist-token.server";

// Same verified sender as the dashboard blast. Stable brand values, kept inline
// to avoid threading extra vars through the worker config.
const FROM = "no-reply@tunelab.id";
const FROM_NAME = "Nada by Tunelab";

/**
 * Structured shape of the Cloudflare Email Service binding (Email Sending). The
 * generated `SendEmail` type targets the raw MIME `EmailMessage` API, so we type
 * the structured `.send()` locally and reach the binding via a cast — same
 * message shape the dash.tunelab.id worker uses.
 */
interface EmailSenderBinding {
	send(message: {
		to: string | string[];
		from: string | { email: string; name?: string };
		subject: string;
		html?: string;
		text?: string;
		replyTo?: string | { email: string; name?: string };
	}): Promise<void>;
}

const C = {
	orange: "#ff5500",
	link: "#dd4a00",
	bg: "#f4f4f6",
	card: "#ffffff",
	heading: "#16161b",
	body: "#43434c",
	muted: "#8a8a94",
	border: "#e7e7ec",
};
const FONT = "'Space Grotesk',-apple-system,'Segoe UI',Roboto,Arial,sans-serif";

type Copy = {
	subject: string;
	preheader: string;
	heading: string;
	intro: string;
	button: string;
	fallback: string;
	ignore: string;
	footer: string;
};

// Copy is parameterized by the platform label (e.g. "Android", "Windows",
// "your platform") so one confirmation email serves every waitlist bucket.
function copyFor(locale: Locale, label: string): Copy {
	return COPY_BASE[locale](label);
}

const COPY_BASE: Record<Locale, (label: string) => Copy> = {
	id: (label) => ({
		subject: `Konfirmasi email kamu untuk kabar Nada ${label}`,
		preheader: "Satu klik lagi untuk masuk daftar tunggu.",
		heading: "Tinggal satu langkah lagi",
		intro: `Terima kasih sudah mendaftar! Klik tombol di bawah untuk mengonfirmasi kamu mau kami kabari soal Nada untuk ${label}.`,
		button: "Konfirmasi email saya",
		fallback: "Kalau tombolnya tidak bisa diklik, salin tautan ini ke browser:",
		ignore:
			"Bukan kamu yang mendaftar? Abaikan saja email ini, tidak ada yang akan dikirim lagi.",
		footer: "Kamu menerima email ini karena mendaftar di tunelab.id/nada/coming-soon.",
	}),
	en: (label) => ({
		subject: `Confirm your email for Nada ${label} updates`,
		preheader: "One click to join the waitlist.",
		heading: "One quick step left",
		intro: `Thanks for signing up! Tap the button below to confirm you'd like updates about Nada for ${label}.`,
		button: "Confirm my email",
		fallback: "If the button doesn't work, paste this link into your browser:",
		ignore:
			"Didn't sign up? Just ignore this email, we won't send you anything else.",
		footer: "You received this because you signed up at tunelab.id/nada/coming-soon.",
	}),
};

function escapeHtml(value: string): string {
	return value
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;");
}

function renderHtml(t: Copy, confirmUrl: string): string {
	const safeUrl = escapeHtml(confirmUrl);
	return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="color-scheme" content="light only" />
</head>
<body style="margin:0;padding:0;background:${C.bg};">
  <span style="display:none!important;visibility:hidden;opacity:0;color:transparent;height:0;width:0;overflow:hidden;">${escapeHtml(t.preheader)}</span>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.bg};padding:32px 16px;font-family:${FONT};">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:600px;background:${C.card};border:1px solid ${C.border};border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(16,16,24,0.06);">
        <tr><td style="height:4px;background:${C.orange};font-size:0;line-height:0;">&nbsp;</td></tr>
        <tr><td style="padding:28px 40px 4px;">
          <div style="font-size:20px;font-weight:700;letter-spacing:-0.02em;color:${C.orange};">Tunelab</div>
          <div style="margin-top:4px;font-size:13px;color:${C.muted};">Make music, anywhere</div>
        </td></tr>
        <tr><td style="padding:18px 40px 8px;font-family:${FONT};">
          <h1 style="margin:0 0 14px;font-size:24px;line-height:1.15;letter-spacing:-0.02em;color:${C.heading};font-weight:700;">${escapeHtml(t.heading)}</h1>
          <p style="margin:0 0 22px;font-size:15px;line-height:1.7;color:${C.body};">${escapeHtml(t.intro)}</p>
          <p style="margin:0 0 24px;">
            <a href="${safeUrl}" style="display:inline-block;background:${C.orange};color:#ffffff;text-decoration:none;font-weight:600;padding:13px 28px;border-radius:100px;font-size:15px;box-shadow:0 6px 18px rgba(255,85,0,0.25);">${escapeHtml(t.button)}</a>
          </p>
          <p style="margin:0 0 6px;font-size:13px;line-height:1.6;color:${C.muted};">${escapeHtml(t.fallback)}</p>
          <p style="margin:0 0 22px;font-size:13px;line-height:1.6;word-break:break-all;"><a href="${safeUrl}" style="color:${C.link};">${safeUrl}</a></p>
          <p style="margin:0;font-size:13px;line-height:1.6;color:${C.muted};">${escapeHtml(t.ignore)}</p>
        </td></tr>
        <tr><td style="padding:22px 40px 30px;border-top:1px solid ${C.border};font-size:12px;line-height:1.7;color:${C.muted};font-family:${FONT};">
          ${escapeHtml(t.footer)}
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function renderText(t: Copy, confirmUrl: string): string {
	return `${t.heading}

${t.intro}

${t.button}: ${confirmUrl}

${t.ignore}

${t.footer}`;
}

export async function sendWaitlistConfirmation(
	env: Cloudflare.Env,
	args: { email: string; list: string; platform: Platform; locale: Locale; origin: string },
): Promise<void> {
	const { email, list, platform, locale, origin } = args;
	const t = copyFor(locale, platformLabel(platform, locale));

	const token = await signWaitlistToken(
		{ email, list, action: "confirm" },
		env.UNSUBSCRIBE_SECRET,
	);
	const confirmUrl = `${origin}/waitlist/confirm?token=${encodeURIComponent(token)}&lang=${locale}`;

	const mailer = (env as unknown as { EMAIL: EmailSenderBinding }).EMAIL;
	await mailer.send({
		to: email,
		from: { email: FROM, name: FROM_NAME },
		subject: t.subject,
		html: renderHtml(t, confirmUrl),
		text: renderText(t, confirmUrl),
	});
}
