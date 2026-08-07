"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { FiMenu, FiX, FiGithub, FiLogOut, FiLayout, FiChevronDown } from "react-icons/fi";
import { HiOutlineRocketLaunch } from "react-icons/hi2";
import ThemeToggle from "./ThemeToggle";
import NotificationPopover from "./notifications/NotificationPopover";
import { signOut, useSession } from "@/lib/auth-client";
import { FaCoins } from "react-icons/fa";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const dropdownRef = useRef(null);

  // Better Auth session hook
  const { data: session } = useSession();
  const user = session?.user;

  // Console log to check user session & role data
  useEffect(() => {
    console.log("Navbar Session User Data:", user);
  }, [user]);

  // Handle outside click to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on desktop resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsMobileMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = async () => {
    try {
      localStorage.removeItem("access-token");
      await signOut();
      setIsDropdownOpen(false);
      setIsMobileMenuOpen(false);
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Helper for initial avatar letter fallback
  const avatarFallback = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  // Dynamic Dashboard Route based on Role
  const dashboardRoute = user?.role
    ? `/dashboard/${user.role.toLowerCase()}`
    : "/dashboard";

  // Role Badge Color Mapper
  const getRoleBadgeColor = (role) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return "bg-rose-500 text-white border-rose-600";
      case "creator":
        return "bg-amber-500 text-white border-amber-600";
      default:
        return "bg-blue-500 text-white border-blue-600";
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300">
      <nav
        className={`w-full transition-all duration-300 ${isScrolled || isMobileMenuOpen
          ? "backdrop-blur-md bg-white/90 dark:bg-slate-950/90 border-b border-slate-200 dark:border-slate-800 shadow-sm py-3"
          : "bg-transparent py-4 md:py-5"
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          {/* Brand Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 no-underline shrink-0"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-xl text-white shadow-sm shrink-0">
              <HiOutlineRocketLaunch color="white" size={22} />
            </div>
            <span className="text-xl md:text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-500 via-cyan-500 to-indigo-500 bg-clip-text text-transparent">
              KINETIX
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            <NavLink href="/" label="Home" currentPath={pathname} />
            <NavLink
              href="/campaigns"
              label="Explore Campaigns"
              currentPath={pathname}
            />

            <div className="mx-1 h-5 w-[1px] bg-slate-200 dark:bg-slate-800" />

            <ThemeToggle />
            {user && <NotificationPopover />}

            {/* Authenticated User Menu or Guest Auth Buttons */}
            {user ? (
              <div className="relative ml-2" ref={dropdownRef}>
                {/* Expanded Trigger Button for Desktop */}
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-3 px-3 py-1.5 rounded-2xl bg-slate-100/80 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-200/60 dark:hover:bg-slate-800/80 transition-all cursor-pointer min-w-[180px] lg:min-w-[210px] justify-between"
                  aria-expanded={isDropdownOpen}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    {/* Avatar Container with Role Badge */}
                    <div className="relative w-9 h-9 rounded-xl overflow-visible shrink-0 flex items-center justify-center bg-blue-600 text-white font-bold text-sm shadow-sm">
                      {user.image ? (
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

                      {/* Role Badge Positioned Absolutely */}
                      {user.role && (
                        <span
                          className={`absolute -bottom-1 -right-1.5 px-1.5 py-0.2 text-[9px] font-extrabold uppercase tracking-wider rounded-md border ${getRoleBadgeColor(
                            user.role
                          )} shadow-xs`}
                        >
                          {user.role}
                        </span>
                      )}
                    </div>

                    {/* User Info (Now visible with increased width) */}
                    <div className="text-left truncate">
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate leading-tight">
                        {user.name || "User"}
                      </p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate leading-tight">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <FiChevronDown
                    className={`text-slate-500 dark:text-slate-400 text-sm shrink-0 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""
                      }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-60 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800/80">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {user.name}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {user.email}
                      </p>
                      {user.credits !== undefined && (
                        <div className="mt-1.5 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[11px] font-medium border border-amber-200 dark:border-amber-500/20">
                          <FaCoins className="text-amber-500" />
                          <span>{user.credits} Credits</span>
                        </div>
                      )}
                    </div>

                    <div className="p-1">
                      <Link
                        href={dashboardRoute}
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-blue-950/50 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl transition-colors no-underline"
                      >
                        <FiLayout className="text-sm" />
                        <span>Dashboard</span>
                      </Link>

                      {/* Moved GitHub Developer link inside dropdown */}
                      <a
                        href="https://github.com/arRahat129"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-blue-950/50 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl transition-colors no-underline"
                      >
                        <FiGithub className="text-sm" />
                        <span>Join as Developer</span>
                      </a>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors text-left cursor-pointer mt-0.5"
                      >
                        <FiLogOut className="text-sm" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <NavLink
                  href="/auth/signin"
                  label="Login"
                  currentPath={pathname}
                />
                <NavLink
                  href="/auth/signup"
                  label="Register"
                  currentPath={pathname}
                />
                <a
                  href="https://github.com/arRahat129"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-1 h-10 px-4 text-xs font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white flex items-center gap-2 transition shadow-md no-underline shrink-0 active:scale-95"
                >
                  <FiGithub size={16} />
                  <span>Join as Developer</span>
                </a>
              </div>
            )}
          </div>

          {/* Mobile Navigation Toggle */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 cursor-pointer flex items-center justify-center transition hover:bg-slate-200 dark:hover:bg-slate-700"
              aria-label="Toggle Navigation"
            >
              {isMobileMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Panel */}
        <div
          className={`grid transition-all duration-300 ease-in-out md:hidden ${isMobileMenuOpen
            ? "grid-rows-[1fr] opacity-100 mt-3 pt-3 border-t border-slate-200 dark:border-slate-800"
            : "grid-rows-[0fr] opacity-0 pointer-events-none"
            }`}
        >
          <div className="overflow-hidden px-4 sm:px-6 flex flex-col gap-1">
            <MobileNavLink
              href="/"
              label="Home"
              currentPath={pathname}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <MobileNavLink
              href="/campaigns"
              label="Explore Campaigns"
              currentPath={pathname}
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {user ? (
              <>
                {/* Mobile User Card */}
                <div className="p-3 my-1 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center shrink-0">
                      {user.image ? (
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
                      {user.role && (
                        <span
                          className={`absolute -bottom-1 -right-1 px-1 py-0.2 text-[8px] font-extrabold uppercase rounded border ${getRoleBadgeColor(
                            user.role
                          )}`}
                        >
                          {user.role}
                        </span>
                      )}
                    </div>
                    <div className="truncate">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {user.name}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </div>

                <MobileNavLink
                  href={dashboardRoute}
                  label="Dashboard"
                  currentPath={pathname}
                  onClick={() => setIsMobileMenuOpen(false)}
                />

                <button
                  onClick={handleLogout}
                  className="h-11 px-4 flex items-center gap-2 text-base font-medium text-rose-600 dark:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors w-full text-left cursor-pointer"
                >
                  <FiLogOut />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <MobileNavLink
                  href="/auth/signin"
                  label="Login"
                  currentPath={pathname}
                  onClick={() => setIsMobileMenuOpen(false)}
                />
                <MobileNavLink
                  href="/auth/signup"
                  label="Register"
                  currentPath={pathname}
                  onClick={() => setIsMobileMenuOpen(false)}
                />
              </>
            )}

            <a
              href="https://github.com/arRahat129"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 mb-2 h-11 w-full text-sm font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white flex items-center justify-center gap-2 transition shadow-md no-underline active:scale-95"
            >
              <FiGithub size={18} />
              <span>Join as Developer</span>
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
}

function NavLink({ href, label, currentPath }) {
  const isActive = currentPath === href;

  return (
    <Link
      href={href}
      className={`h-10 px-3.5 flex items-center text-sm font-medium rounded-lg transition-colors no-underline ${isActive
        ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 font-semibold"
        : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
        }`}
    >
      {label}
    </Link>
  );
}

function MobileNavLink({ href, label, currentPath, onClick }) {
  const isActive = currentPath === href;

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`h-11 px-4 flex items-center font-medium rounded-lg transition-colors no-underline ${isActive
        ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 font-semibold"
        : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
        }`}
    >
      {label}
    </Link>
  );
}