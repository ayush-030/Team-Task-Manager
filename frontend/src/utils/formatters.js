export const statusLabels = {
  todo: "To do",
  in_progress: "In progress",
  review: "Review",
  blocked: "Blocked",
  done: "Done",
};

export const statusStyles = {
  todo: "bg-slate-100 text-slate-700 ring-slate-200",
  in_progress: "bg-amber-50 text-amber-700 ring-amber-200",
  review: "bg-sky-50 text-sky-700 ring-sky-200",
  blocked: "bg-rose-50 text-rose-700 ring-rose-200",
  done: "bg-emerald-50 text-emerald-700 ring-emerald-200",
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

export function checklistPct(checklist = []) {
  if (!checklist.length) return 0;
  return Math.round((checklist.filter((item) => item.completed).length / checklist.length) * 100);
}
