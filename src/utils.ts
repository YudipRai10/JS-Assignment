interface CreateTaskProps {
  value: string;
  renderDeleteBtn: (task: HTMLElement) => HTMLButtonElement;
  renderEditBtn: (task: HTMLElement) => HTMLButtonElement;
}

export function addDragEvent(task: HTMLElement) {
  task.addEventListener("dragstart", () => {
    task.classList.add("is-dragging");
  });
  task.addEventListener("dragend", () => {
    task.classList.remove("is-dragging");
  });
}

// Helper function to create new task UI
export function createTaskElement({
  value,
  renderDeleteBtn,
  renderEditBtn,
}: CreateTaskProps): HTMLElement {
  const newTask = document.createElement("div");
  newTask.classList.add("task");
  newTask.setAttribute("draggable", "true");

  const span = createSpan(value);

  const btnContainer = document.createElement("div");
  btnContainer.classList.add("btnContainer");
  const deleteBtn = renderDeleteBtn(newTask);
  const editBtn = renderEditBtn(newTask);

  btnContainer.appendChild(editBtn);
  btnContainer.appendChild(deleteBtn);

  newTask.appendChild(span);
  newTask.appendChild(btnContainer);

  // add class name for styles and tracking while dragging
  addDragEvent(newTask);

  return newTask;
}

// Helper function to create span for text
export function createSpan(value: string) {
  const span = document.createElement("span");
  span.classList.add("spanText");
  span.textContent = value;

  return span;
}

// Helper function to create delete button
export function createDeleteBtn() {
  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("deleteBtn");
  // deleteBtn.innerHTML = `
  //   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="#f00" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m18 9l-.84 8.398c-.127 1.273-.19 1.909-.48 2.39a2.5 2.5 0 0 1-1.075.973C15.098 21 14.46 21 13.18 21h-2.36c-1.279 0-1.918 0-2.425-.24a2.5 2.5 0 0 1-1.076-.973c-.288-.48-.352-1.116-.48-2.389L6 9m7.5 6.5v-5m-3 5v-5m-6-4h4.615m0 0l.386-2.672c.112-.486.516-.828.98-.828h3.038c.464 0 .867.342.98.828l.386 2.672m-5.77 0h5.77m0 0H19.5"/></svg>
  // `;
  deleteBtn.innerHTML = `
    <i class="fa-solid fa-trash fa-lg" style="color: #db3939;"></i>
  `;

  return deleteBtn;
}

//  Helper function to create edit button
export function createEditBtn() {
  const editBtn = document.createElement("button");
  editBtn.classList.add("editBtn");
  editBtn.innerHTML = `
   <i class="fa-solid fa-pen-to-square fa-lg"></i>
  `;
  return editBtn;
}

// Helper function to update live counts for each column
export function updateTaskCounts() {
  const columns = ["todo", "doing", "done"];

  columns.forEach((col) => {
    const columnElement = document.getElementById(`${col}-column`);
    const countElement = document.getElementById(`${col}-count`);

    if (columnElement && countElement) {
      const totalTaskLength = columnElement.querySelectorAll(".task").length;
      countElement.textContent = totalTaskLength.toString(); // dispay length of each column
    }
  });
}

/* todo.ts */
// Helper function to return task below the mouse pointer
export function insertAboveTask(column: HTMLElement, mouseY: number) {
  const tasks = column.querySelectorAll(
    ".task:not(.is-dragging)"
  ) as NodeListOf<HTMLElement>;

  let closestTask: HTMLElement | null = null;
  let closestOffSet = Number.NEGATIVE_INFINITY; // safe starting point

  // find the task with offset closest to 0
  tasks.forEach((task) => {
    const { top } = task.getBoundingClientRect();
    const offset = mouseY - top;

    if (offset < 0 && offset > closestOffSet) {
      closestTask = task;
      closestOffSet = offset;
    }
  });

  return closestTask;
}
