import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

export default function Modal({ title, open, onClose, children }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 grid place-items-center bg-slate-950/45 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={onClose}
        >
          <motion.section
            initial={{ opacity: 0, scale: 0.96, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 18 }}
            transition={{ type: "spring", damping: 24, stiffness: 280 }}
            className="w-full max-w-xl rounded-[2rem] bg-white p-6 shadow-2xl"
            role="dialog"
            aria-modal="true"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl font-black tracking-tight text-slate-950">{title}</h2>
              <button className="grid h-10 w-10 place-items-center rounded-2xl bg-slate-100 text-slate-500 hover:bg-slate-200" onClick={onClose} title="Close">
                <X size={18} />
              </button>
            </div>
            <div className="mt-5">{children}</div>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
