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
    accent: "#3b82f6",
  },
  {
    badge: "For Visionary Creators",
    heading: "Launch Your Vision,",
    headingAccent: "Rally Your Tribe",
    subtitle:
      "Turn your creative spark into a movement. Set your goal, share your story, and watch your community bring it to life — one contribution at a time.",
    cta: "Start a Campaign",
    ctaLink: "/register",
    accent: "#8b5cf6",
  },
  {
    badge: "Community Powered",
    heading: "Every Credit Counts,",
    headingAccent: "Every Dream Matters",
    subtitle:
      "Whether it is a solar-powered invention or a local art project, your support makes the difference. Be the backer behind the next big breakthrough.",
    cta: "Get Started Free",
    ctaLink: "/register",
    accent: "#06b6d4",
  },
];

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-advance loop cleanly without clone issues
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        backgroundColor: "#090d16",
      }}
    >
      {/* Background radial gradient */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 20% 50%, rgba(59, 130, 246, 0.12) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(6, 182, 212, 0.08) 0%, transparent 50%)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* Floating orbs */}
      <div
        className="animate-float"
        style={{
          position: "absolute",
          top: "15%",
          right: "10%",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(59, 130, 246, 0.1), transparent 70%)",
          filter: "blur(40px)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* Slide Container */}
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "800px",
          padding: "120px 24px 80px",
          textAlign: "center",
          zIndex: 2,
        }}
      >
        {slides.map((slide, index) => {
          const isActive = index === currentSlide;

          return (
            <div
              key={index}
              style={{
                position: isActive ? "relative" : "absolute",
                top: 0,
                left: 0,
                right: 0,
                opacity: isActive ? 1 : 0,
                pointerEvents: isActive ? "auto" : "none",
                transition: "opacity 0.8s ease-in-out",
                visibility: isActive ? "visible" : "hidden",
              }}
            >
              {/* Badge */}
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "8px 20px",
                  borderRadius: "50px",
                  background: "rgba(59, 130, 246, 0.1)",
                  border: "1px solid rgba(59, 130, 246, 0.2)",
                  color: "#60a5fa",
                  fontSize: "0.85rem",
                  fontWeight: 500,
                  marginBottom: "28px",
                }}
              >
                <HiOutlineSparkles size={16} />
                {slide.badge}
              </div>

              {/* Heading */}
              <h1
                style={{
                  fontSize: "clamp(2.2rem, 5vw, 4rem)",
                  fontWeight: 800,
                  lineHeight: 1.1,
                  marginBottom: "24px",
                  color: "#ffffff",
                  letterSpacing: "-1px",
                }}
              >
                {slide.heading}
                <br />
                <span
                  style={{
                    background: `linear-gradient(135deg, ${slide.accent}, #60a5fa)`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {slide.headingAccent}
                </span>
              </h1>

              {/* Subtitle */}
              <p
                style={{
                  fontSize: "clamp(1rem, 1.8vw, 1.15rem)",
                  color: "#94a3b8",
                  lineHeight: 1.7,
                  maxWidth: "600px",
                  margin: "0 auto 40px",
                }}
              >
                {slide.subtitle}
              </p>

              {/* Buttons */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "16px",
                  flexWrap: "wrap",
                }}
              >
                <Link
                  href={slide.ctaLink}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "12px 28px",
                    borderRadius: "12px",
                    background: "#2563eb",
                    color: "#ffffff",
                    fontWeight: 600,
                    textDecoration: "none",
                  }}
                >
                  {slide.cta}
                  <FiArrowRight size={18} />
                </Link>
                <Link
                  href="#how-it-works"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "12px 28px",
                    borderRadius: "12px",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    color: "#ffffff",
                    fontWeight: 600,
                    textDecoration: "none",
                    background: "rgba(255, 255, 255, 0.03)",
                  }}
                >
                  <FiPlay size={16} />
                  How It Works
                </Link>
              </div>
            </div>
          );
        })}

        {/* Custom Pagination Dots */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            marginTop: "40px",
          }}
        >
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              style={{
                width: idx === currentSlide ? "32px" : "10px",
                height: "10px",
                borderRadius: "5px",
                border: "none",
                background:
                  idx === currentSlide ? "#2563eb" : "rgba(255, 255, 255, 0.2)",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}