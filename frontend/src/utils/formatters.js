export const statusLabels = {
  todo: "To do",
  in_progress: "In progress",
  done: "Done",
};

export const priorityStyles = {
  low: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  medium: "bg-amber-50 text-amber-700 ring-amber-200",
  high: "bg-rose-50 text-rose-700 ring-rose-200",
};

export function initials(name = "User") {
  return name
    .split(/[.\s_-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "U";
}

export function isOverdue(task) {
  return task?.due_date && task.status !== "done" && new Date(task.due_date) < new Date(new Date().toDateString());
}

export function completionPct(tasks = []) {
  if (!tasks.length) return 0;
  return Math.round((tasks.filter((task) => task.status === "done").length / tasks.length) * 100);
}
