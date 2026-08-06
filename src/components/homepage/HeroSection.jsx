"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FiArrowRight, FiPlay } from "react-icons/fi";
import { HiOutlineSparkles } from "react-icons/hi2";

const slides = [
  {
    badge: "Crowdfunding Reimagined",
    heading: "Fuel Bold Ideas,",
    headingAccent: "Fund the Future",
    subtitle:
      "Join thousands of creators and supporters shaping tomorrow. Discover campaigns that inspire and contribute to the ones that matter most.",
    cta: "Explore Campaigns",
    ctaLink: "/campaigns",
    gradientClass: "from-blue-500 to-blue-400",
  },
  {
    badge: "For Visionary Creators",
    heading: "Launch Your Vision,",
    headingAccent: "Rally Your Tribe",
    subtitle:
      "Turn your creative spark into a movement. Set your goal, share your story, and watch your community bring it to life — one contribution at a time.",
    cta: "Start a Campaign",
    ctaLink: "/auth/signup",
    gradientClass: "from-purple-500 to-blue-400",
  },
  {
    badge: "Community Powered",
    heading: "Every Credit Counts,",
    headingAccent: "Every Dream Matters",
    subtitle:
      "Whether it is a solar-powered invention or a local art project, your support makes the difference. Be the backer behind the next big breakthrough.",
    cta: "Get Started Free",
    ctaLink: "/auth/signup",
    gradientClass: "from-cyan-500 to-blue-400",
  },
];

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white dark:bg-slate-950 transition-colors duration-300">
      {/* Background Radial Glow */}
      <div className="absolute inset-0 pointer-events-none z-0 bg-gradient-to-b from-blue-50 to-white dark:from-slate-900 dark:to-slate-950" />

      {/* Slide Container */}
      <div className="relative w-full max-w-4xl px-6 pt-32 pb-20 text-center z-10">
        {slides.map((slide, index) => {
          const isActive = index === currentSlide;

          return (
            <div
              key={index}
              className={`transition-all duration-700 ease-in-out ${isActive
                  ? "relative opacity-100 pointer-events-auto visible block"
                  : "absolute inset-0 opacity-0 pointer-events-none invisible hidden"
                }`}
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-blue-100 dark:bg-slate-800 border border-blue-200 dark:border-slate-700 text-blue-600 dark:text-blue-400 text-sm font-medium mb-7 shadow-xs">
                <HiOutlineSparkles size={16} />
                <span>{slide.badge}</span>
              </div>

              {/* Heading */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight text-slate-900 dark:text-white mb-6">
                {slide.heading}
                <br />
                <span
                  className={`bg-gradient-to-r ${slide.gradientClass} bg-clip-text text-transparent`}
                >
                  {slide.headingAccent}
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto mb-10">
                {slide.subtitle}
              </p>

              {/* Buttons */}
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <Link
                  href={slide.ctaLink}
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold no-underline transition shadow-md hover:shadow-lg active:scale-95"
                >
                  <span>{slide.cta}</span>
                  <FiArrowRight size={18} />
                </Link>
                <Link
                  href="#how-it-works"
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 font-semibold no-underline transition active:scale-95"
                >
                  <FiPlay size={16} />
                  <span>How It Works</span>
                </Link>
              </div>
            </div>
          );
        })}

        {/* Pagination Dots */}
        <div className="flex justify-center gap-2.5 mt-10">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2.5 rounded-full border-none cursor-pointer transition-all duration-300 ${idx === currentSlide
                  ? "w-8 bg-blue-600"
                  : "w-2.5 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-600"
                }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}