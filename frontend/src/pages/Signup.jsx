import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, LockKeyhole, Mail, UserRound } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext.jsx";

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.email.includes("@")) return setError("Enter a valid email address.");
    if (form.username.length < 3) return setError("Username must be at least 3 characters.");
    if (form.password.length < 8) return setError("Password must be at least 8 characters.");
    setLoading(true);
    try {
      await signup(form);
      toast.success("Workspace account created");
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.detail || "Unable to create account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="grid min-h-screen bg-slate-950 text-white lg:grid-cols-[0.95fr_1.05fr]">
      <section className="grid place-items-center px-5 py-10">
        <motion.form initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md rounded-[2rem] bg-white p-6 text-slate-950 shadow-2xl md:p-8" onSubmit={submit}>
          <Link to="/" className="mb-8 inline-flex items-center gap-2 text-sm font-black text-indigo-600">Back to site</Link>
          <h2 className="text-3xl font-black tracking-tight">Create your account</h2>
          <p className="mt-2 text-sm font-semibold text-slate-500">New signups join as users. Create a project to become its project admin.</p>
          <div className="mt-8 space-y-4">
            <label className="field-label">Email
              <div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} /><input className="input pl-10" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
            </label>
            <label className="field-label">Username
              <div className="relative"><UserRound className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} /><input className="input pl-10" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} /></div>
            </label>
            <label className="field-label">Password
              <div className="relative">
                <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input className="input px-10" type={showPassword ? "text" : "password"} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </label>
          </div>
          {error && <p className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">{error}</p>}
          <button className="btn-primary mt-6 w-full" disabled={loading}>{loading ? "Creating..." : "Sign up"}</button>
          <p className="mt-6 text-center text-sm font-semibold text-slate-500">
            Have an account? <Link to="/login" className="font-black text-indigo-600">Sign in</Link>
          </p>
        </motion.form>
      </section>
      <section className="relative hidden overflow-hidden p-10 lg:block">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.26),transparent_30rem),radial-gradient(circle_at_80%_70%,rgba(124,58,237,0.42),transparent_32rem)]" />
        <div className="relative flex h-full flex-col justify-between rounded-[2rem] border border-white/10 bg-white/10 p-10 backdrop-blur-2xl">
          <Link to="/" className="flex items-center gap-3 text-lg font-black"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-white text-indigo-700">T</span>TaskFlow</Link>
          <div>
            <h1 className="max-w-xl text-5xl font-black tracking-tight">Start small, scale into a complete project operating system.</h1>
            <p className="mt-5 max-w-lg leading-8 text-slate-300">Beautiful boards, comments, role-aware actions, and analytics are ready as soon as your API is running.</p>
          </div>
          <div className="rounded-3xl bg-white p-5 text-slate-950">
            <div className="flex items-center justify-between"><p className="font-black">Onboarding progress</p><span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">Live</span></div>
            <div className="mt-5 space-y-3">
              {["Create account", "Join project", "Ship first task"].map((item, index) => (
                <div key={item} className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3"><span className="grid h-8 w-8 place-items-center rounded-full bg-indigo-600 text-xs font-black text-white">{index + 1}</span><span className="font-bold">{item}</span></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
