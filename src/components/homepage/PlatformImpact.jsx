"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { HiOutlineChartBar } from "react-icons/hi2";
import {
  FiDollarSign,
  FiUsers,
  FiTarget,
  FiTrendingUp,
} from "react-icons/fi";

const stats = [
  {
    icon: <FiTarget size={28} />,
    value: 2840,
    suffix: "+",
    label: "Campaigns Funded",
    colorClass: "text-blue-500 dark:text-blue-400",
    bgClass: "bg-blue-50 dark:bg-blue-900",
    borderClass: "border-blue-200 dark:border-blue-800",
  },
  {
    icon: <FiDollarSign size={28} />,
    value: 1250000,
    suffix: "",
    prefix: "",
    label: "Credits Raised",
    colorClass: "text-cyan-500 dark:text-cyan-400",
    bgClass: "bg-cyan-50 dark:bg-cyan-900",
    borderClass: "border-cyan-200 dark:border-cyan-800",
    format: true,
  },
  {
    icon: <FiUsers size={28} />,
    value: 45000,
    suffix: "+",
    label: "Active Supporters",
    colorClass: "text-purple-500 dark:text-purple-400",
    bgClass: "bg-purple-50 dark:bg-purple-900",
    borderClass: "border-purple-200 dark:border-purple-800",
  },
  {
    icon: <FiTrendingUp size={28} />,
    value: 94,
    suffix: "%",
    label: "Success Rate",
    colorClass: "text-emerald-500 dark:text-emerald-400",
    bgClass: "bg-emerald-50 dark:bg-emerald-900",
    borderClass: "border-emerald-200 dark:border-emerald-800",
  },
];

function useCountUp(target, duration = 2000, shouldStart = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!shouldStart) return;

    const startTime = performance.now();

    function animate(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);

      setCount(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    }

    requestAnimationFrame(animate);
  }, [target, duration, shouldStart]);

  return count;
}

function StatCard({ stat, isVisible }) {
  const count = useCountUp(stat.value, 2500, isVisible);
  const displayValue = stat.format
    ? count.toLocaleString()
    : count.toLocaleString();

  return (
    <div className="h-full relative overflow-hidden rounded-2xl p-8 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
      {/* Icon */}
      <div
        className={`w-14 h-14 rounded-2xl ${stat.bgClass} border ${stat.borderClass} inline-flex items-center justify-center ${stat.colorClass} mb-5`}
      >
        {stat.icon}
      </div>

      {/* Value */}
      <div
        className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${stat.colorClass} leading-none mb-2`}
      >
        {stat.prefix || ""}
        {displayValue}
        {stat.suffix || ""}
      </div>

      {/* Label */}
      <p className="text-slate-600 dark:text-slate-300 text-sm font-medium">
        {stat.label}
      </p>
    </div>
  );
}

export default function PlatformImpact() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-24 bg-white dark:bg-slate-950 transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-6 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 dark:bg-slate-800 border border-emerald-200 dark:border-slate-700 text-emerald-600 dark:text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-5">
            <HiOutlineChartBar size={14} />
            <span>Our Impact</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
            Platform Impact{" "}
            <span className="bg-gradient-to-r from-blue-500 via-cyan-500 to-indigo-500 bg-clip-text text-transparent">
              in Numbers
            </span>
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            Real results from a real community. See how KINETIX is changing the
            way ideas get funded.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {stats.map((stat, index) => (
            <StatCard key={index} stat={stat} isVisible={isVisible} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
