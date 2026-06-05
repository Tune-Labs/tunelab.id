import { Link } from "react-router";

import type { Route } from "./+types/support";
import { siteOrigin } from "~/lib/site";
import { ContentPage, contentMeta } from "~/components/ContentPage";

export function loader({ request }: Route.LoaderArgs) {
  return { origin: siteOrigin(request) };
}

export function meta({ data }: Route.MetaArgs) {
  return contentMeta(
    data?.origin ?? "",
    "/nada/support.html",
    "Support",
    "Get help with Nada — contact, common questions, and billing support.",
  );
}

export default function Support() {
  return (
    <ContentPage
      title="Support for Nada"
      effectiveDate={{ label: "Last Updated:", value: "April 10, 2026" }}
      intro={
        <>
          <p style={{ marginBottom: "0.75rem" }}>
            If you need help with Nada, contact Tunelab.id directly using the support details below.
          </p>
          <p>
            For App Store billing, subscription management, and refund requests, Apple may handle
            part of the process through your Apple ID settings and Apple's support policies.
          </p>
        </>
      }
    >
      <h2>1. Contact</h2>
      <p>
        You can reach Tunelab.id for product support, account help, privacy questions, bug reports,
        and general inquiries:
      </p>
      <p>
        Email: <a href="mailto:tunelabid@gmail.com">tunelabid@gmail.com</a>
        <br />
        Address: 52nd Floor, Autograph Tower — Thamrin Nine, Central Jakarta.
      </p>

      <h2>2. Common Help</h2>
      <ul>
        <li>Account sign-in or account access issues.</li>
        <li>Cloud sync, collaboration, or project restoration questions.</li>
        <li>Subscription feature access or restore purchases issues.</li>
        <li>Bug reports, crashes, and unexpected app behavior.</li>
        <li>Privacy requests or account deletion questions.</li>
      </ul>

      <h2>3. Before You Contact Us</h2>
      <p>
        To help us support you faster, please include as much detail as you can in your message.
      </p>
      <ul>
        <li>Your device model and iOS version.</li>
        <li>The version of Nada you are using.</li>
        <li>A short description of the problem and what you expected to happen.</li>
        <li>Any screenshots, screen recordings, or steps that help reproduce the issue.</li>
      </ul>

      <h2>4. Subscription and Billing Help</h2>
      <p>
        If your subscription was purchased through the App Store, Apple handles billing, payment
        methods, cancellations, and most refund requests.
      </p>
      <p>
        You can manage your subscription from your Apple account subscription settings. If premium
        access is not restored correctly inside Nada, contact us and we can help review
        restore-purchase issues on our side.
      </p>

      <h2>5. Privacy and Legal</h2>
      <p>
        If you need details about how Nada handles personal data, please read our{" "}
        <Link to="/nada/privacy-policy.html">Privacy Policy</Link>.
      </p>
      <p>
        If you need details about app usage, subscriptions, content, or service terms, please read
        our <Link to="/nada/terms-of-use.html">Terms of Use</Link>.
      </p>
    </ContentPage>
  );
}
