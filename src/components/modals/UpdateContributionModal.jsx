"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiCreditCard, FiMessageSquare, FiAlertCircle } from "react-icons/fi";
import { HiOutlineRocketLaunch } from "react-icons/hi2";
import Link from "next/link";
import { updateContribution } from "@/lib/actions/contribution";

export default function UpdateContributionModal({ isOpen, onClose, contribution, session, onSuccess }) {
  const [amount, setAmount] = useState(contribution?.Contribution_amount || contribution?.amount || "");
  const [message, setMessage] = useState(contribution?.message || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen || !contribution) return null;

  const user = session?.user;
  const availableCredits = Number(user?.credits || 0);
  const currentContribAmount = Number(contribution?.Contribution_amount || contribution?.amount || 0);
  const amountNum = Number(amount) || 0;
  const diff = amountNum - currentContribAmount;

  // The supporter can increase contribution if they have enough credits for the difference
  const isOverBalance = diff > 0 && diff > availableCredits;
  const isBelowMin = amountNum > 0 && amountNum < 10;
  const isPending = contribution.status === 'pending';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isPending && (!amount || amountNum < 10 || isOverBalance)) return;

    setLoading(true);
    setError("");

    try {
      const payload = isPending
        ? { Contribution_amount: amountNum, amount: amountNum, message: message.trim() }
        : { message: message.trim() }; // If approved/rejected, only message can be updated

      const result = await updateContribution(contribution._id, payload);
      if (result.success) {
        onSuccess && onSuccess();
        onClose();
      } else {
        setError(result.message || "Failed to update contribution");
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
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-2">
              <HiOutlineRocketLaunch size={20} />
              <span className="font-bold text-sm uppercase tracking-wider">Update Contribution</span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white line-clamp-2">
              {contribution.campaign_title}
            </h2>
            <p className="text-xs text-slate-500 mt-1">Status: <span className="font-semibold capitalize text-indigo-500">{contribution.status}</span></p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isPending ? (
              <>
                {/* Available Credits */}
                <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-2">
                    <FiCreditCard className="text-blue-500" size={16} />
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Available Credits</span>
                  </div>
                  <span className="text-base font-bold text-blue-600 dark:text-blue-400">
                    {availableCredits.toLocaleString()} cr
                  </span>
                </div>

                {/* Amount Input */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                    Contribution Amount (credits) *
                  </label>
                  <input
                    type="number"
                    min={10}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Min: 10 credits"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500/30"
                  />
                  {isBelowMin && <p className="text-xs text-amber-500 mt-1">Minimum contribution is 10 credits</p>}
                  {isOverBalance && (
                    <div className="text-xs text-rose-500 mt-1 flex flex-col gap-1">
                      <p>Increasing requires {diff} additional credits. You only have {availableCredits} available.</p>
                      <Link href="/dashboard/supporter/credits" className="underline font-semibold" onClick={onClose}>
                        Purchase credits
                      </Link>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-400">
                <p>This contribution has been <span className="font-bold text-slate-800 dark:text-white capitalize">{contribution.status}</span>. You can only update the supportive message note.</p>
                <p className="mt-1 font-semibold text-blue-600 dark:text-blue-400">Amount: {currentContribAmount.toLocaleString()} credits</p>
              </div>
            )}

            {/* Message Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                <FiMessageSquare className="inline mr-1 mb-0.5" size={12} />
                Message / Support Note
              </label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Leave a supportive note..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500/30 resize-none"
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
                disabled={loading || (isPending && (!amount || amountNum < 10 || isOverBalance))}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-2"
              >
                {loading ? "Updating..." : "Save Changes"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
