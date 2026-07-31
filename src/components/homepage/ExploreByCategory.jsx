"use client";

import { motion } from "framer-motion";
import { HiOutlineSquares2X2 } from "react-icons/hi2";
import {
  FiCpu,
  FiFeather,
  FiUsers,
  FiHeart,
} from "react-icons/fi";

const categories = [
  {
    name: "Technology",
    description: "Innovative gadgets, software, AI projects, and engineering marvels pushing the boundaries of what is possible.",
    icon: <FiCpu size={32} />,
    count: 124,
    gradient: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
    bg: "rgba(59, 130, 246, 0.08)",
    border: "rgba(59, 130, 246, 0.15)",
    hoverBorder: "rgba(59, 130, 246, 0.4)",
  },
  {
    name: "Art",
    description: "Films, music, design, illustration, and creative expressions that inspire and captivate audiences worldwide.",
    icon: <FiFeather size={32} />,
    count: 89,
    gradient: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
    bg: "rgba(139, 92, 246, 0.08)",
    border: "rgba(139, 92, 246, 0.15)",
    hoverBorder: "rgba(139, 92, 246, 0.4)",
  },
  {
    name: "Community",
    description: "Local initiatives, environmental projects, education programs, and social causes that bring people together.",
    icon: <FiUsers size={32} />,
    count: 67,
    gradient: "linear-gradient(135deg, #06b6d4, #0891b2)",
    bg: "rgba(6, 182, 212, 0.08)",
    border: "rgba(6, 182, 212, 0.15)",
    hoverBorder: "rgba(6, 182, 212, 0.4)",
  },
  {
    name: "Health",
    description: "Medical research, wellness apps, mental health tools, and healthcare innovations improving lives globally.",
    icon: <FiHeart size={32} />,
    count: 53,
    gradient: "linear-gradient(135deg, #10b981, #059669)",
    bg: "rgba(16, 185, 129, 0.08)",
    border: "rgba(16, 185, 129, 0.15)",
    hoverBorder: "rgba(16, 185, 129, 0.4)",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export default function ExploreByCategory() {
  return (
    <section
      id="categories"
      className="section-padding bg-radial-cyan"
      style={{ position: "relative" }}
    >
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px" }}>
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
              background: "rgba(6, 182, 212, 0.1)",
              border: "1px solid rgba(6, 182, 212, 0.15)",
              color: "#22d3ee",
              fontSize: "0.8rem",
              fontWeight: 500,
              marginBottom: "20px",
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            <HiOutlineSquares2X2 size={14} />
            Browse Categories
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
            Explore by <span className="gradient-text">Category</span>
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
            Find campaigns that match your passions. From cutting-edge tech to
            heartfelt community projects.
          </p>
        </motion.div>

        {/* Category Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))",
            gap: "24px",
          }}
        >
          {categories.map((cat, index) => (
            <motion.div key={index} variants={cardVariants}>
              <div
                className="glass-card"
                style={{
                  borderRadius: "16px",
                  padding: "32px 28px",
                  cursor: "pointer",
                  height: "100%",
                  position: "relative",
                  overflow: "hidden",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = cat.hoverBorder;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--color-border)";
                }}
              >
                {/* Background gradient on hover */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    width: "200px",
                    height: "200px",
                    background: `radial-gradient(circle, ${cat.bg}, transparent 70%)`,
                    pointerEvents: "none",
                  }}
                />

                {/* Icon */}
                <div
                  style={{
                    width: "64px",
                    height: "64px",
                    borderRadius: "16px",
                    background: cat.gradient,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    marginBottom: "20px",
                    position: "relative",
                  }}
                >
                  {cat.icon}
                </div>

                {/* Title */}
                <h3
                  style={{
                    color: "var(--color-text-primary)",
                    fontSize: "1.2rem",
                    fontWeight: 700,
                    marginBottom: "10px",
                    position: "relative",
                  }}
                >
                  {cat.name}
                </h3>

                {/* Description */}
                <p
                  style={{
                    color: "var(--color-text-secondary)",
                    fontSize: "0.88rem",
                    lineHeight: 1.7,
                    marginBottom: "16px",
                    position: "relative",
                  }}
                >
                  {cat.description}
                </p>

                {/* Count */}
                <span
                  style={{
                    color: "var(--color-text-muted)",
                    fontSize: "0.82rem",
                    fontWeight: 500,
                    position: "relative",
                  }}
                >
                  {cat.count} active campaigns
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
