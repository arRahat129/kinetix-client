"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "@/lib/auth-client";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiHeart, FiSearch, FiFilter, FiRefreshCw,
  FiChevronLeft, FiChevronRight
} from "react-icons/fi";
import { HiOutlineSparkles } from "react-icons/hi2";
import Link from "next/link";
import { getContributions } from "@/lib/api/contribution";

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

const STATUS_OPTIONS = ["", "pending", "approved", "rejected"];
const LIMIT = 10;

export default function MyContributionsPage() {
  const { data: session, isPending } = useSession();
  const user = session?.user;

  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const email = user?.email;

  const fetchContributions = useCallback(async () => {
    if (!email) {
      if (!isPending) setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await getContributions({
        supporterEmail: email,
        status: statusFilter,
        search,
        page,
        limit: LIMIT,
      });
      if (res && res.data) {
        setContributions(res.data);
        setTotalPages(res.totalPages || 1);
        setTotalItems(res.total || 0);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [email, isPending, statusFilter, search, page]);

  useEffect(() => { fetchContributions(); }, [fetchContributions]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <FiHeart className="text-rose-500" />
            My Contributions
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            All campaigns you've supported. Total: <span className="font-bold text-slate-700 dark:text-slate-300">{totalItems}</span>
          </p>
        </div>
        <Link
          href="/campaigns"
          className="self-start sm:self-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs sm:text-sm shadow-md transition no-underline flex items-center gap-2"
        >
          <HiOutlineSparkles size={15} />
          Find More Campaigns
        </Link>
      </div>

      {/* Filters */}
      <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col sm:flex-row gap-3 items-center">
        {/* Search */}
        <div className="relative w-full sm:flex-1">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by campaign title..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/30"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <FiFilter className="text-slate-400 shrink-0" size={16} />
          <div className="flex gap-2 flex-wrap">
            {STATUS_OPTIONS.map((s, index) => (
              <button
                key={s || `status-${index}`}
                onClick={() => { setStatusFilter(s); setPage(1); }}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold capitalize border transition cursor-pointer ${statusFilter === s
                  ? "bg-blue-600 text-white border-blue-600"
                  : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400"
                  }`}
              >
                {s || "All"}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={fetchContributions}
          title="Refresh"
          className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-500 hover:text-blue-500 transition cursor-pointer shrink-0"
        >
          <FiRefreshCw size={16} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="py-12 flex flex-col items-center gap-3 text-slate-400">
          <FiRefreshCw className="w-8 h-8 animate-spin text-blue-500" />
          <p className="text-sm">Loading your contributions...</p>
        </div>
      ) : contributions.length === 0 ? (
        <div className="py-16 text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-white/40 dark:bg-slate-900/40 space-y-2">
          <FiHeart className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
          <p className="font-semibold text-slate-700 dark:text-slate-300">
            {search || statusFilter ? "No contributions match your filters" : "No contributions yet"}
          </p>
          <p className="text-sm text-slate-400">
            <Link href="/campaigns" className="text-blue-500 hover:underline">Explore campaigns</Link> to start contributing!
          </p>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          {/* Desktop Table */}
          <div key="desktop-table" className="hidden lg:block overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80">
                  {["#", "Campaign", "Amount", "Creator", "Date", "Status"].map((h) => (
                    <th key={h} className="text-left px-5 py-3 font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-xs">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {contributions.map((c, i) => (
                  <motion.tr
                    key={c._id || c.id || i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition"
                  >
                    <td className="px-5 py-3.5 text-slate-400 text-xs">#{(page - 1) * LIMIT + i + 1}</td>
                    <td className="px-5 py-3.5 font-medium text-slate-800 dark:text-slate-200 max-w-[200px] truncate">{c.campaign_title}</td>
                    <td className="px-5 py-3.5 font-bold text-blue-600 dark:text-blue-400">{Number(c.Contribution_amount || c.amount || 0).toLocaleString()} cr</td>
                    <td className="px-5 py-3.5 text-slate-600 dark:text-slate-400">{c.creator_name || "Creator"}</td>
                    <td className="px-5 py-3.5 text-slate-500 text-xs">
                      {c.createdAt ? new Date(c.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "N/A"}
                    </td>
                    <td className="px-5 py-3.5"><StatusBadge status={c.status} /></td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile/Tablet Cards */}
          <div key="mobile-cards" className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-4">
            {contributions.map((c, i) => (
              <motion.div
                key={c._id || c.id || i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="font-semibold text-sm text-slate-800 dark:text-slate-200 line-clamp-2">{c.campaign_title}</p>
                  <StatusBadge status={c.status} />
                </div>
                <div className="flex items-center gap-5">
                  <div>
                    <p className="text-[11px] text-slate-400 uppercase font-semibold">Amount</p>
                    <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{Number(c.Contribution_amount || c.amount || 0).toLocaleString()} cr</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-400 uppercase font-semibold">Creator</p>
                    <p className="text-sm text-slate-700 dark:text-slate-300">{c.creator_name || "Creator"}</p>
                  </div>
                </div>
                <p className="text-xs text-slate-400">
                  {c.createdAt ? new Date(c.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "N/A"}
                </p>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Page <span className="font-bold text-slate-800 dark:text-slate-200">{page}</span> of <span className="font-bold">{totalPages}</span> ({totalItems} total)
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-700 transition cursor-pointer"
            >
              <FiChevronLeft size={16} />
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`w-9 h-9 rounded-xl text-sm font-semibold transition cursor-pointer border ${page === pageNum
                    ? "bg-blue-600 text-white border-blue-600"
                    : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                    }`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-700 transition cursor-pointer"
            >
              <FiChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
