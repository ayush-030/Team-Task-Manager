import { Search, ShieldCheck, TrendingUp } from "lucide-react";
import { useMemo, useState } from "react";
import { useProjects } from "../api/hooks/useProjects.js";
import { useAllProjectTasks } from "../api/hooks/useTasks.js";
import { initials } from "../utils/formatters.js";
import { projectMemberIds } from "../utils/permissions.js";

export default function Team() {
  const [query, setQuery] = useState("");
  const { data: projects = [] } = useProjects();
  const { tasks } = useAllProjectTasks(projects);
  const members = useMemo(() => {
    const ids = [...new Set(projects.flatMap((project) => projectMemberIds(project)))];
    return ids.map((id, index) => {
      const assigned = tasks.filter((task) => task.assigned_to === id);
      const completed = assigned.filter((task) => task.status === "done").length;
      return {
        id,
        name: `Member ${index + 1}`,
        role: index === 0 ? "Admin" : "Member",
        assigned: assigned.length,
        completed,
        productivity: assigned.length ? Math.round((completed / assigned.length) * 100) : 72 + (index * 7) % 24,
      };
    });
  }, [projects, tasks]);
  const filtered = members.filter((member) => member.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] bg-gradient-to-br from-white to-indigo-50 p-6 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.22em] text-indigo-600">Team</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">People, roles, and productivity.</h2>
          </div>
          <div className="relative min-w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input className="input pl-10" placeholder="Search members" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((member) => (
          <article key={member.id} className="premium-card rounded-3xl p-5">
            <div className="flex items-center gap-4">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-indigo-600 to-fuchsia-600 font-black text-white">{initials(member.name)}</div>
              <div>
                <h3 className="font-black text-slate-950">{member.name}</h3>
                <p className="flex items-center gap-1 text-sm font-bold text-slate-500"><ShieldCheck size={15} /> {member.role}</p>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-slate-50 p-3"><p className="text-xs font-black text-slate-500">Assigned</p><p className="text-2xl font-black">{member.assigned}</p></div>
              <div className="rounded-2xl bg-emerald-50 p-3"><p className="text-xs font-black text-emerald-700">Completed</p><p className="text-2xl font-black text-emerald-700">{member.completed}</p></div>
            </div>
            <div className="mt-5">
              <div className="flex items-center justify-between text-xs font-black text-slate-500"><span className="flex items-center gap-1"><TrendingUp size={14} /> Productivity</span><span>{member.productivity}%</span></div>
              <div className="mt-2 h-2 rounded-full bg-slate-100"><div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-400" style={{ width: `${member.productivity}%` }} /></div>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
