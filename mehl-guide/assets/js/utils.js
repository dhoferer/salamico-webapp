/**
 * Utility-Funktionen für das Salamico Mehl-Quiz
 * Wiederverwendbare Hilfsfunktionen
 */

const Utils = {
    /**
     * Debounce Funktion für Performance-Optimierung
     * @param {Function} func - Funktion die gedebounced werden soll
     * @param {number} wait - Wartezeit in ms
     * @returns {Function} Gedebouncte Funktion
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /**
     * Smooth Scroll zu Element
     * @param {string} elementId - ID des Zielelements
     * @param {number} offset - Offset in Pixeln
     */
    scrollToElement(elementId, offset = 0) {
        const element = document.getElementById(elementId);
        if (element) {
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    },

    /**
     * Formatiert W-Wert für Anzeige
     * @param {number|string} wValue - W-Wert
     * @returns {string} Formatierter W-Wert
     */
    formatWValue(wValue) {
        if (typeof wValue === 'string' && wValue.includes('-')) {
            return `W ${wValue}`;
        }
        return `W ${wValue}`;
    },

    /**
     * Generiert eindeutige ID
     * @returns {string} Eindeutige ID
     */
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    /**
     * Validiert Email-Adresse
     * @param {string} email - Email-Adresse
     * @returns {boolean} Ist gültig
     */
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    /**
     * Speichert Daten im LocalStorage (falls verfügbar)
     * @param {string} key - Schlüssel
     * @param {any} value - Wert
     */
    saveToStorage(key, value) {
        try {
            localStorage.setItem(`salamico_${key}`, JSON.stringify(value));
        } catch (error) {
            console.warn('LocalStorage nicht verfügbar:', error);
        }
    },

    /**
     * Lädt Daten aus LocalStorage
     * @param {string} key - Schlüssel
     * @returns {any|null} Gespeicherte Daten oder null
     */
    loadFromStorage(key) {
        try {
            const item = localStorage.getItem(`salamico_${key}`);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.warn('Fehler beim Laden aus LocalStorage:', error);
            return null;
        }
    },

    /**
     * Kopiert Text in Zwischenablage
     * @param {string} text - Zu kopierender Text
     * @returns {Promise<boolean>} Erfolgreich kopiert
     */
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (error) {
            // Fallback für ältere Browser
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            const success = document.execCommand('copy');
            document.body.removeChild(textArea);
            return success;
        }
    },

    /**
     * Zeigt Toast-Nachricht
     * @param {string} message - Nachricht
     * @param {string} type - Typ (success, error, info)
     */
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        
        // Toast Styles inline (damit kein CSS erforderlich)
        Object.assign(toast.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '12px 20px',
            borderRadius: '8px',
            color: 'white',
            fontWeight: '600',
            zIndex: '10000',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease',
            backgroundColor: type === 'success' ? '#28a745' : 
                           type === 'error' ? '#dc3545' : '#17a2b8'
        });

        document.body.appendChild(toast);

        // Animation
        setTimeout(() => toast.style.transform = 'translateX(0)', 100);
        setTimeout(() => toast.style.transform = 'translateX(100%)', 3000);
        setTimeout(() => {
            if (document.body.contains(toast)) {
                document.body.removeChild(toast);
            }
        }, 3500);
    },

    /**
     * Throttle Funktion für Event-Handler
     * @param {Function} func - Funktion
     * @param {number} limit - Limit in ms
     * @returns {Function} Gethrottelte Funktion
     */
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    /**
     * Formatiert Datum für deutsche Anzeige
     * @param {Date} date - Datum
     * @returns {string} Formatiertes Datum
     */
    formatDate(date) {
        return new Intl.DateTimeFormat('de-DE', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(date);
    },

    /**
     * Prüft ob Element im Viewport sichtbar ist
     * @param {HTMLElement} element - DOM Element
     * @returns {boolean} Ist sichtbar
     */
    isElementVisible(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },

    /**
     * Wartet eine bestimmte Zeit (Promise-basiert)
     * @param {number} ms - Millisekunden
     * @returns {Promise} Promise die nach ms resolved
     */
    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    /**
     * Escape HTML-Zeichen
     * @param {string} text - Text mit möglichen HTML-Zeichen
     * @returns {string} Escaped Text
     */
    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }
};