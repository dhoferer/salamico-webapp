// Matomo Tracking Functions for Pizza-Toolkit PWA

class MatomoTracker {
    constructor() {
        this.isInitialized = false;
        this.queue = [];
        this.init();
    }

    init() {
        // Wait for Matomo to load
        this.waitForMatomo();
        this.setupEventTracking();
    }

    waitForMatomo() {
        const checkMatomo = () => {
            if (window._paq && typeof window._paq.push === 'function') {
                this.isInitialized = true;
                this.processQueue();
                console.log('Matomo initialized');
            } else {
                setTimeout(checkMatomo, 100);
            }
        };
        checkMatomo();
    }

    processQueue() {
        while (this.queue.length > 0) {
            const event = this.queue.shift();
            this.track(event.action, event.name, event.value, event.category);
        }
    }

    track(action, name = '', value = '', category = 'Pizza-Toolkit') {
        if (!this.isInitialized) {
            this.queue.push({ action, name, value, category });
            return;
        }

        try {
            _paq.push(['trackEvent', category, action, name, value]);
            console.log('Tracked:', category, action, name, value);
        } catch (error) {
            console.error('Matomo tracking error:', error);
        }
    }

    trackPageView(title, url = window.location.pathname) {
        if (!this.isInitialized) {
            setTimeout(() => this.trackPageView(title, url), 100);
            return;
        }

        try {
            _paq.push(['setDocumentTitle', title]);
            _paq.push(['setCustomUrl', url]);
            _paq.push(['trackPageView']);
            console.log('Page view tracked:', title, url);
        } catch (error) {
            console.error('Matomo page tracking error:', error);
        }
    }

    trackGoal(goalId, value = 0) {
        if (!this.isInitialized) return;
        
        try {
            _paq.push(['trackGoal', goalId, value]);
            console.log('Goal tracked:', goalId, value);
        } catch (error) {
            console.error('Matomo goal tracking error:', error);
        }
    }

    trackDownload(filename) {
        this.track('Download', filename, '', 'Files');
    }

    trackOutlink(url) {
        if (!this.isInitialized) return;
        
        try {
            _paq.push(['trackLink', url, 'link']);
        } catch (error) {
            console.error('Matomo outlink tracking error:', error);
        }
    }

    setupEventTracking() {
        document.addEventListener('DOMContentLoaded', () => {
            // Track all elements with data-track attribute
            document.querySelectorAll('[data-track]').forEach(element => {
                element.addEventListener('click', (e) => {
                    const trackingId = e.currentTarget.getAttribute('data-track');
                    this.track('Click', trackingId, '', 'Navigation');
                });
            });

            // Track external links
            document.querySelectorAll('a[href^="http"]').forEach(link => {
                link.addEventListener('click', (e) => {
                    const url = e.currentTarget.href;
                    if (!url.includes(window.location.hostname)) {
                        this.trackOutlink(url);
                    }
                });
            });
        });
    }

    // PWA specific tracking
    trackPWAInstall() {
        this.track('PWA', 'Install', '', 'App');
    }

    trackOfflineUsage() {
        this.track('PWA', 'Offline Usage', '', 'App');
    }

    trackCardInteraction(cardType) {
        this.track('Card Interaction', cardType, '', 'UI');
    }

    // Quiz specific tracking
    trackQuizStart() {
        this.track('Quiz', 'Started', '', 'Engagement');
    }

    trackQuizComplete(pizzaType) {
        this.track('Quiz', 'Completed', pizzaType, 'Engagement');
        this.trackGoal(1); // Goal ID 1 = Quiz completion
    }

    trackNewsletterSignup(source) {
        this.track('Newsletter', 'Signup', source, 'Conversion');
        this.trackGoal(2); // Goal ID 2 = Newsletter signup
    }

    // Calculator specific tracking
    trackCalculatorUsage(pizzaCount, gearTime) {
        this.track('Calculator', 'Used', `${pizzaCount}_pizzas_${gearTime}h`, 'Tools');
    }

    // Shop tracking
    trackProductClick(shop, productName) {
        this.track('Product Click', productName, shop, 'E-commerce');
    }

    trackShopVisit(shopName) {
        this.track('Shop Visit', shopName, '', 'E-commerce');
    }
}

// Initialize global tracker
window.matomoTracker = new MatomoTracker();

// Helper functions for easy tracking
function trackEvent(action, name = '', category = 'Pizza-Toolkit') {
    window.matomoTracker.track(action, name, '', category);
}

function trackPageView(title) {
    window.matomoTracker.trackPageView(title);
}

function trackGoal(goalId, value = 0) {
    window.matomoTracker.trackGoal(goalId, value);
}