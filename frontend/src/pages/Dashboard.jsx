import { motion } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Eye,
  FolderKanban,
  Plus,
  Target,
  Users,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Link } from "react-router-dom";
import { useDashboard } from "../api/hooks/useDashboard.js";
import { useProjects } from "../api/hooks/useProjects.js";
import { useAllProjectTasks } from "../api/hooks/useTasks.js";
import StatCard from "../components/ui/StatCard.jsx";
import { CardSkeleton } from "../components/ui/Skeleton.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import { isOverdue, statusLabels } from "../utils/formatters.js";
import { projectMemberIds } from "../utils/permissions.js";

const colors = ["#64748b", "#f59e0b", "#0ea5e9", "#ef4444", "#10b981"];

export default function Dashboard() {
  const { data, isLoading } = useDashboard();
  const { data: projects = [], isLoading: projectsLoading } = useProjects();
  const { tasks, isLoading: tasksLoading } = useAllProjectTasks(projects);
  const stats = data || {
    total_tasks: 0,
    completed_pct: 0,
    overdue_count: 0,
    blocked_count: 0,
    review_count: 0,
    checklist_completion_pct: 0,
    by_status: { todo: 0, in_progress: 0, review: 0, blocked: 0, done: 0 },
    completed_over_time: [],
    weekly_productivity: [],
    project_progress: [],
  };
  const pending = (stats.by_status.todo || 0) + (stats.by_status.in_progress || 0) + (stats.by_status.review || 0) + (stats.by_status.blocked || 0);
  const uniqueMembers = new Set(projects.flatMap((project) => projectMemberIds(project))).size;
  const completed = stats.by_status.done || 0;
  const upcoming = tasks
    .filter((task) => task.due_date && task.status !== "done")
    .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))
    .slice(0, 5);
  const statusData = Object.entries(stats.by_status).map(([name, value]) => ({ name: statusLabels[name] || name, value }));
  const completedOverTime = stats.completed_over_time || [];
  const hasCompletedOverTime = completedOverTime.some((point) => point.completed > 0);
  const projectProgress = stats.project_progress || [];
  const loading = isLoading || projectsLoading || tasksLoading;

  if (loading) {
    return <div className="grid gap-5 md:grid-cols-3"><CardSkeleton /><CardSkeleton /><CardSkeleton /></div>;
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Projects" value={projects.length} icon={FolderKanban} tone="indigo" helper="Active workspaces you can access" />
        <StatCard label="Total Tasks" value={stats.total_tasks} icon={Target} tone="sky" helper={`${completed} completed tasks`} />
        <StatCard label="Pending Tasks" value={pending} icon={Clock3} tone="amber" helper="Todo and in-progress work" />
        <StatCard label="Blocked Tasks" value={stats.blocked_count || 0} icon={AlertTriangle} tone="rose" helper="Waiting on a dependency" />
      </section>

      <section className="grid gap-5 md:grid-cols-4">
        <StatCard label="Completed" value={`${stats.completed_pct}%`} icon={CheckCircle2} tone="emerald" helper="Completion rate across visible projects" />
        <StatCard label="In Review" value={stats.review_count || 0} icon={Eye} tone="sky" helper="Ready for testing or approval" />
        <StatCard label="Checklist Done" value={`${stats.checklist_completion_pct || 0}%`} icon={CheckCircle2} tone="emerald" helper="Subtask completion rate" />
        <StatCard label="Overdue Tasks" value={stats.overdue_count} icon={AlertTriangle} tone="rose" helper="Needs attention today" />
      </section>

      <section className="grid gap-5 md:grid-cols-2">
        <StatCard label="Total Members" value={uniqueMembers} icon={Users} tone="indigo" helper="Unique project member IDs" />
        <StatCard label="Active Users" value={Math.max(uniqueMembers, projects.length ? 1 : 0)} icon={Activity} tone="sky" helper="Estimated from active project membership" />
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.45fr_0.85fr]">
        <motion.article initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="premium-card rounded-3xl p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-black text-slate-950">Tasks completed over time</h2>
              <p className="text-sm font-semibold text-slate-500">Velocity and activity trend</p>
            </div>
            <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-black text-indigo-700">Live analytics</span>
          </div>
          <div className="mt-5 h-80">
            {hasCompletedOverTime ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={completedOverTime}>
                  <defs>
                    <linearGradient id="completedFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="label" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip contentStyle={{ borderRadius: 16, border: "1px solid #e2e8f0" }} />
                  <Area type="monotone" dataKey="completed" stroke="#6366f1" strokeWidth={3} fill="url(#completedFill)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : <EmptyState title="No completed tasks yet" description="Tasks moved to Done will appear in this chart by completion day." />}
          </div>
        </motion.article>

        <motion.article initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="premium-card rounded-3xl p-5">
          <h2 className="text-xl font-black text-slate-950">Task distribution</h2>
          <p className="text-sm font-semibold text-slate-500">Status mix across projects</p>
          <div className="mt-5 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusData} dataKey="value" nameKey="name" innerRadius={58} outerRadius={96} paddingAngle={4}>
                  {statusData.map((entry, index) => <Cell key={entry.name} fill={colors[index % colors.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 16, border: "1px solid #e2e8f0" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2">
            {statusData.map((item, index) => (
              <div key={item.name} className="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-2 text-sm font-bold">
                <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full" style={{ background: colors[index] }} />{item.name}</span>
                <span>{item.value}</span>
              </div>
            ))}
          </div>
        </motion.article>
      </section>

      <section className="grid gap-5 xl:grid-cols-3">
        <article className="premium-card rounded-3xl p-5 xl:col-span-2">
          <h2 className="text-xl font-black text-slate-950">Project progress</h2>
          <div className="mt-5 h-72">
            {projectProgress.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={projectProgress}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 16, border: "1px solid #e2e8f0" }} />
                  <Bar dataKey="progress" fill="#6366f1" radius={[12, 12, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : <EmptyState title="No project data yet" description="Create a project and add tasks to see progress charts." />}
          </div>
        </article>

        <article className="premium-card rounded-3xl p-5">
          <h2 className="text-xl font-black text-slate-950">Quick actions</h2>
          <div className="mt-5 space-y-3">
            <Link to="/projects" className="flex items-center gap-3 rounded-2xl bg-slate-950 p-4 font-black text-white"><Plus size={18} /> Create project</Link>
            <Link to="/projects" className="flex items-center gap-3 rounded-2xl bg-indigo-50 p-4 font-black text-indigo-700"><Users size={18} /> Add member</Link>
            <Link to="/projects" className="flex items-center gap-3 rounded-2xl bg-emerald-50 p-4 font-black text-emerald-700"><CheckCircle2 size={18} /> Add task</Link>
          </div>
        </article>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <article className="premium-card rounded-3xl p-5">
          <h2 className="text-xl font-black text-slate-950">Upcoming deadlines</h2>
          <div className="mt-5 space-y-3">
            {upcoming.length ? upcoming.map((task) => (
              <Link key={task.id} to={`/tasks/${task.id}`} className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 p-4">
                <div>
                  <p className="font-black text-slate-900">{task.title}</p>
                  <p className="text-sm font-semibold text-slate-500">Due {task.due_date}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-black ${isOverdue(task) ? "bg-rose-50 text-rose-700" : "bg-amber-50 text-amber-700"}`}>
                  {isOverdue(task) ? "Overdue" : "Upcoming"}
                </span>
              </Link>
            )) : <EmptyState title="No upcoming deadlines" description="Your near-term task queue is clear." />}
          </div>
        </article>

        <article className="premium-card rounded-3xl p-5">
          <h2 className="text-xl font-black text-slate-950">Activity feed</h2>
          <div className="mt-5 space-y-3">
            {[...projects.slice(0, 3).map((project) => `Project created: ${project.name}`), ...tasks.slice(0, 4).map((task) => `Task updated: ${task.title}`)].slice(0, 6).map((item, index) => (
              <div key={`${item}-${index}`} className="flex gap-3 rounded-2xl bg-slate-50 p-4">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-indigo-500" />
                <div>
                  <p className="font-bold text-slate-800">{item}</p>
                  <p className="text-xs font-semibold text-slate-500">Recently</p>
                </div>
              </div>
            ))}
            {!projects.length && !tasks.length && <EmptyState title="No activity yet" description="Activity will appear as projects, tasks, members, and comments change." />}
          </div>
        </article>
      </section>
    </div>
  );
}
