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
