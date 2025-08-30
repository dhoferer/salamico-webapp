// Quiz State Variables
let currentQuestion = 0;
let answers = {};
let selectedAnswer = null;
let answerCounts = { A: 0, B: 0, C: 0, D: 0, E: 0 };

// Simple logging function
function logEvent(category, action, name) {
    console.log('Event: ' + category + ' - ' + action + ' - ' + name);
    
    // Matomo tracking
    if (typeof _paq !== 'undefined') {
        _paq.push(['trackEvent', category, action, name]);
    }
}

// Quiz Functions
function selectAnswer(value) {
    console.log('Selecting answer: ' + value);
    
    selectedAnswer = value;
    
    // Remove all selected classes
    const options = document.querySelectorAll('.answer-option');
    for (let i = 0; i < options.length; i++) {
        options[i].classList.remove('selected');
    }
    
    // Add selected class to clicked option
    const clickedOption = document.querySelector('[data-value="' + value + '"]');
    if (clickedOption) {
        clickedOption.classList.add('selected');
    }
    
    // Enable next button
    const nextBtn = document.getElementById('nextBtn');
    nextBtn.disabled = false;
    
    logEvent('Quiz', 'Answer_Selected', 'Q' + (currentQuestion + 1) + '_' + value);
}

function nextQuestionInternal() {
    console.log('Next question clicked, selected: ' + selectedAnswer);
    
    if (!selectedAnswer) {
        console.log('No answer selected');
        return;
    }

    // Count the answer
    answerCounts[selectedAnswer]++;
    answers[currentQuestion] = selectedAnswer;
    
    console.log('Answer counts: ', answerCounts);
    
    selectedAnswer = null;
    currentQuestion++;

    if (currentQuestion < questions.length) {
        showQuestion();
        updateProgress();
        updateNavigation();
        // Disable next button
        document.getElementById('nextBtn').disabled = true;
    } else {
        showNewsletter();
    }
}

function previousQuestionInternal() {
    if (currentQuestion === 0) return;
    
    currentQuestion--;
    selectedAnswer = answers[currentQuestion] || null;
    
    showQuestion();
    updateProgress();
    updateNavigation();
    
    // Re-select the previous answer if it exists
    if (selectedAnswer) {
        const option = document.querySelector('[data-value="' + selectedAnswer + '"]');
        if (option) {
            option.classList.add('selected');
            document.getElementById('nextBtn').disabled = false;
        }
    }
}

function showQuestion() {
    console.log('Showing question: ' + currentQuestion);
    
    const question = questions[currentQuestion];
    
    document.getElementById('questionText').textContent = question.question;
    document.getElementById('questionCounter').textContent = 'Frage ' + (currentQuestion + 1) + ' von ' + questions.length;

    const container = document.getElementById('answersContainer');
    container.innerHTML = '';

    for (let i = 0; i < question.answers.length; i++) {
        const answer = question.answers[i];
        const div = document.createElement('div');
        div.className = 'answer-option';
        div.setAttribute('data-value', answer.value);
        
        const label = String.fromCharCode(65 + i); // A, B, C, D, E
        div.innerHTML = `
            <div class="answer-content">
                <span class="answer-label">${label}</span>
                <div class="answer-text">${answer.text}</div>
            </div>
        `;
        
        // Add click event
        div.addEventListener('click', function() {
            selectAnswer(answer.value);
        });
        
        container.appendChild(div);
    }
    
    // Show quiz content section
    showSection('quizContent');
    
    logEvent('Quiz', 'Question_Viewed', 'Q' + (currentQuestion + 1));
}

function updateProgress() {
    const progress = ((currentQuestion + 1) / questions.length) * 100;
    document.getElementById('progressFill').style.width = progress + '%';
}

function updateNavigation() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const restartBtn = document.getElementById('restartBtn');
    
    prevBtn.style.display = currentQuestion === 0 ? 'none' : 'inline-flex';
    nextBtn.style.display = 'inline-flex';
    nextBtn.disabled = !selectedAnswer;
    nextBtn.textContent = currentQuestion === questions.length - 1 ? 'Ergebnis anzeigen 🎯' : 'Nächste Frage →';
    restartBtn.style.display = 'none';
}

function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.quiz-section');
    sections.forEach(section => section.classList.remove('active'));
    
    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }
}

function showNewsletter() {
    console.log('Quiz completed, showing newsletter');
    
    // Find most common answer
    let maxCount = 0;
    let mostPicked = 'A';
    
    for (let key in answerCounts) {
        if (answerCounts[key] > maxCount) {
            maxCount = answerCounts[key];
            mostPicked = key;
        }
    }
    
    console.log('Most picked answer: ' + mostPicked);
    window.quizResult = pizzaTypes[mostPicked];

    showSection('newsletter');
    updateNavigationForNewsletter();
    
    // Set up the Mailchimp form handler
    const form = document.getElementById('mc-embedded-subscribe-form');
    if (form) {
        // Remove existing event listeners
        form.removeEventListener('submit', handleNewsletterSubmit);
        form.addEventListener('submit', handleNewsletterSubmit);
    }
    
    logEvent('Quiz', 'Completed', window.quizResult.title);
}

function updateNavigationForNewsletter() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const restartBtn = document.getElementById('restartBtn');
    
    prevBtn.style.display = 'none';
    nextBtn.style.display = 'none';
    restartBtn.style.display = 'none';
}

// Newsletter handling with Mailchimp integration
function handleNewsletterSubmit(event) {
    event.preventDefault();
    console.log('Newsletter form submitted');
    
    const email = document.getElementById('mce-EMAIL').value;
    const firstName = document.getElementById('mce-FNAME').value;
    
    if (!email) {
        showMessage('Bitte gib eine E-Mail-Adresse ein.', 'error');
        return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showMessage('Bitte gib eine gültige E-Mail-Adresse ein.', 'error');
        return;
    }

    logEvent('Newsletter', 'Signup_Attempted', 'quiz');
    
    // Add quiz result to form if available
    if (window.quizResult) {
        let quizResultField = document.querySelector('input[name="quiz_result"]');
        if (!quizResultField) {
            quizResultField = document.createElement('input');
            quizResultField.type = 'hidden';
            quizResultField.name = 'quiz_result';
            document.getElementById('mc-embedded-subscribe-form').appendChild(quizResultField);
        }
        quizResultField.value = window.quizResult.title;
    }
    
    // Show loading state
    showLoadingState(true);
    
    // Submit the form using Mailchimp's native handling
    submitMailchimpForm();
}

function submitMailchimpForm() {
    const form = document.getElementById('mc-embedded-subscribe-form');
    const formData = new FormData(form);
    
    // Submit to Mailchimp
    fetch(form.action, {
        method: 'POST',
        body: formData,
        mode: 'no-cors' // Required for Mailchimp
    }).then(() => {
        // Since we're in no-cors mode, we can't read the response
        // So we'll assume success after a delay
        setTimeout(() => {
            logEvent('Newsletter', 'Signup_Success', 'quiz');
            showMessage('Vielen Dank! Du erhältst eine Bestätigungs-E-Mail.', 'success');
            
            // Show result after successful signup
            setTimeout(() => {
                showResult();
            }, 2000);
        }, 1500);
    }).catch(error => {
        console.error('Submission error:', error);
        showMessage('Es gab einen Fehler. Bitte versuche es später erneut.', 'error');
        showLoadingState(false);
    });
}

function showMessage(message, type) {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.form-message');
    existingMessages.forEach(msg => msg.remove());
    
    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = 'form-message ' + type;
    messageDiv.textContent = message;
    
    // Insert before the form
    const form = document.getElementById('mc-embedded-subscribe-form');
    form.parentNode.insertBefore(messageDiv, form);
    
    // Auto-hide error messages after 5 seconds
    if (type === 'error') {
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 5000);
    }
}

function showLoadingState(isLoading) {
    const submitBtn = document.getElementById('mc-embedded-subscribe');
    
    if (isLoading) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-small"></span> Wird gesendet...';
        submitBtn.style.opacity = '0.7';
    } else {
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Ergebnis erhalten & Tipps abonnieren';
        submitBtn.style.opacity = '1';
    }
}

function skipNewsletter() {
    console.log('Newsletter skipped');
    logEvent('Newsletter', 'Skipped', 'quiz');
    showResult();
}

function showResult() {
    console.log('Showing result');
    
    showSection('result');
    updateNavigationForResult();
    
    const result = window.quizResult;
    document.getElementById('resultEmoji').textContent = result.emoji;
    document.getElementById('resultTitle').textContent = result.title;
    
    let description = '<p>' + result.description + '</p><br><strong>Was diese Pizza besonders macht:</strong><ul style="text-align: left; margin: 15px 0; padding-left: 20px;">';
    
    for (let i = 0; i < result.features.length; i++) {
        description += '<li style="margin-bottom: 8px;">' + result.features[i] + '</li>';
    }
    
    description += '</ul>';
    
    document.getElementById('resultDescription').innerHTML = description;
    
    logEvent('Quiz', 'Result_Shown', result.title);
}

function updateNavigationForResult() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const restartBtn = document.getElementById('restartBtn');
    
    prevBtn.style.display = 'none';
    nextBtn.style.display = 'none';
    restartBtn.style.display = 'inline-flex';
}

function restartQuizInternal() {
    console.log('Quiz restarted');
    
    currentQuestion = 0;
    answers = {};
    answerCounts = { A: 0, B: 0, C: 0, D: 0, E: 0 };
    selectedAnswer = null;
    window.quizResult = null;
    
    // Reset form
    const form = document.getElementById('mc-embedded-subscribe-form');
    if (form) {
        form.reset();
    }
    
    // Remove any existing messages
    const existingMessages = document.querySelectorAll('.form-message');
    existingMessages.forEach(msg => msg.remove());
    
    showQuestion();
    updateProgress();
    updateNavigation();
    
    logEvent('Quiz', 'Restarted', 'user_action');
}

// Global navigation functions for onclick handlers in HTML
window.nextQuestion = function() {
    const currentSection = document.querySelector('.quiz-section.active');
    if (currentSection && currentSection.id === 'quizContent') {
        nextQuestionInternal();
    }
}

window.previousQuestion = function() {
    previousQuestionInternal();
}

window.restartQuiz = function() {
    restartQuizInternal();
}

// Initialize Quiz
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing quiz...');
    
    try {
        // Setup event listeners
        document.getElementById('nextBtn').addEventListener('click', function() {
            const currentSection = document.querySelector('.quiz-section.active');
            if (currentSection && currentSection.id === 'quizContent') {
                nextQuestionInternal();
            }
        });
        
        document.getElementById('prevBtn').addEventListener('click', previousQuestionInternal);
        document.getElementById('restartBtn').addEventListener('click', restartQuizInternal);
        document.getElementById('skipLink').addEventListener('click', function(e) {
            e.preventDefault();
            skipNewsletter();
        });
        
        // Bottom Navigation Tracking
        document.querySelectorAll('.nav-item[data-track]').forEach(item => {
            item.addEventListener('click', function() {
                const trackingCode = this.getAttribute('data-track');
                logEvent('Navigation', 'Click', trackingCode);
            });
        });
        
        // Start quiz
        showQuestion();
        updateProgress();
        updateNavigation();
        
        logEvent('Quiz', 'Started', 'Pizza-Typ-Quiz');
        console.log('Quiz initialized successfully!');
        
    } catch (error) {
        console.error('Quiz initialization error:', error);
    }
});

// Utility function to handle keyboard navigation
document.addEventListener('keydown', function(event) {
    const currentSection = document.querySelector('.quiz-section.active');
    
    if (currentSection && currentSection.id === 'quizContent') {
        // Number keys 1-5 for answer selection
        if (event.key >= '1' && event.key <= '5') {
            const answerIndex = parseInt(event.key) - 1;
            const answers = document.querySelectorAll('.answer-option');
            if (answers[answerIndex]) {
                answers[answerIndex].click();
            }
        }
        
        // Enter key to proceed
        if (event.key === 'Enter' && selectedAnswer) {
            nextQuestionInternal();
        }
        
        // Arrow keys for navigation
        if (event.key === 'ArrowLeft' && currentQuestion > 0) {
            previousQuestionInternal();
        }
        if (event.key === 'ArrowRight' && selectedAnswer) {
            nextQuestionInternal();
        }
    }
});