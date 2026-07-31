"use client";

import { motion } from "framer-motion";
import {
  FiUserPlus,
  FiSearch,
  FiHeart,
  FiAward,
  FiArrowRight,
} from "react-icons/fi";
import { HiOutlineLightBulb } from "react-icons/hi2";

const steps = [
  {
    icon: <FiUserPlus size={28} />,
    step: "01",
    title: "Create Your Account",
    description:
      "Sign up as a Supporter to back campaigns or as a Creator to launch your own. Get free starting credits upon registration.",
    color: "#3b82f6",
    bg: "rgba(59, 130, 246, 0.1)",
    border: "rgba(59, 130, 246, 0.2)",
  },
  {
    icon: <FiSearch size={28} />,
    step: "02",
    title: "Discover or Launch",
    description:
      "Browse trending campaigns across Technology, Art, Health, and Community — or create your own campaign and share your vision with the world.",
    color: "#8b5cf6",
    bg: "rgba(139, 92, 246, 0.1)",
    border: "rgba(139, 92, 246, 0.2)",
  },
  {
    icon: <FiHeart size={28} />,
    step: "03",
    title: "Contribute Credits",
    description:
      "Use your credits to support campaigns you believe in. Every contribution brings a creator closer to their goal and makes a real impact.",
    color: "#06b6d4",
    bg: "rgba(6, 182, 212, 0.1)",
    border: "rgba(6, 182, 212, 0.2)",
  },
  {
    icon: <FiAward size={28} />,
    step: "04",
    title: "Achieve the Goal",
    description:
      "Once fully funded, creators bring their vision to life. Supporters receive exclusive rewards and the satisfaction of making a difference.",
    color: "#10b981",
    bg: "rgba(16, 185, 129, 0.1)",
    border: "rgba(16, 185, 129, 0.2)",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="section-padding"
      style={{
        position: "relative",
        background: "var(--color-background)",
      }}
    >
      {/* Subtle grid */}
      <div
        className="bg-grid"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          opacity: 0.4,
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
              background: "rgba(59, 130, 246, 0.1)",
              border: "1px solid rgba(59, 130, 246, 0.15)",
              color: "#60a5fa",
              fontSize: "0.8rem",
              fontWeight: 500,
              marginBottom: "20px",
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            <HiOutlineLightBulb size={14} />
            Simple Process
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
            How <span className="gradient-text">It Works</span>
          </h2>
          <p
            style={{
              color: "var(--color-text-secondary)",
              fontSize: "1.05rem",
              maxWidth: "500px",
              margin: "0 auto",
              lineHeight: 1.7,
            }}
          >
            From sign-up to success — four simple steps to fund or support
            the next big idea.
          </p>
        </motion.div>

        {/* Steps */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "24px",
          }}
        >
          {steps.map((step, index) => (
            <motion.div key={index} variants={cardVariants}>
              <div
                className="glass-card"
                style={{
                  borderRadius: "16px",
                  padding: "32px 28px",
                  height: "100%",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Step number watermark */}
                <span
                  style={{
                    position: "absolute",
                    top: "-10px",
                    right: "16px",
                    fontSize: "5rem",
                    fontWeight: 900,
                    color: "rgba(59, 130, 246, 0.04)",
                    lineHeight: 1,
                    pointerEvents: "none",
                  }}
                >
                  {step.step}
                </span>

                {/* Icon */}
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "14px",
                    background: step.bg,
                    border: `1px solid ${step.border}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: step.color,
                    marginBottom: "20px",
                  }}
                >
                  {step.icon}
                </div>

                {/* Step Label */}
                <span
                  style={{
                    color: step.color,
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "1.5px",
                    marginBottom: "8px",
                    display: "block",
                  }}
                >
                  Step {step.step}
                </span>

                {/* Title */}
                <h3
                  style={{
                    color: "var(--color-text-primary)",
                    fontSize: "1.15rem",
                    fontWeight: 700,
                    marginBottom: "12px",
                  }}
                >
                  {step.title}
                </h3>

                {/* Description */}
                <p
                  style={{
                    color: "var(--color-text-secondary)",
                    fontSize: "0.9rem",
                    lineHeight: 1.7,
                  }}
                >
                  {step.description}
                </p>

                {/* Arrow connector on desktop */}
                {index < steps.length - 1 && (
                  <div
                    className="hidden lg:flex"
                    style={{
                      position: "absolute",
                      right: "-14px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      zIndex: 10,
                      color: "rgba(59, 130, 246, 0.3)",
                    }}
                  >
                    <FiArrowRight size={24} />
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
