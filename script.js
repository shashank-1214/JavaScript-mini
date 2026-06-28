const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");
const clearCompleted = document.getElementById("clearCompleted");
const filterBtns = document.querySelectorAll(".filter-btn");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

// Add Task
addBtn.addEventListener("click", addTask);

taskInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        addTask();
    }
});

function addTask() {

    const text = taskInput.value.trim();

    if (text === "") {
        alert("Please enter a task.");
        return;
    }

    tasks.push({
        id: Date.now(),
        text: text,
        completed: false
    });

    taskInput.value = "";

    saveTasks();
    renderTasks();
}

// Render Tasks
function renderTasks() {

    taskList.innerHTML = "";

    let filteredTasks = tasks;

    if (currentFilter === "completed") {
        filteredTasks = tasks.filter(task => task.completed);
    }

    if (currentFilter === "pending") {
        filteredTasks = tasks.filter(task => !task.completed);
    }

    filteredTasks.forEach(task => {

        const li = document.createElement("li");
        li.className = task.completed ? "task completed" : "task";

        li.innerHTML = `
            <div class="left">
                <input
                    type="checkbox"
                    ${task.completed ? "checked" : ""}
                    onchange="toggleTask(${task.id})">

                <span>${task.text}</span>
            </div>

            <div class="actions">

                <button
                    class="edit"
                    onclick="editTask(${task.id})">

                    <i class="fa-solid fa-pen"></i>

                </button>

                <button
                    class="delete"
                    onclick="deleteTask(${task.id})">

                    <i class="fa-solid fa-trash"></i>

                </button>

            </div>
        `;

        taskList.appendChild(li);

    });

    updateCount();

}

// Toggle Complete
function toggleTask(id) {

    tasks = tasks.map(task => {

        if (task.id === id) {
            task.completed = !task.completed;
        }

        return task;

    });

    saveTasks();
    renderTasks();

}

// Delete
function deleteTask(id) {

    if (confirm("Delete this task?")) {

        tasks = tasks.filter(task => task.id !== id);

        saveTasks();
        renderTasks();

    }

}

// Edit
function editTask(id) {

    const task = tasks.find(task => task.id === id);

    const updated = prompt("Edit Task", task.text);

    if (updated !== null && updated.trim() !== "") {

        task.text = updated.trim();

        saveTasks();
        renderTasks();

    }

}

// Task Count
function updateCount() {

    taskCount.textContent = tasks.length;

}

// Local Storage
function saveTasks() {

    localStorage.setItem("tasks", JSON.stringify(tasks));

}

// Clear Completed
clearCompleted.addEventListener("click", () => {

    tasks = tasks.filter(task => !task.completed);

    saveTasks();
    renderTasks();

});

// Filters
filterBtns.forEach(btn => {

    btn.addEventListener("click", () => {

        filterBtns.forEach(button =>
            button.classList.remove("active")
        );

        btn.classList.add("active");

        currentFilter = btn.dataset.filter;

        renderTasks();

    });

});

// Initial Load
renderTasks();