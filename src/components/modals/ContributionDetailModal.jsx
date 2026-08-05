"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiCalendar, FiMessageSquare } from "react-icons/fi";

export default function ContributionDetailModal({ isOpen, onClose, contribution }) {
  if (!isOpen || !contribution) return null;

  const {
    Supporter_name,
    userEmail,
    Supporter_email,
    supporterImage,
    campaign_title,
    Contribution_amount,
    amount,
    status,
    createdAt,
    current_date,
    message,
  } = contribution;

  const email = Supporter_email || userEmail || "N/A";
  const contribVal = Contribution_amount || amount || 0;
  const dateStr = createdAt || current_date;
  const formattedDate = dateStr
    ? new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
      })
    : "N/A";

  const statusStyles = {
    pending: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    approved: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    rejected: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6"
        >
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <FiX size={20} />
          </button>

          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            {supporterImage ? (
              <img src={supporterImage} alt={Supporter_name} className="w-12 h-12 rounded-2xl object-cover shrink-0 border border-slate-200 dark:border-slate-700" />
            ) : (
              <div className="w-12 h-12 rounded-2xl bg-blue-500 text-white flex items-center justify-center font-bold text-lg shrink-0">
                {(Supporter_name || "S")[0].toUpperCase()}
              </div>
            )}
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white line-clamp-1">Contribution Details</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">From {Supporter_name || "Anonymous Supporter"}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">Campaign Title</span>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 line-clamp-2">{campaign_title || "Untitled Campaign"}</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">Contribution Amount</span>
              <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{Number(contribVal).toLocaleString()} credits</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">Supporter Email</span>
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">{email}</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">Status</span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border capitalize ${statusStyles[status] || statusStyles.pending}`}>
                {status || "pending"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <FiCalendar size={14} className="text-slate-400" />
            <span>Submitted on: {formattedDate}</span>
          </div>

          <div>
            <span className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <FiMessageSquare size={14} className="text-blue-500" />
              Supporter Note / Message
            </span>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-300 leading-relaxed min-h-[80px]">
              {message ? message : <span className="italic text-slate-400">No message attached.</span>}
            </div>
          </div>

          <div className="flex justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-semibold transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
