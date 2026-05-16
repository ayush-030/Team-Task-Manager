import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ClipboardList,
  LayoutDashboard,
  LockKeyhole,
  PanelsTopLeft,
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
  ["Team collaboration", Users,       "#2563EB", "Shared projects, comments, and ownership visibility keep every teammate aligned."],
  ["Kanban boards",      PanelsTopLeft,"#3B82F6", "Drag work from idea to shipped with crisp, responsive task boards."],
  ["Analytics",          BarChart3,    "#1D4ED8", "Understand status mix, deadlines, velocity, and team performance at a glance."],
  ["Task management",    CheckCircle2, "#2563EB", "Priorities, due dates, assignees, and status updates without noisy overhead."],
  ["Role-based access",  LockKeyhole,  "#3B82F6", "Admin and member paths stay clear while preserving secure workflows."],
  ["Productivity tracking", Zap,       "#1D4ED8", "Spot bottlenecks early with trend cards and deadline-focused dashboards."],
];

const steps = ["Create project", "Add members", "Assign tasks", "Track progress", "Complete workflow"];
const stepColors = ["#1D4ED8", "#2563EB", "#3B82F6", "#2563EB", "#1D4ED8"];

const faqs = [
  ["Can I use my existing API?", "Yes. The frontend talks to the existing FastAPI routes and keeps the same contracts."],
  ["Does it support admins and members?", "Yes. Admin-only actions remain gated, while members get focused status and comment workflows."],
  ["Is it responsive?", "The product shell, landing page, forms, dashboards, and boards adapt across desktop, tablet, and mobile."],
];

const highlights = [
  { icon: "🗂️", title: "One source of truth",       color: "#DBEAFE", border: "#bfdbfe",
    body: "Every task, comment, and deadline lives in the same place. No more digging through emails or chasing updates across tools." },
  { icon: "🔐", title: "Roles that make sense",      color: "#EFF6FF", border: "#DBEAFE",
    body: "Admins manage the full project. Members stay focused on what's assigned to them. Access is enforced automatically." },
  { icon: "📊", title: "Progress you can actually see", color: "#DBEAFE", border: "#bfdbfe",
    body: "The dashboard shows overdue tasks, team workload, and status breakdowns — so nothing slips through quietly." },
];


function FadeIn({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay }}
    >
      {children}
    </motion.div>
  );
}

export default function Landing() {
  return (
    <div className="min-h-screen overflow-hidden text-slate-800" style={{ background: "#FAFAF8" }}>

   
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            "radial-gradient(circle at 10% 5%,  rgba(37,99,235,0.08) 0%, transparent 28rem)," +
            "radial-gradient(circle at 90% 10%, rgba(59,130,246,0.06) 0%, transparent 26rem)," +
            "radial-gradient(circle at 50% 95%, rgba(219,234,254,0.5) 0%, transparent 30rem)",
        }}
      />

     
      <header
        className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sticky top-0 backdrop-blur-md"
        style={{ background: "rgba(250,250,248,0.92)" }}
      >
        <Link to="/" className="flex items-center gap-3">
          <span
            className="grid h-10 w-10 place-items-center rounded-xl text-lg font-black text-white shadow-sm"
            style={{ background: "#2563EB" }}
          >T</span>
          <span className="font-black tracking-tight text-slate-900 text-lg">TaskFlow</span>
        </Link>
        <nav className="hidden gap-7 text-sm font-semibold text-slate-500 md:flex">
          {["#features", "#workflow", "#faq"].map((href, i) => (
            <a key={href} href={href} className="transition-colors hover:text-[#2563EB]">
              {["Features", "Workflow", "FAQ"][i]}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link to="/login" className="rounded-full px-4 py-2 text-sm font-bold text-slate-600 hover:bg-blue-50 transition-colors">
            Login
          </Link>
          <Link
            to="/signup"
            className="rounded-full px-5 py-2 text-sm font-black text-white transition-colors shadow-sm"
            style={{ background: "#2563EB" }}
            onMouseOver={e => e.currentTarget.style.background = "#1d4ed8"}
            onMouseOut={e => e.currentTarget.style.background = "#2563EB"}
          >Get started</Link>
        </div>
      </header>

      <main className="relative z-10">

  
        <section className="mx-auto grid max-w-7xl items-center gap-14 px-5 pb-24 pt-16 lg:grid-cols-[1fr_1fr] lg:pt-24">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold"
              style={{ background: "#DBEAFE", color: "#1D4ED8", border: "1px solid #bfdbfe" }}
            >
              <ClipboardList size={15} /> Collaborative task management, simplified
            </div>
            <h1 className="mt-6 max-w-2xl text-5xl font-black tracking-tight text-slate-900 md:text-6xl leading-[1.08]">
              Run every project with calm, visible momentum.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-500">
              Assign work, track progress, and hit deadlines — all in one place your whole team will actually use.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-black text-white transition-colors shadow-md"
                style={{ background: "#2563EB" }}
                onMouseOver={e => e.currentTarget.style.background = "#1d4ed8"}
                onMouseOut={e => e.currentTarget.style.background = "#2563EB"}
              >
                Create workspace <ArrowRight size={17} />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-full border px-6 py-3 text-sm font-black text-slate-700 hover:bg-blue-50 transition-colors"
                style={{ borderColor: "#d1d5db" }}
              >
                View demo flow
              </Link>
            </div>
          </motion.div>

    
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.6 }}
            className="relative"
          >
            <div className="absolute -inset-6 rounded-[3rem] blur-3xl" style={{ background: "rgba(37,99,235,0.08)" }} />
            <div
              className="relative rounded-3xl border p-5 shadow-xl"
              style={{ background: "#ffffff", borderColor: "#b0b8cc", boxShadow: "0 20px 60px rgba(37,99,235,0.10)" }}
            >
              <div
                className="rounded-2xl p-5 border"
                style={{ background: "linear-gradient(135deg,#f0f4ff,#e8eeff)", borderColor: "#c7d7fb" }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold" style={{ color: "#2563EB" }}>Workspace health</p>
                    <h2 className="text-2xl font-black text-slate-900">84% on track</h2>
                  </div>
                  <div className="grid h-10 w-10 place-items-center rounded-xl" style={{ background: "#2563EB" }}>
                    <LayoutDashboard size={18} className="text-white" />
                  </div>
                </div>
                <div className="mt-6 h-52">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={preview}>
                      <defs>
                        <linearGradient id="landingFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%"  stopColor="#2563EB" stopOpacity={0.28} />
                          <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <Tooltip contentStyle={{ background: "#fff", border: "1px solid #e8e8e4", borderRadius: 12, color: "#0f172a", fontSize: 12 }} />
                      <XAxis dataKey="day" stroke="#94a3b8" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
                      <Area type="monotone" dataKey="focus" stroke="#2563EB" fill="url(#landingFill)" strokeWidth={2.5} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-3">
                  {["Plan launch", "Fix checkout", "Invite team"].map((task, index) => (
                    <motion.div
                      key={task}
                      animate={{ y: [0, -6, 0] }}
                      transition={{ duration: 3, repeat: Infinity, delay: index * 0.35 }}
                      className="rounded-xl border p-3 shadow-sm"
                      style={{ background: "#ffffff", borderColor: "#dde4f5" }}
                    >
                      <p className="text-xs font-bold text-slate-700">{task}</p>
                      <div className="mt-3 h-1.5 rounded-full" style={{ background: "#DBEAFE" }}>
                        <div className="h-full rounded-full" style={{ width: `${55 + index * 16}%`, background: index === 1 ? "#3B82F6" : "#2563EB" }} />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </section>

    
        <section id="features" className="mx-auto max-w-7xl px-5 py-20">
          <FadeIn>
            <div className="max-w-2xl">
              <p className="text-sm font-black uppercase tracking-[0.25em]" style={{ color: "#3B82F6" }}>Features</p>
              <h2 className="mt-3 text-4xl font-black tracking-tight text-slate-900">Everything a focused team needs.</h2>
            </div>
          </FadeIn>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {features.map(([title, Icon, iconBg, copy], i) => (
              <FadeIn key={title} delay={i * 0.07}>
                <motion.article
                  whileHover={{ y: -6 }}
                  className="rounded-2xl border p-6 shadow-sm transition-all h-full"
                  style={{ background: "#ffffff", borderColor: "#e8e8e4" }}
                  onMouseOver={e => e.currentTarget.style.borderColor = "#bfdbfe"}
                  onMouseOut={e => e.currentTarget.style.borderColor = "#e8e8e4"}
                >
                  <div className="grid h-11 w-11 place-items-center rounded-xl" style={{ background: iconBg }}>
                    <Icon size={20} className="text-white" />
                  </div>
                  <h3 className="mt-5 text-lg font-black text-slate-900">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{copy}</p>
                </motion.article>
              </FadeIn>
            ))}
          </div>
        </section>

   
        <section id="workflow" className="mx-auto max-w-7xl px-5 py-20">
          <FadeIn>
            <div className="rounded-3xl border p-8 shadow-sm md:p-12" style={{ background: "#ffffff", borderColor: "#e8e8e4" }}>
              <p className="text-sm font-black uppercase tracking-[0.25em]" style={{ color: "#2563EB" }}>Workflow</p>
              <h2 className="mt-3 text-3xl font-black text-slate-900">Workflow that stays obvious.</h2>
              <div className="mt-8 grid gap-4 md:grid-cols-5">
                {steps.map((step, index) => (
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.45 }}
                    className="rounded-2xl p-5 text-white shadow-md"
                    style={{ background: `linear-gradient(135deg, ${stepColors[index]}, #1D4ED8)`, boxShadow: "0 6px 20px rgba(37,99,235,0.18)" }}
                  >
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-white/20 text-sm font-black text-white">{index + 1}</span>
                    <p className="mt-5 font-black text-sm">{step}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </FadeIn>
        </section>

   
        <section className="mx-auto grid max-w-7xl gap-10 px-5 py-20 lg:grid-cols-2 items-center">
          <FadeIn>
            <p className="text-sm font-black uppercase tracking-[0.25em]" style={{ color: "#3B82F6" }}>Dashboard Preview</p>
            <h2 className="mt-3 text-4xl font-black text-slate-900">Analytics your team will actually read.</h2>
            <p className="mt-4 text-slate-500 leading-7">Clear progress, activity, deadlines, and velocity without turning project management into another project.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              {["Tasks by status", "Overdue alerts", "Team velocity"].map((tag, i) => (
                <span
                  key={tag}
                  className="rounded-full px-4 py-1.5 text-sm font-bold"
                  style={{ background: i === 1 ? "#EFF6FF" : "#DBEAFE", color: "#1D4ED8", border: `1px solid ${i === 1 ? "#DBEAFE" : "#bfdbfe"}` }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div className="rounded-3xl border p-6 shadow-sm" style={{ background: "#ffffff", borderColor: "#e8e8e4" }}>
              <p className="text-sm font-bold text-slate-400 mb-4">Tasks completed this week</p>
              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={preview}>
                    <Tooltip contentStyle={{ background: "#fff", border: "1px solid #e8e8e4", borderRadius: 12, color: "#0f172a", fontSize: 12 }} />
                    <XAxis dataKey="day" stroke="#94a3b8" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
                    <Bar dataKey="done" radius={[8, 8, 0, 0]} fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </FadeIn>
        </section>

   
        <section className="mx-auto max-w-7xl px-5 py-20">
          <FadeIn>
            <p className="text-sm font-black uppercase tracking-[0.25em] mb-3" style={{ color: "#2563EB" }}>Why TaskFlow</p>
            <h2 className="text-3xl font-black text-slate-900 mb-10">Built around how teams actually work.</h2>
          </FadeIn>
          <div className="grid gap-5 md:grid-cols-3">
            {highlights.map(({ icon, title, color, border, body }, i) => (
              <FadeIn key={title} delay={i * 0.1}>
                <motion.article
                  whileHover={{ y: -5 }}
                  className="rounded-2xl border p-7 shadow-sm transition-all h-full"
                  style={{ background: color, borderColor: border }}
                >
                  <span className="text-3xl">{icon}</span>
                  <h3 className="mt-4 text-lg font-black text-slate-900">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{body}</p>
                </motion.article>
              </FadeIn>
            ))}
          </div>
        </section>

  
        <section id="faq" className="mx-auto max-w-4xl px-5 py-20">
          <FadeIn>
            <p className="text-sm font-black uppercase tracking-[0.25em]" style={{ color: "#2563EB" }}>FAQ</p>
            <h2 className="mt-3 text-4xl font-black text-slate-900">Common questions.</h2>
          </FadeIn>
          <div className="mt-8 space-y-3">
            {faqs.map(([q, a], i) => (
              <FadeIn key={q} delay={i * 0.08}>
                <details
                  className="rounded-2xl border p-5 shadow-sm group"
                  style={{ background: "#ffffff", borderColor: "#e8e8e4" }}
                >
                  <summary className="cursor-pointer font-black text-slate-900 list-none flex items-center justify-between">
                    {q}
                    <span className="ml-3 group-open:rotate-180 transition-transform" style={{ color: "#3B82F6" }}>↓</span>
                  </summary>
                  <p className="mt-3 text-sm leading-6 text-slate-500">{a}</p>
                </details>
              </FadeIn>
            ))}
          </div>
        </section>


        <section className="mx-auto max-w-7xl px-5 pb-24">
          <FadeIn>
            <div
              className="rounded-3xl p-12 text-center shadow-xl"
              style={{ background: "linear-gradient(135deg, #1D4ED8, #3B82F6)", boxShadow: "0 20px 60px rgba(37,99,235,0.22)" }}
            >
              <h2 className="text-3xl font-black text-white">Ready to ship faster?</h2>
              <p className="mt-3 text-lg text-blue-100">
                Join teams already running smoother with TaskFlow.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Link
                  to="/signup"
                  className="inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-black shadow-md transition-colors"
                  style={{ background: "#ffffff", color: "#1D4ED8" }}
                  onMouseOver={e => e.currentTarget.style.background = "#EFF6FF"}
                  onMouseOut={e => e.currentTarget.style.background = "#ffffff"}
                >
                  Create workspace <ArrowRight size={17} />
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-7 py-3 text-sm font-black text-white hover:bg-white/20 transition-colors"
                >
                  View demo flow
                </Link>
              </div>
            </div>
          </FadeIn>
        </section>
      </main>

      <footer
        className="relative z-10 px-5 py-8 text-center text-sm font-semibold text-slate-400"
        style={{ background: "#FAFAF8" }}
      >
        TaskFlow © {new Date().getFullYear()}
      </footer>
    </div>
  );
}