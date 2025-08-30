/**
 * Email-Capture Modul für Newsletter-Anmeldung
 * Integriert sich in das Quiz für Lead-Generierung
 */

const EmailCapture = {
    isEnabled: false,
    apiEndpoint: '/api/newsletter-signup',
    modalElement: null,
    isShown: false,

    /**
     * Email-Capture aktivieren
     * @param {Object} config - Konfiguration
     */
    enable(config = {}) {
        this.isEnabled = true;
        this.apiEndpoint = config.apiEndpoint || this.apiEndpoint;
        this.createEmailModal();
        console.log('📧 Email Capture aktiviert');
    },

    /**
     * Email-Modal erstellen
     */
    createEmailModal() {
        const modalHTML = `
            <div id="emailModal" class="email-modal" style="display: none;" role="dialog" aria-labelledby="emailModalTitle" aria-describedby="emailModalDesc">
                <div class="email-modal-overlay" onclick="EmailCapture.closeModal()"></div>
                <div class="email-modal-content">
                    <div class="email-modal-header">
                        <h3 id="emailModalTitle">🍕 Bleib auf dem Laufenden!</h3>
                        <button class="modal-close" onclick="EmailCapture.closeModal()" aria-label="Modal schließen">×</button>
                    </div>
                    
                    <div class="email-modal-body">
                        <p id="emailModalDesc">Erhalte die besten Pizza-Tipps, exklusive Rezepte und neue Mehl-Empfehlungen direkt in dein Postfach.</p>
                        
                        <div class="email-benefits">
                            <div class="benefit-item">
                                <span class="benefit-icon">📜</span>
                                <span>Exklusive Rezepte</span>
                            </div>
                            <div class="benefit-item">
                                <span class="benefit-icon">🌾</span>
                                <span>Neue Mehl-Empfehlungen</span>
                            </div>
                            <div class="benefit-item">
                                <span class="benefit-icon">🎯</span>
                                <span>Persönliche Tipps</span>
                            </div>
                        </div>
                        
                        <form id="emailForm" class="email-form">
                            <div class="input-group">
                                <input 
                                    type="email" 
                                    id="userEmail" 
                                    name="email"
                                    placeholder="deine@email.de" 
                                    required
                                    aria-describedby="emailHelp"
                                    autocomplete="email">
                                <button type="submit" class="btn btn-primary">
                                    <span class="btn-text">Anmelden</span>
                                    <span class="btn-loading" style="display: none;">⏳</span>
                                </button>
                            </div>
                            <small id="emailHelp" class="email-help">
                                Keine Sorge, wir spammen nicht. Abmeldung jederzeit möglich.
                            </small>
                        </form>
                        
                        <div class="email-success" id="emailSuccess" style="display: none;">
                            <div class="success-icon">✅</div>
                            <h4>Perfekt!</h4>
                            <p>Du erhältst in Kürze eine Bestätigungs-Email. Vielen Dank! 🎉</p>
                        </div>
                        
                        <div class="email-error" id="emailError" style="display: none;">
                            <div class="error-icon">⚠️</div>
                            <p id="errorMessage">Oops, etwas ist schiefgelaufen. Bitte versuche es erneut.</p>
                        </div>
                    </div>
                    
                    <div class="email-modal-footer">
                        <button class="btn-text-only" onclick="EmailCapture.closeModal()">
                            Später erinnern
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.modalElement = document.getElementById('emailModal');
        this.addModalStyles();
        this.attachEmailFormListener();
    },

    /**
     * Modal-Styles hinzufügen
     */
    addModalStyles() {
        const styles = `
            <style id="emailModalStyles">
            .email-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px;
            }
            
            .email-modal-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.8);
                backdrop-filter: blur(4px);
            }
            
            .email-modal-content {
                background: white;
                border-radius: 20px;
                max-width: 500px;
                width: 100%;
                max-height: 90vh;
                overflow-y: auto;
                position: relative;
                z-index: 1;
                animation: modalSlideIn 0.4s ease-out;
                box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            }
            
            .email-modal-header {
                padding: 30px 30px 0;
                text-align: center;
                position: relative;
            }
            
            .email-modal-header h3 {
                font-size: 1.5rem;
                color: #333;
                margin: 0;
                font-weight: 600;
            }
            
            .modal-close {
                position: absolute;
                top: -10px;
                right: 10px;
                background: none;
                border: none;
                font-size: 28px;
                cursor: pointer;
                color: #999;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s ease;
            }
            
            .modal-close:hover {
                background: #f5f5f5;
                color: #333;
                transform: scale(1.1);
            }
            
            .email-modal-body {
                padding: 20px 30px;
            }
            
            .email-modal-body p {
                text-align: center;
                color: #666;
                margin-bottom: 25px;
                line-height: 1.5;
            }
            
            .email-benefits {
                display: grid;
                gap: 15px;
                margin-bottom: 25px;
                background: #f8f9fa;
                padding: 20px;
                border-radius: 12px;
            }
            
            .benefit-item {
                display: flex;
                align-items: center;
                gap: 12px;
                font-size: 0.95rem;
                color: #555;
            }
            
            .benefit-icon {
                font-size: 1.2rem;
                width: 24px;
                text-align: center;
            }
            
            .email-form {
                margin-bottom: 20px;
            }
            
            .input-group {
                display: flex;
                gap: 10px;
                margin-bottom: 8px;
            }
            
            .input-group input {
                flex: 1;
                padding: 14px 16px;
                border: 2px solid #e9ecef;
                border-radius: 12px;
                font-size: 16px;
                transition: border-color 0.2s ease;
            }
            
            .input-group input:focus {
                outline: none;
                border-color: var(--primary-color, #ff6b35);
                box-shadow: 0 0 0 3px rgba(255,107,53,0.1);
            }
            
            .input-group input:invalid {
                border-color: #dc3545;
            }
            
            .btn-primary {
                background: linear-gradient(135deg, var(--primary-color, #ff6b35), var(--secondary-color, #f7931e));
                color: white;
                border: none;
                padding: 14px 20px;
                border-radius: 12px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
                display: flex;
                align-items: center;
                gap: 8px;
                min-width: 110px;
                justify-content: center;
            }
            
            .btn-primary:hover {
                transform: translateY(-1px);
                box-shadow: 0 5px 15px rgba(255,107,53,0.4);
            }
            
            .btn-primary:disabled {
                opacity: 0.7;
                cursor: not-allowed;
                transform: none;
            }
            
            .email-help {
                color: #888;
                font-size: 0.85rem;
                text-align: center;
                display: block;
            }
            
            .email-success, .email-error {
                text-align: center;
                padding: 20px;
                border-radius: 12px;
                margin-bottom: 15px;
            }
            
            .email-success {
                background: linear-gradient(135deg, #d4edda, #c3e6cb);
                color: #155724;
            }
            
            .email-error {
                background: linear-gradient(135deg, #f8d7da, #f5c6cb);
                color: #721c24;
            }
            
            .success-icon, .error-icon {
                font-size: 2rem;
                margin-bottom: 10px;
                display: block;
            }
            
            .email-success h4 {
                margin: 10px 0;
                font-size: 1.2rem;
            }
            
            .email-modal-footer {
                padding: 0 30px 25px;
                text-align: center;
            }
            
            .btn-text-only {
                background: none;
                border: none;
                color: #888;
                cursor: pointer;
                font-size: 0.9rem;
                text-decoration: underline;
                transition: color 0.2s ease;
            }
            
            .btn-text-only:hover {
                color: #555;
            }
            
            @keyframes modalSlideIn {
                from {
                    opacity: 0;
                    transform: translateY(-30px) scale(0.95);
                }
                to {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }
            
            /* Mobile Responsive */
            @media (max-width: 768px) {
                .email-modal {
                    padding: 15px;
                }
                
                .email-modal-content {
                    max-width: 100%;
                }
                
                .email-modal-header,
                .email-modal-body,
                .email-modal-footer {
                    padding-left: 20px;
                    padding-right: 20px;
                }
                
                .input-group {
                    flex-direction: column;
                }
                
                .btn-primary {
                    width: 100%;
                }
                
                .email-benefits {
                    padding: 15px;
                }
            }
            
            /* Dark Theme Support */
            [data-theme="dark"] .email-modal-content {
                background: #2d2d2d;
                color: #fff;
            }
            
            [data-theme="dark"] .email-modal-header h3 {
                color: #fff;
            }
            
            [data-theme="dark"] .input-group input {
                background: #1a1a1a;
                border-color: #444;
                color: #fff;
            }
            
            [data-theme="dark"] .email-benefits {
                background: #1a1a1a;
            }
            </style>
        `;
        
        document.head.insertAdjacentHTML('beforeend', styles);
    },

    /**
     * Email-Form Listener
     */
    attachEmailFormListener() {
        const form = document.getElementById('emailForm');
        const emailInput = document.getElementById('userEmail');
        
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = emailInput.value.trim();
            await this.submitEmail(email);
        });

        // Real-time Validierung
        emailInput.addEventListener('input', (e) => {
            const email = e.target.value;
            const isValid = Utils.isValidEmail(email);
            
            if (email.length > 0) {
                e.target.style.borderColor = isValid ? '#28a745' : '#dc3545';
            } else {
                e.target.style.borderColor = '#e9ecef';
            }
        });

        // Escape Key Handler
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isShown) {
                this.closeModal();
            }
        });
    },

    /**
     * Email an Server senden
     * @param {string} email - Email-Adresse
     */
    async submitEmail(email) {
        if (!Utils.isValidEmail(email)) {
            this.showError('Bitte gib eine gültige Email-Adresse ein.');
            return;
        }

        const submitButton = document.querySelector('#emailForm button[type="submit"]');
        const btnText = submitButton.querySelector('.btn-text');
        const btnLoading = submitButton.querySelector('.btn-loading');
        
        // Loading State
        submitButton.disabled = true;
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline';

        try {
            const response = await fetch(this.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    source: 'mehl-finder-quiz',
                    timestamp: new Date().toISOString(),
                    quiz_answers: Quiz.answers,
                    user_agent: navigator.userAgent,
                    referrer: document.referrer
                })
            });

            if (response.ok) {
                const result = await response.json();
                this.showSuccess();
                
                // Analytics
                if (typeof Analytics !== 'undefined') {
                    Analytics.trackEmailSignup(email, 'mehl-finder-quiz');
                }
                
                // LocalStorage markieren
                Utils.saveToStorage('email_subscribed', true);
                Utils.saveToStorage('subscription_date', new Date().toISOString());
                
                // Auto-Close nach 3 Sekunden
                setTimeout(() => {
                    this.closeModal();
                }, 3000);
                
            } else {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Server Error: ${response.status}`);
            }
        } catch (error) {
            console.error('Email submission error:', error);
            this.showError(error.message || 'Fehler bei der Anmeldung. Bitte versuche es später erneut.');
            
            // Analytics
            if (typeof Analytics !== 'undefined') {
                Analytics.trackError(error.message, 'email_submission');
            }
        } finally {
            // Loading State zurücksetzen
            submitButton.disabled = false;
            btnText.style.display = 'inline';
            btnLoading.style.display = 'none';
        }
    },

    /**
     * Erfolg anzeigen
     */
    showSuccess() {
        document.getElementById('emailForm').style.display = 'none';
        document.getElementById('emailSuccess').style.display = 'block';
        document.getElementById('emailError').style.display = 'none';
    },

    /**
     * Fehler anzeigen
     * @param {string} message - Fehlermeldung
     */
    showError(message) {
        document.getElementById('emailError').style.display = 'block';
        document.getElementById('errorMessage').textContent = message;
        document.getElementById('emailSuccess').style.display = 'none';
        
        // Form wieder anzeigen falls versteckt
        document.getElementById('emailForm').style.display = 'block';
    },

    /**
     * Modal anzeigen (nach Quiz-Abschluss)
     * @param {number} delay - Verzögerung in ms
     */
    showModal(delay = 2000) {
        if (!this.isEnabled) return;
        if (Utils.loadFromStorage('email_subscribed')) return;
        if (this.isShown) return;

        setTimeout(() => {
            this.modalElement.style.display = 'flex';
            this.isShown = true;
            
            // Focus für Accessibility
            const emailInput = document.getElementById('userEmail');
            if (emailInput) {
                setTimeout(() => emailInput.focus(), 100);
            }
            
            // Analytics
            if (typeof Analytics !== 'undefined') {
                Analytics.sendEvent('email_modal_shown', {
                    'trigger': 'quiz_completion',
                    'delay': delay
                });
            }
        }, delay);
    },

    /**
     * Modal schließen
     */
    closeModal() {
        if (!this.modalElement) return;
        
        this.modalElement.style.display = 'none';
        this.isShown = false;
        
        // Form zurücksetzen
        const form = document.getElementById('emailForm');
        const emailInput = document.getElementById('userEmail');
        
        if (form) form.reset();
        if (emailInput) emailInput.style.borderColor = '#e9ecef';
        
        // Versteckte Elemente zurücksetzen
        document.getElementById('emailForm').style.display = 'block';
        document.getElementById('emailSuccess').style.display = 'none';
        document.getElementById('emailError').style.display = 'none';
        
        // "Später erinnern" - Zeige in 24h wieder
        Utils.saveToStorage('email_modal_dismissed', new Date().toISOString());
        
        // Analytics
        if (typeof Analytics !== 'undefined') {
            Analytics.sendEvent('email_modal_closed', {
                'action': 'user_dismissed'
            });
        }
    },

    /**
     * Prüfen ob Modal gezeigt werden soll
     * @returns {boolean} Soll gezeigt werden
     */
    shouldShowModal() {
        if (!this.isEnabled) return false;
        if (Utils.loadFromStorage('email_subscribed')) return false;
        
        const dismissed = Utils.loadFromStorage('email_modal_dismissed');
        if (dismissed) {
            const dismissedDate = new Date(dismissed);
            const now = new Date();
            const hoursSinceDismissed = (now - dismissedDate) / (1000 * 60 * 60);
            
            // Zeige erst nach 24h wieder
            if (hoursSinceDismissed < 24) return false;
        }
        
        return true;
    },

    /**
     * Exit-Intent Detection
     */
    enableExitIntent() {
        let exitIntentShown = false;
        
        document.addEventListener('mouseleave', (e) => {
            if (e.clientY <= 0 && !exitIntentShown && this.shouldShowModal()) {
                this.showModal(0);
                exitIntentShown = true;
            }
        });
    },

    /**
     * Cleanup - Modal und Styles entfernen
     */
    destroy() {
        if (this.modalElement) {
            this.modalElement.remove();
            this.modalElement = null;
        }
        
        const styles = document.getElementById('emailModalStyles');
        if (styles) {
            styles.remove();
        }
        
        this.isEnabled = false;
        this.isShown = false;
    }
};