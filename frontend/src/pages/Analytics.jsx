import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useProjects } from "../api/hooks/useProjects.js";
import { useAllProjectTasks } from "../api/hooks/useTasks.js";
import { completionPct } from "../utils/formatters.js";

export default function Analytics() {
  const { data: projects = [] } = useProjects();
  const { tasks } = useAllProjectTasks(projects);
  const projectData = projects.map((project) => {
    const projectTasks = tasks.filter((task) => task.project_id === project.id);
    return { name: project.name, progress: completionPct(projectTasks), tasks: projectTasks.length };
  });
  const trend = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, index) => ({
    day,
    productivity: Math.min(100, 48 + index * 7 + (tasks.length % 9)),
    completed: tasks.filter((task) => task.status === "done").length + index,
  }));

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] bg-gradient-to-br from-slate-950 to-indigo-950 p-6 text-white shadow-glow">
        <p className="text-sm font-black uppercase tracking-[0.22em] text-indigo-200">Analytics</p>
        <h2 className="mt-2 text-3xl font-black tracking-tight">Performance signals for better planning.</h2>
      </section>
      <section className="grid gap-5 xl:grid-cols-2">
        <article className="premium-card rounded-3xl p-5">
          <h3 className="text-xl font-black">Weekly productivity</h3>
          <div className="mt-5 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 16, border: "1px solid #e2e8f0" }} />
                <Line type="monotone" dataKey="productivity" stroke="#6366f1" strokeWidth={3} dot={false} />
                <Line type="monotone" dataKey="completed" stroke="#10b981" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </article>
        <article className="premium-card rounded-3xl p-5">
          <h3 className="text-xl font-black">Project progress</h3>
          <div className="mt-5 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={projectData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 16, border: "1px solid #e2e8f0" }} />
                <Bar dataKey="progress" fill="#6366f1" radius={[12, 12, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>
      </section>
    </div>
  );
}
