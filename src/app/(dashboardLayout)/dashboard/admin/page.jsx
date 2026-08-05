"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "@/lib/auth-client";
import {
  FiUsers, FiCheckSquare, FiPieChart, FiShield, FiDollarSign,
  FiTrendingUp, FiCheckCircle, FiActivity, FiRefreshCw, FiArrowRight
} from "react-icons/fi";
import { HiOutlineBanknotes, HiOutlineRocketLaunch } from "react-icons/hi2";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import { getAdminStats } from "@/lib/api/user";

export default function AdminDashboardPage() {
  const { data: session } = useSession();
  const user = session?.user;

  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAdminStats();
      if (res.success) {
        setStatsData(res);
      } else {
        toast.error("Failed to load statistics.");
      }
    } catch (e) {
      console.error(e);
      toast.error("Network error while loading stats.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user?.role === "Admin") {
      fetchStats();
    }
  }, [user, fetchStats]);

  if (user?.role !== "Admin") {
    return (
      <div className="py-20 text-center text-slate-400">
        <p>Access Denied. Admin privileges required.</p>
      </div>
    );
  }

  const stats = statsData?.stats || {
    supportersCount: 0,
    creatorsCount: 0,
    adminsCount: 0,
    totalCampaigns: 0,
    pendingCampaigns: 0,
    approvedCampaigns: 0,
    rejectedCampaigns: 0,
    totalContributionsCount: 0,
    totalContributedCredits: 0,
    totalWithdrawalsCount: 0,
    pendingWithdrawalsCount: 0,
    approvedWithdrawalsCount: 0,
    totalWithdrawnAmountUSD: 0,
    systemRevenue: 0
  };

  const statCards = [
    {
      label: "Total Users",
      value: loading ? "—" : statsData?.totalUsers || 0,
      subtext: `${stats.supportersCount} Supporters · ${stats.creatorsCount} Creators`,
      icon: FiUsers,
      color: "text-rose-600 dark:text-rose-400",
      bg: "bg-rose-50 dark:bg-rose-950/60",
    },
    {
      label: "Total Contributions",
      value: loading ? "—" : `${Number(stats.totalContributedCredits).toLocaleString()} cr`,
      subtext: `${stats.totalContributionsCount} total contributions`,
      icon: FiCheckCircle,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-950/60",
    },
    {
      label: "Pending Campaigns",
      value: loading ? "—" : stats.pendingCampaigns,
      subtext: "Needs your review",
      icon: HiOutlineRocketLaunch,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-950/60",
    },
    {
      label: "System Revenue",
      value: loading ? "—" : `$${Number(stats.systemRevenue).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      subtext: "From 5% transaction difference",
      icon: FiDollarSign,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-950/60",
    },
  ];

  // Helper values for custom SVG charts
  const maxFundingVal = statsData?.monthlyData?.length > 0
    ? Math.max(...statsData.monthlyData.map(d => d.amount), 100)
    : 100;

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <Toaster position="top-right" />

      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-rose-600 via-rose-500 to-pink-600 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
        <div className="relative z-10">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Admin Portal, {user?.name || "Admin"}! 🛡️
          </h1>
          <p className="mt-1 text-sm text-rose-100">
            System overview, user management, and campaign moderation dashboard.
          </p>
        </div>
        <button
          onClick={fetchStats}
          className="self-start sm:self-auto px-4 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 active:scale-95 transition-all text-white text-xs sm:text-sm font-semibold shrink-0 border border-white/20 flex items-center gap-2"
        >
          <FiRefreshCw className={loading ? "animate-spin" : ""} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4 hover:shadow-md transition"
            >
              <div className={`w-12 h-12 rounded-xl ${card.bg} ${card.color} flex items-center justify-center text-xl shrink-0`}>
                <Icon />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{card.label}</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5 truncate">{card.value}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 truncate">{card.subtext}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SVG Monthly Funding Chart */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between min-h-[300px]">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FiTrendingUp className="text-blue-500" />
              Monthly Contribution Activity
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Total contribution amount processed in credits</p>
          </div>

          <div className="h-44 w-full flex items-end gap-3 sm:gap-6 pt-4 px-2">
            {statsData?.monthlyData && statsData.monthlyData.length > 0 ? (
              statsData.monthlyData.map((d, index) => {
                const heightPercentage = Math.round((d.amount / maxFundingVal) * 100);
                return (
                  <div key={d.month + index} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                    <div className="relative w-full flex justify-center">
                      {/* Tooltip */}
                      <span className="absolute bottom-full mb-1 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-[10px] px-2 py-0.5 rounded-md font-bold whitespace-nowrap shadow z-10">
                        {d.amount.toLocaleString()} cr
                      </span>
                    </div>
                    <div
                      style={{ height: `${Math.max(heightPercentage, 8)}%` }}
                      className="w-full rounded-t-lg bg-gradient-to-t from-blue-600 to-indigo-500 group-hover:from-blue-500 group-hover:to-indigo-400 transition-all shadow-md shadow-blue-500/10"
                    />
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">{d.month}</span>
                  </div>
                );
              })
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs text-slate-400 italic">
                No monthly data available yet.
              </div>
            )}
          </div>
        </div>

        {/* Category breakdown & quick status */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FiPieChart className="text-purple-500" />
              Campaign Categories
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Distribution of campaigns across sectors</p>
          </div>

          <div className="space-y-3 py-4">
            {statsData?.categoryData && statsData.categoryData.length > 0 ? (
              statsData.categoryData.slice(0, 4).map((cat, i) => {
                const total = statsData.categoryData.reduce((sum, c) => sum + c.value, 0);
                const percent = total > 0 ? Math.round((cat.value / total) * 100) : 0;
                const progressColors = ["bg-blue-500", "bg-purple-500", "bg-emerald-500", "bg-amber-500"];
                const color = progressColors[i % progressColors.length];

                return (
                  <div key={cat.name} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700 dark:text-slate-300 capitalize">{cat.name}</span>
                      <span className="font-bold text-slate-500">{percent}% ({cat.value})</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div className={`h-full ${color} rounded-full`} style={{ width: `${percent}%` }} />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-xs text-slate-400 italic text-center py-6">
                No categories distribution available.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Withdrawal Requests Table */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <HiOutlineBanknotes className="text-rose-500" size={18} />
              Recent Pending Withdrawals
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Payout requests awaiting review</p>
          </div>
          <Link
            href="/dashboard/admin/withdrawal-requests"
            className="text-xs font-bold text-rose-500 hover:text-rose-600 flex items-center gap-1 group no-underline"
          >
            <span>Manage All Requests</span>
            <FiArrowRight className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {statsData?.recentWithdrawals?.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400 italic">
            No pending withdrawal requests.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-800">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-100 dark:border-slate-800 text-slate-500 font-semibold">
                  <th className="px-4 py-2.5">Creator</th>
                  <th className="px-4 py-2.5">Credits</th>
                  <th className="px-4 py-2.5">Amount ($)</th>
                  <th className="px-4 py-2.5">Payment</th>
                  <th className="px-4 py-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {statsData?.recentWithdrawals?.map((w) => (
                  <tr key={w._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                    <td className="px-4 py-2.5 font-medium text-slate-800 dark:text-slate-200">{w.creator_name}</td>
                    <td className="px-4 py-2.5 font-bold text-blue-600 dark:text-blue-400">{w.withdrawal_credit}</td>
                    <td className="px-4 py-2.5 font-bold text-emerald-600 dark:text-emerald-400">${Number(w.withdrawal_amount).toFixed(2)}</td>
                    <td className="px-4 py-2.5 text-slate-600 dark:text-slate-400">{w.payment_system}</td>
                    <td className="px-4 py-2.5">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400">
                        {w.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
