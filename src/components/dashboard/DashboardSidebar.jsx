"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiHome, FiCompass, FiLogOut, FiMenu, FiX } from "react-icons/fi";
import { HiOutlineRocketLaunch } from "react-icons/hi2";
import SidebarHeader from "./SidebarHeader";
import DashboardLinks from "./DashboardLinks";
import ThemeToggle from "../ThemeToggle";
import { signOut } from "@/lib/auth-client";

export default function DashboardSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      localStorage.removeItem("access-token");
      await signOut();
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const closeDrawer = () => setIsOpen(false);

  return (
    <>
      {/* Mobile Header Bar with Drawer Toggle Button */}
      <div className="lg:hidden sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsOpen(true)}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            aria-label="Open Sidebar"
          >
            <FiMenu size={20} />
          </button>

          <Link href="/" className="flex items-center gap-2 no-underline">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white shadow-xs">
              <HiOutlineRocketLaunch size={18} />
            </div>
            <span className="font-bold text-lg bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
              KINETIX
            </span>
          </Link>
        </div>

        <ThemeToggle />
      </div>

      {/* Backdrop overlay for mobile drawer */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={closeDrawer}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Top Logo & Close Button */}
        <div className="p-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
          <Link href="/" className="flex items-center gap-2.5 no-underline">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white shadow-sm">
              <HiOutlineRocketLaunch size={20} />
            </div>
            <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-blue-500 via-cyan-500 to-indigo-500 bg-clip-text text-transparent">
              KINETIX
            </span>
          </Link>

          <div className="flex items-center gap-1">
            <div className="hidden lg:block">
              <ThemeToggle />
            </div>
            <button
              onClick={closeDrawer}
              className="lg:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
              aria-label="Close Sidebar"
            >
              <FiX size={20} />
            </button>
          </div>
        </div>

        {/* Header Section (Credits, User Image, Role, User Name, Notification) */}
        <SidebarHeader />

        {/* Dynamic Navigation Links based on User Role */}
        <DashboardLinks onNavClick={closeDrawer} />

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 space-y-1 bg-slate-50/50 dark:bg-slate-900/50">
          <Link
            href="/"
            onClick={closeDrawer}
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs md:text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors no-underline"
          >
            <FiHome className="text-base text-slate-500 dark:text-slate-400 shrink-0" />
            <span>Back to Home</span>
          </Link>

          <Link
            href="/campaigns"
            onClick={closeDrawer}
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs md:text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors no-underline"
          >
            <FiCompass className="text-base text-slate-500 dark:text-slate-400 shrink-0" />
            <span>Explore Campaigns</span>
          </Link>

          <button
            onClick={() => {
              closeDrawer();
              handleLogout();
            }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs md:text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors text-left cursor-pointer"
          >
            <FiLogOut className="text-base shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
