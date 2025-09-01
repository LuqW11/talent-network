// Constants and configuration
const STORAGE_KEY = 'talent_agency_waitlist';
const SUBMIT_DELAY = 1500; // Mock submit delay
const MIN_SUBMIT_TIME = 500; // Minimum time between submits

// DOM elements
const form = document.getElementById('waitlist-form');
const step1 = document.getElementById('step-1');
const step2 = document.getElementById('step-2');
const step1Submit = document.getElementById('step-1-submit');
const step2Submit = document.getElementById('step-2-submit');
const errorSummary = document.getElementById('error-summary');
const errorList = document.getElementById('error-list');
const successBanner = document.getElementById('success-banner');
const formContainer = document.getElementById('form-container');
const editDetailsBtn = document.getElementById('edit-details');
const backToHomeBtn = document.getElementById('back-to-home');
const successActions = document.getElementById('success-actions');
const universityInput = document.getElementById('university');
const universityDropdown = document.getElementById('university-dropdown');

// UK Universities data
const UK_UNIVERSITIES = [
    'Aberystwyth University',
    'Anglia Ruskin University',
    'Aston University',
    'Bangor University',
    'Bath Spa University',
    'Birkbeck, University of London',
    'Birmingham City University',
    'Bournemouth University',
    'Bradford University',
    'Brighton University',
    'Bristol University',
    'Brunel University London',
    'Buckinghamshire New University',
    'Cambridge University',
    'Canterbury Christ Church University',
    'Cardiff Metropolitan University',
    'Cardiff University',
    'Central Saint Martins',
    'City, University of London',
    'Coventry University',
    'Cranfield University',
    'De Montfort University',
    'Derby University',
    'Durham University',
    'East Anglia University',
    'East London University',
    'Edge Hill University',
    'Edinburgh Napier University',
    'Edinburgh University',
    'Essex University',
    'Exeter University',
    'Falmouth University',
    'Glasgow Caledonian University',
    'Glasgow University',
    'Goldsmiths, University of London',
    'Greenwich University',
    'Hertfordshire University',
    'Huddersfield University',
    'Hull University',
    'Imperial College London',
    'Keele University',
    'Kent University',
    'Kings College London',
    'Kingston University',
    'Lancaster University',
    'Leeds Beckett University',
    'Leeds University',
    'Leicester University',
    'Lincoln University',
    'Liverpool Hope University',
    'Liverpool John Moores University',
    'Liverpool University',
    'London Business School',
    'London School of Economics',
    'London South Bank University',
    'Loughborough University',
    'Manchester Metropolitan University',
    'Manchester University',
    'Middlesex University',
    'Newcastle University',
    'Northumbria University',
    'Nottingham Trent University',
    'Nottingham University',
    'Open University',
    'Oxford Brookes University',
    'Oxford University',
    'Plymouth University',
    'Portsmouth University',
    'Queen Mary University of London',
    'Queens University Belfast',
    'Reading University',
    'Robert Gordon University',
    'Royal Holloway, University of London',
    'Salford University',
    'Sheffield Hallam University',
    'Sheffield University',
    'SOAS University of London',
    'Southampton University',
    'Staffordshire University',
    'Stirling University',
    'Strathclyde University',
    'Sunderland University',
    'Surrey University',
    'Sussex University',
    'Swansea University',
    'Teesside University',
    'UCL (University College London)',
    'Ulster University',
    'Warwick University',
    'West London University',
    'Westminster University',
    'York St John University',
    'York University'
];

// State management
let currentStep = 1;
let formData = {
    fullName: '',
    email: '',
    gdprConsent: false,
    university: '',
    graduationYear: '',
    roleInterest: [],
    linkedinUrl: '',
    portfolioUrl: '',
    timezone: '',
    timestamp: 0,
    utmParams: {}
};
let submitTimestamp = 0;
let selectedUniversityIndex = -1;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeForm();
    loadFromStorage();
    captureUrlParams();
    setupEventListeners();
    populateGraduationYears();
});

// Form initialization
function initializeForm() {
    // Set initial form state
    showStep(1);
    hideErrorSummary();
    hideSuccessMessage();
}

// Setup event listeners
function setupEventListeners() {
    if (!form || !editDetailsBtn || !backToHomeBtn) return;
    
    // Form submission
    form.addEventListener('submit', handleFormSubmit);
    
    // Real-time validation
    const inputs = form.querySelectorAll('input, select');
    inputs.forEach(input => {
        if (input.id !== 'university') {
            input.addEventListener('blur', () => validateField(input));
            input.addEventListener('input', () => clearFieldError(input));
        }
    });
    
    // Edit details button
    editDetailsBtn.addEventListener('click', showEditForm);
    
    // Back to home button
    backToHomeBtn.addEventListener('click', backToHome);
    
    // University search functionality
    setupUniversitySearch();
    
    // Auto-prefix URLs
    const urlInputs = form.querySelectorAll('input[type="url"]');
    urlInputs.forEach(input => {
        input.addEventListener('blur', () => autoPrefixUrl(input));
    });
}

// Populate graduation years (current year to +3 years)
function populateGraduationYears() {
    const select = document.getElementById('graduationYear');
    if (!select) return;
    
    const currentYear = new Date().getFullYear();
    
    for (let year = currentYear; year <= currentYear + 3; year++) {
        const option = document.createElement('option');
        option.value = year.toString();
        option.textContent = year.toString();
        select.appendChild(option);
    }
}

// Form submission handler
async function handleFormSubmit(event) {
    event.preventDefault();
    if (!form) return;
    
    const now = Date.now();
    if (now - submitTimestamp < MIN_SUBMIT_TIME) {
        return; // Prevent rapid submissions
    }
    submitTimestamp = now;
    
    // Check honeypot
    const honeypotField = form.querySelector('input[name="website"]');
    if (honeypotField && honeypotField.value) {
        return; // Bot detected
    }
    
    const isStep1 = currentStep === 1;
    const submitButton = isStep1 ? step1Submit : step2Submit;
    
    // Show loading state
    showLoadingState(submitButton, true);
    
    try {
        // Collect and validate form data
        collectFormData();
        const isValid = isStep1 ? validateStep1() : validateStep2();
        
        if (!isValid) {
            showLoadingState(submitButton, false);
            focusFirstError();
            return;
        }
        
        // Mock API call
        await mockSubmit();
        
        if (isStep1) {
            // Save to storage and proceed to step 2
            saveToStorage();
            showStep(2);
            scrollToTop();
        } else {
            // Complete the process
            saveToStorage();
            showSuccessMessage();
            scrollToTop();
        }
        
    } catch (error) {
        console.error('Form submission error:', error);
        showGlobalError('Something went wrong. Please try again.');
    } finally {
        showLoadingState(submitButton, false);
    }
}

// Collect form data
function collectFormData() {
    if (!form) return;
    
    const formDataObj = new FormData(form);
    
    // Get role interests
    const roleInterests = [];
    const roleCheckboxes = form.querySelectorAll('input[name="roleInterest"]:checked');
    roleCheckboxes.forEach(checkbox => {
        const checkboxEl = checkbox;
        roleInterests.push(checkboxEl.value);
    });
    
    formData = {
        fullName: (formDataObj.get('fullName') || '').toString(),
        email: (formDataObj.get('email') || '').toString(),
        gdprConsent: formDataObj.has('gdprConsent'),
        university: (formDataObj.get('university') || '').toString(),
        graduationYear: (formDataObj.get('graduationYear') || '').toString(),
        roleInterest: roleInterests,
        linkedinUrl: (formDataObj.get('linkedinUrl') || '').toString(),
        portfolioUrl: (formDataObj.get('portfolioUrl') || '').toString(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        timestamp: Date.now(),
        utmParams: {}
    };
    
    // Add UTM parameters if they exist
    const urlParams = new URLSearchParams(window.location.search);
    const utmParams = {};
    for (const [key, value] of urlParams.entries()) {
        if (key.startsWith('utm_')) {
            utmParams[key] = value;
        }
    }
    if (Object.keys(utmParams).length > 0) {
        formData.utmParams = utmParams;
    }
}

// Validation functions
function validateStep1() {
    const errors = [];
    
    if (!formData.fullName.trim()) {
        errors.push({ field: 'fullName', message: 'Full name is required' });
    }
    
    if (!formData.email.trim()) {
        errors.push({ field: 'email', message: 'Email is required' });
    } else if (!isValidEmail(formData.email)) {
        errors.push({ field: 'email', message: 'Please enter a valid email address' });
    }
    
    if (!formData.gdprConsent) {
        errors.push({ field: 'gdprConsent', message: 'GDPR consent is required' });
    }
    
    return showErrors(errors);
}

function validateStep2() {
    const errors = [];
    
    // LinkedIn URL validation
    if (formData.linkedinUrl && !isValidUrl(formData.linkedinUrl)) {
        errors.push({ field: 'linkedinUrl', message: 'Please enter a valid URL' });
    }
    
    // Portfolio URL validation
    if (formData.portfolioUrl && !isValidUrl(formData.portfolioUrl)) {
        errors.push({ field: 'portfolioUrl', message: 'Please enter a valid URL' });
    }
    
    return showErrors(errors);
}

// Field validation
function validateField(input) {
    if (!input) return;
    
    const fieldName = input.name;
    const value = input.value ? input.value.trim() : '';
    const errors = [];
    
    switch (fieldName) {
        case 'fullName':
            if (input.required && !value) {
                errors.push('Full name is required');
            }
            break;
        case 'email':
            if (input.required && !value) {
                errors.push('Email is required');
            } else if (value && !isValidEmail(value)) {
                errors.push('Please enter a valid email address');
            }
            break;
        case 'linkedinUrl':
        case 'portfolioUrl':
            if (value && !isValidUrl(value)) {
                errors.push('Please enter a valid URL');
            }
            break;
        case 'gdprConsent':
            if (input.required && !input.checked) {
                errors.push('GDPR consent is required');
            }
            break;
    }
    
    showFieldError(input, errors[0] || '');
}

// Utility functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidUrl(url) {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

function autoPrefixUrl(input) {
    if (!input || !input.value) return;
    
    const value = input.value.trim();
    if (value && !value.startsWith('http://') && !value.startsWith('https://')) {
        input.value = 'https://' + value;
    }
}

// UI management functions
function showStep(step) {
    if (!step1 || !step2) return;
    
    currentStep = step;
    
    if (step === 1) {
        step1.classList.add('active');
        step2.classList.remove('active');
    } else {
        step1.classList.remove('active');
        step2.classList.add('active');
    }
}

function showLoadingState(button, loading) {
    if (!button) return;
    
    const buttonText = button.querySelector('.button-text');
    const spinner = button.querySelector('.loading-spinner');
    
    if (loading) {
        button.disabled = true;
        if (buttonText) buttonText.classList.add('hidden');
        if (spinner) spinner.classList.remove('hidden');
    } else {
        button.disabled = false;
        if (buttonText) buttonText.classList.remove('hidden');
        if (spinner) spinner.classList.add('hidden');
    }
}

function showErrors(errors) {
    if (!form || !errorList || !errorSummary) return false;
    
    hideErrorSummary();
    
    // Clear all field errors first
    const allErrorDivs = form.querySelectorAll('.field-error');
    allErrorDivs.forEach(div => div.textContent = '');
    
    const allInputs = form.querySelectorAll('.field-input');
    allInputs.forEach(input => input.classList.remove('error'));
    
    if (errors.length === 0) {
        return true;
    }
    
    // Show field errors
    errors.forEach(error => {
        const fieldElement = form.querySelector(`[name="${error.field}"], #${error.field}`);
        if (fieldElement) {
            showFieldError(fieldElement, error.message);
        }
    });
    
    // Show error summary
    errorList.innerHTML = '';
    errors.forEach(error => {
        const li = document.createElement('li');
        li.textContent = error.message;
        errorList.appendChild(li);
    });
    
    errorSummary.classList.remove('hidden');
    return false;
}

function showFieldError(input, message) {
    if (!input) return;
    
    const errorDiv = document.getElementById(input.name + '-error') || 
                    document.getElementById(input.id + '-error');
    
    if (errorDiv) {
        errorDiv.textContent = message;
    }
    
    if (message) {
        input.classList.add('error');
    } else {
        input.classList.remove('error');
    }
}

function clearFieldError(input) {
    if (input) showFieldError(input, '');
}

function hideErrorSummary() {
    if (errorSummary) errorSummary.classList.add('hidden');
}

function showSuccessMessage() {
    if (formContainer) formContainer.classList.add('hidden');
    if (successBanner) successBanner.classList.remove('hidden');
    if (successActions) successActions.classList.remove('hidden');
}

function hideSuccessMessage() {
    if (successBanner) successBanner.classList.add('hidden');
    if (successActions) successActions.classList.add('hidden');
    if (formContainer) formContainer.classList.remove('hidden');
}

function showEditForm() {
    hideSuccessMessage();
    showStep(2); // Show step 2 with all details
    scrollToTop();
}

function backToHome() {
    // Clear localStorage data
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
        console.warn('Could not clear localStorage:', error);
    }
    
    // Reset form data
    formData = {
        fullName: '',
        email: '',
        gdprConsent: false,
        university: '',
        graduationYear: '',
        roleInterest: [],
        linkedinUrl: '',
        portfolioUrl: '',
        timezone: '',
        timestamp: 0,
        utmParams: {}
    };
    
    // Reset form state
    if (form) form.reset();
    hideSuccessMessage();
    hideErrorSummary();
    showStep(1);
    scrollToTop();
}

function showGlobalError(message) {
    if (errorList && errorSummary) {
        errorList.innerHTML = `<li>${message}</li>`;
        errorSummary.classList.remove('hidden');
    }
}

function focusFirstError() {
    if (!form) return;
    
    const firstErrorInput = form.querySelector('.error');
    if (firstErrorInput && firstErrorInput.focus) {
        firstErrorInput.focus();
        firstErrorInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Storage functions
function saveToStorage() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    } catch (error) {
        console.warn('Could not save to localStorage:', error);
    }
}

function loadFromStorage() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const data = JSON.parse(stored);
            populateForm(data);
            formData = { ...formData, ...data };
            
            // If we have step 1 data, show success state
            if (data.fullName && data.email && data.gdprConsent) {
                showSuccessMessage();
            }
        }
    } catch (error) {
        console.warn('Could not load from localStorage:', error);
    }
}

function populateForm(data) {
    if (!form) return;
    
    // Populate text inputs
    const textFields = ['fullName', 'email', 'university', 'graduationYear', 'linkedinUrl', 'portfolioUrl'];
    textFields.forEach(field => {
        const input = form.querySelector(`[name="${field}"]`);
        if (input && data[field]) {
            input.value = data[field];
        }
    });
    
    // Populate GDPR consent
    const gdprCheckbox = form.querySelector('[name="gdprConsent"]');
    if (gdprCheckbox && data.gdprConsent) {
        gdprCheckbox.checked = true;
    }
    
    // Populate role interests
    if (data.roleInterest && Array.isArray(data.roleInterest)) {
        const roleCheckboxes = form.querySelectorAll('input[name="roleInterest"]');
        roleCheckboxes.forEach(checkbox => {
            checkbox.checked = data.roleInterest.includes(checkbox.value);
        });
    }
}

// URL parameter capture
function captureUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const utmParams = {};
    
    for (const [key, value] of urlParams.entries()) {
        if (key.startsWith('utm_')) {
            utmParams[key] = value;
        }
    }
    
    if (Object.keys(utmParams).length > 0) {
        // Store UTM params for later use
        formData.utmParams = utmParams;
    }
}

// Mock API functions
function mockSubmit() {
    return new Promise(resolve => {
        setTimeout(resolve, SUBMIT_DELAY);
    });
}

// Accessibility enhancements
function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}

// University search functionality
function setupUniversitySearch() {
    if (!universityInput || !universityDropdown) return;
    
    universityInput.addEventListener('input', handleUniversitySearch);
    universityInput.addEventListener('focus', handleUniversityFocus);
    universityInput.addEventListener('blur', handleUniversityBlur);
    universityInput.addEventListener('keydown', handleUniversityKeydown);
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!universityInput.contains(e.target) && !universityDropdown.contains(e.target)) {
            hideUniversityDropdown();
        }
    });
}

function handleUniversitySearch() {
    if (!universityInput || !universityDropdown) return;
    
    const query = universityInput.value.toLowerCase().trim();
    selectedUniversityIndex = -1;
    
    if (query.length < 1) {
        hideUniversityDropdown();
        return;
    }
    
    const matches = UK_UNIVERSITIES.filter(uni => 
        uni.toLowerCase().includes(query)
    ).slice(0, 10); // Limit to 10 results
    
    if (matches.length === 0) {
        hideUniversityDropdown();
        return;
    }
    
    displayUniversityOptions(matches);
}

function handleUniversityFocus() {
    if (universityInput && universityInput.value.trim()) {
        handleUniversitySearch();
    }
}

function handleUniversityBlur() {
    // Delay hiding to allow for option clicks
    setTimeout(() => {
        hideUniversityDropdown();
    }, 150);
}

function handleUniversityKeydown(e) {
    const options = universityDropdown?.querySelectorAll('.university-option');
    if (!options || options.length === 0) return;
    
    switch (e.key) {
        case 'ArrowDown':
            e.preventDefault();
            selectedUniversityIndex = Math.min(selectedUniversityIndex + 1, options.length - 1);
            updateUniversityHighlight(options);
            break;
        case 'ArrowUp':
            e.preventDefault();
            selectedUniversityIndex = Math.max(selectedUniversityIndex - 1, -1);
            updateUniversityHighlight(options);
            break;
        case 'Enter':
            e.preventDefault();
            if (selectedUniversityIndex >= 0) {
                selectUniversity(options[selectedUniversityIndex].textContent);
            }
            break;
        case 'Escape':
            hideUniversityDropdown();
            break;
    }
}

function displayUniversityOptions(universities) {
    if (!universityDropdown) return;
    
    universityDropdown.innerHTML = '';
    
    universities.forEach((uni, index) => {
        const option = document.createElement('div');
        option.className = 'university-option';
        option.textContent = uni;
        option.setAttribute('role', 'option');
        option.addEventListener('click', () => selectUniversity(uni));
        universityDropdown.appendChild(option);
    });
    
    showUniversityDropdown();
}

function selectUniversity(university) {
    if (!universityInput) return;
    
    universityInput.value = university;
    hideUniversityDropdown();
    clearFieldError(universityInput);
}

function showUniversityDropdown() {
    if (!universityDropdown || !universityInput) return;
    
    universityDropdown.classList.remove('hidden');
    universityInput.classList.add('open');
    universityInput.setAttribute('aria-expanded', 'true');
}

function hideUniversityDropdown() {
    if (!universityDropdown || !universityInput) return;
    
    universityDropdown.classList.add('hidden');
    universityInput.classList.remove('open');
    universityInput.setAttribute('aria-expanded', 'false');
    selectedUniversityIndex = -1;
}

function updateUniversityHighlight(options) {
    options.forEach((option, index) => {
        option.classList.toggle('highlighted', index === selectedUniversityIndex);
    });
}

// Enhanced form submission with announcements
const originalHandleFormSubmit = handleFormSubmit;
async function enhancedHandleFormSubmit(event) {
    const result = await originalHandleFormSubmit(event);
    
    if (currentStep === 2 && successBanner && !successBanner.classList.contains('hidden')) {
        announceToScreenReader('Successfully joined the waitlist. We\'ll be in touch within 48 hours.');
    } else if (currentStep === 2) {
        announceToScreenReader('Moved to step 2. Please provide additional details.');
    }
    
    return result;
}

// Replace the original handler
if (form) {
    form.removeEventListener('submit', handleFormSubmit);
    form.addEventListener('submit', enhancedHandleFormSubmit);
}