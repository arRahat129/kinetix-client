"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import {
  FiHome,
  FiCompass,
  FiPlusSquare,
  FiUsers,
  FiHeart,
  FiGrid,
  FiFolderPlus,
  FiCreditCard,
  FiTrendingUp,
  FiDollarSign,
  FiFileText,
  FiPieChart,
} from "react-icons/fi";

export default function DashboardLinks({ onNavClick }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const role = session?.user?.role?.toLowerCase() || "supporter";

  // Navigation Links definition per role strictly following user specification
  const roleLinks = {
    supporter: [
      { href: "/", label: "Home", icon: FiHome },
      { href: "/campaigns", label: "Explore Campaigns", icon: FiCompass },
      { href: "/dashboard/supporter/contributions", label: "My Contributions", icon: FiHeart },
      { href: "/dashboard/supporter/credits", label: "Purchase Credit", icon: FiCreditCard },
      { href: "/dashboard/supporter/payment-history", label: "Payment History", icon: FiFileText },
    ],
    creator: [
      { href: "/", label: "Home", icon: FiHome },
      { href: "/dashboard/creator/add-campaign", label: "Add New Campaign", icon: FiPlusSquare },
      { href: "/dashboard/creator/my-campaigns", label: "My Campaigns", icon: FiGrid },
      { href: "/dashboard/creator/withdrawals", label: "Withdrawals", icon: FiTrendingUp },
      { href: "/dashboard/creator/payment-history", label: "Payment History", icon: FiFileText },
    ],
    admin: [
      { href: "/", label: "Home", icon: FiHome },
      { href: "/dashboard/admin/manage-users", label: "Manage Users", icon: FiUsers },
      { href: "/dashboard/admin/manage-campaigns", label: "Manage Campaigns", icon: FiFolderPlus },
      { href: "/dashboard/admin/withdrawal-requests", label: "Withdrawal Requests", icon: FiDollarSign },
      { href: "/dashboard/admin/reports", label: "Reports", icon: FiPieChart },
    ],
  };

  const currentLinks = roleLinks[role] || roleLinks.supporter;

  return (
    <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
      <p className="px-3 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
        Navigation
      </p>
      {currentLinks.map((link) => {
        const Icon = link.icon;
        const isActive = pathname === link.href;

        return (
          <Link
            key={link.href + link.label}
            href={link.href}
            onClick={onNavClick}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs md:text-sm font-medium transition-all no-underline ${
              isActive
                ? "bg-blue-600 text-white font-semibold shadow-sm shadow-blue-500/20"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Icon className={`text-base shrink-0 ${isActive ? "text-white" : "text-slate-500 dark:text-slate-400"}`} />
            <span className="truncate">{link.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
