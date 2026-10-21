
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const errorMsg = document.getElementById('errorMsg');
const taskList = document.getElementById('taskList');
const taskCounter = document.getElementById('taskCounter');
const emptyState = document.getElementById('emptyState');
const clearCompletedBtn = document.getElementById('clearCompletedBtn');
const filterBtns = document.querySelectorAll('.filter-btn');

let tasks = [];
let currentFilter = 'all';


addTaskBtn.addEventListener('click', handleAddTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleAddTask();
    }
});

clearCompletedBtn.addEventListener('click', handleClearCompleted);

filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        filterBtns.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        currentFilter = e.target.getAttribute('data-filter');
        renderTasks();
    });
});


function handleAddTask() {
    const taskText = taskInput.value.trim();

   
    if (taskText === '') {
        showError('Task cannot be empty or contain only spaces.');
        return;
    }

    hideError();

    const newTask = {
        id: Date.now().toString(),
        text: taskText,
        completed: false
    };

    tasks.push(newTask);
    taskInput.value = '';
    renderTasks();
}

function showError(message) {
    errorMsg.textContent = message;
    errorMsg.style.display = 'block';
}

function hideError() {
    errorMsg.textContent = '';
    errorMsg.style.display = 'none';
}

function toggleTask(id) {
    tasks = tasks.map(task => {
        if (task.id === id) {
            return { ...task, completed: !task.completed };
        }
        return task;
    });
    renderTasks();
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    renderTasks();
}

function handleClearCompleted() {
    tasks = tasks.filter(task => !task.completed);
    renderTasks();
}

function getFilteredTasks() {
    if (currentFilter === 'active') {
        return tasks.filter(task => !task.completed);
    } else if (currentFilter === 'completed') {
        return tasks.filter(task => task.completed);
    }
    return tasks;
}

function updateCounter() {
    const remainingCount = tasks.filter(task => !task.completed).length;
    taskCounter.textContent = `${remainingCount} remaining`;
}

function renderTasks() {
    taskList.innerHTML = '';
    const filteredTasks = getFilteredTasks();

    if (tasks.length === 0) {
        emptyState.textContent = 'No tasks yet. Add your first task!';
        emptyState.style.display = 'block';
    } else if (filteredTasks.length === 0) {
        emptyState.textContent = `No ${currentFilter} tasks found.`;
        emptyState.style.display = 'block';
    } else {
        emptyState.style.display = 'none';
    }

    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `list-group-item d-flex justify-content-between align-items-center py-2 px-3 ${task.completed ? 'completed-task bg-light' : ''}`;
        
        li.innerHTML = `
            <div class="form-check d-flex align-items-center gap-2 m-0">
                <input class="form-check-input mt-0" type="checkbox" ${task.completed ? 'checked' : ''} id="checkbox-${task.id}" onchange="toggleTask('${task.id}')">
                <label class="form-check-label task-text ${task.completed ? 'text-muted text-decoration-line-through' : ''}" for="checkbox-${task.id}">
                    ${escapeHTML(task.text)}
                </label>
            </div>
            <button class="btn btn-danger btn-sm" onclick="deleteTask('${task.id}')">Delete</button>
        `;

        taskList.appendChild(li);
    });

    updateCounter();
}


function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
}


renderTasks();