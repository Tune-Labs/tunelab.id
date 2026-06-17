/**
 * Verifies unsubscribe tokens minted by the dashboard worker. Keep this in
 * sync with dash.tunelab.id's `src/worker/lib/unsubscribe-token.ts` — the two
 * repos are self-contained (no shared import), so the format and secret must
 * match. Token: base64url(payloadJson) "." base64url(hmacSha256(payloadJson)),
 * payload = { u: userId, e: email }.
 */

interface UnsubscribePayload {
	u: string;
	e: string;
}

const encoder = new TextEncoder();

async function getKey(secret: string): Promise<CryptoKey> {
	return crypto.subtle.importKey(
		"raw",
		encoder.encode(secret),
		{ name: "HMAC", hash: "SHA-256" },
		false,
		["verify"],
	);
}

function base64UrlDecode(str: string): Uint8Array {
	const padded = str.replace(/-/g, "+").replace(/_/g, "/");
	const binary = atob(padded);
	const bytes = new Uint8Array(binary.length);
	for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
	return bytes;
}

export async function verifyUnsubscribeToken(
	token: string,
	secret: string,
): Promise<{ userId: string; email: string } | null> {
	const parts = token.split(".");
	if (parts.length !== 2) return null;
	const [payloadB64, sigB64] = parts as [string, string];
	try {
		const key = await getKey(secret);
		const valid = await crypto.subtle.verify(
			"HMAC",
			key,
			base64UrlDecode(sigB64) as BufferSource,
			encoder.encode(payloadB64) as BufferSource,
		);
		if (!valid) return null;
		const payload = JSON.parse(
			new TextDecoder().decode(base64UrlDecode(payloadB64)),
		) as UnsubscribePayload;
		if (!payload.u || !payload.e) return null;
		return { userId: payload.u, email: payload.e };
	} catch {
		return null;
	}
}
