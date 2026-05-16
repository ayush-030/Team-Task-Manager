import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, LockKeyhole, Mail, ClipboardList } from "lucide-react";
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

  const leftCards = [
    { label: "Assign tasks", sub: "to the right people, instantly" },
    { label: "Track deadlines", sub: "across every active project" },
    { label: "Stay aligned", sub: "with your whole team" },
  ];

  return (
    <main className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]" style={{ background: "#DBEAFE" }}>

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
          className="relative flex h-full flex-col justify-between rounded-[2rem] border p-10 overflow-hidden"
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
            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold"
              style={{ background: "#DBEAFE", color: "#1D4ED8", border: "1px solid #bfdbfe" }}
            >
              <ClipboardList size={15} /> Collaborative task management, simplified
            </div>
            <h1 className="mt-6 max-w-xl text-5xl font-black tracking-tight text-slate-900 leading-[1.08]">
              Turn project noise into a crisp operating rhythm.
            </h1>
            <p className="mt-5 max-w-lg leading-8 text-slate-500">
              Sign in to manage boards, deadlines, and team workflows from one calm interface.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {leftCards.map((card, index) => (
              <motion.div
                key={card.label}
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3.2, repeat: Infinity, delay: index * 0.25 }}
                className="rounded-2xl border p-4"
                style={{
                  background: index === 1 ? "#DBEAFE" : "#EFF6FF",
                  borderColor: index === 1 ? "#bfdbfe" : "#DBEAFE",
                }}
              >
                <p className="text-sm font-black text-slate-900">{card.label}</p>
                <p className="mt-2 text-xs font-semibold text-slate-500 leading-5">{card.sub}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

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
          <h2 className="text-3xl font-black tracking-tight text-slate-900">Welcome back</h2>
          <p className="mt-2 text-sm font-semibold text-slate-500">Use your email or username to continue.</p>

          <div className="mt-8 space-y-4">
            <label className="field-label">Email or username
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 z-10 pointer-events-none" size={18} />
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
          >{loading ? "Signing in..." : "Login"}</button>

          <p className="mt-6 text-center text-sm font-semibold text-slate-500">
            No account?{" "}
            <Link to="/signup" className="font-black" style={{ color: "#2563EB" }}>Create one</Link>
          </p>
        </motion.form>
      </section>
    </main>
  );
}