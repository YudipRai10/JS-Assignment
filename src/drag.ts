import { saveTaskToLocalStorage } from "./todo.js";
import { updateTaskCounts } from "./utils.js";

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

// Helper function to return task below the mouse pointer
const insertAboveTask = (column: HTMLElement, mouseY: number) => {
  const tasks = column.querySelectorAll(
    ".task:not(.is-dragging)"
  ) as NodeListOf<HTMLElement>; // select all tasks except the dragged task

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
};
