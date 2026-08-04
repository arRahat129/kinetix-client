"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FiClock, FiUsers, FiArrowRight, FiTarget } from "react-icons/fi";
import { HiOutlineSparkles } from "react-icons/hi2";

const CATEGORY_COLORS = {
  technology: "from-blue-500 to-cyan-500",
  art: "from-purple-500 to-pink-500",
  community: "from-emerald-500 to-teal-500",
  health: "from-rose-500 to-orange-400",
  education: "from-amber-500 to-yellow-400",
  environment: "from-green-500 to-lime-400",
  science: "from-indigo-500 to-violet-500",
  food: "from-orange-500 to-red-400",
  default: "from-blue-500 to-indigo-500",
};

function getDeadlineInfo(deadline) {
  if (!deadline) return { label: "No deadline", urgent: false };
  const now = new Date();
  const end = new Date(deadline);
  const diff = end - now;
  if (diff <= 0) return { label: "Ended", urgent: true };
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return { label: "Ends today", urgent: true };
  if (days === 1) return { label: "1 day left", urgent: true };
  if (days <= 7) return { label: `${days} days left`, urgent: true };
  return { label: `${days} days left`, urgent: false };
}

export default function CampaignCard({ campaign, index = 0 }) {
  const {
    _id,
    campaign_title,
    campaign_story,
    campaign_image_url,
    funding_goal,
    raised_amount = 0,
    category,
    deadline,
    creatorName,
    creatorProfileImg,
    supporters_count = 0,
  } = campaign;

  const progress = funding_goal
    ? Math.min(100, Math.round((raised_amount / funding_goal) * 100))
    : 0;
  const normCat = category?.toLowerCase();
  const gradient = CATEGORY_COLORS[normCat] || CATEGORY_COLORS.default;
  const displayCategory = category
    ? category.charAt(0).toUpperCase() + category.slice(1)
    : "";
  const { label: deadlineLabel, urgent } = getDeadlineInfo(deadline);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.07, ease: "easeOut" }}
      whileHover={{ y: -4 }}
      className="group h-full"
    >
      <Link href={`/campaigns/${_id}`} className="block h-full no-underline">
        <div className="h-full flex flex-col rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm group-hover:shadow-xl group-hover:border-slate-300 dark:group-hover:border-slate-700 transition-all duration-300">

          {/* Thumbnail */}
          <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0">
            {campaign_image_url ? (
              <img
                src={campaign_image_url}
                alt={campaign_title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}>
                <HiOutlineSparkles className="text-white/60 w-12 h-12" />
              </div>
            )}

            {/* Category Badge */}
            {category && (
              <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${gradient} shadow-md uppercase tracking-wider text-[10px]`}>
                {displayCategory}
              </span>
            )}

            {/* Deadline badge */}
            <span
              className={`absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border backdrop-blur-sm ${
                urgent
                  ? "bg-red-500/90 border-red-400 text-white"
                  : "bg-slate-900/70 border-slate-700 text-slate-200"
              }`}
            >
              <FiClock size={11} />
              {deadlineLabel}
            </span>
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col p-5 gap-3">
            {/* Title */}
            <h3 className="text-slate-900 dark:text-white font-bold text-[15px] leading-snug line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {campaign_title}
            </h3>

            {/* Story snippet */}
            {campaign_story && (
              <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed line-clamp-2">
                {campaign_story}
              </p>
            )}

            {/* Spacer */}
            <div className="flex-1" />

            {/* Progress */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <span className={`bg-gradient-to-r ${gradient} bg-clip-text text-transparent font-extrabold`}>
                    {Number(raised_amount).toLocaleString()}
                  </span>{" "}
                  <span className="text-slate-400 dark:text-slate-500">credits raised</span>
                </span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  progress >= 100
                    ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400"
                    : progress >= 50
                    ? "bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                }`}>
                  {progress}%
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.9, delay: index * 0.07 + 0.3, ease: "easeOut" }}
                  className={`h-full rounded-full bg-gradient-to-r ${gradient}`}
                />
              </div>
              <div className="flex items-center justify-between mt-1.5">
                <span className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1">
                  <FiTarget size={10} />
                  Goal: {Number(funding_goal || 0).toLocaleString()} credits
                </span>
                <span className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1">
                  <FiUsers size={10} />
                  {supporters_count} supporters
                </span>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 min-w-0">
                {creatorProfileImg ? (
                  <img src={creatorProfileImg} alt={creatorName} className="w-6 h-6 rounded-full object-cover shrink-0" />
                ) : (
                  <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center shrink-0`}>
                    <span className="text-white text-[9px] font-bold">
                      {(creatorName || "?")[0].toUpperCase()}
                    </span>
                  </div>
                )}
                <span className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {creatorName || "Anonymous"}
                </span>
              </div>
              <span className="flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 shrink-0 group-hover:gap-2 transition-all">
                View <FiArrowRight size={12} />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
