"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiMenu, FiX, FiGithub } from "react-icons/fi";
import { HiOutlineRocketLaunch } from "react-icons/hi2";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

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

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300">
      <nav
        className={`w-full transition-all duration-300 ${
          isScrolled || isMobileMenuOpen
            ? "backdrop-blur-md bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 shadow-sm py-3"
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
          <div className="hidden md:flex items-center gap-1.5 lg:gap-2">
            <NavLink href="/" label="Home" currentPath={pathname} />
            <NavLink
              href="/campaigns"
              label="Explore Campaigns"
              currentPath={pathname}
            />

            <div className="mx-1 h-5 w-[1px] bg-slate-200 dark:bg-slate-800" />

            <ThemeToggle />

            <NavLink href="/login" label="Login" currentPath={pathname} />
            <NavLink
              href="/register"
              label="Register"
              currentPath={pathname}
            />

            <a
              href="https://github.com/arRahat129"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 h-10 px-4 text-xs font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white flex items-center gap-2 transition shadow-md no-underline shrink-0 active:scale-95"
            >
              <FiGithub size={16} />
              <span>Join as Developer</span>
            </a>
          </div>

          {/* Mobile Toggle Button */}
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
          className={`grid transition-all duration-300 ease-in-out md:hidden ${
            isMobileMenuOpen
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
            <MobileNavLink
              href="/login"
              label="Login"
              currentPath={pathname}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <MobileNavLink
              href="/register"
              label="Register"
              currentPath={pathname}
              onClick={() => setIsMobileMenuOpen(false)}
            />

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
      className={`h-10 px-3.5 flex items-center text-sm font-medium rounded-lg transition-colors no-underline ${
        isActive
          ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 font-semibold"
          : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
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
      className={`h-11 px-4 flex items-center text-base font-medium rounded-lg transition-colors no-underline ${
        isActive
          ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 font-semibold"
          : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
      }`}
    >
      {label}
    </Link>
  );
}