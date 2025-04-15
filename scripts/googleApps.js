// Google Apps Manager
const GoogleAppsManager = (() => {
    // Private variables
    let googleAppsBtn;
    let googleAppsDropdown;

    // Initialize DOM elements
    function _initializeElements() {
        googleAppsBtn = document.querySelector('.googleAppsBtn');
        googleAppsDropdown = document.querySelector('.google-apps-dropdown');
    }

    // Setup event listeners
    function _setupEventListeners() {
        // Toggle Google Apps dropdown
        googleAppsBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            googleAppsBtn.classList.toggle('active');
            document.body.classList.toggle('googleAppsActive');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!googleAppsBtn.contains(e.target)) {
                googleAppsBtn.classList.remove('active');
                document.body.classList.remove('googleAppsActive');
            }
        });

        // Prevent clicks inside dropdown from closing it
        googleAppsDropdown.addEventListener('click', (e) => {
            e.stopPropagation();
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

// Initialize GoogleAppsManager when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    GoogleAppsManager.init();
});

document.addEventListener('DOMContentLoaded', function() {
    // Get references to DOM elements
    const googleAppsBtn = document.getElementById('googleAppsBtn');
    const googleAppsBtnContainer = document.getElementById('googleAppsBtnContainer');
    const googleAppsToggle = document.getElementById('googleAppsToggle');
    const googleAppsDropdown = document.querySelector('.google-apps-dropdown');

    // Initialize the visibility based on localStorage
    initializeGoogleAppsVisibility();

    // Add click event listener to the Google Apps button
    if (googleAppsBtn) {
        googleAppsBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            googleAppsDropdown.classList.toggle('show');
        });
    }

    // Add change event listener to the toggle
    if (googleAppsToggle) {
        googleAppsToggle.addEventListener('change', function() {
            const isVisible = this.checked;
            saveGoogleAppsState(isVisible);
            updateGoogleAppsVisibility(isVisible);
        });
    }

    // Add click event listener to document to close dropdown when clicking outside
    document.addEventListener('click', function() {
        if (googleAppsDropdown && googleAppsDropdown.classList.contains('show')) {
            googleAppsDropdown.classList.remove('show');
        }
    });

    // Function to save Google Apps visibility state to localStorage
    function saveGoogleAppsState(isVisible) {
        localStorage.setItem('googleAppsVisible', isVisible.toString());
    }

    // Function to load Google Apps visibility state from localStorage
    function loadGoogleAppsState() {
        const savedState = localStorage.getItem('googleAppsVisible');
        if (savedState === null) {
            // Default to false if not set
            return false;
        }
        return savedState === 'true';
    }

    // Function to initialize Google Apps visibility based on saved state
    function initializeGoogleAppsVisibility() {
        const isVisible = loadGoogleAppsState();
        
        // Update checkbox state
        if (googleAppsToggle) {
            googleAppsToggle.checked = isVisible;
        }
        
        // Update visibility
        updateGoogleAppsVisibility(isVisible);
    }

    // Function to update Google Apps visibility
    function updateGoogleAppsVisibility(isVisible) {
        if (googleAppsBtnContainer) {
            if (isVisible) {
                googleAppsBtnContainer.style.display = '';
            } else {
                googleAppsBtnContainer.style.display = 'none';
            }
        }
    }
});
