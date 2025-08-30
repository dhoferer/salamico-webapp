// Quiz Questions - Basierend auf Tally PDF
const questions = [
    {
        question: "Wie muss eine Pizza sein?",
        answers: [
            { text: "Der Rand muss fluffig & luftig sein", value: "A" },
            { text: "Sie soll leicht & bekömmlich sein", value: "B" },
            { text: "Dünn & knuspriger Boden", value: "C" },
            { text: "Hauptsache käsig & deftig", value: "D" },
            { text: "Sie soll richtig schön krachen", value: "E" }
        ]
    },
    {
        question: "Wie lange sollte der Teig gehen?",
        answers: [
            { text: "48–72 Stunden – Teigruhe ist alles", value: "A" },
            { text: "24–48 Stunden mit Vorteig ist ideal", value: "B" },
            { text: "24 Stunden reichen völlig", value: "C" },
            { text: "Ich mag's unkompliziert – 12 Stunden reichen", value: "D" },
            { text: "Hauptsache viel Wasser & Crunch!", value: "E" }
        ]
    },
    {
        question: "Was ist dein Traum-Ofen?",
        answers: [
            { text: "Holzofen oder Ooni bei 450 °C", value: "A" },
            { text: "Haushaltsbackofen mit Pizzastein", value: "B" },
            { text: "Direkte Hitze auf Stahl oder Stein", value: "C" },
            { text: "Gusseisen-Form bei 200 °C", value: "D" },
            { text: "Buttergefettetes Blech im Backofen", value: "E" }
        ]
    },
    {
        question: "Wie soll deine Pizza aussehen?",
        answers: [
            { text: "Rund, mit dicken Randblasen", value: "A" },
            { text: "Oval, rustikal und locker", value: "B" },
            { text: "Dünn, gleichmäßig, direkt auf Stein", value: "C" },
            { text: "Tief, viel Käse, tomatig", value: "D" },
            { text: "Rechteckig mit Käserand", value: "E" }
        ]
    },
    {
        question: "Was ist deine Lieblings-Zutat auf Pizza?",
        answers: [
            { text: "Büffelmozzarella & Basilikum", value: "A" },
            { text: "Ziegenkäse, Kürbis, Honig", value: "B" },
            { text: "Sardellen, Kapern, rote Zwiebeln", value: "C" },
            { text: "Tomatensauce, Wurst, Käseberge", value: "D" },
            { text: "Pepperoni, Cheddar, Frico-Rand", value: "E" }
        ]
    },
    {
        question: "Wie isst du deine Pizza am liebsten?",
        answers: [
            { text: "Mit der Hand, heiß & direkt vom Stein", value: "A" },
            { text: "Stück für Stück in Ruhe genießen", value: "B" },
            { text: "Gefaltet, wie in Rom", value: "C" },
            { text: "Mit Gabel & Messer auf dem Sofa", value: "D" },
            { text: "Rechteckige Stücke, die krachen", value: "E" }
        ]
    },
    {
        question: "Was beschreibt deine Pizzaphilosophie am besten?",
        answers: [
            { text: "Weniger ist mehr – echte Zutaten", value: "A" },
            { text: "Kreativität + Leichtigkeit = Genuss", value: "B" },
            { text: "Schnörkellos, puristisch, direkt", value: "C" },
            { text: "Comfort Food mit Kalorienkuss", value: "D" },
            { text: "Crunch, Käse, Power", value: "E" }
        ]
    },
    {
        question: "Welche Sauce ist ein Muss?",
        answers: [
            { text: "Klassischer Tomatensugo", value: "A" },
            { text: "Olivenöl mit Kräutern", value: "B" },
            { text: "San Marzano pur", value: "C" },
            { text: "Doppelte Tomaten-Käse-Lage", value: "D" },
            { text: "Knoblauch-Tomatensoße mit Kick", value: "E" }
        ]
    },
    {
        question: "Wann isst du Pizza am liebsten?",
        answers: [
            { text: "Am Wochenende mit Freunden & Wein", value: "A" },
            { text: "Nach dem Sport oder als leichte Mahlzeit", value: "B" },
            { text: "In der Mittagspause oder als schnelles Dinner", value: "C" },
            { text: "Am Sonntagabend vor dem Fernseher", value: "D" },
            { text: "Bei der Party als Crowd-Pleaser", value: "E" }
        ]
    },
    {
        question: "Was ist dein Pizzaback-Level?",
        answers: [
            { text: "Ich bin Teignerd & Temperaturfreak", value: "A" },
            { text: "Ich liebe gute Teige, aber auch Abwechslung", value: "B" },
            { text: "Ich bin pragmatisch – Hauptsache lecker", value: "C" },
            { text: "Ich will viel für wenig Aufwand", value: "D" },
            { text: "Ich will Crunch, Käse & Wow!", value: "E" }
        ]
    }
];

// Pizza Types - Basierend auf Tally Ergebnissen
const pizzaTypes = {
    A: {
        title: "Pizza Napoletana – Der Klassiker mit Seele",
        emoji: "🇮🇹",
        description: "Du bist ein echter Neapolitaner – leidenschaftlich, traditionsbewusst und ein echter Teig-Nerd. Mit dir wird Pizza zur Religion: Du stehst auf einen fluffigen Rand, lange Teigführung und einen Ofen, der brennt wie der Vesuv.",
        features: [
            "Weicher, elastischer Teig mit 60–70% Hydration",
            "Wird in ca. 60–90 Sekunden bei 450–500°C gebacken",
            "Dünn in der Mitte, mit einem hohen, luftigen Rand",
            "Klassisch belegt mit San-Marzano-Tomaten, Mozzarella di Bufala, frischem Basilikum"
        ]
    },
    B: {
        title: "Pinsa Romana – Der kreative Leichtgewichtler",
        emoji: "🌿",
        description: "Du bist der moderne Genießer – bewusst, kreativ und offen für Neues. Die Pinsa ist dein Style, weil du auf leichte Texturen, spannende Beläge und neue Teig-Ideen stehst. Du brauchst keine 500°C – aber dafür Geschmack mit Charakter.",
        features: [
            "Dreifach-Mehl-Mix (Weizen, Reis, Soja), sehr hohe Hydration (über 80%)",
            "Lange Teigführung (24–72 Stunden), sehr bekömmlich",
            "Oval geformt, außen knusprig, innen fluffig",
            "Belag oft kreativ: z.B. Ziegenkäse, Feige, Kürbis, Burrata"
        ]
    },
    C: {
        title: "Pizza Romana – Der knusprige Purist",
        emoji: "🏛️",
        description: "Du bist pragmatisch, klar und liebst das Ursprüngliche – ohne viel Chichi. Pizza Romana passt zu dir, weil sie das italienische Streetfood-Gefühl direkt nach Hause bringt: dünn, direkt, voller Geschmack.",
        features: [
            "Sehr dünner, fester Teig mit mittlerer Hydration (60–65%)",
            "Direkt auf Pizzastahl oder -stein gebacken – kein fluffiger Rand",
            "Perfekt zum Falten (al taglio oder tonda)",
            "Belegt mit klassischen Zutaten: Tomaten, Sardellen, Kapern, Fior di Latte"
        ]
    },
    D: {
        title: "Deep Dish – Der Schichtmeister",
        emoji: "🏙️",
        description: "Du bist ein Genießer mit Hang zum Deftigen. Bei dir darf es gern etwas mehr sein – mehr Käse, mehr Teig, mehr Komfort. Chicago lässt grüßen: Deep Dish Pizza ist deine Wahl, wenn du Pizza als vollwertige Mahlzeit verstehst.",
        features: [
            "Teig wird in einer tiefen, geölten Form gebacken",
            "Käse kommt unter die Tomatensoße – um nicht zu verbrennen",
            "Kräftig, saftig, käsig – fast wie ein Pizza-Auflauf",
            "Perfekt mit Mozzarella, Cheddar, Salami, Pilzen, Spinat"
        ]
    },
    E: {
        title: "Detroit Style – Der Crunch-King",
        emoji: "🔥",
        description: "Du liebst Struktur, Power und ein bisschen Extravaganz – mit ordentlich Käse am Rand. Detroit Style Pizza ist dein Style, wenn du das Knuspern liebst und gern mit Blech & Butter arbeitest.",
        features: [
            "Rechteckig, gebacken in einer hohen Metallpfanne",
            "Dicke Teigbasis mit hoher Hydration (ca. 75%)",
            "Extra-Käse am Rand ergibt den berühmten Frico (krosse Kante)",
            "Sauce kommt oben drauf (Racing Stripes)"
        ]
    }
};