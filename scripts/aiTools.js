// AI Tools Management Module
const AiToolsManager = (() => {
    // Private variables
    let aiTools = [];
    const defaultFaviconUrl = 'https://www.google.com/s2/favicons?domain=';

    // DOM Elements
    let aiToolsContainer;
    let aiToolsToggle;
    let editAiToolsBtn;
    let editAiToolsModal;
    let aiToolsList;
    let newAiToolName;
    let newAiToolUrl;
    let addAiToolBtn;

    // Private functions
    function _initializeElements() {
        aiToolsContainer = document.getElementById('aiToolsShortcuts');
        aiToolsToggle = document.getElementById('aiToolsToggle');
        editAiToolsBtn = document.getElementById('editAiToolsBtn');
        editAiToolsModal = document.getElementById('editAiToolsModal');
        aiToolsList = document.getElementById('aiToolsList');
        newAiToolName = document.getElementById('newAiToolName');
        newAiToolUrl = document.getElementById('newAiToolUrl');
        addAiToolBtn = document.getElementById('addAiToolBtn');

        // Setup visibility toggle
        if (aiToolsToggle && aiToolsContainer) {
            // Load saved preference
            const savedAiToolsState = localStorage.getItem('aiToolsVisible');
            if (savedAiToolsState !== null) {
                aiToolsToggle.checked = savedAiToolsState === 'true';
                aiToolsContainer.classList.toggle('hidden', !aiToolsToggle.checked);
            }

            // Handle toggle change
            aiToolsToggle.addEventListener('change', () => {
                aiToolsContainer.classList.toggle('hidden', !aiToolsToggle.checked);
                localStorage.setItem('aiToolsVisible', aiToolsToggle.checked);
            });
        }
    }

    function _loadAiTools() {
        aiTools = JSON.parse(localStorage.getItem('aiTools')) || [];

        // If no AI tools in localStorage, initialize with default AI tools
        if (aiTools.length === 0) {
            // Define the default AI tools as requested
            const defaultTools = [
                {
                    name: 'ChatGPT',
                    url: 'https://chat.openai.com',
                    icon: 'https://chat.openai.com/favicon.ico'
                },
                {
                    name: 'Perplexity',
                    url: 'https://www.perplexity.ai',
                    icon: 'https://www.perplexity.ai/favicon.ico'
                },
                {
                    name: 'Claude',
                    url: 'https://claude.ai',
                    icon: 'https://claude.ai/favicon.ico'
                },
                {
                    name: 'Grok',
                    url: 'https://grok.com',
                    icon: 'https://s2.googleusercontent.com/s2/favicons?domain=grok.com&sz=32'
                }
            ];
            
            aiTools = defaultTools;
            _saveAiTools();
        }
    }

    function _saveAiTools() {
        localStorage.setItem('aiTools', JSON.stringify(aiTools));
        renderAiTools();
    }

    function _getFaviconUrl(url) {
        try {
            const domain = new URL(url).hostname;
            return `${defaultFaviconUrl}${domain}&sz=48`;
        } catch (e) {
            return `${defaultFaviconUrl}example.com&sz=48`;
        }
    }

    function _setupModalEventListeners() {
        // Close modal when clicking on the X or outside the modal
        if (editAiToolsModal) {
            const closeModalBtn = editAiToolsModal.querySelector('.close-modal');
            if (closeModalBtn) {
                closeModalBtn.addEventListener('click', () => {
                    editAiToolsModal.style.display = 'none';
                });
            }

            editAiToolsModal.addEventListener('click', (e) => {
                if (e.target === editAiToolsModal) {
                    editAiToolsModal.style.display = 'none';
                }
            });
        }

        // Add event listener for the edit button
        if (editAiToolsBtn) {
            editAiToolsBtn.addEventListener('click', () => {
                renderAiToolsInModal();
                if (editAiToolsModal) {
                    editAiToolsModal.style.display = 'block';
                }
            });
        }

        // Add event listener for the add AI tool button
        if (addAiToolBtn && newAiToolName && newAiToolUrl) {
            addAiToolBtn.addEventListener('click', () => {
                const name = newAiToolName.value.trim();
                const url = newAiToolUrl.value.trim();

                if (name && url) {
                    // Ensure URL has a protocol
                    const formattedUrl = url.startsWith('http') ? url : `https://${url}`;
                    const faviconUrl = _getFaviconUrl(formattedUrl);

                    aiTools.push({
                        name,
                        url: formattedUrl,
                        icon: faviconUrl
                    });

                    _saveAiTools();
                    renderAiToolsInModal();

                    // Clear inputs
                    newAiToolName.value = '';
                    newAiToolUrl.value = '';
                }
            });
        }

        // Add event listeners for input and deletion in modal
        if (aiToolsList) {
            // Listen for input changes
            aiToolsList.addEventListener('input', (e) => {
                if (e.target.matches('input')) {
                    const index = e.target.dataset.index;
                    const field = e.target.dataset.field;
                    aiTools[index][field] = e.target.value;
                    _saveAiTools();
                }
            });

            // Listen for delete button clicks
            aiToolsList.addEventListener('click', (e) => {
                if (e.target.matches('.delete-shortcut')) {
                    const index = e.target.dataset.index;
                    aiTools.splice(index, 1);
                    _saveAiTools();
                    renderAiToolsInModal();
                }
            });
        }
    }

    // Public functions
    function renderAiTools() {
        if (!aiToolsContainer) return;

        aiToolsContainer.innerHTML = '';
        aiTools.forEach(tool => {
            const btn = document.createElement('a');
            btn.href = tool.url;
            btn.className = 'btn';
            btn.dataset.name = tool.name;

            const img = document.createElement('img');
            img.src = tool.icon || _getFaviconUrl(tool.url);
            img.alt = tool.name;

            const span = document.createElement('span');
            span.textContent = tool.name;

            btn.appendChild(img);
            btn.appendChild(span);
            aiToolsContainer.appendChild(btn);
        });

        // Add edit button if it doesn't exist
        if (!aiToolsContainer.querySelector('.edit-ai-tools-btn') && editAiToolsBtn) {
            aiToolsContainer.appendChild(editAiToolsBtn.cloneNode(true));
            const newEditBtn = aiToolsContainer.querySelector('.edit-ai-tools-btn');
            newEditBtn.addEventListener('click', () => {
                renderAiToolsInModal();
                if (editAiToolsModal) {
                    editAiToolsModal.style.display = 'block';
                }
            });
        }
    }

    function renderAiToolsInModal() {
        if (!aiToolsList) return;

        aiToolsList.innerHTML = '';
        aiTools.forEach((tool, index) => {
            const aiToolItem = document.createElement('div');
            aiToolItem.className = 'shortcut-item';

            const img = document.createElement('img');
            img.src = tool.icon || _getFaviconUrl(tool.url);
            img.alt = tool.name;

            const nameInput = document.createElement('input');
            nameInput.type = 'text';
            nameInput.className = 'name-input';
            nameInput.value = tool.name;
            nameInput.dataset.index = index;
            nameInput.dataset.field = 'name';

            const urlInput = document.createElement('input');
            urlInput.type = 'text';
            urlInput.className = 'url-input';
            urlInput.value = tool.url;
            urlInput.dataset.index = index;
            urlInput.dataset.field = 'url';

            const deleteButton = document.createElement('button');
            deleteButton.className = 'delete-shortcut';
            deleteButton.innerHTML = '&times;';
            deleteButton.dataset.index = index;

            aiToolItem.appendChild(img);
            aiToolItem.appendChild(nameInput);
            aiToolItem.appendChild(urlInput);
            aiToolItem.appendChild(deleteButton);

            aiToolsList.appendChild(aiToolItem);
        });
    }

    // Public API
    return {
        init() {
            _initializeElements();
            _loadAiTools();
            _setupModalEventListeners();
            renderAiTools();
        },

        // These could be useful for externally modifying AI tools
        getAiTools() {
            return [...aiTools]; // Return a copy to prevent direct modification
        },

        addAiTool(name, url, icon) {
            if (!name || !url) return false;

            const formattedUrl = url.startsWith('http') ? url : `https://${url}`;
            aiTools.push({
                name,
                url: formattedUrl,
                icon: icon || _getFaviconUrl(formattedUrl)
            });

            _saveAiTools();
            return true;
        },

        removeAiTool(index) {
            if (index >= 0 && index < aiTools.length) {
                aiTools.splice(index, 1);
                _saveAiTools();
                return true;
            }
            return false;
        },

        updateAiTool(index, updatedTool) {
            if (index >= 0 && index < aiTools.length) {
                aiTools[index] = { ...aiTools[index], ...updatedTool };
                _saveAiTools();
                return true;
            }
            return false;
        }
    };
})();

// Initialize the AI tools module when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    AiToolsManager.init();
});