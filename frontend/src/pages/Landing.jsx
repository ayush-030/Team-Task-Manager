import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  LayoutDashboard,
  LockKeyhole,
  MessageSquare,
  PanelsTopLeft,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";

const preview = [
  { day: "Mon", done: 8, focus: 12 },
  { day: "Tue", done: 13, focus: 16 },
  { day: "Wed", done: 10, focus: 19 },
  { day: "Thu", done: 18, focus: 23 },
  { day: "Fri", done: 24, focus: 28 },
];

const features = [
  ["Team collaboration", Users, "Shared projects, comments, and ownership visibility keep every teammate aligned."],
  ["Kanban boards", PanelsTopLeft, "Drag work from idea to shipped with crisp, responsive task boards."],
  ["Analytics", BarChart3, "Understand status mix, deadlines, velocity, and team performance at a glance."],
  ["Task management", CheckCircle2, "Priorities, due dates, assignees, and status updates without noisy overhead."],
  ["Role-based access", LockKeyhole, "Admin and member paths stay clear while preserving secure workflows."],
  ["Productivity tracking", Zap, "Spot bottlenecks early with trend cards and deadline-focused dashboards."],
];

const steps = ["Create project", "Add members", "Assign tasks", "Track progress", "Complete workflow"];
const faqs = [
  ["Can I use my existing API?", "Yes. The frontend talks to the existing FastAPI routes and keeps the same contracts."],
  ["Does it support admins and members?", "Yes. Admin-only actions remain gated, while members get focused status and comment workflows."],
  ["Is it responsive?", "The product shell, landing page, forms, dashboards, and boards adapt across desktop, tablet, and mobile."],
];

export default function Landing() {
  return (
    <div className="min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(99,102,241,0.35),transparent_32rem),radial-gradient(circle_at_80%_0%,rgba(236,72,153,0.22),transparent_28rem)]" />
      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-5 py-6">
        <Link to="/" className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white text-lg font-black text-indigo-700">T</span>
          <span className="font-black tracking-tight">TaskFlow</span>
        </Link>
        <nav className="hidden gap-6 text-sm font-bold text-slate-300 md:flex">
          <a href="#features">Features</a>
          <a href="#workflow">Workflow</a>
          <a href="#pricing">Pricing</a>
          <a href="#faq">FAQ</a>
        </nav>
        <div className="flex items-center gap-3">
          <Link to="/login" className="rounded-full px-4 py-2 text-sm font-black text-slate-200 hover:bg-white/10">Login</Link>
          <Link to="/signup" className="rounded-full bg-white px-4 py-2 text-sm font-black text-slate-950">Start free</Link>
        </div>
      </header>

      <main className="relative z-10">
        <section className="mx-auto grid max-w-7xl items-center gap-12 px-5 pb-20 pt-14 lg:grid-cols-[0.95fr_1.05fr] lg:pt-24">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-bold text-indigo-100 backdrop-blur">
              <Sparkles size={16} /> Premium task command center
            </div>
            <h1 className="mt-6 max-w-4xl text-5xl font-black tracking-tight md:text-7xl">
              Run every project with calm, visible momentum.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              TaskFlow brings projects, kanban boards, comments, deadlines, roles, and analytics into one polished SaaS workspace built for fast teams.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/signup" className="btn-primary">Create workspace <ArrowRight size={18} /></Link>
              <Link to="/login" className="btn-secondary">View demo flow</Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="relative"
          >
            <div className="absolute -inset-8 rounded-[3rem] bg-indigo-500/20 blur-3xl" />
            <div className="relative rounded-[2rem] border border-white/15 bg-white/10 p-4 shadow-glow backdrop-blur-2xl">
              <div className="rounded-[1.5rem] bg-slate-950/80 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-black text-indigo-200">Workspace health</p>
                    <h2 className="text-2xl font-black">84% on track</h2>
                  </div>
                  <LayoutDashboard className="text-indigo-200" />
                </div>
                <div className="mt-6 h-52">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={preview}>
                      <defs>
                        <linearGradient id="landingFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.9} />
                          <stop offset="95%" stopColor="#a78bfa" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 16 }} />
                      <XAxis dataKey="day" stroke="#94a3b8" axisLine={false} tickLine={false} />
                      <Area type="monotone" dataKey="focus" stroke="#c4b5fd" fill="url(#landingFill)" strokeWidth={3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-3">
                  {["Plan launch", "Fix checkout", "Invite team"].map((task, index) => (
                    <motion.div
                      key={task}
                      animate={{ y: [0, -6, 0] }}
                      transition={{ duration: 3, repeat: Infinity, delay: index * 0.35 }}
                      className="rounded-2xl border border-white/10 bg-white/10 p-3"
                    >
                      <p className="text-xs font-bold text-slate-300">{task}</p>
                      <div className="mt-3 h-1.5 rounded-full bg-white/10"><div className="h-full rounded-full bg-indigo-300" style={{ width: `${55 + index * 16}%` }} /></div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        <section id="features" className="mx-auto max-w-7xl px-5 py-20">
          <div className="max-w-2xl">
            <p className="text-sm font-black uppercase tracking-[0.25em] text-indigo-300">Features</p>
            <h2 className="mt-3 text-4xl font-black tracking-tight">Everything a focused team needs.</h2>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {features.map(([title, Icon, copy]) => (
              <motion.article whileHover={{ y: -6 }} key={title} className="rounded-3xl border border-white/10 bg-white/[0.07] p-6 backdrop-blur">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-indigo-700"><Icon size={22} /></div>
                <h3 className="mt-5 text-xl font-black">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-300">{copy}</p>
              </motion.article>
            ))}
          </div>
        </section>

        <section id="workflow" className="mx-auto max-w-7xl px-5 py-20">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.07] p-6 backdrop-blur md:p-10">
            <h2 className="text-3xl font-black">Workflow that stays obvious.</h2>
            <div className="mt-8 grid gap-4 md:grid-cols-5">
              {steps.map((step, index) => (
                <div key={step} className="rounded-3xl bg-white p-5 text-slate-950">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-slate-950 text-sm font-black text-white">{index + 1}</span>
                  <p className="mt-5 font-black">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-8 px-5 py-20 lg:grid-cols-2">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.25em] text-indigo-300">Dashboard Preview</p>
            <h2 className="mt-3 text-4xl font-black">Analytics your team will actually read.</h2>
            <p className="mt-4 text-slate-300">Clear progress, activity, deadlines, and velocity without turning project management into another project.</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/[0.07] p-5">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={preview}>
                  <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 16 }} />
                  <XAxis dataKey="day" stroke="#94a3b8" axisLine={false} tickLine={false} />
                  <Bar dataKey="done" radius={[10, 10, 0, 0]} fill="#818cf8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-5 px-5 py-20 md:grid-cols-3">
          {["It feels as fast as our team moves.", "The dashboard finally tells us what matters.", "Admin workflows are obvious and polished."].map((quote, index) => (
            <article key={quote} className="rounded-3xl border border-white/10 bg-white/[0.07] p-6">
              <p className="text-lg font-black">“{quote}”</p>
              <p className="mt-5 text-sm font-bold text-slate-300">Ops Lead {index + 1}</p>
            </article>
          ))}
        </section>

        <section id="pricing" className="mx-auto max-w-5xl px-5 py-20 text-center">
          <h2 className="text-4xl font-black">Simple pricing for focused teams.</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {["Starter", "Team", "Scale"].map((tier, index) => (
              <div key={tier} className={`rounded-3xl border p-6 text-left ${index === 1 ? "border-indigo-300 bg-white text-slate-950" : "border-white/10 bg-white/[0.07]"}`}>
                <p className="text-xl font-black">{tier}</p>
                <p className="mt-4 text-4xl font-black">${index * 12}</p>
                <p className={`mt-3 text-sm ${index === 1 ? "text-slate-500" : "text-slate-300"}`}>Projects, tasks, comments, dashboards, and team collaboration.</p>
              </div>
            ))}
          </div>
        </section>

        <section id="faq" className="mx-auto max-w-4xl px-5 py-20">
          <h2 className="text-4xl font-black">FAQ</h2>
          <div className="mt-8 space-y-4">
            {faqs.map(([q, a]) => (
              <details key={q} className="rounded-2xl border border-white/10 bg-white/[0.07] p-5">
                <summary className="cursor-pointer font-black">{q}</summary>
                <p className="mt-3 text-sm leading-6 text-slate-300">{a}</p>
              </details>
            ))}
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-white/10 px-5 py-8 text-center text-sm font-bold text-slate-400">
        TaskFlow © 2026. Built for teams that ship.
      </footer>
    </div>
  );
}
