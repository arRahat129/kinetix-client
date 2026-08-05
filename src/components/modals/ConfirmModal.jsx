"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FiAlertTriangle, FiCheckCircle, FiInfo, FiX } from "react-icons/fi";

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  loading = false,
}) {
  if (!isOpen) return null;

  const variantStyles = {
    danger: {
      bg: "bg-red-500 hover:bg-red-600 focus:ring-red-500/30",
      iconBg: "bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400",
      icon: FiAlertTriangle,
    },
    success: {
      bg: "bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500/30",
      iconBg: "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400",
      icon: FiCheckCircle,
    },
    warning: {
      bg: "bg-amber-500 hover:bg-amber-600 focus:ring-amber-500/30",
      iconBg: "bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400",
      icon: FiAlertTriangle,
    },
    info: {
      bg: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500/30",
      iconBg: "bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400",
      icon: FiInfo,
    },
  };

  const style = variantStyles[variant] || variantStyles.danger;
  const IconComponent = style.icon;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4"
        >
          <button
            onClick={onClose}
            disabled={loading}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <FiX size={18} />
          </button>

          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-xl shrink-0 ${style.iconBg}`}>
              <IconComponent size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h3>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{description}</p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer disabled:opacity-50"
            >
              {cancelText}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={loading}
              className={`px-5 py-2 rounded-xl text-sm font-semibold text-white shadow-md transition cursor-pointer disabled:opacity-50 flex items-center gap-2 ${style.bg}`}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                confirmText
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
