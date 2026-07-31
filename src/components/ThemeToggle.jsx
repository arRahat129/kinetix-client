"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";

export default function ThemeToggle({ fullWidth = false }) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className={fullWidth ? "w-full h-10" : "w-8 h-8"} />;

  const current = theme === "system" ? resolvedTheme : theme;

  if (fullWidth) {
    return (
      <button
        onClick={() => setTheme(current === "dark" ? "light" : "dark")}
        className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
        aria-label="Toggle theme mode"
      >
        <div className="flex items-center gap-2">
          {current === "dark" ? <Sun size={18} className="text-amber-500" /> : <Moon size={18} className="text-blue-400" />}
          <span className="text-sm font-medium">
            {current === "dark" ? "Light Mode" : "Dark Mode"}
          </span>
        </div>
      </button>
    );
  }

  return (
    <button
      onClick={() => setTheme(current === "dark" ? "light" : "dark")}
      className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer text-slate-600 dark:text-slate-300 flex items-center justify-center"
      aria-label="Toggle theme mode"
    >
      {current === "dark" ? <Sun size={18} className="text-amber-500" /> : <Moon size={18} className="text-blue-400" />}
    </button>
  );
}
