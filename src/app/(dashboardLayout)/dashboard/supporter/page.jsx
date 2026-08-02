"use client";

import { useSession } from "@/lib/auth-client";
import Link from "next/link";
import { FiCheckCircle, FiClock, FiLayout } from "react-icons/fi";

export default function SupporterDashboardPage() {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Welcome back, {user?.name || "Supporter"}! 👋
          </h1>
          <p className="mt-1 text-sm text-blue-100">
            Track your backed projects, contributions, and account statistics.
          </p>
        </div>
        <Link
          href="/campaigns"
          className="self-start sm:self-auto px-4 py-2.5 rounded-xl bg-white text-blue-600 font-semibold text-xs sm:text-sm shadow hover:bg-blue-50 transition-all no-underline shrink-0"
        >
          Explore New Campaigns
        </Link>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xl shrink-0">
            <FiLayout />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Backed Campaigns</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">3</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xl shrink-0">
            <FiCheckCircle />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Contributed</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">$450.00</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center text-xl shrink-0">
            <FiClock />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Active Rewards</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">2</p>
          </div>
        </div>
      </div>
    </div>
  );
}
