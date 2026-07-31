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
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    quote:
      "KINETIX helped me raise over 15,000 credits for my solar energy project in just 3 weeks. The platform is intuitive and the supporter community is incredibly generous.",
    rating: 5,
  },
  {
    name: "James Rodriguez",
    role: "Supporter",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    quote:
      "I have backed 12 campaigns so far and every single one delivered on their promises. The transparency and trust built into KINETIX makes contributing feel safe and rewarding.",
    rating: 5,
  },
  {
    name: "Priya Sharma",
    role: "Campaign Creator",
    photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    quote:
      "From idea to fully funded in under a month — KINETIX gave me the platform and the community to make my documentary dream a reality. Could not recommend it more.",
    rating: 5,
  },
  {
    name: "Alex Chen",
    role: "Supporter",
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    quote:
      "The credit system is brilliant. I can support multiple projects without worrying about complex payment processes. Simple, elegant, and effective — that is KINETIX.",
    rating: 5,
  },
  {
    name: "Fatima Al-Rashid",
    role: "Campaign Creator",
    photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face",
    quote:
      "My health awareness campaign exceeded its goal by 200 percent thanks to KINETIX. The notification system kept my supporters engaged throughout the entire journey.",
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section
      className="section-padding"
      style={{
        position: "relative",
        background: "linear-gradient(180deg, var(--color-background) 0%, rgba(15, 23, 42, 0.5) 50%, var(--color-background) 100%)",
      }}
    >
      {/* Background accent */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(59, 130, 246, 0.05), transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px", position: "relative" }}>
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
            <HiOutlineChatBubbleLeftRight size={14} />
            Testimonials
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
            Loved by <span className="gradient-text">Thousands</span>
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
            style={{ paddingBottom: "50px" }}
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
    <div
      className="glass-card"
      style={{
        borderRadius: "16px",
        padding: "28px",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Stars */}
      <div style={{ display: "flex", gap: "4px", marginBottom: "16px" }}>
        {Array.from({ length: testimonial.rating }).map((_, i) => (
          <FiStar
            key={i}
            size={16}
            style={{ fill: "#f59e0b", color: "#f59e0b" }}
          />
        ))}
      </div>

      {/* Quote */}
      <p
        style={{
          color: "var(--color-text-secondary)",
          fontSize: "0.92rem",
          lineHeight: 1.7,
          flex: 1,
          marginBottom: "24px",
          fontStyle: "italic",
        }}
      >
        &ldquo;{testimonial.quote}&rdquo;
      </p>

      {/* Author */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <img
          src={testimonial.photo}
          alt={testimonial.name}
          style={{
            width: "44px",
            height: "44px",
            borderRadius: "12px",
            objectFit: "cover",
            border: "2px solid rgba(59, 130, 246, 0.2)",
          }}
        />
        <div>
          <p
            style={{
              color: "var(--color-text-primary)",
              fontWeight: 600,
              fontSize: "0.9rem",
            }}
          >
            {testimonial.name}
          </p>
          <p
            style={{
              color: "#60a5fa",
              fontSize: "0.8rem",
              fontWeight: 500,
            }}
          >
            {testimonial.role}
          </p>
        </div>
      </div>
    </div>
  );
}
