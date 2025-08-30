/**
 * Analytics-Modul für detailliertes Tracking
 * Google Analytics 4 und Custom Events
 */

const Analytics = {
    isEnabled: false,
    trackingId: null,
    sessionId: null,
    userId: null,

    /**
     * Analytics initialisieren
     * @param {string} trackingId - Google Analytics Tracking ID
     */
    init(trackingId) {
        this.trackingId = trackingId;
        this.isEnabled = true;
        this.sessionId = Utils.generateId();
        this.userId = Utils.loadFromStorage('user_id') || Utils.generateId();
        
        // User ID speichern
        Utils.saveToStorage('user_id', this.userId);
        
        this.loadGoogleAnalytics();
        console.log('📊 Analytics initialisiert:', { trackingId, sessionId: this.sessionId });
    },

    /**
     * Google Analytics laden
     */
    loadGoogleAnalytics() {
        // Google Analytics Script laden
        const script1 = document.createElement('script');
        script1.async = true;
        script1.src = `https://www.googletagmanager.com/gtag/js?id=${this.trackingId}`;
        document.head.appendChild(script1);

        // GA4 konfigurieren
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', this.trackingId, {
            'user_id': this.userId,
            'session_id': this.sessionId,
            'custom_map': {
                'dimension1': 'quiz_type',
                'dimension2': 'user_level',
                'dimension3': 'pizza_style'
            }
        });
        
        window.gtag = gtag;
        
        // Enhanced E-commerce Setup
        gtag('config', this.trackingId, {
            'enhanced_ecommerce': true
        });
    },

    /**
     * Quiz-Start tracken
     */
    trackQuizStart() {
        const eventData = {
            'quiz_type': 'mehl_finder',
            'timestamp': new Date().toISOString(),
            'session_id': this.sessionId,
            'user_agent': navigator.userAgent,
            'screen_resolution': `${screen.width}x${screen.height}`,
            'viewport_size': `${window.innerWidth}x${window.innerHeight}`,
            'language': navigator.language
        };

        this.sendEvent('quiz_start', eventData);
        
        // Page View
        if (typeof gtag !== 'undefined') {
            gtag('config', this.trackingId, {
                'page_title': 'Mehl-Finder Quiz Start',
                'page_location': window.location.href
            });
        }
    },

    /**
     * Frage-Antwort tracken
     * @param {number} questionNumber - Frage Nummer
     * @param {string} answer - Gewählte Antwort
     */
    trackAnswer(questionNumber, answer) {
        const eventData = {
            'question_number': questionNumber,
            'answer': answer,
            'quiz_type': 'mehl_finder',
            'session_id': this.sessionId,
            'timestamp': new Date().toISOString()
        };

        this.sendEvent('quiz_answer', eventData);
        
        // Spezielle Events für wichtige Antworten
        if (questionNumber === 1) {
            this.sendEvent('user_level_selected', {
                'user_level': answer,
                'quiz_type': 'mehl_finder'
            });
        }
        
        if (questionNumber === 4) {
            this.sendEvent('pizza_style_selected', {
                'pizza_style': answer,
                'quiz_type': 'mehl_finder'
            });
        }
    },

    /**
     * Quiz-Abschluss tracken
     * @param {Object} answers - Alle Antworten
     * @param {Array} recommendations - Empfehlungen
     */
    trackCompletion(answers, recommendations) {
        const completionData = {
            'quiz_type': 'mehl_finder',
            'user_level': answers[1],
            'fermentation_time': answers[2],
            'oven_type': answers[3],
            'pizza_style': answers[4],
            'recommendations_count': recommendations.length,
            'top_recommendation': recommendations[0]?.name || 'none',
            'all_recommendations': recommendations.map(r => r.name).join(','),
            'session_id': this.sessionId,
            'completion_time': new Date().toISOString()
        };

        this.sendEvent('quiz_completed', completionData);
        
        // Conversion Event
        this.sendEvent('conversion', {
            'conversion_type': 'quiz_completion',
            'quiz_type': 'mehl_finder',
            'value': recommendations.length // Anzahl Empfehlungen als Wert
        });
        
        // Enhanced E-commerce: View Item List
        if (typeof gtag !== 'undefined') {
            gtag('event', 'view_item_list', {
                'item_list_id': 'flour_recommendations',
                'item_list_name': 'Mehl Empfehlungen',
                'items': recommendations.map((flour, index) => ({
                    'item_id': flour.name.replace(/\s+/g, '_').toLowerCase(),
                    'item_name': flour.name,
                    'item_category': 'Pizzamehl',
                    'item_brand': flour.brand,
                    'price': 0, // Preis wäre hier zu ergänzen
                    'quantity': 1,
                    'index': index
                }))
            });
        }
    },

    /**
     * Kauflink-Click tracken
     * @param {string} flourName - Name des Mehls
     * @param {string} buyLink - Kauflink URL
     */
    trackPurchaseClick(flourName, buyLink) {
        const eventData = {
            'flour_name': flourName,
            'buy_link': buyLink,
            'source': 'mehl_finder_quiz',
            'session_id': this.sessionId,
            'click_timestamp': new Date().toISOString()
        };

        this.sendEvent('purchase_click', eventData);
        
        // Enhanced E-commerce: Select Item
        if (typeof gtag !== 'undefined') {
            gtag('event', 'select_item', {
                'item_list_id': 'flour_recommendations',
                'item_list_name': 'Mehl Empfehlungen',
                'items': [{
                    'item_id': flourName.replace(/\s+/g, '_').toLowerCase(),
                    'item_name': flourName,
                    'item_category': 'Pizzamehl',
                    'quantity': 1
                }]
            });
        }
        
        // Outbound Link Tracking
        this.sendEvent('click', {
            'link_classes': 'buy-button',
            'link_domain': new URL(buyLink).hostname,
            'link_url': buyLink,
            'outbound': true
        });
    },

    /**
     * Quiz-Neustart tracken
     */
    trackRestart() {
        this.sendEvent('quiz_restart', {
            'quiz_type': 'mehl_finder',
            'session_id': this.sessionId,
            'restart_timestamp': new Date().toISOString()
        });
    },

    /**
     * Fehler tracken
     * @param {string} error - Fehlermeldung
     * @param {string} context - Kontext des Fehlers
     */
    trackError(error, context) {
        this.sendEvent('quiz_error', {
            'error_message': error,
            'error_context': context,
            'quiz_type': 'mehl_finder',
            'session_id': this.sessionId,
            'url': window.location.href,
            'user_agent': navigator.userAgent,
            'timestamp': new Date().toISOString()
        });
        
        // Exception Tracking
        if (typeof gtag !== 'undefined') {
            gtag('event', 'exception', {
                'description': `${context}: ${error}`,
                'fatal': false
            });
        }
    },

    /**
     * Scroll-Tiefe tracken
     * @param {number} scrollPercentage - Scroll-Prozentsatz
     */
    trackScrollDepth(scrollPercentage) {
        // Nur bei bestimmten Schwellenwerten tracken
        const thresholds = [25, 50, 75, 90, 100];
        
        if (thresholds.includes(scrollPercentage)) {
            this.sendEvent('scroll', {
                'scroll_depth': scrollPercentage,
                'page_location': window.location.href
            });
        }
    },

    /**
     * Zeit auf Frage tracken
     * @param {number} questionNumber - Frage Nummer
     * @param {number} timeSpent - Zeit in Sekunden
     */
    trackTimeOnQuestion(questionNumber, timeSpent) {
        this.sendEvent('question_timing', {
            'question_number': questionNumber,
            'time_spent': timeSpent,
            'quiz_type': 'mehl_finder',
            'session_id': this.sessionId
        });
    },

    /**
     * Email-Anmeldung tracken
     * @param {string} email - Email-Adresse (gehashed)
     * @param {string} source - Quelle der Anmeldung
     */
    trackEmailSignup(email, source) {
        // Email hashen für Datenschutz
        const hashedEmail = this.hashString(email);
        
        this.sendEvent('sign_up', {
            'method': 'email',
            'hashed_email': hashedEmail,
            'signup_source': source,
            'quiz_type': 'mehl_finder'
        });
        
        // Conversion
        this.sendEvent('conversion', {
            'conversion_type': 'email_signup',
            'source': source
        });
    },

    /**
     * Share Event tracken
     * @param {string} method - Share-Methode
     */
    trackShare(method) {
        this.sendEvent('share', {
            'method': method,
            'content_type': 'quiz_results',
            'item_id': 'mehl_finder_quiz'
        });
    },

    /**
     * Custom Event senden
     * @param {string} eventName - Event Name
     * @param {Object} parameters - Event Parameter
     */
    sendEvent(eventName, parameters) {
        if (!this.isEnabled) {
            console.log('📊 Analytics Event (Debug):', eventName, parameters);
            return;
        }

        // Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, parameters);
        }

        // Custom Analytics (z.B. eigener Server)
        this.sendToCustomAnalytics(eventName, parameters);
        
        console.log('📊 Analytics Event gesendet:', eventName, parameters);
    },

    /**
     * Event an eigenen Analytics-Server senden
     * @param {string} eventName - Event Name
     * @param {Object} parameters - Parameter
     */
    async sendToCustomAnalytics(eventName, parameters) {
        try {
            const eventData = {
                event: eventName,
                properties: parameters,
                timestamp: new Date().toISOString(),
                session_id: this.sessionId,
                user_id: this.userId
            };

            // An eigenen Analytics-Endpoint senden
            await fetch('/api/analytics', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(eventData)
            });
        } catch (error) {
            console.warn('Custom Analytics Fehler:', error);
        }
    },

    /**
     * User Properties setzen
     * @param {Object} properties - User Properties
     */
    setUserProperties(properties) {
        if (!this.isEnabled || typeof gtag === 'undefined') return;
        
        gtag('config', this.trackingId, {
            'custom_map': properties
        });
        
        // Auch in LocalStorage speichern für spätere Verwendung
        Utils.saveToStorage('user_properties', properties);
    },

    /**
     * Page View manuell senden
     * @param {string} pageName - Seitenname
     * @param {string} pageTitle - Seitentitel
     */
    trackPageView(pageName, pageTitle) {
        if (typeof gtag !== 'undefined') {
            gtag('config', this.trackingId, {
                'page_title': pageTitle,
                'page_location': window.location.href,
                'page_path': pageName
            });
        }
    },

    /**
     * Einfacher String Hash (für Email-Anonymisierung)
     * @param {string} str - String zum Hashen
     * @returns {string} Hash
     */
    hashString(str) {
        let hash = 0;
        if (str.length === 0) return hash.toString();
        
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // 32bit integer
        }
        return Math.abs(hash).toString();
    },

    /**
     * Performance Metrics tracken
     */
    trackPerformance() {
        if (typeof performance !== 'undefined' && performance.timing) {
            const timing = performance.timing;
            const loadTime = timing.loadEventEnd - timing.navigationStart;
            
            this.sendEvent('page_performance', {
                'load_time': loadTime,
                'dom_ready': timing.domContentLoadedEventEnd - timing.navigationStart,
                'first_paint': timing.responseStart - timing.navigationStart
            });
        }
    },

    /**
     * A/B Test Tracking
     * @param {string} testName - Name des Tests
     * @param {string} variant - Test-Variante
     */
    trackABTest(testName, variant) {
        this.sendEvent('ab_test', {
            'test_name': testName,
            'variant': variant,
            'session_id': this.sessionId
        });
        
        // Als User Property speichern
        this.setUserProperties({
            [`ab_test_${testName}`]: variant
        });
    },

    /**
     * Heatmap-Integration (z.B. Hotjar)
     * @param {string} hotjarId - Hotjar Site ID
     */
    loadHeatmapTools(hotjarId) {
        if (!hotjarId) return;
        
        // Hotjar Script
        (function(h,o,t,j,a,r){
            h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
            h._hjSettings={hjid:hotjarId,hjsv:6};
            a=o.getElementsByTagName('head')[0];
            r=o.createElement('script');r.async=1;
            r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
            a.appendChild(r);
        })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
    },

    /**
     * GDPR-konforme Einstellungen
     * @param {Object} consent - Einverständnis-Einstellungen
     */
    updateConsent(consent) {
        if (typeof gtag !== 'undefined') {
            gtag('consent', 'update', {
                'analytics_storage': consent.analytics ? 'granted' : 'denied',
                'ad_storage': consent.advertising ? 'granted' : 'denied',
                'functionality_storage': consent.functional ? 'granted' : 'denied',
                'personalization_storage': consent.personalization ? 'granted' : 'denied'
            });
        }
        
        Utils.saveToStorage('consent_settings', consent);
        console.log('🔒 Consent Settings aktualisiert:', consent);
    }
};

// Scroll Depth Tracking Setup
if (typeof window !== 'undefined') {
    let maxScrollDepth = 0;
    
    window.addEventListener('scroll', Utils.throttle(() => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = Math.round((scrollTop / documentHeight) * 100);
        
        if (scrollPercent > maxScrollDepth) {
            maxScrollDepth = scrollPercent;
            Analytics.trackScrollDepth(scrollPercent);
        }
    }, 1000));
}

// Performance Tracking nach Page Load
window.addEventListener('load', () => {
    setTimeout(() => {
        Analytics.trackPerformance();
    }, 1000);
});