import { insertAboveTask, updateTaskCounts } from "./utils.js";

const dropZones = document.querySelectorAll(
  ".column"
) as NodeListOf<HTMLElement>;

dropZones.forEach((column: HTMLElement) => {
  column.addEventListener("dragover", (e: DragEvent) => {
    e.preventDefault(); // allow dropping

    const currentTask = document.querySelector(
      ".is-dragging"
    ) as HTMLElement | null; // current task that is being dragged
    if (!currentTask) return;

    const bottomTask = insertAboveTask(column, e.clientY);
    bottomTask
      ? column.insertBefore(currentTask, bottomTask)
      : column.appendChild(currentTask);

    updateTaskCounts();
    saveTaskToLocalStorage();
  });
});


