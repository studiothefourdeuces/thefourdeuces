// Shared FAQ data — rendered on the Book page and also used at build time
// (vite.config.ts) to emit FAQPage structured data for Google rich results.
// Keep this file free of imports so the Vite config can import it directly.

export type FaqItem = { q: string; a: string };

export const FAQ_ITEMS: FaqItem[] = [
  {
    q: "Does getting a tattoo hurt?",
    a: "Some discomfort is normal, but it's very manageable for most people and depends heavily on placement. Fleshier, muscular areas like the upper arm, thigh and calf are the easiest, while bony, thin-skinned spots like the ribs, hands, feet, sternum and ankles are the most sensitive. Everyone's pain tolerance is different — use the interactive body map on the [[BOOK]] for a rough guide by area.",
  },
  {
    q: "How long does a tattoo take?",
    a: "It depends entirely on size, detail and placement. Small, simple pieces can take under an hour, a medium piece usually runs 2–4 hours, and large or highly detailed work (sleeves, back pieces, realism) is spread across multiple sessions. Your artist will give you a realistic time estimate during your consultation. [[CONSULT]]",
  },
  {
    q: "How do I prepare for my tattoo appointment?",
    a: "Get a good night's sleep, eat a proper meal beforehand and stay hydrated. Wear comfortable clothing that gives easy access to the area being tattooed. Avoid alcohol for at least 24 hours before your session (it thins the blood), and don't sunburn the area beforehand. Bring a snack and water for longer sessions.",
  },
  {
    q: "How long does a tattoo take to heal?",
    a: "The surface usually heals in about 2–3 weeks, while the deeper layers of skin finish settling over roughly 2–3 months. During the first weeks the tattoo may scab lightly and peel — this is normal. Follow your aftercare instructions closely for the best result — you can download the full aftercare guide below.",
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
    a: "Booking is exclusively through the [[BOOK]] or by email at booking@thefourdeuces.nl. Requests made any other way go against studio policy and may be considered invalid.",
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
    a: "You must be 18 or older — or from 16 if accompanied by an adult. Please bring valid photo ID to your appointment.",
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
  {
    q: "What sterility and safety standards does your studio follow?",
    a: "Client safety is our priority. We use only single-use sterile cartridges, medical-grade disinfectants, full barrier protection on our equipment, and certified hypoallergenic pigments and single-use cartridges that fully comply with the EU REACH Regulation — free of heavy metals and safe.",
  },
  {
    q: "Can I apply my own numbing cream before the session?",
    a: "We strongly advise against using third-party numbing products without agreeing it with your artist first. Primary anaesthetics change the density and elasticity of the skin (they 'toughen' it), which can affect how pigment goes in, how it heals and the longevity of tonal transitions. If needed, your artist can apply a safe secondary cooling product during the session.",
  },
  {
    q: "What should I do if my tattoo itches or peels while healing?",
    a: "Light peeling and mild itching around days 4–8 is a normal sign of the top layer of skin regenerating. Don't pick the flakes off. Apply a thin layer of the moisturiser we recommend to ease the discomfort.",
  },
  {
    q: "What if water gets under the healing film, or it peels off early?",
    a: "If the film's seal is broken and water or dirt gets in, or it lifts off more than about 30% of the tattoo, gently remove it, wash the tattoo with soap and switch to the classic aftercare method — washing plus a thin layer of cream.",
  },
  {
    q: "Can I be allergic to the pigment or aftercare cream?",
    a: "We use only certified, premium hypoallergenic pigments. If you get redness or a rash around the tattoo during aftercare, it's most often a reaction to too thick a layer of cream (the skin can't breathe) or an allergy to a specific ingredient — reduce the amount or switch cream in agreement with your artist. If you're very prone to allergies, we can do a small, discreet patch test a few days before the main session.",
  },
  {
    q: "Can you cover up an old tattoo without laser removal?",
    a: "In most cases, yes. A cover-up needs special design work — the new piece is built around the dark areas of the old one. Chicano, dense anime art, ornamental/blackwork and detailed realism are ideal for covers. If the old tattoo is very dark and dense, we may recommend 1–2 sessions of laser lightening first.",
  },
  {
    q: "Can a tattoo cover scars or stretch marks?",
    a: "Yes — a tattoo hides the texture and colour of scars well. The key condition is that the scar must be fully formed and faded (at least 12–18 months since the injury or surgery). At a consultation we assess the tissue and choose a style that will hide the mark naturally.",
  },
  {
    q: "Can you tattoo over moles or pigmented spots?",
    a: "No — a tattoo is never placed directly over raised moles. We work around them with a safe margin of a few millimetres, blending them into clean parts of the design or background shadows.",
  },
  {
    q: "Are there any contraindications to getting a tattoo?",
    a: "Absolute contraindications include blood-clotting disorders (haemophilia), active cancer treatment, active HIV or hepatitis, severe diabetes, epilepsy and a tendency to keloid scarring. Temporary ones include pregnancy and breastfeeding, colds or fever, a flare-up of dermatitis or psoriasis in the area, fresh sunburn, and being under the influence of alcohol or drugs.",
  },
  {
    q: "Is a deposit required to book?",
    a: "To reserve your date and start your custom design, a small deposit is required. It counts towards the final price of your session.",
  },
  {
    q: "Where is the studio and how do I get there?",
    a: "We're in Amsterdam Zuid / the Museum Quarter at Van Baerlestraat 126H, 1071 BD Amsterdam, on the ground floor (begane grond), next to Museumplein and Vondelpark. Trams 3, 5 and 12 stop right outside, and metro stations are within walking distance.",
  },
];

// Dutch.
const FAQ_NL: FaqItem[] = [
  {
    q: "Doet een tattoo zetten pijn?",
    a: "Wat ongemak is normaal, maar voor de meeste mensen goed te doen en sterk afhankelijk van de plek. Vlezige, gespierde plekken zoals bovenarm, dij en kuit zijn het makkelijkst, terwijl botige, dunne plekken zoals ribben, handen, voeten, borstbeen en enkels het gevoeligst zijn. Iedereen heeft een andere pijngrens — gebruik de interactieve lichaamskaart op de [[BOOK]] als ruwe indicatie per plek.",
  },
  {
    q: "Hoe lang duurt een tattoo?",
    a: "Dat hangt volledig af van formaat, detail en plaatsing. Kleine, eenvoudige stukken kunnen onder het uur duren, een middelgroot stuk meestal 2–4 uur, en groot of zeer gedetailleerd werk (sleeves, rugstukken, realisme) wordt over meerdere sessies verdeeld. Je artiest geeft je tijdens het consult een realistische inschatting. [[CONSULT]]",
  },
  {
    q: "Hoe bereid ik me voor op mijn afspraak?",
    a: "Slaap goed, eet vooraf een volwaardige maaltijd en drink genoeg. Draag comfortabele kleding die makkelijk toegang geeft tot de plek. Vermijd alcohol minstens 24 uur voor je sessie (het verdunt het bloed) en verbrand de huid vooraf niet in de zon. Neem voor langere sessies een snack en water mee.",
  },
  {
    q: "Hoe lang duurt het genezen van een tattoo?",
    a: "De bovenlaag geneest meestal in zo'n 2–3 weken, terwijl de diepere huidlagen over ongeveer 2–3 maanden volledig tot rust komen. In de eerste weken kan de tattoo licht korsten en vervellen — dat is normaal. Volg je nazorginstructies nauwkeurig voor het beste resultaat — de volledige nazorggids kun je hieronder downloaden.",
  },
  {
    q: "Hoe verzorg ik mijn nieuwe tattoo?",
    a: "Houd hem schoon en gehydrateerd, was voorzichtig met lauw water en een parfumvrije zeep en breng een dun laagje nazorgcrème aan. Vermijd direct zonlicht, zwembaden, sauna's, baden en het pulken of krabben tijdens het genezen. Je kunt onze volledige nazorggids hieronder downloaden.",
  },
  {
    q: "Mag ik douchen, zwemmen of sporten na het tatoeëren?",
    a: "Douchen kan normaal (kort en lauw — niet weken), maar vermijd zwembaden, de zee, baden, sauna's en hot tubs tot de tattoo volledig genezen is, meestal 2–3 weken. Lichte activiteit is prima, maar vermijd hevig zweten en wrijving op de verse tattoo in de eerste dagen.",
  },
  {
    q: "In welke tattoostijlen zijn jullie gespecialiseerd?",
    a: "Onze vaste en gastartiesten dekken een breed scala aan stijlen — realisme en zwart-grijs, chicano, fine line, aquarel, anime en manga, geometrisch en ornamenteel blackwork, botanisch en minimalistisch werk, en custom lettering. Bekijk de artiestenpagina om de juiste match voor jouw idee te vinden.",
  },
  {
    q: "Mag ik mijn eigen ontwerp of referentie meenemen?",
    a: "Absoluut — referenties, moodboards en ruwe ideeën zijn welkom en echt behulpzaam. Onze artiesten werken samen met jou om je idee om te zetten in een custom ontwerp dat past bij je lichaam en plaatsing. We kopiëren geen origineel werk van andere artiesten, maar kunnen wel iets in een vergelijkbare geest maken.",
  },
  {
    q: "Wat kost een tattoo?",
    a: "De prijs hangt af van formaat, complexiteit en plaatsing en wordt tijdens je consult besproken. Grotere stukken worden meestal per sessie geoffreerd, en cover-ups en reworks apart. Voor zeer kleine tattoos geldt een minimumtarief.",
  },
  {
    q: "Hoe maak ik een afspraak?",
    a: "Boeken kan uitsluitend via de [[BOOK]] of per e-mail op booking@thefourdeuces.nl. Aanvragen via een andere weg zijn in strijd met het studiobeleid en kunnen als ongeldig worden beschouwd.",
  },
  {
    q: "Wat is jullie annuleringsbeleid?",
    a: "We vragen minstens 48 uur van tevoren om te annuleren of te verzetten. Meer dan 30 minuten te laat komen zonder bericht kan leiden tot annulering of verzetten en verlies van je aanbetaling.",
  },
  {
    q: "Hoe kan ik betalen?",
    a: "We accepteren contant en creditcard/pinpas, en PayPal is mogelijk na overleg. Fooien worden gewaardeerd maar nooit verwacht.",
  },
  {
    q: "Wat is de minimumleeftijd voor een tattoo?",
    a: "Je moet 18 jaar of ouder zijn — of vanaf 16 jaar onder begeleiding van een volwassene. Neem een geldig identiteitsbewijs mee naar je afspraak.",
  },
  {
    q: "Kan ik een tattoo krijgen als ik zwanger ben, borstvoeding geef of ziek ben?",
    a: "We tatoeëren niemand die zwanger is of borstvoeding geeft, en we vragen je om te verzetten als je je op de dag zelf ziek voelt. Heb je een medische aandoening, gebruik je bepaalde medicatie of heb je huidproblemen op de plek, laat het ons dan vooraf weten zodat we je kunnen adviseren.",
  },
  {
    q: "Gebruiken jullie verdovende crème of anesthesie?",
    a: "Er wordt tijdens de sessie geen lokale verdoving gebruikt.",
  },
  {
    q: "Bieden jullie touch-ups aan?",
    a: "Eén gratis touch-up wordt aangeboden binnen 6 maanden, onder de voorwaarden in onze Algemene voorwaarden. Dit geldt niet voor gastartiesten.",
  },
  {
    q: "Vervaagt mijn tattoo na verloop van tijd?",
    a: "Alle tattoos verzachten en zetten zich naarmate ze verouderen, maar goede nazorg maakt een groot verschil. De grootste factor is blootstelling aan zon — een genezen tattoo beschermen met SPF houdt hem veel langer scherp en levendig. Fine line en zeer kleine details verouderen van nature sneller dan stevig werk.",
  },
  {
    q: "Kunnen jullie een oude tattoo coveren of herwerken?",
    a: "Vaak wel. Cover-ups en reworks hangen af van de grootte, kleur en donkerte van de bestaande tattoo, dus stuur ons een duidelijke foto en we laten je weten wat realistisch mogelijk is. Deze worden altijd apart geoffreerd na een consult.",
  },
  {
    q: "Mag ik iemand meenemen naar mijn afspraak?",
    a: "Ja, maar begeleiders moeten tijdens je sessie op de begane grond blijven.",
  },
  {
    q: "Welke steriliteits- en veiligheidsnormen volgt jullie studio?",
    a: "De veiligheid van klanten staat voorop. We gebruiken uitsluitend steriele cartridges voor eenmalig gebruik, desinfectiemiddelen van medische kwaliteit, volledige barrièrebescherming op onze apparatuur en gecertificeerde hypoallergene pigmenten en wegwerpcartridges die volledig voldoen aan de EU REACH-verordening — vrij van zware metalen en veilig.",
  },
  {
    q: "Mag ik zelf verdovende crème aanbrengen voor de sessie?",
    a: "We raden sterk af om verdovingsproducten van derden te gebruiken zonder dit eerst met je artiest af te stemmen. Primaire verdovingen veranderen de dichtheid en elasticiteit van de huid (ze 'verharden' hem), wat invloed kan hebben op hoe het pigment erin gaat, hoe het geneest en de levensduur van tonale overgangen. Indien nodig kan je artiest tijdens de sessie een veilig secundair koelmiddel aanbrengen.",
  },
  {
    q: "Wat doe ik als mijn tattoo jeukt of vervelt tijdens het genezen?",
    a: "Lichte vervelling en milde jeuk rond dag 4–8 is een normaal teken dat de bovenste huidlaag zich vernieuwt. Pluk de velletjes er niet af. Breng een dun laagje van de door ons aanbevolen crème aan om het ongemak te verlichten.",
  },
  {
    q: "Wat als er water onder de folie komt of hij te vroeg loslaat?",
    a: "Als de afsluiting van de folie verbroken is en er water of vuil in komt, of hij meer dan zo'n 30% van de tattoo loslaat, verwijder hem dan voorzichtig, was de tattoo met zeep en schakel over op de klassieke nazorgmethode — wassen plus een dun laagje crème.",
  },
  {
    q: "Kan ik allergisch zijn voor het pigment of de nazorgcrème?",
    a: "We gebruiken uitsluitend gecertificeerde, premium hypoallergene pigmenten. Krijg je roodheid of uitslag rond de tattoo tijdens de nazorg, dan is dat meestal een reactie op een te dikke laag crème (de huid kan niet ademen) of een allergie voor een specifiek ingrediënt — verminder de hoeveelheid of wissel van crème in overleg met je artiest. Ben je erg allergiegevoelig, dan kunnen we een paar dagen vooraf een kleine, discrete patchtest doen.",
  },
  {
    q: "Kunnen jullie een oude tattoo coveren zonder laserverwijdering?",
    a: "In de meeste gevallen wel. Een cover-up vraagt speciaal ontwerpwerk — het nieuwe stuk wordt rond de donkere delen van de oude opgebouwd. Chicano, dichte anime-art, ornamenteel/blackwork en gedetailleerd realisme zijn ideaal voor covers. Is de oude tattoo erg donker en dicht, dan raden we soms eerst 1–2 sessies laser verlichten aan.",
  },
  {
    q: "Kan een tattoo littekens of striae bedekken?",
    a: "Ja — een tattoo verbergt de textuur en kleur van littekens goed. De belangrijkste voorwaarde is dat het litteken volledig gevormd en vervaagd is (minstens 12–18 maanden na het letsel of de operatie). Bij een consult beoordelen we het weefsel en kiezen we een stijl die het litteken natuurlijk verbergt.",
  },
  {
    q: "Kunnen jullie over moedervlekken of pigmentvlekken tatoeëren?",
    a: "Nee — een tattoo wordt nooit direct over verhoogde moedervlekken geplaatst. We werken eromheen met een veilige marge van een paar millimeter en laten ze opgaan in schone delen van het ontwerp of achtergrondschaduwen.",
  },
  {
    q: "Zijn er contra-indicaties voor een tattoo?",
    a: "Absolute contra-indicaties zijn onder meer stollingsstoornissen (hemofilie), actieve kankerbehandeling, actieve hiv of hepatitis, ernstige diabetes, epilepsie en neiging tot keloïdvorming. Tijdelijke zijn onder meer zwangerschap en borstvoeding, verkoudheid of koorts, een opflakkering van dermatitis of psoriasis op de plek, verse zonnebrand en onder invloed zijn van alcohol of drugs.",
  },
  {
    q: "Is een aanbetaling vereist om te boeken?",
    a: "Om je datum te reserveren en met je custom ontwerp te beginnen is een kleine aanbetaling vereist. Deze telt mee met de eindprijs van je sessie.",
  },
  {
    q: "Waar is de studio en hoe kom ik er?",
    a: "We zitten in Amsterdam Zuid / de Museumwijk aan de Van Baerlestraat 126H, 1071 BD Amsterdam, op de begane grond, naast het Museumplein en het Vondelpark. Tram 3, 5 en 12 stoppen voor de deur en metrostations liggen op loopafstand.",
  },
];

// German.
const FAQ_DE: FaqItem[] = [
  {
    q: "Tut ein Tattoo weh?",
    a: "Ein gewisses Unbehagen ist normal, für die meisten aber gut auszuhalten und stark von der Stelle abhängig. Fleischige, muskulöse Bereiche wie Oberarm, Oberschenkel und Wade sind am einfachsten, während knochige, dünnhäutige Stellen wie Rippen, Hände, Füße, Brustbein und Knöchel am empfindlichsten sind. Jede Schmerzgrenze ist anders — nutze die interaktive Körperkarte auf der [[BOOK]] als grobe Orientierung je Stelle.",
  },
  {
    q: "Wie lange dauert ein Tattoo?",
    a: "Das hängt ganz von Größe, Detail und Platzierung ab. Kleine, einfache Motive dauern manchmal unter einer Stunde, ein mittleres Motiv meist 2–4 Stunden, und große oder sehr detaillierte Arbeiten (Sleeves, Rückenstücke, Realismus) verteilen sich über mehrere Sitzungen. Deine Künstlerin oder dein Künstler gibt dir beim Beratungsgespräch eine realistische Schätzung. [[CONSULT]]",
  },
  {
    q: "Wie bereite ich mich auf meinen Termin vor?",
    a: "Schlaf gut, iss vorher eine richtige Mahlzeit und trink ausreichend. Trag bequeme Kleidung, die die Stelle gut zugänglich macht. Verzichte mindestens 24 Stunden vor der Sitzung auf Alkohol (er verdünnt das Blut) und hol dir vorher keinen Sonnenbrand an der Stelle. Bring für längere Sitzungen einen Snack und Wasser mit.",
  },
  {
    q: "Wie lange braucht ein Tattoo zum Heilen?",
    a: "Die Oberfläche heilt meist in etwa 2–3 Wochen, während die tieferen Hautschichten über rund 2–3 Monate zur Ruhe kommen. In den ersten Wochen kann das Tattoo leicht verkrusten und sich schälen — das ist normal. Befolge deine Nachsorge-Anleitung genau für das beste Ergebnis — den vollständigen Nachsorge-Leitfaden kannst du unten herunterladen.",
  },
  {
    q: "Wie pflege ich mein neues Tattoo?",
    a: "Halt es sauber und mit Feuchtigkeit versorgt, wasch es sanft mit lauwarmem Wasser und einer parfümfreien Seife und trag eine dünne Schicht Nachsorgecreme auf. Vermeide direkte Sonne, Schwimmbäder, Sauna, Baden sowie Kratzen und Pulen während der Heilung. Unseren vollständigen Nachsorge-Leitfaden kannst du unten herunterladen.",
  },
  {
    q: "Darf ich nach dem Tätowieren duschen, schwimmen oder Sport treiben?",
    a: "Duschen geht normal (kurz und lauwarm — nicht einweichen), aber vermeide Schwimmbäder, das Meer, Baden, Sauna und Whirlpools, bis das Tattoo vollständig verheilt ist, meist 2–3 Wochen. Leichte Bewegung ist okay, aber vermeide in den ersten Tagen starkes Schwitzen und Reibung am frischen Tattoo.",
  },
  {
    q: "Auf welche Tattoo-Stile seid ihr spezialisiert?",
    a: "Unsere festen und Gast-Künstler decken viele Stile ab — Realismus und Schwarz-Grau, Chicano, Fine Line, Aquarell, Anime und Manga, geometrisches und ornamentales Blackwork, botanische und minimalistische Arbeit sowie individuelles Lettering. Schau auf die Künstler-Seite, um die passende Wahl für deine Idee zu finden.",
  },
  {
    q: "Kann ich mein eigenes Design oder eine Vorlage mitbringen?",
    a: "Auf jeden Fall — Referenzen, Moodboards und grobe Ideen sind willkommen und wirklich hilfreich. Unsere Künstler entwickeln mit dir aus deiner Idee ein individuelles Design, das zu deinem Körper und der Platzierung passt. Wir kopieren keine Originalarbeiten anderer Künstler, können aber etwas im ähnlichen Geist schaffen.",
  },
  {
    q: "Was kostet ein Tattoo?",
    a: "Der Preis hängt von Größe, Komplexität und Platzierung ab und wird beim Beratungsgespräch besprochen. Größere Stücke werden meist pro Sitzung angeboten, Cover-ups und Reworks separat. Für sehr kleine Tattoos gibt es einen Mindestpreis.",
  },
  {
    q: "Wie buche ich einen Termin?",
    a: "Buchen ist ausschließlich über die [[BOOK]] oder per E-Mail an booking@thefourdeuces.nl möglich. Anfragen auf anderem Weg widersprechen den Studiorichtlinien und können als ungültig gelten.",
  },
  {
    q: "Wie ist eure Stornierungsregelung?",
    a: "Wir bitten um mindestens 48 Stunden Vorlauf zum Stornieren oder Verschieben. Mehr als 30 Minuten Verspätung ohne Bescheid kann zu Stornierung oder Verschiebung und zum Verlust deiner Anzahlung führen.",
  },
  {
    q: "Wie kann ich bezahlen?",
    a: "Wir akzeptieren Bargeld und Kredit-/EC-Karte, PayPal ist nach Absprache möglich. Trinkgeld wird geschätzt, aber nie erwartet.",
  },
  {
    q: "Was ist das Mindestalter für ein Tattoo?",
    a: "Du musst 18 Jahre oder älter sein — oder ab 16 in Begleitung eines Erwachsenen. Bring bitte einen gültigen Lichtbildausweis zu deinem Termin mit.",
  },
  {
    q: "Kann ich ein Tattoo bekommen, wenn ich schwanger bin, stille oder krank bin?",
    a: "Wir tätowieren niemanden, der schwanger ist oder stillt, und bitten dich zu verschieben, wenn du dich am Tag selbst krank fühlst. Hast du eine Erkrankung, nimmst du bestimmte Medikamente oder hast du Hautprobleme an der Stelle, sag uns vorab Bescheid, damit wir dich beraten können.",
  },
  {
    q: "Verwendet ihr Betäubungscreme oder Anästhesie?",
    a: "Während der Sitzung werden keine lokalen Betäubungsmittel verwendet.",
  },
  {
    q: "Bietet ihr Nachstechen an?",
    a: "Ein kostenloses Nachstechen bieten wir innerhalb von 6 Monaten an, gemäß den Bedingungen in unseren AGB. Für Gast-Künstler gilt dies nicht.",
  },
  {
    q: "Verblasst mein Tattoo mit der Zeit?",
    a: "Alle Tattoos werden mit dem Alter weicher und setzen sich, aber gute Nachsorge macht viel aus. Der größte Faktor ist Sonne — ein verheiltes Tattoo mit LSF zu schützen hält es viel länger scharf und lebendig. Fine Line und sehr kleine Details altern naturgemäß schneller als kräftige Arbeit.",
  },
  {
    q: "Könnt ihr ein altes Tattoo covern oder überarbeiten?",
    a: "Oft ja. Cover-ups und Reworks hängen von Größe, Farbe und Dunkelheit des vorhandenen Tattoos ab — schick uns also ein klares Foto, und wir sagen dir, was realistisch möglich ist. Diese werden immer separat nach einer Beratung angeboten.",
  },
  {
    q: "Darf ich jemanden zu meinem Termin mitbringen?",
    a: "Ja, aber Begleitpersonen müssen während deiner Sitzung im Erdgeschoss bleiben.",
  },
  {
    q: "Welche Sterilitäts- und Sicherheitsstandards befolgt euer Studio?",
    a: "Die Sicherheit der Kunden hat Priorität. Wir verwenden ausschließlich sterile Einweg-Cartridges, Desinfektionsmittel in medizinischer Qualität, vollständigen Barriereschutz an unserer Ausrüstung sowie zertifizierte hypoallergene Pigmente und Einweg-Cartridges, die vollständig der EU-REACH-Verordnung entsprechen — frei von Schwermetallen und sicher.",
  },
  {
    q: "Darf ich vor der Sitzung selbst Betäubungscreme auftragen?",
    a: "Wir raten dringend davon ab, Betäubungsprodukte von Drittanbietern ohne vorherige Absprache mit deinem Künstler zu verwenden. Primäre Betäubungsmittel verändern Dichte und Elastizität der Haut (sie 'härten' sie), was beeinflussen kann, wie das Pigment eingeht, wie es heilt und wie lange tonale Übergänge halten. Bei Bedarf kann dein Künstler während der Sitzung ein sicheres sekundäres Kühlmittel auftragen.",
  },
  {
    q: "Was tue ich, wenn mein Tattoo beim Heilen juckt oder sich schält?",
    a: "Leichtes Schälen und mildes Jucken um Tag 4–8 ist ein normales Zeichen dafür, dass sich die obere Hautschicht erneuert. Zieh die Hautschüppchen nicht ab. Trag eine dünne Schicht der von uns empfohlenen Creme auf, um das Unbehagen zu lindern.",
  },
  {
    q: "Was, wenn Wasser unter die Folie kommt oder sie zu früh abgeht?",
    a: "Wenn die Versiegelung der Folie gebrochen ist und Wasser oder Schmutz eindringt oder sie sich über etwa 30 % des Tattoos löst, entferne sie vorsichtig, wasch das Tattoo mit Seife und wechsle zur klassischen Nachsorge — Waschen plus eine dünne Schicht Creme.",
  },
  {
    q: "Kann ich auf das Pigment oder die Nachsorgecreme allergisch sein?",
    a: "Wir verwenden ausschließlich zertifizierte, hochwertige hypoallergene Pigmente. Bekommst du während der Nachsorge Rötung oder Ausschlag rund um das Tattoo, ist das meist eine Reaktion auf eine zu dicke Cremeschicht (die Haut kann nicht atmen) oder eine Allergie gegen einen bestimmten Inhaltsstoff — reduziere die Menge oder wechsle die Creme in Absprache mit deinem Künstler. Wenn du sehr allergieanfällig bist, können wir ein paar Tage vorher einen kleinen, diskreten Patch-Test machen.",
  },
  {
    q: "Könnt ihr ein altes Tattoo ohne Laserentfernung covern?",
    a: "In den meisten Fällen ja. Ein Cover-up braucht spezielle Gestaltung — das neue Motiv wird um die dunklen Bereiche des alten herum aufgebaut. Chicano, dichte Anime-Art, ornamentales/Blackwork und detaillierter Realismus eignen sich ideal für Cover. Ist das alte Tattoo sehr dunkel und dicht, empfehlen wir manchmal zuerst 1–2 Sitzungen Laser-Aufhellung.",
  },
  {
    q: "Kann ein Tattoo Narben oder Dehnungsstreifen abdecken?",
    a: "Ja — ein Tattoo verbirgt Textur und Farbe von Narben gut. Wichtigste Bedingung ist, dass die Narbe vollständig ausgebildet und verblasst ist (mindestens 12–18 Monate seit Verletzung oder OP). Beim Beratungsgespräch beurteilen wir das Gewebe und wählen einen Stil, der die Narbe natürlich verbirgt.",
  },
  {
    q: "Könnt ihr über Muttermale oder Pigmentflecken tätowieren?",
    a: "Nein — ein Tattoo wird nie direkt über erhabene Muttermale gesetzt. Wir arbeiten mit einem sicheren Abstand von einigen Millimetern darum herum und lassen sie in saubere Teile des Designs oder in Hintergrundschatten übergehen.",
  },
  {
    q: "Gibt es Kontraindikationen für ein Tattoo?",
    a: "Absolute Kontraindikationen sind u. a. Blutgerinnungsstörungen (Hämophilie), aktive Krebsbehandlung, aktives HIV oder Hepatitis, schwerer Diabetes, Epilepsie und Neigung zu Keloidnarben. Vorübergehende sind u. a. Schwangerschaft und Stillzeit, Erkältung oder Fieber, ein Schub von Dermatitis oder Psoriasis an der Stelle, frischer Sonnenbrand sowie Einfluss von Alkohol oder Drogen.",
  },
  {
    q: "Ist für die Buchung eine Anzahlung nötig?",
    a: "Um deinen Termin zu reservieren und mit deinem individuellen Design zu beginnen, ist eine kleine Anzahlung nötig. Sie wird auf den Endpreis deiner Sitzung angerechnet.",
  },
  {
    q: "Wo ist das Studio und wie komme ich hin?",
    a: "Wir sind in Amsterdam Zuid / im Museumsviertel an der Van Baerlestraat 126H, 1071 BD Amsterdam, im Erdgeschoss, neben Museumplein und Vondelpark. Die Straßenbahnen 3, 5 und 12 halten direkt vor der Tür, und U-Bahn-Stationen sind fußläufig erreichbar.",
  },
];

// Ukrainian.
const FAQ_UA: FaqItem[] = [
  {
    q: "Чи боляче робити тату?",
    a: "Певний дискомфорт — це нормально, але для більшості людей цілком терпимо, і сильно залежить від місця. Мʼясисті, мʼязисті зони — плече, стегно, литка — найлегші, а кістляві місця з тонкою шкірою — ребра, кисті, стопи, грудина, щиколотки — найчутливіші. У кожного свій поріг болю — скористайся інтерактивною картою тіла на [[BOOK]] як приблизним орієнтиром по зонах.",
  },
  {
    q: "Скільки часу займає тату?",
    a: "Це повністю залежить від розміру, деталізації й розташування. Маленькі прості роботи можуть зайняти менше години, середні — зазвичай 2–4 години, а великі чи дуже деталізовані (рукави, спина, реалізм) розбиваються на кілька сеансів. Майстер дасть реалістичну оцінку часу на консультації. [[CONSULT]]",
  },
  {
    q: "Як підготуватися до сеансу?",
    a: "Добре виспись, поїж перед сеансом і пий достатньо води. Вдягни зручний одяг, що дає легкий доступ до зони. Уникай алкоголю щонайменше за 24 години (він розріджує кров) і не обгорай на сонці в цьому місці заздалегідь. На довгі сеанси візьми перекус і воду.",
  },
  {
    q: "Скільки загоюється тату?",
    a: "Поверхня зазвичай гоїться приблизно 2–3 тижні, а глибші шари шкіри остаточно вгамовуються десь за 2–3 місяці. У перші тижні тату може трохи вкриватися кірочками й лущитися — це нормально. Для найкращого результату чітко дотримуйся інструкцій з догляду — повний гайд з догляду можна завантажити нижче.",
  },
  {
    q: "Як доглядати за свіжим тату?",
    a: "Тримай його чистим і зволоженим, мий обережно теплою водою й милом без віддушок і наноси тонкий шар крему для догляду. Уникай прямого сонця, басейнів, саун, ванн і не колупай та не чухай під час загоєння. Повний гайд з догляду можна завантажити нижче.",
  },
  {
    q: "Чи можна митися, плавати чи займатися спортом після тату?",
    a: "Приймати душ можна як зазвичай (коротко й тепло — без замочування), але уникай басейнів, моря, ванн, саун і джакузі, поки тату повністю не загоїться, зазвичай 2–3 тижні. Легка активність — ок, але в перші дні уникай сильного потіння й тертя свіжого тату.",
  },
  {
    q: "На яких стилях тату ви спеціалізуєтесь?",
    a: "Наші резидентні й запрошені майстри працюють у багатьох стилях — реалізм і чорно-сіре, чикано, fine line, акварель, аніме й манга, геометрія й орнаментальний блекворк, ботаніка й мінімалізм, а також індивідуальний леттеринг. Загляни на сторінку майстрів, щоб знайти того, хто підійде під твою ідею.",
  },
  {
    q: "Чи можна принести власний ескіз або референс?",
    a: "Звісно — референси, мудборди й чернетки ідей вітаються й дуже допомагають. Наші майстри разом з тобою перетворять ідею на індивідуальний ескіз, що підійде твоєму тілу й розташуванню. Ми не копіюємо оригінальні роботи інших майстрів, але можемо створити щось у схожому дусі.",
  },
  {
    q: "Скільки коштує тату?",
    a: "Ціна залежить від розміру, складності й розташування та обговорюється на консультації. Великі роботи зазвичай рахують за сеанс, а кавер-апи й переробки — окремо. Для дуже маленьких тату діє мінімальна вартість.",
  },
  {
    q: "Як записатися на сеанс?",
    a: "Записатися можна виключно на [[BOOK]] або поштою на booking@thefourdeuces.nl. Записи іншими шляхами суперечать політиці студії та можуть бути визнані недійсними.",
  },
  {
    q: "Яка у вас політика скасування?",
    a: "Просимо повідомляти щонайменше за 48 годин про скасування чи перенесення. Запізнення більш ніж на 30 хвилин без попередження може призвести до скасування або перенесення й втрати передоплати.",
  },
  {
    q: "Як можна оплатити?",
    a: "Приймаємо готівку та кредитні/дебетові картки, PayPal — за попередньою домовленістю. Чайові вітаються, але ніколи не є обовʼязковими.",
  },
  {
    q: "З якого віку можна робити тату?",
    a: "Тобі має бути 18 або більше — або від 16 у супроводі дорослого. Візьми на сеанс дійсне посвідчення з фото.",
  },
  {
    q: "Чи можна робити тату під час вагітності, годування або хвороби?",
    a: "Ми не робимо тату вагітним і тим, хто годує груддю, і просимо перенести сеанс, якщо ти почуваєшся зле того дня. Якщо маєш захворювання, приймаєш певні ліки чи є проблеми зі шкірою в цій зоні — скажи заздалегідь, щоб ми могли порадити.",
  },
  {
    q: "Чи використовуєте ви знеболювальний крем або анестезію?",
    a: "Під час сеансу місцева анестезія не використовується.",
  },
  {
    q: "Чи робите ви безкоштовну корекцію?",
    a: "Одна безкоштовна корекція надається протягом 6 місяців, згідно з умовами в наших Умовах. На запрошених майстрів це не поширюється.",
  },
  {
    q: "Чи вицвітатиме тату з часом?",
    a: "Усі тату з часом мʼякшають і вгамовуються, але хороший догляд дуже впливає. Найбільший чинник — сонце: захист загоєного тату кремом з SPF надовго збереже його чіткість і насиченість. Fine line і дуже дрібні деталі природно старіють швидше за насичені роботи.",
  },
  {
    q: "Чи можете ви перекрити або переробити старе тату?",
    a: "Часто так. Кавер-апи й переробки залежать від розміру, кольору й насиченості наявного тату, тож надішли чітке фото, і ми скажемо, що реально можливо. Їх завжди прораховують окремо після консультації.",
  },
  {
    q: "Чи можна привести когось із собою на сеанс?",
    a: "Так, але супровідні особи мають лишатися на першому поверсі під час сеансу.",
  },
  {
    q: "Яких стандартів стерильності й безпеки дотримується студія?",
    a: "Безпека клієнта — наш пріоритет. Ми використовуємо лише стерильні одноразові картриджі, дезінфектанти медичного класу, повний барʼєрний захист обладнання та сертифіковані гіпоалергенні пігменти й одноразові картриджі, що повністю відповідають регламенту EU REACH — без важких металів і безпечні.",
  },
  {
    q: "Чи можна самому нанести знеболювальний крем перед сеансом?",
    a: "Ми наполегливо не радимо використовувати сторонні знеболювальні засоби, не узгодивши це спершу з майстром. Первинні анестетики змінюють щільність та еластичність шкіри («ущільнюють» її), що може вплинути на те, як заходить пігмент, як він гоїться, і на тривкість тональних переходів. За потреби майстер може нанести безпечний вторинний охолоджувальний засіб під час сеансу.",
  },
  {
    q: "Що робити, якщо тату свербить або лущиться під час загоєння?",
    a: "Легке лущення й помірний свербіж на 4–8 день — нормальна ознака оновлення верхнього шару шкіри. Не здирай лусочки. Нанеси тонкий шар рекомендованого нами крему, щоб полегшити дискомфорт.",
  },
  {
    q: "Що робити, якщо під плівку потрапила вода або вона відклеїлась зарано?",
    a: "Якщо герметичність плівки порушено й усередину потрапила вода чи бруд, або вона відклеїлась більш ніж на ~30% тату, обережно зніми її, промий тату милом і перейди на класичний догляд — миття плюс тонкий шар крему.",
  },
  {
    q: "Чи можлива алергія на пігмент або крем для догляду?",
    a: "Ми використовуємо лише сертифіковані преміальні гіпоалергенні пігменти. Якщо під час догляду зʼявляється почервоніння чи висип навколо тату — це найчастіше реакція на надто товстий шар крему (шкіра не дихає) або алергія на конкретний інгредієнт; зменш кількість або зміни крем, узгодивши з майстром. Якщо ти дуже схильний до алергій, за кілька днів до основного сеансу можемо зробити невеликий непомітний патч-тест.",
  },
  {
    q: "Чи можна перекрити старе тату без лазерного видалення?",
    a: "У більшості випадків так. Кавер-ап потребує спеціальної роботи над ескізом — нова робота будується навколо темних ділянок старої. Чикано, щільна аніме-графіка, орнаментал/блекворк і деталізований реалізм ідеальні для перекриття. Якщо старе тату дуже темне й щільне, іноді радимо спершу 1–2 сеанси лазерного освітлення.",
  },
  {
    q: "Чи може тату перекрити шрами або розтяжки?",
    a: "Так — тату добре приховує текстуру й колір шрамів. Головна умова: шрам має бути повністю сформованим і зблідлим (щонайменше 12–18 місяців після травми чи операції). На консультації ми оцінюємо тканину й обираємо стиль, що природно приховає слід.",
  },
  {
    q: "Чи можна робити тату поверх родимок або пігментних плям?",
    a: "Ні — тату ніколи не роблять прямо поверх опуклих родимок. Ми працюємо навколо них із безпечним відступом у кілька міліметрів, вписуючи їх у чисті ділянки ескізу або фонові тіні.",
  },
  {
    q: "Чи є протипоказання до тату?",
    a: "Абсолютні протипоказання: порушення згортання крові (гемофілія), активне лікування раку, активний ВІЛ чи гепатит, тяжкий діабет, епілепсія та схильність до келоїдних рубців. Тимчасові: вагітність і годування, застуда чи температура, загострення дерматиту чи псоріазу в зоні, свіжий сонячний опік та стан алкогольного чи наркотичного впливу.",
  },
  {
    q: "Чи потрібна передоплата для запису?",
    a: "Щоб зарезервувати дату й почати роботу над індивідуальним ескізом, потрібна невелика передоплата. Вона зараховується у фінальну вартість сеансу.",
  },
  {
    q: "Де студія і як дістатися?",
    a: "Ми в Amsterdam Zuid / Музейному кварталі на Van Baerlestraat 126H, 1071 BD Amsterdam, на першому поверсі (begane grond), поруч із Museumplein і Вондельпарком. Трамваї 3, 5 і 12 зупиняються прямо біля дверей, а станції метро — за кілька хвилин пішки.",
  },
];

const FAQ_BY_LANG: Record<string, FaqItem[]> = {
  en: FAQ_ITEMS,
  nl: FAQ_NL,
  de: FAQ_DE,
  ua: FAQ_UA,
};

export function getFaq(lang: string): FaqItem[] {
  return FAQ_BY_LANG[lang] ?? FAQ_ITEMS;
}
