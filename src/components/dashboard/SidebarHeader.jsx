"use client";

import Image from "next/image";
import { useSession } from "@/lib/auth-client";
import { FaCoins } from "react-icons/fa";
import NotificationPopover from "@/components/notifications/NotificationPopover";

export default function SidebarHeader() {
  const { data: session } = useSession();
  const user = session?.user;

  const avatarFallback = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  const getRoleBadgeColor = (role) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return "bg-rose-500 text-white border-rose-600 dark:bg-rose-600 dark:border-rose-500";
      case "creator":
        return "bg-amber-500 text-white border-amber-600 dark:bg-amber-600 dark:border-amber-500";
      default:
        return "bg-blue-500 text-white border-blue-600 dark:bg-blue-600 dark:border-blue-500";
    }
  };

  return (
    <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-3">
      {/* Top row inside Header: Available Credits & User Image / Notification */}
      <div className="flex items-center justify-between gap-2">
        {/* Available Credits */}
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 text-xs font-semibold border border-amber-200 dark:border-amber-500/20 shadow-xs">
          <FaCoins className="text-amber-500 shrink-0" size={13} />
          <span>{user?.credits !== undefined ? user.credits : 0} Credits</span>
        </div>

        {/* Right tools: Notification & Avatar */}
        <div className="flex items-center gap-2">
          {/* Notification Icon Component */}
          <NotificationPopover />

          {/* User Image / Avatar Fallback */}
          <div className="relative w-9 h-9 rounded-xl shrink-0 flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-bold text-sm shadow-xs">
            {user?.image ? (
              <Image
                src={user.image}
                alt={user.name || "User"}
                fill
                referrerPolicy="no-referrer"
                className="rounded-xl object-cover"
                unoptimized
              />
            ) : (
              <span>{avatarFallback}</span>
            )}
          </div>
        </div>
      </div>

      {/* Second row inside Header: User Role & User Name */}
      <div className="flex items-center justify-between gap-2 pt-1">
        <div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Welcome,</p>
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate max-w-[140px] leading-tight">
            {user?.name || "User"}
          </h3>
        </div>

        {/* User Role Badge */}
        <span
          className={`px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider rounded-md border ${getRoleBadgeColor(
            user?.role || "supporter"
          )} shadow-xs shrink-0`}
        >
          {user?.role || "Supporter"}
        </span>
      </div>
    </div>
  );
}
