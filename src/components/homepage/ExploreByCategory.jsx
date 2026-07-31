"use client";

import { motion } from "framer-motion";
import { HiOutlineSquares2X2 } from "react-icons/hi2";
import { FiCpu, FiFeather, FiUsers, FiHeart } from "react-icons/fi";

const categories = [
  {
    name: "Technology",
    description:
      "Innovative gadgets, software, AI projects, and engineering marvels pushing the boundaries of what is possible.",
    icon: <FiCpu size={32} />,
    count: 124,
    gradient: "from-blue-600 to-blue-800",
    bgClass: "bg-blue-50 dark:bg-slate-900",
    borderHover: "hover:border-blue-500",
  },
  {
    name: "Art",
    description:
      "Films, music, design, illustration, and creative expressions that inspire and captivate audiences worldwide.",
    icon: <FiFeather size={32} />,
    count: 89,
    gradient: "from-purple-600 to-purple-800",
    bgClass: "bg-purple-50 dark:bg-slate-900",
    borderHover: "hover:border-purple-500",
  },
  {
    name: "Community",
    description:
      "Local initiatives, environmental projects, education programs, and social causes that bring people together.",
    icon: <FiUsers size={32} />,
    count: 67,
    gradient: "from-cyan-600 to-cyan-800",
    bgClass: "bg-cyan-50 dark:bg-slate-900",
    borderHover: "hover:border-cyan-500",
  },
  {
    name: "Health",
    description:
      "Medical research, wellness apps, mental health tools, and healthcare innovations improving lives globally.",
    icon: <FiHeart size={32} />,
    count: 53,
    gradient: "from-emerald-600 to-emerald-800",
    bgClass: "bg-emerald-50 dark:bg-slate-900",
    borderHover: "hover:border-emerald-500",
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
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-50 dark:bg-slate-800 border border-cyan-200 dark:border-slate-700 text-cyan-600 dark:text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-5">
            <HiOutlineSquares2X2 size={14} />
            <span>Browse Categories</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
            Explore by{" "}
            <span className="bg-gradient-to-r from-blue-500 via-cyan-500 to-indigo-500 bg-clip-text text-transparent">
              Category
            </span>
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
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
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {categories.map((cat, index) => (
            <motion.div key={index} variants={cardVariants}>
              <div
                className={`h-full relative overflow-hidden rounded-2xl p-8 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm ${cat.borderHover} transition-all duration-300 hover:-translate-y-1 cursor-pointer`}
              >
                {/* Icon */}
                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${cat.gradient} flex items-center justify-center text-white mb-5 shadow-md`}
                >
                  {cat.icon}
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2.5">
                  {cat.name}
                </h3>

                {/* Description */}
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-4">
                  {cat.description}
                </p>

                {/* Count */}
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
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
