"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "@/lib/auth-client";
import { motion } from "framer-motion";
import { FiFileText, FiRefreshCw, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { HiOutlineBanknotes } from "react-icons/hi2";
import { getCreatorWithdrawals } from "@/lib/api/withdrawal";

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

export default function CreatorPaymentHistoryPage() {
  const { data: session } = useSession();
  const user = session?.user;

  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const LIMIT = 10;

  const fetchWithdrawals = useCallback(async () => {
    if (!user?.email) return;
    setLoading(true);
    try {
      const res = await getCreatorWithdrawals(user.email);
      if (res.success) setWithdrawals(res.data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [user?.email]);

  useEffect(() => { fetchWithdrawals(); }, [fetchWithdrawals]);

  const totalPages = Math.ceil(withdrawals.length / LIMIT);
  const pagedWithdrawals = withdrawals.slice((page - 1) * LIMIT, page * LIMIT);

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <FiFileText className="text-blue-500" />
            Payment History
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">All withdrawal requests you have submitted.</p>
        </div>
        <button
          onClick={fetchWithdrawals}
          className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 hover:text-blue-500 transition cursor-pointer"
        >
          <FiRefreshCw size={16} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {loading ? (
        <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-400">
          <FiRefreshCw className="animate-spin text-blue-500" size={24} />
          <p className="text-sm">Loading payment history...</p>
        </div>
      ) : withdrawals.length === 0 ? (
        <div className="py-16 text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-white/40 dark:bg-slate-900/40 space-y-2">
          <HiOutlineBanknotes className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
          <p className="font-semibold text-slate-700 dark:text-slate-300">No payment history yet</p>
          <p className="text-sm text-slate-400">Your withdrawal requests will appear here after submission.</p>
        </div>
      ) : (
        <>
          <div className="hidden lg:block overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80">
                  {["#", "Date", "Credits", "Amount ($)", "Payment System", "Account", "Status"].map((h) => (
                    <th key={h} className="text-left px-5 py-3 font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-xs">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {pagedWithdrawals.map((w, i) => (
                  <motion.tr
                    key={w._id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition"
                  >
                    <td className="px-5 py-3.5 text-slate-400 text-xs">#{(page - 1) * LIMIT + i + 1}</td>
                    <td className="px-5 py-3.5 text-slate-600 dark:text-slate-400 text-xs">
                      {w.withdraw_date ? new Date(w.withdraw_date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "N/A"}
                    </td>
                    <td className="px-5 py-3.5 font-bold text-blue-600 dark:text-blue-400">{Number(w.withdrawal_credit).toLocaleString()} cr</td>
                    <td className="px-5 py-3.5 font-bold text-emerald-600 dark:text-emerald-400">${Number(w.withdrawal_amount).toFixed(2)}</td>
                    <td className="px-5 py-3.5 text-slate-700 dark:text-slate-300">{w.payment_system}</td>
                    <td className="px-5 py-3.5 text-slate-600 dark:text-slate-400 max-w-[120px] truncate">{w.account_number}</td>
                    <td className="px-5 py-3.5"><StatusBadge status={w.status} /></td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-4">
            {pagedWithdrawals.map((w, i) => (
              <motion.div
                key={w._id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    {w.withdraw_date ? new Date(w.withdraw_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "N/A"}
                  </span>
                  <StatusBadge status={w.status} />
                </div>
                <div className="flex items-center gap-5">
                  <div>
                    <p className="text-[11px] text-slate-400 uppercase font-semibold">Credits</p>
                    <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{Number(w.withdrawal_credit).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-400 uppercase font-semibold">Amount</p>
                    <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">${Number(w.withdrawal_amount).toFixed(2)}</p>
                  </div>
                </div>
                <div className="text-xs text-slate-500 flex items-center gap-2">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{w.payment_system}</span>
                  <span>•</span>
                  <span>{w.account_number}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Page <span className="font-bold text-slate-800 dark:text-slate-200">{page}</span> of <span className="font-bold">{totalPages}</span> ({withdrawals.length} total)
              </span>
              <div className="flex gap-2">
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 disabled:opacity-40 hover:bg-slate-50 transition cursor-pointer">
                  <FiChevronLeft size={15} />
                </button>
                <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 disabled:opacity-40 hover:bg-slate-50 transition cursor-pointer">
                  <FiChevronRight size={15} />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
