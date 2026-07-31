"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { motion } from "framer-motion";
import { FiStar } from "react-icons/fi";
import { HiOutlineChatBubbleLeftRight } from "react-icons/hi2";

const testimonials = [
  {
    name: "Sarah Mitchell",
    role: "Campaign Creator",
    photo:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    quote:
      "KINETIX helped me raise over 15,000 credits for my solar energy project in just 3 weeks. The platform is intuitive and the supporter community is incredibly generous.",
    rating: 5,
  },
  {
    name: "James Rodriguez",
    role: "Supporter",
    photo:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    quote:
      "I have backed 12 campaigns so far and every single one delivered on their promises. The transparency and trust built into KINETIX makes contributing feel safe and rewarding.",
    rating: 5,
  },
  {
    name: "Priya Sharma",
    role: "Campaign Creator",
    photo:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    quote:
      "From idea to fully funded in under a month — KINETIX gave me the platform and the community to make my documentary dream a reality. Could not recommend it more.",
    rating: 5,
  },
  {
    name: "Alex Chen",
    role: "Supporter",
    photo:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    quote:
      "The credit system is brilliant. I can support multiple projects without worrying about complex payment processes. Simple, elegant, and effective — that is KINETIX.",
    rating: 5,
  },
  {
    name: "Fatima Al-Rashid",
    role: "Campaign Creator",
    photo:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face",
    quote:
      "My health awareness campaign exceeded its goal by 200 percent thanks to KINETIX. The notification system kept my supporters engaged throughout the entire journey.",
    rating: 5,
  },
];

export default function Testimonials() {
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
            <HiOutlineChatBubbleLeftRight size={14} />
            <span>Testimonials</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
            Loved by{" "}
            <span className="bg-gradient-to-r from-blue-500 via-cyan-500 to-indigo-500 bg-clip-text text-transparent">
              Thousands
            </span>
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg max-w-lg mx-auto leading-relaxed">
            Hear from creators and supporters who have transformed their ideas
            into reality through our platform.
          </p>
        </motion.div>

        {/* Testimonial Slider */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Swiper
            modules={[Autoplay, Pagination]}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            loop={true}
            spaceBetween={24}
            breakpoints={{
              0: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="pb-12"
          >
            {testimonials.map((t, index) => (
              <SwiperSlide key={index}>
                <TestimonialCard testimonial={t} />
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>
      </div>
    </section>
  );
}

function TestimonialCard({ testimonial }) {
  return (
    <div className="h-full flex flex-col rounded-2xl p-7 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300">
      {/* Stars */}
      <div className="flex gap-1 mb-4">
        {Array.from({ length: testimonial.rating }).map((_, i) => (
          <FiStar
            key={i}
            size={16}
            className="fill-amber-400 text-amber-400"
          />
        ))}
      </div>

      {/* Quote */}
      <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed flex-1 italic mb-6">
        &ldquo;{testimonial.quote}&rdquo;
      </p>

      {/* Author */}
      <div className="flex items-center gap-3">
        <img
          src={testimonial.photo}
          alt={testimonial.name}
          className="w-11 h-11 rounded-xl object-cover border-2 border-blue-200 dark:border-blue-900 shrink-0"
        />
        <div>
          <p className="text-slate-900 dark:text-white font-semibold text-sm">
            {testimonial.name}
          </p>
          <p className="text-blue-600 dark:text-blue-400 text-xs font-medium">
            {testimonial.role}
          </p>
        </div>
      </div>
    </div>
  );
}
