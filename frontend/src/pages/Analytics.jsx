import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useDashboard } from "../api/hooks/useDashboard.js";
import EmptyState from "../components/ui/EmptyState.jsx";
import { CardSkeleton } from "../components/ui/Skeleton.jsx";

export default function Analytics() {
  const { data, isLoading } = useDashboard();
  const weeklyProductivity = data?.weekly_productivity || [];
  const projectData = data?.project_progress || [];
  const hasProductivity = weeklyProductivity.some((point) => point.assigned_tasks > 0 || point.completed_tasks > 0);
  const hasProjectProgress = projectData.some((project) => project.tasks > 0);

  if (isLoading) {
    return <div className="grid gap-5 xl:grid-cols-2"><CardSkeleton /><CardSkeleton /></div>;
  }

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
            {hasProductivity ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyProductivity}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="label" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 16, border: "1px solid #e2e8f0" }} />
                  <Line type="monotone" dataKey="productivity" stroke="#6366f1" strokeWidth={3} dot={false} />
                  <Line type="monotone" dataKey="completed_tasks" stroke="#10b981" strokeWidth={3} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            ) : <EmptyState title="No productivity data yet" description="Assign tasks and complete them to populate weekly productivity." />}
          </div>
        </article>
        <article className="premium-card rounded-3xl p-5">
          <h3 className="text-xl font-black">Project progress</h3>
          <div className="mt-5 h-80">
            {hasProjectProgress ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={projectData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 16, border: "1px solid #e2e8f0" }} />
                  <Bar dataKey="progress" fill="#6366f1" radius={[12, 12, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : <EmptyState title="No project progress yet" description="Create tasks in projects to see real progress metrics." />}
          </div>
        </article>
      </section>
    </div>
  );
}
