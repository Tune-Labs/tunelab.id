import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";
import { Nav, Footer } from "./components/SiteChrome";

export const links: Route.LinksFunction = () => [
  { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap",
  },
];

export const meta: Route.MetaFunction = () => [
  { title: "TuneLab" },
  {
    name: "description",
    content: "Stories, updates, and insights from the TuneLab team.",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const isNotFound = isRouteErrorResponse(error) && error.status === 404;

  let title = "Something went wrong";
  let detail = "An unexpected error occurred. Please try again.";

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      title = "Page not found";
      detail = "The page you're looking for doesn't exist or was moved.";
    } else {
      title = `${error.status} ${error.statusText}`;
    }
  } else if (import.meta.env.DEV && error instanceof Error) {
    detail = error.message;
  }

  return (
    <>
      <Nav active="blog" />
      <main>
        <div className="state-error">
          <h1 className="state-title" style={{ fontSize: "1.6rem", marginBottom: "0.6rem" }}>
            {title}
          </h1>
          <p className="state-sub">{detail}</p>
          <p className="state-sub" style={{ marginTop: "1rem" }}>
            <a href="/blog">← Back to Blog</a>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
