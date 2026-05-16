import { motion } from "framer-motion";

export default function StatCard({ label, value, icon: Icon, tone = "indigo", helper }) {
  const tones = {
    indigo: "from-indigo-500 to-violet-500",
    emerald: "from-emerald-500 to-teal-500",
    amber: "from-amber-500 to-orange-500",
    rose: "from-rose-500 to-pink-500",
    sky: "from-sky-500 to-cyan-500",
  };

  return (
    <motion.article
      whileHover={{ y: -4 }}
      className="premium-card rounded-3xl p-5"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-slate-500">{label}</p>
          <strong className="mt-2 block text-3xl font-black tracking-tight text-slate-950">{value}</strong>
        </div>
        {Icon && (
          <span className={`grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br ${tones[tone]} text-white shadow-lg`}>
            <Icon size={22} />
          </span>
        )}
      </div>
      {helper && <p className="mt-4 text-xs font-semibold text-slate-500">{helper}</p>}
    </motion.article>
  );
}
