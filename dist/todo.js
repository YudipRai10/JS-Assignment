import { addDragEvent, updateTaskCounts } from "./utils.js";
const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const todoColumn = document.getElementById("todo-column");
const submitBtn = document.querySelector(".submitBtn");
let editTask = null;
getTaskFromLocalStorage();
updateTaskCounts();
// Form submission
form.addEventListener("submit", (e) => {
    e.preventDefault();
    const value = input.value.trim();
    if (value === "")
        return; //exit if no input value
    if (editTask) {
        updateTask(editTask, value);
        input.blur();
    }
    else {
        renderNewTask(value);
    }
    resetForm();
    updateTaskCounts();
});
function updateTask(task, value) {
    if (!task)
        return;
    const span = task.querySelector("span");
    if (span)
        span.textContent = value; // edit and set the input value
    saveTaskToLocalStorage();
}
// helper function to create new task UI
function createTaskElement(value) {
    const newTask = document.createElement("div");
    newTask.classList.add("task");
    newTask.setAttribute("draggable", "true");
    const span = createSpan(value);
    const btnContainer = document.createElement("div");
    const deleteBtn = renderDeleteBtn(newTask);
    const editBtn = renderEditBtn(newTask);
    btnContainer.appendChild(editBtn);
    btnContainer.appendChild(deleteBtn);
    newTask.appendChild(span);
    newTask.appendChild(btnContainer);
    // add class name and for styles and tracking while dragging
    addDragEvent(newTask);
    return newTask;
}
function renderNewTask(value) {
    const newTask = createTaskElement(value);
    todoColumn.appendChild(newTask);
    saveTaskToLocalStorage();
}
// Helper function create span for text 
function createSpan(value) {
    const span = document.createElement("span");
    span.classList.add("spanText");
    span.textContent = value;
    return span;
}
function resetForm() {
    editTask = null;
    input.value = "";
    submitBtn.textContent = "Add";
}
// Create Delete Button
function renderDeleteBtn(task) {
    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("deleteBtn");
    deleteBtn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="#f00" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m18 9l-.84 8.398c-.127 1.273-.19 1.909-.48 2.39a2.5 2.5 0 0 1-1.075.973C15.098 21 14.46 21 13.18 21h-2.36c-1.279 0-1.918 0-2.425-.24a2.5 2.5 0 0 1-1.076-.973c-.288-.48-.352-1.116-.48-2.389L6 9m7.5 6.5v-5m-3 5v-5m-6-4h4.615m0 0l.386-2.672c.112-.486.516-.828.98-.828h3.038c.464 0 .867.342.98.828l.386 2.672m-5.77 0h5.77m0 0H19.5"/></svg>
  `;
    deleteBtn.addEventListener("click", () => {
        const confirmDeletion = confirm("Are you sure you want to delete this task?");
        if (!confirmDeletion)
            return;
        task.remove(); // if true
        updateTaskCounts();
        saveTaskToLocalStorage();
    });
    return deleteBtn;
}
// Create Render Button
function renderEditBtn(task) {
    const editBtn = document.createElement("button");
    editBtn.classList.add("editBtn");
    editBtn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m5 16l-1 4l4-1L19.586 7.414a2 2 0 0 0 0-2.828l-.172-.172a2 2 0 0 0-2.828 0zM15 6l3 3m-5 11h8"/></svg>
  `;
    editBtn.addEventListener("click", () => {
        const span = task.querySelector("span");
        editTask = task;
        input.value = (span === null || span === void 0 ? void 0 : span.textContent) || "";
        input.focus();
        submitBtn.textContent = "Update";
    });
    return editBtn;
}
export function saveTaskToLocalStorage() {
    const allTasks = [];
    const columns = document.querySelectorAll(".column");
    columns.forEach((column) => {
        const columnId = column.id;
        const tasks = column.querySelectorAll(".task span");
        tasks.forEach((task) => {
            const text = task.textContent || "";
            if (text) {
                allTasks.push({ columnId, text });
            }
        });
    });
    localStorage.setItem("kanban", JSON.stringify(allTasks));
}
function getTaskFromLocalStorage() {
    const savedTasks = localStorage.getItem("kanban");
    if (!savedTasks)
        return;
    const oldTasks = JSON.parse(savedTasks);
    oldTasks.forEach((task) => {
        const column = document.getElementById(task.columnId);
        if (column) {
            const renderTask = createTaskElement(task.text);
            column.appendChild(renderTask);
        }
    });
}
