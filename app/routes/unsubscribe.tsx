import { env } from "cloudflare:workers";
import { Form } from "react-router";
import { ContentPage } from "~/components/ContentPage";
import { verifyUnsubscribeToken } from "~/lib/unsubscribe-token.server";
import type { Route } from "./+types/unsubscribe";

export function meta(): Route.MetaDescriptors {
	return [
		{ title: "Unsubscribe - Tunelab" },
		{ name: "robots", content: "noindex, nofollow" },
	];
}

// GET only verifies the token and shows a confirm button — we do NOT
// unsubscribe on GET, so link-scanners / prefetchers can't opt people out by
// accident. The actual write happens on the POST below.
export async function loader({ request }: Route.LoaderArgs) {
	const token = new URL(request.url).searchParams.get("token");
	if (!token) return { state: "invalid" as const };
	const payload = await verifyUnsubscribeToken(token, env.UNSUBSCRIBE_SECRET);
	if (!payload) return { state: "invalid" as const };
	return { state: "confirm" as const, email: payload.email, token };
}

export async function action({ request }: Route.ActionArgs) {
	const form = await request.formData();
	const token = String(form.get("token") ?? "");
	const payload = await verifyUnsubscribeToken(token, env.UNSUBSCRIBE_SECRET);
	if (!payload) return { state: "invalid" as const };

	// Drizzle stores these timestamp columns as Unix epoch SECONDS.
	const now = Math.floor(Date.now() / 1000);
	await env.DB.prepare(
		"UPDATE users SET unsubscribed_at = ?, updated_at = ? WHERE id = ? AND lower(email) = ?",
	)
		.bind(now, now, payload.userId, payload.email.toLowerCase())
		.run();

	return { state: "done" as const, email: payload.email };
}

export default function Unsubscribe({ loaderData, actionData }: Route.ComponentProps) {
	const data = actionData ?? loaderData;

	if (data.state === "invalid") {
		return (
			<ContentPage title="Unsubscribe link invalid">
				<p>
					This unsubscribe link is invalid or has expired. If you keep receiving emails you don't
					want, reply to one of them and we'll remove you manually.
				</p>
			</ContentPage>
		);
	}

	if (data.state === "done") {
		return (
			<ContentPage title="You're unsubscribed">
				<p>
					<strong>{data.email}</strong> has been removed from Tunelab marketing emails. You won't
					receive any more blasts at this address.
				</p>
				<p>Account and transactional emails (e.g. security notices) are not affected.</p>
			</ContentPage>
		);
	}

	return (
		<ContentPage title="Unsubscribe from Tunelab emails">
			<p>
				Click below to stop receiving marketing emails at <strong>{data.email}</strong>.
			</p>
			<Form method="post">
				<input type="hidden" name="token" value={data.token} />
				<button type="submit" className="nav-cta" style={{ border: "none", cursor: "pointer" }}>
					Unsubscribe me
				</button>
			</Form>
		</ContentPage>
	);
}
