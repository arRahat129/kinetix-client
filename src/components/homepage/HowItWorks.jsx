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
    iconColor: "text-blue-500 dark:text-blue-400",
    bgClass: "bg-blue-50 dark:bg-blue-950",
    borderClass: "border-blue-200 dark:border-blue-800",
  },
  {
    icon: <FiSearch size={28} />,
    step: "02",
    title: "Discover or Launch",
    description:
      "Browse trending campaigns across Technology, Art, Health, and Community — or create your own campaign and share your vision with the world.",
    iconColor: "text-purple-500 dark:text-purple-400",
    bgClass: "bg-purple-50 dark:bg-purple-950",
    borderClass: "border-purple-200 dark:border-purple-800",
  },
  {
    icon: <FiHeart size={28} />,
    step: "03",
    title: "Contribute Credits",
    description:
      "Use your credits to support campaigns you believe in. Every contribution brings a creator closer to their goal and makes a real impact.",
    iconColor: "text-cyan-500 dark:text-cyan-400",
    bgClass: "bg-cyan-50 dark:bg-cyan-950",
    borderClass: "border-cyan-200 dark:border-cyan-800",
  },
  {
    icon: <FiAward size={28} />,
    step: "04",
    title: "Achieve the Goal",
    description:
      "Once fully funded, creators bring their vision to life. Supporters receive exclusive rewards and the satisfaction of making a difference.",
    iconColor: "text-emerald-500 dark:text-emerald-400",
    bgClass: "bg-emerald-50 dark:bg-emerald-950",
    borderClass: "border-emerald-200 dark:border-emerald-800",
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
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-slate-800 border border-blue-200 dark:border-slate-700 text-blue-600 dark:text-blue-400 text-xs font-semibold uppercase tracking-wider mb-5">
            <HiOutlineLightBulb size={14} />
            <span>Simple Process</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
            How{" "}
            <span className="bg-gradient-to-r from-blue-500 via-cyan-500 to-indigo-500 bg-clip-text text-transparent">
              It Works
            </span>
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg max-w-lg mx-auto leading-relaxed">
            From sign-up to success — four simple steps to fund or support the
            next big idea.
          </p>
        </motion.div>

        {/* Steps */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {steps.map((step, index) => (
            <motion.div key={index} variants={cardVariants}>
              <div className="h-full relative overflow-hidden rounded-2xl p-8 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                {/* Step number watermark */}
                <span className="absolute -top-2 right-4 text-7xl font-black text-slate-200 dark:text-slate-800 select-none pointer-events-none">
                  {step.step}
                </span>

                {/* Icon */}
                <div
                  className={`w-14 h-14 rounded-2xl ${step.bgClass} border ${step.borderClass} flex items-center justify-center ${step.iconColor} mb-5`}
                >
                  {step.icon}
                </div>

                {/* Step Label */}
                <span
                  className={`text-xs font-bold uppercase tracking-widest block mb-2 ${step.iconColor}`}
                >
                  Step {step.step}
                </span>

                {/* Title */}
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                  {step.description}
                </p>

                {/* Arrow connector on desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:flex absolute -right-3 top.1/2 -translate-y-1/2 z-10 text-slate-300 dark:text-slate-700">
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
