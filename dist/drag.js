import { saveTaskToLocalStorage } from "./todo.js";
import { insertAboveTask, updateTaskCounts } from "./utils.js";
const dropZones = document.querySelectorAll(".column");
dropZones.forEach((column) => {
    column.addEventListener("dragover", (e) => {
        e.preventDefault(); // allow dropping
        const currentTask = document.querySelector(".is-dragging"); // current task that is being dragged
        if (!currentTask)
            return;
        const bottomTask = insertAboveTask(column, e.clientY);
        bottomTask
            ? column.insertBefore(currentTask, bottomTask)
            : column.appendChild(currentTask);
        updateTaskCounts();
        saveTaskToLocalStorage();
    });
});
