// Shared FAQ data — rendered on the Book page and also used at build time
// (vite.config.ts) to emit FAQPage structured data for Google rich results.
// Keep this file free of imports so the Vite config can import it directly.

export type FaqItem = { q: string; a: string };

export const FAQ_ITEMS: FaqItem[] = [
  {
    q: "Does getting a tattoo hurt?",
    a: "Some discomfort is normal, but it's very manageable for most people and depends heavily on placement. Fleshier, muscular areas like the upper arm, thigh and calf are the easiest, while bony, thin-skinned spots like the ribs, hands, feet, sternum and ankles are the most sensitive. Everyone's pain tolerance is different — use the interactive body map above for a rough guide by area.",
  },
  {
    q: "How long does a tattoo take?",
    a: "It depends entirely on size, detail and placement. Small, simple pieces can take under an hour, a medium piece usually runs 2–4 hours, and large or highly detailed work (sleeves, back pieces, realism) is spread across multiple sessions. Your artist will give you a realistic time estimate during your consultation.",
  },
  {
    q: "How do I prepare for my tattoo appointment?",
    a: "Get a good night's sleep, eat a proper meal beforehand and stay hydrated. Wear comfortable clothing that gives easy access to the area being tattooed. Avoid alcohol for at least 24 hours before your session (it thins the blood), and don't sunburn the area beforehand. Bring a snack and water for longer sessions.",
  },
  {
    q: "How long does a tattoo take to heal?",
    a: "The surface usually heals in about 2–3 weeks, while the deeper layers of skin finish settling over roughly 2–3 months. During the first weeks the tattoo may scab lightly and peel — this is normal. Follow your aftercare instructions closely for the best result.",
  },
  {
    q: "How do I take care of my new tattoo?",
    a: "Keep it clean and moisturised, wash gently with lukewarm water and a fragrance-free soap, and apply a thin layer of aftercare cream. Avoid direct sun, swimming pools, saunas, baths and picking or scratching while it heals. You can download our full aftercare guide below.",
  },
  {
    q: "Can I shower, swim or exercise after getting tattooed?",
    a: "You can shower normally (short and lukewarm — no soaking), but avoid swimming pools, the sea, baths, saunas and hot tubs until the tattoo is fully healed, usually 2–3 weeks. Light activity is fine, but avoid heavy sweating and friction on the fresh tattoo for the first few days.",
  },
  {
    q: "What tattoo styles do you specialise in?",
    a: "Our resident and guest artists cover a wide range of styles — realism and black-and-grey, chicano, fine line, watercolour, anime and manga, geometric and ornamental blackwork, botanical and minimal work, and custom lettering. Take a look at the artists page to find the right match for your idea.",
  },
  {
    q: "Can I bring my own design or reference?",
    a: "Absolutely — references, mood boards and rough ideas are all welcome and genuinely helpful. Our artists will work with you to turn your idea into a custom design that suits your body and placement. We don't copy other artists' original work, but we can create something in a similar spirit.",
  },
  {
    q: "How much does a tattoo cost?",
    a: "Pricing depends on size, complexity and placement, and is discussed during your consultation. Larger pieces are usually quoted per session, and cover-ups and reworks are quoted separately. There is a minimum charge for very small tattoos.",
  },
  {
    q: "How do I book an appointment?",
    a: "By appointment only — in person, by email, via Instagram, or through this website. We don't take walk-ins. Our official addresses are booking@thefourdeuces.nl and studio@thefourdeuces.nl.",
  },
  {
    q: "What is your cancellation policy?",
    a: "We ask for at least 48 hours' notice to cancel or reschedule. Arriving more than 30 minutes late without letting us know may result in cancellation or rescheduling and loss of your deposit.",
  },
  {
    q: "How can I pay?",
    a: "We accept cash and credit/debit cards, and PayPal may be available by prior agreement. Tips are appreciated but never expected.",
  },
  {
    q: "What is the minimum age to get a tattoo?",
    a: "You must be 18 or older, or accompanied by an adult. Please bring valid photo ID to your appointment.",
  },
  {
    q: "Can I get a tattoo if I'm pregnant, breastfeeding or unwell?",
    a: "We don't tattoo anyone who is pregnant or breastfeeding, and we ask that you reschedule if you're feeling ill on the day. If you have a medical condition, are on certain medication, or have skin concerns in the area, let us know in advance so we can advise you.",
  },
  {
    q: "Do you use numbing cream or anaesthetic?",
    a: "No local anaesthetics are used during the session.",
  },
  {
    q: "Do you offer touch-ups?",
    a: "One complimentary touch-up is offered within 6 months, subject to the conditions in our Terms & Conditions. This does not apply to guest artists.",
  },
  {
    q: "Will my tattoo fade over time?",
    a: "All tattoos soften and settle as they age, but good aftercare makes a big difference. The biggest factor is sun exposure — keeping a healed tattoo protected with SPF will keep it looking crisp and vibrant for far longer. Fine line and very small details naturally age faster than bold work.",
  },
  {
    q: "Can you cover up or rework an old tattoo?",
    a: "Often, yes. Cover-ups and reworks depend on the size, colour and darkness of the existing tattoo, so send us a clear photo and we'll let you know what's realistically possible. These are always quoted separately after a consultation.",
  },
  {
    q: "Can I bring someone with me to my appointment?",
    a: "Yes, but accompanying persons must remain on the ground floor during your session.",
  },
];
