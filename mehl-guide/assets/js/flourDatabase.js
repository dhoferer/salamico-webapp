/**
 * Mehl-Datenbank für das Salamico Quiz
 * Hier können einfach weitere Mehle hinzugefügt werden
 */

const FlourDatabase = {
    // Basis-Mehle (können erweitert werden)
    data: {
        'manitoba_oro': {
            name: 'Manitoba Oro',
            brand: 'Caputo',
            wValue: 350,
            protein: '14.5g',
            hydration: '70%',
            description: 'Premium-Mehl für lange Gärung und höchste Ansprüche',
            buyLink: 'https://amzn.to/3AglnDX',
            styles: ['napoletana', 'pinsa'],
            ovenTypes: ['ooni', 'effeuno'],
            fermentation: ['medium', 'long'],
            category: 'premium'
        },
        'caputo_nuvola': {
            name: 'Nuvola Super',
            brand: 'Caputo',
            wValue: 300,
            protein: '12.5g',
            hydration: '65%',
            description: 'Ideal für luftige Pizzen und mittlere Gärzeit',
            buyLink: 'https://amzn.to/3FFmXQR',
            styles: ['napoletana', 'romana'],
            ovenTypes: ['ooni', 'effeuno', 'home'],
            fermentation: ['medium', 'long'],
            category: 'professional'
        },
        'dallagiovanna_anna': {
            name: 'Anna Tipo 00',
            brand: 'Molino Dallagiovanna',
            wValue: 280,
            protein: '12g',
            hydration: '62%',
            description: 'Ausgewogenes Mehl für verschiedene Pizza-Stile',
            buyLink: 'https://www.deligio-shop.de/p/anna-tipo-00-w380-p-l-0-60-1-kg',
            styles: ['romana', 'napoletana', 'detroit'],
            ovenTypes: ['home', 'ooni', 'grill'],
            fermentation: ['short', 'medium'],
            category: 'versatile'
        },
        'petra_5063': {
            name: 'Petra 5063 Special',
            brand: 'Molino Quaglia',
            wValue: 200,
            protein: '10.5g',
            hydration: '55%',
            description: 'Ideal für schnelle Gärung und Haushaltsofen',
            buyLink: 'https://pizzahobby.de/strona-glowna/226-pizzamehl-petra-5063-special-125kg-8027815112560.html',
            styles: ['romana', 'detroit', 'deep'],
            ovenTypes: ['home', 'grill'],
            fermentation: ['short'],
            category: 'beginner'
        }
        // HIER KÖNNEN WEITERE MEHLE EINFACH HINZUGEFÜGT WERDEN:
        // 'neues_mehl': {
        //     name: 'Mehl Name',
        //     brand: 'Marke',
        //     wValue: 250,
        //     protein: '11g',
        //     hydration: '60%',
        //     description: 'Beschreibung des Mehls',
        //     buyLink: 'https://link-zum-kauf.de',
        //     styles: ['napoletana', 'romana'], // Pizza-Stile
        //     ovenTypes: ['home', 'ooni'], // Ofen-Typen
        //     fermentation: ['short', 'medium'], // Gärzeit
        //     category: 'versatile' // beginner, professional, premium, versatile
        // }
    },

    /**
     * Alle Mehle abrufen
     * @returns {Object} Alle verfügbaren Mehle
     */
    getAll() {
        return this.data;
    },

    /**
     * Mehl nach ID abrufen
     * @param {string} id - Mehl ID
     * @returns {Object|null} Mehl-Objekt oder null
     */
    getById(id) {
        return this.data[id] || null;
    },

    /**
     * Mehle nach Kategorie filtern
     * @param {string} category - Kategorie (beginner, professional, premium, versatile)
     * @returns {Array} Gefilterte Mehle
     */
    getByCategory(category) {
        return Object.values(this.data).filter(flour => flour.category === category);
    },

    /**
     * Mehle nach W-Wert-Bereich filtern
     * @param {number} minW - Minimum W-Wert
     * @param {number} maxW - Maximum W-Wert
     * @returns {Array} Gefilterte Mehle
     */
    getByWValue(minW, maxW) {
        return Object.values(this.data).filter(flour => {
            const wValue = parseInt(flour.wValue);
            return wValue >= minW && wValue <= maxW;
        });
    },

    /**
     * Mehle nach Pizza-Style filtern
     * @param {string} style - Pizza Style
     * @returns {Array} Gefilterte Mehle
     */
    getByStyle(style) {
        return Object.values(this.data).filter(flour => flour.styles.includes(style));
    },

    /**
     * Mehle nach Ofentyp filtern
     * @param {string} ovenType - Ofentyp
     * @returns {Array} Gefilterte Mehle
     */
    getByOvenType(ovenType) {
        return Object.values(this.data).filter(flour => flour.ovenTypes.includes(ovenType));
    },

    /**
     * Mehle nach Gärzeit filtern
     * @param {string} fermentation - Gärzeit
     * @returns {Array} Gefilterte Mehle
     */
    getByFermentation(fermentation) {
        return Object.values(this.data).filter(flour => flour.fermentation.includes(fermentation));
    },

    /**
     * Neues Mehl hinzufügen
     * @param {string} id - Eindeutige ID
     * @param {Object} flourData - Mehl-Daten
     */
    add(id, flourData) {
        if (this.validate(flourData)) {
            this.data[id] = flourData;
            console.log(`✅ Mehl "${flourData.name}" hinzugefügt`);
        } else {
            console.error(`❌ Ungültige Mehl-Daten für ID: ${id}`);
        }
    },

    /**
     * Mehl aktualisieren
     * @param {string} id - Mehl ID
     * @param {Object} updates - Updates
     */
    update(id, updates) {
        if (this.data[id]) {
            this.data[id] = { ...this.data[id], ...updates };
            console.log(`✅ Mehl "${id}" aktualisiert`);
        } else {
            console.error(`❌ Mehl mit ID "${id}" nicht gefunden`);
        }
    },

    /**
     * Mehl entfernen
     * @param {string} id - Mehl ID
     */
    remove(id) {
        if (this.data[id]) {
            const flourName = this.data[id].name;
            delete this.data[id];
            console.log(`✅ Mehl "${flourName}" entfernt`);
        } else {
            console.error(`❌ Mehl mit ID "${id}" nicht gefunden`);
        }
    },

    /**
     * Mehl-Datenbank aus externer Quelle laden
     * @param {string} url - URL zur JSON-Datei
     */
    async loadExternal(url) {
        try {
            console.log('🔄 Lade externe Mehl-Datenbank...');
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status}`);
            }
            
            const externalFlours = await response.json();
            
            // Validierung der externen Daten
            let validCount = 0;
            Object.entries(externalFlours).forEach(([id, flourData]) => {
                if (this.validate(flourData)) {
                    this.data[id] = flourData;
                    validCount++;
                } else {
                    console.warn(`⚠️ Überspringe ungültige Mehl-Daten für ID: ${id}`);
                }
            });
            
            console.log(`✅ Externe Mehl-Datenbank geladen: ${validCount} Mehle`);
        } catch (error) {
            console.warn('⚠️ Externe Datenbank nicht verfügbar, nutze Standard-Mehle');
            console.warn('Fehler:', error.message);
        }
    },

    /**
     * Validiert Mehl-Daten
     * @param {Object} flourData - Zu validierende Mehl-Daten
     * @returns {boolean} Ist gültig
     */
    validate(flourData) {
        const required = [
            'name', 'brand', 'wValue', 'protein', 
            'hydration', 'description', 'buyLink', 
            'styles', 'ovenTypes', 'fermentation'
        ];
        
        // Prüfe ob alle Required Fields vorhanden sind
        const hasAllFields = required.every(field => flourData.hasOwnProperty(field));
        
        if (!hasAllFields) {
            return false;
        }
        
        // Prüfe Arrays
        if (!Array.isArray(flourData.styles) || flourData.styles.length === 0) {
            return false;
        }
        
        if (!Array.isArray(flourData.ovenTypes) || flourData.ovenTypes.length === 0) {
            return false;
        }
        
        if (!Array.isArray(flourData.fermentation) || flourData.fermentation.length === 0) {
            return false;
        }
        
        // Prüfe W-Value
        const wValue = parseInt(flourData.wValue);
        if (isNaN(wValue) || wValue < 100 || wValue > 500) {
            return false;
        }
        
        return true;
    },

    /**
     * Suche in Mehl-Namen und Beschreibungen
     * @param {string} searchTerm - Suchbegriff
     * @returns {Array} Suchergebnisse
     */
    search(searchTerm) {
        const term = searchTerm.toLowerCase();
        return Object.values(this.data).filter(flour => 
            flour.name.toLowerCase().includes(term) ||
            flour.brand.toLowerCase().includes(term) ||
            flour.description.toLowerCase().includes(term)
        );
    },

    /**
     * Statistiken über die Datenbank
     * @returns {Object} Statistiken
     */
    getStats() {
        const flours = Object.values(this.data);
        const stats = {
            total: flours.length,
            categories: {},
            wValueRange: {
                min: Math.min(...flours.map(f => parseInt(f.wValue))),
                max: Math.max(...flours.map(f => parseInt(f.wValue)))
            },
            brands: [...new Set(flours.map(f => f.brand))].length,
            styles: [...new Set(flours.flatMap(f => f.styles))],
            ovenTypes: [...new Set(flours.flatMap(f => f.ovenTypes))],
            fermentationTypes: [...new Set(flours.flatMap(f => f.fermentation))]
        };

        // Kategorien zählen
        flours.forEach(flour => {
            stats.categories[flour.category] = (stats.categories[flour.category] || 0) + 1;
        });

        return stats;
    },

    /**
     * Export der Datenbank als JSON
     * @returns {string} JSON String
     */
    export() {
        return JSON.stringify(this.data, null, 2);
    },

    /**
     * Import von JSON Daten
     * @param {string} jsonData - JSON String
     */
    import(jsonData) {
        try {
            const importedData = JSON.parse(jsonData);
            let importCount = 0;

            Object.entries(importedData).forEach(([id, flourData]) => {
                if (this.validate(flourData)) {
                    this.data[id] = flourData;
                    importCount++;
                } else {
                    console.warn(`⚠️ Überspringe ungültige Daten für ID: ${id}`);
                }
            });

            console.log(`✅ Import abgeschlossen: ${importCount} Mehle importiert`);
        } catch (error) {
            console.error('❌ Import fehlgeschlagen:', error.message);
        }
    }
};

// Externe Datenbank laden (optional)
document.addEventListener('DOMContentLoaded', () => {
    FlourDatabase.loadExternal('assets/data/flours.json');
});