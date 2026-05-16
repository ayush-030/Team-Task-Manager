import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { useProjects } from "../api/hooks/useProjects.js";
import { useAllProjectTasks } from "../api/hooks/useTasks.js";
import EmptyState from "../components/ui/EmptyState.jsx";
import { isOverdue, priorityStyles, statusLabels } from "../utils/formatters.js";

export default function Tasks() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const { data: projects = [] } = useProjects();
  const { tasks, isLoading } = useAllProjectTasks(projects);

  const filtered = useMemo(() => tasks.filter((task) => {
    const matchesQuery = task.title.toLowerCase().includes(query.toLowerCase()) || task.description.toLowerCase().includes(query.toLowerCase());
    const matchesStatus = status === "all" || task.status === status;
    return matchesQuery && matchesStatus;
  }), [tasks, query, status]);

  return (
    <div className="space-y-6">
      <section className="premium-card rounded-3xl p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-950">All tasks</h2>
            <p className="text-sm font-semibold text-slate-500">A cross-project view of your visible work.</p>
          </div>
          <div className="flex flex-1 flex-wrap justify-end gap-3">
            <div className="relative min-w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input className="input pl-10" placeholder="Search tasks" value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>
            <select className="input w-44" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="all">All statuses</option>
              <option value="todo">To do</option>
              <option value="in_progress">In progress</option>
              <option value="review">Review</option>
              <option value="blocked">Blocked</option>
              <option value="done">Done</option>
            </select>
          </div>
        </div>
      </section>

      {isLoading ? <p className="font-bold text-slate-500">Loading tasks...</p> : filtered.length ? (
        <section className="grid gap-3">
          {filtered.map((task) => (
            <Link key={task.id} to={`/tasks/${task.id}`} className="premium-card flex flex-wrap items-center justify-between gap-4 rounded-3xl p-5 transition hover:-translate-y-0.5 hover:shadow-soft">
              <div className="min-w-0">
                <h3 className="font-black text-slate-950">{task.title}</h3>
                <p className="mt-1 line-clamp-1 text-sm font-semibold text-slate-500">{task.description || "No description"}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">{statusLabels[task.status]}</span>
                <span className={`rounded-full px-3 py-1 text-xs font-black ring-1 ${priorityStyles[task.priority]}`}>{task.priority}</span>
                {task.due_date && <span className={`rounded-full px-3 py-1 text-xs font-black ${isOverdue(task) ? "bg-rose-50 text-rose-700" : "bg-amber-50 text-amber-700"}`}>{task.due_date}</span>}
              </div>
            </Link>
          ))}
        </section>
      ) : <EmptyState title="No tasks found" description="Try another search or create a task inside a project." />}
    </div>
  );
}
