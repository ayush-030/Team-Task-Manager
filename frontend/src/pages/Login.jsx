import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, LockKeyhole, Mail, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.username || !form.password) return setError("Email/username and password are required.");
    setLoading(true);
    try {
      await login(form.username, form.password);
      toast.success("Welcome back");
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.detail || "Unable to sign in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="grid min-h-screen bg-slate-950 text-white lg:grid-cols-[1.05fr_0.95fr]">
      <section className="relative hidden overflow-hidden p-10 lg:block">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.45),transparent_30rem),radial-gradient(circle_at_80%_70%,rgba(236,72,153,0.28),transparent_28rem)]" />
        <div className="relative flex h-full flex-col justify-between rounded-[2rem] border border-white/10 bg-white/10 p-10 backdrop-blur-2xl">
          <Link to="/" className="flex items-center gap-3 text-lg font-black">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white text-indigo-700">T</span>
            TaskFlow
          </Link>
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-indigo-100">
              <Sparkles size={16} /> Premium workspace
            </div>
            <h1 className="mt-6 max-w-xl text-5xl font-black tracking-tight">Turn project noise into a crisp operating rhythm.</h1>
            <p className="mt-5 max-w-lg leading-8 text-slate-300">Sign in to manage boards, deadlines, comments, dashboards, and team workflows from one calm interface.</p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {["Projects", "Tasks", "Velocity"].map((item, index) => (
              <motion.div key={item} animate={{ y: [0, -8, 0] }} transition={{ duration: 3.2, repeat: Infinity, delay: index * 0.25 }} className="rounded-3xl bg-white p-4 text-slate-950">
                <p className="text-sm font-black">{item}</p>
                <p className="mt-3 text-2xl font-black">{[12, 48, 86][index]}{index === 2 ? "%" : ""}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid place-items-center px-5 py-10">
        <motion.form initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md rounded-[2rem] bg-white p-6 text-slate-950 shadow-2xl md:p-8" onSubmit={submit}>
          <Link to="/" className="mb-8 inline-flex items-center gap-2 text-sm font-black text-indigo-600">← Back to site</Link>
          <h2 className="text-3xl font-black tracking-tight">Welcome back</h2>
          <p className="mt-2 text-sm font-semibold text-slate-500">Use your email or username to continue.</p>
          <div className="mt-8 space-y-4">
            <label className="field-label">Email or username
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input className="input pl-10" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
              </div>
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
          <button className="btn-primary mt-6 w-full" disabled={loading}>{loading ? "Signing in..." : "Login"}</button>
          <p className="mt-6 text-center text-sm font-semibold text-slate-500">
            No account? <Link to="/signup" className="font-black text-indigo-600">Create one</Link>
          </p>
        </motion.form>
      </section>
    </main>
  );
}
