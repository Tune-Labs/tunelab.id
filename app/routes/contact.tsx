import type { Route } from "./+types/contact";
import { siteOrigin } from "~/lib/site";
import { ContentPage, contentMeta } from "~/components/ContentPage";

export function loader({ request }: Route.LoaderArgs) {
  return { origin: siteOrigin(request) };
}

export function meta({ data }: Route.MetaArgs) {
  return contentMeta(
    data?.origin ?? "",
    "/nada/contact.html",
    "Contact",
    "Get in touch with Tunelab.id — email us for support, questions, and general inquiries.",
  );
}

export default function Contact() {
  return (
    <ContentPage
      title="Contact Us"
      active="contact"
      intro={
        <p>
          Have a question, some feedback, or need help? We'd love to hear from you. Reach out
          and we'll get back to you as soon as we can.
        </p>
      }
    >
      <h2>Email</h2>
      <p>
        The best way to reach us is by email:
      </p>
      <p>
        <a href="mailto:tunelabid@gmail.com">tunelabid@gmail.com</a>
      </p>

      <h2>Address</h2>
      <p>
        Tunelab.id
        <br />
        52nd Floor, Autograph Tower — Thamrin Nine, Central Jakarta.
      </p>
    </ContentPage>
  );
}
