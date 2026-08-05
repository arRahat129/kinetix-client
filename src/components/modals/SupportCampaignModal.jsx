"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiCreditCard, FiMessageSquare, FiAlertCircle } from "react-icons/fi";
import { HiOutlineRocketLaunch } from "react-icons/hi2";
import Link from "next/link";
import { createContribution } from "@/lib/actions/contribution";

export default function SupportCampaignModal({ isOpen, onClose, campaign, session, onSuccess }) {
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const successRef = useRef(false);

  if (!isOpen || !campaign) return null;

  const user = session?.user;
  const availableCredits = Number(user?.credits || 0);
  const amountNum = Number(amount) || 0;
  const isOverBalance = amountNum > availableCredits;
  const isBelowMin = amountNum > 0 && amountNum < 10;

  const handleSubmit = async () => {
    if (!amount || amountNum < 10 || isOverBalance) return;
    setLoading(true);
    setError("");
    try {
      const result = await createContribution({
        campaign_id: campaign._id,
        campaign_title: campaign.campaign_title,
        creator_email: campaign.creatorEmail,
        creator_name: campaign.creatorName,
        Supporter_name: user?.name,
        Supporter_email: user?.email,
        userEmail: user?.email,
        supporterImage: user?.image,
        Contribution_amount: amountNum,
        message: message.trim(),
      });

      if (result.success) {
        setSuccess(true);
        successRef.current = true;
      } else {
        setError(result.message || "Failed to submit contribution");
      }
    } catch (e) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    const didSucceed = successRef.current;
    successRef.current = false;
    setAmount("");
    setMessage("");
    setError("");
    setSuccess(false);
    onClose();
    if (didSucceed) {
      onSuccess && onSuccess();
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
            onClick={handleClose}
            className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <FiX size={20} />
          </button>

          {/* Header */}
          <div>
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-2">
              <HiOutlineRocketLaunch size={20} />
              <span className="font-bold text-sm uppercase tracking-wider">Support Campaign</span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white line-clamp-2">
              {campaign.campaign_title}
            </h2>
          </div>

          {success ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-8 flex flex-col items-center text-center space-y-3"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/40 flex items-center justify-center">
                <HiOutlineRocketLaunch className="text-emerald-500 w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-emerald-700 dark:text-emerald-300">Contribution Sent!</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xs">
                Your <span className="font-bold">{amountNum.toLocaleString()}</span> credit contribution has been submitted and is awaiting creator approval.
              </p>
              <button
                onClick={handleClose}
                className="mt-3 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition cursor-pointer"
              >
                Done
              </button>
            </motion.div>
          ) : (
            <>
              {/* Available Credits */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2">
                  <FiCreditCard className="text-blue-500" size={16} />
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Your Balance</span>
                </div>
                <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  {availableCredits.toLocaleString()} cr
                </span>
              </div>

              {availableCredits < 10 && (
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-sm text-amber-700 dark:text-amber-400 flex items-start gap-2">
                  <FiAlertCircle className="shrink-0 mt-0.5" size={16} />
                  <div>
                    <span>Insufficient credits.</span>{" "}
                    <Link href="/dashboard/supporter/credits" className="underline font-semibold" onClick={handleClose}>
                      Purchase credits
                    </Link>{" "}
                    to continue.
                  </div>
                </div>
              )}

              {/* Amount Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  Contribution Amount (credits) *
                </label>
                <input
                  type="number"
                  min={10}
                  max={availableCredits}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Min: 10 credits"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500/30"
                />
                {isBelowMin && <p className="text-xs text-amber-500 mt-1">Minimum contribution is 10 credits</p>}
                {isOverBalance && <p className="text-xs text-rose-500 mt-1">Exceeds your available balance</p>}
              </div>

              {/* Message Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  <FiMessageSquare className="inline mr-1 mb-0.5" size={12} />
                  Message (optional)
                </label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Leave a supportive note for the creator..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500/30 resize-none"
                />
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-sm text-rose-700 dark:text-rose-400 flex items-center gap-2">
                  <FiAlertCircle size={16} className="shrink-0" />
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={loading || !amount || amountNum < 10 || isOverBalance || availableCredits < 10}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <HiOutlineRocketLaunch size={16} />
                    Send {amountNum > 0 ? `${amountNum.toLocaleString()} Credits` : "Contribution"}
                  </>
                )}
              </button>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
