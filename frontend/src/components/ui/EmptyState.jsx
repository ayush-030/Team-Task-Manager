import { motion } from "framer-motion";
import { Inbox } from "lucide-react";

export default function EmptyState({ title, description, action }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="premium-card rounded-3xl p-10 text-center"
    >
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-indigo-50 text-indigo-600">
        <Inbox size={24} />
      </div>
      <h3 className="mt-4 text-lg font-black text-slate-950">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </motion.div>
  );
}
