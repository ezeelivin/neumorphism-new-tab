// Edit Menu Sidebar Manager
const EditSidebarManager = {
    init() {
        // Get edit button
        const editBtn = document.getElementById('editBtn');
        // Get edit sidebar
        const editSidebar = document.querySelector('.editSidebar');
        
        // Add click event to edit button
        editBtn.addEventListener('click', () => {
            // Toggle the editActive class on the editSidebar
            editSidebar.classList.toggle('editActive');
            // Add backdrop when sidebar is active
            document.body.classList.toggle('editActive', editSidebar.classList.contains('editActive'));
        });

        // Close sidebar when clicking backdrop
        document.querySelector('.backdrop').addEventListener('click', () => {
            if (document.body.classList.contains('editActive')) {
                editSidebar.classList.remove('editActive');
                document.body.classList.remove('editActive');
            }
        });

        // Load saved toggle states from localStorage
        this.loadToggleStates();

        // Set up event listeners for all toggles
        const toggles = document.querySelectorAll('.wrap__toggle .checkBox');
        toggles.forEach(toggle => {
            toggle.addEventListener('change', () => {
                this.saveToggleState(toggle.id, toggle.checked);
                this.applyToggleFunctionality(toggle.id, toggle.checked);
            });
        });
    },

    loadToggleStates() {
        // Load toggle states from localStorage
        const toggles = document.querySelectorAll('.wrap__toggle .checkBox');
        toggles.forEach(toggle => {
            const savedState = localStorage.getItem(`toggle_${toggle.id}`);
            if (savedState !== null) {
                toggle.checked = savedState === 'true';
                this.applyToggleFunctionality(toggle.id, toggle.checked);
            }
        });
    },

    saveToggleState(toggleId, state) {
        localStorage.setItem(`toggle_${toggleId}`, state);
    },

    applyToggleFunctionality(toggleId, state) {
        // Apply functionality based on toggle ID
        switch (toggleId) {
            case 'shortcutsToggle':
                document.getElementById('shortcuts').classList.toggle('hidden', !state);
                break;
            case 'aiToolsToggle':
                document.getElementById('aiToolsShortcuts').classList.toggle('hidden', !state);
                break;
            case 'googleAppsToggle':
                document.querySelector('.googleAppsBtn').classList.toggle('hidden', !state);
                break;
            case 'showDateToggle':
                document.getElementById('clock-date').classList.toggle('hidden', !state);
                break;
            case 'showGreetingToggle':
                document.getElementById('greeting').classList.toggle('hidden', !state);
                break;
            case 'customTextToggle':
                document.querySelector('.custom-heading').classList.toggle('hidden', !state);
                break;
            case 'showTodoToggle':
                document.querySelector('.todoBtn').classList.toggle('hidden', !state);
                break;
            case 'darkThemeToggle':
                document.body.classList.toggle('dark-theme', state);
                break;
            // Add cases for other toggles as needed
        }
    }
};

// Initialize EditSidebarManager when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    EditSidebarManager.init();
});