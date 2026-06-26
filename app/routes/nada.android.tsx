import { redirect } from "react-router";
import type { Route } from "./+types/nada.android";

// Backwards-compatible alias. The page generalized to /nada/coming-soon (it
// adapts copy per platform); /nada/android keeps working by redirecting with the
// platform preset. Prefer linking straight to /nada/coming-soon?platform=… from
// go.tunelab.id to skip this hop.
export function loader({ request }: Route.LoaderArgs) {
	const lang = new URL(request.url).searchParams.get("lang");
	const to = `/nada/coming-soon?platform=android${lang ? `&lang=${encodeURIComponent(lang)}` : ""}`;
	return redirect(to, 302);
}
