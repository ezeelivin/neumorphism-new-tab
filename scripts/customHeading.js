// Custom Heading Manager - Handles editable page header
const CustomHeadingManager = (() => {
    // Private variables
    let customHeading;
    let customTextToggle;

    // Initialize DOM elements
    function _initializeElements() {
        customHeading = document.querySelector('.custom-heading');
        customTextToggle = document.getElementById('customTextToggle');

        // Load saved custom text and toggle state
        const savedCustomText = localStorage.getItem('customText') || 'Click here to edit';
        const savedCustomTextVisible = localStorage.getItem('customTextVisible') === 'true';

        // Set initial state for custom heading
        customHeading.textContent = savedCustomText;
        customTextToggle.checked = savedCustomTextVisible;
        if (!savedCustomTextVisible) {
            customHeading.classList.add('hidden');
        }
    }

    // Setup event listeners
    function _setupEventListeners() {
        // Save custom text when edited
        customHeading.addEventListener('blur', () => {
            const text = customHeading.textContent.trim();
            localStorage.setItem('customText', text);
        });

        // Handle toggle change for custom heading
        customTextToggle.addEventListener('change', () => {
            const isVisible = customTextToggle.checked;
            customHeading.classList.toggle('hidden', !isVisible);
            localStorage.setItem('customTextVisible', isVisible);
        });
    }

    // Public API
    return {
        init() {
            _initializeElements();
            _setupEventListeners();
        }
    };
})();

// Initialize CustomHeadingManager when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    CustomHeadingManager.init();
});
