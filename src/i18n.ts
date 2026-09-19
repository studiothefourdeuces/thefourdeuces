// Lightweight i18n for the site: four languages, English is the default and
// lives at the un-prefixed paths ("/", "/book", …); the others live under a
// path prefix ("/nl/book", "/de", "/ua/artists"). The visible label + URL use
// "ua" for Ukrainian, but the HTML `lang`/hreflang uses the correct ISO 639-1
// code "uk" (a language code — not the UK country).

export const LANGS = [
  { code: "en", label: "EN", htmlLang: "en" },
  { code: "nl", label: "NL", htmlLang: "nl" },
  { code: "de", label: "DE", htmlLang: "de" },
  { code: "ua", label: "UA", htmlLang: "uk" },
] as const;

export type Lang = (typeof LANGS)[number]["code"];
export const DEFAULT_LANG: Lang = "en";

export const htmlLangFor = (lang: Lang): string =>
  LANGS.find((l) => l.code === lang)?.htmlLang ?? "en";

// Split a pathname into its language and the language-agnostic rest ("/",
// "/book", "/realism"). English (no prefix) is the fallback.
export function splitLangPath(pathname: string): { lang: Lang; rest: string } {
  const m = pathname.match(/^\/(nl|de|ua)(\/.*)?$/);
  if (m) return { lang: m[1] as Lang, rest: m[2] || "/" };
  return { lang: DEFAULT_LANG, rest: pathname || "/" };
}

// Build a real pathname for a language from a language-agnostic rest.
export function langPath(lang: Lang, rest: string): string {
  const clean = rest.startsWith("/") ? rest : `/${rest}`;
  if (lang === "en") return clean;
  return clean === "/" ? `/${lang}` : `/${lang}${clean}`;
}

// ---------------------------------------------------------------------------
// String dictionary. Flat keys; each key carries all four languages. Missing
// translations fall back to English, then to the key itself.
// ---------------------------------------------------------------------------

type Entry = Partial<Record<Lang, string>> & { en: string };

const DICT: Record<string, Entry> = {
  "title.home": {
    en: "The Four Deuces - Tattoo Studio & Artspace",
    nl: "The Four Deuces — Tattoostudio & Artspace",
    de: "The Four Deuces — Tattoo-Studio & Artspace",
    ua: "The Four Deuces — Тату-студія та Artspace",
  },
  "title.book": {
    en: "Book a Tattoo Appointment | The Four Deuces Amsterdam",
    nl: "Tattoo-afspraak boeken | The Four Deuces Amsterdam",
    de: "Tattoo-Termin buchen | The Four Deuces Amsterdam",
    ua: "Запис на тату | The Four Deuces Амстердам",
  },
  "title.artists": {
    en: "Our Tattoo Artists | The Four Deuces Amsterdam",
    nl: "Onze tattoo-artiesten | The Four Deuces Amsterdam",
    de: "Unsere Tattoo-Künstler | The Four Deuces Amsterdam",
    ua: "Наші тату-майстри | The Four Deuces Амстердам",
  },
  "title.faq": {
    en: "Tattoo FAQ | The Four Deuces Amsterdam",
    nl: "Tattoo-FAQ | The Four Deuces Amsterdam",
    de: "Tattoo-FAQ | The Four Deuces Amsterdam",
    ua: "Тату FAQ | The Four Deuces Амстердам",
  },
  "title.contact": {
    en: "Contact | The Four Deuces Tattoo Studio Amsterdam",
    nl: "Contact | The Four Deuces Tattoostudio Amsterdam",
    de: "Kontakt | The Four Deuces Tattoo-Studio Amsterdam",
    ua: "Контакти | Тату-студія The Four Deuces Амстердам",
  },
  "title.terms": {
    en: "Terms & Privacy | The Four Deuces",
    nl: "Voorwaarden & Privacy | The Four Deuces",
    de: "AGB & Datenschutz | The Four Deuces",
    ua: "Умови та конфіденційність | The Four Deuces",
  },
  "title.notfound": {
    en: "Page not found | The Four Deuces",
    nl: "Pagina niet gevonden | The Four Deuces",
    de: "Seite nicht gefunden | The Four Deuces",
    ua: "Сторінку не знайдено | The Four Deuces",
  },

  "desc.home": {
    en: "Tattoo studio & artspace in Amsterdam's Museum Quarter — custom realism, microrealism, fine line, chicano, anime, ornamental and cover-ups.",
    nl: "Tattoostudio & artspace in de Amsterdamse Museumwijk — custom realisme, microrealisme, fine line, chicano, anime, ornamenteel en cover-ups.",
    de: "Tattoo-Studio & Artspace im Amsterdamer Museumsviertel — individueller Realismus, Mikrorealismus, Fine Line, Chicano, Anime, Ornamental und Cover-ups.",
    ua: "Тату-студія та artspace в Музейному кварталі Амстердама — індивідуальні реалізм, мікрореалізм, fine line, чикано, аніме, орнаментал і кавер-апи.",
  },
  "desc.book": {
    en: "Book your tattoo at The Four Deuces in Amsterdam — pick the area on the body map, add your budget and WhatsApp, or request a free consultation.",
    nl: "Boek je tattoo bij The Four Deuces in Amsterdam — kies de plek op de lichaamskaart, voeg je budget en WhatsApp toe, of vraag een gratis consult aan.",
    de: "Buche dein Tattoo bei The Four Deuces in Amsterdam — wähle die Stelle auf der Körperkarte, füge Budget und WhatsApp hinzu oder frage eine kostenlose Beratung an.",
    ua: "Запишись на тату в The Four Deuces в Амстердамі — обери зону на карті тіла, додай бюджет і WhatsApp або замов безкоштовну консультацію.",
  },
  "desc.artists": {
    en: "Meet the resident and guest tattoo artists at The Four Deuces, Amsterdam — realism, chicano, fine line, anime, watercolour and blackwork. See their portfolios.",
    nl: "Ontmoet de vaste en gastartiesten van The Four Deuces in Amsterdam — realisme, chicano, fine line, anime, aquarel en blackwork. Bekijk hun portfolio's.",
    de: "Lerne die festen und Gast-Künstler von The Four Deuces in Amsterdam kennen — Realismus, Chicano, Fine Line, Anime, Aquarell und Blackwork. Sieh ihre Portfolios.",
    ua: "Знайомся з резидентними та запрошеними майстрами The Four Deuces в Амстердамі — реалізм, чикано, fine line, аніме, акварель і blackwork. Дивись портфоліо.",
  },
  "desc.faq": {
    en: "Answers to common tattoo questions — does it hurt, healing time, aftercare, prep, pricing, age and more — plus aftercare and risk documents to download.",
    nl: "Antwoorden op veelgestelde tattoovragen — doet het pijn, genezing, nazorg, voorbereiding, prijzen, leeftijd en meer — plus nazorg- en risicodocumenten om te downloaden.",
    de: "Antworten auf häufige Tattoo-Fragen — tut es weh, Heilung, Nachsorge, Vorbereitung, Preise, Alter und mehr — plus Nachsorge- und Risikodokumente zum Download.",
    ua: "Відповіді на поширені запитання про тату — чи боляче, загоєння, догляд, підготовка, ціни, вік тощо — плюс документи з догляду й ризиків для завантаження.",
  },
  "desc.contact": {
    en: "Get in touch with The Four Deuces tattoo studio in Amsterdam — bookings, collaborations, press and general questions.",
    nl: "Neem contact op met tattoostudio The Four Deuces in Amsterdam — boekingen, samenwerkingen, pers en algemene vragen.",
    de: "Kontaktiere das Tattoo-Studio The Four Deuces in Amsterdam — Buchungen, Kooperationen, Presse und allgemeine Fragen.",
    ua: "Звʼяжись із тату-студією The Four Deuces в Амстердамі — записи, співпраця, преса та загальні питання.",
  },
  "desc.terms": {
    en: "Terms & Conditions and Privacy Policy for The Four Deuces tattoo studio in Amsterdam.",
    nl: "Algemene voorwaarden en privacybeleid van tattoostudio The Four Deuces in Amsterdam.",
    de: "AGB und Datenschutzerklärung des Tattoo-Studios The Four Deuces in Amsterdam.",
    ua: "Умови та політика конфіденційності тату-студії The Four Deuces в Амстердамі.",
  },
  "title.guests": {
    en: "Guests & Careers | The Four Deuces Amsterdam",
    nl: "Gastartiesten & Vacatures | The Four Deuces Amsterdam",
    de: "Gäste & Karriere | The Four Deuces Amsterdam",
    ua: "Гості та кар'єра | The Four Deuces Амстердам",
  },
  "desc.guests": {
    en: "Guest-artist spots and careers at The Four Deuces tattoo studio in Amsterdam — our terms and how to join. Get in touch at studio@thefourdeuces.nl.",
    nl: "Gastplekken en vacatures bij tattoostudio The Four Deuces in Amsterdam — onze voorwaarden en hoe je meedoet. Mail naar studio@thefourdeuces.nl.",
    de: "Gastplätze und Karriere im Tattoo-Studio The Four Deuces in Amsterdam — unsere Bedingungen und wie du dabei bist. Schreib an studio@thefourdeuces.nl.",
    ua: "Гостьові місця та кар'єра в тату-студії The Four Deuces в Амстердамі — наші умови та як приєднатися. Пиши на studio@thefourdeuces.nl.",
  },

  // --- Guests & Careers page (/guests) ---
  "guests.kicker": {
    en: "Guests & Careers",
    nl: "Gasten & Vacatures",
    de: "Gäste & Karriere",
    ua: "Гості та кар'єра",
  },
  "guests.title": {
    en: "Want to join?",
    nl: "Wil je meedoen?",
    de: "Lust mitzumachen?",
    ua: "Хочеш до нас?",
  },
  "guests.intro": {
    en: "The Four Deuces is a spacious studio and artspace in Amsterdam's Museum Quarter. We host visiting guest artists and welcome new residents who share our standards and care for their clients.",
    nl: "The Four Deuces is een ruime studio en artspace in de Museumbuurt van Amsterdam. We ontvangen gastartiesten en verwelkomen nieuwe residents die onze standaarden en zorg voor klanten delen.",
    de: "The Four Deuces ist ein großzügiges Studio und Artspace im Museumsviertel von Amsterdam. Wir empfangen Gastkünstler und heißen neue Residents willkommen, die unsere Standards und die Sorgfalt für Kunden teilen.",
    ua: "The Four Deuces — це простора студія та artspace в Музейному кварталі Амстердама. Ми приймаємо запрошених майстрів і раді новим резидентам, які поділяють наші стандарти та турботу про клієнтів.",
  },
  "guests.guest.title": {
    en: "Guest artists",
    nl: "Gastartiesten",
    de: "Gastkünstler",
    ua: "Запрошені майстри",
  },
  "guests.guest.text": {
    en: "Planning a guest spot in Amsterdam? Reach out with your preferred dates, styles and a link to your portfolio. We'll share our setup, availability and terms. Every artist works with sterile, single-use equipment and follows Dutch hygiene standards.",
    nl: "Plan je een gastplek in Amsterdam? Neem contact op met je gewenste data, stijlen en een link naar je portfolio. We delen onze opzet, beschikbaarheid en voorwaarden. Iedere artiest werkt met steriel, wegwerpbaar materiaal en volgt de Nederlandse hygiënestandaarden.",
    de: "Planst du einen Gastplatz in Amsterdam? Melde dich mit deinen Wunschterminen, Stilen und einem Link zu deinem Portfolio. Wir teilen unser Setup, die Verfügbarkeit und die Bedingungen. Jeder Künstler arbeitet mit sterilem Einwegmaterial und folgt den niederländischen Hygienestandards.",
    ua: "Плануєш гостьовий візит до Амстердама? Напиши нам бажані дати, стилі та посилання на портфоліо. Ми розкажемо про наше облаштування, доступність і умови. Кожен майстер працює зі стерильним одноразовим інструментом і дотримується нідерландських стандартів гігієни.",
  },
  "guests.careers.title": {
    en: "Careers",
    nl: "Vacatures",
    de: "Karriere",
    ua: "Кар'єра",
  },
  "guests.careers.text": {
    en: "We're always looking for talented tattoo artists to join the team. If our studio feels like the right place for you, tell us a little about yourself — your experience, styles and what you're looking for — and share a link to your portfolio.",
    nl: "We zijn altijd op zoek naar getalenteerde tattoo-artiesten voor het team. Als onze studio bij je past, vertel dan iets over jezelf — je ervaring, stijlen en wat je zoekt — en deel een link naar je portfolio.",
    de: "Wir suchen immer nach talentierten Tätowierern für das Team. Wenn unser Studio zu dir passt, erzähl uns ein wenig über dich — Erfahrung, Stile und was du suchst — und teile einen Link zu deinem Portfolio.",
    ua: "Ми завжди у пошуку талановитих тату-майстрів у команду. Якщо наша студія — це про тебе, розкажи трохи про себе — досвід, стилі та що ти шукаєш — і додай посилання на портфоліо.",
  },
  "guests.emailLabel": {
    en: "Join our team",
    nl: "Kom bij ons team",
    de: "Werde Teil des Teams",
    ua: "Приєднуйся до команди",
  },
  "guests.emailIntro": {
    en: "Submit your portfolio and a few details about yourself to ",
    nl: "Stuur je portfolio en wat gegevens over jezelf naar ",
    de: "Sende dein Portfolio und ein paar Angaben zu dir an ",
    ua: "Надішли своє портфоліо та кілька слів про себе на ",
  },
  "guests.faq.title": {
    en: "Good to know",
    nl: "Goed om te weten",
    de: "Gut zu wissen",
    ua: "Варто знати",
  },
  "guests.faq.supplies.q": {
    en: "Do I need to bring my own supplies?",
    nl: "Moet ik mijn eigen materiaal meenemen?",
    de: "Muss ich mein eigenes Material mitbringen?",
    ua: "Чи потрібно привозити свої розхідники?",
  },
  "guests.faq.supplies.a": {
    en: "No — guests and residents alike work fully stocked, as the studio covers every consumable. Cartridges and needles, inks and pigments, grips, tubes and tips, nitrile gloves, barrier film and clip-cord sleeves, razors, green soap, wipes, ink caps and cleaning supplies are all on us. Just bring your machines and your style; we handle the rest.",
    nl: "Nee — gasten en residents werken volledig bevoorraad, want de studio zorgt voor alle verbruiksartikelen. Cartridges en naalden, inkten en pigmenten, grips, tubes en tips, nitril handschoenen, barrièrefolie en clipcord-hoesjes, scheermesjes, green soap, doekjes, inktcupjes en schoonmaakmiddelen zijn van ons. Neem je machines en je stijl mee; de rest regelen wij.",
    de: "Nein — Gäste und Residents arbeiten voll ausgestattet, denn das Studio stellt alle Verbrauchsmaterialien. Cartridges und Nadeln, Farben und Pigmente, Grips, Tubes und Tips, Nitrilhandschuhe, Barrierefolie und Clip-Cord-Hüllen, Rasierer, Green Soap, Tücher, Farbkappen und Reinigungsmittel gehen auf uns. Bring deine Maschinen und deinen Stil mit; um den Rest kümmern wir uns.",
    ua: "Ні — і гості, і резиденти працюють повністю забезпеченими, адже студія бере на себе всі розхідники. Картриджі та голки, фарби й пігменти, грипи, тюби й типси, нітрилові рукавички, бар'єрна плівка та чохли для кліп-корду, станки, green soap, серветки, ковпачки для фарби та засоби для прибирання — усе за наш рахунок. Бери свої машинки та свій стиль, решту забезпечимо ми.",
  },
  "guests.faq.q1": {
    en: "What do I need to guest with you?",
    nl: "Wat heb ik nodig om als gast te werken?",
    de: "Was brauche ich für einen Gastplatz?",
    ua: "Що потрібно, щоб працювати в нас як гість?",
  },
  "guests.faq.a1": {
    en: "A strong portfolio, a professional attitude and valid ID. Send us your work and your preferred dates, and we'll take it from there.",
    nl: "Een sterk portfolio, een professionele instelling en een geldig ID. Stuur ons je werk en je gewenste data, dan pakken wij het op.",
    de: "Ein starkes Portfolio, eine professionelle Einstellung und ein gültiger Ausweis. Schick uns deine Arbeiten und deine Wunschtermine, den Rest übernehmen wir.",
    ua: "Сильне портфоліо, професійний підхід і чинне посвідчення особи. Надішли свої роботи та бажані дати — далі ми все організуємо.",
  },
  "guests.faq.q2": {
    en: "Are there studio rules to follow?",
    nl: "Zijn er studioregels om te volgen?",
    de: "Gibt es Studioregeln, die ich einhalten muss?",
    ua: "Чи є правила студії, яких треба дотримуватися?",
  },
  "guests.faq.a2": {
    en: "Yes. Guest artists are required to strictly follow the studio's sanitary, behavioral and all other house rules at all times — it keeps the space safe, clean and welcoming for every client and the whole team.",
    nl: "Ja. Gastartiesten moeten zich te allen tijde strikt houden aan de sanitaire, gedrags- en alle andere huisregels van de studio — zo blijft de ruimte veilig, schoon en prettig voor elke klant en het hele team.",
    de: "Ja. Gastkünstler müssen jederzeit die hygienischen, verhaltensbezogenen und alle weiteren Hausregeln des Studios strikt einhalten — so bleibt der Raum sicher, sauber und einladend für jeden Kunden und das ganze Team.",
    ua: "Так. Гостьові майстри зобов'язані суворо дотримуватися санітарних, поведінкових та всіх інших правил студії у будь-який час — це тримає простір безпечним, чистим і приємним для кожного клієнта й усієї команди.",
  },
  "guests.faq.q3": {
    en: "How long can I guest for?",
    nl: "Hoe lang kan ik als gast blijven?",
    de: "Wie lange kann ich als Gast bleiben?",
    ua: "Наскільки довго можна гостювати?",
  },
  "guests.faq.a3": {
    en: "Anything from a few days to a couple of weeks. Tell us your preferred dates and we'll find a slot that works.",
    nl: "Van een paar dagen tot enkele weken. Laat ons je gewenste data weten en we vinden een geschikt moment.",
    de: "Von ein paar Tagen bis zu einigen Wochen. Nenn uns deine Wunschtermine und wir finden einen passenden Zeitraum.",
    ua: "Від кількох днів до пари тижнів. Напиши бажані дати — і ми знайдемо зручний час.",
  },
  "guests.faq.q4": {
    en: "How does commission work?",
    nl: "Hoe werkt de commissie?",
    de: "Wie funktioniert die Kommission?",
    ua: "Як працює комісія?",
  },
  "guests.faq.a4": {
    en: "You choose the setup that suits you best — either a fixed percentage of each piece, or a flat fee to rent your station in the studio. We'll walk you through both when we're in touch.",
    nl: "Jij kiest wat het beste bij je past — óf een vast percentage per stuk, óf een vaste huurprijs voor je werkplek in de studio. We lichten beide opties toe zodra we contact hebben.",
    de: "Du wählst das Modell, das am besten zu dir passt — entweder einen festen Prozentsatz pro Arbeit oder eine feste Miete für deinen Platz im Studio. Beide Optionen besprechen wir, sobald wir in Kontakt sind.",
    ua: "Ти обираєш формат, що підходить саме тобі — або сталий відсоток від кожної роботи, або фіксовану вартість оренди робочого місця в студії. Обидва варіанти обговоримо, щойно звʼяжемося.",
  },
  "guests.faq.q5": {
    en: "Do you provide accommodation?",
    nl: "Bieden jullie accommodatie aan?",
    de: "Bietet ihr eine Unterkunft an?",
    ua: "Чи надаєте ви житло?",
  },
  "guests.faq.a5": {
    en: "We don't provide accommodation, but we're happy to share tips on good areas and places to stay near the studio.",
    nl: "We bieden geen accommodatie aan, maar we delen graag tips over fijne buurten en plekken om te verblijven in de buurt van de studio.",
    de: "Wir bieten keine Unterkunft an, geben dir aber gern Tipps zu guten Vierteln und Unterkünften in der Nähe des Studios.",
    ua: "Житло ми не надаємо, але залюбки підкажемо хороші райони та варіанти проживання неподалік студії.",
  },
  "guests.faq.q6": {
    en: "Do you cover travel costs?",
    nl: "Vergoeden jullie reiskosten?",
    de: "Übernehmt ihr Reisekosten?",
    ua: "Чи покриваєте ви витрати на дорогу?",
  },
  "guests.faq.a6": {
    en: "No. All travel is at the artist's own expense — including getting to and from the airport and commuting to and from the studio.",
    nl: "Nee. Alle reizen zijn voor eigen rekening van de artiest — inclusief het vervoer van en naar de luchthaven en het woon-werkverkeer van en naar de studio.",
    de: "Nein. Alle Reisen gehen auf eigene Kosten des Künstlers — einschließlich der Fahrten von und zum Flughafen sowie der Wege von und zum Studio.",
    ua: "Ні. Уся дорога — за рахунок майстра, зокрема трансфер до/з аеропорту та поїздки до/зі студії.",
  },
  "guests.faq.q7": {
    en: "Will you promote my guest spot?",
    nl: "Promoten jullie mijn gastplek?",
    de: "Bewerbt ihr meinen Gastplatz?",
    ua: "Чи будете ви просувати мій гостьовий візит?",
  },
  "guests.faq.a7": {
    en: "Yes — we announce guest artists to our audience and on Instagram to help you fill your dates.",
    nl: "Ja — we kondigen gastartiesten aan bij ons publiek en op Instagram om je data te helpen vullen.",
    de: "Ja — wir kündigen Gastkünstler bei unserem Publikum und auf Instagram an, damit deine Termine sich füllen.",
    ua: "Так — ми анонсуємо запрошених майстрів своїй аудиторії та в Instagram, щоб допомогти заповнити твої дати.",
  },
  "guests.faq.q8": {
    en: "How far in advance should I reach out?",
    nl: "Hoe ver van tevoren moet ik contact opnemen?",
    de: "Wie weit im Voraus sollte ich mich melden?",
    ua: "Наскільки заздалегідь варто звертатися?",
  },
  "guests.faq.a8": {
    en: "The earlier the better — a few weeks to a couple of months ahead gives us time to lock in your dates and promote your spot.",
    nl: "Hoe eerder hoe beter — een paar weken tot enkele maanden vooruit geeft ons tijd om je data vast te leggen en je plek te promoten.",
    de: "Je früher, desto besser — ein paar Wochen bis einige Monate im Voraus geben uns Zeit, deine Termine festzulegen und deinen Platz zu bewerben.",
    ua: "Що раніше, то краще — за кілька тижнів чи пару місяців ми встигнемо закріпити дати та прорекламувати твій візит.",
  },
  "guests.docs.title": {
    en: "Documents",
    nl: "Documenten",
    de: "Dokumente",
    ua: "Документи",
  },
  "guests.docs.firstaid": {
    en: "First Aid Guide",
    nl: "EHBO-gids",
    de: "Erste-Hilfe-Leitfaden",
    ua: "Посібник з першої допомоги",
  },
  "guests.docs.hygiene": {
    en: "Hygiene & Disinfection Guidelines",
    nl: "Richtlijnen hygiëne & desinfectie",
    de: "Richtlinien für Hygiene & Desinfektion",
    ua: "Правила гігієни та дезінфекції",
  },
  "guests.agree.pre": {
    en: "By contacting us you agree to our ",
    nl: "Door contact op te nemen ga je akkoord met onze ",
    de: "Mit der Kontaktaufnahme stimmst du unseren ",
    ua: "Звертаючись до нас, ви погоджуєтесь з нашими ",
  },

  "nav.home": { en: "Home", nl: "Home", de: "Start", ua: "Головна" },
  "nav.artists": {
    en: "Artists",
    nl: "Artiesten",
    de: "Künstler",
    ua: "Майстри",
  },
  "nav.reviews": {
    en: "Reviews",
    nl: "Reviews",
    de: "Bewertungen",
    ua: "Відгуки",
  },
  "nav.about": { en: "About", nl: "Over ons", de: "Studio", ua: "Про нас" },
  "about.proud": {
    en: "Proudly Ukrainian 🇺🇦",
    nl: "Trots Oekraïens 🇺🇦",
    de: "Stolz ukrainisch 🇺🇦",
    ua: "Горді бути українцями 🇺🇦",
  },
  "nav.faq": { en: "FAQ", nl: "FAQ", de: "FAQ", ua: "FAQ" },

  // Hero — the cycling label (two phrases).
  "hero.book": {
    en: "book experience",
    nl: "boek een ervaring",
    de: "erlebnis buchen",
    ua: "записатися на сеанс",
  },
  "hero.consult": {
    en: "request consultation",
    nl: "vraag een consult aan",
    de: "beratung anfragen",
    ua: "безкоштовна консультація",
  },

  // Menu bottom CTAs. "*.a" is the regular word, "*.b" the italic one.
  "cta.book.a": { en: "Book", nl: "Boek", de: "Erlebnis", ua: "Запис на" },
  "cta.book.b": {
    en: "experience",
    nl: "ervaring",
    de: "buchen",
    ua: "сеанс",
  },
  "cta.free": { en: "Free", nl: "Gratis", de: "Gratis", ua: "FREE" },
  "cta.consult.a": {
    en: "Request",
    nl: "Vraag",
    de: "Beratung",
    ua: "",
  },
  "cta.consult.b": {
    en: "consultation",
    nl: "consult aan",
    de: "anfragen",
    ua: "консультація",
  },
  "cta.contact": {
    en: "Contact",
    nl: "Contact",
    de: "Kontakt",
    ua: "Контакти",
  },

  // --- Mobile language menu ---
  "lang.title": {
    en: "Choose language",
    nl: "Kies je taal",
    de: "Sprache wählen",
    ua: "Оберіть мову",
  },
  "lang.desc": {
    en: "Choose the language you'd like to browse the site in. It applies across every page.",
    nl: "Kies de taal waarin je de site wilt bekijken. Dit geldt voor alle pagina's.",
    de: "Wähle die Sprache, in der du die Seite ansehen möchtest. Sie gilt für alle Seiten.",
    ua: "Оберіть мову, якою бажаєте переглядати сайт. Вона застосується до всіх сторінок.",
  },

  // --- Booking form ---
  // Input placeholders are shown in the site's lowercase style — keep German
  // lowercase too (WhatsApp stays capitalised, it's a brand name).
  "form.ph.budget": {
    en: "your budget",
    nl: "je budget",
    de: "dein budget",
    ua: "твій бюджет",
  },
  "form.ph.whatsapp": {
    en: "your WhatsApp",
    nl: "je WhatsApp",
    de: "dein WhatsApp",
    ua: "твій WhatsApp",
  },
  "form.hint": {
    en: "Please include your country code — e.g. +31 6 12345678",
    nl: "Vermeld je landcode — bijv. +31 6 12345678",
    de: "Bitte mit Ländervorwahl — z. B. +31 6 12345678",
    ua: "Вкажи код країни — напр. +31 6 12345678",
  },
  "form.consult.a": { en: "Free", nl: "Gratis", de: "Kostenlose", ua: "Безкоштовна" },
  "form.consult.b": {
    en: "consultation",
    nl: "consult",
    de: "Beratung",
    ua: "консультація",
  },
  "form.booking.a": { en: "Request a", nl: "Vraag een", de: "Termin", ua: "Запит на" },
  "form.booking.b": {
    en: "booking",
    nl: "boeking",
    de: "anfragen",
    ua: "бронювання",
  },
  "form.consult.sub": {
    en: "Leave your WhatsApp — we'll reach out",
    nl: "Laat je WhatsApp achter — we nemen contact op",
    de: "Hinterlasse deine WhatsApp — wir melden uns",
    ua: "Залиш свій WhatsApp — ми напишемо",
  },
  "form.step": { en: "Step", nl: "Stap", de: "Schritt", ua: "Крок" },
  "form.of": { en: "of", nl: "van", de: "von", ua: "з" },
  "form.with": { en: "with", nl: "met", de: "mit", ua: "з" },
  "form.next": { en: "Okay, next", nl: "Oké, verder", de: "Weiter", ua: "Далі" },
  "form.submit.consult": {
    en: "Request consultation",
    nl: "Vraag consult aan",
    de: "Beratung anfragen",
    ua: "Надіслати заявку",
  },
  "form.submit.booking": {
    en: "Request booking",
    nl: "Boeking aanvragen",
    de: "Termin anfragen",
    ua: "Надіслати заявку",
  },
  "form.done.consult.a": { en: "Request", nl: "Verzoek", de: "Anfrage", ua: "Заявку" },
  "form.done.consult.b": {
    en: "received.",
    nl: "ontvangen.",
    de: "erhalten.",
    ua: "отримано.",
  },
  "form.done.booking.a": { en: "Booking", nl: "Boeking", de: "Buchung", ua: "Бронювання" },
  "form.done.booking.b": {
    en: "requested.",
    nl: "aangevraagd.",
    de: "angefragt.",
    ua: "надіслано.",
  },
  "form.done.msg": {
    en: "Thank you for your request. We'll contact you on WhatsApp in the next 24 hours.",
    nl: "Bedankt voor je aanvraag. We nemen binnen 24 uur contact met je op via WhatsApp.",
    de: "Danke für deine Anfrage. Wir melden uns innerhalb von 24 Stunden über WhatsApp.",
    ua: "Дякуємо за заявку. Ми звʼяжемось з тобою у WhatsApp протягом 24 годин.",
  },
  "form.lbl.budget": { en: "budget", nl: "budget", de: "budget", ua: "бюджет" },
  "form.lbl.artist": { en: "artist", nl: "artiest", de: "künstler", ua: "майстер" },
  "form.lbl.placement": {
    en: "placement",
    nl: "plek",
    de: "platzierung",
    ua: "розміщення",
  },

  // --- Book page ---
  "book.kicker": {
    en: "Book an appointment",
    nl: "Een afspraak maken",
    de: "Termin buchen",
    ua: "Запис на сеанс",
  },
  "book.title": { en: "Book", nl: "Boeken", de: "Buchen", ua: "Запис" },
  "book.intro": {
    en: "Start by choosing the area you'd like tattooed. Then add your budget and your WhatsApp.",
    nl: "Kies eerst de plek die je wilt laten tatoeëren. Voeg daarna je budget en je WhatsApp toe.",
    de: "Wähle zuerst die Stelle, die du tätowieren lassen möchtest. Füge dann dein Budget und dein WhatsApp hinzu.",
    ua: "Спершу обери місце для тату. Потім додай свій бюджет і WhatsApp.",
  },
  "book.intro.italic": {
    en: "We'll be in touch to arrange the rest.",
    nl: "We nemen contact op om de rest te regelen.",
    de: "Wir melden uns, um den Rest zu klären.",
    ua: "Ми звʼяжемось, щоб домовитись про решту.",
  },
  "book.tap.a": { en: "Tap a body", nl: "Tik op een", de: "Tippe auf eine", ua: "Обери" },
  "book.tap.b": { en: "area", nl: "lichaamsdeel", de: "körperstelle", ua: "зону" },
  "book.tap.lead": {
    en: "Select any part of the body to see how much it typically hurts and how long a session tends to take. Switch between front and back with the toggle.",
    nl: "Selecteer een lichaamsdeel om te zien hoeveel pijn het meestal doet en hoe lang een sessie duurt. Wissel tussen voor- en achterkant met de schakelaar.",
    de: "Wähle eine Körperstelle, um zu sehen, wie schmerzhaft sie meist ist und wie lange eine Sitzung dauert. Wechsle mit dem Schalter zwischen Vorder- und Rückseite.",
    ua: "Обери частину тіла, щоб побачити, наскільки це зазвичай боляче і скільки триває сеанс. Перемикай перед і спину перемикачем.",
  },
  "book.notsure": {
    en: "Not sure yet? No commitment.",
    nl: "Nog niet zeker? Geen verplichting.",
    de: "Noch unsicher? Ganz unverbindlich.",
    ua: "Ще не впевнені? Ні до чого не зобовʼязує.",
  },
  "book.freeconsult": {
    en: "Request free consultation",
    nl: "Vraag gratis consult aan",
    de: "Kostenlose Beratung anfragen",
    ua: "Замовити безкоштовну консультацію",
  },

  // --- Artists (home showcase + /artists) ---
  "ui.ourArtists": {
    en: "Our artists",
    nl: "Onze artiesten",
    de: "Unsere Künstler",
    ua: "Наші майстри",
  },
  "ui.artists": { en: "Artists", nl: "Artiesten", de: "Künstler", ua: "Майстри" },
  "ui.bookWith": {
    en: "Book with",
    nl: "Boek bij",
    de: "Termin bei",
    ua: "Записатися до",
  },
  "ui.seePortfolio": {
    en: "See portfolio",
    nl: "Bekijk portfolio",
    de: "Portfolio ansehen",
    ua: "Дивитись портфоліо",
  },
  "ui.worksBy": {
    en: "Works by",
    nl: "Werk van",
    de: "Arbeiten von",
    ua: "Роботи від",
  },
  "ui.tattooingSince": {
    en: "Tattooing since",
    nl: "Tatoeëert sinds",
    de: "Tätowiert seit",
    ua: "Татуює з",
  },
  "ui.portfolioSoon": {
    en: "Portfolio coming soon.",
    nl: "Portfolio volgt binnenkort.",
    de: "Portfolio folgt in Kürze.",
    ua: "Портфоліо скоро.",
  },

  // --- Style page labels ---
  "ui.ourStyles": {
    en: "Our styles",
    nl: "Onze stijlen",
    de: "Unsere Stile",
    ua: "Наші стилі",
  },
  "ui.madeByArtists": {
    en: "Made by our artists",
    nl: "Gemaakt door onze artiesten",
    de: "Von unseren Künstlern",
    ua: "Роблять наші майстри",
  },
  "ui.otherStyles": {
    en: "Other styles",
    nl: "Andere stijlen",
    de: "Weitere Stile",
    ua: "Інші стилі",
  },
  "ui.qa": {
    en: "Questions & answers",
    nl: "Vragen & antwoorden",
    de: "Fragen & Antworten",
    ua: "Питання та відповіді",
  },

  // --- Reviews / Sponsors ---
  "ui.whatPeopleSay": {
    en: "What people say",
    nl: "Wat mensen zeggen",
    de: "Was Leute sagen",
    ua: "Що кажуть люди",
  },
  "ui.reviews": {
    en: "Reviews",
    nl: "Reviews",
    de: "Bewertungen",
    ua: "Відгуки",
  },
  "ui.supplyPartner": {
    en: "Supply partner",
    nl: "Leverancier",
    de: "Lieferpartner",
    ua: "Партнер-постачальник",
  },

  // --- FAQ page ---
  "faq.kicker": {
    en: "Good to know",
    nl: "Goed om te weten",
    de: "Gut zu wissen",
    ua: "Корисно знати",
  },
  "faq.downloads": {
    en: "Downloads",
    nl: "Downloads",
    de: "Downloads",
    ua: "Завантаження",
  },
  "faq.dutchOnly": {
    en: "Available in Dutch (Nederlands) only.",
    nl: "Alleen in het Nederlands beschikbaar.",
    de: "Nur auf Niederländisch verfügbar.",
    ua: "Доступно лише нідерландською.",
  },
  "faq.dl.aftercare": {
    en: "Aftercare instructions",
    nl: "Nazorginstructies",
    de: "Nachsorge-Anleitung",
    ua: "Інструкція з догляду",
  },
  "faq.dl.risks": {
    en: "Information about risks",
    nl: "Informatie over risico's",
    de: "Informationen zu Risiken",
    ua: "Інформація про ризики",
  },
  "faq.bookLink": {
    en: "Booking page",
    nl: "Boekpagina",
    de: "Buchungsseite",
    ua: "сторінці Booking",
  },
  "faq.consultCta": {
    en: "Book a free consultation",
    nl: "Vraag een gratis consult aan",
    de: "Kostenlose Beratung anfragen",
    ua: "Замов безкоштовну консультацію",
  },
  "faq.foot.pre": {
    en: "For full details, please read our ",
    nl: "Lees voor alle details onze ",
    de: "Alle Details findest du in unseren ",
    ua: "Усі деталі — у наших ",
  },
  "faq.foot.lang": {
    en: " (in English)",
    nl: " (in het Engels)",
    de: " (auf Englisch)",
    ua: " (англійською)",
  },
  "legal.terms": {
    en: "Terms & Conditions",
    nl: "Algemene voorwaarden",
    de: "AGB",
    ua: "Умовах",
  },

  // --- Contact ---
  "contact.kicker": {
    en: "Get in touch",
    nl: "Neem contact op",
    de: "Kontakt aufnehmen",
    ua: "Звʼязатися",
  },
  "contact.title": {
    en: "Contact",
    nl: "Contact",
    de: "Kontakt",
    ua: "Контакти",
  },
  "contact.intro.pre": {
    en: "For bookings, use the ",
    nl: "Voor boekingen gebruik je de ",
    de: "Für Buchungen nutze die ",
    ua: "Для запису скористайся ",
  },
  "contact.intro.link": {
    en: "book page",
    nl: "boekpagina",
    de: "Buchungsseite",
    ua: "сторінкою бронювання",
  },
  "contact.intro.post": {
    en: ". For collaborations, press or general questions — drop us a line below.",
    nl: ". Voor samenwerkingen, pers of algemene vragen — stuur ons hieronder een bericht.",
    de: ". Für Kooperationen, Presse oder allgemeine Fragen — schreib uns unten.",
    ua: ". Для співпраці, преси чи загальних питань — напиши нам нижче.",
  },
  "contact.ph.name": {
    en: "Your name",
    nl: "Je naam",
    de: "Dein Name",
    ua: "Твоє ім'я",
  },
  "contact.ph.email": {
    en: "Your email",
    nl: "Je e-mail",
    de: "Deine E-Mail",
    ua: "Твій email",
  },
  "contact.ph.message": {
    en: "Your message",
    nl: "Je bericht",
    de: "Deine Nachricht",
    ua: "Твоє повідомлення",
  },
  "contact.send": {
    en: "Send message",
    nl: "Verstuur bericht",
    de: "Nachricht senden",
    ua: "Надіслати",
  },
  "contact.error": {
    en: "Please add your name, a valid email and a message.",
    nl: "Vul je naam, een geldig e-mailadres en een bericht in.",
    de: "Bitte gib deinen Namen, eine gültige E-Mail und eine Nachricht an.",
    ua: "Вкажи ім'я, дійсний email і повідомлення.",
  },
  "contact.done.a": {
    en: "Message",
    nl: "Bericht",
    de: "Nachricht",
    ua: "Повідомлення",
  },
  "contact.done.b": {
    en: "sent.",
    nl: "verzonden.",
    de: "gesendet.",
    ua: "надіслано.",
  },
  "contact.done.note": {
    en: "We only use your email to reply to your message. It isn't stored anywhere and is deleted from our records as soon as we've been in touch.",
    nl: "We gebruiken je e-mail alleen om te reageren. Hij wordt nergens bewaard en wordt verwijderd zodra we contact hebben gehad.",
    de: "Wir nutzen deine E-Mail nur, um zu antworten. Sie wird nirgends gespeichert und gelöscht, sobald wir in Kontakt waren.",
    ua: "Ми використовуємо твій email лише для відповіді. Він ніде не зберігається і видаляється, щойно ми звʼяжемось.",
  },
  "contact.partnerships": {
    en: "Partnerships & collaborations",
    nl: "Partnerschappen & samenwerkingen",
    de: "Partnerschaften & Kooperationen",
    ua: "Партнерства та співпраця",
  },
  "contact.agree.pre": {
    en: "By contacting us you agree to our ",
    nl: "Door contact op te nemen ga je akkoord met onze ",
    de: "Mit deiner Kontaktaufnahme akzeptierst du unsere ",
    ua: "Звʼязуючись із нами, ти погоджуєшся з нашими ",
  },
  "contact.careers": {
    en: "Careers & guests",
    nl: "Vacatures & gastartiesten",
    de: "Karriere & Gäste",
    ua: "Кар'єра та гості",
  },
  "contact.careers.pre": {
    en: "Want to join our team or come by as a guest? See ",
    nl: "Wil je bij ons team komen of langskomen als gastartiest? Bekijk ",
    de: "Möchtest du ins Team oder als Gastkünstler vorbeikommen? Siehe ",
    ua: "Хочеш приєднатися до нашої команди чи завітати як гість? Дивись ",
  },
  "contact.careers.link": {
    en: "Guests & Careers",
    nl: "Gastartiesten & Vacatures",
    de: "Gäste & Karriere",
    ua: "Гості та кар'єра",
  },
  "contact.careers.post": {
    en: ".",
    nl: ".",
    de: ".",
    ua: ".",
  },

  // --- Cookie banner ---
  "cookie.text": {
    en: "We use cookies to understand how you use our site. Accept to help us improve.",
    nl: "We gebruiken cookies om te begrijpen hoe je onze site gebruikt. Accepteer om ons te helpen verbeteren.",
    de: "Wir verwenden Cookies, um zu verstehen, wie du unsere Seite nutzt. Akzeptiere, um uns zu helfen.",
    ua: "Ми використовуємо кукі, щоб розуміти, як ти користуєшся сайтом. Прийми, щоб допомогти нам покращитись.",
  },
  "cookie.privacy": {
    en: "Privacy Policy",
    nl: "Privacybeleid",
    de: "Datenschutz",
    ua: "Політика конфіденційності",
  },
  "cookie.decline": {
    en: "Decline",
    nl: "Weigeren",
    de: "Ablehnen",
    ua: "Відхилити",
  },
  "cookie.accept": {
    en: "Accept",
    nl: "Accepteren",
    de: "Akzeptieren",
    ua: "Прийняти",
  },

  // --- Footer ---
  "footer.designed": {
    en: "Designed & developed by",
    nl: "Ontworpen & ontwikkeld door",
    de: "Design & Entwicklung von",
    ua: "Дизайн і розробка —",
  },
  "footer.terms": {
    en: "Terms & Privacy",
    nl: "Voorwaarden & Privacy",
    de: "AGB & Datenschutz",
    ua: "Умови та конфіденційність",
  },
  "footer.localTime": {
    en: "Local time",
    nl: "Lokale tijd",
    de: "Ortszeit",
    ua: "Місцевий час",
  },

  // --- 404 ---
  "nf.kicker": {
    en: "Page not found",
    nl: "Pagina niet gevonden",
    de: "Seite nicht gefunden",
    ua: "Сторінку не знайдено",
  },
  "nf.msg": {
    en: "This page went up in smoke. Let's get you back to the studio.",
    nl: "Deze pagina ging in rook op. Laten we je terugbrengen naar de studio.",
    de: "Diese Seite ist in Rauch aufgegangen. Zurück ins Studio.",
    ua: "Ця сторінка розчинилась у диму. Повернімось до студії.",
  },
  "nf.back": {
    en: "Back home",
    nl: "Terug naar home",
    de: "Zur Startseite",
    ua: "На головну",
  },

  // --- Rotate notice ---
  "rotate.a": {
    en: "Please rotate your",
    nl: "Draai je",
    de: "Bitte drehe dein",
    ua: "Поверни свій",
  },
  "rotate.b": {
    en: "device.",
    nl: "apparaat.",
    de: "Gerät.",
    ua: "пристрій.",
  },
  "rotate.msg": {
    en: "The Four Deuces is best experienced in portrait. Turn your phone upright to continue.",
    nl: "The Four Deuces is op zijn best in portretmodus. Zet je telefoon rechtop om verder te gaan.",
    de: "The Four Deuces wirkt am besten im Hochformat. Stell dein Telefon aufrecht, um fortzufahren.",
    ua: "The Four Deuces найкраще у портретному режимі. Постав телефон вертикально, щоб продовжити.",
  },

  // --- Body map ---
  "body.front": { en: "Front", nl: "Voor", de: "Vorne", ua: "Перед" },
  "body.back": { en: "Back", nl: "Achter", de: "Hinten", ua: "Спина" },
  "body.selectedArea": {
    en: "Selected area",
    nl: "Gekozen zone",
    de: "Ausgewählte Stelle",
    ua: "Обрана зона",
  },
  "body.painLevel": {
    en: "Pain level",
    nl: "Pijnniveau",
    de: "Schmerzlevel",
    ua: "Рівень болю",
  },
  "body.typicalSession": {
    en: "Typical session",
    nl: "Typische sessie",
    de: "Typische Sitzung",
    ua: "Тривалість сеансу",
  },
  "body.bookThis": {
    en: "Book this area",
    nl: "Boek deze plek",
    de: "Diese Stelle buchen",
    ua: "Записатися на цю зону",
  },
  "pain.1": { en: "Low", nl: "Laag", de: "Gering", ua: "Низький" },
  "pain.2": { en: "Medium", nl: "Gemiddeld", de: "Mittel", ua: "Середній" },
  "pain.3": { en: "High", nl: "Hoog", de: "Hoch", ua: "Високий" },
  "pain.4": { en: "Severe", nl: "Zeer hoog", de: "Sehr hoch", ua: "Дуже високий" },
};

export function t(lang: Lang, key: string): string {
  const entry = DICT[key];
  if (!entry) return key;
  return entry[lang] ?? entry.en ?? key;
}
