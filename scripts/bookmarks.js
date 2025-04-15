// Bookmarks management namespace
const BookmarksManager = (() => {
    // Icons for bookmarks UI
    const ICONS = {
        folder: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/></svg>',
        arrow: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/></svg>',
        delete: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/></svg>'
    };

    // Private functions
    function _createSection(title) {
        const section = document.createElement('div');
        section.className = 'bookmark-section';

        if (title) {
            const header = document.createElement('div');
            header.className = 'section-header';
            header.textContent = title;
            section.appendChild(header);
        }

        const content = document.createElement('div');
        content.className = 'section-content';
        section.appendChild(content);

        return { section, content };
    }

    function _createBookmarkElement(bookmark) {
        const li = document.createElement('li');
        li.className = 'bookmark-item';

        const img = document.createElement('img');
        img.src = `https://www.google.com/s2/favicons?domain=${new URL(bookmark.url).hostname}&sz=48`;
        img.alt = '';

        const p = document.createElement('p');
        p.textContent = bookmark.title;
        p.title = bookmark.title; // Add title attribute for tooltip on hover

        const deleteIcon = document.createElement('div');
        deleteIcon.className = 'bookmarkDeleteIcon';
        deleteIcon.innerHTML = ICONS.delete;

        deleteIcon.addEventListener('click', (e) => {
            e.stopPropagation();
            chrome.bookmarks.remove(bookmark.id);
            li.remove();
        });

        li.appendChild(img);
        li.appendChild(p);
        li.appendChild(deleteIcon);

        li.addEventListener('click', () => {
            window.location.href = bookmark.url;
        });

        return li;
    }

    function _createFolderElement(folder, children) {
        const li = document.createElement('li');
        li.className = 'bookmark-folder';

        const folderHeader = document.createElement('div');
        folderHeader.className = 'folder-header';

        const folderIcon = document.createElement('div');
        folderIcon.className = 'folder-icon';
        folderIcon.innerHTML = ICONS.folder;

        const p = document.createElement('p');
        p.textContent = folder.title;

        const arrowIcon = document.createElement('div');
        arrowIcon.className = 'arrow-icon';
        arrowIcon.innerHTML = ICONS.arrow;

        folderHeader.appendChild(folderIcon);
        folderHeader.appendChild(p);
        folderHeader.appendChild(arrowIcon);

        const folderContent = document.createElement('div');
        folderContent.className = 'folder-content';

        li.appendChild(folderHeader);
        li.appendChild(folderContent);

        // Add children to folder content
        if (children && children.length > 0) {
            children.forEach(child => {
                folderContent.appendChild(child);
            });
        }

        // Toggle folder on click
        folderHeader.addEventListener('click', (e) => {
            e.stopPropagation();
            li.classList.toggle('open');
        });

        return li;
    }

    function _processFolder(node) {
        if (!node.children || node.children.length === 0) return null;

        const childElements = [];
        node.children.forEach(child => {
            if (child.url) {
                childElements.push(_createBookmarkElement(child));
            } else {
                const subFolder = _processFolder(child);
                if (subFolder) childElements.push(subFolder);
            }
        });

        return childElements.length > 0 ? _createFolderElement(node, childElements) : null;
    }

    function _processNode(node, container) {
        if (node.children) {
            // Process direct bookmark items first
            const directBookmarks = node.children.filter(child => child.url);
            directBookmarks.forEach(bookmark => {
                container.appendChild(_createBookmarkElement(bookmark));
            });

            // Process folders
            const folders = node.children.filter(child => !child.url);
            folders.forEach(folder => {
                const childElements = [];
                folder.children?.forEach(child => {
                    if (child.url) {
                        childElements.push(_createBookmarkElement(child));
                    } else {
                        const subFolder = _processFolder(child);
                        if (subFolder) childElements.push(subFolder);
                    }
                });

                if (childElements.length > 0) {
                    container.appendChild(_createFolderElement(folder, childElements));
                }
            });
        }
    }

    // Public API
    return {
        loadBookmarks() {
            const bookmarksList = document.querySelector('.bookmarks_list');
            if (!bookmarksList) return;

            bookmarksList.innerHTML = ''; // Clear existing bookmarks

            chrome.bookmarks.getTree((bookmarkTreeNodes) => {
                // Create sections
                const { section: barSection, content: barContent } = _createSection('Bookmark Bar');
                const { section: otherSection, content: otherContent } = _createSection('Other Bookmarks');

                // Process bookmark bar (first root node's children)
                if (bookmarkTreeNodes[0].children[0]) {
                    _processNode(bookmarkTreeNodes[0].children[0], barContent);
                    if (barContent.children.length > 0) {
                        bookmarksList.appendChild(barSection);
                    }
                }

                // Process other bookmarks (second root node's children)
                if (bookmarkTreeNodes[0].children[1]) {
                    _processNode(bookmarkTreeNodes[0].children[1], otherContent);
                    if (otherContent.children.length > 0) {
                        bookmarksList.appendChild(otherSection);
                    }
                }
            });
        },

        initBookmarks() {
            const bookmarkButton = document.querySelector('.bookmark_button');
            const bookmarkContainer = document.querySelector('.bookmark_container');
            const bookmarksList = document.querySelector('.bookmarks_list');
            const viewButtons = document.querySelectorAll('.view_btn');

            // Set initial view
            if (bookmarksList) {
                bookmarksList.classList.add('list-view');
            }

            // View toggle functionality
            if (viewButtons) {
                viewButtons.forEach(button => {
                    button.addEventListener('click', () => {
                        viewButtons.forEach(btn => btn.classList.remove('active'));
                        button.classList.add('active');
                        bookmarksList.classList.remove('list-view', 'grid-view');
                        const viewType = button.getAttribute('data-view');
                        bookmarksList.classList.add(`${viewType}-view`);
                    });
                });
            }

            // Handle bookmark button click
            if (bookmarkButton) {
                bookmarkButton.addEventListener('click', (e) => {
                    e.stopPropagation();
                    bookmarkContainer.classList.toggle('bookmark_container_active');
                    document.body.classList.toggle('bookmark_button_active');
                    this.loadBookmarks();
                });
            }

            // Handle clicks outside bookmark container
            document.addEventListener('click', (e) => {
                if (bookmarkContainer && !bookmarkContainer.contains(e.target) &&
                    !bookmarkButton.contains(e.target) &&
                    bookmarkContainer.classList.contains('bookmark_container_active')) {
                    bookmarkContainer.classList.remove('bookmark_container_active');
                    document.body.classList.remove('bookmark_button_active');
                }
            });
        }
    };
})();

// Initialize bookmarks when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    BookmarksManager.initBookmarks();
});
