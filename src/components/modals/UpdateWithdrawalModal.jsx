"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiCreditCard, FiAlertCircle, FiDollarSign } from "react-icons/fi";
import { HiOutlineBanknotes } from "react-icons/hi2";
import { updateWithdrawal } from "@/lib/actions/withdrawal";

const PAYMENT_SYSTEMS = ["Stripe", "Bkash", "Rocket", "Nagad", "Bank Transfer", "PayPal"];

export default function UpdateWithdrawalModal({ isOpen, onClose, withdrawal, stats, onSuccess }) {
  const [credits, setCredits] = useState(withdrawal?.withdrawal_credit || "");
  const [paymentSystem, setPaymentSystem] = useState(withdrawal?.payment_system || PAYMENT_SYSTEMS[0]);
  const [accountNumber, setAccountNumber] = useState(withdrawal?.account_number || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen || !withdrawal) return null;

  const totalRaised = Number(stats?.totalAmountRaised || 0);
  const creatorCredits = Number(stats?.creatorCredits || 0);
  const currentCredit = Number(withdrawal?.withdrawal_credit || 0);
  const creditsNum = Number(credits) || 0;
  const diff = creditsNum - currentCredit;
  const withdrawalDollars = credits ? (Number(credits) / 20).toFixed(2) : "0.00";

  // The creator can only increase if they have enough remaining balance for the difference
  const isOverLimit = creditsNum > creatorCredits + currentCredit; // current credit already deducted, so add it back
  const isBelowMin = creditsNum > 0 && creditsNum < 200;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!credits || creditsNum < 200 || isOverLimit || !accountNumber.trim()) return;

    setLoading(true);
    setError("");

    try {
      const result = await updateWithdrawal(withdrawal._id, {
        withdrawal_credit: creditsNum,
        payment_system: paymentSystem,
        account_number: accountNumber.trim()
      });

      if (result.success) {
        onSuccess && onSuccess();
        onClose();
      } else {
        setError(result.message || "Failed to update request");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5"
        >
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <FiX size={20} />
          </button>

          <div>
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-1">
              <HiOutlineBanknotes size={20} />
              <span className="font-bold text-sm uppercase tracking-wider">Update Withdrawal Request</span>
            </div>
            <p className="text-xs text-slate-500">Edit details for your pending payout request.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Credits to Withdraw */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  Credits To Withdraw *
                </label>
                <input
                  type="number"
                  min={200}
                  max={creatorCredits + currentCredit}
                  value={credits}
                  onChange={(e) => setCredits(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500/30"
                />
                {isOverLimit && <p className="text-[11px] text-rose-500 mt-1">Cannot exceed available balance ({(creatorCredits + currentCredit).toLocaleString()} credits)</p>}
                {isBelowMin && <p className="text-[11px] text-amber-500 mt-1">Minimum is 200 credits</p>}
              </div>

              {/* Withdraw amount (read-only) */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  Amount ($) — Auto
                </label>
                <div className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/60 text-slate-900 dark:text-white text-sm font-bold flex items-center h-10">
                  <FiDollarSign className="text-emerald-500 mr-0.5" size={16} />
                  {withdrawalDollars}
                </div>
              </div>
            </div>

            {/* Payment System */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Select Payment System *
              </label>
              <select
                value={paymentSystem}
                onChange={(e) => setPaymentSystem(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500/30 appearance-none"
              >
                {PAYMENT_SYSTEMS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {/* Account Number */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Account Number *
              </label>
              <input
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="Enter account number"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500/30"
              />
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-sm text-rose-700 dark:text-rose-400 flex items-center gap-2">
                <FiAlertCircle size={16} className="shrink-0" />
                {error}
              </div>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-slate-700 dark:text-slate-300 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !credits || creditsNum < 200 || isOverLimit || !accountNumber.trim()}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                {loading ? "Saving..." : "Update Request"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
