/**
 * Stateless HMAC tokens for waitlist confirm / unsubscribe links. Same format
 * and signing scheme as `unsubscribe-token.server.ts` so it stays familiar:
 *   token = base64url(payloadJson) "." base64url(hmacSha256(payloadJson))
 *   payload = { e: email, l: list, a: "confirm" | "unsub" }
 *
 * Signed here (the confirmation email is sent from this worker) and also by
 * dash.tunelab.id when it sends the launch blast, so both must use the same
 * shared secret (UNSUBSCRIBE_SECRET — reused to avoid provisioning a second
 * shared key). The `a` field scopes a token to one action so a confirm link
 * can't be replayed as an unsubscribe and vice versa.
 */

export type WaitlistAction = "confirm" | "unsub";

interface WaitlistPayload {
	e: string;
	l: string;
	a: WaitlistAction;
}

const encoder = new TextEncoder();

function base64UrlEncode(bytes: Uint8Array): string {
	let binary = "";
	for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
	return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlDecode(str: string): Uint8Array {
	const padded = str.replace(/-/g, "+").replace(/_/g, "/");
	const binary = atob(padded);
	const bytes = new Uint8Array(binary.length);
	for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
	return bytes;
}

async function getKey(secret: string, usage: KeyUsage): Promise<CryptoKey> {
	return crypto.subtle.importKey(
		"raw",
		encoder.encode(secret),
		{ name: "HMAC", hash: "SHA-256" },
		false,
		[usage],
	);
}

export async function signWaitlistToken(
	payload: { email: string; list: string; action: WaitlistAction },
	secret: string,
): Promise<string> {
	const body: WaitlistPayload = {
		e: payload.email,
		l: payload.list,
		a: payload.action,
	};
	const payloadB64 = base64UrlEncode(encoder.encode(JSON.stringify(body)));
	const key = await getKey(secret, "sign");
	const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(payloadB64));
	return `${payloadB64}.${base64UrlEncode(new Uint8Array(sig))}`;
}

export async function verifyWaitlistToken(
	token: string,
	secret: string,
	expectedAction: WaitlistAction,
): Promise<{ email: string; list: string } | null> {
	const parts = token.split(".");
	if (parts.length !== 2) return null;
	const [payloadB64, sigB64] = parts as [string, string];
	try {
		const key = await getKey(secret, "verify");
		const valid = await crypto.subtle.verify(
			"HMAC",
			key,
			base64UrlDecode(sigB64) as BufferSource,
			encoder.encode(payloadB64) as BufferSource,
		);
		if (!valid) return null;
		const payload = JSON.parse(
			new TextDecoder().decode(base64UrlDecode(payloadB64)),
		) as WaitlistPayload;
		if (!payload.e || !payload.l || payload.a !== expectedAction) return null;
		return { email: payload.e, list: payload.l };
	} catch {
		return null;
	}
}
