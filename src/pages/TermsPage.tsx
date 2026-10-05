import type { ReactNode } from "react";
import { Reveal } from "../ui";

type LegalSection = { title: string; items: ReactNode[] };

const Link = ({ href, children }: { href: string; children: ReactNode }) => {
  const external = href.startsWith("http");
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="text-white/80 underline underline-offset-2 transition-colors hover:text-white"
    >
      {children}
    </a>
  );
};

const STUDIO_EMAIL = "studio@thefourdeuces.nl";
const BOOKING_EMAIL = "booking@thefourdeuces.nl";

const StudioMail = () => (
  <Link href={`mailto:${STUDIO_EMAIL}`}>{STUDIO_EMAIL}</Link>
);

const TERMS: LegalSection[] = [
  {
    title: "1. Introduction",
    items: [
      "1.1. These Terms apply to all clients receiving services from The Four Deuces B.V. (the Studio), including services performed by resident artists and guest artists working at the Studio.",
      "1.2. By booking an appointment, paying a deposit or receiving any service, the client confirms that they have read, understood and accepted these Terms.",
      "1.3. If a client does not agree with these Terms, they should not book or proceed with a service.",
    ],
  },
  {
    title: "2. Appointments",
    items: [
      <>
        2.1. Appointments can only be booked through the{" "}
        <Link href="https://thefourdeuces.nl/book/">booking page</Link> on our
        website, the official Studio{" "}
        <Link href="https://wa.me/31645052222">WhatsApp account</Link> or the
        official Studio email addresses. Appointments made in any other way,
        including in person or via Instagram or other social media, are not
        valid and the Studio is not bound by them. We do not accept walk-ins.
      </>,
      <>
        2.2. The official channels are the {" "}
        booking page <Link href="https://thefourdeuces.nl/book/">booking page</Link>
        , the Studio{" "}
        <Link href="https://wa.me/31645052222">WhatsApp account</Link> and the
        email addresses{" "}
        <Link href={`mailto:${BOOKING_EMAIL}`}>{BOOKING_EMAIL}</Link> and{" "}
        <StudioMail />. We cannot guarantee any arrangement made through other
        numbers, addresses or accounts, including those that imitate the
        Studio.
      </>,
      "2.3. A deposit is required to secure an appointment. The deposit is not an extra charge: it is included in the final price of the tattoo and deducted from the amount due at the end of the session.",
      "2.4. The client can cancel or reschedule by notifying the Studio at least 48 hours before the appointment, by email or via the channel used for booking. In that case the deposit is refunded or, if the client prefers, transferred to the new appointment.",
      "2.5. If the client cancels or reschedules with less than 48 hours' notice, or does not show up, the deposit is forfeited. A new deposit is required for any later booking.",
      "2.6. A client who arrives more than 30 minutes late without prior notice may have the appointment cancelled or rescheduled. In that case the deposit is forfeited.",
      "2.7. If the Studio or the artist cancels or reschedules the appointment, the deposit is refunded in full or, if the client prefers, transferred to the new appointment.",
    ],
  },
  {
    title: "3. Pricing and Payment",
    items: [
      "3.1. The price depends on the size, complexity and placement of the tattoo and on the outcome of the consultation. The artist gives an estimate or fixed price before the session begins.",
      "3.2. Cover-ups and reworks of existing tattoos are more complex than standard tattoos and are priced separately. The artist decides during the consultation whether a cover-up or rework is feasible.",
      "3.3. Payment is due in full at the end of the session. Accepted methods are cash and credit or debit cards. PayPal may be accepted by prior agreement.",
      "3.4. Tips are appreciated but entirely optional.",
      "3.5. Changes requested after the design is agreed, or additional work added during the session, can lead to extra charges. The artist will tell the client about any increase before continuing.",
    ],
  },
  {
    title: "4. Health and Safety",
    items: [
      "4.1. The Studio does not tattoo anyone under the age of 12. Clients aged 12 to 17 can only be tattooed with the explicit consent of a parent or legal guardian, who must sign the consent form, show valid identification and be present during the entire session. The Studio checks the age of every client and may ask for valid identification.",
      "4.2. Clients must tell the artist before the session about any medical conditions, allergies, medication and skin sensitivities that could affect the procedure or healing. The client may be asked to complete a health questionnaire.",
      <>
        4.3. The Studio follows the hygiene protocols of {" "}
        <Link href="https://www.rivm.nl/hygienerichtlijnen/EU-norm-toelichting-tatoeeren">NEN-EN 17169</Link>. 
        Needles and other single-use materials are sterile and disposed of after each client.
      </>,
      "4.4. Pregnant or nursing clients may be refused service. Written confirmation from a doctor may be required before the Studio agrees to proceed.",
      "4.5. The Studio does not use or provide local anaesthetics. Clients should expect some pain and are responsible for deciding whether they are comfortable with that.",
      "4.6. An artist may refuse or stop a tattoo if the risks are high or hard to assess, for example because of skin condition, medical history or the chosen placement. A refusal on these grounds is made in the interest of the client's safety.",
    ],
  },
  {
    title: "5. Tattoo Process",
    items: [
      "5.1. Before tattooing begins, the client must approve the final design, size and placement. The client is encouraged to check spelling, symbols and orientation carefully at this stage.",
      "5.2. Once the client has approved the design and placement, later complaints about the design or placement are void.",
      "5.3. Verbal approval has the same legal force as written approval.",
      "5.4. The client receives aftercare instructions and is responsible for following them. Poor healing caused by not following the instructions, or by exposure to sun, water, friction or infection, is not a defect in the work.",
      "5.5. The Studio offers one complimentary touch-up within 6 months of the session. Touch-ups requested after 6 months are charged.",
    ],
  },
  {
    title: "6. Liability",
    items: [
      "6.1. The client acknowledges that tattooing carries risks, including allergic reactions, infections, scarring and dissatisfaction with the final result, and accepts these risks by proceeding.",
      "6.2. The client is responsible for giving complete and accurate information about their health.",
      "6.3. The Studio is not liable for health complications during or after the tattoo that were caused by a medical condition, allergy or skin sensitivity that the client did not disclose before the session. This does not limit any liability that cannot be excluded under Dutch law.",
      "6.4. Clients may be asked to sign a liability waiver and consent form before the session.",
    ],
  },
  {
    title: "7. Photography and Intellectual Property",
    items: [
      <>
        7.1. Before, during or after the session the Studio may ask the client
        for verbal consent to take photos or videos of the tattoo or the
        process for promotional purposes, including on its website and social
        media. No images are taken or published without that consent, and the
        client can withdraw it at any time. Personal data is handled in
        accordance with our <Link href="#privacy">Privacy Policy</Link>.
      </>,
      "7.2. The Studio and its artists retain the rights to custom designs they create. The client receives the right to have the design tattooed on their own body but no other rights.",
      "7.3. Studio artwork, including flash designs and custom pieces, may not be copied, reproduced or used commercially without the Studio's written permission.",
      "7.4. These Terms are subject to the Dutch Copyright Act (Auteurswet).",
    ],
  },
  {
    title: "8. Conduct",
    items: [
      "8.1. Harassment, discrimination and other inappropriate behaviour towards staff, artists or other clients are not tolerated and can lead to immediate refusal of service. In that case no refund of the deposit is given.",
      "8.2. Accompanying persons must stay on the ground floor and may not enter the working area.",
      "8.3. Service may be refused if the client is ill, intoxicated or under the influence of alcohol or drugs. In that case the deposit is lost unless the Studio decides otherwise.",
      "8.4. Clients must follow the artist's instructions throughout the session, particularly on hygiene, movement and positioning.",
    ],
  },
  {
    title: "9. Guest Artists",
    items: [
      "9.1. Guest artists are independent professionals. They are not employees or representatives of the Studio.",
      <>
        9.2. While working at the Studio, guest artists must comply with the Studio rules, 
        Dutch law and the hygiene protocols of <Link href="https://www.rivm.nl/hygienerichtlijnen/EU-norm-toelichting-tatoeeren">NEN-EN 17169</Link>.
      </>,
      "9.3. Booking, deposit and payment arrangements for guest artists may differ from the standard Studio arrangements. The client will be informed of these before the appointment is confirmed.",
      "9.4. The Studio's complimentary touch-up policy does not apply to guest artists. Any touch-up arrangement is agreed directly with the guest artist.",
      "9.5. The Studio is not liable for health complications caused by a medical condition, allergy or skin sensitivity that the client did not disclose to a guest artist before the session. Guest artists are responsible for their own work and for the services they provide.",
    ],
  },
  {
    title: "10. Modifications to Terms",
    items: [
      "10.1. The Studio may change these Terms at any time. Significant changes will be communicated to clients, for example by email or through a notice on the website.",
      "10.2. The Terms that applied at the time of booking remain applicable to that booking, unless the client agrees to the new version.",
    ],
  },
  {
    title: "11. Contact Information",
    items: [
      <>
        11.1. Questions regarding these Terms should be directed to{" "}
        <StudioMail />.
      </>,
      "11.2. Complaints about a service should be sent to the same address as soon as possible after the session so the Studio can respond properly.",
    ],
  },
  {
    title: "12. Governing Law and Disputes",
    items: [
      "12.1. These Terms and all services provided by the Studio are governed by Dutch law.",
      "12.2. Disputes will be submitted to the competent court in Amsterdam (Rechtbank Amsterdam), unless mandatory consumer law provides otherwise.",
    ],
  },
];

const PRIVACY: LegalSection[] = [
  {
    title: "1. Who we are",
    items: [
      "1.1. The Four Deuces B.V. is the controller responsible for any personal data collected through thefourdeuces.nl.",
      <>
        1.2. For any privacy question or request, contact us at <StudioMail />.
      </>,
    ],
  },
  {
    title: "2. Cookies & analytics",
    items: [
      "2.1. We only place analytics cookies after you accept them in the cookie banner. If you decline, no analytics cookies are set and no usage data is collected.",
      "2.2. With your consent, we use Microsoft Clarity to understand how visitors experience the site so we can improve it. Clarity records general usage and behaviour — pages viewed, clicks and taps, scrolling, and mouse movement (aggregated into heatmaps) — and may capture anonymised replays of on-site interactions, together with basic device, browser, and approximate location information.",
      "2.3. This data is used only to analyse and improve the website. We do not use it to identify you personally, we do not use it for advertising, and we do not sell it.",
      "2.4. Microsoft Clarity processes this data on our behalf as a processor, under Microsoft's own privacy terms.",
      "2.5. You can withdraw your consent at any time by clearing this site's cookies and data in your browser; the banner will then appear again on your next visit.",
    ],
  },
  {
    title: "3. Booking requests",
    items: [
      "3.1. When you send a booking request from the home page, we receive the budget you enter and your Instagram handle.",
      "3.2. We use this information once, for the sole purpose of contacting you about your enquiry. Your Instagram handle is never stored in a database, never added to any mailing list, and never used for anything else — the request is deleted as soon as we have made contact.",
    ],
  },
  {
    title: "4. Contact form",
    items: [
      "4.1. When you use the contact form, we receive the name, email address, and message you provide.",
      "4.2. We do not store your personal information. It is used a single time to reply to you and is then permanently deleted. It is never shared with anyone else and never used for marketing.",
    ],
  },
  {
    title: "5. Legal basis for processing",
    items: [
      "5.1. For analytics cookies we rely on your consent, which you can withdraw at any time.",
      "5.2. For enquiries you send us (booking or contact form) we process your data solely to take the step you have asked us to take — getting back to you.",
    ],
  },
  {
    title: "6. Data retention",
    items: [
      "6.1. Enquiry details (booking or contact) are kept only for as long as needed to respond, and are deleted once your enquiry is resolved.",
      "6.2. Analytics data is retained by Microsoft Clarity in line with its standard retention period.",
    ],
  },
  {
    title: "7. Sharing & processors",
    items: [
      "7.1. We do not sell your personal data and do not share it with third parties for their own purposes.",
      "7.2. Enquiry details are seen only by The Four Deuces staff. Website analytics are processed by Microsoft Clarity, as described above.",
    ],
  },
  {
    title: "8. Your rights",
    items: [
      "8.1. Under the GDPR you have the right to access, correct, delete, restrict, or object to the processing of your personal data, the right to data portability, and the right to withdraw consent at any time.",
      <>
        8.2. To exercise any of these rights, email <StudioMail />. You also
        have the right to lodge a complaint with the Dutch Data Protection
        Authority (Autoriteit Persoonsgegevens).
      </>,
    ],
  },
  {
    title: "9. Changes to this policy",
    items: [
      "9.1. We may update this Privacy Policy from time to time. Any significant changes will be published on this page.",
    ],
  },
  {
    title: "10. Contact",
    items: [
      <>
        10.1. Questions about this Privacy Policy or about your data can be
        sent to <StudioMail />.
      </>,
    ],
  },
];

function LegalGroup({ data }: { data: LegalSection[] }) {
  return (
    <div className="mt-8 divide-y divide-white/10 border-y border-white/10">
      {data.map((s) => (
        <div
          key={s.title}
          className="grid gap-2 py-7 md:grid-cols-[190px_1fr] md:gap-10"
        >
          <h3 className="font-display text-[15px] font-medium leading-snug text-white/90">
            {s.title}
          </h3>
          <div className="space-y-3">
            {s.items.map((it, i) => (
              <p
                key={i}
                className="text-[15px] leading-relaxed text-white/55"
              >
                {it}
              </p>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function TermsPage() {
  const sectionHead =
    "text-center font-serif text-[2rem] leading-[1] tracking-tight md:text-[2.8rem]";
  return (
    <main className="relative z-10 min-h-screen px-6 pb-24 pt-28 md:px-16 md:pt-32">
      <div className="mx-auto w-full max-w-6xl">
        <Reveal>
          <p className="mb-4 text-center text-[12px] uppercase tracking-[0.3em] text-white/40">
            Legal
          </p>
          <h1 className="text-center font-serif text-[3rem] leading-[0.95] tracking-tight md:text-[4.5rem]">
            Terms &amp; <span className="italic">Privacy</span>
          </h1>
          <p className="mx-auto mt-5 max-w-lg text-center text-[15px] leading-relaxed text-white/55">
            The rules of the studio, and how we look after your data.
          </p>
        </Reveal>

        <Reveal>
          <section className="mt-16">
            <h2 className={sectionHead}>Terms &amp; Conditions</h2>
            <LegalGroup data={TERMS} />
          </section>
        </Reveal>

        <Reveal>
          <section id="privacy" className="mt-24 scroll-mt-24">
            <h2 className={sectionHead}>Privacy Policy</h2>
            <LegalGroup data={PRIVACY} />
          </section>
        </Reveal>
      </div>
    </main>
  );
}

/* -------------------------------------------------------------------------- */
/* ABOUT PAGE — /about (SEO + studio story)                                   */
/* -------------------------------------------------------------------------- */

// The studio address, and a Google Maps link for it (same target as the footer
// / mobile address). Used to make the address in the location copy clickable.