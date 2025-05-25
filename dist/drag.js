import { addDragEvent, updateTaskCounts } from "./utils.js";
const draggables = document.querySelectorAll(".task");
const droppables = document.querySelectorAll(".column");
// add class name and for styles while dragging
draggables.forEach((task) => {
    addDragEvent(task);
});
droppables.forEach((column) => {
    let dropZone = column;
    dropZone.addEventListener("dragover", (e) => {
        e.preventDefault(); // allow dropping
        const currentTask = document.querySelector(".is-dragging"); // current task that is being dragged
        if (!currentTask)
            return;
        const bottomTask = insertAboveTask(dropZone, e.clientY);
        bottomTask
            ? column.insertBefore(currentTask, bottomTask)
            : column.appendChild(currentTask);
        updateTaskCounts();
    });
});
const insertAboveTask = (zone, mouseY) => {
    const elements = zone.querySelectorAll(".task:not(.is-dragging)"); // select all tasks except the dragged task
    let closestTask = null;
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
