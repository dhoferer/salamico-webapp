// Quiz State Variables
let currentQuestion = 0;
let answers = {};
let selectedAnswer = null;
let answerCounts = { A: 0, B: 0, C: 0, D: 0, E: 0 };

// Simple logging function
function logEvent(category, action, name) {
    console.log('Event: ' + category + ' - ' + action + ' - ' + name);
}

// Navigation function placeholder
function navigateTo(page) {
    console.log('Navigate to: ' + page);
    // Hier würden Sie Ihre Navigation-Logik implementieren
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
    nextBtn.classList.add('enabled');
    
    logEvent('Quiz', 'Answer_Selected', 'Q' + (currentQuestion + 1) + '_' + value);
}

function nextQuestion() {
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
        // Disable next button
        document.getElementById('nextBtn').classList.remove('enabled');
    } else {
        showNewsletter();
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
        div.innerHTML = '<span class="answer-label">' + label + '</span>' + answer.text;
        
        // Add click event
        div.addEventListener('click', function() {
            selectAnswer(answer.value);
        });
        
        container.appendChild(div);
    }
    
    logEvent('Quiz', 'Question_Viewed', 'Q' + (currentQuestion + 1));
}

function updateProgress() {
    const progress = ((currentQuestion + 1) / questions.length) * 100;
    document.getElementById('progressFill').style.width = progress + '%';
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

    document.getElementById('quizContent').style.display = 'none';
    document.getElementById('newsletter').classList.add('show');
    
    // Set up the Mailchimp form handler
    const form = document.getElementById('mc-embedded-subscribe-form');
    if (form) {
        form.addEventListener('submit', handleNewsletterSubmit);
    }
    
    logEvent('Quiz', 'Completed', window.quizResult.title);
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
    
    document.getElementById('newsletter').classList.remove('show');
    document.getElementById('result').classList.add('show');
    
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

function restartQuiz() {
    console.log('Quiz restarted');
    
    currentQuestion = 0;
    answers = {};
    answerCounts = { A: 0, B: 0, C: 0, D: 0, E: 0 };
    selectedAnswer = null;
    window.quizResult = null;
    
    document.getElementById('quizContent').style.display = 'block';
    document.getElementById('newsletter').classList.remove('show');
    document.getElementById('result').classList.remove('show');
    
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
    document.getElementById('nextBtn').classList.remove('enabled');
    
    logEvent('Quiz', 'Restarted', 'user_action');
}

// Initialize Quiz
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing quiz...');
    
    try {
        // Setup event listeners
        document.getElementById('nextBtn').addEventListener('click', nextQuestion);
        document.getElementById('skipLink').addEventListener('click', skipNewsletter);
        document.getElementById('restartBtn').addEventListener('click', restartQuiz);
        
        // Start quiz
        showQuestion();
        updateProgress();
        
        logEvent('Quiz', 'Started', 'Pizza-Typ-Quiz');
        console.log('Quiz initialized successfully!');
        
    } catch (error) {
        console.error('Quiz initialization error:', error);
    }
});

// Add CSS for loading spinner and messages
const loadingCSS = `
.spinner-small {
    display: inline-block;
    width: 12px;
    height: 12px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top: 2px solid white;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-right: 8px;
}

.form-message {
    padding: 12px 15px;
    border-radius: 8px;
    margin-bottom: 20px;
    font-weight: 600;
    text-align: center;
}

.form-message.error {
    background-color: #fee;
    border: 1px solid #dc3545;
    color: #dc3545;
}

.form-message.success {
    background-color: #efe;
    border: 1px solid #28a745;
    color: #28a745;
}
`;

// Inject the CSS
const styleSheet = document.createElement('style');
styleSheet.textContent = loadingCSS;
document.head.appendChild(styleSheet);