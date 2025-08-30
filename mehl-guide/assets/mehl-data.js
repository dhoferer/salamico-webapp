// Mehl-Daten basierend auf Salamico.de W-Wert Übersicht
const mehlSorten = [
    {
        name: "Farina Di Grano Tenero Tipo \"0\"",
        hersteller: "Barilla",
        type: "Italienisches Weizenmehl Tipo 0",
        wWert: "350",
        wKategorie: "stark",
        protein: "13,5g",
        hydration: "70%",
        eigenschaften: [
            "Hohe Backstärke für lange Gärung",
            "Starke Glutenentwicklung", 
            "Sehr gute Wasseraufnahme",
            "Professionelle Bäckerqualität"
        ],
        verwendung: {
            title: "Neapolitanische Pizza - lange Gärung",
            beschreibung: "Mit W-Wert 350 perfekt für 8-24h Teigführung. Das starke Gluten hält das CO2 optimal ein."
        },
        geeignetFuer: ["napoletana"],
        herkunft: "Italien",
        kauflinks: ["Amazon"],
        garzeit: "8-24h",
        besonderheiten: "Barilla Profi-Linie für Pizzerien"
    },
    {
        name: "Manitoba Oro",
        hersteller: "Molino Caputo",  
        type: "Manitoba Hartweizen",
        wWert: "400+",
        wKategorie: "sehr-stark",
        protein: "14,5g+",
        hydration: "75%",
        eigenschaften: [
            "Höchste Backstärke verfügbar",
            "Extrem lange Gärzeiten möglich",
            "Sehr hohe Wasseraufnahme",
            "Als Mehlverstärker einsetzbar"
        ],
        verwendung: {
            title: "Sehr lange Gärung (48-72h+)",
            beschreibung: "Das stärkste Mehl für komplexeste Teigführungen. Oft als 10-20% Zusatz zu anderen Mehlen."
        },
        geeignetFuer: ["napoletana", "pinsa"],
        herkunft: "Italien (aus kanadischem Weizen)",
        kauflinks: ["Amazon"],
        garzeit: "48-72h+",
        besonderheiten: "Goldstandard unter Manitoba-Mehlen"
    },
    {
        name: "Nuvola",
        hersteller: "Molino Caputo",
        type: "Spezielles Pizza-Mehl",
        wWert: "300-320",
        wKategorie: "stark", 
        protein: "12,5g",
        hydration: "65%",
        eigenschaften: [
            "Ausgewogene Stärke",
            "Für mittlere Gärzeiten",
            "Gute Handhabung",
            "Konstante Qualität"
        ],
        verwendung: {
            title: "Vielseitiges Pizza-Mehl",
            beschreibung: "Ausgewogenes Verhältnis zwischen Stärke und Handhabung. Für 12-24h Gärung geeignet."
        },
        geeignetFuer: ["napoletana", "romana"],
        herkunft: "Italien",
        kauflinks: ["Amazon"],
        garzeit: "12-24h",
        besonderheiten: "Caputo-Klassiker für Einsteiger"
    },
    {
        name: "Pizzamehl Tipo 00",
        hersteller: "HB-Kunstmühle",
        type: "Deutsche Tipo 00 Alternative",
        wWert: "280-300",
        wKategorie: "stark",
        protein: "12g",
        hydration: "65%",
        eigenschaften: [
            "Deutsche Mühle-Qualität",
            "Tipo 00 Standard",
            "Gute Verfügbarkeit",
            "Fairer Preis"
        ],
        verwendung: {
            title: "Deutsche Alternative zu italienischen Mehlen",
            beschreibung: "Lokale Alternative mit guter Qualität. Für Standard-Pizza-Anwendungen geeignet."
        },
        geeignetFuer: ["napoletana", "romana"],
        herkunft: "Deutschland", 
        kauflinks: ["HB-Kunstmühle"],
        garzeit: "8-24h",
        besonderheiten: "Regional verfügbar"
    },
    {
        name: "Anna Tipo 00",
        hersteller: "Molino Anna",
        type: "Premium Tipo 00",
        wWert: "380",
        wKategorie: "stark",
        protein: "13g",
        hydration: "70%",
        eigenschaften: [
            "Sehr hoher W-Wert",
            "Premium-Qualität",
            "Lange Gärzeiten",
            "Profi-Standard"
        ],
        verwendung: {
            title: "Premium-Mehl für Profis",
            beschreibung: "Höchste Qualität für anspruchsvolle Pizzaioli. Ermöglicht sehr lange Teigführungen."
        },
        geeignetFuer: ["napoletana"],
        herkunft: "Italien",
        kauflinks: ["La Bottega dei Gusti"],
        garzeit: "24-48h",
        besonderheiten: "W-380 - sehr starkes Tipo 00"
    },
    {
        name: "La Napoletana",
        hersteller: "Molino Dallagiovanna",
        type: "Speziell für Napoletana",
        wWert: "300-320",
        wKategorie: "stark",
        protein: "12,8g",
        hydration: "65%",
        eigenschaften: [
            "Für Napoletana optimiert",
            "Traditionelle Mühle",
            "Ausgewogene Eigenschaften",
            "Gute Bläschenbildung"
        ],
        verwendung: {
            title: "Speziell für Pizza Napoletana entwickelt",
            beschreibung: "Von der traditionellen Mühle Dallagiovanna speziell für neapolitanische Pizza kreiert."
        },
        geeignetFuer: ["napoletana"],
        herkunft: "Italien",
        kauflinks: ["Amazon"],
        garzeit: "12-24h",
        besonderheiten: "Speziell für Napoletana-Stil"
    },
    {
        name: "Manitoba",
        hersteller: "Molino Dallagiovanna", 
        type: "Manitoba Hartweizen",
        wWert: "380-400",
        wKategorie: "sehr-stark",
        protein: "14g",
        hydration: "70%",
        eigenschaften: [
            "Sehr starkes Mehl",
            "Lange Fermentation",
            "Hohe Elastizität",
            "Als Verstärker nutzbar"
        ],
        verwendung: {
            title: "Für sehr lange Gärzeiten",
            beschreibung: "Klassisches Manitoba für 48h+ Gärung oder als 10-30% Zusatz zu schwächeren Mehlen."
        },
        geeignetFuer: ["napoletana", "pinsa"],
        herkunft: "Italien",
        kauflinks: ["Amazon"],
        garzeit: "48-72h",
        besonderheiten: "Traditionelles Manitoba"
    },
    {
        name: "Petra 3",
        hersteller: "Molino Quaglia",
        type: "Spezielles Pizza-Mehl",
        wWert: "320-340",
        wKategorie: "stark",
        protein: "13g", 
        hydration: "68%",
        eigenschaften: [
            "Innovative Mühle",
            "Konstante Qualität",
            "Gute Handhabung",
            "Moderne Verarbeitung"
        ],
        verwendung: {
            title: "Moderne Pizza-Mehl-Innovation",
            beschreibung: "Von der innovativen Mühle Quaglia entwickelt. Kombiniert Tradition mit modernen Methoden."
        },
        geeignetFuer: ["napoletana", "romana"],
        herkunft: "Italien",
        kauflinks: ["Youdreamitaly", "Pizzahobby", "Amazon"],
        garzeit: "12-24h", 
        besonderheiten: "Innovative Petra-Serie"
    }
];

// W-Wert Kategorien nach Salamico-Artikel
const wWertKategorien = {
    "schwach": { 
        min: 90, 
        max: 200, 
        beschreibung: "Für schnelle Gärung (2-8h)",
        farbe: "#ffebee",
        garzeit: "2-8h"
    },
    "mittel": { 
        min: 200, 
        max: 280, 
        beschreibung: "Für mittlere Gärung (8-16h)",
        farbe: "#ffeee9",
        garzeit: "8-16h"
    },
    "stark": { 
        min: 280, 
        max: 350, 
        beschreibung: "Für lange Gärung (16-48h)",
        farbe: "#ff6b47",
        garzeit: "16-48h"
    },
    "sehr-stark": { 
        min: 350, 
        max: 400, 
        beschreibung: "Für sehr lange Gärung (48h+)",
        farbe: "#eb4b23",
        garzeit: "48h+"
    }
};

// Pizza-Typen Verwendung
const verwendungsTypen = {
    "napoletana": "Pizza Napoletana",
    "romana": "Pizza Romana/al Taglio", 
    "pinsa": "Pinsa Romana",
    "focaccia": "Focaccia"
};

// Basis-Prinzipien nach Salamico
const pizzaWissen = {
    grundsatz: "Je höher der W-Wert, desto mehr Wasser kann das Mehl aufnehmen und desto länger kann der Teig gehen.",
    faustregel: "Mehr Wasser im Teig = bessere Pizza, aber schwerer zu verarbeiten. Starkes Mehl löst dieses Problem.",
    hydrationStart: "65% Hydration ist ein guter Startpunkt für die meisten Mehle.",
    messung: "W-Wert wird mit Chopin-Alveographen gemessen und ist proportional zum Gluten-Gehalt.",
    gaerzeit: {
        "schnell": "2-8h mit schwachem Mehl",
        "mittel": "8-16h mit mittlerem Mehl", 
        "lang": "16-48h mit starkem Mehl",
        "sehr-lang": "48h+ mit sehr starkem Mehl"
    }
};