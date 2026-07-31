"use client";

import { motion } from "framer-motion";
import { FiTrendingUp, FiArrowRight } from "react-icons/fi";
import Link from "next/link";

const campaigns = [
  {
    id: 1,
    title: "Solar-Powered Water Purifier for Rural Communities",
    image:
      "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&h=250&fit=crop",
    raised: 12500,
    goal: 15000,
    category: "Technology",
  },
  {
    id: 2,
    title: "Independent Documentary: Voices of the Ocean",
    image:
      "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=250&fit=crop",
    raised: 8900,
    goal: 10000,
    category: "Art",
  },
  {
    id: 3,
    title: "Community Garden Initiative — Growing Together",
    image:
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=250&fit=crop",
    raised: 7200,
    goal: 8000,
    category: "Community",
  },
  {
    id: 4,
    title: "AI-Powered Mental Health Companion App",
    image:
      "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=400&h=250&fit=crop",
    raised: 18300,
    goal: 20000,
    category: "Health",
  },
  {
    id: 5,
    title: "Portable Wind Turbine for Off-Grid Adventures",
    image:
      "https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?w=400&h=250&fit=crop",
    raised: 5600,
    goal: 12000,
    category: "Technology",
  },
  {
    id: 6,
    title: "Street Art Festival — Colors of Unity",
    image:
      "https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?w=400&h=250&fit=crop",
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
    <section className="relative py-24 bg-white dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-slate-800 border border-blue-200 dark:border-slate-700 text-blue-600 dark:text-blue-400 text-xs font-semibold uppercase tracking-wider mb-5">
            <FiTrendingUp size={14} />
            <span>Trending Now</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
            Top Funded{" "}
            <span className="bg-gradient-to-r from-blue-500 via-cyan-500 to-indigo-500 bg-clip-text text-transparent">
              Campaigns
            </span>
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
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
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
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
          className="text-center mt-12"
        >
          <Link
            href="/campaigns"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-blue-500 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800 font-semibold no-underline transition shadow-xs active:scale-95"
          >
            <span>View All Campaigns</span>
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
    <div className="h-full rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col">
      {/* Image */}
      <div className="relative overflow-hidden h-48 w-full">
        <img
          src={campaign.image}
          alt={campaign.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        {/* Category Badge */}
        <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-slate-900 text-blue-400 text-xs font-semibold border border-slate-700">
          {campaign.category}
        </span>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-slate-900 dark:text-white font-bold text-base mb-4 line-clamp-2 leading-snug">
            {campaign.title}
          </h3>

          {/* Progress Bar */}
          <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden mb-3">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-1000"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between mt-2">
          <div>
            <p className="text-base font-extrabold text-blue-600 dark:text-blue-400">
              {campaign.raised.toLocaleString()} credits
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              of {campaign.goal.toLocaleString()} goal
            </p>
          </div>
          <div
            className={`px-3 py-1 rounded-full text-xs font-bold ${
              progress >= 75
                ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400"
                : "bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400"
            }`}
          >
            {progress}%
          </div>
        </div>
      </div>
    </div>
  );
}
