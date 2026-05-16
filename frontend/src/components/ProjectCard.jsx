import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, CalendarDays } from "lucide-react";
import AvatarStack from "./ui/AvatarStack.jsx";
import { projectMemberIds } from "../utils/permissions.js";

export default function ProjectCard({ project, tasks = [] }) {
  const done = tasks.filter((task) => task.status === "done").length;
  const progress = tasks.length ? Math.round((done / tasks.length) * 100) : 0;
  const members = projectMemberIds(project).map((id, index) => `Member ${index + 1}`);

  return (
    <motion.article whileHover={{ y: -6 }} className="group premium-card rounded-3xl p-5">
      <Link to={`/projects/${project.id}`} className="block">
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">Active</span>
            <h3 className="mt-4 text-xl font-black tracking-tight text-slate-950">{project.name}</h3>
          </div>
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-slate-100 text-slate-500 transition group-hover:bg-slate-950 group-hover:text-white">
            <ArrowUpRight size={18} />
          </span>
        </div>
        <p className="mt-3 line-clamp-2 min-h-11 text-sm leading-6 text-slate-500">{project.description || "No description yet."}</p>
        <div className="mt-5">
          <div className="flex items-center justify-between text-xs font-black text-slate-500">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
            <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500" />
          </div>
        </div>
        <div className="mt-5 flex items-center justify-between">
          <AvatarStack members={members.length ? members : ["Owner"]} />
          <span className="flex items-center gap-1 text-xs font-bold text-slate-500"><CalendarDays size={14} /> {tasks.length} tasks</span>
        </div>
      </Link>
    </motion.article>
  );
}
