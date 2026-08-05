"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "@/lib/auth-client";
import Link from "next/link";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import {
  FiPlusCircle, FiGrid, FiTrendingUp, FiUsers, FiActivity,
  FiEye, FiCheck, FiX, FiChevronLeft, FiChevronRight, FiRefreshCw,
  FiInbox, FiSearch, FiFilter
} from "react-icons/fi";
import { HiOutlineSparkles } from "react-icons/hi2";
import { getCreatorStats, getContributions } from "@/lib/api/contribution";
import { approveContribution, rejectContribution } from "@/lib/actions/contribution";
import ConfirmModal from "@/components/modals/ConfirmModal";
import ContributionDetailModal from "@/components/modals/ContributionDetailModal";

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

export default function CreatorDashboardPage() {
  const { data: session } = useSession();
  const user = session?.user;

  const [stats, setStats] = useState({ totalCampaigns: 0, activeCampaigns: 0, totalAmountRaised: 0 });
  const [statsLoading, setStatsLoading] = useState(true);

  const [contributions, setContributions] = useState([]);
  const [contribLoading, setContribLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const LIMIT = 8;

  const [viewContrib, setViewContrib] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ open: false, type: null, contrib: null });
  const [actionLoading, setActionLoading] = useState(false);

  const fetchStats = useCallback(async () => {
    if (!user?.email) return;
    setStatsLoading(true);
    try {
      const res = await getCreatorStats({ creatorEmail: user.email, userId: user.id });
      if (res.success) setStats(res);
    } catch (e) { console.error(e); }
    finally { setStatsLoading(false); }
  }, [user?.email, user?.id]);

  const fetchContributions = useCallback(async () => {
    if (!user?.email) return;
    setContribLoading(true);
    try {
      const res = await getContributions({ creatorEmail: user.email, status: "pending", search, page, limit: LIMIT });
      if (res.data) {
        setContributions(res.data);
        setTotalPages(res.totalPages || 1);
        setTotalItems(res.total || 0);
      }
    } catch (e) { console.error(e); }
    finally { setContribLoading(false); }
  }, [user?.email, search, page]);

  useEffect(() => { fetchStats(); }, [fetchStats]);
  useEffect(() => { fetchContributions(); }, [fetchContributions]);

  const handleApprove = async () => {
    setActionLoading(true);
    try {
      const res = await approveContribution(confirmModal.contrib._id);
      if (res.success) {
        toast.success("Contribution approved! Raised amount updated.");
        fetchContributions();
        fetchStats();
      } else {
        toast.error(res.message || "Approval failed");
      }
    } catch (e) { toast.error("An error occurred"); }
    finally {
      setActionLoading(false);
      setConfirmModal({ open: false, type: null, contrib: null });
    }
  };

  const handleReject = async () => {
    setActionLoading(true);
    try {
      const res = await rejectContribution(confirmModal.contrib._id);
      if (res.success) {
        toast.success("Contribution rejected. Credits refunded to supporter.");
        fetchContributions();
      } else {
        toast.error(res.message || "Rejection failed");
      }
    } catch (e) { toast.error("An error occurred"); }
    finally {
      setActionLoading(false);
      setConfirmModal({ open: false, type: null, contrib: null });
    }
  };

  const statCards = [
    {
      label: "Total Campaigns",
      value: statsLoading ? "—" : stats.totalCampaigns,
      icon: FiGrid,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-950/60",
    },
    {
      label: "Active Campaigns",
      value: statsLoading ? "—" : stats.activeCampaigns,
      icon: FiActivity,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-950/60",
    },
    {
      label: "Total Credits Raised",
      value: statsLoading ? "—" : `${Number(stats.totalAmountRaised || 0).toLocaleString()} cr`,
      icon: FiTrendingUp,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-950/60",
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <Toaster position="top-right" />

      {/* ─── Welcome Banner ─── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white shadow-lg"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Creator Studio, {user?.name?.split(" ")[0] || "Creator"}! 🚀
          </h1>
          <p className="mt-1 text-sm text-amber-100">
            Manage your campaigns, review contributions, and track funding progress.
          </p>
        </div>
        <Link
          href="/dashboard/creator/add-campaign"
          className="self-start sm:self-auto px-4 py-2.5 rounded-xl bg-white text-amber-600 font-semibold text-xs sm:text-sm shadow hover:bg-amber-50 transition-all no-underline shrink-0 flex items-center gap-2"
        >
          <FiPlusCircle size={16} />
          <span>Create Campaign</span>
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
          { href: "/dashboard/creator/my-campaigns", label: "My Campaigns", icon: FiGrid, color: "text-indigo-600 dark:text-indigo-400" },
          { href: "/dashboard/creator/withdrawals", label: "Withdrawals", icon: FiTrendingUp, color: "text-emerald-600 dark:text-emerald-400" },
          { href: "/dashboard/creator/payment-history", label: "Payment History", icon: FiUsers, color: "text-blue-600 dark:text-blue-400" },
        ].map(({ href, label, icon: Icon, color }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-2.5 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all no-underline group`}
          >
            <Icon className={`${color} text-lg shrink-0 group-hover:scale-110 transition-transform`} />
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{label}</span>
          </Link>
        ))}
      </div>

      {/* ─── Contributions To Review ─── */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <FiInbox className="text-amber-500" size={20} />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Contributions To Review</h2>
            {totalItems > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white text-xs font-bold">{totalItems}</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by name or campaign..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="pl-9 pr-4 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-amber-500/30 w-56"
              />
            </div>
            <button
              onClick={() => fetchContributions()}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 hover:text-amber-500 transition cursor-pointer"
            >
              <FiRefreshCw size={16} className={contribLoading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        {contribLoading ? (
          <div className="py-12 flex flex-col items-center gap-3 text-slate-400">
            <FiRefreshCw className="w-8 h-8 animate-spin text-amber-500" />
            <p className="text-sm">Loading contributions...</p>
          </div>
        ) : contributions.length === 0 ? (
          <div className="py-16 text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-white/40 dark:bg-slate-900/40 space-y-2">
            <HiOutlineSparkles className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
            <p className="font-semibold text-slate-700 dark:text-slate-300">No pending contributions</p>
            <p className="text-sm text-slate-500">{search ? "No results for your search." : "You're all caught up! No contributions awaiting review."}</p>
          </div>
        ) : (
          <>
            <div className="hidden lg:block overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80">
                    <th className="text-left px-5 py-3 font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-xs">Supporter</th>
                    <th className="text-left px-5 py-3 font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-xs">Campaign</th>
                    <th className="text-left px-5 py-3 font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-xs">Amount</th>
                    <th className="text-left px-5 py-3 font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-xs">Status</th>
                    <th className="text-center px-5 py-3 font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-xs">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {contributions.map((c) => (
                    <tr key={c._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          {c.supporterImage ? (
                            <img src={c.supporterImage} alt={c.Supporter_name} className="w-8 h-8 rounded-full object-cover shrink-0" />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-xs shrink-0">
                              {(c.Supporter_name || "S")[0].toUpperCase()}
                            </div>
                          )}
                          <span className="font-medium text-slate-800 dark:text-slate-200">{c.Supporter_name || "Supporter"}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 max-w-[180px]">
                        <p className="text-slate-700 dark:text-slate-300 truncate font-medium">{c.campaign_title}</p>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="font-bold text-blue-600 dark:text-blue-400">{Number(c.Contribution_amount || c.amount || 0).toLocaleString()} cr</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <StatusBadge status={c.status} />
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            title="View Details"
                            onClick={() => setViewContrib(c)}
                            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-blue-100 dark:hover:bg-blue-900/40 hover:text-blue-600 dark:hover:text-blue-400 transition cursor-pointer"
                          >
                            <FiEye size={15} />
                          </button>
                          <button
                            title="Approve"
                            onClick={() => setConfirmModal({ open: true, type: "approve", contrib: c })}
                            className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition cursor-pointer"
                          >
                            <FiCheck size={15} />
                          </button>
                          <button
                            title="Reject"
                            onClick={() => setConfirmModal({ open: true, type: "reject", contrib: c })}
                            className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/60 transition cursor-pointer"
                          >
                            <FiX size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-4">
              {contributions.map((c) => (
                <motion.div
                  key={c._id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      {c.supporterImage ? (
                        <img src={c.supporterImage} alt={c.Supporter_name} className="w-9 h-9 rounded-full object-cover shrink-0" />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-xs shrink-0">
                          {(c.Supporter_name || "S")[0].toUpperCase()}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-semibold text-sm text-slate-800 dark:text-slate-200 truncate">{c.Supporter_name || "Supporter"}</p>
                        <p className="text-xs text-slate-400 truncate">{c.Supporter_email || c.userEmail}</p>
                      </div>
                    </div>
                    <StatusBadge status={c.status} />
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Campaign</p>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 line-clamp-1">{c.campaign_title}</p>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-3">
                    <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                      {Number(c.Contribution_amount || c.amount || 0).toLocaleString()} cr
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        title="View"
                        onClick={() => setViewContrib(c)}
                        className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-blue-600 transition cursor-pointer"
                      >
                        <FiEye size={15} />
                      </button>
                      <button
                        title="Approve"
                        onClick={() => setConfirmModal({ open: true, type: "approve", contrib: c })}
                        className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 hover:bg-emerald-100 transition cursor-pointer"
                      >
                        <FiCheck size={15} />
                      </button>
                      <button
                        title="Reject"
                        onClick={() => setConfirmModal({ open: true, type: "reject", contrib: c })}
                        className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 hover:bg-rose-100 transition cursor-pointer"
                      >
                        <FiX size={15} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Page <span className="font-bold text-slate-800 dark:text-slate-200">{page}</span> of <span className="font-bold text-slate-800 dark:text-slate-200">{totalPages}</span> ({totalItems} total)
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 transition cursor-pointer"
                  >
                    <FiChevronLeft size={16} />
                  </button>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 transition cursor-pointer"
                  >
                    <FiChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <ContributionDetailModal
        isOpen={!!viewContrib}
        onClose={() => setViewContrib(null)}
        contribution={viewContrib}
      />

      <ConfirmModal
        isOpen={confirmModal.open}
        onClose={() => setConfirmModal({ open: false, type: null, contrib: null })}
        onConfirm={confirmModal.type === "approve" ? handleApprove : handleReject}
        loading={actionLoading}
        variant={confirmModal.type === "approve" ? "success" : "danger"}
        title={confirmModal.type === "approve" ? "Approve Contribution?" : "Reject Contribution?"}
        description={
          confirmModal.type === "approve"
            ? `Approve ${Number(confirmModal.contrib?.Contribution_amount || confirmModal.contrib?.amount || 0).toLocaleString()} credits from ${confirmModal.contrib?.Supporter_name || "supporter"}? This will add the amount to your campaign's raised credits.`
            : `Reject and refund ${Number(confirmModal.contrib?.Contribution_amount || confirmModal.contrib?.amount || 0).toLocaleString()} credits back to ${confirmModal.contrib?.Supporter_name || "supporter"}?`
        }
        confirmText={confirmModal.type === "approve" ? "Approve" : "Reject & Refund"}
        cancelText="Cancel"
      />
    </div>
  );
}
