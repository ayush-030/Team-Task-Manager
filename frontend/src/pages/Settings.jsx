import { Bell, LockKeyhole, Moon, UserRound } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext.jsx";

export default function Settings() {
  const { user } = useAuth();
  const [dark, setDark] = useState(false);
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <section className="rounded-[2rem] bg-gradient-to-br from-white to-indigo-50 p-6 shadow-soft">
        <p className="text-sm font-black uppercase tracking-[0.22em] text-indigo-600">Settings</p>
        <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">Tune your workspace.</h2>
      </section>

      <section className="premium-card rounded-3xl p-5">
        <h3 className="flex items-center gap-2 text-xl font-black"><UserRound size={20} /> Profile settings</h3>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <label className="field-label">Username<input className="input" defaultValue={user?.username} /></label>
          <label className="field-label">Role<input className="input capitalize" disabled defaultValue={user?.role} /></label>
          <label className="field-label md:col-span-2">Email<input className="input" disabled defaultValue={user?.email} /></label>
        </div>
        <button className="btn-primary mt-5" onClick={() => toast.success("Profile preferences saved")}>Save profile</button>
      </section>

      <section className="grid gap-5 md:grid-cols-2">
        <article className="premium-card rounded-3xl p-5">
          <h3 className="flex items-center gap-2 text-lg font-black"><Moon size={20} /> Theme</h3>
          <label className="mt-5 flex items-center justify-between rounded-2xl bg-slate-50 p-4 font-bold">
            Dark mode preview
            <input type="checkbox" checked={dark} onChange={(e) => setDark(e.target.checked)} className="h-5 w-5 accent-indigo-600" />
          </label>
        </article>
        <article className="premium-card rounded-3xl p-5">
          <h3 className="flex items-center gap-2 text-lg font-black"><Bell size={20} /> Notifications</h3>
          <label className="mt-5 flex items-center justify-between rounded-2xl bg-slate-50 p-4 font-bold">
            Product updates
            <input type="checkbox" checked={notifications} onChange={(e) => setNotifications(e.target.checked)} className="h-5 w-5 accent-indigo-600" />
          </label>
        </article>
      </section>

      <section className="premium-card rounded-3xl p-5">
        <h3 className="flex items-center gap-2 text-xl font-black"><LockKeyhole size={20} /> Password change</h3>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <label className="field-label">Current password<input className="input" type="password" /></label>
          <label className="field-label">New password<input className="input" type="password" /></label>
        </div>
        <button className="btn-secondary mt-5" onClick={() => toast.info("Password change API is not configured yet")}>Update password</button>
      </section>
    </div>
  );
}
