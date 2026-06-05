import { Link } from "react-router";

import type { Route } from "./+types/terms";
import { siteOrigin } from "~/lib/site";
import { ContentPage, contentMeta } from "~/components/ContentPage";

export function loader({ request }: Route.LoaderArgs) {
  return { origin: siteOrigin(request) };
}

export function meta({ data }: Route.MetaArgs) {
  return contentMeta(
    data?.origin ?? "",
    "/nada/terms-of-use.html",
    "Terms of Use",
    "The rules for using Nada — accounts, subscriptions, your content, and acceptable use.",
  );
}

export default function Terms() {
  return (
    <ContentPage
      title="Terms of Use for Nada"
      active="terms"
      effectiveDate={{ label: "Effective Date:", value: "April 10, 2026" }}
      intro={
        <p>
          These terms work together with Nada's{" "}
          <Link to="/nada/privacy-policy.html">Privacy Policy</Link>.
        </p>
      }
    >
      <p>
        These Terms of Use explain the basic rules for using Nada, including the app, optional
        account features, cloud sync, collaboration tools, exports, and paid subscriptions provided
        by Tunelab.id.
      </p>

      <h2>1. Using Nada</h2>
      <p>
        By downloading, accessing, or using Nada, you agree to these Terms of Use and the{" "}
        <Link to="/nada/privacy-policy.html">Privacy Policy</Link>.
      </p>
      <p>
        You may use Nada only if you are legally allowed to enter into this agreement. If you use
        Nada for a company, school, studio, or other organization, you confirm that you have
        authority to act for that organization.
      </p>

      <h2>2. Accounts and Features</h2>
      <p>
        You can use some parts of Nada without an account, but features like cloud sync,
        collaboration, and some subscription-related functionality may require sign-in.
      </p>
      <p>
        You are responsible for keeping your account information accurate and your sign-in
        credentials secure. Do not impersonate another person or organization.
      </p>
      <p>
        We may suspend access if we reasonably believe an account is being used fraudulently,
        abusively, or in violation of these Terms.
      </p>

      <h2>3. Subscriptions and Billing</h2>
      <p>
        Nada may offer free features and paid subscriptions. If you buy a subscription in the iOS
        app, the purchase is made through your Apple ID and is billed by Apple.
      </p>
      <p>
        Pricing, billing periods, free trials, taxes, and renewal terms are shown in the app at the
        time of purchase and may vary by region.
      </p>
      <p>
        Auto-renewing subscriptions renew automatically unless you cancel through your Apple account
        settings before the renewal date.
      </p>
      <p>
        Refunds, billing disputes, and payment processing for App Store purchases are generally
        handled by Apple under Apple's policies.
      </p>

      <h2>4. Your Content</h2>
      <p>
        You keep ownership of the music, recordings, MIDI files, project data, names, and other
        content you create or upload in Nada.
      </p>
      <p>
        You give Tunelab.id a limited, non-exclusive right to host, process, transmit, back up, and
        display that content only as needed to run Nada, such as syncing your projects, supporting
        collaboration, maintaining service reliability, and providing support.
      </p>
      <p>
        You are responsible for making sure you have the rights needed to record, upload, share,
        export, or collaborate on any content you use in Nada.
      </p>

      <h2>5. Acceptable Use</h2>
      <p>
        You may not misuse Nada. That includes trying to interfere with the app or backend, bypass
        subscription or feature limits, abuse collaboration tools, upload malware, scrape non-public
        data, or use Nada in a way that breaks the law or violates someone else's rights.
      </p>
      <p>
        We may investigate violations and take reasonable action, including removing content,
        limiting features, or suspending accounts.
      </p>

      <h2>6. Service Availability</h2>
      <p>
        Nada includes on-device features and optional online services. Some features require
        internet access, supported devices, supported iOS versions, or third-party services such as
        Apple, Google, or cloud infrastructure providers.
      </p>
      <p>
        We may update the app, change features, fix bugs, improve security, or adjust usage limits
        over time.
      </p>
      <p>
        While we work to keep Nada reliable, we cannot promise uninterrupted service. You are
        responsible for keeping your own backups of important work.
      </p>
      <p>
        Some features depend on third-party infrastructure, including Apple (sign-in, purchases,
        push notifications), Google (sign-in), and cloud storage and hosting providers. Their terms
        and availability may affect Nada features independently of us.
      </p>

      <h2>7. Privacy</h2>
      <p>
        Your use of Nada is also subject to our{" "}
        <Link to="/nada/privacy-policy.html">Privacy Policy</Link>, which explains how we collect,
        use, store, and share account data, recordings, project metadata, diagnostics, and deletion
        requests.
      </p>

      <h2>8. Ending Use or Access</h2>
      <p>
        You can stop using Nada at any time. If you created an account, you can request deletion
        through the account settings in the app. Deletion is processed immediately and is permanent.
      </p>
      <p>
        We may suspend or end access if you violate these Terms, create risk for other users, expose
        us to legal liability, or threaten the security or reliability of the service.
      </p>
      <p>
        Ending access or deleting an account does not automatically create a refund right. App Store
        subscription cancellations and refunds remain subject to Apple's rules.
      </p>

      <h2>9. Disclaimers and Liability</h2>
      <p>
        To the maximum extent permitted by law, Nada is provided on an "as is" and "as available"
        basis. We do not guarantee uninterrupted availability, perfect transcription accuracy,
        error-free sync, or that Nada will work the same way on every device or setup.
      </p>
      <p>
        To the maximum extent permitted by law, Tunelab.id and its affiliates, team members,
        contractors, and partners are not liable for indirect, incidental, special, consequential,
        or punitive damages, including lost profits, lost data, or creative interruption arising
        from your use of Nada.
      </p>
      <p>
        To the maximum extent permitted by law, our total liability for claims relating to Nada will
        not exceed the greater of the amount you paid for Nada in the 12 months before the claim
        arose or USD $50. Nothing in these Terms limits rights or remedies that cannot be waived
        under applicable law.
      </p>

      <h2>10. Intellectual Property</h2>
      <p>
        Nada, including its name, logo, design, code, and all related materials, is owned by
        Tunelab.id and protected by applicable intellectual property laws. These Terms do not grant
        you any right to use Tunelab.id's or Nada's trademarks, logos, or branding.
      </p>
      <p>
        You may not copy, modify, distribute, sell, reverse-engineer, or create derivative works
        from Nada or its components without our written permission.
      </p>

      <h2>11. Changes to These Terms</h2>
      <p>
        We may update these Terms from time to time. When we do, we will update the Effective Date
        at the top of this page and, for material changes, notify you through the app or by email if
        we have your contact information.
      </p>
      <p>
        Continuing to use Nada after updated Terms take effect means you accept the new Terms. If you
        do not agree, you should stop using Nada.
      </p>

      <h2>12. Governing Law</h2>
      <p>
        These Terms are governed by the laws of the Republic of Indonesia, without regard to its
        conflict of law provisions. Any disputes arising from these Terms or your use of Nada will
        be resolved exclusively in the courts of Jakarta, Indonesia, unless applicable local law
        requires otherwise.
      </p>

      <h2>13. Contact Us</h2>
      <p>If you have any questions about these Terms of Use, please contact Tunelab.id:</p>
      <p>
        Email: <a href="mailto:tunelabid@gmail.com">tunelabid@gmail.com</a>
        <br />
        Address: 52nd Floor, Autograph Tower — Thamrin Nine, Central Jakarta.
      </p>
    </ContentPage>
  );
}
