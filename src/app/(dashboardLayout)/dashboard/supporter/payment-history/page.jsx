"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "@/lib/auth-client";
import { motion } from "framer-motion";
import { FiFileText, FiRefreshCw, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { HiOutlineCreditCard } from "react-icons/hi2";
import { serverFetch } from "@/lib/core/server";

export default function SupporterPaymentHistoryPage() {
  const { data: session } = useSession();
  const user = session?.user;

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const LIMIT = 10;

  const fetchHistory = useCallback(async () => {
    if (!user?.email) return;
    setLoading(true);
    try {
      const res = await serverFetch(`/api/payments/my-history?userEmail=${encodeURIComponent(user.email)}`);
      if (res.success) setPayments(res.data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [user?.email]);

  useEffect(() => { fetchHistory(); }, [fetchHistory]);

  const totalPages = Math.ceil(payments.length / LIMIT);
  const paged = payments.slice((page - 1) * LIMIT, page * LIMIT);

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <FiFileText className="text-blue-500" />
            Payment History
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">All credit purchases you have made.</p>
        </div>
        <button
          onClick={fetchHistory}
          className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 hover:text-blue-500 transition cursor-pointer"
        >
          <FiRefreshCw size={16} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {loading ? (
        <div className="py-12 flex flex-col items-center gap-3 text-slate-400">
          <FiRefreshCw className="animate-spin text-blue-500" size={24} />
          <p className="text-sm">Loading payment history...</p>
        </div>
      ) : payments.length === 0 ? (
        <div className="py-16 text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-white/40 dark:bg-slate-900/40 space-y-2">
          <HiOutlineCreditCard className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
          <p className="font-semibold text-slate-700 dark:text-slate-300">No payment history yet</p>
          <p className="text-sm text-slate-400">Your credit purchases will appear here.</p>
        </div>
      ) : (
        <>
          <div className="hidden lg:block overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80">
                  {["#", "Date", "Package", "Credits Added", "Amount Paid", "Method", "Status"].map((h) => (
                    <th key={h} className="text-left px-5 py-3 font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-xs">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {paged.map((p, i) => (
                  <motion.tr
                    key={p._id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition"
                  >
                    <td className="px-5 py-3.5 text-slate-400 text-xs">#{(page - 1) * LIMIT + i + 1}</td>
                    <td className="px-5 py-3.5 text-slate-600 dark:text-slate-400 text-xs">
                      {p.createdAt ? new Date(p.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "N/A"}
                    </td>
                    <td className="px-5 py-3.5 text-slate-700 dark:text-slate-300 font-medium">{p.packageName || "Credit Purchase"}</td>
                    <td className="px-5 py-3.5 font-bold text-blue-600 dark:text-blue-400">{Number(p.creditsAdded || 0).toLocaleString()} cr</td>
                    <td className="px-5 py-3.5 font-bold text-emerald-600 dark:text-emerald-400">${Number(p.amount || 0).toFixed(2)}</td>
                    <td className="px-5 py-3.5 text-slate-600 dark:text-slate-400">{p.paymentMethod || "Stripe"}</td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">
                        {p.status || "completed"}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-4">
            {paged.map((p, i) => (
              <motion.div
                key={p._id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    {p.createdAt ? new Date(p.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "N/A"}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">
                    {p.status || "completed"}
                  </span>
                </div>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{p.packageName || "Credit Purchase"}</p>
                <div className="flex items-center gap-5">
                  <div>
                    <p className="text-[11px] text-slate-400 uppercase font-semibold">Credits</p>
                    <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{Number(p.creditsAdded || 0).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-400 uppercase font-semibold">Paid</p>
                    <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">${Number(p.amount || 0).toFixed(2)}</p>
                  </div>
                </div>
                <p className="text-xs text-slate-500">{p.paymentMethod || "Stripe"}</p>
              </motion.div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-500">
                Page <span className="font-bold">{page}</span> of <span className="font-bold">{totalPages}</span> ({payments.length} total)
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
