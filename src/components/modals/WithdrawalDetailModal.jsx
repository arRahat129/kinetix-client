"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiCalendar, FiCreditCard, FiDollarSign } from "react-icons/fi";
import { HiOutlineBanknotes } from "react-icons/hi2";

const StatusBadge = ({ status }) => {
  const styles = {
    pending: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    approved: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    rejected: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border capitalize ${styles[status] || styles.pending}`}>
      {status}
    </span>
  );
};

export default function WithdrawalDetailModal({ isOpen, onClose, withdrawal }) {
  if (!isOpen || !withdrawal) return null;

  const formattedDate = withdrawal.withdraw_date
    ? new Date(withdrawal.withdraw_date).toLocaleDateString("en-US", {
        year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
      })
    : "N/A";

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6"
        >
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <FiX size={20} />
          </button>

          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500 text-white flex items-center justify-center font-bold text-lg shrink-0">
              <HiOutlineBanknotes size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Withdrawal Details</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Status: <StatusBadge status={withdrawal.status} /></p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">Creator Name</span>
                <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">{withdrawal.creator_name}</p>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">Creator Email</span>
                <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">{withdrawal.creator_email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">Credits Withdrawn</span>
                <p className="text-sm sm:text-base font-bold text-blue-600 dark:text-blue-400">{Number(withdrawal.withdrawal_credit).toLocaleString()} cr</p>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">USD Amount</span>
                <p className="text-sm sm:text-base font-bold text-emerald-600 dark:text-emerald-400 flex items-center">
                  <FiDollarSign className="inline-block shrink-0 -mt-0.5" size={14} />
                  {Number(withdrawal.withdrawal_amount).toFixed(2)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">Payment Method</span>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{withdrawal.payment_system}</p>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">Account Number</span>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">{withdrawal.account_number}</p>
              </div>
            </div>

            {withdrawal.adminNote && (
              <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/60 text-xs text-rose-700 dark:text-rose-400">
                <span className="font-bold uppercase block mb-1">Admin Remarks:</span>
                {withdrawal.adminNote}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <FiCalendar size={14} />
            <span>Requested on: {formattedDate}</span>
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
