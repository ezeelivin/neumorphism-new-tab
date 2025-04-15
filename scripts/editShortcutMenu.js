// Edit Menu Module - Handles the shared shortcut form
const EditShortcutMenuManager = (() => {
    // DOM Elements
    let addShortcutBtn;
    let addShortcutForm;
    let shortcutForm;
    
    function _initializeElements() {
        addShortcutBtn = document.getElementById('add-shortcut-btn');
        addShortcutForm = document.getElementById('add-shortcut-form');
        shortcutForm = document.getElementById('shortcut-form');
    }
    
    function _setupEventListeners() {
        // Toggle form visibility when clicking the add button
        if (addShortcutBtn && addShortcutForm) {
            addShortcutBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                addShortcutForm.style.display = addShortcutForm.style.display === 'none' ? 'block' : 'none';
            });
            
            // Close form when clicking outside
            document.addEventListener('click', () => {
                addShortcutForm.style.display = 'none';
            });
            
            addShortcutForm.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }
        
        // Handle form submission
        if (shortcutForm) {
            shortcutForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const nameInput = document.getElementById('shortcut-name');
                const urlInput = document.getElementById('shortcut-url');
                const categorySelect = document.getElementById('shortcut-category');
                
                const name = nameInput.value.trim();
                const url = urlInput.value.trim();
                const category = categorySelect.value;
                
                if (name && url) {
                    // Route to the appropriate manager based on category
                    if (category === 'ai' && typeof AiToolsManager !== 'undefined') {
                        AiToolsManager.addAiTool(name, url);
                    } else if (typeof ShortcutsManager !== 'undefined') {
                        ShortcutsManager.addShortcut(name, url);
                    }
                    
                    // Clear the form and hide it
                    nameInput.value = '';
                    urlInput.value = '';
                    categorySelect.value = 'shortcuts';
                    addShortcutForm.style.display = 'none';
                }
            });
        }
    }
    
    // Public API
    return {
        init() {
            _initializeElements();
            _setupEventListeners();
        }
    };
})();

// Remove or fix the duplicate initialization
// Since EditShortcutMenuManager.init() is already called in script.js,
// this code can be safely removed
/* 
document.addEventListener('DOMContentLoaded', () => {
    EditMenuManager.init();
});
*/