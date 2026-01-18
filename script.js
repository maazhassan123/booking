// ===== DOM Elements =====
const bookingForm = document.getElementById('bookingForm');
const successModal = document.getElementById('successModal');
const bookingSummary = document.getElementById('bookingSummary');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.querySelector('.nav-links');
const timeSelect = document.getElementById('time');
const finalRateEl = document.getElementById('finalRate');

// ===== State =====
let currentStep = 1;
let selectedDuration = 0;
let timePreference = '';

const RATES = {
    '10': 20,
    '15': 30,
    '30': 50
};

const TIME_SLOTS = {
    day: ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'],
    night: ['06:00 PM', '07:00 PM', '08:00 PM', '09:00 PM', '10:00 PM']
};

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
    initializeDateInput();
    initializeMobileMenu();
    initializeSmoothScroll();
    initializeValidationListeners();
    setupDurationListeners();
});

// Set Min Date
function initializeDateInput() {
    const dateInput = document.getElementById('date');
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
}

// Mobile Menu
function initializeMobileMenu() {
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}

function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
}

// Update Rate and Time Slots on Selection
function setupDurationListeners() {
    // Duration Logic
    document.querySelectorAll('input[name="duration"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            selectedDuration = e.target.value;
            updateRateDisplay();
        });
    });

    // Time Preference Logic
    document.querySelectorAll('input[name="timePreference"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            timePreference = e.target.value;
            updateTimeSlots();
        });
    });
}

function updateRateDisplay() {
    const rate = RATES[selectedDuration] || 0;
    finalRateEl.textContent = `$${rate}.00`;
}

function updateTimeSlots() {
    timeSelect.innerHTML = '<option value="">Select a time slot</option>';
    if (timePreference && TIME_SLOTS[timePreference]) {
        TIME_SLOTS[timePreference].forEach(slot => {
            const option = document.createElement('option');
            option.value = slot;
            option.textContent = slot;
            timeSelect.appendChild(option);
        });
    }
}

// Step Navigation
function nextStep(step) {
    if (!validateStep(step)) return;

    document.getElementById(`step${step}`).classList.remove('active');
    document.getElementById(`step${step + 1}`).classList.add('active');
    updateProgress(step + 1);
    currentStep = step + 1;
}

function prevStep(step) {
    document.getElementById(`step${step}`).classList.remove('active');
    document.getElementById(`step${step - 1}`).classList.add('active');
    updateProgress(step - 1);
    currentStep = step - 1;
}

function updateProgress(step) {
    document.querySelectorAll('.progress-step').forEach((el, index) => {
        if (index + 1 < step) {
            el.classList.add('completed');
            el.classList.remove('active');
        } else if (index + 1 === step) {
            el.classList.add('active');
            el.classList.remove('completed');
        } else {
            el.classList.remove('active', 'completed');
        }
    });
}

// Validation
function validateStep(step) {
    let isValid = true;
    if (step === 1) {
        const required = ['firstName', 'lastName', 'email', 'phone'];
        required.forEach(id => {
            const el = document.getElementById(id);
            if (!el.value.trim()) {
                el.style.borderColor = 'var(--warning)';
                isValid = false;
            } else {
                el.style.borderColor = '#e2e8f0';
            }
        });
    } else if (step === 2) {
        if (!selectedDuration) {
            alert('Please select a session duration.');
            isValid = false;
        } else if (!timePreference) {
            alert('Please select a time preference (Day or Night).');
            isValid = false;
        }
    }
    return isValid;
}

function initializeValidationListeners() {
    // Simple remove error style on input
    document.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', () => {
            input.style.borderColor = '#e2e8f0';
        });
    });
}

// Form Submission
bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(bookingForm);
    const date = formData.get('date');
    const time = formData.get('time');

    if (!date || !time) {
        alert('Please select date and time.');
        return;
    }

    const summaryHTML = `
        <p><strong>Name:</strong> ${formData.get('firstName')} ${formData.get('lastName')}</p>
        <p><strong>Email:</strong> ${formData.get('email')}</p>
        <p><strong>Session:</strong> ${selectedDuration} Minutes ($${RATES[selectedDuration]})</p>
        <p><strong>Time:</strong> ${date} at ${time}</p>
    `;

    bookingSummary.innerHTML = summaryHTML;
    successModal.classList.add('active');
});

function closeModal() {
    successModal.classList.remove('active');
    // Optional: Reset form
    window.location.reload();
}
