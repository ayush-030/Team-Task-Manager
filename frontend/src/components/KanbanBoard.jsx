import { DndContext, useDroppable } from "@dnd-kit/core";
import { motion } from "framer-motion";
import TaskCard from "./TaskCard.jsx";
import EmptyState from "./ui/EmptyState.jsx";

const columns = [
  ["todo", "To do", "bg-slate-100 text-slate-700"],
  ["in_progress", "In progress", "bg-amber-50 text-amber-700"],
  ["done", "Done", "bg-emerald-50 text-emerald-700"],
];

function Column({ id, title, tone, tasks }) {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <section ref={setNodeRef} className={`min-h-[520px] rounded-3xl border p-4 transition ${isOver ? "border-indigo-400 bg-indigo-50/70" : "border-slate-200 bg-white/60"}`}>
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-black uppercase tracking-[0.16em] text-slate-500">{title}</h3>
        <span className={`rounded-full px-3 py-1 text-xs font-black ${tone}`}>{tasks.length}</span>
      </div>
      <motion.div layout className="mt-4 grid gap-3">
        {tasks.map((task) => <TaskCard key={task.id} task={task} />)}
      </motion.div>
    </section>
  );
}

export default function KanbanBoard({ tasks, onStatusChange }) {
  const grouped = Object.fromEntries(columns.map(([id]) => [id, tasks.filter((task) => task.status === id)]));
  if (!tasks.length) {
    return <EmptyState title="No tasks yet" description="Create the first task to start building momentum on this project." />;
  }

  return (
    <DndContext
      onDragEnd={({ active, over }) => {
        if (over?.id && active?.id) onStatusChange(active.id, over.id);
      }}
    >
      <div className="grid gap-4 xl:grid-cols-3">
        {columns.map(([id, title, tone]) => <Column key={id} id={id} title={title} tone={tone} tasks={grouped[id]} />)}
      </div>
    </DndContext>
  );
}
