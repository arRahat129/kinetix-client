"use client";

import { motion } from "framer-motion";
import { FiTrendingUp, FiArrowRight } from "react-icons/fi";
import Link from "next/link";

import { useState, useEffect } from "react";
import { getTopFundedCampaigns } from "@/lib/api/campaign";

function CampaignCardSkeleton() {
  return (
    <div className="h-[380px] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 animate-pulse">
      <div className="h-48 bg-slate-200 dark:bg-slate-800" />
      <div className="p-6 flex flex-col justify-between flex-1">
        <div>
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-4/5 mb-3" />
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/5 mb-6" />
          <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded-full mb-4 w-full" />
        </div>
        <div className="flex justify-between items-center mt-4">
          <div>
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-20 mb-1" />
            <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-16" />
          </div>
          <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-full w-12" />
        </div>
      </div>
    </div>
  );
}

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
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTopCampaigns() {
      try {
        const res = await getTopFundedCampaigns(6);
        if (res?.success && res?.data) {
          setCampaigns(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch top campaigns", err);
      } finally {
        setLoading(false);
      }
    }
    fetchTopCampaigns();
  }, []);

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
          {loading
            ? Array.from({ length: 6 }).map((_, idx) => (
                <motion.div key={idx} variants={cardVariants}>
                  <CampaignCardSkeleton />
                </motion.div>
              ))
            : campaigns.map((campaign) => (
                <motion.div key={campaign._id} variants={cardVariants}>
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
  const progress = campaign.progress !== undefined ? campaign.progress : Math.round(((campaign.raised || 0) / (campaign.goal || 1)) * 100);
  const image = campaign.campaign_image_url || campaign.image;
  const title = campaign.campaign_title || campaign.title;

  return (
    <Link href={`/campaigns/${campaign._id}`} className="block h-full rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer">
      <div className="flex flex-col h-full">
        {/* Image */}
        <div className="relative overflow-hidden h-48 w-full">
          <img
            src={image}
            alt={title}
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
              {title}
            </h3>

            {/* Progress Bar */}
            <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden mb-3">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-1000"
                style={{ width: `${Math.min(100, progress)}%` }}
              />
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between mt-2">
            <div>
              <p className="text-base font-extrabold text-blue-600 dark:text-blue-400">
                {(campaign.raised || 0).toLocaleString()} credits
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                of {(campaign.goal || 1).toLocaleString()} goal
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
    </Link>
  );
}
