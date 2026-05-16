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
    <main className="grid min-h-screen lg:grid-cols-[0.95fr_1.05fr]" style={{ background: "#DBEAFE" }}>

      <section
        className="relative grid place-items-center px-5 py-10"
        style={{ background: "#EFF6FF" }}
      >
        <motion.form
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md rounded-[2rem] p-6 md:p-8"
          style={{ background: "#ffffff", border: "1px solid #bfdbfe", boxShadow: "0 8px 40px rgba(37,99,235,0.10)" }}
          onSubmit={submit}
        >
          <Link
            to="/"
            className="mb-8 inline-flex items-center gap-2 text-sm font-black transition-colors"
            style={{ color: "#2563EB" }}
          >← Back to site</Link>
          <h2 className="text-3xl font-black tracking-tight text-slate-900">Create your account</h2>
          <p className="mt-2 text-sm font-semibold text-slate-500">New signups join as users. Create a project to become its project admin.</p>

          <div className="mt-8 space-y-4">
            <label className="field-label">Email
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 z-10 pointer-events-none" size={18} />
                <input className="input" style={{ paddingLeft: "2.5rem" }} type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
            </label>
            <label className="field-label">Username
              <div className="relative">
                <UserRound className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 z-10 pointer-events-none" size={18} />
                <input className="input" style={{ paddingLeft: "2.5rem" }} value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
              </div>
            </label>
            <label className="field-label">Password
              <div className="relative">
                <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 z-10 pointer-events-none" size={18} />
                <input className="input" style={{ paddingLeft: "2.5rem", paddingRight: "2.5rem" }} type={showPassword ? "text" : "password"} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </label>
          </div>

          {error && (
            <p
              className="mt-4 rounded-2xl px-4 py-3 text-sm font-bold"
              style={{ background: "#FEF2F2", color: "#b91c1c" }}
            >{error}</p>
          )}

          <button
            className="mt-6 w-full rounded-full py-3 text-sm font-black text-white transition-colors shadow-md"
            style={{ background: "#2563EB" }}
            onMouseOver={e => e.currentTarget.style.background = "#1d4ed8"}
            onMouseOut={e => e.currentTarget.style.background = "#2563EB"}
            disabled={loading}
          >{loading ? "Creating..." : "Sign up"}</button>

          <p className="mt-6 text-center text-sm font-semibold text-slate-500">
            Have an account?{" "}
            <Link to="/login" className="font-black" style={{ color: "#2563EB" }}>Sign in</Link>
          </p>
        </motion.form>
      </section>

      <section className="relative hidden overflow-hidden p-10 lg:block" style={{ background: "#DBEAFE" }}>
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 20% 20%, rgba(37,99,235,0.09) 0%, transparent 28rem)," +
              "radial-gradient(circle at 80% 75%, rgba(59,130,246,0.07) 0%, transparent 26rem)",
          }}
        />
        <div
          className="relative flex h-full flex-col justify-between rounded-[2rem] border p-10"
          style={{ background: "linear-gradient(145deg, #EFF6FF, #DBEAFE)", borderColor: "#b0b8cc", boxShadow: "0 20px 60px rgba(37,99,235,0.10)" }}
        >
          <Link to="/" className="flex items-center gap-3 text-lg font-black text-slate-900">
            <span
              className="grid h-11 w-11 place-items-center rounded-2xl text-lg font-black text-white"
              style={{ background: "#2563EB" }}
            >T</span>
            TaskFlow
          </Link>

          <div>
            <h1 className="max-w-xl text-5xl font-black tracking-tight text-slate-900 leading-[1.08]">
              Start small, scale into a complete project operating system.
            </h1>
            <p className="mt-5 max-w-lg leading-8 text-slate-500">
              Assign tasks, set deadlines, and track your team's progress — everything you need to keep projects moving without the noise.
            </p>
          </div>

          <div
            className="rounded-3xl border p-5"
            style={{ background: "#ffffff", borderColor: "#bfdbfe", boxShadow: "0 4px 20px rgba(37,99,235,0.08)" }}
          >
            <div className="flex items-center justify-between">
              <p className="font-black text-slate-900">Onboarding progress</p>
              <span
                className="rounded-full px-3 py-1 text-xs font-black"
                style={{ background: "#DBEAFE", color: "#1D4ED8" }}
              >Live</span>
            </div>
            <div className="mt-5 space-y-3">
              {["Create account", "Join project", "Ship first task"].map((item, index) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-2xl p-3"
                  style={{ background: "#EFF6FF" }}
                >
                  <span
                    className="grid h-8 w-8 place-items-center rounded-full text-xs font-black text-white flex-shrink-0"
                    style={{ background: index === 1 ? "#3B82F6" : "#2563EB" }}
                  >{index + 1}</span>
                  <span className="font-bold text-slate-800">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}