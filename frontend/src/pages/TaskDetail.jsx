import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  AlertTriangle,
  ArrowLeft,
  Check,
  CheckCircle2,
  Circle,
  Clock3,
  Edit3,
  Eye,
  ListChecks,
  Loader2,
  MessageSquareText,
  Plus,
  Save,
  StickyNote,
  Trash2,
  X,
} from "lucide-react";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useProject } from "../api/hooks/useProjects.js";
import {
  useAddChecklistItem,
  useAddProgressNote,
  useDeleteChecklistItem,
  useDeleteProgressNote,
  useTask,
  useUpdateChecklistItem,
  useUpdateProgressNote,
  useUpdateTask,
} from "../api/hooks/useTasks.js";
import CommentSection from "../components/CommentSection.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import { Skeleton } from "../components/ui/Skeleton.jsx";
import { checklistPct, initials, priorityStyles, statusLabels, statusStyles } from "../utils/formatters.js";
import { isProjectAdmin } from "../utils/permissions.js";
import { relativeTime } from "../utils/relativeTime.js";

const statusOptions = ["todo", "in_progress", "review", "blocked", "done"];
const statusIcons = {
  todo: Circle,
  in_progress: Loader2,
  review: Eye,
  blocked: AlertTriangle,
  done: CheckCircle2,
};

function Timeline({ events = [] }) {
  const sorted = [...events].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  return (
    <section className="premium-card rounded-3xl p-5">
      <h3 className="flex items-center gap-2 text-xl font-black text-slate-950"><Clock3 size={20} /> Activity timeline</h3>
      <div className="mt-5 space-y-4">
        {sorted.length ? sorted.map((event) => (
          <motion.div key={event.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} className="flex gap-3">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-indigo-50 text-xs font-black text-indigo-700">{initials(event.user_name)}</div>
            <div className="min-w-0 rounded-2xl bg-slate-50 p-3">
              <p className="text-sm font-bold text-slate-700"><span className="font-black text-slate-950">{event.user_name}</span> {event.action}</p>
              <p className="mt-1 text-xs font-semibold text-slate-400">{relativeTime(event.created_at)}</p>
            </div>
          </motion.div>
        )) : <EmptyState title="No activity yet" description="Task movement, checklist changes, progress notes, and comments will appear here." />}
      </div>
    </section>
  );
}

function ChecklistSection({ taskId, items = [] }) {
  const [text, setText] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const addItem = useAddChecklistItem(taskId);
  const updateItem = useUpdateChecklistItem(taskId);
  const deleteItem = useDeleteChecklistItem(taskId);
  const completed = items.filter((item) => item.completed).length;
  const pct = checklistPct(items);

  const submit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    await addItem.mutateAsync(text);
    toast.success("Checklist item added");
    setText("");
  };

  const saveEdit = async (itemId) => {
    if (!editText.trim()) return;
    await updateItem.mutateAsync({ itemId, payload: { text: editText } });
    toast.success("Checklist item updated");
    setEditingId(null);
  };

  return (
    <section className="premium-card rounded-3xl p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="flex items-center gap-2 text-xl font-black text-slate-950"><ListChecks size={20} /> Checklist</h3>
          <p className="text-sm font-semibold text-slate-500">{completed} / {items.length} completed</p>
        </div>
        <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-black text-indigo-700">{pct}%</span>
      </div>
      <div className="mt-4 h-2 rounded-full bg-slate-100"><motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-400" /></div>

      <div className="mt-5 space-y-2">
        {items.length ? items.map((item) => (
          <motion.div key={item.id} layout className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3">
            <button
              className={`grid h-7 w-7 place-items-center rounded-full border ${item.completed ? "border-emerald-500 bg-emerald-500 text-white" : "border-slate-300 text-transparent"}`}
              onClick={() => updateItem.mutate({ itemId: item.id, payload: { completed: !item.completed } }, { onSuccess: () => toast.success("Checklist updated") })}
              title="Toggle checklist item"
            >
              <Check size={15} />
            </button>
            {editingId === item.id ? (
              <input className="input flex-1 py-2" value={editText} onChange={(e) => setEditText(e.target.value)} autoFocus />
            ) : (
              <span className={`flex-1 text-sm font-bold ${item.completed ? "text-slate-400 line-through" : "text-slate-700"}`}>{item.text}</span>
            )}
            {editingId === item.id ? (
              <>
                <button className="grid h-9 w-9 place-items-center rounded-2xl bg-emerald-50 text-emerald-700" onClick={() => saveEdit(item.id)}><Save size={15} /></button>
                <button className="grid h-9 w-9 place-items-center rounded-2xl bg-slate-50 text-slate-500" onClick={() => setEditingId(null)}><X size={15} /></button>
              </>
            ) : (
              <>
                <button className="grid h-9 w-9 place-items-center rounded-2xl bg-slate-50 text-slate-500 hover:bg-indigo-50 hover:text-indigo-700" onClick={() => { setEditingId(item.id); setEditText(item.text); }}><Edit3 size={15} /></button>
                <button className="grid h-9 w-9 place-items-center rounded-2xl bg-slate-50 text-slate-500 hover:bg-rose-50 hover:text-rose-700" onClick={() => deleteItem.mutate(item.id, { onSuccess: () => toast.success("Checklist item deleted") })}><Trash2 size={15} /></button>
              </>
            )}
          </motion.div>
        )) : <EmptyState title="No checklist items" description="Break the task into smaller pieces to make execution visible." />}
      </div>

      <form className="mt-4 flex gap-3" onSubmit={submit}>
        <input className="input" value={text} onChange={(e) => setText(e.target.value)} placeholder="Add checklist item" />
        <button className="btn-secondary shrink-0" disabled={addItem.isPending}><Plus size={17} /> Add</button>
      </form>
    </section>
  );
}

function ProgressNotes({ taskId, notes = [], currentUser }) {
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const addNote = useAddProgressNote(taskId);
  const updateNote = useUpdateProgressNote(taskId);
  const deleteNote = useDeleteProgressNote(taskId);

  const submit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    await addNote.mutateAsync(content);
    toast.success("Progress note added");
    setContent("");
  };

  const save = async (noteId) => {
    if (!editContent.trim()) return;
    await updateNote.mutateAsync({ noteId, content: editContent });
    toast.success("Progress note updated");
    setEditingId(null);
  };

  return (
    <section className="premium-card rounded-3xl p-5">
      <h3 className="flex items-center gap-2 text-xl font-black text-slate-950"><StickyNote size={20} /> Progress notes</h3>
      <div className="mt-5 space-y-3">
        {notes.length ? notes.map((note) => {
          const own = note.author_id === currentUser?.id;
          return (
            <motion.article key={note.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-[42px_1fr_auto] gap-3 rounded-2xl border border-slate-200 bg-white p-4">
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-indigo-50 text-sm font-black text-indigo-700">{initials(note.author_name)}</div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <strong className="text-sm font-black text-slate-950">{note.author_name}</strong>
                  <span className="text-xs font-semibold text-slate-400">{relativeTime(note.updated_at || note.created_at)}</span>
                </div>
                {editingId === note.id ? (
                  <textarea className="input mt-3 min-h-24 resize-y" value={editContent} onChange={(e) => setEditContent(e.target.value)} />
                ) : (
                  <p className="mt-2 text-sm leading-6 text-slate-600">{note.content}</p>
                )}
              </div>
              {own && (
                <div className="flex gap-2">
                  {editingId === note.id ? (
                    <button className="grid h-9 w-9 place-items-center rounded-2xl bg-emerald-50 text-emerald-700" onClick={() => save(note.id)}><Save size={15} /></button>
                  ) : (
                    <button className="grid h-9 w-9 place-items-center rounded-2xl bg-slate-50 text-slate-500 hover:bg-indigo-50 hover:text-indigo-700" onClick={() => { setEditingId(note.id); setEditContent(note.content); }}><Edit3 size={15} /></button>
                  )}
                  <button className="grid h-9 w-9 place-items-center rounded-2xl bg-slate-50 text-slate-500 hover:bg-rose-50 hover:text-rose-700" onClick={() => deleteNote.mutate(note.id, { onSuccess: () => toast.success("Progress note deleted") })}><Trash2 size={15} /></button>
                </div>
              )}
            </motion.article>
          );
        }) : <EmptyState title="No progress notes" description="Add implementation updates, blockers, or testing notes here." />}
      </div>
      <form className="mt-5 grid gap-3" onSubmit={submit}>
        <textarea className="input min-h-28 resize-y" value={content} onChange={(e) => setContent(e.target.value)} placeholder="Share a progress update..." />
        <button className="btn-primary justify-self-end" disabled={addNote.isPending}><MessageSquareText size={17} /> Add note</button>
      </form>
    </section>
  );
}

export default function TaskDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: task, isLoading } = useTask(id);
  const { data: project } = useProject(task?.project_id);
  const updateTask = useUpdateTask();
  const [form, setForm] = useState({ title: "", description: "", status: "todo", priority: "medium", due_date: "", blocked_reason: "" });

  useEffect(() => {
    if (task) setForm({ title: task.title, description: task.description, status: task.status, priority: task.priority, due_date: task.due_date || "", blocked_reason: task.blocked_reason || "" });
  }, [task]);

  const StatusIcon = statusIcons[form.status] || Circle;
  const canEditAdminFields = isProjectAdmin(project, user);
  const taskEvents = useMemo(() => task?.activity || [], [task]);

  const submit = async (e) => {
    e.preventDefault();
    if (form.status === "blocked" && !form.blocked_reason.trim()) return toast.error("Blocked tasks need a reason");
    const payload = canEditAdminFields
      ? { ...form, due_date: form.due_date || null, blocked_reason: form.blocked_reason || null }
      : { status: form.status, blocked_reason: form.blocked_reason || null };
    await updateTask.mutateAsync({ id, payload });
    toast.success("Task updated");
  };

  const remove = async () => {
    if (!window.confirm("Delete this task and its comments?")) return;
    await api.delete(`/api/tasks/${id}`);
    toast.success("Task deleted");
    navigate(`/projects/${task.project_id}`);
  };

  if (isLoading) {
    return <div className="mx-auto max-w-6xl space-y-5"><Skeleton className="h-40" /><Skeleton className="h-72" /></div>;
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <Link to={task ? `/projects/${task.project_id}` : "/projects"} className="inline-flex items-center gap-2 text-sm font-black text-slate-500 hover:text-slate-950">
        <ArrowLeft size={17} /> Back to project
      </Link>

      <section className="sticky top-24 z-10 rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-soft backdrop-blur-2xl">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.22em] text-indigo-600">Task execution</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">{task?.title || "Task"}</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-black ring-1 ${statusStyles[form.status]}`}><StatusIcon size={14} /> {statusLabels[form.status]}</span>
              <span className={`rounded-full px-3 py-1 text-xs font-black ring-1 ${priorityStyles[form.priority]}`}>{form.priority}</span>
              {task?.due_date && <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">Due {task.due_date}</span>}
            </div>
          </div>
          {canEditAdminFields && <button className="rounded-full bg-rose-500 px-4 py-2 text-sm font-black text-white hover:bg-rose-600" onClick={remove}><Trash2 size={17} className="inline" /> Delete</button>}
        </div>
      </section>

      {form.status === "blocked" && (
        <motion.section initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border border-rose-200 bg-rose-50 p-5 text-rose-800">
          <h3 className="flex items-center gap-2 text-lg font-black"><AlertTriangle size={20} /> Blocked task</h3>
          <p className="mt-2 text-sm font-bold">{form.blocked_reason || "Add a blocker reason so the team can resolve it."}</p>
        </motion.section>
      )}

      <section className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <div className="space-y-6">
          <section className="premium-card rounded-3xl p-5">
            <form className="grid gap-4" onSubmit={submit}>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="field-label md:col-span-2">Title<input className="input" disabled={!canEditAdminFields} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></label>
                <label className="field-label md:col-span-2">Description<textarea className="input min-h-32 resize-y" disabled={!canEditAdminFields} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label>
                <label className="field-label">Status<select className="input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>{statusOptions.map((status) => <option key={status} value={status}>{statusLabels[status]}</option>)}</select></label>
                <label className="field-label">Priority<select className={`input ${priorityStyles[form.priority] || ""}`} disabled={!canEditAdminFields} value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></label>
                <label className="field-label">Due date<input className="input" disabled={!canEditAdminFields} type="date" value={form.due_date} onChange={(e) => setForm({ ...form, due_date: e.target.value })} /></label>
                <label className="field-label">Blocked reason<input className="input" value={form.blocked_reason} onChange={(e) => setForm({ ...form, blocked_reason: e.target.value })} placeholder="Waiting on dependency, API, approval..." /></label>
              </div>
              <button className="btn-primary justify-self-start" disabled={updateTask.isPending}><Save size={17} /> {updateTask.isPending ? "Saving..." : "Save changes"}</button>
            </form>
          </section>

          <ChecklistSection taskId={id} items={task?.checklist || []} />
          <ProgressNotes taskId={id} notes={task?.progress_notes || []} currentUser={user} />
        </div>

        <div className="space-y-6">
          <Timeline events={taskEvents} />
          <CommentSection taskId={id} />
        </div>
      </section>
    </div>
  );
}
