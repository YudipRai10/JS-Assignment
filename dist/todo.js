import { createDeleteBtn, createEditBtn, createTaskElement, updateTaskCounts, } from "./utils.js";
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
// Edit and set the new input value
function updateTask(task, value) {
    if (!task)
        return;
    const span = task.querySelector("span");
    if (span)
        span.textContent = value;
    saveTaskToLocalStorage();
}
function renderNewTask(value) {
    const newTask = createTaskElement({ value, renderDeleteBtn, renderEditBtn });
    todoColumn.appendChild(newTask);
    saveTaskToLocalStorage();
}
function resetForm() {
    editTask = null;
    input.value = "";
    submitBtn.textContent = "Add";
}
function renderDeleteBtn(task) {
    const deleteBtn = createDeleteBtn();
    deleteBtn.addEventListener("click", () => {
        const confirmDeletion = confirm("Are you sure you want to delete this task?");
        if (!confirmDeletion)
            return;
        // if true
        task.remove();
        updateTaskCounts();
        saveTaskToLocalStorage();
    });
    return deleteBtn;
}
function renderEditBtn(task) {
    const editBtn = createEditBtn();
    editBtn.addEventListener("click", () => {
        const span = task.querySelector("span");
        editTask = task;
        input.value = (span === null || span === void 0 ? void 0 : span.textContent) || "";
        input.focus();
        submitBtn.textContent = "Update";
    });
    return editBtn;
}
// localStorage handling
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
export function getTaskFromLocalStorage() {
    const savedTasks = localStorage.getItem("kanban");
    if (!savedTasks)
        return;
    const oldTasks = JSON.parse(savedTasks);
    oldTasks.forEach(({ columnId, text }) => {
        const column = document.getElementById(columnId);
        if (column) {
            const renderTask = createTaskElement({
                value: text,
                renderDeleteBtn,
                renderEditBtn,
            });
            column.appendChild(renderTask);
        }
    });
}
