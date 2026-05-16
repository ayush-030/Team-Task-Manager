import { useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  BarChart3,
  Bell,
  ChevronLeft,
  LayoutDashboard,
  ListChecks,
  Menu,
  PanelsTopLeft,
  Search,
  Settings,
  Users,
  X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { initials } from "../utils/formatters.js";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/projects", label: "Projects", icon: PanelsTopLeft },
  { to: "/tasks", label: "Tasks", icon: ListChecks },
  { to: "/team", label: "Team", icon: Users },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/settings", label: "Settings", icon: Settings },
];

function Sidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) {
  const { user, logout } = useAuth();
  const content = (
    <aside className={`flex h-full flex-col border-r border-white/70 bg-white/78 backdrop-blur-2xl transition-all duration-300 ${collapsed ? "w-[86px]" : "w-72"}`}>
      <div className="flex h-20 items-center gap-3 px-5">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-indigo-600 to-fuchsia-600 font-black text-white shadow-glow">
          T
        </div>
        {!collapsed && (
          <div>
            <p className="text-sm font-black uppercase tracking-[0.22em] text-indigo-600">TaskFlow</p>
            <p className="text-xs font-semibold text-slate-500">Team command center</p>
          </div>
        )}
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `group flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-extrabold transition ${
                isActive
                  ? "bg-slate-950 text-white shadow-soft"
                  : "text-slate-600 hover:bg-white hover:text-slate-950"
              }`
            }
          >
            <Icon size={20} />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="p-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-3">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-indigo-100 text-sm font-black text-indigo-700">
              {initials(user?.username)}
            </div>
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-black text-slate-950">{user?.username}</p>
                <p className="text-xs font-bold capitalize text-slate-500">{user?.role}</p>
              </div>
            )}
          </div>
          {!collapsed && (
            <button onClick={logout} className="mt-3 w-full rounded-2xl bg-slate-100 px-3 py-2 text-sm font-black text-slate-700 transition hover:bg-slate-200">
              Logout
            </button>
          )}
        </div>
      </div>

      <button
        className="absolute -right-4 top-7 hidden h-8 w-8 place-items-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-lg lg:grid"
        onClick={() => setCollapsed(!collapsed)}
        title="Collapse sidebar"
      >
        <ChevronLeft size={16} className={collapsed ? "rotate-180" : ""} />
      </button>
    </aside>
  );

  return (
    <>
      <div className="fixed inset-y-0 left-0 z-30 hidden lg:block">{content}</div>
      <AnimatePresence>
        {mobileOpen && (
          <motion.div className="fixed inset-0 z-50 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <button className="absolute inset-0 bg-slate-950/40" onClick={() => setMobileOpen(false)} aria-label="Close menu" />
            <motion.div initial={{ x: -320 }} animate={{ x: 0 }} exit={{ x: -320 }} transition={{ type: "spring", damping: 28, stiffness: 260 }} className="relative h-full w-72">
              {content}
              <button className="absolute right-4 top-4 rounded-full bg-slate-100 p-2" onClick={() => setMobileOpen(false)}><X size={18} /></button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const pageName = navItems.find((item) => location.pathname.startsWith(item.to))?.label || "Workspace";

  return (
    <div className="min-h-screen overflow-hidden bg-slate-50 text-slate-950">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div className={`min-h-screen transition-all duration-300 ${collapsed ? "lg:pl-[86px]" : "lg:pl-72"}`}>
        <header className="sticky top-0 z-20 border-b border-white/70 bg-white/70 px-4 py-4 backdrop-blur-2xl md:px-8">
          <div className="flex items-center gap-4">
            <button className="rounded-2xl bg-white p-3 shadow-sm lg:hidden" onClick={() => setMobileOpen(true)}><Menu size={20} /></button>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-indigo-600">Workspace</p>
              <h1 className="text-xl font-black tracking-tight text-slate-950 md:text-2xl">{pageName}</h1>
            </div>
            <div className="ml-auto hidden max-w-md flex-1 items-center rounded-2xl border border-slate-200 bg-white px-3 py-2 md:flex">
              <Search size={18} className="text-slate-400" />
              <input className="ml-2 w-full bg-transparent text-sm font-semibold text-slate-700 placeholder:text-slate-400" placeholder="Search projects, tasks, teammates" />
            </div>
            <button className="relative grid h-11 w-11 place-items-center rounded-2xl border border-slate-200 bg-white text-slate-600 shadow-sm">
              <Bell size={19} />
              <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-rose-500" />
            </button>
          </div>
        </header>
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28 }}
          className="mx-auto w-full max-w-7xl px-4 py-6 md:px-8"
        >
          <Outlet />
        </motion.main>
      </div>
    </div>
  );
}
