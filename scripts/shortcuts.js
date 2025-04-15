// Shortcuts Management Module
const ShortcutsManager = (() => {
    // Private variables
    let shortcuts = [];
    const defaultFaviconUrl = 'https://www.google.com/s2/favicons?domain=';

    // DOM Elements
    let shortcutsContainer;
    let editShortcutsBtn;
    let editShortcutsModal;
    let shortcutsList;
    let newShortcutName;
    let newShortcutUrl;
    let addShortcutBtn;

    // Private functions
    function _initializeElements() {
        shortcutsContainer = document.getElementById('shortcuts');
        editShortcutsBtn = document.getElementById('editShortcutsBtn');
        editShortcutsModal = document.getElementById('editShortcutsModal');
        shortcutsList = document.getElementById('shortcutsList');
        newShortcutName = document.getElementById('newShortcutName');
        newShortcutUrl = document.getElementById('newShortcutUrl');
        addShortcutBtn = document.getElementById('addShortcutBtn');
    }

    function _loadShortcuts() {
        shortcuts = JSON.parse(localStorage.getItem('shortcuts')) || [];

        // If no shortcuts in localStorage, initialize with default shortcuts
        if (shortcuts.length === 0 && shortcutsContainer) {
            const defaultShortcuts = Array.from(shortcutsContainer.querySelectorAll('.btn:not(.edit-shortcuts-btn)')).map(btn => ({
                name: btn.dataset.name,
                url: btn.href,
                icon: btn.querySelector('img').src
            }));
            shortcuts = defaultShortcuts;
            _saveShortcuts();
        }
    }

    function _saveShortcuts() {
        localStorage.setItem('shortcuts', JSON.stringify(shortcuts));
        renderShortcuts();
    }

    function _getFaviconUrl(url) {
        try {
            const domain = new URL(url).hostname;
            return `${defaultFaviconUrl}${domain}&sz=32`;
        } catch (e) {
            return `${defaultFaviconUrl}example.com&sz=32`;
        }
    }

    function _setupModalEventListeners() {
        // Close modal when clicking on the X or outside the modal
        if (editShortcutsModal) {
            const closeModalBtn = editShortcutsModal.querySelector('.close-modal');
            if (closeModalBtn) {
                closeModalBtn.addEventListener('click', () => {
                    editShortcutsModal.style.display = 'none';
                });
            }

            editShortcutsModal.addEventListener('click', (e) => {
                if (e.target === editShortcutsModal) {
                    editShortcutsModal.style.display = 'none';
                }
            });
        }

        // Add event listener for the edit button
        if (editShortcutsBtn) {
            editShortcutsBtn.addEventListener('click', () => {
                renderShortcutsInModal();
                if (editShortcutsModal) {
                    editShortcutsModal.style.display = 'block';
                }
            });
        }

        // Add event listener for the add shortcut button
        if (addShortcutBtn && newShortcutName && newShortcutUrl) {
            addShortcutBtn.addEventListener('click', () => {
                const name = newShortcutName.value.trim();
                const url = newShortcutUrl.value.trim();

                if (name && url) {
                    // Ensure URL has a protocol
                    const formattedUrl = url.startsWith('http') ? url : `https://${url}`;
                    const faviconUrl = _getFaviconUrl(formattedUrl);

                    shortcuts.push({
                        name,
                        url: formattedUrl,
                        icon: faviconUrl
                    });

                    _saveShortcuts();
                    renderShortcutsInModal();

                    // Clear inputs
                    newShortcutName.value = '';
                    newShortcutUrl.value = '';
                }
            });
        }

        // Add event listeners for input and deletion in modal
        if (shortcutsList) {
            // Listen for input changes
            shortcutsList.addEventListener('input', (e) => {
                if (e.target.matches('input')) {
                    const index = e.target.dataset.index;
                    const field = e.target.dataset.field;
                    shortcuts[index][field] = e.target.value;
                    _saveShortcuts();
                }
            });

            // Listen for delete button clicks
            shortcutsList.addEventListener('click', (e) => {
                if (e.target.matches('.delete-shortcut')) {
                    const index = e.target.dataset.index;
                    shortcuts.splice(index, 1);
                    _saveShortcuts();
                    renderShortcutsInModal();
                }
            });
        }
    }

    // Public functions
    function renderShortcuts() {
        if (!shortcutsContainer) return;

        shortcutsContainer.innerHTML = '';
        shortcuts.forEach(shortcut => {
            const btn = document.createElement('a');
            btn.href = shortcut.url;
            btn.className = 'btn';
            btn.dataset.name = shortcut.name;

            const img = document.createElement('img');
            img.src = shortcut.icon || _getFaviconUrl(shortcut.url);
            img.alt = shortcut.name;

            const span = document.createElement('span');
            span.textContent = shortcut.name;

            btn.appendChild(img);
            btn.appendChild(span);
            shortcutsContainer.appendChild(btn);
        });

        // Add edit button if it doesn't exist
        if (!shortcutsContainer.querySelector('.edit-shortcuts-btn') && editShortcutsBtn) {
            shortcutsContainer.appendChild(editShortcutsBtn.cloneNode(true));
            const newEditBtn = shortcutsContainer.querySelector('.edit-shortcuts-btn');
            newEditBtn.addEventListener('click', () => {
                renderShortcutsInModal();
                if (editShortcutsModal) {
                    editShortcutsModal.style.display = 'block';
                }
            });
        }
    }

    function renderShortcutsInModal() {
        if (!shortcutsList) return;

        shortcutsList.innerHTML = '';
        shortcuts.forEach((shortcut, index) => {
            const shortcutItem = document.createElement('div');
            shortcutItem.className = 'shortcut-item';

            const img = document.createElement('img');
            img.src = shortcut.icon || _getFaviconUrl(shortcut.url);
            img.alt = shortcut.name;

            const nameInput = document.createElement('input');
            nameInput.type = 'text';
            nameInput.className = 'name-input';
            nameInput.value = shortcut.name;
            nameInput.dataset.index = index;
            nameInput.dataset.field = 'name';

            const urlInput = document.createElement('input');
            urlInput.type = 'text';
            urlInput.className = 'url-input';
            urlInput.value = shortcut.url;
            urlInput.dataset.index = index;
            urlInput.dataset.field = 'url';

            const deleteButton = document.createElement('button');
            deleteButton.className = 'delete-shortcut';
            deleteButton.innerHTML = '&times;';
            deleteButton.dataset.index = index;

            shortcutItem.appendChild(img);
            shortcutItem.appendChild(nameInput);
            shortcutItem.appendChild(urlInput);
            shortcutItem.appendChild(deleteButton);

            shortcutsList.appendChild(shortcutItem);
        });
    }

    // Public API
    return {
        init() {
            _initializeElements();
            _loadShortcuts();
            _setupModalEventListeners();
            renderShortcuts();
        },

        // These could be useful for externally modifying shortcuts
        getShortcuts() {
            return [...shortcuts]; // Return a copy to prevent direct modification
        },

        addShortcut(name, url, icon) {
            if (!name || !url) return false;

            const formattedUrl = url.startsWith('http') ? url : `https://${url}`;
            shortcuts.push({
                name,
                url: formattedUrl,
                icon: icon || _getFaviconUrl(formattedUrl)
            });

            _saveShortcuts();
            return true;
        },

        removeShortcut(index) {
            if (index >= 0 && index < shortcuts.length) {
                shortcuts.splice(index, 1);
                _saveShortcuts();
                return true;
            }
            return false;
        },

        updateShortcut(index, updatedShortcut) {
            if (index >= 0 && index < shortcuts.length) {
                shortcuts[index] = { ...shortcuts[index], ...updatedShortcut };
                _saveShortcuts();
                return true;
            }
            return false;
        }
    };
})();

// Initialize the shortcuts module when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    ShortcutsManager.init();
});