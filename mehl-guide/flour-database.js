/**
 * Salamico Mehl-Datenbank
 * ======================
 * 
 * Diese Datei enthält alle verfügbaren Pizzamehle für den Mehl-Finder.
 * Neue Mehle können einfach am Ende hinzugefügt werden.
 * 
 * Struktur eines Mehl-Objekts:
 * {
 *   name: 'Mehlname',              // Produktname
 *   brand: 'Markenname',           // Hersteller
 *   wValue: 'W-Wert',             // Stärke des Mehls (String)
 *   protein: 'Proteingehalt',      // Proteinanteil (String mit g)
 *   hydration: 'Hydration',        // Empfohlene Hydration (String mit %)
 *   description: 'Beschreibung',   // Detaillierte Beschreibung
 *   buyLink: 'Kauflink',          // Affiliate/Shop-Link
 *   styles: ['stil1', 'stil2'],   // Passende Pizza-Stile
 *   ovenTypes: ['ofen1', 'ofen2'], // Passende Ofentypen
 *   fermentation: ['zeit1', 'zeit2'] // Passende Gärzeiten
 * }
 * 
 * Gültige Werte:
 * - styles: ['napoletana', 'romana', 'pinsa', 'detroit', 'deep']
 * - ovenTypes: ['home', 'ooni', 'grill', 'effeuno']
 * - fermentation: ['short', 'medium', 'long']
 */

const flourDatabase = {
    // === CAPUTO MEHLE ===
    'manitoba_oro': {
        name: 'Manitoba Oro',
        brand: 'Caputo',
        wValue: '350',
        protein: '14.5g',
        hydration: '70%',
        description: 'Premium-Mehl für lange Gärung und höchste Ansprüche. Perfekt für authentische neapolitanische Pizza mit perfekter Elastizität. Das stärkste Mehl im Caputo-Sortiment.',
        buyLink: 'https://amzn.to/3AglnDX',
        styles: ['napoletana', 'pinsa'],
        ovenTypes: ['ooni', 'effeuno'],
        fermentation: ['medium', 'long']
    },
    
    'caputo_nuvola': {
        name: 'Nuvola Super',
        brand: 'Caputo',
        wValue: '300',
        protein: '12.5g',
        hydration: '65%',
        description: 'Ideal für luftige Pizzen und mittlere Gärzeit. Vielseitig einsetzbar für verschiedene Stile mit excellenter Verarbeitbarkeit. Ein echter Allrounder.',
        buyLink: 'https://amzn.to/3FFmXQR',
        styles: ['napoletana', 'romana'],
        ovenTypes: ['ooni', 'effeuno', 'home'],
        fermentation: ['medium', 'long']
    },

    'caputo_chef': {
        name: 'Chef\'s Flour',
        brand: 'Caputo',
        wValue: '300',
        protein: '11.5g',
        hydration: '60%',
        description: 'Vielseitiges Mehl für alle Pizza-Stile. Ideal für mittlere Gärzeit und verschiedene Ofen-Typen. Perfekt für Hobby-Pizzabäcker.',
        buyLink: 'https://amzn.to/3chefcaputo',
        styles: ['napoletana', 'romana', 'detroit'],
        ovenTypes: ['home', 'ooni', 'grill'],
        fermentation: ['short', 'medium']
    },

    'caputo_americana': {
        name: 'Americana',
        brand: 'Caputo',
        wValue: '270',
        protein: '12.5g',
        hydration: '58%',
        description: 'Speziell für amerikanische Pizza-Stile entwickelt. Perfekt für Detroit Style und dicke Krusten mit längerem Backvorgang.',
        buyLink: 'https://amzn.to/caputo-americana',
        styles: ['detroit', 'deep'],
        ovenTypes: ['home', 'grill'],
        fermentation: ['short', 'medium']
    },

    // === MOLINO DALLAGIOVANNA MEHLE ===
    'dallagiovanna_anna': {
        name: 'Anna Tipo 00',
        brand: 'Molino Dallagiovanna',
        wValue: '280',
        protein: '12g',
        hydration: '62%',
        description: 'Ausgewogenes Mehl für verschiedene Pizza-Stile. Perfekte Balance zwischen Geschmack und Verarbeitbarkeit. Italienische Tradition seit 1832.',
        buyLink: 'https://www.deligio-shop.de/p/anna-tipo-00-w380-p-l-0-60-1-kg',
        styles: ['romana', 'napoletana', 'detroit'],
        ovenTypes: ['home', 'ooni', 'grill'],
        fermentation: ['short', 'medium']
    },

    'dallagiovanna_special': {
        name: 'Special Napoletana',
        brand: 'Molino Dallagiovanna',
        wValue: '320',
        protein: '13g',
        hydration: '68%',
        description: 'Speziell für neapolitanische Pizza entwickelt. Perfekte Balance für authentische Ergebnisse mit traditionellen italienischen Methoden.',
        buyLink: 'https://www.deligio-shop.de/p/special-napoletana-w320',
        styles: ['napoletana', 'pinsa'],
        ovenTypes: ['ooni', 'effeuno'],
        fermentation: ['medium', 'long']
    },

    // === MOLINO QUAGLIA MEHLE ===
    'petra_5063': {
        name: 'Petra 5063 Special',
        brand: 'Molino Quaglia',
        wValue: '200',
        protein: '10.5g',
        hydration: '55%',
        description: 'Ideal für schnelle Gärung und Haushaltsofen. Einfach zu verarbeiten und perfekt für Pizza-Einsteiger. Sehr verzeihendes Mehl.',
        buyLink: 'https://pizzahobby.de/strona-glowna/226-pizzamehl-petra-5063-special-125kg-8027815112560.html',
        styles: ['romana', 'detroit', 'deep'],
        ovenTypes: ['home', 'grill'],
        fermentation: ['short']
    },

    'petra_9': {
        name: 'Petra 9',
        brand: 'Molino Quaglia',
        wValue: '350',
        protein: '14g',
        hydration: '70%',
        description: 'Premium-Mehl für professionelle Pizzaioli. Extrem stark und perfekt für lange Gärung. Konkurriert mit den besten Mehlen der Welt.',
        buyLink: 'https://pizzahobby.de/petra-9-125kg',
        styles: ['napoletana', 'pinsa'],
        ovenTypes: ['ooni', 'effeuno'],
        fermentation: ['long']
    },

    // === ANDERE PREMIUM-MEHLE ===
    'antimo_caputo_rossa': {
        name: 'Antimo Caputo Rossa',
        brand: 'Antimo Caputo',
        wValue: '260',
        protein: '11.5g',
        hydration: '58%',
        description: 'Klassisches italienisches Mehl mit roter Verpackung. Ideal für traditionelle Pizza Margherita und einfache Zubereitungen.',
        buyLink: 'https://amzn.to/antimo-rossa',
        styles: ['napoletana', 'romana'],
        ovenTypes: ['home', 'ooni'],
        fermentation: ['short', 'medium']
    },

    'molino_rossetto_nera': {
        name: 'Nera 00',
        brand: 'Molino Rossetto',
        wValue: '300',
        protein: '12.8g',
        hydration: '65%',
        description: 'Venezianisches Premium-Mehl mit langer Tradition. Perfekt für alle, die authentische italienische Qualität suchen.',
        buyLink: 'https://shop.rossetto.it/nera-00',
        styles: ['napoletana', 'romana'],
        ovenTypes: ['ooni', 'home'],
        fermentation: ['medium', 'long']
    }

    // NEUE MEHLE EINFACH HIER HINZUFÜGEN:
    // 'neuer_schluessel': {
    //     name: 'Neues Mehl',
    //     brand: 'Marke',
    //     wValue: '280',
    //     protein: '12g',
    //     hydration: '60%',
    //     description: 'Beschreibung des neuen Mehls...',
    //     buyLink: 'https://shop-link.de',
    //     styles: ['napoletana', 'romana'],
    //     ovenTypes: ['home', 'ooni'],
    //     fermentation: ['medium']
    // }
};

// Export für Verwendung in anderen Dateien
if (typeof module !== 'undefined' && module.exports) {
    module.exports = flourDatabase;
}