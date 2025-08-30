// PWA App Class
class PizzaToolkitApp {
    constructor() {
        this.isOnline = navigator.onLine;
        this.installPrompt = null;
        this.init();
    }

    init() {
        this.registerServiceWorker();
        this.setupEventListeners();
        this.checkConnectivity();
        this.setupPWAInstall();
    }

    async registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('/sw.js');
                console.log('Service Worker registered:', registration);
            } catch (error) {
                console.log('Service Worker registration failed:', error);
            }
        }
    }

    setupEventListeners() {
        // Network status
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.showToast('Online', 'success');
        });

        window.addEventListener('offline', () => {
            this.isOnline = false;
            this.showToast('Offline - Cached-Inhalte verfügbar', 'warning');
        });

        // Touch feedback for cards
        document.querySelectorAll('.card').forEach(card => {
            card.addEventListener('touchstart', function() {
                this.style.transform = 'translateY(-2px) scale(0.98)';
            });

            card.addEventListener('touchend', function() {
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
            });
        });
    }

    setupPWAInstall() {
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.installPrompt = e;
            console.log('PWA install available');
        });
    }

    showToast(message, type = 'info') {
        const colors = {
            info: '#17a2b8',
            success: '#28a745',
            warning: '#ffc107',
            error: '#dc3545'
        };

        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: ${colors[type]};
            color: white;
            padding: 12px 24px;
            border-radius: 25px;
            font-weight: 600;
            z-index: 1000;
            animation: slideUp 0.3s ease;
        `;
        
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }

    checkConnectivity() {
        if (!this.isOnline) {
            this.showToast('Offline - Cached-Inhalte verfügbar', 'warning');
        }
    }
}

// Navigation System
const routes = {
    'teigrechner': { title: 'Pizza-Teigrechner', url: 'teigrechner/', ready: true },
    'mehl-uebersicht': { title: 'Mehl-Übersicht', url: 'mehl-uebersicht/', ready: true },
    'equipment': { title: 'Equipment', url: 'equipment/', ready: false },
    'zutaten': { title: 'Zutaten', url: 'zutaten/', ready: false },
    'quiz': { title: 'Pizza-Quiz', url: 'quiz/', ready: true },
    'blog': { title: 'Pizza-Wissen', url: 'https://salamico.de', external: true }
};

function navigateTo(section) {
    const route = routes[section];
    
    if (!route) return;

    if (route.external) {
        window.open(route.url, '_blank');
        return;
    }

    if (!route.ready) {
        window.pizzaApp.showToast(`${route.title} kommt bald... 🔧`, 'warning');
        return;
    }

    // Navigate to page
    window.location.href = route.url;
}

// App Initialization
document.addEventListener('DOMContentLoaded', function() {
    window.pizzaApp = new PizzaToolkitApp();
    
    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideUp {
            from { transform: translateX(-50%) translateY(100%); opacity: 0; }
            to { transform: translateX(-50%) translateY(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
});