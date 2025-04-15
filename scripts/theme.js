// Theme Manager - Handles dark/light theme switching
const ThemeManager = (() => {
    // Private variables
    let darkThemeToggle;
    let body;

    // Initialize DOM elements
    function _initializeElements() {
        darkThemeToggle = document.getElementById('darkThemeToggle');
        body = document.body;

        // Load saved theme preference
        const savedTheme = localStorage.getItem('darkTheme');
        if (savedTheme === 'true') {
            body.classList.add('dark-theme');
            darkThemeToggle.checked = true;
        }
    }

    // Setup event listeners
    function _setupEventListeners() {
        // Handle theme toggle
        darkThemeToggle.addEventListener('change', () => {
            if (darkThemeToggle.checked) {
                body.classList.add('dark-theme');
                localStorage.setItem('darkTheme', 'true');
            } else {
                body.classList.remove('dark-theme');
                localStorage.setItem('darkTheme', 'false');
            }
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

// Initialize ThemeManager when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    ThemeManager.init();
});