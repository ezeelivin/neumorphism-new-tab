// Todo List Manager
const TodoManager = (() => {
    // Private variables
    let todoBtn;
    let todoContainer;
    let todoList;
    let addTodoBtn;
    let addTodoForm;
    let todoInput;
    let saveTodoBtn;
    let showTodoToggle;
    let todos = [];

    // Initialize DOM elements
    function _initializeElements() {
        todoBtn = document.querySelector('.todoBtn');
        todoContainer = document.querySelector('.todo-container');
        todoList = document.querySelector('.todo-list');
        addTodoBtn = document.querySelector('.add-todo-btn');
        addTodoForm = document.querySelector('.add-todo-form');
        todoInput = document.querySelector('.todo-input');
        saveTodoBtn = document.querySelector('.save-todo-btn');
        showTodoToggle = document.getElementById('showTodoToggle');

        // Load saved todo items
        todos = JSON.parse(localStorage.getItem('todos')) || [];

        // Load saved todo toggle state
        const savedTodoVisible = localStorage.getItem('todoVisible') === 'true';

        // Set initial state
        if (showTodoToggle) {
            showTodoToggle.checked = savedTodoVisible;
            if (!savedTodoVisible && todoBtn) {
                todoBtn.style.display = 'none';
            }
        }
    }

    // Save todos to localStorage
    function _saveTodos() {
        localStorage.setItem('todos', JSON.stringify(todos));
    }

    // Render todos
    function _renderTodos() {
        if (!todoList) return;

        todoList.innerHTML = '';
        todos.forEach(todo => {
            const todoItem = document.createElement('div');
            todoItem.className = `todo-item ${todo.completed ? 'completed' : ''}`;
            todoItem.innerHTML = `
                <input type="checkbox" ${todo.completed ? 'checked' : ''}>
                <span>${todo.text}</span>
                <button class="delete-todo">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                    </svg>
                </button>
            `;

            // Handle checkbox change
            const checkbox = todoItem.querySelector('input[type="checkbox"]');
            checkbox.addEventListener('change', () => {
                todo.completed = checkbox.checked;
                todoItem.classList.toggle('completed', todo.completed);
                _saveTodos();
            });

            // Handle delete button
            const deleteBtn = todoItem.querySelector('.delete-todo');
            deleteBtn.addEventListener('click', () => {
                todos = todos.filter(t => t.id !== todo.id);
                _saveTodos();
                _renderTodos();
            });

            todoList.appendChild(todoItem);
        });
    }

    // Setup event listeners
    function _setupEventListeners() {
        // Handle todo toggle change
        if (showTodoToggle) {
            showTodoToggle.addEventListener('change', () => {
                const isChecked = showTodoToggle.checked;
                if (todoBtn) {
                    todoBtn.style.display = isChecked ? 'block' : 'none';
                }
                localStorage.setItem('todoVisible', isChecked);
            });
        }

        // Toggle todo container
        if (todoBtn) {
            todoBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                todoContainer.classList.toggle('active');
                document.body.classList.toggle('todoBtnActive');
            });
        }

        // Close todo container when clicking outside
        document.addEventListener('click', (e) => {
            if (todoContainer && !todoContainer.contains(e.target) && !todoBtn.contains(e.target)) {
                todoContainer.classList.remove('active');
                document.body.classList.remove('todoBtnActive');
            }
        });

        // Prevent clicks inside todo container from closing it
        if (todoContainer) {
            todoContainer.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }

        // Toggle add todo form
        if (addTodoBtn) {
            addTodoBtn.addEventListener('click', () => {
                addTodoForm.style.display = addTodoForm.style.display === 'flex' ? 'none' : 'flex';
                if (addTodoForm.style.display === 'flex') {
                    todoInput.focus();
                }
            });
        }

        // Save todo item
        if (saveTodoBtn) {
            saveTodoBtn.addEventListener('click', () => {
                const text = todoInput.value.trim();
                if (text) {
                    const todo = {
                        id: Date.now(),
                        text,
                        completed: false
                    };
                    todos.push(todo);
                    _saveTodos();
                    _renderTodos();
                    todoInput.value = '';
                    addTodoForm.style.display = 'none';
                }
            });
        }

        // Handle todo input enter key
        if (todoInput) {
            todoInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    saveTodoBtn.click();
                }
            });
        }
    }

    // Public API
    return {
        init() {
            _initializeElements();
            _setupEventListeners();
            _renderTodos();
        },

        refreshTodos() {
            _renderTodos();
        }
    };
})();

// Initialize TodoManager when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    TodoManager.init();
});