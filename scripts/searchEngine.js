// Search Engine Module
const SearchEngineManager = (() => {
    // Private variables
    let searchEngines = {
        google: {
            name: 'Google',
            url: 'https://www.google.com/search?q=',
            icon: 'https://www.google.com/favicon.ico'
        },
        bing: {
            name: 'Bing',
            url: 'https://www.bing.com/search?q=',
            icon: 'https://www.bing.com/favicon.ico'
        },
        duckduckgo: {
            name: 'DuckDuckGo',
            url: 'https://duckduckgo.com/?q=',
            icon: 'https://duckduckgo.com/favicon.ico'
        },
        yahoo: {
            name: 'Yahoo',
            url: 'https://search.yahoo.com/search?p=',
            icon: 'https://www.yahoo.com/favicon.ico'
        }
    };

    let currentSearchEngine = 'google';
    let currentSearchEngineUrl = '';

    // DOM Elements
    let searchEngineDropdown;
    let searchEngineOptions;
    let searchEngineToggle;
    let currentSearchEngineIcon;
    let finderButton;
    let input;
    let finder;
    let form;

    // Private functions
    function _initializeElements() {
        // Initialize DOM elements
        searchEngineDropdown = document.querySelector('.search-engine-dropdown');
        searchEngineOptions = document.querySelector('.search-engine-options');
        searchEngineToggle = document.querySelector('input[data-feature="searchEngine"]');
        currentSearchEngineIcon = document.querySelector('.finder__button img');
        finderButton = document.querySelector('.finder__button');
        input = document.querySelector(".finder__input");
        finder = document.querySelector(".finder");
        form = document.querySelector("form");

        // Load saved search engine preference
        currentSearchEngine = localStorage.getItem('searchEngine') || 'google';
        currentSearchEngineUrl = searchEngines[currentSearchEngine].url;

        // Update the UI to reflect the current search engine
        if (currentSearchEngineIcon && searchEngines[currentSearchEngine]) {
            currentSearchEngineIcon.src = searchEngines[currentSearchEngine].icon;
            currentSearchEngineIcon.alt = searchEngines[currentSearchEngine].name;
            // Add error handling for image loading
            currentSearchEngineIcon.onerror = function() {
                console.error("Failed to load search engine icon:", this.src);
                this.src = 'https://cdn.iconscout.com/icon/free/png-256/free-search-1768589-1502566.png'; // Online fallback icon
            };
        }
    }

    function updateSearchEngineIcon() {
        if (currentSearchEngineIcon && searchEngines[currentSearchEngine]) {
            currentSearchEngineIcon.src = searchEngines[currentSearchEngine].icon;
            currentSearchEngineIcon.alt = searchEngines[currentSearchEngine].name;
            // Add error handling for image loading
            currentSearchEngineIcon.onerror = function() {
                console.error("Failed to load search engine icon:", this.src);
                this.src = 'https://cdn.iconscout.com/icon/free/png-256/free-search-1768589-1502566.png'; // Online fallback icon
            };
        }
    }

    function _setupEventListeners() {
        // Toggle search engine visibility based on checkbox state
        if (searchEngineToggle) {
            // Set initial state from localStorage
            const savedState = localStorage.getItem('searchEngineEnabled');
            if (savedState === 'true') {
                searchEngineToggle.checked = true;
                if (finderButton) {
                    finderButton.style.display = 'flex';
                }
            } else {
                if (finderButton) {
                    finderButton.style.display = 'none';
                }
            }

            // Handle toggle changes
            searchEngineToggle.addEventListener('change', () => {
                const isChecked = searchEngineToggle.checked;
                if (finderButton) {
                    finderButton.style.display = isChecked ? 'flex' : 'none';
                }
                localStorage.setItem('searchEngineEnabled', isChecked);
            });
        }

        // Toggle dropdown on icon click
        if (finderButton) {
            finderButton.addEventListener('click', (e) => {
                e.stopPropagation();
                if (searchEngineDropdown) {
                    searchEngineDropdown.classList.toggle('active');
                }
            });
        }

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (searchEngineDropdown && !searchEngineDropdown.contains(e.target) &&
                finderButton && !finderButton.contains(e.target)) {
                searchEngineDropdown.classList.remove('active');
            }
        });

        // Handle search form submission
        document.querySelector('.finder').addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const searchInput = document.querySelector('.finder__input');
                const query = searchInput.value.trim();
                if (query) {
                    window.location.href = currentSearchEngineUrl + encodeURIComponent(query);
                }
            }
        });

        // Handle search engine selection
        document.querySelectorAll('.search-engine-option').forEach(option => {
            option.addEventListener('click', () => {
                const engine = option.getAttribute('data-engine');
                currentSearchEngine = engine;
                currentSearchEngineUrl = searchEngines[engine].url;
                localStorage.setItem('searchEngine', engine);
                updateSearchEngineIcon();
                if (searchEngineDropdown) {
                    searchEngineDropdown.classList.remove('active');
                }
            });
        });

        // Input focus and blur events for animation
        if (input) {
            input.addEventListener("focus", () => {
                finder.classList.add("active");
            });

            input.addEventListener("blur", () => {
                if (input.value.length === 0) {
                    finder.classList.remove("active");
                }
            });
        }

        // Handle form submission animation
        if (form) {
            form.addEventListener("submit", (ev) => {
                ev.preventDefault();
                finder.classList.add("processing");
                finder.classList.remove("active");
                input.disabled = true;
                setTimeout(() => {
                    finder.classList.remove("processing");
                    input.disabled = false;
                    if (input.value.length > 0) {
                        finder.classList.add("active");
                    }
                }, 1000);
            });
        }
    }

    // Public API
    return {
        init() {
            _initializeElements();
            _setupEventListeners();
        },

        getSearchEngines() {
            return { ...searchEngines }; // Return a copy to prevent direct modification
        },

        getCurrentSearchEngine() {
            return currentSearchEngine;
        },

        setSearchEngine(engine) {
            if (searchEngines[engine]) {
                currentSearchEngine = engine;
                currentSearchEngineUrl = searchEngines[engine].url;
                localStorage.setItem('searchEngine', engine);
                updateSearchEngineIcon();
                return true;
            }
            return false;
        },

        addSearchEngine(id, name, url, icon) {
            if (!id || !name || !url) return false;

            searchEngines[id] = {
                name,
                url,
                icon: icon || 'https://cdn.iconscout.com/icon/free/png-256/free-search-1768589-1502566.png' // Online default icon
            };

            return true;
        }
    };
})();

// Initialize the Search Engine module when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    SearchEngineManager.init();
});