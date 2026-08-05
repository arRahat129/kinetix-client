"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiEdit3, FiAlertCircle } from "react-icons/fi";

export default function UpdateCampaignModal({ isOpen, onClose, campaign, onUpdate, isSubmitting }) {
  const [formData, setFormData] = useState({
    campaign_title: campaign?.campaign_title || "",
    campaign_story: campaign?.campaign_story || "",
    funding_goal: campaign?.funding_goal || "",
    category: campaign?.category || "",
    deadline: campaign?.deadline ? new Date(campaign.deadline).toISOString().split("T")[0] : "",
  });
  const [error, setError] = useState("");

  if (!isOpen || !campaign) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.campaign_title.trim()) {
      setError("Campaign title is required");
      return;
    }

    try {
      await onUpdate(campaign._id, formData);
      onClose();
    } catch (err) {
      setError(err.message || "Failed to update campaign");
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5"
        >
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <FiX size={20} />
          </button>

          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
            <FiEdit3 size={20} />
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Edit Campaign</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Campaign Title *
              </label>
              <input
                type="text"
                name="campaign_title"
                value={formData.campaign_title}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500/30"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Campaign Story
              </label>
              <textarea
                name="campaign_story"
                rows={4}
                value={formData.campaign_story}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500/30 resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  Funding Goal (credits)
                </label>
                <input
                  type="number"
                  name="funding_goal"
                  value={formData.funding_goal}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500/30"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  Deadline
                </label>
                <input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500/30"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-sm text-rose-700 dark:text-rose-400 flex items-center gap-2">
                <FiAlertCircle size={16} />
                {error}
              </div>
            )}

            <div className="flex justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-semibold hover:bg-slate-200 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition disabled:opacity-50"
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
