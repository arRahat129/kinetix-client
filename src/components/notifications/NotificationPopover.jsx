"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import {
  FiBell,
  FiCheckCircle,
  FiXCircle,
  FiDollarSign,
  FiFileText,
  FiCheck,
  FiInfo,
  FiX,
} from "react-icons/fi";
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "@/lib/api/notification";
import { motion, AnimatePresence } from "framer-motion";

export default function NotificationPopover() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const popoverRef = useRef(null);

  const { data: session } = useSession();
  const user = session?.user;
  const router = useRouter();

  // Fetch notifications helper
  const fetchNotifications = async () => {
    if (!user?.email) return;
    try {
      const res = await getNotifications(user.email, user.role);
      if (res?.success && Array.isArray(res.data)) {
        setNotifications(res.data);
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  useEffect(() => {
    if (user?.email) {
      fetchNotifications();
      // Poll notifications every 15 seconds
      const interval = setInterval(fetchNotifications, 15000);
      return () => clearInterval(interval);
    }
  }, [user?.email, user?.role]);

  // Handle outside click to close pop-up
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleNotificationClick = async (notification) => {
    try {
      if (!notification.isRead) {
        await markNotificationAsRead(notification._id, user?.email);
        setNotifications((prev) =>
          prev.map((n) =>
            n._id === notification._id ? { ...n, isRead: true } : n
          )
        );
      }
      setIsOpen(false);
      const targetRoute = user?.role
        ? `/dashboard/${user.role.toLowerCase()}`
        : "/dashboard";
      router.push(targetRoute);
    } catch (err) {
      console.error("Error handling notification click:", err);
    }
  };

  const handleMarkAllRead = async () => {
    if (!user?.email) return;
    try {
      await markAllNotificationsAsRead(user.email, user.role);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error("Error marking all read:", err);
    }
  };

  // Helper for notification icons based on type
  const getNotificationIcon = (type, status) => {
    switch (type) {
      case "contribution_request":
      case "withdrawal_request":
        return (
          <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <FiDollarSign size={16} />
          </div>
        );
      case "contribution_status":
      case "withdrawal_status":
        return status === "rejected" ? (
          <div className="w-8 h-8 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
            <FiXCircle size={16} />
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <FiCheckCircle size={16} />
          </div>
        );
      case "campaign_request":
      case "campaign_status":
        return (
          <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <FiFileText size={16} />
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <FiInfo size={16} />
          </div>
        );
    }
  };

  // Relative time formatter
  const formatTime = (timeStr) => {
    if (!timeStr) return "";
    const date = new Date(timeStr);
    const now = new Date();
    const diffSec = Math.floor((now - date) / 1000);
    if (diffSec < 60) return "Just now";
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
    return `${Math.floor(diffSec / 86400)}d ago`;
  };

  if (!user) return null;

  return (
    <div className="relative" ref={popoverRef}>
      {/* Bell Icon Trigger */}
      <button
        type="button"
        onClick={() => {
          setIsOpen((prev) => !prev);
          if (!isOpen) fetchNotifications();
        }}
        className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        aria-label="Notifications"
      >
        <FiBell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 text-white text-[10px] font-bold ring-2 ring-white dark:ring-slate-900 animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Floating Pop-up - Top Center Positioned */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 left-1/2 -translate-x-1/2 z-50 w-[92vw] max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-xs">
              <div className="flex items-center gap-2">
                <FiBell className="text-blue-600 dark:text-blue-400" size={18} />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Notifications
                </h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 text-xs font-bold">
                    {unreadCount} unread
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <FiCheck size={14} />
                    <span>Mark all read</span>
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
                >
                  <FiX size={18} />
                </button>
              </div>
            </div>

            {/* Notification List */}
            <div className="overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60 p-1 flex-1">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                  <FiBell size={32} className="mx-auto mb-2 opacity-40" />
                  <p className="text-sm font-medium">No notifications yet</p>
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n._id}
                    onClick={() => handleNotificationClick(n)}
                    className={`p-3.5 rounded-xl transition-all cursor-pointer flex items-start gap-3 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 ${
                      !n.isRead
                        ? "bg-blue-50/50 dark:bg-blue-950/20 font-medium"
                        : ""
                    }`}
                  >
                    {/* Icon */}
                    {getNotificationIcon(n.type, n.status)}

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        {/* Status Tag / Resolved badge for admins */}
                        {n.status === "resolved" ? (
                          <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 text-[10px] font-extrabold uppercase tracking-wider border border-emerald-300 dark:border-emerald-800">
                            ✓ Resolved
                          </span>
                        ) : n.status === "pending" && n.toRole === "admin" ? (
                          <span className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400 text-[10px] font-extrabold uppercase tracking-wider border border-amber-300 dark:border-amber-800">
                            Action Required
                          </span>
                        ) : null}

                        <span className="text-[11px] text-slate-400 dark:text-slate-500 ml-auto shrink-0">
                          {formatTime(n.time)}
                        </span>
                      </div>

                      <p className="text-xs text-slate-800 dark:text-slate-200 leading-snug break-words">
                        {n.message}
                      </p>

                      {n.resolvedBy && (
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 italic">
                          Resolved by: {n.resolvedBy}
                        </p>
                      )}
                    </div>

                    {/* Unread Dot */}
                    {!n.isRead && (
                      <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0 mt-1.5" />
                    )}
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
