export function addDragEvent(task: HTMLElement) {
  task.addEventListener("dragstart", () => {
    task.classList.add("is-dragging");
  });
  task.addEventListener("dragend", () => {
    task.classList.remove("is-dragging");
  });
}

export function updateTaskCounts() {
  const columns = ["todo", "doing", "done"];

  columns.forEach((col) => {
    const columnElement = document.getElementById(`${col}-column`);
    const countElement = document.getElementById(`${col}-count`);

    if (columnElement && countElement) {
      const totalTaskLength = columnElement.querySelectorAll(".task").length;
      countElement.textContent = totalTaskLength.toString();
    }
  });
}
