import { Link } from "react-router";

import type { Route } from "./+types/privacy";
import { siteOrigin } from "~/lib/site";
import { ContentPage, contentMeta } from "~/components/ContentPage";

export function loader({ request }: Route.LoaderArgs) {
  return { origin: siteOrigin(request) };
}

export function meta({ data }: Route.MetaArgs) {
  return contentMeta(
    data?.origin ?? "",
    "/nada/privacy-policy.html",
    "Privacy Policy",
    "How Nada collects, uses, stores, and shares your information.",
  );
}

export default function Privacy() {
  return (
    <ContentPage
      title="Privacy Policy for Nada"
      active="privacy"
      effectiveDate={{ label: "Effective Date:", value: "April 3, 2026" }}
      intro={
        <p>
          This policy works together with Nada's{" "}
          <Link to="/nada/terms-of-use.html">Terms of Use</Link>, which explain subscriptions,
          accounts, user content, and acceptable use.
        </p>
      }
    >
      <p>
        Thank you for using Nada! This Privacy Policy describes how Tunelab.id ("we", "our", or "us")
        collects, uses, processes, and discloses your information when you use the Nada mobile
        application (the "App") and our associated cloud sync services.
      </p>

      <h2>1. Information We Collect</h2>

      <h3>A. Account &amp; Profile Information</h3>
      <p>You have the option to create an account to sync your projects across devices.</p>
      <ul>
        <li>
          <strong>What we collect:</strong> Your name, email address, profile avatar (if provided by
          your auth provider), and authentication tokens via your chosen sign-in method
          (Email/Password, Apple, or Google).
        </li>
        <li>
          <strong>Why we collect it:</strong> To authenticate your identity, secure your data, and
          provide cross-device cloud syncing.
        </li>
      </ul>

      <h3>B. Microphone &amp; Musical Data</h3>
      <p>Nada requires access to your device's microphone to function.</p>
      <ul>
        <li>
          <strong>What we collect:</strong> Real-time audio input, recorded audio files (
          <code>.m4a</code>), generated MIDI notes, custom beat triggers, and project metadata
          (tempo, time signatures, instrument choices).
        </li>
        <li>
          <strong>Why we collect it:</strong> To convert your voice into MIDI notes and render your
          musical projects. If you are signed in, this data is securely uploaded to our cloud servers
          to sync across your devices. If you use Nada offline or without an account, this data
          remains strictly on your device.
        </li>
      </ul>

      <h3>C. Location Data</h3>
      <p>Nada requests optional access to your location ("When In Use").</p>
      <ul>
        <li>
          <strong>What we collect:</strong> Precise GPS coordinates (latitude and longitude) and the
          localized place name (e.g., "San Francisco, CA") at the exact moment you create a project.
        </li>
        <li>
          <strong>Why we collect it:</strong> To automatically tag your projects with a location so
          you can easily remember where an idea was recorded. We do not track your continuous
          movements or background location.
        </li>
      </ul>

      <h3>D. Usage Analytics &amp; Diagnostics</h3>
      <p>
        To improve Nada's performance and user experience, we collect diagnostic and usage data.
      </p>
      <ul>
        <li>
          <strong>What we collect:</strong> App interaction events (e.g., which instruments you
          select, whether you use Melody or Beat mode), device model, OS version, and crash reports.
          If you are logged in, crash reports may capture your IP address, and analytics events are
          associated with your account profile (Name and Email).
        </li>
        <li>
          <strong>Why we collect it:</strong> To identify bugs, resolve crashes, and understand which
          features our users value most.
        </li>
      </ul>

      <h2>2. How We Share Your Data</h2>
      <p>
        We do not sell, rent, or trade your personal information. We only share data with trusted
        third-party service providers who assist us in operating the App:
      </p>
      <ul>
        <li>
          <strong>Mixpanel:</strong> Used for product analytics to understand feature usage.
        </li>
        <li>
          <strong>Sentry:</strong> Used for real-time crash reporting and performance monitoring.
        </li>
        <li>
          <strong>Cloud Infrastructure:</strong> We use secure backend servers and cloud storage
          (e.g., Cloudflare R2) to facilitate the syncing of your audio and MIDI files.
        </li>
      </ul>

      <h2>3. Data Storage and Security</h2>
      <ul>
        <li>
          <strong>Encryption:</strong> Data synced to our cloud servers is transmitted securely using
          industry-standard encryption (HTTPS/TLS). Authentication tokens are securely stored on your
          device using the iOS Keychain.
        </li>
        <li>
          <strong>Background Syncing:</strong> To keep your devices up to date, Nada may securely sync
          your projects to our cloud servers in the background.
        </li>
      </ul>

      <h2>4. Your Data Rights &amp; Deletion</h2>
      <p>You have full control over your personal information and musical data:</p>
      <ul>
        <li>
          <strong>Right to Access &amp; Modify:</strong> You can view and edit your projects directly
          within the App.
        </li>
        <li>
          <strong>Right to Deletion:</strong> You can delete individual tracks or projects at any
          time. Furthermore, you can permanently delete your entire account and all associated data
          from our servers by navigating to <strong>Settings &gt; Delete Account</strong> within the
          App.
        </li>
        <li>
          <strong>Revoking Permissions:</strong> You can revoke Microphone or Location permissions at
          any time via your iOS device Settings (<code>Settings &gt; Privacy &amp; Security</code>).
        </li>
      </ul>

      <h2>5. Children's Privacy</h2>
      <p>
        Nada does not knowingly collect personal information from children under the age of 13. If
        you are a parent or guardian and believe your child has provided us with personal
        information, please contact us so we can immediately delete their data from our servers.
      </p>

      <h2>6. Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy from time to time to reflect changes in our technology or
        legal requirements. We will notify you of any material changes by updating the "Effective
        Date" at the top of this policy and, if necessary, providing a notice within the App.
      </p>

      <h2>7. Contact Us</h2>
      <p>
        If you have any questions, concerns, or requests regarding your data or this Privacy Policy,
        please contact us at: <a href="mailto:tunelabid@gmail.com">tunelabid@gmail.com</a>.
      </p>
    </ContentPage>
  );
}
