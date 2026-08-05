"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "@/lib/auth-client";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiCheckCircle, FiClock, FiHeart, FiCreditCard, FiFileText, FiRefreshCw, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { HiOutlineSparkles } from "react-icons/hi2";
import { getSupporterStats, getContributions } from "@/lib/api/contribution";

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

export default function SupporterDashboardPage() {
  const { data: session } = useSession();
  const user = session?.user;

  const [stats, setStats] = useState({ totalContributions: 0, pendingContributions: 0, totalAmountContributed: 0 });
  const [statsLoading, setStatsLoading] = useState(true);

  const [approvedContribs, setApprovedContribs] = useState([]);
  const [contribLoading, setContribLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const LIMIT = 8;

  const fetchStats = useCallback(async () => {
    if (!user?.email) return;
    setStatsLoading(true);
    try {
      const res = await getSupporterStats(user.email);
      if (res.success) setStats(res);
    } catch (e) { console.error(e); }
    finally { setStatsLoading(false); }
  }, [user?.email]);

  const fetchApproved = useCallback(async () => {
    if (!user?.email) return;
    setContribLoading(true);
    try {
      const res = await getContributions({ supporterEmail: user.email, status: "approved", page, limit: LIMIT });
      if (res.data) {
        setApprovedContribs(res.data);
        setTotalPages(res.totalPages || 1);
      }
    } catch (e) { console.error(e); }
    finally { setContribLoading(false); }
  }, [user?.email, page]);

  useEffect(() => { fetchStats(); }, [fetchStats]);
  useEffect(() => { fetchApproved(); }, [fetchApproved]);

  const statCards = [
    {
      label: "Total Contributions Made",
      value: statsLoading ? "—" : stats.totalContributions,
      icon: FiHeart,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-950/60",
    },
    {
      label: "Pending Contributions",
      value: statsLoading ? "—" : stats.pendingContributions,
      icon: FiClock,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-950/60",
    },
    {
      label: "Total Amount Contributed",
      value: statsLoading ? "—" : `${Number(stats.totalAmountContributed).toLocaleString()} cr`,
      icon: FiCheckCircle,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-950/60",
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">

      {/* ─── Welcome Banner ─── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Welcome back, {user?.name?.split(" ")[0] || "Supporter"}! 👋
          </h1>
          <p className="mt-1 text-sm text-blue-100">
            Track your backed projects, contributions, and account statistics.
          </p>
        </div>
        <Link
          href="/campaigns"
          className="self-start sm:self-auto px-4 py-2.5 rounded-xl bg-white text-blue-600 font-semibold text-xs sm:text-sm shadow hover:bg-blue-50 transition-all no-underline shrink-0"
        >
          Explore New Campaigns
        </Link>
      </motion.div>

      {/* ─── Stats Cards ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4"
            >
              <div className={`w-12 h-12 rounded-xl ${card.bg} ${card.color} flex items-center justify-center text-xl shrink-0`}>
                <Icon />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{card.label}</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">{card.value}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ─── Quick Links ─── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          { href: "/dashboard/supporter/contributions", label: "My Contributions", icon: FiHeart, color: "text-rose-500" },
          { href: "/dashboard/supporter/credits", label: "Purchase Credits", icon: FiCreditCard, color: "text-blue-500" },
          { href: "/dashboard/supporter/payment-history", label: "Payment History", icon: FiFileText, color: "text-emerald-500" },
        ].map(({ href, label, icon: Icon, color }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-2.5 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all no-underline group"
          >
            <Icon className={`${color} text-lg shrink-0 group-hover:scale-110 transition-transform`} />
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{label}</span>
          </Link>
        ))}
      </div>

      {/* ─── Available Credits ─── */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border border-blue-100 dark:border-blue-900/60 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FiCreditCard className="text-blue-500" size={22} />
          <div>
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Available Credits</p>
            <p className="text-2xl font-extrabold text-blue-700 dark:text-blue-300">{Number(user?.credits ?? 0).toLocaleString()}</p>
          </div>
        </div>
        <Link href="/dashboard/supporter/credits" className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition no-underline">
          Buy More
        </Link>
      </div>

      {/* ─── Approved Contributions ─── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FiCheckCircle className="text-emerald-500" size={20} />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Approved Contributions</h2>
          </div>
          <button
            onClick={fetchApproved}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 hover:text-blue-500 transition cursor-pointer"
          >
            <FiRefreshCw size={15} className={contribLoading ? "animate-spin" : ""} />
          </button>
        </div>

        {contribLoading ? (
          <div className="py-10 flex items-center justify-center gap-3 text-slate-400">
            <FiRefreshCw className="animate-spin text-blue-500" size={20} />
            <p className="text-sm">Loading contributions...</p>
          </div>
        ) : approvedContribs.length === 0 ? (
          <div className="py-12 text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-white/40 dark:bg-slate-900/40 space-y-2">
            <HiOutlineSparkles className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
            <p className="font-semibold text-slate-700 dark:text-slate-300">No approved contributions yet</p>
            <p className="text-sm text-slate-400">
              <Link href="/campaigns" className="text-blue-500 hover:underline">Explore campaigns</Link> to start contributing!
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80">
                    {["Campaign", "Amount", "Creator", "Status"].map((h) => (
                      <th key={h} className="text-left px-5 py-3 font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-xs">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {approvedContribs.map((c) => (
                    <tr key={c._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                      <td className="px-5 py-3.5 font-medium text-slate-800 dark:text-slate-200 max-w-[200px] truncate">{c.campaign_title}</td>
                      <td className="px-5 py-3.5 font-bold text-blue-600 dark:text-blue-400">{Number(c.Contribution_amount || c.amount || 0).toLocaleString()} cr</td>
                      <td className="px-5 py-3.5 text-slate-600 dark:text-slate-400">{c.creator_name || "Creator"}</td>
                      <td className="px-5 py-3.5"><StatusBadge status={c.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile/Tablet Cards */}
            <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-4">
              {approvedContribs.map((c) => (
                <div key={c._id} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-sm text-slate-800 dark:text-slate-200 truncate max-w-[180px]">{c.campaign_title}</p>
                    <StatusBadge status={c.status} />
                  </div>
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-[11px] text-slate-400">Amount</p>
                      <p className="text-base font-bold text-blue-600 dark:text-blue-400">{Number(c.Contribution_amount || c.amount || 0).toLocaleString()} cr</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-400">Creator</p>
                      <p className="text-sm text-slate-700 dark:text-slate-300">{c.creator_name || "Creator"}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
                <span className="text-xs text-slate-500">Page {page} of {totalPages}</span>
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
    </div>
  );
}
