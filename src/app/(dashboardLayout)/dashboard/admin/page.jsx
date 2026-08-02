"use client";

import { useSession } from "@/lib/auth-client";
import { FiUsers, FiCheckSquare, FiPieChart, FiShield } from "react-icons/fi";

export default function AdminDashboardPage() {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-rose-600 via-rose-500 to-pink-600 text-white shadow-lg">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Admin Portal, {user?.name || "Admin"}! 🛡️
          </h1>
          <p className="mt-1 text-sm text-rose-100">
            System overview, user management, and campaign moderation dashboard.
          </p>
        </div>
      </div>

      {/* Admin Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center text-xl shrink-0">
            <FiUsers />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Users</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">1,240</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center text-xl shrink-0">
            <FiCheckSquare />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Pending Approvals</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">5</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xl shrink-0">
            <FiPieChart />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Active Campaigns</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">42</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xl shrink-0">
            <FiShield />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">System Health</p>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">100%</p>
          </div>
        </div>
      </div>
    </div>
  );
}
