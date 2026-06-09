import { Link, type MetaDescriptor } from "react-router";

import type { Route } from "./+types/nada";
import { siteOrigin } from "~/lib/site";
import { AppleIcon, LogoMark } from "~/components/icons";
import "~/styles/nada.css";

const DOWNLOAD_URL = "https://go.tunelab.id/download";

// Decorative waveform bar heights (px) — rendered deterministically so SSR and
// client hydration match (no Math.random).
const WAVE = [
  6, 10, 18, 28, 42, 54, 48, 36, 24, 16, 10, 8, 14, 26, 40, 52, 56, 44, 32, 20,
  14, 10, 18, 32, 46, 54, 48, 36, 24, 14,
];

export function loader({ request }: Route.LoaderArgs) {
  return { origin: siteOrigin(request) };
}

export function meta({ data }: Route.MetaArgs) {
  const origin = data?.origin ?? "";
  const url = `${origin}/nada`;
  const image = `${origin}/nada/img/screen-1.jpeg`;
  const title = "Nada: Compose With Hum";
  const description =
    "Hum, sing, or whistle. Nada transforms your voice into any instrument in real-time. Capture every musical idea before it fades away. Free on App Store.";

  const tags: MetaDescriptor[] = [
    { title },
    { name: "description", content: description },
    {
      name: "keywords",
      content:
        "nada app, voice to midi, hum to music, compose with voice, music app, pitch detection, beat maker, ios music",
    },
    { name: "author", content: "TuneLab" },
    { tagName: "link", rel: "canonical", href: url },
    { property: "og:type", content: "website" },
    { property: "og:url", content: url },
    { property: "og:site_name", content: "Nada by TuneLab" },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:image", content: image },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:locale", content: "en_US" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: image },
    {
      "script:ld+json": {
        "@context": "https://schema.org",
        "@type": "MobileApplication",
        name: title,
        description:
          "Hum, sing, or whistle. Nada transforms your voice into any instrument in real-time. Capture every musical idea before it fades away.",
        url,
        applicationCategory: "MusicApplication",
        operatingSystem: "iOS",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        installUrl: DOWNLOAD_URL,
        author: { "@type": "Organization", name: "TuneLab", url: origin },
      },
    },
  ];
  return tags;
}

export default function Nada() {
  return (
    <div className="nada-page">
      {/* NAV */}
      <nav>
        <Link to="/nada" className="nav-logo">
          <img src="/nada/img/logo-text.svg" alt="Nada" className="logo-text" />
        </Link>
        <a href={DOWNLOAD_URL} className="download-badge nav-badge">
          <img
            src="/nada/img/download-appstore.svg"
            alt="Download on the App Store"
          />
        </a>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-glow" />
        <div className="hero-ring r1" />
        <div className="hero-ring r2" />
        <div className="hero-ring r3" />

        <h1>
          Your voice
          <br />
          is an <span className="accent">instrument</span>
        </h1>

        <p className="hero-desc">
          Hum, sing, or whistle. Nada transforms your voice into any instrument
          in real-time. Capture every musical idea before it fades away.
        </p>

        <div className="hero-actions">
          <a href={DOWNLOAD_URL} className="download-badge">
            <img
              src="/nada/img/download-appstore.svg"
              alt="Download on the App Store"
            />
          </a>
        </div>

        <div className="hero-bottom">
          <div className="waveform">
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
      </section>

      {/* FEATURES */}
      <section className="section" id="features">
        <div className="inner">
          <div className="feat-header">
            <div className="label">Features</div>
            <h2 className="sec-title">
              From idea to track,
              <br />
              in seconds
            </h2>
            <p className="sec-sub">
              No keyboard. No studio. Just you, your voice, and Nada.
            </p>
          </div>
          <div className="feat-grid">
            <FeatureCard
              title="Voice to MIDI"
              body="Hum, whistle, or sing to play pianos, synths, guitars, and basses. Real-time pitch detection locks to your key and scale."
              icon={
                <svg viewBox="0 0 24 24">
                  <path d="M12 1a4 4 0 0 1 4 4v6a4 4 0 0 1-8 0V5a4 4 0 0 1 4-4z" />
                  <path d="M19 11a7 7 0 0 1-14 0M12 18v4M8 22h8" />
                </svg>
              }
            />
            <FeatureCard
              title="Beat maker"
              body="Add drums and percussion to your project instantly — tap the trigger card. Rhythm section done in seconds."
              icon={
                <svg viewBox="0 0 24 24">
                  <rect x="2" y="8" width="4" height="8" rx="1" />
                  <rect x="8" y="4" width="4" height="12" rx="1" />
                  <rect x="14" y="10" width="4" height="6" rx="1" />
                  <rect x="20" y="6" width="2" height="10" rx="1" />
                </svg>
              }
            />
            <FeatureCard
              title="Multi-track studio"
              body="Layer melodies, harmonies, and beats into a full arrangement. Mix multiple tracks with different instruments."
              icon={
                <svg viewBox="0 0 24 24">
                  <path d="M12 2 2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              }
            />
            <FeatureCard
              title="Export to your DAW"
              body="Send melodies and drum patterns as standard MIDI files to any DAW, or share rendered audio mixes directly."
              icon={
                <svg viewBox="0 0 24 24">
                  <path d="M12 3v13M8 12l4 4 4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
                </svg>
              }
            />
          </div>
        </div>
      </section>

      {/* SCREENSHOTS */}
      <section className="section screenshots-section">
        <div className="inner">
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <div className="label" style={{ justifyContent: "center" }}>
              App Screenshots
            </div>
            <h2 className="sec-title">See it in action</h2>
            <p className="sec-sub" style={{ margin: "0 auto" }}>
              A full music studio — in your pocket.
            </p>
          </div>
          <div className="screens-wrap">
            <PhoneFrame
              src="/nada/img/screen-1.jpeg"
              alt="Nada multi-track view"
            />
            <PhoneFrame
              src="/nada/img/screen-2.jpeg"
              alt="Nada chords view"
              mid
            />
            <PhoneFrame
              src="/nada/img/screen-3.jpeg"
              alt="Nada volume setting"
            />
          </div>
          <div className="screen-labels">
            <span>Multi-track studio</span>
            <span>Chord mode</span>
            <span>Volume &amp; sensitivity</span>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section how-section">
        <div className="inner">
          <div>
            <div className="label">How it works</div>
            <h2 className="sec-title">
              Three steps to your
              <br />
              next track
            </h2>
          </div>
          <div className="steps">
            <Step
              num="01"
              title="Hum your idea"
              body="Open Nada, pick your key and scale, then sing or hum the melody in your head. Nada detects your pitch in real-time."
            />
            <Step
              num="02"
              title="Choose your instrument"
              body="Hear your voice as a piano, synth, guitar, or bass instantly. Layer beats and harmonies to build a full composition."
            />
            <Step
              num="03"
              title="Export & produce"
              body="Send your project to any DAW as standard MIDI, or share an audio mix — ready for your next production session."
            />
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="section" id="pricing">
        <div className="inner">
          <div>
            <div className="label">Pricing</div>
            <h2 className="sec-title">
              Start free.
              <br />
              Go further with Pro.
            </h2>
            <p className="sec-sub">
              Nada is free to download. Unlock everything with a Pro
              subscription.
            </p>
          </div>
          <div className="price-grid">
            <div className="price-card">
              <div className="tier-name">Free</div>
              <div className="price-val">Rp 0</div>
              <div className="price-period">Forever free</div>
              <div className="divider" />
              <ul className="feat-list">
                <PlanItem>Voice to MIDI</PlanItem>
                <PlanItem>Basic instruments</PlanItem>
                <PlanItem>Single-track projects</PlanItem>
                <PlanItem>Export MIDI files</PlanItem>
              </ul>
              <a href={DOWNLOAD_URL} className="plan-btn ghost">
                Get Started Free
              </a>
            </div>
            <div className="price-card pro">
              <div className="pro-badge">Most Popular</div>
              <div className="tier-name">Pro</div>
              <div className="price-val">Rp 129rb</div>
              <div className="price-period">
                per month &nbsp;·&nbsp; or Rp 1,299rb / year
              </div>
              <div className="divider" />
              <ul className="feat-list">
                <PlanItem>Everything in Free</PlanItem>
                <PlanItem>All instruments &amp; synths</PlanItem>
                <PlanItem>Multi-track studio</PlanItem>
                <PlanItem>Smart Harmonizer chords</PlanItem>
                <PlanItem>Export audio mixes</PlanItem>
                <PlanItem>MIDI import</PlanItem>
              </ul>
              <a href={DOWNLOAD_URL} className="plan-btn fill">
                Start Pro Free Trial
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="cta-glow" />
        <div className="cta-inner">
          <h2>
            Catch the melody
            <br />
            in your <span className="accent">head.</span>
          </h2>
          <p>Nada is free to download. Your next song is already in you.</p>
          <a href={DOWNLOAD_URL} className="download-badge">
            <img
              src="/nada/img/download-appstore.svg"
              alt="Download on the App Store"
            />
          </a>
        </div>
      </section>

      {/* FOOTER */}
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
            <a href={DOWNLOAD_URL}>App Store</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  title,
  body,
  icon,
}: {
  title: string;
  body: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="feat-card">
      <div className="feat-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{body}</p>
    </div>
  );
}

function PhoneFrame({
  src,
  alt,
  mid,
}: {
  src: string;
  alt: string;
  mid?: boolean;
}) {
  return (
    <div className={mid ? "phone-frame phone-mid" : "phone-frame"}>
      <div className="phone-notch" />
      <div className="phone-screen">
        <img src={src} alt={alt} className="screen-img" />
      </div>
    </div>
  );
}

function Step({
  num,
  title,
  body,
}: {
  num: string;
  title: string;
  body: string;
}) {
  return (
    <div className="step">
      <div className="step-num">{num}</div>
      <h3>{title}</h3>
      <p>{body}</p>
    </div>
  );
}

function PlanItem({ children }: { children: React.ReactNode }) {
  return (
    <li>
      <span className="ck">
        <svg viewBox="0 0 12 12">
          <path d="M2 6l3 3 5-5" />
        </svg>
      </span>
      {children}
    </li>
  );
}
