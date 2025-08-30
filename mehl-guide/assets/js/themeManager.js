/**
 * Theme Manager für Dark Mode und Personalisierung
 */

const ThemeManager = {
    currentTheme: 'light',
    toggleButton: null,
    
    themes: {
        light: {
            '--primary-color': '#ff6b35',
            '--secondary-color': '#f7931e',
            '--background-color': '#ffffff',
            '--text-color': '#333333',
            '--border-color': '#e9ecef',
            '--card-background': '#f8f9fa',
            '--success-color': '#28a745',
            '--error-color': '#dc3545',
            '--info-color': '#17a2b8'
        },
        dark: {
            '--primary-color': '#ff8c5a',
            '--secondary-color': '#ffa940',
            '--background-color': '#1a1a1a',
            '--text-color': '#ffffff',
            '--border-color': '#333333',
            '--card-background': '#2d2d2d',
            '--success-color': '#32d74b',
            '--error-color': '#ff453a',
            '--info-color': '#64d2ff'
        },
        salamico: {
            '--primary-color': '#d32f2f',
            '--secondary-color': '#f57c00',
            '--background-color': '#ffffff',
            '--text-color': '#333333',
            '--border-color': '#e0e0e0',
            '--card-background': '#f5f5f5',
            '--success-color': '#388e3c',
            '--error-color': '#d32f2f',
            '--info-color': '#1976d2'
        },
        contrast: {
            '--primary-color': '#000000',
            '--secondary-color': '#333333',
            '--background-color': '#ffffff',
            '--text-color': '#000000',
            '--border-color': '#000000',
            '--card-background': '#f0f0f0',
            '--success-color': '#006600',
            '--error-color': '#cc0000',
            '--info-color': '#0066cc'
        }
    },

    /**
     * Theme Manager initialisieren
     */
    init() {
        this.loadSavedTheme();
        this.createThemeToggle();
        this.detectSystemPreference();
        this.setupMediaQueryListener();
        
        console.log('🎨 Theme Manager initialisiert');
    },

    /**
     * Gespeichertes Theme laden
     */
    loadSavedTheme() {
        const savedTheme = Utils.loadFromStorage('theme');
        
        if (savedTheme && this.themes[savedTheme]) {
            this.setTheme(savedTheme);
        } else {
            // System-Präferenz verwenden
            const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            this.setTheme(prefersDark ? 'dark' : 'light');
        }
    },

    /**
     * System Dark Mode Präferenz erkennen
     */
    detectSystemPreference() {
        if (window.matchMedia) {
            const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
            
            // Nur wenn kein Theme gespeichert ist
            if (!Utils.loadFromStorage('theme')) {
                this.setTheme(darkModeQuery.matches ? 'dark' : 'light');
            }
        }
    },

    /**
     * Media Query Listener für System Theme Changes
     */
    setupMediaQueryListener() {
        if (window.matchMedia) {
            const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
            
            darkModeQuery.addListener((e) => {
                // Nur reagieren wenn "System" Theme ausgewählt ist
                const savedTheme = Utils.loadFromStorage('theme');
                if (!savedTheme || savedTheme === 'system') {
                    this.setTheme(e.matches ? 'dark' : 'light');
                    Utils.showToast(`Theme zu ${e.matches ? 'Dark' : 'Light'} Mode gewechselt`, 'info');
                }
            });
        }
    },

    /**
     * Theme setzen
     * @param {string} themeName - Name des Themes
     */
    setTheme(themeName) {
        if (!this.themes[themeName]) {
            console.warn(`⚠️ Theme "${themeName}" nicht gefunden`);
            return;
        }

        const previousTheme = this.currentTheme;
        this.currentTheme = themeName;
        const theme = this.themes[themeName];
        
        // CSS Custom Properties setzen
        Object.entries(theme).forEach(([property, value]) => {
            document.documentElement.style.setProperty(property, value);
        });

        // Body Attribute für spezifische Theme-Styles
        document.body.setAttribute('data-theme', themeName);
        
        // Theme in LocalStorage speichern
        Utils.saveToStorage('theme', themeName);
        
        // Toggle Button Icon aktualisieren
        this.updateToggleButton();
        
        // Theme Change Event
        this.dispatchThemeChangeEvent(previousTheme, themeName);
        
        // Analytics
        if (typeof Analytics !== 'undefined') {
            Analytics.sendEvent('theme_changed', {
                'previous_theme': previousTheme,
                'new_theme': themeName
            });
        }
        
        console.log(`🎨 Theme gewechselt: ${previousTheme} → ${themeName}`);
    },

    /**
     * Theme Toggle Button erstellen
     */
    createThemeToggle() {
        this.toggleButton = document.createElement('button');
        this.toggleButton.className = 'theme-toggle';
        this.toggleButton.setAttribute('aria-label', 'Theme wechseln');
        this.toggleButton.setAttribute('title', 'Dark/Light Mode umschalten');
        
        this.updateToggleButton();
        
        // Event Listener
        this.toggleButton.addEventListener('click', () => {
            this.toggleTheme();
        });
        
        // Keyboard Support
        this.toggleButton.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.toggleTheme();
            }
        });
        
        // Button zur Seite hinzufügen
        document.body.appendChild(this.toggleButton);
    },

    /**
     * Toggle Button Icon aktualisieren
     */
    updateToggleButton() {
        if (!this.toggleButton) return;
        
        const icons = {
            light: '🌙',
            dark: '☀️',
            salamico: '🍕',
            contrast: '⚫'
        };
        
        this.toggleButton.innerHTML = icons[this.currentTheme] || '🌙';
        this.toggleButton.setAttribute('aria-label', 
            `Aktuelles Theme: ${this.currentTheme}. Klicken zum Wechseln.`);
    },

    /**
     * Theme umschalten (zwischen light und dark)
     */
    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
        
        // Smooth Transition
        document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
        
        Utils.showToast(`${newTheme === 'dark' ? 'Dark' : 'Light'} Mode aktiviert`, 'success');
    },

    /**
     * Nächstes Theme in der Reihenfolge
     */
    cycleTheme() {
        const themeOrder = ['light', 'dark', 'salamico', 'contrast'];
        const currentIndex = themeOrder.indexOf(this.currentTheme);
        const nextIndex = (currentIndex + 1) % themeOrder.length;
        this.setTheme(themeOrder[nextIndex]);
    },

    /**
     * Custom Theme erstellen
     * @param {string} name - Theme Name
     * @param {Object} colors - Farb-Definitionen
     */
    createCustomTheme(name, colors) {
        // Validierung der erforderlichen Properties
        const requiredProps = ['--primary-color', '--secondary-color', '--background-color', '--text-color', '--border-color'];
        const hasAllProps = requiredProps.every(prop => colors[prop]);
        
        if (!hasAllProps) {
            console.error('❌ Custom Theme unvollständig. Erforderliche Properties:', requiredProps);
            return false;
        }
        
        this.themes[name] = { ...colors };
        console.log(`✅ Custom Theme "${name}" erstellt`);
        return true;
    },

    /**
     * Theme exportieren
     * @param {string} themeName - Name des zu exportierenden Themes
     * @returns {Object|null} Theme-Objekt
     */
    exportTheme(themeName) {
        if (!this.themes[themeName]) {
            console.error(`❌ Theme "${themeName}" nicht gefunden`);
            return null;
        }
        
        return {
            name: themeName,
            colors: { ...this.themes[themeName] },
            exportDate: new Date().toISOString()
        };
    },

    /**
     * Theme importieren
     * @param {Object} themeData - Theme-Daten zum Importieren
     */
    importTheme(themeData) {
        if (!themeData.name || !themeData.colors) {
            console.error('❌ Ungültige Theme-Daten');
            return false;
        }
        
        if (this.createCustomTheme(themeData.name, themeData.colors)) {
            console.log(`✅ Theme "${themeData.name}" importiert`);
            return true;
        }
        
        return false;
    },

    /**
     * Theme Change Event dispatchen
     * @param {string} previousTheme - Vorheriges Theme
     * @param {string} newTheme - Neues Theme
     */
    dispatchThemeChangeEvent(previousTheme, newTheme) {
        const event = new CustomEvent('themechange', {
            detail: {
                previousTheme,
                newTheme,
                themes: this.themes
            }
        });
        
        document.dispatchEvent(event);
    },

    /**
     * Auto Dark Mode basierend auf Tageszeit
     * @param {Object} config - Konfiguration {enableHour, disableHour}
     */
    enableAutoDarkMode(config = { enableHour: 20, disableHour: 7 }) {
        const checkTime = () => {
            const hour = new Date().getHours();
            const shouldBeDark = hour >= config.enableHour || hour < config.disableHour;
            const targetTheme = shouldBeDark ? 'dark' : 'light';
            
            if (this.currentTheme !== targetTheme) {
                this.setTheme(targetTheme);
                Utils.showToast(`Auto ${targetTheme} Mode aktiviert`, 'info');
            }
        };
        
        // Sofort prüfen
        checkTime();
        
        // Jede Stunde prüfen
        setInterval(checkTime, 60 * 60 * 1000);
        
        Utils.saveToStorage('auto_dark_mode', config);
        console.log('🕐 Auto Dark Mode aktiviert:', config);
    },

    /**
     * Accessibility - High Contrast Mode Detection
     */
    detectHighContrastMode() {
        if (window.matchMedia) {
            const highContrastQuery = window.matchMedia('(prefers-contrast: high)');
            
            if (highContrastQuery.matches) {
                this.setTheme('contrast');
                Utils.showToast('High Contrast Mode erkannt', 'info');
            }
            
            highContrastQuery.addListener((e) => {
                if (e.matches) {
                    this.setTheme('contrast');
                }
            });
        }
    },

    /**
     * Reduced Motion Preference
     */
    respectReducedMotion() {
        if (window.matchMedia) {
            const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
            
            if (reducedMotionQuery.matches) {
                document.documentElement.style.setProperty('--animation-duration', '0.01ms');
                document.documentElement.style.setProperty('--transition-duration', '0.01ms');
            }
        }
    },

    /**
     * Theme Persistence über Sessions
     */
    syncThemeAcrossTabs() {
        // Storage Event Listener für Tab-Synchronisation
        window.addEventListener('storage', (e) => {
            if (e.key === 'salamico_theme' && e.newValue) {
                const newTheme = JSON.parse(e.newValue);
                if (newTheme !== this.currentTheme) {
                    this.setTheme(newTheme);
                    Utils.showToast('Theme über Tabs synchronisiert', 'info');
                }
            }
        });
    },

    /**
     * Theme Vorschau (temporär ohne Speichern)
     * @param {string} themeName - Theme für Vorschau
     */
    previewTheme(themeName) {
        if (!this.themes[themeName]) return;
        
        const originalTheme = this.currentTheme;
        
        // Theme temporär setzen
        const theme = this.themes[themeName];
        Object.entries(theme).forEach(([property, value]) => {
            document.documentElement.style.setProperty(property, value);
        });
        
        document.body.setAttribute('data-theme', themeName);
        
        // Nach 3 Sekunden zurücksetzen
        setTimeout(() => {
            this.setTheme(originalTheme);
            Utils.showToast('Vorschau beendet', 'info');
        }, 3000);
        
        Utils.showToast(`Vorschau: ${themeName} Theme`, 'info');
    },

    /**
     * Alle verfügbaren Themes auflisten
     * @returns {Array} Liste der Theme-Namen
     */
    getAvailableThemes() {
        return Object.keys(this.themes);
    },

    /**
     * Aktuelles Theme Info
     * @returns {Object} Theme-Informationen
     */
    getCurrentThemeInfo() {
        return {
            name: this.currentTheme,
            colors: { ...this.themes[this.currentTheme] },
            isDark: this.currentTheme === 'dark',
            isCustom: !['light', 'dark', 'salamico', 'contrast'].includes(this.currentTheme)
        };
    },

    /**
     * Theme-spezifische CSS-Klassen verwalten
     */
    updateThemeClasses() {
        const body = document.body;
        
        // Alle Theme-Klassen entfernen
        body.classList.remove('theme-light', 'theme-dark', 'theme-salamico', 'theme-contrast');
        
        // Aktuelle Theme-Klasse hinzufügen
        body.classList.add(`theme-${this.currentTheme}`);
    },

    /**
     * Cleanup - Theme Manager deaktivieren
     */
    destroy() {
        if (this.toggleButton) {
            this.toggleButton.remove();
            this.toggleButton = null;
        }
        
        // Event Listeners entfernen
        window.removeEventListener('storage', this.syncThemeAcrossTabs);
        
        // Zurück zu Standard-Theme
        this.setTheme('light');
        
        console.log('🎨 Theme Manager deaktiviert');
    },

    /**
     * Debug-Informationen
     */
    debug() {
        return {
            currentTheme: this.currentTheme,
            availableThemes: this.getAvailableThemes(),
            savedTheme: Utils.loadFromStorage('theme'),
            systemPrefersDark: window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches,
            currentColors: this.themes[this.currentTheme]
        };
    }
};

// Event Listener für Theme Change
document.addEventListener('themechange', (e) => {
    console.log('🎨 Theme Change Event:', e.detail);
});

// Accessibility Features beim Laden
document.addEventListener('DOMContentLoaded', () => {
    ThemeManager.detectHighContrastMode();
    ThemeManager.respectReducedMotion();
    ThemeManager.syncThemeAcrossTabs();
});