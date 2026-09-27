import { Reveal } from "../ui";

const TERMS: { title: string; items: string[] }[] = [
  {
    title: "1. Introduction",
    items: [
      "These Terms apply to clients receiving services from The Four Deuces B.V. and its resident and guest artists.",
      "Booking an appointment or receiving services constitutes agreement to these Terms.",
    ],
  },
  {
    title: "2. Appointments",
    items: [
      "Booking is available in person, by email, via Instagram, or through the website; we do not accept walk-ins.",
      "Official email addresses: booking@thefourdeuces.nl and studio@thefourdeuces.nl.",
      "A non-refundable deposit is required.",
      "At least 48 hours' notice is required to cancel or reschedule.",
      "Arriving more than 30 minutes late without notice can result in cancellation or rescheduling and loss of the deposit.",
    ],
  },
  {
    title: "3. Pricing and Payment",
    items: [
      "Price depends on size, complexity, placement, and consultation.",
      "Separate provisions apply for standard tattoos, cover-ups, and reworks.",
      "Payment methods: cash, credit/debit cards, and potentially PayPal by agreement.",
      "Tips are appreciated but optional.",
      "Additional work or changes can incur extra charges.",
    ],
  },
  {
    title: "4. Health and Safety",
    items: [
      "The minimum age is 18, or the client must be accompanied by an adult.",
      "Clients must disclose medical conditions, allergies, and skin sensitivities.",
      "The studio follows NEN-EN 17169 hygiene protocols.",
      "Pregnant or nursing clients may be refused; written doctor confirmation may be required.",
      "No local anesthetics are used.",
      "An artist may refuse a tattoo where risks are high or difficult to assess.",
    ],
  },
  {
    title: "5. Tattoo Process",
    items: [
      "The final design and placement must be approved before tattooing begins.",
      "Once approved, complaints about design or placement are void.",
      "Verbal approval has the same legal force as written approval.",
      "Clients are responsible for following the aftercare instructions.",
      "One complimentary touch-up is offered within 6 months, subject to the stated conditions.",
    ],
  },
  {
    title: "6. Liability",
    items: [
      "The client acknowledges risks including allergic reactions, infections, and dissatisfaction.",
      "The client must disclose relevant health issues.",
      "The studio is not liable for health complications, including infections or allergic reactions.",
      "Clients may be asked to sign a liability waiver.",
    ],
  },
  {
    title: "7. Photography and Intellectual Property",
    items: [
      "The studio may photograph or video tattoos for promotional purposes, with an opt-out available.",
      "The studio retains the rights to custom designs.",
      "Studio artwork may not be used commercially without permission.",
      "These Terms are subject to the Dutch Copyright Act (Auteurswet).",
    ],
  },
  {
    title: "8. Conduct",
    items: [
      "Harassment, discrimination, and inappropriate behaviour may result in refusal of service.",
      "Accompanying persons must remain on the ground floor.",
      "Service may be refused if the client is sick, intoxicated, or under the influence of alcohol or drugs.",
      "Clients must follow the artist's instructions.",
    ],
  },
  {
    title: "9. Guest Artists",
    items: [
      "Guest artists are independent and not studio employees or representatives.",
      "Separate booking and payment arrangements may apply.",
      "The studio touch-up policy does not apply to guest artists.",
      "The studio disclaims liability for issues arising from guest-artist services.",
      "Studio conduct, hygiene, and safety rules still apply.",
    ],
  },
  {
    title: "10. Modifications to Terms",
    items: [
      "The studio reserves the right to modify these Terms at any time and will notify clients of significant changes.",
    ],
  },
  {
    title: "11. Contact Information",
    items: [
      "Questions regarding these Terms should be directed to studio@thefourdeuces.nl.",
    ],
  },
];

const PRIVACY: { title: string; items: string[] }[] = [
  {
    title: "1. Who we are",
    items: [
      "The Four Deuces B.V. is the controller responsible for any personal data collected through thefourdeuces.nl.",
      "For any privacy question or request, contact us at studio@thefourdeuces.nl.",
    ],
  },
  {
    title: "2. Cookies & analytics",
    items: [
      "We only place analytics cookies after you accept them in the cookie banner. If you decline, no analytics cookies are set and no usage data is collected.",
      "With your consent, we use Microsoft Clarity to understand how visitors experience the site so we can improve it. Clarity records general usage and behaviour — pages viewed, clicks and taps, scrolling, and mouse movement (aggregated into heatmaps) — and may capture anonymised replays of on-site interactions, together with basic device, browser, and approximate location information.",
      "This data is used only to analyse and improve the website. We do not use it to identify you personally, we do not use it for advertising, and we do not sell it.",
      "Microsoft Clarity processes this data on our behalf as a processor, under Microsoft's own privacy terms.",
      "You can withdraw your consent at any time by clearing this site's cookies and data in your browser; the banner will then appear again on your next visit.",
    ],
  },
  {
    title: "3. Booking requests",
    items: [
      "When you send a booking request from the home page, we receive the budget you enter and your Instagram handle.",
      "We use this information once, for the sole purpose of contacting you about your enquiry. Your Instagram handle is never stored in a database, never added to any mailing list, and never used for anything else — the request is deleted as soon as we have made contact.",
    ],
  },
  {
    title: "4. Contact form",
    items: [
      "When you use the contact form, we receive the name, email address, and message you provide.",
      "We do not store your personal information. It is used a single time to reply to you and is then permanently deleted. It is never shared with anyone else and never used for marketing.",
    ],
  },
  {
    title: "5. Legal basis for processing",
    items: [
      "For analytics cookies we rely on your consent, which you can withdraw at any time.",
      "For enquiries you send us (booking or contact form) we process your data solely to take the step you have asked us to take — getting back to you.",
    ],
  },
  {
    title: "6. Data retention",
    items: [
      "Enquiry details (booking or contact) are kept only for as long as needed to respond, and are deleted once your enquiry is resolved.",
      "Analytics data is retained by Microsoft Clarity in line with its standard retention period.",
    ],
  },
  {
    title: "7. Sharing & processors",
    items: [
      "We do not sell your personal data and do not share it with third parties for their own purposes.",
      "Enquiry details are seen only by The Four Deuces staff. Website analytics are processed by Microsoft Clarity, as described above.",
    ],
  },
  {
    title: "8. Your rights",
    items: [
      "Under the GDPR you have the right to access, correct, delete, restrict, or object to the processing of your personal data, the right to data portability, and the right to withdraw consent at any time.",
      "To exercise any of these rights, email studio@thefourdeuces.nl. You also have the right to lodge a complaint with the Dutch Data Protection Authority (Autoriteit Persoonsgegevens).",
    ],
  },
  {
    title: "9. Changes to this policy",
    items: [
      "We may update this Privacy Policy from time to time. Any significant changes will be published on this page.",
    ],
  },
  {
    title: "10. Contact",
    items: [
      "Questions about this Privacy Policy or about your data can be sent to studio@thefourdeuces.nl.",
    ],
  },
];

function LegalGroup({ data }: { data: { title: string; items: string[] }[] }) {
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
          <section className="mt-24">
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
