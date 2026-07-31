"use client";

import { motion } from "framer-motion";
import { FiTrendingUp, FiArrowRight } from "react-icons/fi";
import Link from "next/link";

const campaigns = [
  {
    id: 1,
    title: "Solar-Powered Water Purifier for Rural Communities",
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&h=250&fit=crop",
    raised: 12500,
    goal: 15000,
    category: "Technology",
  },
  {
    id: 2,
    title: "Independent Documentary: Voices of the Ocean",
    image: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=250&fit=crop",
    raised: 8900,
    goal: 10000,
    category: "Art",
  },
  {
    id: 3,
    title: "Community Garden Initiative — Growing Together",
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=250&fit=crop",
    raised: 7200,
    goal: 8000,
    category: "Community",
  },
  {
    id: 4,
    title: "AI-Powered Mental Health Companion App",
    image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=400&h=250&fit=crop",
    raised: 18300,
    goal: 20000,
    category: "Health",
  },
  {
    id: 5,
    title: "Portable Wind Turbine for Off-Grid Adventures",
    image: "https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?w=400&h=250&fit=crop",
    raised: 5600,
    goal: 12000,
    category: "Technology",
  },
  {
    id: 6,
    title: "Street Art Festival — Colors of Unity",
    image: "https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?w=400&h=250&fit=crop",
    raised: 4100,
    goal: 5000,
    category: "Art",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
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

export default function TopFundedCampaigns() {
  return (
    <section
      className="section-padding bg-radial-blue"
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
            <FiTrendingUp size={14} />
            Trending Now
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
            Top Funded <span className="gradient-text">Campaigns</span>
          </h2>
          <p
            style={{
              color: "var(--color-text-secondary)",
              fontSize: "1.05rem",
              maxWidth: "550px",
              margin: "0 auto",
              lineHeight: 1.7,
            }}
          >
            Discover the campaigns making the biggest impact right now. These
            projects are leading the way in community support.
          </p>
        </motion.div>

        {/* Campaign Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
            gap: "24px",
          }}
        >
          {campaigns.map((campaign) => (
            <motion.div key={campaign.id} variants={cardVariants}>
              <CampaignCard campaign={campaign} />
            </motion.div>
          ))}
        </motion.div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          style={{ textAlign: "center", marginTop: "48px" }}
        >
          <Link href="/campaigns" className="btn-outline">
            View All Campaigns
            <FiArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

function CampaignCard({ campaign }) {
  const progress = Math.round((campaign.raised / campaign.goal) * 100);

  return (
    <div
      className="glass-card"
      style={{
        borderRadius: "16px",
        overflow: "hidden",
        cursor: "pointer",
      }}
    >
      {/* Image */}
      <div style={{ position: "relative", overflow: "hidden" }}>
        <img
          src={campaign.image}
          alt={campaign.title}
          style={{
            width: "100%",
            height: "200px",
            objectFit: "cover",
            transition: "transform 0.4s ease",
          }}
          onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
          onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
        />
        {/* Category Badge */}
        <span
          style={{
            position: "absolute",
            top: "12px",
            right: "12px",
            padding: "4px 12px",
            borderRadius: "20px",
            background: "rgba(6, 11, 24, 0.7)",
            backdropFilter: "blur(8px)",
            color: "#60a5fa",
            fontSize: "0.75rem",
            fontWeight: 600,
            border: "1px solid rgba(59, 130, 246, 0.2)",
          }}
        >
          {campaign.category}
        </span>
      </div>

      {/* Content */}
      <div style={{ padding: "20px" }}>
        <h3
          style={{
            color: "var(--color-text-primary)",
            fontSize: "1.05rem",
            fontWeight: 600,
            marginBottom: "16px",
            lineHeight: 1.4,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {campaign.title}
        </h3>

        {/* Progress Bar */}
        <div className="progress-bar" style={{ marginBottom: "12px" }}>
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>

        {/* Stats */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <p
              style={{
                fontSize: "1.1rem",
                fontWeight: 700,
                color: "#60a5fa",
              }}
            >
              {campaign.raised.toLocaleString()} credits
            </p>
            <p
              style={{
                fontSize: "0.78rem",
                color: "var(--color-text-muted)",
              }}
            >
              of {campaign.goal.toLocaleString()} goal
            </p>
          </div>
          <div
            style={{
              padding: "6px 14px",
              borderRadius: "20px",
              background:
                progress >= 75
                  ? "rgba(16, 185, 129, 0.12)"
                  : "rgba(59, 130, 246, 0.12)",
              color: progress >= 75 ? "#10b981" : "#60a5fa",
              fontSize: "0.85rem",
              fontWeight: 600,
            }}
          >
            {progress}%
          </div>
        </div>
      </div>
    </div>
  );
}
