import {
  createDeleteBtn,
  createEditBtn,
  createTaskElement,
  updateTaskCounts,
} from "./utils.js";

interface TaskProps {
  text: string;
  columnId: string;
}

const form = document.getElementById("todo-form") as HTMLFormElement;
const input = document.getElementById("todo-input") as HTMLInputElement;
const todoColumn = document.getElementById("todo-column") as HTMLElement;
const submitBtn = document.querySelector(".submitBtn") as HTMLElement;

let editTask: HTMLElement | null = null;

getTaskFromLocalStorage();
updateTaskCounts();

// Form submission
form.addEventListener("submit", (e: SubmitEvent) => {
  e.preventDefault();

  const value = input.value.trim();
  if (value === "") return; //exit if no input value

  if (editTask) {
    updateTask(editTask, value);
    input.blur();
  } else {
    renderNewTask(value);
  }

  resetForm();
  updateTaskCounts();
});

// Edit and set the new input value
function updateTask(task: HTMLElement | null, value: string) {
  if (!task) return;
  const span = task.querySelector("span") as HTMLSpanElement;
  if (span) span.textContent = value;
  saveTaskToLocalStorage();
}

function renderNewTask(value: string) {
  const newTask = createTaskElement({ value, renderDeleteBtn, renderEditBtn });
  todoColumn.appendChild(newTask);
  saveTaskToLocalStorage();
}

function resetForm() {
  editTask = null;
  input.value = "";
  submitBtn.textContent = "Add";
}


function renderDeleteBtn(task: HTMLElement) {
  const deleteBtn = createDeleteBtn();

  deleteBtn.addEventListener("click", () => {
    const confirmDeletion = confirm(
      "Are you sure you want to delete this task?"
    );
    if (!confirmDeletion) return;

    // if true
    task.remove();
    updateTaskCounts();
    saveTaskToLocalStorage();
  });

  return deleteBtn;
}


function renderEditBtn(task: HTMLElement) {
  const editBtn = createEditBtn();

  editBtn.addEventListener("click", () => {
    const span = task.querySelector("span");

    editTask = task;
    input.value = span?.textContent || "";
    input.focus();
    submitBtn.textContent = "Update";
  });

  return editBtn;
}

// localStorage handling
export function saveTaskToLocalStorage() {
  const allTasks: TaskProps[] = [];

  const columns = document.querySelectorAll(
    ".column"
  ) as NodeListOf<HTMLElement>;

  columns.forEach((column) => {
    const columnId = column.id;
    const tasks = column.querySelectorAll(
      ".task span"
    ) as NodeListOf<HTMLSpanElement>;

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
  if (!savedTasks) return;

  const oldTasks = JSON.parse(savedTasks);

  oldTasks.forEach(({ columnId, text }: TaskProps) => {
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
