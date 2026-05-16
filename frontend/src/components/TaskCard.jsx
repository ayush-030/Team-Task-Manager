import { useDraggable } from "@dnd-kit/core";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AlertTriangle, CalendarDays, CheckCircle2, Circle, Eye, GripVertical, Loader2 } from "lucide-react";
import { checklistPct, isOverdue, priorityStyles, statusLabels, statusStyles } from "../utils/formatters.js";

const statusIcons = {
  todo: Circle,
  in_progress: Loader2,
  review: Eye,
  blocked: AlertTriangle,
  done: CheckCircle2,
};

export default function TaskCard({ task }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: task.id });
  const style = transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` } : undefined;
  const StatusIcon = statusIcons[task.status] || Circle;
  const pct = checklistPct(task.checklist || []);

  return (
    <motion.article
      ref={setNodeRef}
      style={style}
      layout
      whileHover={{ y: -3 }}
      className={`rounded-2xl border bg-white p-4 shadow-sm transition ${task.status === "blocked" ? "border-rose-200 ring-2 ring-rose-100" : "border-slate-200"} ${isDragging ? "z-50 opacity-80 shadow-2xl" : ""}`}
    >
      <div className="flex items-start gap-2">
        <button className="mt-0.5 text-slate-300 hover:text-slate-500" {...listeners} {...attributes} title="Drag task">
          <GripVertical size={18} />
        </button>
        <Link to={`/tasks/${task.id}`} className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-black leading-5 text-slate-950">{task.title}</h4>
            <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-black ring-1 ${priorityStyles[task.priority]}`}>
              {task.priority}
            </span>
          </div>
          <div className={`mt-2 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-black ring-1 ${statusStyles[task.status]}`}>
            <StatusIcon size={12} /> {statusLabels[task.status]}
          </div>
          <p className="mt-2 line-clamp-2 text-sm leading-5 text-slate-500">{task.description || "No description"}</p>
          {task.status === "blocked" && task.blocked_reason && (
            <p className="mt-3 rounded-2xl bg-rose-50 p-2 text-xs font-bold text-rose-700">{task.blocked_reason}</p>
          )}
          {(task.checklist || []).length > 0 && (
            <div className="mt-3">
              <div className="flex justify-between text-[11px] font-black text-slate-400"><span>Checklist</span><span>{pct}%</span></div>
              <div className="mt-1 h-1.5 rounded-full bg-slate-100"><div className="h-full rounded-full bg-indigo-500" style={{ width: `${pct}%` }} /></div>
            </div>
          )}
          {task.due_date && (
            <div className={`mt-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-black ${isOverdue(task) ? "bg-rose-50 text-rose-700" : "bg-slate-100 text-slate-500"}`}>
              <CalendarDays size={13} /> {task.due_date}
            </div>
          )}
        </Link>
      </div>
    </motion.article>
  );
}
