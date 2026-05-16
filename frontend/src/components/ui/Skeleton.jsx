import { motion } from "framer-motion";

export function Skeleton({ className = "" }) {
  return (
    <motion.div
      className={`rounded-2xl bg-slate-200/70 ${className}`}
      animate={{ opacity: [0.45, 0.9, 0.45] }}
      transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="premium-card rounded-3xl p-5">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="mt-4 h-8 w-16" />
      <Skeleton className="mt-5 h-3 w-full" />
    </div>
  );
}
