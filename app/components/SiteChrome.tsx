import { useState } from "react";
import { Link } from "react-router";
import { CloseIcon, LogoMark, MenuIcon } from "./icons";

const DOWNLOAD_URL = "https://go.tunelab.id/download";

// Shared site chrome (nav + footer) used on every SSR page — /nada, the policy
// pages, /blog, and articles — so the header/footer are identical sitewide. The
// design matches the /nada landing page. Internal links use <Link> for
// client-side transitions + prefetch; the download link is an external redirect,
// so it stays a plain <a>.

export type NavActive = "nada" | "blog" | "privacy" | "terms" | "contact";

export function Nav({ active }: { active?: NavActive } = {}) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <nav>
      <Link to="/nada" className="nav-logo" onClick={close}>
        <img src="/nada/img/logo-text.svg" alt="Nada" className="logo-text" />
      </Link>
      <button
        type="button"
        className="nav-burger"
        aria-label="Menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        {open ? <CloseIcon /> : <MenuIcon />}
      </button>
      <div className={open ? "nav-right open" : "nav-right"}>
        <div className="nav-links">
          <Link
            to="/nada"
            className={active === "nada" ? "active" : undefined}
            onClick={close}
          >
            Nada
          </Link>
          <Link
            to="/blog"
            className={active === "blog" ? "active" : undefined}
            onClick={close}
          >
            Blog
          </Link>
          <Link
            to="/nada/privacy-policy.html"
            className={active === "privacy" ? "active" : undefined}
            onClick={close}
          >
            Privacy
          </Link>
          <Link
            to="/nada/terms-of-use.html"
            className={active === "terms" ? "active" : undefined}
            onClick={close}
          >
            Terms
          </Link>
          <Link
            to="/nada/contact.html"
            className={active === "contact" ? "active" : undefined}
            onClick={close}
          >
            Contact
          </Link>
        </div>
        <a
          href={DOWNLOAD_URL}
          className="download-badge nav-badge"
          onClick={close}
        >
          <img
            src="/nada/img/download-appstore.svg"
            alt="Download on the App Store"
          />
        </a>
      </div>
    </nav>
  );
}

export function Footer() {
  return (
    <footer>
      <div className="foot-left">
        <Link to="/nada" className="foot-logo">
          <LogoMark size={28} className="logo-mark" />
        </Link>
      </div>
      <div className="foot-copy">© 2026 tunelab.id</div>
      <div className="foot-right">
        <div className="foot-links">
          <Link to="/nada/terms-of-use.html">Terms</Link>
          <Link to="/nada/privacy-policy.html">Privacy</Link>
          <Link to="/blog">Blog</Link>
          <Link to="/nada/contact.html">Contact</Link>
          <a href={DOWNLOAD_URL}>App Store</a>
        </div>
      </div>
    </footer>
  );
}
