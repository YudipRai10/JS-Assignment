import { addDragEvent, updateTaskCounts } from "./utils.js";

const draggables = document.querySelectorAll(
  ".task"
) as NodeListOf<HTMLElement>;
const droppables = document.querySelectorAll(
  ".column"
) as NodeListOf<HTMLElement>;

// add class name and for styles while dragging
draggables.forEach((task) => {
  addDragEvent(task);
});

droppables.forEach((column) => {
  let dropZone = column as HTMLElement;
  dropZone.addEventListener("dragover", (e: DragEvent) => {
    e.preventDefault(); // allow dropping

    const currentTask = document.querySelector(
      ".is-dragging"
    ) as HTMLElement | null; // current task that is being dragged
    if (!currentTask) return;

    const bottomTask = insertAboveTask(dropZone, e.clientY);
    bottomTask
      ? column.insertBefore(currentTask, bottomTask)
      : column.appendChild(currentTask);

    updateTaskCounts();
  });
});

const insertAboveTask = (zone: HTMLElement, mouseY: number) => {
  const elements = zone.querySelectorAll(
    ".task:not(.is-dragging)"
  ) as NodeListOf<HTMLElement>; // select all tasks except the dragged task

  let closestTask: HTMLElement | null = null;
  let closestOffSet = Number.NEGATIVE_INFINITY;

  elements.forEach((task) => {
    const { top } = task.getBoundingClientRect();
    const offset = mouseY - top;

    if (offset < 0 && offset > closestOffSet) {
      closestTask = task;
      closestOffSet = offset;
    }
  });

  return closestTask;
};
