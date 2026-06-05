import { redirect } from "react-router";
import type { Route } from "./+types/home";

// "/" is not a real page — the marketing home is the static /nada landing.
export function loader(_: Route.LoaderArgs) {
  return redirect("/nada");
}
