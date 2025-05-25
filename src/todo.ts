import { addDragEvent, updateTaskCounts } from "./utils.js";

interface TaskProps {
  text: string;
  columnId: string;
}

const form = document.getElementById("todo-form") as HTMLFormElement;
const input = document.getElementById("todo-input") as HTMLInputElement;
const todoColumn = document.getElementById("todo-column") as HTMLElement;
const submitBtn = document.querySelector(".submitBtn") as HTMLElement;

let editTask: HTMLElement | null = null;

updateTaskCounts();

form.addEventListener("submit", (e: SubmitEvent) => {
  e.preventDefault();

  const value = input.value.trim();
  if (value === "") return;

  if (editTask) {
    updateTask(editTask, value);
    input.blur();
  } else {
    createNewTask(value);
  }

  resetForm();
  updateTaskCounts();
});

function updateTask(task: HTMLElement | null, value: string) {
  if (!task) return;
  const span = task.querySelector("span") as HTMLSpanElement;
  if (span) span.textContent = value;
}

function createTaskElement(value: string): HTMLElement {
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

  addDragEvent(newTask);

  return newTask;
}

function createNewTask(value: string) {
  const newTask = createTaskElement(value);
  todoColumn.appendChild(newTask);
}

function createSpan(value: string) {
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

function renderDeleteBtn(task: HTMLElement) {
  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("deleteBtn");
  deleteBtn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="#f00" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m18 9l-.84 8.398c-.127 1.273-.19 1.909-.48 2.39a2.5 2.5 0 0 1-1.075.973C15.098 21 14.46 21 13.18 21h-2.36c-1.279 0-1.918 0-2.425-.24a2.5 2.5 0 0 1-1.076-.973c-.288-.48-.352-1.116-.48-2.389L6 9m7.5 6.5v-5m-3 5v-5m-6-4h4.615m0 0l.386-2.672c.112-.486.516-.828.98-.828h3.038c.464 0 .867.342.98.828l.386 2.672m-5.77 0h5.77m0 0H19.5"/></svg>
  `;

  deleteBtn.addEventListener("click", () => {
    const confirmed = confirm("Are you sure you want to delete this task?");
    if (!confirmed) return;
    task.remove();
    updateTaskCounts();
  });

  return deleteBtn;
}

function renderEditBtn(task: HTMLElement) {
  const editBtn = document.createElement("button");
  editBtn.classList.add("editBtn");
  editBtn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m5 16l-1 4l4-1L19.586 7.414a2 2 0 0 0 0-2.828l-.172-.172a2 2 0 0 0-2.828 0zM15 6l3 3m-5 11h8"/></svg>
  `;

  editBtn.addEventListener("click", () => {
    const span = task.querySelector("span");
    if (!task || !span) return;

    editTask = task;
    input.value = span.textContent || "";
    input.focus();
    submitBtn.textContent = "Update";
  });

  return editBtn;
}
