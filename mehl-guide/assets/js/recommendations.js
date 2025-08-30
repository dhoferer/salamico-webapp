/**
 * Empfehlungs-Engine für das Salamico Mehl-Quiz
 * Berechnet basierend auf Nutzer-Antworten die besten Mehl-Empfehlungen
 */

const RecommendationEngine = {
    
    /**
     * Gewichtung der verschiedenen Faktoren
     */
    weights: {
        fermentation: 3,  // Wichtigster Faktor
        style: 2,
        oven: 2,
        level: 1
    },

    /**
     * Minimum Score für Empfehlung
     */
    minScore: 4,

    /**
     * Maximum Anzahl Empfehlungen
     */
    maxRecommendations: 3,

    /**
     * Hauptfunktion: Generiert Empfehlungen basierend auf Antworten
     * @param {Object} answers - Quiz-Antworten
     * @returns {Array} Array von empfohlenen Mehlen
     */
    getRecommendations(answers) {
        const criteria = this.parseAnswers(answers);
        const flours = FlourDatabase.getAll();
        let recommendations = [];

        console.log('🎯 Generiere Empfehlungen für:', criteria);

        // Scoring für jedes Mehl
        Object.values(flours).forEach(flour => {
            const score = this.calculateScore(flour, criteria);
            
            console.log(`📊 ${flour.name}: Score ${score}`);
            
            if (score >= this.minScore) {
                recommendations.push({ flour, score });
            }
        });

        // Fallback falls keine Treffer
        if (recommendations.length === 0) {
            console.log('🔄 Keine direkten Treffer, verwende Fallback');
            recommendations = this.getFallbackRecommendations(flours, criteria);
        }

        // Sortieren und Top-Empfehlungen zurückgeben
        recommendations.sort((a, b) => b.score - a.score);
        const finalRecommendations = recommendations.slice(0, this.maxRecommendations).map(r => r.flour);
        
        console.log('✅ Finale Empfehlungen:', finalRecommendations.map(f => f.name));
        
        return finalRecommendations;
    },

    /**
     * Berechnet Score für ein Mehl basierend auf Antworten
     * @param {Object} flour - Mehl-Objekt
     * @param {Object} criteria - Kriterien vom Nutzer
     * @returns {number} Berechneter Score
     */
    calculateScore(flour, criteria) {
        let score = 0;

        // Gärzeit-Matching (wichtigster Faktor)
        if (flour.fermentation.includes(criteria.fermentation)) {
            score += this.weights.fermentation;
        }

        // Stil-Matching
        if (flour.styles.includes(criteria.style)) {
            score += this.weights.style;
        }

        // Ofen-Matching
        if (flour.ovenTypes.includes(criteria.oven)) {
            score += this.weights.oven;
        }

        // Level-Anpassung
        score += this.getLevelBonus(flour, criteria.level);

        return score;
    },

    /**
     * Gibt Level-Bonus basierend auf W-Wert und Nutzer-Level
     * @param {Object} flour - Mehl-Objekt
     * @param {string} level - Nutzer-Level
     * @returns {number} Bonus-Punkte
     */
    getLevelBonus(flour, level) {
        const wValue = parseInt(flour.wValue);
        
        switch (level) {
            case 'beginner':
                // Einsteiger bevorzugen niedrigere W-Werte (einfacher zu handhaben)
                return wValue < 280 ? this.weights.level : 0;
            case 'expert':
                // Profis können mit hohen W-Werten umgehen
                return wValue >= 300 ? this.weights.level : 0;
            default: // intermediate
                // Fortgeschrittene bevorzugen mittlere W-Werte
                return wValue >= 250 && wValue <= 320 ? this.weights.level : 0;
        }
    },

    /**
     * Fallback-Empfehlungen falls keine direkten Treffer
     * @param {Object} flours - Alle verfügbaren Mehle
     * @param {Object} criteria - Nutzer-Kriterien
     * @returns {Array} Fallback-Empfehlungen
     */
    getFallbackRecommendations(flours, criteria) {
        const fallbackRecommendations = [];
        
        Object.values(flours).forEach(flour => {
            let score = 0;
            
            // Reduzierte Gewichtung für Fallback
            if (flour.fermentation.includes(criteria.fermentation)) score += 2;
            if (flour.styles.includes(criteria.style)) score += 1;
            if (flour.ovenTypes.includes(criteria.oven)) score += 1;
            score += this.getLevelBonus(flour, criteria.level) * 0.5;
            
            fallbackRecommendations.push({ flour, score });
        });

        return fallbackRecommendations;
    },

    /**
     * Parsed Quiz-Antworten in verwendbare Kriterien
     * @param {Object} rawAnswers - Rohe Quiz-Antworten
     * @returns {Object} Geparste Kriterien
     */
    parseAnswers(rawAnswers) {
        return {
            level: rawAnswers[1],       // beginner, intermediate, expert
            fermentation: rawAnswers[2], // short, medium, long
            oven: rawAnswers[3],        // home, ooni, grill, effeuno
            style: rawAnswers[4]        // napoletana, romana, pinsa, detroit, deep
        };
    },

    /**
     * Generiert Erklärungstext für Empfehlungen
     * @param {Object} answers - Quiz-Antworten
     * @returns {string} Erklärungstext
     */
    generateExplanation(answers) {
        const criteria = this.parseAnswers(answers);
        
        const levelTexts = {
            'beginner': 'Als Einsteiger',
            'intermediate': 'Mit deiner Erfahrung',
            'expert': 'Als Profi'
        };

        const fermentationTexts = {
            'short': 'kurzer Gärzeit (2-6h)',
            'medium': '24h Gärzeit',
            'long': 'langer Gärung (48h+)'
        };

        const styleTexts = {
            'napoletana': 'neapolitanische Pizza',
            'romana': 'römische Pizza',
            'pinsa': 'Pinsa Romana',
            'detroit': 'Detroit Style Pizza',
            'deep': 'Deep Dish Pizza'
        };

        const ovenTexts = {
            'home': 'im Haushaltsofen',
            'ooni': 'im Ooni/Outdoor-Ofen',
            'grill': 'auf dem Grill',
            'effeuno': 'im Profi-Ofen'
        };

        return `${levelTexts[criteria.level]} und deiner Vorliebe für ${styleTexts[criteria.style]} mit ${fermentationTexts[criteria.fermentation]} ${ovenTexts[criteria.oven]} haben wir diese Mehle für dich ausgewählt. Sie passen perfekt zu deinem Setup und deinen Anforderungen! 🎯`;
    },

    /**
     * Erstellt HTML für Mehl-Empfehlungen
     * @param {Array} recommendations - Array von empfohlenen Mehlen
     * @returns {string} HTML-String
     */
    renderRecommendations(recommendations) {
        return recommendations.map((flour, index) => `
            <div class="flour-card" data-flour-id="${flour.name.replace(/\s+/g, '_').toLowerCase()}">
                <div class="flour-name">
                    <span class="flour-rank">#${index + 1}</span>
                    ${Utils.escapeHtml(flour.name)}
                </div>
                <div class="flour-details">
                    <div class="flour-detail">
                        <strong>W-Wert:</strong> ${Utils.formatWValue(flour.wValue)}
                    </div>
                    <div class="flour-detail">
                        <strong>Protein:</strong> ${Utils.escapeHtml(flour.protein)}
                    </div>
                    <div class="flour-detail">
                        <strong>Hydration:</strong> ${Utils.escapeHtml(flour.hydration)}
                    </div>
                    <div class="flour-detail">
                        <strong>Marke:</strong> ${Utils.escapeHtml(flour.brand)}
                    </div>
                </div>
                <div class="flour-description">${Utils.escapeHtml(flour.description)}</div>
                <div class="flour-features">
                    <div class="feature-tags">
                        ${flour.styles.map(style => `<span class="feature-tag style-tag">${this.getStyleDisplayName(style)}</span>`).join('')}
                        ${flour.fermentation.map(ferm => `<span class="feature-tag fermentation-tag">${this.getFermentationDisplayName(ferm)}</span>`).join('')}
                    </div>
                </div>
                <a href="${flour.buyLink}" 
                   class="btn buy-button" 
                   target="_blank" 
                   rel="noopener"
                   onclick="Analytics.trackPurchaseClick('${Utils.escapeHtml(flour.name)}', '${flour.buyLink}')">
                   Jetzt kaufen 🛒
                </a>
            </div>
        `).join('');
    },

    /**
     * Konvertiert Style-Codes in lesbare Namen
     * @param {string} style - Style Code
     * @returns {string} Lesbarer Name
     */
    getStyleDisplayName(style) {
        const styleNames = {
            'napoletana': 'Napoletana',
            'romana': 'Romana',
            'pinsa': 'Pinsa',
            'detroit': 'Detroit',
            'deep': 'Deep Dish'
        };
        return styleNames[style] || style;
    },

    /**
     * Konvertiert Fermentation-Codes in lesbare Namen
     * @param {string} fermentation - Fermentation Code
     * @returns {string} Lesbarer Name
     */
    getFermentationDisplayName(fermentation) {
        const fermentationNames = {
            'short': 'Kurze Gärung',
            'medium': '24h Gärung',
            'long': 'Lange Gärung'
        };
        return fermentationNames[fermentation] || fermentation;
    },

    /**
     * Analysiert Empfehlungsqualität
     * @param {Array} recommendations - Empfehlungen
     * @param {Object} criteria - Nutzer-Kriterien
     * @returns {Object} Qualitäts-Analyse
     */
    analyzeRecommendationQuality(recommendations, criteria) {
        const analysis = {
            totalRecommendations: recommendations.length,
            perfectMatches: 0,
            goodMatches: 0,
            averageWValue: 0,
            stylesCovered: new Set(),
            fermentationsCovered: new Set()
        };

        recommendations.forEach(flour => {
            const score = this.calculateScore(flour, criteria);
            
            if (score >= 6) analysis.perfectMatches++;
            else if (score >= 4) analysis.goodMatches++;
            
            analysis.averageWValue += parseInt(flour.wValue);
            flour.styles.forEach(style => analysis.stylesCovered.add(style));
            flour.fermentation.forEach(ferm => analysis.fermentationsCovered.add(ferm));
        });

        if (recommendations.length > 0) {
            analysis.averageWValue = Math.round(analysis.averageWValue / recommendations.length);
        }

        analysis.stylesCovered = Array.from(analysis.stylesCovered);
        analysis.fermentationsCovered = Array.from(analysis.fermentationsCovered);

        return analysis;
    },

    /**
     * Konfiguration der Engine anpassen
     * @param {Object} config - Neue Konfiguration
     */
    configure(config) {
        if (config.weights) {
            this.weights = { ...this.weights, ...config.weights };
        }
        if (config.minScore !== undefined) {
            this.minScore = config.minScore;
        }
        if (config.maxRecommendations !== undefined) {
            this.maxRecommendations = config.maxRecommendations;
        }
        
        console.log('⚙️ Recommendation Engine konfiguriert:', { 
            weights: this.weights, 
            minScore: this.minScore, 
            maxRecommendations: this.maxRecommendations 
        });
    }
};