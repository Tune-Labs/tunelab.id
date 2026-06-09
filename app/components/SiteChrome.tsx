import { Link } from "react-router";
import { AppleIcon, LogoMark } from "./icons";

const DOWNLOAD_URL = "https://go.tunelab.id/download";

// All site pages (/nada, policy pages, /blog, articles) are SSR routes, so we use
// <Link> everywhere for client-side transitions + prefetch. The download link is an
// external redirect, so it stays a plain <a>.

export type NavActive = "nada" | "blog" | "privacy" | "terms";

export function Nav({ active }: { active?: NavActive }) {
  return (
    <nav>
      <Link to="/nada" className="nav-logo">
        <LogoMark size={28} />
        <img src="/nada/img/logo-text.svg" alt="Nada" className="logo-text" />
      </Link>
      <div className="nav-links">
        <Link to="/nada" className={active === "nada" ? "active" : undefined}>
          Nada
        </Link>
        <Link to="/blog" className={active === "blog" ? "active" : undefined}>
          Blog
        </Link>
        <Link
          to="/nada/privacy-policy.html"
          className={active === "privacy" ? "active" : undefined}
        >
          Privacy
        </Link>
        <Link
          to="/nada/terms-of-use.html"
          className={active === "terms" ? "active" : undefined}
        >
          Terms
        </Link>
      </div>
      <a href={DOWNLOAD_URL} className="nav-cta">
        <AppleIcon size={14} />
        Download Free
      </a>
    </nav>
  );
}

export function Footer() {
  return (
    <footer>
      <Link to="/nada" className="foot-logo">
        <LogoMark size={24} />
        <span className="foot-word">TuneLab</span>
      </Link>
      <p>&copy; 2026 TuneLab. All rights reserved.</p>
      <div className="foot-links">
        <Link to="/nada">Nada</Link>
        <Link to="/blog">Blog</Link>
        <Link to="/nada/privacy-policy.html">Privacy</Link>
        <Link to="/nada/terms-of-use.html">Terms</Link>
      </div>
    </footer>
  );
}
