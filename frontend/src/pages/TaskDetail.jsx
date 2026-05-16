import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useTask, useUpdateTask } from "../api/hooks/useTasks.js";
import CommentSection from "../components/CommentSection.jsx";
import { priorityStyles, statusLabels } from "../utils/formatters.js";

export default function TaskDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: task } = useTask(id);
  const updateTask = useUpdateTask();
  const [form, setForm] = useState({ title: "", description: "", status: "todo", priority: "medium", due_date: "" });

  useEffect(() => {
    if (task) setForm({ title: task.title, description: task.description, status: task.status, priority: task.priority, due_date: task.due_date || "" });
  }, [task]);

  const submit = async (e) => {
    e.preventDefault();
    const payload = user?.role === "admin" ? { ...form, due_date: form.due_date || null } : { status: form.status };
    await updateTask.mutateAsync({ id, payload });
    toast.success("Task updated");
  };

  const remove = async () => {
    if (!window.confirm("Delete this task and its comments?")) return;
    await api.delete(`/api/tasks/${id}`);
    toast.success("Task deleted");
    navigate(`/projects/${task.project_id}`);
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <Link to={task ? `/projects/${task.project_id}` : "/projects"} className="inline-flex items-center gap-2 text-sm font-black text-slate-500 hover:text-slate-950">
        <ArrowLeft size={17} /> Back to project
      </Link>

      <section className="rounded-[2rem] bg-gradient-to-br from-slate-950 to-indigo-950 p-6 text-white shadow-glow">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.22em] text-indigo-200">Task detail</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight">{task?.title || "Task"}</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-black text-indigo-100">{statusLabels[task?.status] || "Status"}</span>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-slate-950">{task?.priority || "priority"}</span>
              {task?.due_date && <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-black text-indigo-100">Due {task.due_date}</span>}
            </div>
          </div>
          {user?.role === "admin" && <button className="rounded-full bg-rose-500 px-4 py-2 text-sm font-black text-white hover:bg-rose-600" onClick={remove}><Trash2 size={17} className="inline" /> Delete</button>}
        </div>
      </section>

      <section className="premium-card rounded-3xl p-5">
        <form className="grid gap-4" onSubmit={submit}>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="field-label md:col-span-2">Title<input className="input" disabled={user?.role !== "admin"} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></label>
            <label className="field-label md:col-span-2">Description<textarea className="input min-h-32 resize-y" disabled={user?.role !== "admin"} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label>
            <label className="field-label">Status<select className="input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}><option value="todo">To do</option><option value="in_progress">In progress</option><option value="done">Done</option></select></label>
            <label className="field-label">Priority<select className={`input ${priorityStyles[form.priority] || ""}`} disabled={user?.role !== "admin"} value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></label>
            <label className="field-label">Due date<input className="input" disabled={user?.role !== "admin"} type="date" value={form.due_date} onChange={(e) => setForm({ ...form, due_date: e.target.value })} /></label>
          </div>
          <button className="btn-primary justify-self-start" disabled={updateTask.isPending}><Save size={17} /> {updateTask.isPending ? "Saving..." : "Save changes"}</button>
        </form>
      </section>

      <CommentSection taskId={id} />
    </div>
  );
}
