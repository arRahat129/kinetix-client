"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "@/lib/auth-client";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import {
  FiDollarSign, FiSearch, FiFilter, FiRefreshCw,
  FiChevronLeft, FiChevronRight, FiEye, FiCheck, FiX, FiCheckCircle
} from "react-icons/fi";
import { HiOutlineBanknotes, HiOutlineSparkles } from "react-icons/hi2";
import { getAdminWithdrawals } from "@/lib/api/withdrawal";
import { updateWithdrawalStatus } from "@/lib/actions/withdrawal";
import ConfirmModal from "@/components/modals/ConfirmModal";
import WithdrawalDetailModal from "@/components/modals/WithdrawalDetailModal";

const STATUS_OPTIONS = ["", "pending", "approved", "rejected"];
const LIMIT = 10;

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

export default function AdminWithdrawalsPage() {
  const { data: session } = useSession();
  const user = session?.user;

  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Modals state
  const [viewDetail, setViewDetail] = useState(null);
  const [confirmState, setConfirmState] = useState({ open: false, type: null, req: null });
  const [actionLoading, setActionLoading] = useState(false);
  const [adminNote, setAdminNote] = useState("");

  const fetchWithdrawals = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAdminWithdrawals({
        status: statusFilter,
        search,
        page,
        limit: LIMIT
      });
      if (res.success) {
        setWithdrawals(res.data || []);
        setTotalPages(res.totalPages || 1);
        setTotalItems(res.total || 0);
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to load withdrawal requests.");
    } finally {
      setLoading(false);
    }
  }, [statusFilter, search, page]);

  useEffect(() => {
    if (user?.role === "Admin") {
      fetchWithdrawals();
    }
  }, [user, fetchWithdrawals]);

  const handleAction = async () => {
    if (!confirmState.req) return;
    setActionLoading(true);
    try {
      const res = await updateWithdrawalStatus(confirmState.req._id, {
        status: confirmState.type === "approve" ? "approved" : "rejected",
        adminNote: adminNote.trim()
      });
      if (res.success) {
        toast.success(`Request ${confirmState.type === "approve" ? "approved" : "rejected"} successfully.`);
        setAdminNote("");
        fetchWithdrawals();
      } else {
        toast.error(res.message || "Failed to process request.");
      }
    } catch (err) {
      toast.error("An error occurred.");
    } finally {
      setActionLoading(false);
      setConfirmState({ open: false, type: null, req: null });
    }
  };

  if (user?.role !== "Admin") {
    return (
      <div className="py-20 text-center text-slate-400">
        <p>Access Denied. Admin privileges required.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2 tracking-tight">
            <HiOutlineBanknotes className="text-rose-500" size={32} />
            Withdrawal Requests
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Moderate, review, and approve creator payout requests. Total requests: <span className="font-bold text-slate-700 dark:text-slate-300">{totalItems}</span>
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col md:flex-row gap-3 items-center">
        {/* Search */}
        <div className="relative w-full md:flex-1">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by creator name, email, or account..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-rose-500/30"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <FiFilter className="text-slate-400 shrink-0" size={16} />
          <div className="flex gap-2 flex-wrap">
            {STATUS_OPTIONS.map((s, index) => (
              <button
                key={s || `status-${index}`}
                onClick={() => { setStatusFilter(s); setPage(1); }}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold capitalize border transition cursor-pointer ${
                  statusFilter === s
                    ? "bg-rose-600 text-white border-rose-600"
                    : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-rose-400 hover:text-rose-600 dark:hover:text-rose-400"
                }`}
              >
                {s || "All"}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={fetchWithdrawals}
          title="Refresh"
          className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-500 hover:text-rose-500 transition cursor-pointer shrink-0"
        >
          <FiRefreshCw size={16} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="py-12 flex flex-col items-center gap-3 text-slate-400">
          <FiRefreshCw className="w-8 h-8 animate-spin text-rose-500" />
          <p className="text-sm">Loading requests...</p>
        </div>
      ) : withdrawals.length === 0 ? (
        <div className="py-16 text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-white/40 dark:bg-slate-900/40 space-y-2">
          <HiOutlineBanknotes className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
          <p className="font-semibold text-slate-700 dark:text-slate-300">
            {search || statusFilter ? "No payout requests match your filters" : "No payout requests found"}
          </p>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          {/* Desktop Table */}
          <div key="desktop-table" className="hidden lg:block overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80">
                  <th className="text-left px-5 py-3 font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-xs">Creator</th>
                  <th className="text-left px-5 py-3 font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-xs">Credits</th>
                  <th className="text-left px-5 py-3 font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-xs">Amount USD</th>
                  <th className="text-left px-5 py-3 font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-xs">Payment Info</th>
                  <th className="text-left px-5 py-3 font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-xs">Status</th>
                  <th className="text-center px-5 py-3 font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-xs">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {withdrawals.map((w, i) => (
                  <motion.tr
                    key={w._id || i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition"
                  >
                    <td className="px-5 py-3.5">
                      <p className="font-semibold text-slate-800 dark:text-slate-200">{w.creator_name}</p>
                      <p className="text-xs text-slate-400">{w.creator_email}</p>
                    </td>
                    <td className="px-5 py-3.5 font-bold text-blue-600 dark:text-blue-400">
                      {Number(w.withdrawal_credit).toLocaleString()} cr
                    </td>
                    <td className="px-5 py-3.5 font-bold text-emerald-600 dark:text-emerald-400">
                      ${Number(w.withdrawal_amount).toFixed(2)}
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="text-slate-700 dark:text-slate-300 font-medium">{w.payment_system}</p>
                      <p className="text-xs text-slate-400 max-w-[150px] truncate">{w.account_number}</p>
                    </td>
                    <td className="px-5 py-3.5"><StatusBadge status={w.status} /></td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          title="View Detail"
                          onClick={() => setViewDetail(w)}
                          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-blue-100 dark:hover:bg-blue-900/40 hover:text-blue-600 transition cursor-pointer"
                        >
                          <FiEye size={15} />
                        </button>
                        {w.status === "pending" && (
                          <>
                            <button
                              title="Approve Payout"
                              onClick={() => setConfirmState({ open: true, type: "approve", req: w })}
                              className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 hover:bg-emerald-100 transition cursor-pointer"
                            >
                              <FiCheck size={15} />
                            </button>
                            <button
                              title="Reject Payout"
                              onClick={() => setConfirmState({ open: true, type: "reject", req: w })}
                              className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 hover:bg-rose-100 transition cursor-pointer"
                            >
                              <FiX size={15} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile/Tablet Card Grid */}
          <div key="mobile-cards" className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-4">
            {withdrawals.map((w, i) => (
              <motion.div
                key={w._id || i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">{w.creator_name}</p>
                    <p className="text-xs text-slate-400">{w.creator_email}</p>
                  </div>
                  <StatusBadge status={w.status} />
                </div>
                <div className="flex gap-4 border-t border-b border-slate-100 dark:border-slate-800 py-2">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Credits</span>
                    <span className="font-bold text-blue-600 dark:text-blue-400">{Number(w.withdrawal_credit).toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Amount USD</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">${Number(w.withdrawal_amount).toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Method</span>
                    <span className="font-medium text-slate-700 dark:text-slate-300 text-xs">{w.payment_system}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center pt-1">
                  <span className="text-[11px] text-slate-400">{w.account_number}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setViewDetail(w)}
                      className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-blue-600 transition cursor-pointer"
                    >
                      <FiEye size={14} />
                    </button>
                    {w.status === "pending" && (
                      <>
                        <button
                          onClick={() => setConfirmState({ open: true, type: "approve", req: w })}
                          className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 hover:bg-emerald-100 transition cursor-pointer"
                        >
                          <FiCheck size={14} />
                        </button>
                        <button
                          onClick={() => setConfirmState({ open: true, type: "reject", req: w })}
                          className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 hover:bg-rose-100 transition cursor-pointer"
                        >
                          <FiX size={14} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
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
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 disabled:opacity-40 hover:bg-slate-50 transition cursor-pointer"
            >
              <FiChevronLeft size={16} />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 disabled:opacity-40 hover:bg-slate-50 transition cursor-pointer"
            >
              <FiChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* View Detail Modal */}
      <WithdrawalDetailModal
        isOpen={!!viewDetail}
        onClose={() => setViewDetail(null)}
        withdrawal={viewDetail}
      />

      {/* Action Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmState.open}
        onClose={() => setConfirmState({ open: false, type: null, req: null })}
        onConfirm={handleAction}
        loading={actionLoading}
        variant={confirmState.type === "approve" ? "success" : "danger"}
        title={confirmState.type === "approve" ? "Approve Withdrawal Request?" : "Reject Withdrawal Request?"}
        description={
          confirmState.type === "approve"
            ? `Are you sure you want to approve this payout of ${Number(confirmState.req?.withdrawal_credit || 0).toLocaleString()} credits ($${Number(confirmState.req?.withdrawal_amount || 0).toFixed(2)}) to ${confirmState.req?.creator_name}?`
            : `Are you sure you want to reject this request? The ${Number(confirmState.req?.withdrawal_credit || 0).toLocaleString()} credits will be fully refunded to the creator.`
        }
        confirmText={confirmState.type === "approve" ? "Approve & Payout" : "Reject & Refund"}
      />
    </div>
  );
}
