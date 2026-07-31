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
    color: "#3b82f6",
    bg: "rgba(59, 130, 246, 0.1)",
    border: "rgba(59, 130, 246, 0.2)",
  },
  {
    icon: <FiDollarSign size={28} />,
    value: 1250000,
    suffix: "",
    prefix: "",
    label: "Credits Raised",
    color: "#06b6d4",
    bg: "rgba(6, 182, 212, 0.1)",
    border: "rgba(6, 182, 212, 0.2)",
    format: true,
  },
  {
    icon: <FiUsers size={28} />,
    value: 45000,
    suffix: "+",
    label: "Active Supporters",
    color: "#8b5cf6",
    bg: "rgba(139, 92, 246, 0.1)",
    border: "rgba(139, 92, 246, 0.2)",
  },
  {
    icon: <FiTrendingUp size={28} />,
    value: 94,
    suffix: "%",
    label: "Success Rate",
    color: "#10b981",
    bg: "rgba(16, 185, 129, 0.1)",
    border: "rgba(16, 185, 129, 0.2)",
  },
];

function useCountUp(target, duration = 2000, shouldStart = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!shouldStart) return;

    let start = 0;
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
    <div
      className="glass-card"
      style={{
        borderRadius: "16px",
        padding: "32px 28px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background accent */}
      <div
        style={{
          position: "absolute",
          top: "-30px",
          right: "-30px",
          width: "120px",
          height: "120px",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${stat.bg}, transparent 70%)`,
          pointerEvents: "none",
        }}
      />

      {/* Icon */}
      <div
        style={{
          width: "56px",
          height: "56px",
          borderRadius: "14px",
          background: stat.bg,
          border: `1px solid ${stat.border}`,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          color: stat.color,
          marginBottom: "20px",
        }}
      >
        {stat.icon}
      </div>

      {/* Value */}
      <div
        style={{
          fontSize: "2.4rem",
          fontWeight: 800,
          color: stat.color,
          lineHeight: 1.1,
          marginBottom: "8px",
          letterSpacing: "-1px",
        }}
      >
        {stat.prefix || ""}
        {displayValue}
        {stat.suffix || ""}
      </div>

      {/* Label */}
      <p
        style={{
          color: "var(--color-text-secondary)",
          fontSize: "0.9rem",
          fontWeight: 500,
        }}
      >
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
      className="section-padding"
      style={{
        position: "relative",
        background:
          "linear-gradient(180deg, var(--color-background) 0%, rgba(15, 23, 42, 0.5) 50%, var(--color-background) 100%)",
      }}
    >
      {/* Grid background */}
      <div
        className="bg-grid"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          opacity: 0.3,
        }}
      />

      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 24px",
          position: "relative",
        }}
      >
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: "60px" }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 16px",
              borderRadius: "50px",
              background: "rgba(16, 185, 129, 0.1)",
              border: "1px solid rgba(16, 185, 129, 0.15)",
              color: "#34d399",
              fontSize: "0.8rem",
              fontWeight: 500,
              marginBottom: "20px",
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            <HiOutlineChartBar size={14} />
            Our Impact
          </div>
          <h2
            style={{
              fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
              fontWeight: 800,
              color: "var(--color-text-primary)",
              marginBottom: "16px",
              letterSpacing: "-0.5px",
            }}
          >
            Platform Impact <span className="gradient-text">in Numbers</span>
          </h2>
          <p
            style={{
              color: "var(--color-text-secondary)",
              fontSize: "1.05rem",
              maxWidth: "520px",
              margin: "0 auto",
              lineHeight: 1.7,
            }}
          >
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
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
            gap: "24px",
          }}
        >
          {stats.map((stat, index) => (
            <StatCard key={index} stat={stat} isVisible={isVisible} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
