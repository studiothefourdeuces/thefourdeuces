// Marketing / SEO copy — studio "About" text and the per-style landing pages.
// Kept free of imports (like faq.ts) so vite.config.ts can read it at build
// time to prerender titles/descriptions and per-style FAQPage structured data.

export type Faq = { q: string; a: string };

// ---------------------------------------------------------------------------
// Studio "About" — shown on /about and mirrored (visually hidden) on the home
// page for SEO. Plain, honest business description — no keyword stuffing.
// ---------------------------------------------------------------------------
export const ABOUT = {
  seoTitle: "About | The Four Deuces Tattoo Studio Amsterdam",
  seoDescription:
    "Custom, highly detailed tattoos in Amsterdam's Museum Quarter — realism, microrealism, fine line, chicano, anime, abstract and cover-ups. Van Baerlestraat 126H.",
  kicker: "About the studio",
  title: "The Four Deuces",
  intro: [
    "Our studio specialises in creating highly detailed, artistic tattoos from fully custom designs. We work across realism and microrealism, fine line, chicano, anime, abstract, and both black-and-grey and colour tattooing — and we take on cover-ups of poor-quality work and scars.",
  ],
  whyTitle: "Why clients choose us",
  why: [
    {
      h: "An anatomical approach",
      p: "Every design is developed around your body's anatomy and the natural movement of your muscles, so the tattoo sits and flows the way it should.",
    },
    {
      h: "Safety & sterility",
      p: "Single-use sterile cartridges, professional equipment and certified hypoallergenic pigments that meet European (EU REACH) safety standards.",
    },
    {
      h: "Complex work & cover-ups",
      p: "We take on cover-ups of any complexity — often without lengthy laser removal, when the design is chosen correctly.",
    },
  ],
  locationTitle: "How to find us",
  location: [
    "Our studio sits in one of Amsterdam's most prestigious and cultural districts — the Museum Quarter (Amsterdam Zuid), at Van Baerlestraat 126H.",
    "We're just a few minutes' walk from Museumplein, the Van Gogh Museum and Vondelpark. On the ground floor (begane grond) and easy to reach by public transport — tram lines run right along Van Baerlestraat — or by car.",
  ],
};

// About in the other three languages. English (ABOUT) is the fallback.
type AboutText = typeof ABOUT;

const ABOUT_NL: AboutText = {
  seoTitle: "Over ons | The Four Deuces Tattoostudio Amsterdam",
  seoDescription:
    "Maatwerk, zeer gedetailleerde tattoos in de Museumwijk van Amsterdam — realisme, microrealisme, fine line, chicano, anime, abstract en cover-ups. Van Baerlestraat 126H.",
  kicker: "Over de studio",
  title: "The Four Deuces",
  intro: [
    "Onze studio is gespecialiseerd in zeer gedetailleerde, artistieke tattoos vanuit volledig custom ontwerpen. We werken in realisme en microrealisme, fine line, chicano, anime, abstract en zowel zwart-grijs als kleur — en we nemen cover-ups van slecht werk en littekens aan.",
  ],
  whyTitle: "Waarom klanten voor ons kiezen",
  why: [
    {
      h: "Een anatomische aanpak",
      p: "Elk ontwerp bouwen we op rond jouw anatomie en de natuurlijke beweging van je spieren, zodat de tattoo zit en meebeweegt zoals het hoort.",
    },
    {
      h: "Veiligheid & steriliteit",
      p: "Steriele cartridges voor eenmalig gebruik, professionele apparatuur en gecertificeerde hypoallergene pigmenten die voldoen aan de Europese (EU REACH) veiligheidsnormen.",
    },
    {
      h: "Complex werk & cover-ups",
      p: "We nemen cover-ups van elke complexiteit aan — vaak zonder langdurige laserverwijdering, als het ontwerp goed gekozen is.",
    },
  ],
  locationTitle: "Zo vind je ons",
  location: [
    "Onze studio ligt in een van de meest prestigieuze en culturele wijken van Amsterdam — de Museumwijk (Amsterdam Zuid), aan de Van Baerlestraat 126H.",
    "We zitten op een paar minuten lopen van het Museumplein, het Van Gogh Museum en het Vondelpark. Op de begane grond en goed bereikbaar met het openbaar vervoer — er rijden trams langs de Van Baerlestraat — of met de auto.",
  ],
};

const ABOUT_DE: AboutText = {
  seoTitle: "Studio | The Four Deuces Tattoo-Studio Amsterdam",
  seoDescription:
    "Individuelle, hochdetaillierte Tattoos im Museumsviertel von Amsterdam — Realismus, Mikrorealismus, Fine Line, Chicano, Anime, Abstrakt und Cover-ups. Van Baerlestraat 126H.",
  kicker: "Über das Studio",
  title: "The Four Deuces",
  intro: [
    "Unser Studio ist auf hochdetaillierte, künstlerische Tattoos aus komplett individuellen Entwürfen spezialisiert. Wir arbeiten in Realismus und Mikrorealismus, Fine Line, Chicano, Anime, Abstrakt sowie in Schwarz-Grau und Farbe — und übernehmen Cover-ups von schlechter Arbeit und Narben.",
  ],
  whyTitle: "Warum Kunden uns wählen",
  why: [
    {
      h: "Ein anatomischer Ansatz",
      p: "Jedes Design entwickeln wir rund um deine Anatomie und die natürliche Bewegung deiner Muskeln, damit das Tattoo sitzt und fließt, wie es soll.",
    },
    {
      h: "Sicherheit & Sterilität",
      p: "Sterile Einweg-Cartridges, professionelle Ausrüstung und zertifizierte hypoallergene Pigmente nach europäischen (EU REACH) Sicherheitsstandards.",
    },
    {
      h: "Komplexe Arbeiten & Cover-ups",
      p: "Wir übernehmen Cover-ups jeder Komplexität — oft ohne langwierige Laserentfernung, wenn das Design richtig gewählt ist.",
    },
  ],
  locationTitle: "So findest du uns",
  location: [
    "Unser Studio liegt in einem der angesehensten und kulturellsten Viertel Amsterdams — dem Museumsviertel (Amsterdam Zuid), an der Van Baerlestraat 126H.",
    "Wir sind nur wenige Gehminuten vom Museumplein, dem Van-Gogh-Museum und dem Vondelpark entfernt. Im Erdgeschoss und gut mit öffentlichen Verkehrsmitteln erreichbar — entlang der Van Baerlestraat fahren Straßenbahnen — oder mit dem Auto.",
  ],
};

const ABOUT_UA: AboutText = {
  seoTitle: "Про нас | Тату-студія The Four Deuces Амстердам",
  seoDescription:
    "Індивідуальні, деталізовані татуювання в Музейному кварталі Амстердама — реалізм, мікрореалізм, fine line, чикано, аніме, абстракція та кавер-апи. Van Baerlestraat 126H.",
  kicker: "Про студію",
  title: "The Four Deuces",
  intro: [
    "Наша студія спеціалізується на деталізованих, художніх татуюваннях за повністю індивідуальними ескізами. Працюємо в реалізмі й мікрореалізмі, fine line, чикано, аніме, абстракції, у чорно-сірому та кольорі — і беремося за кавер-апи неякісних робіт і шрамів.",
  ],
  whyTitle: "Чому клієнти обирають нас",
  why: [
    {
      h: "Анатомічний підхід",
      p: "Кожен ескіз ми будуємо навколо твоєї анатомії та природного руху мʼязів, щоб тату лягало й рухалося так, як має.",
    },
    {
      h: "Безпека та стерильність",
      p: "Стерильні одноразові картриджі, професійне обладнання та сертифіковані гіпоалергенні пігменти, що відповідають європейським стандартам безпеки (EU REACH).",
    },
    {
      h: "Складні роботи та кавер-апи",
      p: "Беремося за кавер-апи будь-якої складності — часто без тривалого лазерного видалення, якщо ескіз підібрано правильно.",
    },
  ],
  locationTitle: "Як нас знайти",
  location: [
    "Наша студія — в одному з найпрестижніших і найкультурніших районів Амстердама, Музейному кварталі (Amsterdam Zuid), на Van Baerlestraat 126H.",
    "Ми за кілька хвилин пішки від Museumplein, музею Ван Гога та Вондельпарку. На першому поверсі (begane grond), легко дістатися громадським транспортом — уздовж Van Baerlestraat ходять трамваї — або авто.",
  ],
};

const ABOUT_BY_LANG: Record<string, AboutText> = {
  en: ABOUT,
  nl: ABOUT_NL,
  de: ABOUT_DE,
  ua: ABOUT_UA,
};

export function getAbout(lang: string): AboutText {
  return ABOUT_BY_LANG[lang] ?? ABOUT;
}

// ---------------------------------------------------------------------------
// Style landing pages.
// ---------------------------------------------------------------------------
export type StylePage = {
  slug: string; // path, e.g. "/realism-tattoo-amsterdam"
  name: string; // display name
  nav: string; // short label
  seoTitle: string;
  seoDescription: string;
  kicker: string;
  title: string;
  lead: string[]; // intro paragraphs (first-person specialist voice)
  faq: Faq[];
  // lowercase keywords found in an artist's "role" that link here
  aliases: string[];
  // artists (by name) who work in this style — drives the style-page photo,
  // works and artist links.
  artists: string[];
  // Explicit style photo, as a work key "<artistFolder>/<file>.jpg" (e.g.
  // "eugene/1.jpg"). Overrides the default (first artist's first work) — set it
  // when two styles would otherwise share the same image, or to pick a specific
  // piece (it may come from any artist).
  photoKey?: string;
};

export const STYLES: StylePage[] = [
  {
    slug: "/realism",
    name: "Realism & Microrealism",
    nav: "Realism",
    seoTitle: "Realism & Microrealism Tattoo Amsterdam | The Four Deuces",
    seoDescription:
      "Realistic and microrealism tattoos in Amsterdam — portraits, pets and fine detail built on soft gradients and true depth. Book a consultation at The Four Deuces.",
    kicker: "Style",
    title: "Realism & Microrealism",
    lead: [
      "Realism is where a tattoo stops looking like a drawing and starts looking real. We build every piece from soft gradients, light and shadow and true contrast — no hard outlines — so the image carries genuine depth and moves naturally with your body.",
      "From fingernail-sized microrealism to full sleeves, the goal is the same: detail that stays crisp and believable for years, not just on the day it's done.",
    ],
    aliases: ["realism", "microrealism", "micro-realism", "portrait", "portraits", "realismus", "realisme", "реалізм", "мікрореалізм", "porträt", "portret", "портрет"],
    artists: ["Max", "Eugene", "Darya"],
    faq: [
      {
        q: "How many sessions does a realistic tattoo take?",
        a: "Small, detailed pieces and microrealism I usually finish in half a session or a single session. Large-scale work — sleeves, backs, legs — can take four or more sessions, depending on your proportions and how detailed the design is.",
      },
      {
        q: "How does microrealism age and heal?",
        a: "With the right technique (no over-working the skin) and correct spacing between fine details, microrealism holds up beautifully. The key after healing is to protect it from direct sun with SPF 50+.",
      },
      {
        q: "How is realism different, technically, from other styles?",
        a: "In classic styles (like old school or graphic) the design relies on a clear black outline. In realism there are no outlines in the usual sense — form, volume and depth come from soft gradients, careful light and shadow, contrast and layered shading. It demands real artistic fundamentals and confident tonal work.",
      },
      {
        q: "Does microrealism hurt, and how long is a session?",
        a: "Microrealism is usually easier to sit through than large pieces because skin trauma is minimal. I work with ultra-fine needles (0.25–0.30 3RL) that are very gentle. A typical microrealism session runs 2–4 hours, depending on complexity and the number of small details.",
      },
      {
        q: "Will microrealism blur after 3–5 years?",
        a: "Not if it's done correctly. Blurring happens for two reasons: pigment placed too deep (a spread outline) or no 'breathing room' between details. I design microrealism around how skin changes over the years — leaving the right micro-spacing between elements and choosing the right contrast — so it stays crisp and readable.",
      },
      {
        q: "Can you do a realistic portrait of a person or pet?",
        a: "Yes — it's one of my main focuses. The most important thing for a perfect portrait is a high-resolution source photo with good lighting. The clearer the detail in your photo (texture, eyes, light), the more realistic and three-dimensional the result on skin.",
      },
      {
        q: "How do I prepare for a realism session?",
        a: "For 24 hours before, avoid alcohol and blood-thinning medication (they affect fluid and how the pigment settles). Sleep well and eat a proper meal beforehand. Moisturise the area for a few days ahead — pigment sits more evenly on soft, prepared skin.",
      },
      {
        q: "Is a touch-up needed after healing?",
        a: "For microrealism and highly detailed realism, a light touch-up around 4–5 weeks in is sometimes needed — it's assessed individually. Once the skin has fully recovered I check how the finest details and micro-highlights healed and, if needed, refine the contrast in a short session to bring it to perfection.",
      },
    ],
  },
  {
    slug: "/chicano",
    name: "Chicano & Lettering",
    nav: "Chicano",
    seoTitle: "Chicano Tattoo Amsterdam | Black & Grey | The Four Deuces",
    seoDescription:
      "Chicano and lettering tattoos in Amsterdam — black & grey, grey wash, fine lettering and cover-ups. Book a consultation at The Four Deuces studio.",
    kicker: "Style",
    title: "Chicano & Lettering",
    lead: [
      "Chicano is a whole culture rendered in black and grey — a language of grey-wash smoke, deep shadow, fine lettering and clean skin left to breathe. We work in the classic monochrome tradition, from single portraits and script to full narrative sleeves.",
      "The craft is in the balance: soft, velvety shading against sharp contrast, so the piece reads as clearly in ten years as it does today.",
    ],
    aliases: ["chicano", "lettering", "чикано", "леттеринг"],
    artists: ["Max", "Eugene"],
    photoKey: "eugene/1.jpg",
    faq: [
      {
        q: "How is Chicano different from ordinary black & grey realism?",
        a: "Chicano leans heavily on street calligraphy (lettering), a specific iconography (payasa, lowriders, religious motifs) and a softer, smokier grey wash with pronounced contrast accents and fine outline lines.",
      },
      {
        q: "Do you do Chicano in colour?",
        a: "Classic and most striking Chicano is black and grey only. That said, on request I can add small colour accents — red lips, eye colour, details on roses — while keeping the traditional monochrome base.",
      },
      {
        q: "How many sessions for a large Chicano project (sleeve, back)?",
        a: "Single portraits or lettering are done in one session (3–6 hours). Large narrative sleeves or dense back pieces take around five sessions, since the style involves detailed, layered backgrounds — clouds, smoke, cityscapes.",
      },
      {
        q: "Won't the fine swirls in lettering blur over the years?",
        a: "Not if the line weight and the gaps between strokes are planned correctly. I use delicate needle configurations and control pigment depth precisely, which prevents spreading and keeps the lettering readable.",
      },
      {
        q: "Can Chicano be combined with a cover-up?",
        a: "Yes. Thanks to dense black shadows and gradient backgrounds (smoke, clouds, drapery), Chicano is excellent for covering old, poor-quality work. I design the piece so the dark elements fall naturally over the old tattoo.",
      },
      {
        q: "Why is grey wash so important in Chicano, and how does it heal?",
        a: "Grey wash is black pigment diluted to different strengths. Right after the session the soft shadows can look quite dark or reddish from blood flow to the skin. As it heals (over 2–3 weeks) the tone lightens, evens out and takes on that signature smoky, velvety effect Chicano is loved for.",
      },
      {
        q: "How do I keep deep blacks and smooth shadows for years?",
        a: "Saturation depends on proper healing and sun protection. In the first days follow the aftercare exactly, with healing film or professional balms. Once healed, always use high-factor sunscreen (SPF 50+) — UV breaks pigment down and washes out the soft grey gradients.",
      },
    ],
  },
  {
    slug: "/fine-line",
    name: "Fine Line",
    nav: "Fine Line",
    seoTitle: "Fine Line & Watercolour Tattoo Amsterdam | The Four Deuces",
    seoDescription:
      "Fine line, watercolour and abstract tattoos in Amsterdam — airy, delicate, painterly work with jeweller's precision. Book a consultation at The Four Deuces.",
    kicker: "Style",
    title: "Fine Line",
    lead: [
      "Delicate, airy and precise — fine line, watercolour and abstract work treats the body like paper. Think the weight of a single pencil stroke, the bleed of a watercolour wash, shapes that follow your anatomy rather than fight it.",
      "These styles demand a jeweller's control of the needle and a painter's eye for colour — light on the skin, and built to last.",
    ],
    aliases: ["fine line", "fineline", "thin line", "watercolour", "watercolor", "abstract", "aquarel", "aquarell", "акварель", "abstrakt", "абстракц"],
    artists: ["Daria", "Selçuk", "Mila"],
    photoKey: "daria/6.jpg",
    faq: [
      {
        q: "Do fine line tattoos blur over time?",
        a: "With the right technique, no. Lines blur when pigment is placed too deep or poor needles are used. I control pressure and work with ultra-fine modules (0.25 3RL), which keeps edges sharp and crisp after healing.",
      },
      {
        q: "Does a watercolour tattoo need a black outline?",
        a: "Not necessarily. Classic watercolour can be entirely outline-free. To keep it durable and structured, though, I use micro-accents or the right stretch of contrasting tones — a subtle 'framework' that stops the colours merging over time.",
      },
      {
        q: "Do fine line or watercolour tattoos hurt?",
        a: "These are among the most comfortable styles to sit through. Because they use the finest needles and gentle, soft shading, skin trauma is minimal and healing is fast and almost painless.",
      },
      {
        q: "Can fine line and watercolour be combined?",
        a: "Yes — it's one of the most popular and beautiful combinations. A crisp, precise fine-line outline filled with soft watercolour washes and gradients creates a striking contrast between drawing and painting.",
      },
      {
        q: "How is an abstract design developed?",
        a: "Abstract work is always custom. We can start from your references or create the design freehand — drawn with markers directly on your body before the session — so the shapes and lines fit your anatomy perfectly.",
      },
      {
        q: "How do pastel and light watercolour colours age?",
        a: "Lighter shades (yellow, peach, pale blue) heal softer and more naturally over time. To stop them fading in the sun it's essential to protect the healed tattoo with SPF 50+. If needed, a light complimentary touch-up a month after the session brings the colour to full brightness.",
      },
    ],
  },
  {
    slug: "/anime",
    name: "Anime & Manga",
    nav: "Anime",
    seoTitle: "Anime & Manga Tattoo Amsterdam | The Four Deuces",
    seoDescription:
      "Anime and manga tattoos in Amsterdam by real fans of the medium — accurate characters, colour and manga-style black & grey. Book at The Four Deuces.",
    kicker: "Style",
    title: "Anime & Manga",
    lead: [
      "Anime and manga on skin, done by people who actually love the medium. We care about the things that make or break a piece — the exact expression in the eyes, the line of the hair, the energy of the scene — in vivid colour or in true black-and-grey manga panels with screentone and hatching.",
      "Bring a screenshot, a frame or your own concept; we'll adapt it so the character stays unmistakably itself and fits your body perfectly.",
    ],
    aliases: ["anime", "manga", "graphic", "аніме", "манга"],
    artists: ["Darya"],
    photoKey: "darya/6.jpg",
    faq: [
      {
        q: "Can you tattoo my own art or a screenshot from an episode?",
        a: "Yes. Bring any anime screenshot, manga frame or concept art. At the consultation I adapt it for skin — adjusting contrast, adding energy and making sure it sits perfectly in the chosen spot.",
      },
      {
        q: "Do I need to explain the concept if it's an obscure or old anime?",
        a: "In 99% of cases, no — I know this world inside out. I've watched anime for years: cult classics (Evangelion, Berserk, Ghost in the Shell, Cowboy Bebop), the foundational long-runners (Naruto, Bleach, One Piece, JoJo, Hunter x Hunter), each season's new releases (Jujutsu Kaisen, Chainsaw Man, Demon Slayer, Frieren) and niche titles (Monogatari, Made in Abyss, Dorohedoro). You won't have to explain who a character is or what they're like — we'll speak the same language from the start.",
      },
      {
        q: "Why does it matter that the artist actually watches anime?",
        a: "Because an anime tattoo isn't just copying a picture from Google. Understanding the context and lore lets me capture the exact personality and emotion — I know the difference between Sukuna's manic grin and Megumi's cold detachment, and how the eyes shift when a Sharingan or Sage Mode activates. It also lets me build an authentic custom collage: I won't place characters side by side from an arc where they were still enemies if the concept calls for an alliance, and I'll use symbols (kanji, seals, spell auras) that genuinely appear in the source.",
      },
      {
        q: "What's the difference between manga-style and anime-style tattoos?",
        a: "Manga style is monochrome graphic work (black and grey) that mimics printed comic pages — outlines, hatching and screentones. Anime style is usually colour, with a rich palette, smooth gradients and lighting effects that echo the animation.",
      },
      {
        q: "Won't bright colour pigments fade over time?",
        a: "Colour density and longevity depend on technique and aftercare. I pack the pigment in a solid layer at the right depth. To keep colours (especially red, pink, blue) vivid for years, protect the healed tattoo from the sun with SPF 50+.",
      },
      {
        q: "Do anime tattoos hurt?",
        a: "It depends on placement and how much solid colour is involved. A black-and-grey manga panel, with its fine lines and light shading, is relatively quick and comfortable. Large colour pieces take longer to pack solidly, but the session runs at a steady pace with proper breaks.",
      },
      {
        q: "Is anime good for a cover-up?",
        a: "Yes — especially manga panels with dense black backgrounds, or colour compositions with deep dark tones (a character's hair, a dark cloak, magic effects). I design the piece so the dark parts of the art fall over the old tattoo.",
      },
      {
        q: "How do I choose the right size for an anime tattoo?",
        a: "Anime characters are packed with small detail — eye highlights, strands of hair, fabric texture. So the face and details don't smooth out over time, I recommend not going too small. The minimum comfortable size for a detailed portrait is around 12–15 cm.",
      },
    ],
  },
  {
    slug: "/fluid-line",
    name: "Fluid Line",
    nav: "Fluid Line",
    seoTitle: "Fluid Line Tattoo Amsterdam | Signature Style | The Four Deuces",
    seoDescription:
      "A signature 'fluid line' tattoo style in Amsterdam — portraits and animals built from flowing, water-like lines that move with the body. Book at The Four Deuces.",
    kicker: "Signature style",
    title: "Fluid Line",
    lead: [
      "Fluid Line is our own signature approach: instead of static outlines, the whole image — a face, a figure, an animal — is built from flowing, water-like lines that bend, overlap and refract.",
      "The result is a living optical effect that shifts and 'flows' as your body moves. Every piece is drawn one-of-one for your anatomy; no two currents are ever the same.",
    ],
    aliases: ["fluid line", "fluid", "флюід"],
    artists: ["Mila"],
    faq: [
      {
        q: "What makes your 'water line' style unique?",
        a: "The design isn't built on a rigid anatomical template — it's drawn as an organic flow. Portraits and animal figures emerge from streaming currents of line. Every tattoo is one of a kind, made for a specific person and the curves of their body — no two 'flows' can ever be the same.",
      },
      {
        q: "Won't the 'water' lines merge into one blur over time?",
        a: "No. To keep the lines from merging I build in a carefully calculated amount of negative space (bare skin) between the currents and use delicate needle configurations (0.25 mm). The design is engineered to keep a portrait or animal readable for years.",
      },
      {
        q: "Does this technique hurt?",
        a: "The session is very comfortable. The fluid-line technique and soft, smoky shading don't need aggressive, dense packing. With a light needle touch the process is easy to sit through and the skin recovers in just a few days.",
      },
      {
        q: "Can you do a portrait of a specific person or my pet in this style?",
        a: "Yes — it's one of the most striking uses of the style. I work from a photo of the person or animal, keep the recognisable features, gaze and proportions, and transform the texture and form into pliable, curving 'water' currents and soft half-tones.",
      },
      {
        q: "How does a 'fluid' tattoo look in motion?",
        a: "That's the whole point of the style. Because the lines mimic currents and waves, when the muscle flexes — on the forearm, shoulder, calf, ribs or along the spine — the image really does appear to flow and shift with your movement.",
      },
      {
        q: "Is the style suited to large projects (sleeves, backs)?",
        a: "Perfectly. Water currents let me seamlessly connect several subjects — a portrait, an animal and abstract waves, say — into one large-scale piece with no harsh joins and no heavy black backgrounds.",
      },
    ],
  },
  {
    slug: "/ornamental",
    name: "Ornamental, Geometric & Engraving",
    nav: "Ornamental",
    seoTitle: "Ornamental & Geometric Tattoo Amsterdam | The Four Deuces",
    seoDescription:
      "Geometric, optical (Op-Art) and engraving-style ornamental tattoos in Amsterdam — mandalas, dotwork and etching-inspired detail. Book at The Four Deuces.",
    kicker: "Style",
    title: "Ornamental, Geometric & Engraving",
    lead: [
      "Precision as art. This is where exact geometry meets old-world engraving — mandalas and sacred symmetry calculated to your anatomy, Op-Art illusions that lift off the skin, and etching-style linework where depth comes from the direction and density of each stroke rather than soft shading.",
      "Balanced, dimensional and clean — designed to hold its structure for the long run.",
    ],
    aliases: ["ornamental", "geometric", "blackwork", "dotwork", "optical", "engraving", "op-art", "ornamenteel", "орнаментал", "geometrisch", "геометр", "блекворк", "гравюр"],
    artists: ["Gianluca", "Eugene"],
    faq: [
      {
        q: "What's difficult about geometric and optical patterns?",
        a: "They're uncompromising. In geometry and ornamental work there's no room for a stray line — a millimetre off breaks the symmetry. I use mathematical construction when building the design and control every millimetre of the machine's movement so the lines stay flawlessly clean.",
      },
      {
        q: "How is engraving style different from ordinary graphic tattooing?",
        a: "Ordinary graphic work often uses soft shaded fill. Engraving conveys volume, shadow and texture purely through combinations of strokes of varying thickness and angle, cross-hatching and dotwork — creating the textured effect of a vintage illustration.",
      },
      {
        q: "Won't fine engraving strokes and dotwork blur over time?",
        a: "No, if the spacing between strokes and dots is right. I build in the necessary micro-interval (bare skin) and use delicate fine needles, which stops details merging and keeps the pattern readable for years.",
      },
      {
        q: "How do optical (Op-Art) patterns look on curved areas (forearm, calf, thigh)?",
        a: "Curved areas are the best canvas for Op-Art. The muscle gives a flat geometric pattern a natural three-dimensional bend, so the illusion of depth or a 'warping' surface looks even more convincing and dynamic in motion.",
      },
      {
        q: "How do you achieve perfect symmetry on tricky areas (elbows, knees, shoulders)?",
        a: "Placing ornament on joints and contoured areas needs a hybrid approach. The base is applied with a precise digital stencil, and the fine junctions are finished freehand — drawn with markers on your skin — before the session, so the centre of a mandala or pattern stays true in any body position.",
      },
      {
        q: "Do ornamental tattoos on the hands, elbows or spine hurt?",
        a: "It depends on the area and technique. Because ornamental and dotwork are applied with delicate dotting and outline movements, without aggressive trauma to the skin, the session is noticeably easier than dense colour packing.",
      },
      {
        q: "Does ornament on the hands and fingers wear off?",
        a: "Skin on the fingers and palms renews faster than elsewhere. To keep finger and hand ornaments crisp I use special micro-outline techniques and choose the right pigment depth. After full healing a short touch-up may be needed to bring the sharpness to perfection.",
      },
    ],
  },
  {
    slug: "/freehand",
    name: "Freehand",
    nav: "Freehand",
    seoTitle: "Freehand Tattoo Amsterdam | Drawn on the Skin | The Four Deuces",
    seoDescription:
      "Freehand tattoos in Amsterdam — designs drawn straight onto the body with markers so every line follows your anatomy. Book a consultation at The Four Deuces.",
    kicker: "Style",
    title: "Freehand",
    lead: [
      "Freehand skips the printed stencil: the design is drawn directly onto your skin with markers, right before the session, so every line is built around your anatomy and the way you move.",
      "It's the most bespoke way to work — flowing, one-of-one compositions that wrap and sit exactly where they should, impossible to copy onto anyone else.",
    ],
    aliases: ["freehand", "free hand", "фрихенд"],
    artists: ["Mila", "Daria"],
    photoKey: "mila/6.jpg",
    faq: [
      {
        q: "What does a freehand tattoo actually mean?",
        a: "Instead of printing a stencil and transferring it, I sketch the design straight onto your body with skin-safe markers. We shape it together in the mirror before a single line is tattooed, so the flow and placement are perfect for you.",
      },
      {
        q: "Can I still see the design before you start?",
        a: "Absolutely. Nothing is tattooed until you're happy with the drawing on your skin. We adjust the size, angle and flow together, and only begin once it sits right in every position — standing, sitting, arm relaxed and flexed.",
      },
      {
        q: "Why choose freehand over a printed stencil?",
        a: "Freehand lets the design follow your muscles and natural lines instead of being flattened from paper. For pieces that wrap the body — shoulders, ribs, thighs, spine — it gives a far more organic, custom result.",
      },
      {
        q: "Is freehand riskier than a stencil?",
        a: "No — it just requires experience. Because the composition is planned live on your body and refined until it's right, there's no distortion from transferring a flat print onto a curved surface.",
      },
    ],
  },
  {
    slug: "/minimal",
    name: "Minimal & Small Tattoos",
    nav: "Minimal",
    seoTitle: "Minimal & Small Tattoos Amsterdam | Fine Line | The Four Deuces",
    seoDescription:
      "Minimal, small fine-line tattoos in Amsterdam — restrained, elegant designs built to stay clean and readable for years. Book at The Four Deuces.",
    kicker: "Style",
    title: "Minimal & Small",
    lead: [
      "Minimal is restraint done well: a few precise lines, generous negative space and nothing that doesn't need to be there. Small in scale, but planned so it stays crisp and elegant for years.",
      "The discipline is in the details — line weight, spacing and placement — so a quiet piece reads clearly and never crowds itself as it ages.",
    ],
    aliases: ["minimal", "minimalist", "minimalism", "small", "мінімал"],
    artists: ["Selçuk", "Mila", "Daria"],
    photoKey: "mila/11.jpg",
    faq: [
      {
        q: "Do small, minimal tattoos hold up over time?",
        a: "Yes, when they're designed for it. Very thin lines placed too close together can merge over the years, so I plan line weight and spacing carefully and use fine needles — keeping the piece readable long after it's healed.",
      },
      {
        q: "How small can a minimal tattoo go?",
        a: "Quite small, but there's a sensible limit. To keep fine detail clean I recommend a minimum size for lettering and intricate shapes; at the consultation I'll advise the smallest scale that will still age well in your chosen spot.",
      },
      {
        q: "Are minimal tattoos quick and less painful?",
        a: "Usually, yes. With little shading and delicate linework, most minimal pieces are done in a short, comfortable session and heal quickly.",
      },
      {
        q: "Where do small tattoos work best?",
        a: "Flatter, more stable areas — forearm, upper arm, ribs, ankle — hold fine detail best. High-movement, fast-renewing skin like fingers and feet can wear quicker, so I'll flag that and suggest the best placement.",
      },
    ],
  },
  {
    slug: "/botanical",
    name: "Botanical & Floral",
    nav: "Botanical",
    seoTitle: "Botanical & Floral Tattoo Amsterdam | Fine Line | The Four Deuces",
    seoDescription:
      "Botanical and floral tattoos in Amsterdam — delicate fine-line flowers, leaves and plants drawn to flow with the body. Book at The Four Deuces.",
    kicker: "Style",
    title: "Botanical & Floral",
    lead: [
      "Flowers, leaves and branches rendered with a botanist's eye and a fine-line touch — delicate, natural and composed to follow the curves of the body.",
      "From a single stem to a wrapping bouquet, the work stays soft and elegant while built to keep its structure and stay readable for years.",
    ],
    aliases: ["botanical", "floral", "flower", "flowers", "plants", "botanisch", "ботаніка", "ботанічн", "квіт"],
    artists: ["Selçuk", "Mila", "Daria"],
    photoKey: "daria/18.jpg",
    faq: [
      {
        q: "Do fine-line floral tattoos blur as they age?",
        a: "Not when they're done correctly. I control line weight and spacing between petals and stems, and work with fine needles, so the flowers stay crisp and don't merge into a blur over time.",
      },
      {
        q: "Can you design a botanical piece around a meaning?",
        a: "Yes — we can build the composition from flowers and plants that mean something to you (birth flowers, herbs, a favourite bloom) and arrange them so they flow naturally with the placement.",
      },
      {
        q: "Do botanical tattoos work in colour as well as black and grey?",
        a: "Both work beautifully. Fine black-and-grey keeps it delicate and timeless; soft colour or watercolour washes add life. At the consultation we choose what suits your idea and how it will age.",
      },
      {
        q: "Where do floral and botanical designs sit best?",
        a: "They love to follow the body's lines — forearms, the spine, ribs, shoulder and ankle. Longer stems and vines are ideal for wrapping a limb, so the piece feels like it grew there.",
      },
    ],
  },
];

// Resolve an artist "role" token (e.g. "Fine Line") to a style page path.
export function stylePathForToken(token: string): string | null {
  const t = token.trim().toLowerCase();
  if (!t) return null;
  for (const s of STYLES) {
    if (s.aliases.some((a) => t.includes(a))) return s.slug;
  }
  return null;
}

// ---------------------------------------------------------------------------
// Style-page translations. English (STYLES) is the source; the maps below
// override the text fields per language (slug/aliases/artists/photoKey stay
// language-agnostic). Per-style FAQ isn't translated yet, so it falls back to
// English when a language override omits it.
// ---------------------------------------------------------------------------
type StyleText = Pick<
  StylePage,
  "name" | "nav" | "seoTitle" | "seoDescription" | "kicker" | "title" | "lead" | "faq"
>;

const STYLE_TEXT_NL: Record<string, Partial<StyleText>> = {
  "/realism": {
    name: "Realisme & microrealisme",
    nav: "Realisme",
    kicker: "Stijl",
    title: "Realisme & microrealisme",
    seoTitle: "Realisme & microrealisme tattoo Amsterdam | The Four Deuces",
    seoDescription:
      "Realistische en microrealisme-tattoos in Amsterdam — portretten, dieren en fijn detail met zachte gradiënten en echte diepte. Boek een consult bij The Four Deuces.",
    lead: [
      "Realisme is waar een tattoo ophoudt op een tekening te lijken en er echt uit gaat zien. We bouwen elk stuk op uit zachte gradiënten, licht en schaduw en echt contrast — zonder harde outlines — zodat het beeld echte diepte heeft en natuurlijk met je lichaam meebeweegt.",
      "Van microrealisme zo groot als een nagel tot volledige sleeves: het doel blijft hetzelfde — detail dat jarenlang scherp en geloofwaardig blijft, niet alleen op de dag zelf.",
    ],
  },
  "/chicano": {
    name: "Chicano & lettering",
    nav: "Chicano",
    kicker: "Stijl",
    title: "Chicano & lettering",
    seoTitle: "Chicano tattoo Amsterdam | Zwart-grijs | The Four Deuces",
    seoDescription:
      "Chicano- en letteringtattoos in Amsterdam — zwart-grijs, grey wash, fijn lettering en cover-ups. Boek een consult bij The Four Deuces.",
    lead: [
      "Chicano is een hele cultuur in zwart-grijs — een taal van grey-wash rook, diepe schaduw, fijn lettering en huid die mag ademen. We werken in de klassieke monochrome traditie, van losse portretten en script tot volledige verhalende sleeves.",
      "Het vak zit in de balans: zachte, fluweelachtige schaduw tegenover scherp contrast, zodat het stuk over tien jaar net zo helder leest als nu.",
    ],
  },
  "/fine-line": {
    name: "Fine line",
    nav: "Fine line",
    kicker: "Stijl",
    title: "Fine line",
    seoTitle: "Fine line & aquarel tattoo Amsterdam | The Four Deuces",
    seoDescription:
      "Fine line-, aquarel- en abstracte tattoos in Amsterdam — luchtig, fijn en schilderachtig werk met de precisie van een juwelier. Boek een consult bij The Four Deuces.",
    lead: [
      "Fijn, luchtig en precies — fine line, aquarel en abstract werk behandelt het lichaam als papier. Denk aan het gewicht van één potloodstreek, het uitvloeien van een aquarelwassing, vormen die je anatomie volgen in plaats van tegenwerken.",
      "Deze stijlen vragen om de naaldbeheersing van een juwelier en het kleurgevoel van een schilder — licht op de huid en gemaakt om te blijven.",
    ],
  },
  "/anime": {
    name: "Anime & manga",
    nav: "Anime",
    kicker: "Stijl",
    title: "Anime & manga",
    seoTitle: "Anime & manga tattoo Amsterdam | The Four Deuces",
    seoDescription:
      "Anime- en mangatattoos in Amsterdam door echte fans — kloppende personages, kleur en manga-zwart-grijs. Boek bij The Four Deuces.",
    lead: [
      "Anime en manga op de huid, gemaakt door mensen die echt van het medium houden. We letten op wat een stuk maakt of breekt — de precieze blik in de ogen, de lijn van het haar, de energie van de scène — in levendige kleur of in echte zwart-grijze mangapanelen met screentone en arcering.",
      "Neem een screenshot, een frame of je eigen concept mee; wij passen het aan zodat het personage onmiskenbaar zichzelf blijft en perfect op je lichaam past.",
    ],
  },
  "/fluid-line": {
    name: "Fluid line",
    nav: "Fluid line",
    kicker: "Signatuurstijl",
    title: "Fluid line",
    seoTitle: "Fluid line tattoo Amsterdam | Signatuurstijl | The Four Deuces",
    seoDescription:
      "Een signatuur-'fluid line'-tattoostijl in Amsterdam — portretten en dieren uit vloeiende, waterachtige lijnen die met het lichaam meebewegen. Boek bij The Four Deuces.",
    lead: [
      "Fluid line is onze eigen signatuuraanpak: in plaats van statische outlines wordt het hele beeld — een gezicht, een figuur, een dier — opgebouwd uit vloeiende, waterachtige lijnen die buigen, overlappen en breken.",
      "Het resultaat is een levend optisch effect dat verschuift en 'stroomt' als je lichaam beweegt. Elk stuk is uniek getekend voor jouw anatomie; geen twee stromingen zijn ooit hetzelfde.",
    ],
  },
  "/ornamental": {
    name: "Ornamenteel, geometrisch & engraving",
    nav: "Ornamenteel",
    kicker: "Stijl",
    title: "Ornamenteel, geometrisch & engraving",
    seoTitle: "Ornamenteel & geometrisch tattoo Amsterdam | The Four Deuces",
    seoDescription:
      "Geometrische, optische (Op-Art) en engraving-tattoos in Amsterdam — mandala's, dotwork en ets-detail. Boek bij The Four Deuces.",
    lead: [
      "Precisie als kunst. Hier ontmoet exacte geometrie klassiek graveerwerk — mandala's en heilige symmetrie berekend op jouw anatomie, Op-Art-illusies die van de huid af lijken te komen, en ets-achtig lijnwerk waar diepte ontstaat door de richting en dichtheid van elke streek in plaats van zachte schaduw.",
      "In balans, met diepte en strak — ontworpen om zijn structuur langdurig te behouden.",
    ],
  },
  "/freehand": {
    name: "Freehand",
    nav: "Freehand",
    kicker: "Stijl",
    title: "Freehand",
    seoTitle: "Freehand tattoo Amsterdam | Op de huid getekend | The Four Deuces",
    seoDescription:
      "Freehand-tattoos in Amsterdam — ontwerpen direct met markers op het lichaam getekend, zodat elke lijn je anatomie volgt. Boek een consult bij The Four Deuces.",
    lead: [
      "Freehand slaat de geprinte stencil over: het ontwerp wordt vlak voor de sessie direct met markers op je huid getekend, zodat elke lijn rond jouw anatomie en beweging is opgebouwd.",
      "Het is de meest op maat gemaakte manier van werken — vloeiende, unieke composities die zich precies goed om het lichaam vouwen, onmogelijk op iemand anders te kopiëren.",
    ],
  },
  "/minimal": {
    name: "Minimalistisch & kleine tattoos",
    nav: "Minimal",
    kicker: "Stijl",
    title: "Minimalistisch & klein",
    seoTitle: "Minimalistische & kleine tattoos Amsterdam | Fine line | The Four Deuces",
    seoDescription:
      "Minimalistische, kleine fine-line-tattoos in Amsterdam — ingetogen, elegant en gemaakt om jarenlang strak te blijven. Boek bij The Four Deuces.",
    lead: [
      "Minimalistisch is ingetogenheid die klopt: een paar precieze lijnen, ruime negatieve ruimte en niets dat er niet hoeft te zijn. Klein van formaat, maar zo ontworpen dat het jarenlang scherp en elegant blijft.",
      "De discipline zit in de details — lijndikte, ruimte en plaatsing — zodat een rustig stuk helder leest en zichzelf nooit verdringt naarmate het veroudert.",
    ],
  },
  "/botanical": {
    name: "Botanisch & bloemen",
    nav: "Botanisch",
    kicker: "Stijl",
    title: "Botanisch & bloemen",
    seoTitle: "Botanische & bloementattoo Amsterdam | Fine line | The Four Deuces",
    seoDescription:
      "Botanische en bloementattoos in Amsterdam — fijne fine-line bloemen, bladeren en planten die met het lichaam meebewegen. Boek bij The Four Deuces.",
    lead: [
      "Bloemen, bladeren en takken, weergegeven met het oog van een botanicus en een fine-line-toets — fijn, natuurlijk en gecomponeerd om de rondingen van het lichaam te volgen.",
      "Van één steel tot een omwikkelend boeket blijft het werk zacht en elegant, en tegelijk zo gebouwd dat het zijn structuur houdt en jarenlang leesbaar blijft.",
    ],
  },
};

const STYLE_TEXT_DE: Record<string, Partial<StyleText>> = {
  "/realism": {
    name: "Realismus & Mikrorealismus",
    nav: "Realismus",
    kicker: "Stil",
    title: "Realismus & Mikrorealismus",
    seoTitle: "Realismus & Mikrorealismus Tattoo Amsterdam | The Four Deuces",
    seoDescription:
      "Realistische und Mikrorealismus-Tattoos in Amsterdam — Porträts, Tiere und feine Details aus weichen Verläufen und echter Tiefe. Buche eine Beratung bei The Four Deuces.",
    lead: [
      "Realismus ist der Punkt, an dem ein Tattoo aufhört wie eine Zeichnung auszusehen und echt wird. Wir bauen jedes Motiv aus weichen Verläufen, Licht und Schatten und echtem Kontrast auf — ohne harte Outlines — damit das Bild echte Tiefe hat und natürlich mit deinem Körper mitgeht.",
      "Von fingernagelgroßem Mikrorealismus bis zum ganzen Sleeve bleibt das Ziel gleich: Details, die über Jahre scharf und glaubwürdig bleiben, nicht nur am Tag danach.",
    ],
  },
  "/chicano": {
    name: "Chicano & Lettering",
    nav: "Chicano",
    kicker: "Stil",
    title: "Chicano & Lettering",
    seoTitle: "Chicano Tattoo Amsterdam | Schwarz-Grau | The Four Deuces",
    seoDescription:
      "Chicano- und Lettering-Tattoos in Amsterdam — Schwarz-Grau, Grey Wash, feines Lettering und Cover-ups. Buche eine Beratung bei The Four Deuces.",
    lead: [
      "Chicano ist eine ganze Kultur in Schwarz-Grau — eine Sprache aus Grey-Wash-Rauch, tiefem Schatten, feinem Lettering und Haut, die atmen darf. Wir arbeiten in der klassischen monochromen Tradition, von einzelnen Porträts und Schriftzügen bis zu ganzen erzählenden Sleeves.",
      "Das Handwerk liegt in der Balance: weiche, samtige Schattierung gegen scharfen Kontrast, damit das Motiv in zehn Jahren so klar wirkt wie heute.",
    ],
  },
  "/fine-line": {
    name: "Fine Line",
    nav: "Fine Line",
    kicker: "Stil",
    title: "Fine Line",
    seoTitle: "Fine Line & Aquarell Tattoo Amsterdam | The Four Deuces",
    seoDescription:
      "Fine-Line-, Aquarell- und abstrakte Tattoos in Amsterdam — luftige, feine, malerische Arbeit mit der Präzision eines Juweliers. Buche eine Beratung bei The Four Deuces.",
    lead: [
      "Zart, luftig und präzise — Fine Line, Aquarell und abstrakte Arbeit behandelt den Körper wie Papier. Das Gewicht eines einzelnen Bleistiftstrichs, das Verlaufen einer Aquarellwäsche, Formen, die deiner Anatomie folgen statt gegen sie zu arbeiten.",
      "Diese Stile verlangen die Nadelkontrolle eines Juweliers und das Farbauge eines Malers — leicht auf der Haut und gemacht, um zu bleiben.",
    ],
  },
  "/anime": {
    name: "Anime & Manga",
    nav: "Anime",
    kicker: "Stil",
    title: "Anime & Manga",
    seoTitle: "Anime & Manga Tattoo Amsterdam | The Four Deuces",
    seoDescription:
      "Anime- und Manga-Tattoos in Amsterdam von echten Fans — originalgetreue Figuren, Farbe und Manga-Schwarz-Grau. Buche bei The Four Deuces.",
    lead: [
      "Anime und Manga auf der Haut, von Leuten, die das Medium wirklich lieben. Uns zählt, was ein Motiv ausmacht — der genaue Ausdruck in den Augen, die Linie der Haare, die Energie der Szene — in kräftiger Farbe oder in echten Schwarz-Grau-Mangapanels mit Screentone und Schraffur.",
      "Bring einen Screenshot, ein Frame oder dein eigenes Konzept mit; wir passen es an, damit die Figur unverkennbar sie selbst bleibt und perfekt zu deinem Körper passt.",
    ],
  },
  "/fluid-line": {
    name: "Fluid Line",
    nav: "Fluid Line",
    kicker: "Signature-Stil",
    title: "Fluid Line",
    seoTitle: "Fluid Line Tattoo Amsterdam | Signature-Stil | The Four Deuces",
    seoDescription:
      "Ein Signature-'Fluid-Line'-Tattoostil in Amsterdam — Porträts und Tiere aus fließenden, wasserartigen Linien, die sich mit dem Körper bewegen. Buche bei The Four Deuces.",
    lead: [
      "Fluid Line ist unser eigener Signature-Ansatz: statt statischer Outlines wird das ganze Bild — ein Gesicht, eine Figur, ein Tier — aus fließenden, wasserartigen Linien aufgebaut, die sich biegen, überlappen und brechen.",
      "Das Ergebnis ist ein lebendiger optischer Effekt, der sich verschiebt und 'fließt', wenn dein Körper sich bewegt. Jedes Stück wird einzigartig für deine Anatomie gezeichnet; keine zwei Strömungen sind je gleich.",
    ],
  },
  "/ornamental": {
    name: "Ornamental, Geometrisch & Engraving",
    nav: "Ornamental",
    kicker: "Stil",
    title: "Ornamental, Geometrisch & Engraving",
    seoTitle: "Ornamentales & geometrisches Tattoo Amsterdam | The Four Deuces",
    seoDescription:
      "Geometrische, optische (Op-Art) und Gravur-Tattoos in Amsterdam — Mandalas, Dotwork und Stich-Details. Buche bei The Four Deuces.",
    lead: [
      "Präzision als Kunst. Hier trifft exakte Geometrie auf klassisches Gravurwerk — Mandalas und heilige Symmetrie, berechnet auf deine Anatomie, Op-Art-Illusionen, die sich von der Haut zu heben scheinen, und Linienarbeit im Stichstil, bei der Tiefe aus Richtung und Dichte jedes Strichs entsteht statt aus weicher Schattierung.",
      "Ausgewogen, plastisch und sauber — darauf ausgelegt, seine Struktur lange zu halten.",
    ],
  },
  "/freehand": {
    name: "Freehand",
    nav: "Freehand",
    kicker: "Stil",
    title: "Freehand",
    seoTitle: "Freehand Tattoo Amsterdam | Auf der Haut gezeichnet | The Four Deuces",
    seoDescription:
      "Freehand-Tattoos in Amsterdam — Designs direkt mit Markern auf den Körper gezeichnet, damit jede Linie deiner Anatomie folgt. Buche eine Beratung bei The Four Deuces.",
    lead: [
      "Freehand überspringt die gedruckte Schablone: das Design wird direkt vor der Sitzung mit Markern auf deine Haut gezeichnet, damit jede Linie um deine Anatomie und deine Bewegung herum entsteht.",
      "Es ist die individuellste Arbeitsweise — fließende, einzigartige Kompositionen, die sich genau richtig um den Körper legen und sich auf niemanden sonst kopieren lassen.",
    ],
  },
  "/minimal": {
    name: "Minimalistisch & kleine Tattoos",
    nav: "Minimal",
    kicker: "Stil",
    title: "Minimalistisch & klein",
    seoTitle: "Minimalistische & kleine Tattoos Amsterdam | Fine Line | The Four Deuces",
    seoDescription:
      "Minimalistische, kleine Fine-Line-Tattoos in Amsterdam — zurückhaltend, elegant und gemacht, um jahrelang sauber zu bleiben. Buche bei The Four Deuces.",
    lead: [
      "Minimalistisch ist gekonnte Zurückhaltung: ein paar präzise Linien, großzügiger Freiraum und nichts, was nicht sein muss. Klein im Maßstab, aber so geplant, dass es über Jahre scharf und elegant bleibt.",
      "Die Disziplin liegt im Detail — Linienstärke, Abstand und Platzierung — damit ein ruhiges Motiv klar liest und sich beim Altern nie selbst überfüllt.",
    ],
  },
  "/botanical": {
    name: "Botanisch & Floral",
    nav: "Botanisch",
    kicker: "Stil",
    title: "Botanisch & Floral",
    seoTitle: "Botanisches & florales Tattoo Amsterdam | Fine Line | The Four Deuces",
    seoDescription:
      "Botanische und florale Tattoos in Amsterdam — feine Fine-Line-Blumen, Blätter und Pflanzen, die mit dem Körper mitgehen. Buche bei The Four Deuces.",
    lead: [
      "Blumen, Blätter und Zweige, umgesetzt mit dem Auge eines Botanikers und einem Fine-Line-Touch — zart, natürlich und so komponiert, dass sie den Rundungen des Körpers folgen.",
      "Von einem einzelnen Stiel bis zum umschließenden Bouquet bleibt die Arbeit weich und elegant und ist zugleich so gebaut, dass sie ihre Struktur behält und über Jahre lesbar bleibt.",
    ],
  },
};

const STYLE_TEXT_UA: Record<string, Partial<StyleText>> = {
  "/realism": {
    name: "Реалізм і мікрореалізм",
    nav: "Реалізм",
    kicker: "Стиль",
    title: "Реалізм і мікрореалізм",
    seoTitle: "Реалізм і мікрореалізм тату Амстердам | The Four Deuces",
    seoDescription:
      "Реалістичні та мікрореалізм тату в Амстердамі — портрети, тварини й тонкі деталі на мʼяких градієнтах і справжній глибині. Запишись на консультацію в The Four Deuces.",
    lead: [
      "Реалізм — це коли тату перестає бути схожим на малюнок і виглядає по-справжньому. Кожну роботу будуємо з мʼяких градієнтів, світла й тіні та справжнього контрасту — без жорстких контурів — щоб зображення мало глибину й природно рухалося з тілом.",
      "Від мікрореалізму завбільшки з ніготь до повних рукавів мета одна: деталі, що лишаються чіткими й правдоподібними роками, а не лише в день сеансу.",
    ],
  },
  "/chicano": {
    name: "Чикано та леттеринг",
    nav: "Чикано",
    kicker: "Стиль",
    title: "Чикано та леттеринг",
    seoTitle: "Чикано тату Амстердам | Чорно-сіре | The Four Deuces",
    seoDescription:
      "Чикано та леттеринг тату в Амстердамі — чорно-сіре, grey wash, тонкий леттеринг і кавер-апи. Запишись на консультацію в The Four Deuces.",
    lead: [
      "Чикано — це ціла культура в чорно-сірому: мова димчастого grey-wash, глибокої тіні, тонкого леттерингу та чистої шкіри, якій дають дихати. Працюємо в класичній монохромній традиції — від окремих портретів і шрифтів до цілих сюжетних рукавів.",
      "Майстерність — у балансі: мʼяка оксамитова розтушовка проти різкого контрасту, щоб робота читалася через десять років так само чітко, як сьогодні.",
    ],
  },
  "/fine-line": {
    name: "Fine line",
    nav: "Fine line",
    kicker: "Стиль",
    title: "Fine line",
    seoTitle: "Fine line та акварель тату Амстердам | The Four Deuces",
    seoDescription:
      "Fine line, акварель та абстрактні тату в Амстердамі — легкі, тонкі, живописні роботи з ювелірною точністю. Запишись на консультацію в The Four Deuces.",
    lead: [
      "Ніжно, легко й точно — fine line, акварель та абстракція ставляться до тіла як до паперу. Вага одного олівцевого штриха, розтікання акварелі, форми, що йдуть за твоєю анатомією, а не проти неї.",
      "Ці стилі вимагають ювелірного контролю голки та ока художника до кольору — легкі на шкірі й зроблені надовго.",
    ],
  },
  "/anime": {
    name: "Аніме та манга",
    nav: "Аніме",
    kicker: "Стиль",
    title: "Аніме та манга",
    seoTitle: "Аніме та манга тату Амстердам | The Four Deuces",
    seoDescription:
      "Аніме та манга тату в Амстердамі від справжніх фанів — точні персонажі, колір і чорно-сіра манга. Запишись у The Four Deuces.",
    lead: [
      "Аніме й манга на шкірі — від людей, які справді люблять цей медіум. Нам важливе те, що вирішує все: точний вираз очей, лінія волосся, енергія сцени — у яскравому кольорі або в справжніх чорно-сірих панелях манги зі скрінтоном і штрихуванням.",
      "Принеси скріншот, кадр чи власну ідею — ми адаптуємо так, щоб персонаж лишався безсумнівно собою й ідеально ліг на твоє тіло.",
    ],
  },
  "/fluid-line": {
    name: "Fluid line",
    nav: "Fluid line",
    kicker: "Фірмовий стиль",
    title: "Fluid line",
    seoTitle: "Fluid line тату Амстердам | Фірмовий стиль | The Four Deuces",
    seoDescription:
      "Фірмовий стиль тату «fluid line» в Амстердамі — портрети й тварини з плинних водоподібних ліній, що рухаються з тілом. Запишись у The Four Deuces.",
    lead: [
      "Fluid line — наш власний фірмовий підхід: замість статичних контурів усе зображення (обличчя, фігура, тварина) будується з плинних, водоподібних ліній, що згинаються, накладаються й заломлюються.",
      "Результат — живий оптичний ефект, що зміщується й «тече», коли ти рухаєшся. Кожна робота малюється унікально під твою анатомію; двох однакових потоків не буває.",
    ],
  },
  "/ornamental": {
    name: "Орнаментал, геометрія та гравюра",
    nav: "Орнаментал",
    kicker: "Стиль",
    title: "Орнаментал, геометрія та гравюра",
    seoTitle: "Орнаментал і геометрія тату Амстердам | The Four Deuces",
    seoDescription:
      "Геометричні, оптичні (Op-Art) та гравюрні тату в Амстердамі — мандали, dotwork і деталі в стилі гравюри. Запишись у The Four Deuces.",
    lead: [
      "Точність як мистецтво. Тут точна геометрія зустрічає стару гравюру — мандали й сакральна симетрія, розраховані під твою анатомію, Op-Art-ілюзії, що ніби відриваються від шкіри, і лінійна робота в стилі гравюри, де глибина йде від напрямку й щільності штрихів, а не від мʼякої розтушовки.",
      "Збалансовано, обʼємно й чисто — так, щоб структура трималася довго.",
    ],
  },
  "/freehand": {
    name: "Freehand",
    nav: "Freehand",
    kicker: "Стиль",
    title: "Freehand",
    seoTitle: "Freehand тату Амстердам | Малюнок по шкірі | The Four Deuces",
    seoDescription:
      "Freehand тату в Амстердамі — ескізи малюють маркерами прямо на тілі, щоб кожна лінія йшла за анатомією. Запишись на консультацію в The Four Deuces.",
    lead: [
      "Freehand обходиться без друкованого трафарету: ескіз малюють маркерами прямо на шкірі, перед самим сеансом, щоб кожна лінія будувалася навколо твоєї анатомії та руху.",
      "Це найбільш індивідуальний спосіб роботи — плинні, унікальні композиції, що лягають точно як треба й які неможливо скопіювати на когось іншого.",
    ],
  },
  "/minimal": {
    name: "Мінімалізм і маленькі тату",
    nav: "Мінімал",
    kicker: "Стиль",
    title: "Мінімалізм і маленькі",
    seoTitle: "Мінімалізм і маленькі тату Амстердам | Fine line | The Four Deuces",
    seoDescription:
      "Мінімалістичні, маленькі fine-line тату в Амстердамі — стримані, елегантні й зроблені лишатися чіткими роками. Запишись у The Four Deuces.",
    lead: [
      "Мінімалізм — це стриманість, зроблена добре: кілька точних ліній, багато повітря й нічого зайвого. Маленькі за масштабом, але сплановані так, щоб роками лишатися чіткими й елегантними.",
      "Дисципліна — у деталях: товщина ліній, відступи й розташування, щоб спокійна робота читалася чітко й не «зливалася» з часом.",
    ],
  },
  "/botanical": {
    name: "Ботаніка та квіти",
    nav: "Ботаніка",
    kicker: "Стиль",
    title: "Ботаніка та квіти",
    seoTitle: "Ботанічні та квіткові тату Амстердам | Fine line | The Four Deuces",
    seoDescription:
      "Ботанічні та квіткові тату в Амстердамі — тонкі fine-line квіти, листя й рослини, що рухаються з тілом. Запишись у The Four Deuces.",
    lead: [
      "Квіти, листя й гілки, передані оком ботаніка й тонкою fine-line рукою — ніжно, природно й скомпоновано так, щоб іти за вигинами тіла.",
      "Від однієї стеблини до букета, що обвиває, робота лишається мʼякою й елегантною, і водночас зробленою так, щоб тримати структуру й читатися роками.",
    ],
  },
};

const STYLE_TEXT_BY_LANG: Record<string, Record<string, Partial<StyleText>>> = {
  nl: STYLE_TEXT_NL,
  de: STYLE_TEXT_DE,
  ua: STYLE_TEXT_UA,
};

// Per-style FAQ translations (kept separate from the core text so they can be
// filled in language by language). A missing slug falls back to English.
const STYLE_FAQ_NL: Record<string, Faq[]> = {
  "/realism": [
    {
      q: "Hoeveel sessies kost een realistische tattoo?",
      a: "Kleine, gedetailleerde stukken en microrealisme rond ik meestal af in een halve of één sessie. Grootschalig werk — sleeves, ruggen, benen — kan vier of meer sessies kosten, afhankelijk van je proporties en hoe gedetailleerd het ontwerp is.",
    },
    {
      q: "Hoe veroudert en geneest microrealisme?",
      a: "Met de juiste techniek (de huid niet overwerken) en de juiste ruimte tussen fijne details houdt microrealisme prachtig stand. De sleutel na het genezen is bescherming tegen directe zon met SPF 50+.",
    },
    {
      q: "Hoe verschilt realisme technisch van andere stijlen?",
      a: "In klassieke stijlen (zoals old school of graphic) leunt het ontwerp op een duidelijke zwarte outline. In realisme zijn er geen outlines in de gebruikelijke zin — vorm, volume en diepte komen uit zachte gradiënten, zorgvuldig licht en schaduw, contrast en gelaagde schaduw. Het vraagt echte artistieke basis en zeker tonaal werk.",
    },
    {
      q: "Doet microrealisme pijn, en hoe lang duurt een sessie?",
      a: "Microrealisme is meestal makkelijker uit te zitten dan grote stukken omdat de huidschade minimaal is. Ik werk met ultrafijne naalden (0.25–0.30 3RL) die heel zacht zijn. Een typische microrealisme-sessie duurt 2–4 uur, afhankelijk van de complexiteit en het aantal kleine details.",
    },
    {
      q: "Vervaagt microrealisme na 3–5 jaar?",
      a: "Niet als het goed gedaan is. Vervaging gebeurt om twee redenen: pigment te diep geplaatst (een uitgelopen outline) of geen 'ademruimte' tussen details. Ik ontwerp microrealisme rond hoe de huid door de jaren verandert — met de juiste micro-ruimte tussen elementen en het juiste contrast — zodat het scherp en leesbaar blijft.",
    },
    {
      q: "Kun je een realistisch portret van een persoon of huisdier maken?",
      a: "Ja — het is een van mijn hoofdfocussen. Het belangrijkste voor een perfect portret is een bronfoto met hoge resolutie en goed licht. Hoe duidelijker het detail in je foto (textuur, ogen, licht), hoe realistischer en driedimensionaler het resultaat op de huid.",
    },
    {
      q: "Hoe bereid ik me voor op een realisme-sessie?",
      a: "Vermijd 24 uur vooraf alcohol en bloedverdunnende medicatie (die beïnvloeden het vocht en hoe het pigment zich zet). Slaap goed en eet vooraf een volwaardige maaltijd. Hydrateer de plek een paar dagen vooraf — pigment zet zich gelijkmatiger op zachte, voorbereide huid.",
    },
    {
      q: "Is een touch-up nodig na het genezen?",
      a: "Voor microrealisme en zeer gedetailleerd realisme is soms een lichte touch-up rond 4–5 weken nodig — dat wordt individueel beoordeeld. Zodra de huid volledig hersteld is, controleer ik hoe de fijnste details en micro-highlights genazen en verfijn ik indien nodig het contrast in een korte sessie tot in de puntjes.",
    },
  ],
  "/chicano": [
    {
      q: "Hoe verschilt Chicano van gewoon zwart-grijs realisme?",
      a: "Chicano leunt sterk op straatkalligrafie (lettering), een specifieke iconografie (payasa, lowriders, religieuze motieven) en een zachtere, rokerige grey wash met uitgesproken contrastaccenten en fijne outline-lijnen.",
    },
    {
      q: "Doe je Chicano in kleur?",
      a: "Klassiek en het meest indrukwekkend is Chicano alleen zwart-grijs. Op verzoek kan ik wel kleine kleuraccenten toevoegen — rode lippen, oogkleur, details op rozen — met behoud van de traditionele monochrome basis.",
    },
    {
      q: "Hoeveel sessies voor een groot Chicano-project (sleeve, rug)?",
      a: "Losse portretten of lettering doe ik in één sessie (3–6 uur). Grote verhalende sleeves of dichte rugstukken kosten zo'n vijf sessies, omdat de stijl gedetailleerde, gelaagde achtergronden bevat — wolken, rook, stadsgezichten.",
    },
    {
      q: "Vervagen de fijne krullen in lettering na verloop van jaren?",
      a: "Niet als de lijndikte en de ruimte tussen de halen goed gepland zijn. Ik gebruik delicate naaldconfiguraties en beheers de pigmentdiepte precies, wat uitlopen voorkomt en de lettering leesbaar houdt.",
    },
    {
      q: "Kan Chicano gecombineerd worden met een cover-up?",
      a: "Ja. Dankzij dichte zwarte schaduwen en gradiëntachtergronden (rook, wolken, drapering) is Chicano uitstekend om oud, slecht werk te bedekken. Ik ontwerp het stuk zo dat de donkere elementen natuurlijk over de oude tattoo vallen.",
    },
    {
      q: "Waarom is grey wash zo belangrijk in Chicano, en hoe geneest het?",
      a: "Grey wash is zwart pigment in verschillende sterktes verdund. Vlak na de sessie kunnen de zachte schaduwen vrij donker of roodachtig lijken door de doorbloeding van de huid. Tijdens het genezen (over 2–3 weken) wordt de toon lichter, egaler en krijgt hij dat kenmerkende rokerige, fluweelachtige effect waar Chicano om geliefd is.",
    },
    {
      q: "Hoe houd ik diepe zwarten en gladde schaduwen jarenlang?",
      a: "Verzadiging hangt af van goede genezing en zonbescherming. Volg de eerste dagen de nazorg precies, met healingfolie of professionele balsems. Eenmaal genezen: gebruik altijd hoge zonnebrand (SPF 50+) — UV breekt pigment af en spoelt de zachte grijze gradiënten uit.",
    },
  ],
  "/fine-line": [
    {
      q: "Vervagen fine line-tattoos na verloop van tijd?",
      a: "Met de juiste techniek niet. Lijnen vervagen als pigment te diep zit of slechte naalden gebruikt worden. Ik beheers de druk en werk met ultrafijne modules (0.25 3RL), wat de randen scherp en strak houdt na het genezen.",
    },
    {
      q: "Heeft een aquareltattoo een zwarte outline nodig?",
      a: "Niet per se. Klassieke aquarel kan volledig zonder outline. Om het duurzaam en gestructureerd te houden gebruik ik wel micro-accenten of de juiste inzet van contrasterende tonen — een subtiel 'raamwerk' dat voorkomt dat de kleuren mettertijd samensmelten.",
    },
    {
      q: "Doen fine line- of aquareltattoos pijn?",
      a: "Dit horen bij de comfortabelste stijlen om uit te zitten. Omdat ze de fijnste naalden en zachte, milde schaduw gebruiken, is de huidschade minimaal en gaat het genezen snel en vrijwel pijnloos.",
    },
    {
      q: "Kunnen fine line en aquarel gecombineerd worden?",
      a: "Ja — het is een van de populairste en mooiste combinaties. Een scherpe, precieze fine-line-outline gevuld met zachte aquarelwassingen en gradiënten geeft een sterk contrast tussen tekening en schilderij.",
    },
    {
      q: "Hoe ontstaat een abstract ontwerp?",
      a: "Abstract werk is altijd custom. We kunnen starten vanuit je referenties of het ontwerp freehand maken — vlak voor de sessie met markers direct op je lichaam getekend — zodat de vormen en lijnen perfect bij je anatomie passen.",
    },
    {
      q: "Hoe verouderen pastel- en lichte aquarelkleuren?",
      a: "Lichtere tinten (geel, perzik, lichtblauw) genezen zachter en natuurlijker mettertijd. Om te voorkomen dat ze in de zon vervagen is het essentieel de genezen tattoo met SPF 50+ te beschermen. Indien nodig brengt een lichte gratis touch-up een maand na de sessie de kleur op volle helderheid.",
    },
  ],
  "/anime": [
    {
      q: "Kun je mijn eigen art of een screenshot uit een aflevering tatoeëren?",
      a: "Ja. Neem elke anime-screenshot, mangaframe of concept art mee. Bij het consult pas ik het aan voor de huid — contrast bijstellen, energie toevoegen en zorgen dat het perfect op de gekozen plek zit.",
    },
    {
      q: "Moet ik het concept uitleggen als het een obscure of oude anime is?",
      a: "In 99% van de gevallen niet — ik ken deze wereld door en door. Ik kijk al jaren anime: cultklassiekers (Evangelion, Berserk, Ghost in the Shell, Cowboy Bebop), de bepalende langlopers (Naruto, Bleach, One Piece, JoJo, Hunter x Hunter), de nieuwe releases van elk seizoen (Jujutsu Kaisen, Chainsaw Man, Demon Slayer, Frieren) en nichetitels (Monogatari, Made in Abyss, Dorohedoro). Je hoeft niet uit te leggen wie een personage is of hoe het is — we spreken vanaf het begin dezelfde taal.",
    },
    {
      q: "Waarom maakt het uit dat de artiest echt anime kijkt?",
      a: "Omdat een anime-tattoo niet gewoon een plaatje van Google kopiëren is. De context en lore begrijpen laat me de precieze persoonlijkheid en emotie vangen — ik ken het verschil tussen Sukuna's manische grijns en Megumi's koele afstandelijkheid, en hoe de ogen veranderen wanneer een Sharingan of Sage Mode activeert. Het laat me ook een authentieke custom collage bouwen: ik zet geen personages naast elkaar uit een arc waarin ze nog vijanden waren als het concept om een alliantie vraagt, en ik gebruik symbolen (kanji, zegels, spreukaura's) die echt in de bron voorkomen.",
    },
    {
      q: "Wat is het verschil tussen manga- en anime-stijl tattoos?",
      a: "Manga-stijl is monochroom graphic werk (zwart-grijs) dat gedrukte strippagina's nabootst — outlines, arcering en screentones. Anime-stijl is meestal kleur, met een rijk palet, vloeiende gradiënten en lichteffecten die de animatie weerspiegelen.",
    },
    {
      q: "Vervagen felle kleurpigmenten na verloop van tijd?",
      a: "Kleurdichtheid en houdbaarheid hangen af van techniek en nazorg. Ik pak het pigment in een stevige laag op de juiste diepte. Om kleuren (vooral rood, roze, blauw) jarenlang levendig te houden, bescherm de genezen tattoo tegen de zon met SPF 50+.",
    },
    {
      q: "Doen anime-tattoos pijn?",
      a: "Dat hangt af van de plaatsing en hoeveel egale kleur erin zit. Een zwart-grijs mangapaneel, met zijn fijne lijnen en lichte schaduw, is relatief snel en comfortabel. Grote kleurstukken kosten meer tijd om stevig in te pakken, maar de sessie verloopt in een gestaag tempo met goede pauzes.",
    },
    {
      q: "Is anime goed voor een cover-up?",
      a: "Ja — vooral mangapanelen met dichte zwarte achtergronden, of kleurcomposities met diepe donkere tonen (het haar van een personage, een donkere mantel, magie-effecten). Ik ontwerp het stuk zo dat de donkere delen van de art over de oude tattoo vallen.",
    },
    {
      q: "Hoe kies ik de juiste maat voor een anime-tattoo?",
      a: "Anime-personages zitten vol klein detail — oog-highlights, haarlokken, stoftextuur. Zodat het gezicht en de details mettertijd niet vervlakken, raad ik aan niet te klein te gaan. De minimaal comfortabele maat voor een gedetailleerd portret is rond 12–15 cm.",
    },
  ],
  "/fluid-line": [
    {
      q: "Wat maakt jouw 'waterlijn'-stijl uniek?",
      a: "Het ontwerp is niet gebouwd op een strak anatomisch sjabloon — het wordt getekend als een organische stroming. Portretten en dierfiguren ontstaan uit stromende lijnstromen. Elke tattoo is uniek, gemaakt voor een specifiek persoon en de rondingen van hun lichaam — geen twee 'stromingen' kunnen ooit hetzelfde zijn.",
    },
    {
      q: "Vloeien de 'water'-lijnen na verloop van tijd tot één waas samen?",
      a: "Nee. Om te voorkomen dat de lijnen samenvloeien, bouw ik een zorgvuldig berekende hoeveelheid negatieve ruimte (blote huid) tussen de stromingen in en gebruik ik delicate naaldconfiguraties (0.25 mm). Het ontwerp is zo opgezet dat een portret of dier jarenlang leesbaar blijft.",
    },
    {
      q: "Doet deze techniek pijn?",
      a: "De sessie is heel comfortabel. De fluid-line-techniek en zachte, rokerige schaduw hebben geen agressief, dicht inpakken nodig. Met een lichte naaldtoets is het proces makkelijk uit te zitten en herstelt de huid in enkele dagen.",
    },
    {
      q: "Kun je in deze stijl een portret van een specifiek persoon of mijn huisdier maken?",
      a: "Ja — het is een van de indrukwekkendste toepassingen van de stijl. Ik werk vanuit een foto van de persoon of het dier, behoud de herkenbare kenmerken, blik en proporties, en transformeer textuur en vorm in soepele, krommende 'water'-stromingen en zachte halftonen.",
    },
    {
      q: "Hoe ziet een 'fluid'-tattoo eruit in beweging?",
      a: "Dat is het hele punt van de stijl. Omdat de lijnen stromingen en golven nabootsen, lijkt het beeld — wanneer de spier zich spant op de onderarm, schouder, kuit, ribben of langs de wervelkolom — echt te stromen en mee te bewegen.",
    },
    {
      q: "Is de stijl geschikt voor grote projecten (sleeves, ruggen)?",
      a: "Perfect. Waterstromingen laten me meerdere onderwerpen naadloos verbinden — een portret, een dier en abstracte golven, bijvoorbeeld — tot één grootschalig stuk zonder harde overgangen en zonder zware zwarte achtergronden.",
    },
  ],
  "/ornamental": [
    {
      q: "Wat is moeilijk aan geometrische en optische patronen?",
      a: "Ze zijn onverbiddelijk. In geometrie en ornamenteel werk is er geen ruimte voor een afdwalende lijn — een millimeter ernaast breekt de symmetrie. Ik gebruik wiskundige constructie bij het opbouwen van het ontwerp en beheers elke millimeter van de beweging van de machine, zodat de lijnen vlekkeloos strak blijven.",
    },
    {
      q: "Hoe verschilt engraving van gewoon graphic tatoeëren?",
      a: "Gewoon graphic werk gebruikt vaak zachte geschaduwde vulling. Engraving brengt volume, schaduw en textuur puur over via combinaties van halen met wisselende dikte en hoek, arcering en dotwork — wat het textuureffect van een vintage illustratie geeft.",
    },
    {
      q: "Vervagen fijne engraving-halen en dotwork na verloop van tijd?",
      a: "Nee, als de ruimte tussen halen en punten klopt. Ik bouw het nodige micro-interval (blote huid) in en gebruik delicate fijne naalden, wat voorkomt dat details samensmelten en het patroon jarenlang leesbaar houdt.",
    },
    {
      q: "Hoe zien optische (Op-Art) patronen eruit op gebogen plekken (onderarm, kuit, dij)?",
      a: "Gebogen plekken zijn het beste canvas voor Op-Art. De spier geeft een plat geometrisch patroon een natuurlijke driedimensionale buiging, waardoor de illusie van diepte of een 'vervormend' oppervlak nog overtuigender en dynamischer oogt in beweging.",
    },
    {
      q: "Hoe bereik je perfecte symmetrie op lastige plekken (ellebogen, knieën, schouders)?",
      a: "Ornament op gewrichten en gebogen plekken plaatsen vraagt een hybride aanpak. De basis wordt met een precieze digitale stencil aangebracht en de fijne aansluitingen worden freehand afgewerkt — vlak voor de sessie met markers op je huid getekend — zodat het midden van een mandala of patroon in elke houding klopt.",
    },
    {
      q: "Doen ornamentele tattoos op de handen, ellebogen of wervelkolom pijn?",
      a: "Dat hangt af van de plek en techniek. Omdat ornamenteel en dotwork met delicate dot- en outline-bewegingen worden aangebracht, zonder agressieve schade aan de huid, is de sessie merkbaar makkelijker dan dicht kleur inpakken.",
    },
    {
      q: "Slijt ornament op de handen en vingers?",
      a: "De huid op de vingers en handpalmen vernieuwt sneller dan elders. Om vinger- en handornamenten scherp te houden gebruik ik speciale micro-outline-technieken en kies ik de juiste pigmentdiepte. Na volledige genezing kan een korte touch-up nodig zijn om de scherpte tot in de puntjes te brengen.",
    },
  ],
  "/freehand": [
    {
      q: "Wat betekent een freehand-tattoo eigenlijk?",
      a: "In plaats van een stencil te printen en over te brengen, schets ik het ontwerp direct met huidveilige markers op je lichaam. We vormen het samen in de spiegel voordat er ook maar één lijn wordt gezet, zodat de flow en plaatsing perfect voor jou zijn.",
    },
    {
      q: "Kan ik het ontwerp zien voordat je begint?",
      a: "Absoluut. Er wordt niets gezet tot je tevreden bent met de tekening op je huid. We passen de maat, hoek en flow samen aan en beginnen pas als het in elke houding goed zit — staand, zittend, arm ontspannen en gespannen.",
    },
    {
      q: "Waarom freehand kiezen boven een geprinte stencil?",
      a: "Freehand laat het ontwerp je spieren en natuurlijke lijnen volgen in plaats van platgeslagen te worden vanaf papier. Voor stukken die om het lichaam vouwen — schouders, ribben, dijen, wervelkolom — geeft het een veel organischer, custom resultaat.",
    },
    {
      q: "Is freehand riskanter dan een stencil?",
      a: "Nee — het vraagt alleen ervaring. Omdat de compositie live op je lichaam wordt gepland en verfijnd tot het klopt, is er geen vervorming door een platte print op een gebogen oppervlak over te brengen.",
    },
  ],
  "/minimal": [
    {
      q: "Houden kleine, minimalistische tattoos stand na verloop van tijd?",
      a: "Ja, als ze ervoor ontworpen zijn. Heel dunne lijnen te dicht op elkaar kunnen na jaren samenvloeien, dus ik plan lijndikte en ruimte zorgvuldig en gebruik fijne naalden — zodat het stuk lang na het genezen leesbaar blijft.",
    },
    {
      q: "Hoe klein kan een minimalistische tattoo?",
      a: "Vrij klein, maar er is een verstandige grens. Om fijn detail schoon te houden raad ik een minimummaat aan voor lettering en fijne vormen; bij het consult adviseer ik de kleinste maat die op je gekozen plek nog goed veroudert.",
    },
    {
      q: "Zijn minimalistische tattoos snel en minder pijnlijk?",
      a: "Meestal wel. Met weinig schaduw en fijn lijnwerk zijn de meeste minimalistische stukken in een korte, comfortabele sessie klaar en genezen ze snel.",
    },
    {
      q: "Waar werken kleine tattoos het best?",
      a: "Vlakkere, stabielere plekken — onderarm, bovenarm, ribben, enkel — houden fijn detail het best. Huid met veel beweging en snelle vernieuwing zoals vingers en voeten kan sneller slijten, dus dat geef ik aan en ik stel de beste plaatsing voor.",
    },
  ],
  "/botanical": [
    {
      q: "Vervagen fine-line bloementattoos naarmate ze verouderen?",
      a: "Niet als ze goed gedaan zijn. Ik beheers lijndikte en de ruimte tussen bloemblaadjes en stelen en werk met fijne naalden, zodat de bloemen scherp blijven en mettertijd niet tot een waas samensmelten.",
    },
    {
      q: "Kun je een botanisch stuk rond een betekenis ontwerpen?",
      a: "Ja — we kunnen de compositie opbouwen uit bloemen en planten die iets voor je betekenen (geboortebloemen, kruiden, een favoriete bloem) en ze zo schikken dat ze natuurlijk met de plaatsing meelopen.",
    },
    {
      q: "Werken botanische tattoos in kleur én in zwart-grijs?",
      a: "Beide werken prachtig. Fijn zwart-grijs houdt het delicaat en tijdloos; zachte kleur of aquarelwassingen geven leven. Bij het consult kiezen we wat bij je idee past en hoe het veroudert.",
    },
    {
      q: "Waar zitten bloem- en botanische ontwerpen het best?",
      a: "Ze volgen graag de lijnen van het lichaam — onderarmen, de wervelkolom, ribben, schouder en enkel. Langere stelen en ranken zijn ideaal om een ledemaat te omwikkelen, zodat het stuk lijkt alsof het daar is gegroeid.",
    },
  ],
};

const STYLE_FAQ_DE: Record<string, Faq[]> = {
  "/realism": [
    {
      q: "Wie viele Sitzungen braucht ein realistisches Tattoo?",
      a: "Kleine, detaillierte Motive und Mikrorealismus schließe ich meist in einer halben oder einer Sitzung ab. Großflächige Arbeiten — Sleeves, Rücken, Beine — können vier oder mehr Sitzungen dauern, je nach deinen Proportionen und wie detailliert das Design ist.",
    },
    {
      q: "Wie altert und heilt Mikrorealismus?",
      a: "Mit der richtigen Technik (die Haut nicht überarbeiten) und dem richtigen Abstand zwischen feinen Details hält Mikrorealismus wunderbar. Der Schlüssel nach dem Heilen ist Schutz vor direkter Sonne mit LSF 50+.",
    },
    {
      q: "Wie unterscheidet sich Realismus technisch von anderen Stilen?",
      a: "In klassischen Stilen (wie Old School oder Graphic) beruht das Design auf einer klaren schwarzen Outline. Im Realismus gibt es keine Outlines im üblichen Sinn — Form, Volumen und Tiefe entstehen aus weichen Verläufen, sorgfältigem Licht und Schatten, Kontrast und geschichteter Schattierung. Das verlangt echte künstlerische Grundlagen und sichere tonale Arbeit.",
    },
    {
      q: "Tut Mikrorealismus weh, und wie lange dauert eine Sitzung?",
      a: "Mikrorealismus ist meist leichter auszuhalten als große Motive, weil das Hauttrauma minimal ist. Ich arbeite mit ultrafeinen Nadeln (0.25–0.30 3RL), die sehr sanft sind. Eine typische Mikrorealismus-Sitzung dauert 2–4 Stunden, je nach Komplexität und Anzahl kleiner Details.",
    },
    {
      q: "Verschwimmt Mikrorealismus nach 3–5 Jahren?",
      a: "Nicht, wenn es richtig gemacht ist. Verschwimmen passiert aus zwei Gründen: Pigment zu tief gesetzt (eine ausgelaufene Outline) oder kein 'Atemraum' zwischen den Details. Ich gestalte Mikrorealismus danach, wie sich die Haut über die Jahre verändert — mit dem richtigen Mikro-Abstand zwischen den Elementen und dem passenden Kontrast — damit es scharf und lesbar bleibt.",
    },
    {
      q: "Kannst du ein realistisches Porträt einer Person oder eines Haustiers machen?",
      a: "Ja — es ist einer meiner Schwerpunkte. Das Wichtigste für ein perfektes Porträt ist ein hochauflösendes Ausgangsfoto mit gutem Licht. Je klarer das Detail in deinem Foto (Textur, Augen, Licht), desto realistischer und dreidimensionaler das Ergebnis auf der Haut.",
    },
    {
      q: "Wie bereite ich mich auf eine Realismus-Sitzung vor?",
      a: "Meide 24 Stunden vorher Alkohol und blutverdünnende Medikamente (sie beeinflussen die Flüssigkeit und wie sich das Pigment setzt). Schlaf gut und iss vorher eine richtige Mahlzeit. Pflege die Stelle ein paar Tage vorher mit Feuchtigkeit — Pigment setzt sich gleichmäßiger auf weicher, vorbereiteter Haut.",
    },
    {
      q: "Ist nach dem Heilen ein Nachstechen nötig?",
      a: "Bei Mikrorealismus und sehr detailliertem Realismus ist manchmal ein leichtes Nachstechen nach etwa 4–5 Wochen nötig — das wird individuell beurteilt. Sobald die Haut vollständig erholt ist, prüfe ich, wie die feinsten Details und Mikro-Highlights verheilt sind, und verfeinere bei Bedarf den Kontrast in einer kurzen Sitzung bis zur Perfektion.",
    },
  ],
  "/chicano": [
    {
      q: "Wie unterscheidet sich Chicano von gewöhnlichem Schwarz-Grau-Realismus?",
      a: "Chicano stützt sich stark auf Street-Kalligrafie (Lettering), eine bestimmte Ikonografie (Payasa, Lowrider, religiöse Motive) und einen weicheren, rauchigeren Grey Wash mit ausgeprägten Kontrastakzenten und feinen Outline-Linien.",
    },
    {
      q: "Machst du Chicano in Farbe?",
      a: "Klassisch und am eindrucksvollsten ist Chicano nur Schwarz-Grau. Auf Wunsch kann ich aber kleine Farbakzente setzen — rote Lippen, Augenfarbe, Details an Rosen — und dabei die traditionelle monochrome Basis behalten.",
    },
    {
      q: "Wie viele Sitzungen für ein großes Chicano-Projekt (Sleeve, Rücken)?",
      a: "Einzelne Porträts oder Lettering mache ich in einer Sitzung (3–6 Stunden). Große erzählende Sleeves oder dichte Rückenstücke brauchen etwa fünf Sitzungen, da der Stil detaillierte, geschichtete Hintergründe enthält — Wolken, Rauch, Stadtansichten.",
    },
    {
      q: "Verschwimmen die feinen Schwünge im Lettering über die Jahre?",
      a: "Nicht, wenn Linienstärke und Abstände zwischen den Strichen richtig geplant sind. Ich nutze feine Nadelkonfigurationen und steuere die Pigmenttiefe präzise, was ein Auslaufen verhindert und das Lettering lesbar hält.",
    },
    {
      q: "Lässt sich Chicano mit einem Cover-up verbinden?",
      a: "Ja. Dank dichter schwarzer Schatten und Verlaufshintergründe (Rauch, Wolken, Faltenwurf) eignet sich Chicano hervorragend, um alte, schlechte Arbeit zu überdecken. Ich gestalte das Motiv so, dass die dunklen Elemente natürlich über das alte Tattoo fallen.",
    },
    {
      q: "Warum ist Grey Wash in Chicano so wichtig, und wie heilt er?",
      a: "Grey Wash ist schwarzes Pigment in verschiedenen Stärken verdünnt. Direkt nach der Sitzung können die weichen Schatten recht dunkel oder rötlich wirken durch die Durchblutung der Haut. Beim Heilen (über 2–3 Wochen) wird der Ton heller, gleichmäßiger und bekommt jenen typischen rauchigen, samtigen Effekt, für den Chicano geliebt wird.",
    },
    {
      q: "Wie halte ich tiefe Schwarztöne und weiche Schatten über Jahre?",
      a: "Die Sättigung hängt von guter Heilung und Sonnenschutz ab. Befolge die ersten Tage die Nachsorge genau, mit Heilfolie oder professionellen Balsamen. Nach dem Heilen immer hohen Sonnenschutz (LSF 50+) verwenden — UV baut Pigment ab und wäscht die weichen grauen Verläufe aus.",
    },
  ],
  "/fine-line": [
    {
      q: "Verschwimmen Fine-Line-Tattoos mit der Zeit?",
      a: "Mit der richtigen Technik nicht. Linien verschwimmen, wenn Pigment zu tief sitzt oder schlechte Nadeln verwendet werden. Ich steuere den Druck und arbeite mit ultrafeinen Modulen (0.25 3RL), was die Kanten nach dem Heilen scharf und sauber hält.",
    },
    {
      q: "Braucht ein Aquarell-Tattoo eine schwarze Outline?",
      a: "Nicht zwingend. Klassisches Aquarell kann ganz ohne Outline auskommen. Um es haltbar und strukturiert zu halten, nutze ich aber Mikro-Akzente oder den richtigen Einsatz kontrastierender Töne — ein subtiles 'Gerüst', das verhindert, dass die Farben mit der Zeit verschmelzen.",
    },
    {
      q: "Tun Fine-Line- oder Aquarell-Tattoos weh?",
      a: "Diese gehören zu den angenehmsten Stilen. Weil sie die feinsten Nadeln und sanfte, weiche Schattierung verwenden, ist das Hauttrauma minimal und das Heilen schnell und nahezu schmerzfrei.",
    },
    {
      q: "Lassen sich Fine Line und Aquarell kombinieren?",
      a: "Ja — es ist eine der beliebtesten und schönsten Kombinationen. Eine scharfe, präzise Fine-Line-Outline, gefüllt mit weichen Aquarellwäschen und Verläufen, schafft einen starken Kontrast zwischen Zeichnung und Malerei.",
    },
    {
      q: "Wie entsteht ein abstraktes Design?",
      a: "Abstrakte Arbeit ist immer individuell. Wir können von deinen Referenzen ausgehen oder das Design freehand erstellen — vor der Sitzung mit Markern direkt auf deinen Körper gezeichnet — damit Formen und Linien perfekt zu deiner Anatomie passen.",
    },
    {
      q: "Wie altern pastellige und helle Aquarellfarben?",
      a: "Hellere Töne (Gelb, Pfirsich, Hellblau) heilen mit der Zeit weicher und natürlicher. Damit sie in der Sonne nicht verblassen, ist es wichtig, das verheilte Tattoo mit LSF 50+ zu schützen. Bei Bedarf bringt ein leichtes kostenloses Nachstechen einen Monat nach der Sitzung die Farbe auf volle Leuchtkraft.",
    },
  ],
  "/anime": [
    {
      q: "Kannst du meine eigene Art oder einen Screenshot aus einer Folge tätowieren?",
      a: "Ja. Bring jeden Anime-Screenshot, jedes Manga-Frame oder Concept-Art mit. Beim Beratungsgespräch passe ich es für die Haut an — Kontrast justieren, Energie hinzufügen und sicherstellen, dass es perfekt an der gewählten Stelle sitzt.",
    },
    {
      q: "Muss ich das Konzept erklären, wenn es ein obskurer oder alter Anime ist?",
      a: "In 99 % der Fälle nicht — ich kenne diese Welt in- und auswendig. Ich schaue seit Jahren Anime: Kultklassiker (Evangelion, Berserk, Ghost in the Shell, Cowboy Bebop), die prägenden Langläufer (Naruto, Bleach, One Piece, JoJo, Hunter x Hunter), die neuen Releases jeder Season (Jujutsu Kaisen, Chainsaw Man, Demon Slayer, Frieren) und Nischentitel (Monogatari, Made in Abyss, Dorohedoro). Du musst nicht erklären, wer eine Figur ist oder wie sie ist — wir sprechen von Anfang an dieselbe Sprache.",
    },
    {
      q: "Warum ist es wichtig, dass die Künstlerin oder der Künstler wirklich Anime schaut?",
      a: "Weil ein Anime-Tattoo nicht einfach ein Bild aus Google kopieren ist. Kontext und Lore zu verstehen lässt mich die genaue Persönlichkeit und Emotion einfangen — ich kenne den Unterschied zwischen Sukunas manischem Grinsen und Megumis kühler Distanz und wie sich die Augen verändern, wenn ein Sharingan oder Sage Mode aktiviert. Es lässt mich auch eine authentische Custom-Collage bauen: Ich stelle keine Figuren aus einem Arc nebeneinander, in dem sie noch Feinde waren, wenn das Konzept ein Bündnis verlangt, und ich verwende Symbole (Kanji, Siegel, Zauber-Auren), die wirklich in der Vorlage vorkommen.",
    },
    {
      q: "Was ist der Unterschied zwischen Manga- und Anime-Stil-Tattoos?",
      a: "Manga-Stil ist monochrome Graphic-Arbeit (Schwarz-Grau), die gedruckte Comicseiten nachahmt — Outlines, Schraffur und Screentones. Anime-Stil ist meist Farbe, mit reicher Palette, weichen Verläufen und Lichteffekten, die die Animation widerspiegeln.",
    },
    {
      q: "Verblassen kräftige Farbpigmente mit der Zeit?",
      a: "Farbdichte und Haltbarkeit hängen von Technik und Nachsorge ab. Ich packe das Pigment in einer soliden Schicht in der richtigen Tiefe. Um Farben (besonders Rot, Rosa, Blau) über Jahre lebendig zu halten, schütze das verheilte Tattoo mit LSF 50+ vor der Sonne.",
    },
    {
      q: "Tun Anime-Tattoos weh?",
      a: "Das hängt von der Platzierung ab und wie viel flächige Farbe beteiligt ist. Ein Schwarz-Grau-Mangapanel mit seinen feinen Linien und leichter Schattierung ist relativ schnell und angenehm. Große Farbmotive brauchen länger, um solide gepackt zu werden, aber die Sitzung läuft in gleichmäßigem Tempo mit guten Pausen.",
    },
    {
      q: "Ist Anime gut für ein Cover-up?",
      a: "Ja — besonders Mangapanels mit dichten schwarzen Hintergründen oder Farbkompositionen mit tiefen dunklen Tönen (das Haar einer Figur, ein dunkler Umhang, Magie-Effekte). Ich gestalte das Motiv so, dass die dunklen Teile der Art über das alte Tattoo fallen.",
    },
    {
      q: "Wie wähle ich die richtige Größe für ein Anime-Tattoo?",
      a: "Anime-Figuren stecken voller kleiner Details — Augen-Highlights, Haarsträhnen, Stofftextur. Damit Gesicht und Details mit der Zeit nicht verflachen, empfehle ich, nicht zu klein zu gehen. Die minimal angenehme Größe für ein detailliertes Porträt liegt bei etwa 12–15 cm.",
    },
  ],
  "/fluid-line": [
    {
      q: "Was macht deinen 'Wasserlinien'-Stil einzigartig?",
      a: "Das Design beruht nicht auf einer starren anatomischen Vorlage — es wird als organischer Fluss gezeichnet. Porträts und Tierfiguren entstehen aus strömenden Linienläufen. Jedes Tattoo ist einzigartig, gemacht für eine bestimmte Person und die Rundungen ihres Körpers — keine zwei 'Strömungen' können je gleich sein.",
    },
    {
      q: "Verschwimmen die 'Wasser'-Linien mit der Zeit zu einem Fleck?",
      a: "Nein. Damit die Linien nicht verschmelzen, baue ich eine sorgfältig berechnete Menge Negativraum (nackte Haut) zwischen den Strömungen ein und verwende feine Nadelkonfigurationen (0.25 mm). Das Design ist so angelegt, dass ein Porträt oder Tier über Jahre lesbar bleibt.",
    },
    {
      q: "Tut diese Technik weh?",
      a: "Die Sitzung ist sehr angenehm. Die Fluid-Line-Technik und weiche, rauchige Schattierung brauchen kein aggressives, dichtes Packen. Mit leichter Nadelführung ist der Prozess leicht auszuhalten und die Haut erholt sich in wenigen Tagen.",
    },
    {
      q: "Kannst du in diesem Stil ein Porträt einer bestimmten Person oder meines Haustiers machen?",
      a: "Ja — es ist eine der eindrucksvollsten Anwendungen des Stils. Ich arbeite von einem Foto der Person oder des Tieres, behalte die erkennbaren Merkmale, den Blick und die Proportionen und verwandle Textur und Form in geschmeidige, geschwungene 'Wasser'-Strömungen und weiche Halbtöne.",
    },
    {
      q: "Wie sieht ein 'Fluid'-Tattoo in Bewegung aus?",
      a: "Das ist der ganze Sinn des Stils. Weil die Linien Strömungen und Wellen nachahmen, scheint das Bild — wenn sich der Muskel am Unterarm, an der Schulter, Wade, an den Rippen oder entlang der Wirbelsäule anspannt — wirklich zu fließen und sich mit deiner Bewegung zu verschieben.",
    },
    {
      q: "Eignet sich der Stil für große Projekte (Sleeves, Rücken)?",
      a: "Perfekt. Wasserströmungen lassen mich mehrere Motive nahtlos verbinden — etwa ein Porträt, ein Tier und abstrakte Wellen — zu einem großflächigen Stück ohne harte Übergänge und ohne schwere schwarze Hintergründe.",
    },
  ],
  "/ornamental": [
    {
      q: "Was ist schwierig an geometrischen und optischen Mustern?",
      a: "Sie sind kompromisslos. In Geometrie und ornamentaler Arbeit gibt es keinen Platz für eine verirrte Linie — ein Millimeter daneben bricht die Symmetrie. Ich verwende mathematische Konstruktion beim Aufbau des Designs und steuere jeden Millimeter der Maschinenbewegung, damit die Linien makellos sauber bleiben.",
    },
    {
      q: "Wie unterscheidet sich Engraving vom gewöhnlichen Graphic-Tätowieren?",
      a: "Gewöhnliche Graphic-Arbeit nutzt oft weiche schattierte Füllung. Engraving vermittelt Volumen, Schatten und Textur rein durch Kombinationen von Strichen unterschiedlicher Dicke und Winkel, Kreuzschraffur und Dotwork — was den texturierten Effekt einer Vintage-Illustration erzeugt.",
    },
    {
      q: "Verschwimmen feine Engraving-Striche und Dotwork mit der Zeit?",
      a: "Nein, wenn der Abstand zwischen Strichen und Punkten stimmt. Ich baue das nötige Mikro-Intervall (nackte Haut) ein und verwende feine Nadeln, was verhindert, dass Details verschmelzen, und das Muster über Jahre lesbar hält.",
    },
    {
      q: "Wie sehen optische (Op-Art) Muster auf gewölbten Stellen (Unterarm, Wade, Oberschenkel) aus?",
      a: "Gewölbte Stellen sind die beste Leinwand für Op-Art. Der Muskel gibt einem flachen geometrischen Muster eine natürliche dreidimensionale Wölbung, sodass die Illusion von Tiefe oder einer 'sich verformenden' Oberfläche in Bewegung noch überzeugender und dynamischer wirkt.",
    },
    {
      q: "Wie erreichst du perfekte Symmetrie an heiklen Stellen (Ellbogen, Knie, Schultern)?",
      a: "Ornament auf Gelenken und gewölbten Stellen zu setzen verlangt einen hybriden Ansatz. Die Basis wird mit einer präzisen digitalen Schablone aufgebracht, und die feinen Übergänge werden freehand fertiggestellt — vor der Sitzung mit Markern auf deine Haut gezeichnet — damit die Mitte eines Mandalas oder Musters in jeder Körperhaltung stimmt.",
    },
    {
      q: "Tun ornamentale Tattoos an Händen, Ellbogen oder Wirbelsäule weh?",
      a: "Das hängt von Stelle und Technik ab. Weil Ornament und Dotwork mit feinen Punkt- und Outline-Bewegungen aufgebracht werden, ohne aggressives Trauma für die Haut, ist die Sitzung merklich leichter als dichtes Farbpacken.",
    },
    {
      q: "Nutzt sich Ornament an Händen und Fingern ab?",
      a: "Die Haut an Fingern und Handflächen erneuert sich schneller als anderswo. Um Finger- und Handornamente scharf zu halten, verwende ich spezielle Mikro-Outline-Techniken und wähle die richtige Pigmenttiefe. Nach vollständigem Heilen kann ein kurzes Nachstechen nötig sein, um die Schärfe zur Perfektion zu bringen.",
    },
  ],
  "/freehand": [
    {
      q: "Was bedeutet ein Freehand-Tattoo eigentlich?",
      a: "Statt eine Schablone zu drucken und zu übertragen, skizziere ich das Design direkt mit hautsicheren Markern auf deinen Körper. Wir formen es gemeinsam im Spiegel, bevor auch nur eine Linie gestochen wird, damit Fluss und Platzierung perfekt für dich sind.",
    },
    {
      q: "Kann ich das Design sehen, bevor du beginnst?",
      a: "Absolut. Es wird nichts gestochen, bis du mit der Zeichnung auf deiner Haut zufrieden bist. Wir passen Größe, Winkel und Fluss gemeinsam an und beginnen erst, wenn es in jeder Haltung sitzt — stehend, sitzend, Arm entspannt und angespannt.",
    },
    {
      q: "Warum Freehand statt einer gedruckten Schablone wählen?",
      a: "Freehand lässt das Design deinen Muskeln und natürlichen Linien folgen, statt von Papier plattgedrückt zu werden. Für Stücke, die den Körper umschließen — Schultern, Rippen, Oberschenkel, Wirbelsäule — gibt es ein weit organischeres, individuelles Ergebnis.",
    },
    {
      q: "Ist Freehand riskanter als eine Schablone?",
      a: "Nein — es braucht nur Erfahrung. Weil die Komposition live auf deinem Körper geplant und verfeinert wird, bis sie stimmt, gibt es keine Verzerrung durch das Übertragen eines flachen Drucks auf eine gewölbte Oberfläche.",
    },
  ],
  "/minimal": [
    {
      q: "Halten kleine, minimalistische Tattoos mit der Zeit?",
      a: "Ja, wenn sie dafür gestaltet sind. Sehr dünne Linien zu dicht beieinander können über die Jahre verschmelzen, daher plane ich Linienstärke und Abstände sorgfältig und verwende feine Nadeln — damit das Motiv lange nach dem Heilen lesbar bleibt.",
    },
    {
      q: "Wie klein kann ein minimalistisches Tattoo sein?",
      a: "Recht klein, aber es gibt eine sinnvolle Grenze. Um feine Details sauber zu halten, empfehle ich eine Mindestgröße für Lettering und filigrane Formen; beim Beratungsgespräch rate ich zur kleinsten Größe, die an deiner gewählten Stelle noch gut altert.",
    },
    {
      q: "Sind minimalistische Tattoos schnell und weniger schmerzhaft?",
      a: "Meist ja. Mit wenig Schattierung und feiner Linienarbeit sind die meisten minimalistischen Stücke in einer kurzen, angenehmen Sitzung fertig und heilen schnell.",
    },
    {
      q: "Wo funktionieren kleine Tattoos am besten?",
      a: "Flachere, stabilere Stellen — Unterarm, Oberarm, Rippen, Knöchel — halten feine Details am besten. Haut mit viel Bewegung und schneller Erneuerung wie Finger und Füße kann schneller verschleißen, darauf weise ich hin und schlage die beste Platzierung vor.",
    },
  ],
  "/botanical": [
    {
      q: "Verschwimmen Fine-Line-Blumentattoos mit dem Alter?",
      a: "Nicht, wenn sie richtig gemacht sind. Ich steuere Linienstärke und Abstände zwischen Blütenblättern und Stielen und arbeite mit feinen Nadeln, damit die Blumen scharf bleiben und mit der Zeit nicht zu einem Fleck verschmelzen.",
    },
    {
      q: "Kannst du ein botanisches Stück um eine Bedeutung herum gestalten?",
      a: "Ja — wir können die Komposition aus Blumen und Pflanzen aufbauen, die dir etwas bedeuten (Geburtsblumen, Kräuter, eine Lieblingsblüte), und sie so anordnen, dass sie natürlich mit der Platzierung fließen.",
    },
    {
      q: "Funktionieren botanische Tattoos in Farbe ebenso wie in Schwarz-Grau?",
      a: "Beides wirkt wunderschön. Feines Schwarz-Grau hält es zart und zeitlos; weiche Farbe oder Aquarellwäschen bringen Leben hinein. Beim Beratungsgespräch wählen wir, was zu deiner Idee passt und wie es altert.",
    },
    {
      q: "Wo sitzen florale und botanische Designs am besten?",
      a: "Sie folgen gern den Linien des Körpers — Unterarme, Wirbelsäule, Rippen, Schulter und Knöchel. Längere Stiele und Ranken sind ideal, um ein Glied zu umwickeln, sodass das Stück wirkt, als wäre es dort gewachsen.",
    },
  ],
};
const STYLE_FAQ_UA: Record<string, Faq[]> = {
  "/realism": [
    {
      q: "Скільки сеансів потрібно для реалістичного тату?",
      a: "Маленькі деталізовані роботи й мікрореалізм я зазвичай завершую за пів сеансу або один сеанс. Масштабні роботи — рукави, спини, ноги — можуть зайняти чотири й більше сеансів, залежно від твоїх пропорцій і того, наскільки деталізований ескіз.",
    },
    {
      q: "Як мікрореалізм старіє й гоїться?",
      a: "З правильною технікою (без перевантаження шкіри) і правильними відступами між дрібними деталями мікрореалізм тримається чудово. Головне після загоєння — захищати від прямого сонця кремом SPF 50+.",
    },
    {
      q: "Чим реалізм технічно відрізняється від інших стилів?",
      a: "У класичних стилях (як old school чи графіка) ескіз спирається на чіткий чорний контур. У реалізмі немає контурів у звичному сенсі — форма, обʼєм і глибина йдуть від мʼяких градієнтів, ретельного світла й тіні, контрасту та багатошарової розтушовки. Це вимагає справжньої художньої бази та впевненої тональної роботи.",
    },
    {
      q: "Чи боляче робити мікрореалізм, і скільки триває сеанс?",
      a: "Мікрореалізм зазвичай легше витримати, ніж великі роботи, бо травматизація шкіри мінімальна. Я працюю ультратонкими голками (0.25–0.30 3RL), які дуже делікатні. Типовий сеанс мікрореалізму триває 2–4 години, залежно від складності та кількості дрібних деталей.",
    },
    {
      q: "Чи розмиється мікрореалізм за 3–5 років?",
      a: "Ні, якщо зроблено правильно. Розмиття виникає з двох причин: пігмент закладено надто глибоко (розповзлий контур) або немає «повітря» між деталями. Я проєктую мікрореалізм з огляду на те, як шкіра змінюється з роками — лишаю правильні мікровідступи між елементами й обираю потрібний контраст — щоб він лишався чітким і читабельним.",
    },
    {
      q: "Чи можеш зробити реалістичний портрет людини або тварини?",
      a: "Так — це один з моїх основних напрямів. Найважливіше для ідеального портрета — вихідне фото у високій роздільності з гарним світлом. Що чіткіші деталі на фото (текстура, очі, світло), то реалістичніший і обʼємніший результат на шкірі.",
    },
    {
      q: "Як підготуватися до сеансу реалізму?",
      a: "За 24 години уникай алкоголю й препаратів, що розріджують кров (вони впливають на рідину й на те, як лягає пігмент). Добре виспись і поїж перед сеансом. Кілька днів заздалегідь зволожуй зону — пігмент лягає рівніше на мʼяку, підготовлену шкіру.",
    },
    {
      q: "Чи потрібна корекція після загоєння?",
      a: "Для мікрореалізму й дуже деталізованого реалізму інколи потрібна легка корекція близько 4–5 тижнів — оцінюється індивідуально. Коли шкіра повністю відновилась, я перевіряю, як загоїлися найтонші деталі й мікроблиски, і за потреби доводжу контраст у короткому сеансі до досконалості.",
    },
  ],
  "/chicano": [
    {
      q: "Чим чикано відрізняється від звичайного чорно-сірого реалізму?",
      a: "Чикано сильно спирається на вуличну каліграфію (леттеринг), специфічну іконографію (payasa, лоурайдери, релігійні мотиви) та мʼякший, димчастіший grey wash з вираженими контрастними акцентами й тонкими контурними лініями.",
    },
    {
      q: "Чи робиш чикано в кольорі?",
      a: "Класичне й найефектніше чикано — лише чорно-сіре. Втім, на прохання можу додати невеликі кольорові акценти — червоні губи, колір очей, деталі на трояндах — зберігаючи традиційну монохромну основу.",
    },
    {
      q: "Скільки сеансів для великого проєкту чикано (рукав, спина)?",
      a: "Окремі портрети чи леттеринг роблю за один сеанс (3–6 годин). Великі сюжетні рукави чи щільні роботи на спині займають близько пʼяти сеансів, бо стиль містить деталізовані багатошарові фони — хмари, дим, міські пейзажі.",
    },
    {
      q: "Чи не розмиються тонкі завитки в леттерингу з роками?",
      a: "Ні, якщо правильно сплановані товщина ліній і проміжки між штрихами. Я використовую делікатні конфігурації голок і точно контролюю глибину пігменту, що запобігає розповзанню й тримає леттеринг читабельним.",
    },
    {
      q: "Чи можна поєднати чикано з кавер-апом?",
      a: "Так. Завдяки щільним чорним тіням і градієнтним фонам (дим, хмари, драпірування) чикано чудово підходить для перекриття старих неякісних робіт. Я проєктую роботу так, щоб темні елементи природно лягали поверх старого тату.",
    },
    {
      q: "Чому grey wash такий важливий у чикано і як він гоїться?",
      a: "Grey wash — це чорний пігмент, розведений до різної сили. Одразу після сеансу мʼякі тіні можуть виглядати досить темними або червонуватими через приплив крові до шкіри. Під час загоєння (за 2–3 тижні) тон світлішає, вирівнюється й набуває того фірмового димчастого, оксамитового ефекту, за який чикано люблять.",
    },
    {
      q: "Як зберегти глибокі чорні й гладкі тіні на роки?",
      a: "Насиченість залежить від правильного загоєння й захисту від сонця. У перші дні чітко дотримуйся догляду — з плівкою або професійними бальзамами. Після загоєння завжди використовуй сонцезахист з високим фактором (SPF 50+) — UV руйнує пігмент і вимиває мʼякі сірі градієнти.",
    },
  ],
  "/fine-line": [
    {
      q: "Чи розмиваються fine line тату з часом?",
      a: "З правильною технікою — ні. Лінії розмиваються, коли пігмент закладено надто глибоко або використано погані голки. Я контролюю тиск і працюю ультратонкими модулями (0.25 3RL), що тримає краї чіткими після загоєння.",
    },
    {
      q: "Чи потрібен акварельному тату чорний контур?",
      a: "Не обовʼязково. Класична акварель може бути зовсім без контуру. Щоб зробити її тривкою й структурованою, я використовую мікроакценти або правильне поле контрастних тонів — тонкий «каркас», що не дає кольорам зливатися з часом.",
    },
    {
      q: "Чи боляче робити fine line або акварель?",
      a: "Це одні з найкомфортніших стилів. Оскільки вони використовують найтонші голки й мʼяку делікатну розтушовку, травматизація шкіри мінімальна, а загоєння швидке й майже безболісне.",
    },
    {
      q: "Чи можна поєднати fine line та акварель?",
      a: "Так — це одне з найпопулярніших і найкрасивіших поєднань. Чіткий, точний fine-line контур, заповнений мʼякими акварельними заливками й градієнтами, дає яскравий контраст між малюнком і живописом.",
    },
    {
      q: "Як розробляється абстрактний ескіз?",
      a: "Абстракція завжди індивідуальна. Ми можемо стартувати з твоїх референсів або створити ескіз freehand — намалювати маркерами прямо на тілі перед сеансом — щоб форми й лінії ідеально пасували твоїй анатомії.",
    },
    {
      q: "Як старіють пастельні й світлі акварельні кольори?",
      a: "Світліші відтінки (жовтий, персиковий, блідо-блакитний) гояться мʼякше й природніше з часом. Щоб вони не вигоряли на сонці, важливо захищати загоєне тату кремом SPF 50+. За потреби легка безкоштовна корекція за місяць після сеансу доводить колір до повної яскравості.",
    },
  ],
  "/anime": [
    {
      q: "Чи можеш зробити тату з мого арту або скріншота з епізоду?",
      a: "Так. Принеси будь-який аніме-скріншот, кадр манги чи концепт-арт. На консультації я адаптую його під шкіру — коригую контраст, додаю енергії й дбаю, щоб він ідеально ліг на обране місце.",
    },
    {
      q: "Чи треба пояснювати концепт, якщо це маловідоме або старе аніме?",
      a: "У 99% випадків ні — я знаю цей світ досконало. Дивлюся аніме роками: культова класика (Evangelion, Berserk, Ghost in the Shell, Cowboy Bebop), фундаментальні довгограючі тайтли (Naruto, Bleach, One Piece, JoJo, Hunter x Hunter), новинки кожного сезону (Jujutsu Kaisen, Chainsaw Man, Demon Slayer, Frieren) і нішеві тайтли (Monogatari, Made in Abyss, Dorohedoro). Тобі не доведеться пояснювати, хто персонаж і який він — ми говоритимемо однією мовою від початку.",
    },
    {
      q: "Чому важливо, що майстер справді дивиться аніме?",
      a: "Бо аніме-тату — це не просто скопіювати картинку з Google. Розуміння контексту й лору дає змогу вловити точну особистість і емоцію — я знаю різницю між маніакальною посмішкою Сукуни й холодною відстороненістю Мегумі, і як змінюються очі, коли активується Шаринган чи режим Відлюдника. Це також дає змогу зібрати автентичний колаж: я не поставлю поруч персонажів з арки, де вони ще були ворогами, якщо концепт про союз, і використаю символи (кандзі, печатки, аури заклять), що справді є в першоджерелі.",
    },
    {
      q: "Яка різниця між тату в стилі манги й аніме?",
      a: "Стиль манги — це монохромна графіка (чорно-сіре), що імітує друковані сторінки коміксу — контури, штрихування й скрінтони. Стиль аніме зазвичай кольоровий, з багатою палітрою, плавними градієнтами й світловими ефектами, що відтворюють анімацію.",
    },
    {
      q: "Чи не вигорять яскраві кольорові пігменти з часом?",
      a: "Щільність і тривкість кольору залежать від техніки й догляду. Я закладаю пігмент суцільним шаром на правильній глибині. Щоб кольори (особливо червоний, рожевий, синій) лишалися яскравими роками, захищай загоєне тату від сонця кремом SPF 50+.",
    },
    {
      q: "Чи боляче робити аніме-тату?",
      a: "Залежить від розташування й того, скільки суцільного кольору. Чорно-сіра панель манги з тонкими лініями й легкою розтушовкою — відносно швидко й комфортно. Великі кольорові роботи потребують більше часу на щільну забивку, але сеанс іде рівним темпом із належними перервами.",
    },
    {
      q: "Чи підходить аніме для кавер-апу?",
      a: "Так — особливо панелі манги зі щільними чорними фонами або кольорові композиції з глибокими темними тонами (волосся персонажа, темний плащ, ефекти магії). Я проєктую роботу так, щоб темні частини арту лягали поверх старого тату.",
    },
    {
      q: "Як обрати правильний розмір для аніме-тату?",
      a: "Аніме-персонажі повні дрібних деталей — відблиски в очах, пасма волосся, текстура тканини. Щоб обличчя й деталі не «згладжувалися» з часом, раджу не робити надто малим. Мінімальний комфортний розмір для деталізованого портрета — близько 12–15 см.",
    },
  ],
  "/fluid-line": [
    {
      q: "Що робить твій стиль «водяної лінії» унікальним?",
      a: "Ескіз не будується на жорсткому анатомічному шаблоні — його малюють як органічний потік. Портрети й фігури тварин виникають зі струменів ліній. Кожне тату унікальне, зроблене для конкретної людини й вигинів її тіла — двох однакових «потоків» бути не може.",
    },
    {
      q: "Чи не зіллються «водяні» лінії з часом в одну пляму?",
      a: "Ні. Щоб лінії не зливалися, я закладаю ретельно розраховану кількість негативного простору (голої шкіри) між потоками й використовую делікатні конфігурації голок (0.25 мм). Ескіз спроєктовано так, щоб портрет чи тварина лишалися читабельними роками.",
    },
    {
      q: "Чи боляче ця техніка?",
      a: "Сеанс дуже комфортний. Техніка fluid line і мʼяка димчаста розтушовка не потребують агресивної щільної забивки. З легким дотиком голки процес легко витримати, а шкіра відновлюється за кілька днів.",
    },
    {
      q: "Чи можеш у цьому стилі зробити портрет конкретної людини або мого улюбленця?",
      a: "Так — це одне з найефектніших застосувань стилю. Я працюю з фото людини чи тварини, зберігаю впізнавані риси, погляд і пропорції, а текстуру й форму перетворюю на гнучкі, вигнуті «водяні» потоки й мʼякі напівтони.",
    },
    {
      q: "Як «fluid»-тату виглядає в русі?",
      a: "У цьому й уся суть стилю. Оскільки лінії імітують потоки й хвилі, коли мʼяз напружується — на передпліччі, плечі, литці, ребрах чи вздовж хребта — зображення справді ніби тече й зміщується з твоїм рухом.",
    },
    {
      q: "Чи підходить стиль для великих проєктів (рукави, спини)?",
      a: "Ідеально. Водяні потоки дають змогу безшовно поєднати кілька сюжетів — скажімо, портрет, тварину й абстрактні хвилі — в одну масштабну роботу без різких стиків і без важких чорних фонів.",
    },
  ],
  "/ornamental": [
    {
      q: "Що складного в геометричних та оптичних візерунках?",
      a: "Вони безкомпромісні. У геометрії й орнаменталі немає місця для випадкової лінії — міліметр убік ламає симетрію. Я використовую математичну побудову при створенні ескізу й контролюю кожен міліметр руху машинки, щоб лінії лишалися бездоганно чистими.",
    },
    {
      q: "Чим гравюрний стиль відрізняється від звичайної графіки?",
      a: "Звичайна графіка часто використовує мʼяку розтушовану заливку. Гравюра передає обʼєм, тінь і текстуру суто через комбінації штрихів різної товщини й кута, перехресне штрихування й dotwork — створюючи текстурний ефект вінтажної ілюстрації.",
    },
    {
      q: "Чи не розмиються тонкі гравюрні штрихи й dotwork з часом?",
      a: "Ні, якщо правильний відступ між штрихами й крапками. Я закладаю потрібний мікроінтервал (голу шкіру) і використовую делікатні тонкі голки, що не дає деталям зливатися й тримає візерунок читабельним роками.",
    },
    {
      q: "Як оптичні (Op-Art) візерунки виглядають на вигнутих зонах (передпліччя, литка, стегно)?",
      a: "Вигнуті зони — найкраще полотно для Op-Art. Мʼяз надає плоскому геометричному візерунку природного тривимірного вигину, тож ілюзія глибини чи «викривленої» поверхні виглядає ще переконливіше й динамічніше в русі.",
    },
    {
      q: "Як досягти ідеальної симетрії на складних зонах (лікті, коліна, плечі)?",
      a: "Розміщення орнаменту на суглобах і вигнутих зонах потребує гібридного підходу. Основу наносять точним цифровим трафаретом, а тонкі стики доводять freehand — малюють маркерами на шкірі перед сеансом — щоб центр мандали чи візерунка був точним у будь-якому положенні тіла.",
    },
    {
      q: "Чи боляче робити орнаментальні тату на кистях, ліктях чи хребті?",
      a: "Залежить від зони й техніки. Оскільки орнаментал і dotwork наносять делікатними крапковими й контурними рухами, без агресивної травматизації шкіри, сеанс помітно легший за щільну кольорову забивку.",
    },
    {
      q: "Чи стирається орнамент на кистях і пальцях?",
      a: "Шкіра на пальцях і долонях оновлюється швидше, ніж деінде. Щоб орнаменти на пальцях і кистях лишалися чіткими, я використовую спеціальні мікроконтурні техніки й обираю правильну глибину пігменту. Після повного загоєння може знадобитися коротка корекція, щоб довести чіткість до досконалості.",
    },
  ],
  "/freehand": [
    {
      q: "Що насправді означає freehand-тату?",
      a: "Замість друкувати трафарет і переносити його, я малюю ескіз прямо на тілі безпечними для шкіри маркерами. Ми формуємо його разом перед дзеркалом, перш ніж буде зроблено бодай одну лінію, щоб потік і розташування були ідеальними саме для тебе.",
    },
    {
      q: "Чи побачу я ескіз, перш ніж ти почнеш?",
      a: "Абсолютно. Нічого не робиться, поки ти не задоволений малюнком на своїй шкірі. Ми разом підлаштовуємо розмір, кут і потік і починаємо лише тоді, коли він добре лягає в будь-якому положенні — стоячи, сидячи, з розслабленою й напруженою рукою.",
    },
    {
      q: "Чому обрати freehand замість друкованого трафарету?",
      a: "Freehand дає ескізу йти за твоїми мʼязами й природними лініями, а не бути сплющеним із паперу. Для робіт, що обвивають тіло — плечі, ребра, стегна, хребет — це дає значно органічніший, індивідуальний результат.",
    },
    {
      q: "Чи freehand ризикованіший за трафарет?",
      a: "Ні — просто потрібен досвід. Оскільки композицію планують наживо на тілі й доводять, поки вона не стане правильною, немає спотворення від перенесення плоского друку на вигнуту поверхню.",
    },
  ],
  "/minimal": [
    {
      q: "Чи тримаються маленькі мінімалістичні тату з часом?",
      a: "Так, якщо вони для цього спроєктовані. Дуже тонкі лінії надто близько одна до одної можуть зливатися з роками, тож я ретельно планую товщину ліній і відступи й використовую тонкі голки — щоб робота лишалася читабельною ще довго після загоєння.",
    },
    {
      q: "Наскільки маленьким може бути мінімалістичне тату?",
      a: "Досить малим, але є розумна межа. Щоб зберегти чистоту дрібних деталей, я раджу мінімальний розмір для леттерингу й тонких форм; на консультації підкажу найменший масштаб, який ще добре старітиме на обраному місці.",
    },
    {
      q: "Чи мінімалістичні тату швидкі й менш болючі?",
      a: "Зазвичай так. З невеликою розтушовкою й тонкою лінійною роботою більшість мінімалістичних робіт готові за короткий комфортний сеанс і швидко гояться.",
    },
    {
      q: "Де маленькі тату працюють найкраще?",
      a: "Рівніші, стабільніші зони — передпліччя, плече, ребра, щиколотка — найкраще тримають дрібні деталі. Шкіра з великим рухом і швидким оновленням, як пальці й стопи, може стиратися швидше, тож я про це попереджу й запропоную найкраще розташування.",
    },
  ],
  "/botanical": [
    {
      q: "Чи розмиваються fine-line квіткові тату з віком?",
      a: "Ні, якщо зроблено правильно. Я контролюю товщину ліній і відступи між пелюстками та стеблами й працюю тонкими голками, тож квіти лишаються чіткими й не зливаються в пляму з часом.",
    },
    {
      q: "Чи можеш спроєктувати ботанічну роботу навколо змісту?",
      a: "Так — ми можемо побудувати композицію з квітів і рослин, що щось для тебе означають (квіти за місяцем народження, трави, улюблена квітка), і розташувати їх так, щоб вони природно йшли за місцем.",
    },
    {
      q: "Чи працюють ботанічні тату в кольорі так само, як у чорно-сірому?",
      a: "І те, і те виглядає прекрасно. Тонке чорно-сіре тримає роботу делікатною й позачасовою; мʼякий колір чи акварельні заливки додають життя. На консультації обираємо, що пасує твоїй ідеї та як воно старітиме.",
    },
    {
      q: "Де квіткові й ботанічні ескізи лягають найкраще?",
      a: "Вони люблять іти за лініями тіла — передпліччя, хребет, ребра, плече й щиколотка. Довші стебла й лози ідеальні, щоб обвити кінцівку, тож робота виглядає так, ніби виросла там.",
    },
  ],
};

const STYLE_FAQ_BY_LANG: Record<string, Record<string, Faq[]>> = {
  nl: STYLE_FAQ_NL,
  de: STYLE_FAQ_DE,
  ua: STYLE_FAQ_UA,
};

// Localised style list. English (STYLES) is returned as-is; other languages
// merge their text + FAQ overrides over the English base. Untranslated fields
// fall back to English.
export function getStyles(lang: string): StylePage[] {
  const text = STYLE_TEXT_BY_LANG[lang];
  const faqMap = STYLE_FAQ_BY_LANG[lang];
  if (!text && !faqMap) return STYLES;
  return STYLES.map((s) => {
    const merged = { ...s, ...(text?.[s.slug] || {}) };
    const faq = faqMap?.[s.slug];
    if (faq) merged.faq = faq;
    return merged;
  });
}

// ---------------------------------------------------------------------------
// Artist role + bio translations, keyed by artist name. English lives in the
// ARTISTS array (App.tsx); these override role/bio per language. Role tokens
// match the style aliases above so they still link to the style pages.
// ---------------------------------------------------------------------------
export type ArtistText = { role: string; bio: string };

const ARTIST_TEXT_NL: Record<string, ArtistText> = {
  Max: {
    role: "Chicano, Realisme, Portretten",
    bio: "Chicano-geïnspireerd realisme en portretten — zwart-grijs werk met vloeiende gradiënten en levensechte diepte.",
  },
  Eugene: {
    role: "Chicano, Realisme, Blackwork",
    bio: "Chicano-lettering en portretrealisme, ondersteund door stevig blackwork dat jarenlang scherp blijft.",
  },
  Daria: {
    role: "Fine line, Minimal, Botanisch",
    bio: "Zachte aquarelwassingen, delicaat fine-line werk en losse abstracte composities die op de huid geschilderd lijken.",
  },
  Darya: {
    role: "Anime, Manga, Realisme",
    bio: "Anime en manga op de huid — krachtig grafisch lijnwerk en kleur naast gedetailleerd zwart-grijs realisme en illustratieve grafische kunst.",
  },
  Mila: {
    role: "Freehand, Fluid line, Abstract",
    bio: "Freehand-stukken direct op de huid getekend — fluid-line en abstracte vormen die met het lichaam meebewegen.",
  },
  Gianluca: {
    role: "Ornamenteel, Blackwork, Geometrisch",
    bio: "Geometrisch, optisch en ornamenteel blackwork met elementen van abstracte kalligrafie, dotwork en engraving-detail.",
  },
  "Selçuk": {
    role: "Minimal, Fine line, Botanisch",
    bio: "Minimalistische fine-line en botanische ontwerpen — ingetogen, elegant en gemaakt om te blijven.",
  },
};

const ARTIST_TEXT_DE: Record<string, ArtistText> = {
  Max: {
    role: "Chicano, Realismus, Porträts",
    bio: "Chicano-inspirierter Realismus und Porträts — Schwarz-Grau-Arbeit mit weichen Verläufen und lebensechter Tiefe.",
  },
  Eugene: {
    role: "Chicano, Realismus, Blackwork",
    bio: "Chicano-Lettering und Porträtrealismus, gestützt auf solides Blackwork, das über Jahre scharf bleibt.",
  },
  Daria: {
    role: "Fine Line, Minimal, Botanisch",
    bio: "Weiche Aquarellwäschen, feine Fine-Line-Arbeit und lockere abstrakte Kompositionen, die wie auf die Haut gemalt wirken.",
  },
  Darya: {
    role: "Anime, Manga, Realismus",
    bio: "Anime und Manga auf der Haut — kräftige grafische Linienarbeit und Farbe neben detailliertem Schwarz-Grau-Realismus und illustrativer Grafik.",
  },
  Mila: {
    role: "Freehand, Fluid Line, Abstrakt",
    bio: "Freehand-Stücke direkt auf die Haut gezeichnet — Fluid-Line- und abstrakte Formen, die mit dem Körper mitgehen.",
  },
  Gianluca: {
    role: "Ornamental, Blackwork, Geometrisch",
    bio: "Geometrisches, optisches und ornamentales Blackwork mit Elementen abstrakter Kalligrafie, Dotwork und Gravur-Detail.",
  },
  "Selçuk": {
    role: "Minimal, Fine Line, Botanisch",
    bio: "Minimalistische Fine-Line- und botanische Designs — zurückhaltend, elegant und auf Dauer gemacht.",
  },
};

const ARTIST_TEXT_UA: Record<string, ArtistText> = {
  Max: {
    role: "Чикано, Реалізм, Портрети",
    bio: "Реалізм і портрети в дусі чикано — чорно-сіра робота з плавними градієнтами й живою глибиною.",
  },
  Eugene: {
    role: "Чикано, Реалізм, Blackwork",
    bio: "Чикано-леттеринг і портретний реалізм, підкріплені щільним blackwork, що лишається чітким роками.",
  },
  Daria: {
    role: "Fine line, Мінімал, Ботаніка",
    bio: "Мʼякі акварельні заливки, делікатний fine-line і вільні абстрактні композиції, наче намальовані на шкірі.",
  },
  Darya: {
    role: "Аніме, Манга, Реалізм",
    bio: "Аніме й манга на шкірі — виразна графічна лінія й колір поряд із деталізованим чорно-сірим реалізмом та ілюстративною графікою.",
  },
  Mila: {
    role: "Freehand, Fluid line, Абстракція",
    bio: "Freehand-роботи, намальовані прямо на шкірі — fluid-line та абстрактні форми, що рухаються з тілом.",
  },
  Gianluca: {
    role: "Орнаментал, Blackwork, Геометрія",
    bio: "Геометричний, оптичний та орнаментальний blackwork з елементами абстрактної каліграфії, dotwork і гравюрних деталей.",
  },
  "Selçuk": {
    role: "Мінімал, Fine line, Ботаніка",
    bio: "Мінімалістичні fine-line і ботанічні ескізи — стримані, елегантні й зроблені надовго.",
  },
};

const ARTIST_TEXT_BY_LANG: Record<string, Record<string, ArtistText>> = {
  nl: ARTIST_TEXT_NL,
  de: ARTIST_TEXT_DE,
  ua: ARTIST_TEXT_UA,
};

// Localised role + bio for an artist, or null to fall back to English.
export function getArtistText(lang: string, name: string): ArtistText | null {
  return ARTIST_TEXT_BY_LANG[lang]?.[name] ?? null;
}

// ---------------------------------------------------------------------------
// Body-map region translations. Keyed by the English label / note so the
// front/back sets share entries where the text is identical. Falls back to
// English. The body-part label sent with a lead stays English.
// ---------------------------------------------------------------------------
const REGION_LABEL_NL: Record<string, string> = {
  "Head & face": "Hoofd & gezicht",
  Head: "Hoofd",
  Neck: "Nek",
  "Nape of neck": "Nek (achterkant)",
  Chest: "Borst",
  "Upper back": "Bovenrug",
  Shoulder: "Schouder",
  "Upper arm": "Bovenarm",
  Forearm: "Onderarm",
  "Hand & fingers": "Hand & vingers",
  Stomach: "Buik",
  "Lower back": "Onderrug",
  Hip: "Heup",
  Glutes: "Billen",
  Thigh: "Dij",
  Hamstring: "Hamstring",
  Knee: "Knie",
  "Back of knee": "Knieholte",
  Shin: "Scheenbeen",
  Calf: "Kuit",
  "Foot & ankle": "Voet & enkel",
  "Heel & ankle": "Hiel & enkel",
};
const REGION_LABEL_DE: Record<string, string> = {
  "Head & face": "Kopf & Gesicht",
  Head: "Kopf",
  Neck: "Hals",
  "Nape of neck": "Nacken",
  Chest: "Brust",
  "Upper back": "Oberer Rücken",
  Shoulder: "Schulter",
  "Upper arm": "Oberarm",
  Forearm: "Unterarm",
  "Hand & fingers": "Hand & Finger",
  Stomach: "Bauch",
  "Lower back": "Unterer Rücken",
  Hip: "Hüfte",
  Glutes: "Gesäß",
  Thigh: "Oberschenkel",
  Hamstring: "Oberschenkelrückseite",
  Knee: "Knie",
  "Back of knee": "Kniekehle",
  Shin: "Schienbein",
  Calf: "Wade",
  "Foot & ankle": "Fuß & Knöchel",
  "Heel & ankle": "Ferse & Knöchel",
};
const REGION_LABEL_UA: Record<string, string> = {
  "Head & face": "Голова та обличчя",
  Head: "Голова",
  Neck: "Шия",
  "Nape of neck": "Потилиця",
  Chest: "Груди",
  "Upper back": "Верх спини",
  Shoulder: "Плече",
  "Upper arm": "Верх руки",
  Forearm: "Передпліччя",
  "Hand & fingers": "Кисть і пальці",
  Stomach: "Живіт",
  "Lower back": "Поперек",
  Hip: "Таз",
  Glutes: "Сідниці",
  Thigh: "Стегно",
  Hamstring: "Задня поверхня стегна",
  Knee: "Коліно",
  "Back of knee": "Під коліном",
  Shin: "Гомілка",
  Calf: "Литка",
  "Foot & ankle": "Стопа і щиколотка",
  "Heel & ankle": "Пʼята і щиколотка",
};

const REGION_NOTE_NL: Record<string, string> = {
  "Thin skin over bone — sharp and intense.": "Dunne huid over bot — scherp en intens.",
  "Very sensitive, with lots of nerve endings.": "Zeer gevoelig, met veel zenuwuiteinden.",
  "Manageable on the pecs, sharper near the sternum.": "Te doen op de borstspieren, scherper bij het borstbeen.",
  "One of the easier spots — muscle and even skin.": "Een van de makkelijkere plekken — spier en egale huid.",
  "The classic first tattoo — low pain, great canvas.": "De klassieke eerste tattoo — weinig pijn, mooi vlak.",
  "Comfortable overall; the inner side is a touch more tender.": "Over het algemeen comfortabel; de binnenkant is iets gevoeliger.",
  "Bony, with thin skin — intense, and heals fast.": "Benig, met dunne huid — intens, en geneest snel.",
  "Soft and stretchy; sensation varies a lot person to person.": "Zacht en rekbaar; het gevoel verschilt sterk per persoon.",
  "The hip bone itself is sharp; fleshier areas are easier.": "Het heupbot zelf is scherp; vlezigere delen zijn makkelijker.",
  "Lots of muscle and space — a very forgiving area.": "Veel spier en ruimte — een heel vergevingsgezinde plek.",
  "Bone close to the surface — expect it to bite.": "Bot dicht onder de huid — reken op een flinke beet.",
  "Bone-adjacent; tolerable but not gentle.": "Vlak bij het bot; te doen maar niet zacht.",
  "Thin skin over bone and tendons — quite sharp.": "Dunne huid over bot en pezen — behoorlijk scherp.",
  "Fine over the shoulder blades, sharp along the spine.": "Prima over de schouderbladen, scherp langs de wervelkolom.",
  "The triceps area is low pain and a great canvas.": "De triceps is weinig pijn en een mooi vlak.",
  "Comfortable overall; tolerable throughout.": "Over het algemeen comfortabel; overal te doen.",
  "A popular spot; sharper right over the spine.": "Een populaire plek; scherper recht boven de wervelkolom.",
  "Plenty of cushioning — one of the least painful areas.": "Veel demping — een van de minst pijnlijke plekken.",
  "Muscular and forgiving, much like the thigh.": "Gespierd en vergevingsgezind, net als de dij.",
  "The soft ditch behind the knee is very sensitive.": "De zachte holte achter de knie is zeer gevoelig.",
  "Muscular and fairly tolerable.": "Gespierd en redelijk te doen.",
};
const REGION_NOTE_DE: Record<string, string> = {
  "Thin skin over bone — sharp and intense.": "Dünne Haut über Knochen — scharf und intensiv.",
  "Very sensitive, with lots of nerve endings.": "Sehr empfindlich, mit vielen Nervenenden.",
  "Manageable on the pecs, sharper near the sternum.": "Auf den Brustmuskeln machbar, schärfer am Brustbein.",
  "One of the easier spots — muscle and even skin.": "Eine der einfacheren Stellen — Muskel und ebene Haut.",
  "The classic first tattoo — low pain, great canvas.": "Das klassische erste Tattoo — wenig Schmerz, tolle Fläche.",
  "Comfortable overall; the inner side is a touch more tender.": "Insgesamt angenehm; die Innenseite ist etwas empfindlicher.",
  "Bony, with thin skin — intense, and heals fast.": "Knochig, mit dünner Haut — intensiv, und heilt schnell.",
  "Soft and stretchy; sensation varies a lot person to person.": "Weich und dehnbar; das Empfinden variiert stark von Person zu Person.",
  "The hip bone itself is sharp; fleshier areas are easier.": "Der Hüftknochen selbst ist scharf; fleischigere Bereiche sind einfacher.",
  "Lots of muscle and space — a very forgiving area.": "Viel Muskel und Fläche — eine sehr gutmütige Stelle.",
  "Bone close to the surface — expect it to bite.": "Knochen dicht unter der Oberfläche — es wird ordentlich zwicken.",
  "Bone-adjacent; tolerable but not gentle.": "Knochennah; erträglich, aber nicht sanft.",
  "Thin skin over bone and tendons — quite sharp.": "Dünne Haut über Knochen und Sehnen — ziemlich scharf.",
  "Fine over the shoulder blades, sharp along the spine.": "Gut über den Schulterblättern, scharf entlang der Wirbelsäule.",
  "The triceps area is low pain and a great canvas.": "Der Trizeps-Bereich ist wenig Schmerz und eine tolle Fläche.",
  "Comfortable overall; tolerable throughout.": "Insgesamt angenehm; durchweg erträglich.",
  "A popular spot; sharper right over the spine.": "Eine beliebte Stelle; schärfer direkt über der Wirbelsäule.",
  "Plenty of cushioning — one of the least painful areas.": "Viel Polster — eine der am wenigsten schmerzhaften Stellen.",
  "Muscular and forgiving, much like the thigh.": "Muskulös und gutmütig, ähnlich wie der Oberschenkel.",
  "The soft ditch behind the knee is very sensitive.": "Die weiche Kniekehle ist sehr empfindlich.",
  "Muscular and fairly tolerable.": "Muskulös und recht erträglich.",
};
const REGION_NOTE_UA: Record<string, string> = {
  "Thin skin over bone — sharp and intense.": "Тонка шкіра над кісткою — гостро й інтенсивно.",
  "Very sensitive, with lots of nerve endings.": "Дуже чутливо, багато нервових закінчень.",
  "Manageable on the pecs, sharper near the sternum.": "Терпимо на грудних мʼязах, гостріше біля грудини.",
  "One of the easier spots — muscle and even skin.": "Одна з легших зон — мʼяз і рівна шкіра.",
  "The classic first tattoo — low pain, great canvas.": "Класика для першого тату — мало болю, гарне полотно.",
  "Comfortable overall; the inner side is a touch more tender.": "Загалом комфортно; внутрішній бік трохи чутливіший.",
  "Bony, with thin skin — intense, and heals fast.": "Кістляво, тонка шкіра — інтенсивно, гоїться швидко.",
  "Soft and stretchy; sensation varies a lot person to person.": "Мʼяко й еластично; відчуття дуже різняться від людини до людини.",
  "The hip bone itself is sharp; fleshier areas are easier.": "Сама тазова кістка гостра; мʼясистіші ділянки легші.",
  "Lots of muscle and space — a very forgiving area.": "Багато мʼяза й місця — дуже поблажлива зона.",
  "Bone close to the surface — expect it to bite.": "Кістка близько до поверхні — буде відчутно кусатись.",
  "Bone-adjacent; tolerable but not gentle.": "Біля кістки; терпимо, але не ніжно.",
  "Thin skin over bone and tendons — quite sharp.": "Тонка шкіра над кісткою й сухожиллями — доволі гостро.",
  "Fine over the shoulder blades, sharp along the spine.": "Нормально над лопатками, гостро вздовж хребта.",
  "The triceps area is low pain and a great canvas.": "Зона трицепса — мало болю й гарне полотно.",
  "Comfortable overall; tolerable throughout.": "Загалом комфортно; терпимо всюди.",
  "A popular spot; sharper right over the spine.": "Популярна зона; гостріше прямо над хребтом.",
  "Plenty of cushioning — one of the least painful areas.": "Багато «підкладки» — одна з найменш болючих зон.",
  "Muscular and forgiving, much like the thigh.": "Мʼязисто й поблажливо, як і стегно.",
  "The soft ditch behind the knee is very sensitive.": "Мʼяка ямка під коліном дуже чутлива.",
  "Muscular and fairly tolerable.": "Мʼязисто й досить терпимо.",
};

const REGION_LABEL_BY_LANG: Record<string, Record<string, string>> = {
  nl: REGION_LABEL_NL,
  de: REGION_LABEL_DE,
  ua: REGION_LABEL_UA,
};
const REGION_NOTE_BY_LANG: Record<string, Record<string, string>> = {
  nl: REGION_NOTE_NL,
  de: REGION_NOTE_DE,
  ua: REGION_NOTE_UA,
};

// Localised body-part label + note (falls back to English).
export function localizeRegion(
  lang: string,
  label: string,
  note: string,
): { label: string; note: string } {
  return {
    label: REGION_LABEL_BY_LANG[lang]?.[label] ?? label,
    note: REGION_NOTE_BY_LANG[lang]?.[note] ?? note,
  };
}
