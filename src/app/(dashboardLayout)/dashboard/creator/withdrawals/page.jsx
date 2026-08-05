"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "@/lib/auth-client";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import {
  FiTrendingUp, FiDollarSign, FiAlertCircle, FiCreditCard,
  FiRefreshCw, FiCheckCircle, FiChevronLeft, FiChevronRight,
  FiClock, FiInfo
} from "react-icons/fi";
import { HiOutlineSparkles, HiOutlineBanknotes } from "react-icons/hi2";
import { getCreatorStats } from "@/lib/api/contribution";
import { getCreatorWithdrawals } from "@/lib/api/withdrawal";
import { createWithdrawal } from "@/lib/actions/withdrawal";
import ConfirmModal from "@/components/modals/ConfirmModal";

const PAYMENT_SYSTEMS = ["Stripe", "Bkash", "Rocket", "Nagad", "Bank Transfer", "PayPal"];

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

export default function WithdrawalsPage() {
  const { data: session } = useSession();
  const user = session?.user;

  const [stats, setStats] = useState({ totalAmountRaised: 0 });
  const [statsLoading, setStatsLoading] = useState(true);
  const [withdrawals, setWithdrawals] = useState([]);
  const [withdrawalsLoading, setWithdrawalsLoading] = useState(true);

  const [creditsToWithdraw, setCreditsToWithdraw] = useState("");
  const [paymentSystem, setPaymentSystem] = useState(PAYMENT_SYSTEMS[0]);
  const [accountNumber, setAccountNumber] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [page, setPage] = useState(1);
  const LIMIT = 8;

  const totalRaised = Number(stats.totalAmountRaised || 0);
  const withdrawalDollars = creditsToWithdraw ? (Number(creditsToWithdraw) / 20).toFixed(2) : "0.00";
  const canWithdraw = totalRaised >= 200;
  const creditsNum = Number(creditsToWithdraw) || 0;
  const isOverLimit = creditsNum > totalRaised;
  const isBelowMin = creditsNum < 200 && creditsNum > 0;

  const fetchStats = useCallback(async () => {
    if (!user?.email) return;
    setStatsLoading(true);
    try {
      const res = await getCreatorStats({ creatorEmail: user.email, userId: user.id });
      if (res.success) setStats(res);
    } catch (e) { console.error(e); }
    finally { setStatsLoading(false); }
  }, [user?.email, user?.id]);

  const fetchWithdrawals = useCallback(async () => {
    if (!user?.email) return;
    setWithdrawalsLoading(true);
    try {
      const res = await getCreatorWithdrawals(user.email);
      if (res.success) setWithdrawals(res.data || []);
    } catch (e) { console.error(e); }
    finally { setWithdrawalsLoading(false); }
  }, [user?.email]);

  useEffect(() => { fetchStats(); }, [fetchStats]);
  useEffect(() => { fetchWithdrawals(); }, [fetchWithdrawals]);

  const handleWithdraw = async () => {
    setFormLoading(true);
    try {
      const res = await createWithdrawal({
        creator_email: user.email,
        creator_name: user.name,
        withdrawal_credit: creditsNum,
        withdrawal_amount: Number(withdrawalDollars),
        payment_system: paymentSystem,
        account_number: accountNumber,
      });
      if (res.success) {
        toast.success("Withdrawal request submitted successfully!");
        setCreditsToWithdraw("");
        setAccountNumber("");
        fetchWithdrawals();
        fetchStats();
      } else {
        toast.error(res.message || "Failed to submit withdrawal request");
      }
    } catch (e) { toast.error("An error occurred"); }
    finally {
      setFormLoading(false);
      setConfirmOpen(false);
    }
  };

  const totalPages = Math.ceil(withdrawals.length / LIMIT);
  const pagedWithdrawals = withdrawals.slice((page - 1) * LIMIT, page * LIMIT);

  return (
    <div className="space-y-8 max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
      <Toaster position="top-right" />

      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <HiOutlineBanknotes className="text-blue-500" size={28} />
          Withdrawals
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Withdraw your earned credits. 20 credits = $1 USD. Minimum 200 credits ($10) required.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-lg shadow-blue-500/20"
        >
          <div className="flex items-center gap-3 mb-3">
            <FiTrendingUp size={22} />
            <p className="font-semibold text-blue-100">Total Credits Raised</p>
          </div>
          <p className="text-4xl font-extrabold">
            {statsLoading ? "—" : totalRaised.toLocaleString()}
          </p>
          <p className="text-blue-200 text-sm mt-1">credits from all campaigns</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.07 }}
          className="p-6 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/20"
        >
          <div className="flex items-center gap-3 mb-3">
            <FiDollarSign size={22} />
            <p className="font-semibold text-emerald-100">Withdrawal Value</p>
          </div>
          <p className="text-4xl font-extrabold">
            ${statsLoading ? "—" : (totalRaised / 20).toFixed(2)}
          </p>
          <p className="text-emerald-200 text-sm mt-1">USD equivalent (20 cr = $1)</p>
        </motion.div>
      </div>

      <div className="flex items-start gap-3 p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60 text-sm text-blue-800 dark:text-blue-300">
        <FiInfo size={18} className="text-blue-500 shrink-0 mt-0.5" />
        <p>
          <span className="font-semibold">Business rule:</span> Supporters purchase 10 credits for $1, but you (as a Creator) withdraw at 20 credits per $1. Minimum withdrawal is 200 credits ($10).
        </p>
      </div>

      {!canWithdraw ? (
        <div className="p-6 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-center space-y-3">
          <FiAlertCircle className="w-12 h-12 text-amber-500 mx-auto" />
          <p className="text-xl font-bold text-amber-800 dark:text-amber-300">Insufficient Credit</p>
          <p className="text-sm text-amber-700 dark:text-amber-400">
            You have <span className="font-bold">{totalRaised.toLocaleString()}</span> credits raised. You need at least <span className="font-bold">200 credits</span> to withdraw.
          </p>
          <p className="text-xs text-amber-600 dark:text-amber-500">Keep promoting your campaigns to raise more credits!</p>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5"
        >
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FiCreditCard className="text-blue-500" size={20} />
            Request Withdrawal
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Credits To Withdraw *
              </label>
              <input
                type="number"
                min={200}
                max={totalRaised}
                value={creditsToWithdraw}
                onChange={(e) => setCreditsToWithdraw(e.target.value)}
                placeholder={`Min: 200, Max: ${totalRaised}`}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500/30"
              />
              {isOverLimit && <p className="text-xs text-rose-500 mt-1">Cannot exceed your total raised ({totalRaised.toLocaleString()} credits)</p>}
              {isBelowMin && <p className="text-xs text-amber-500 mt-1">Minimum withdrawal is 200 credits</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Withdraw Amount ($) — Auto
              </label>
              <div className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/60 text-slate-900 dark:text-white text-lg font-bold flex items-center">
                <FiDollarSign className="text-emerald-500 mr-1" size={18} />
                {withdrawalDollars}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Calculated at 20 credits = $1</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Select Payment System *
              </label>
              <select
                value={paymentSystem}
                onChange={(e) => setPaymentSystem(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500/30 appearance-none"
              >
                {PAYMENT_SYSTEMS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Account Number *
              </label>
              <input
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="Enter your account number..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500/30"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => {
                if (!creditsToWithdraw || creditsNum < 200 || isOverLimit || !accountNumber.trim()) {
                  toast.error("Please fill all fields correctly");
                  return;
                }
                setConfirmOpen(true);
              }}
              disabled={formLoading || !creditsToWithdraw || creditsNum < 200 || isOverLimit || !accountNumber.trim()}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-2 cursor-pointer"
            >
              <HiOutlineBanknotes size={18} />
              Withdraw Credits
            </button>
          </div>
        </motion.div>
      )}

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FiClock className="text-blue-500" size={20} />
            Withdrawal History
          </h2>
          <button onClick={fetchWithdrawals} className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 hover:text-blue-500 transition cursor-pointer">
            <FiRefreshCw size={15} className={withdrawalsLoading ? "animate-spin" : ""} />
          </button>
        </div>

        {withdrawalsLoading ? (
          <div className="py-10 flex items-center justify-center gap-3 text-slate-400">
            <FiRefreshCw className="animate-spin text-blue-500" size={20} />
            <p className="text-sm">Loading history...</p>
          </div>
        ) : withdrawals.length === 0 ? (
          <div className="py-12 text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-white/40 dark:bg-slate-900/40 space-y-2">
            <HiOutlineBanknotes className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
            <p className="font-semibold text-slate-700 dark:text-slate-300">No withdrawal history yet</p>
            <p className="text-sm text-slate-400">Your withdrawal requests will appear here.</p>
          </div>
        ) : (
          <>
            <div className="hidden lg:block overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80">
                    {["Date", "Credits", "Amount ($)", "Payment", "Account", "Status"].map((h) => (
                      <th key={h} className="text-left px-5 py-3 font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-xs">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {pagedWithdrawals.map((w) => (
                    <tr key={w._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                      <td className="px-5 py-3.5 text-slate-600 dark:text-slate-400 text-xs">
                        {w.withdraw_date ? new Date(w.withdraw_date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "N/A"}
                      </td>
                      <td className="px-5 py-3.5 font-bold text-blue-600 dark:text-blue-400">{Number(w.withdrawal_credit).toLocaleString()}</td>
                      <td className="px-5 py-3.5 font-bold text-emerald-600 dark:text-emerald-400">${Number(w.withdrawal_amount).toFixed(2)}</td>
                      <td className="px-5 py-3.5 text-slate-700 dark:text-slate-300">{w.payment_system}</td>
                      <td className="px-5 py-3.5 text-slate-600 dark:text-slate-400 max-w-[120px] truncate">{w.account_number}</td>
                      <td className="px-5 py-3.5"><StatusBadge status={w.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-4">
              {pagedWithdrawals.map((w) => (
                <div key={w._id} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">
                      {w.withdraw_date ? new Date(w.withdraw_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "N/A"}
                    </span>
                    <StatusBadge status={w.status} />
                  </div>
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-xs text-slate-400">Credits</p>
                      <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{Number(w.withdrawal_credit).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Amount</p>
                      <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">${Number(w.withdrawal_amount).toFixed(2)}</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500">{w.payment_system} • {w.account_number}</p>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
                <span className="text-xs text-slate-500">
                  Page {page} of {totalPages}
                </span>
                <div className="flex gap-2">
                  <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition cursor-pointer">
                    <FiChevronLeft size={15} />
                  </button>
                  <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition cursor-pointer">
                    <FiChevronRight size={15} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <ConfirmModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleWithdraw}
        loading={formLoading}
        variant="info"
        title="Confirm Withdrawal"
        description={`Withdraw ${creditsNum.toLocaleString()} credits ($${withdrawalDollars}) via ${paymentSystem} to account: ${accountNumber}?`}
        confirmText="Submit Request"
      />
    </div>
  );
}
