"use client";

import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { motion } from "framer-motion";
import { FiStar } from "react-icons/fi";
import { HiOutlineChatBubbleLeftRight } from "react-icons/hi2";

/** Map a DB review into the shape TestimonialCard expects */
function mapReviewToTestimonial(review) {
  return {
    name: review.userName || "Supporter",
    role: review.campaignName ? `Supporter — ${review.campaignName}` : "Supporter",
    photo: review.userImage || "",
    quote: review.comment || "",
    rating: review.rating || 5,
  };
}

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReviews() {
      try {
        // Use the same-origin Next.js proxy route to avoid CORS issues
        const response = await fetch("/api/reviews/featured", { cache: "no-store" });
        if (response.ok) {
          const json = await response.json();
          const reviews = json?.data;
          if (Array.isArray(reviews) && reviews.length > 0) {
            setTestimonials(reviews.map(mapReviewToTestimonial));
          }
        }
      } catch (error) {
        console.error("Failed to fetch testimonials:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchReviews();
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

        {/* Testimonial Slider or States */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {loading ? (
            /* Skeleton */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-52 rounded-2xl bg-slate-100 dark:bg-slate-800/60 animate-pulse"
                />
              ))}
            </div>
          ) : testimonials.length === 0 ? (
            /* Empty State */
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center justify-center gap-5 py-16 px-8 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/40"
            >
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-slate-800 flex items-center justify-center">
                  <HiOutlineChatBubbleLeftRight className="w-8 h-8 text-blue-400 dark:text-blue-500" />
                </div>
                <div className="absolute -top-1 -right-1 flex gap-0.5">
                  {[1, 2, 3].map((i) => (
                    <FiStar
                      key={i}
                      className="w-3.5 h-3.5 text-amber-400 fill-amber-400"
                    />
                  ))}
                </div>
              </div>

              <div className="text-center max-w-sm">
                <p className="text-base font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                  No reviews yet
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  Be one of the first to support a campaign and share your
                  experience. Featured reviews from the community will appear
                  here.
                </p>
              </div>

              <div className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-blue-50 dark:bg-slate-800 border border-blue-100 dark:border-slate-700">
                {[1, 2, 3, 4, 5].map((i) => (
                  <FiStar
                    key={i}
                    className="w-4 h-4 text-slate-300 dark:text-slate-600"
                  />
                ))}
                <span className="ml-1.5 text-xs text-slate-400 dark:text-slate-500 font-medium">
                  Waiting for the first review
                </span>
              </div>
            </motion.div>
          ) : (
            /* Real Reviews */
            <Swiper
              modules={[Autoplay, Pagination]}
              autoplay={{ delay: 4000, disableOnInteraction: false }}
              pagination={{ clickable: true }}
              loop={testimonials.length > 3}
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
          )}
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
        {[1, 2, 3, 4, 5].map((star) => (
          <FiStar
            key={star}
            size={16}
            className={
              star <= testimonial.rating
                ? "fill-amber-400 text-amber-400"
                : "text-slate-200 dark:text-slate-700"
            }
          />
        ))}
      </div>

      {/* Quote */}
      <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed flex-1 italic mb-6">
        &ldquo;{testimonial.quote}&rdquo;
      </p>

      {/* Author */}
      <div className="flex items-center gap-3">
        {testimonial.photo ? (
          <img
            src={testimonial.photo}
            alt={testimonial.name}
            className="w-11 h-11 rounded-xl object-cover border-2 border-blue-200 dark:border-blue-900 shrink-0"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "flex";
            }}
          />
        ) : null}
        <div
          className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 items-center justify-center text-white font-bold text-sm shrink-0"
          style={{
            display: testimonial.photo ? "none" : "flex",
          }}
        >
          {(testimonial.name || "?")[0].toUpperCase()}
        </div>
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
