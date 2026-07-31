"use client";

import Link from "next/link";
import { HiOutlineRocketLaunch } from "react-icons/hi2";
import {
  FiGithub,
  FiLinkedin,
  FiFacebook,
  FiTwitter,
  FiMail,
  FiHeart,
} from "react-icons/fi";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      style={{
        background: "linear-gradient(180deg, var(--color-background) 0%, #0a1020 100%)",
        borderTop: "1px solid var(--color-border)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Top glow effect */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "600px",
          height: "1px",
          background: "linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.5), transparent)",
        }}
      />

      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "60px 24px 30px",
        }}
      >
        {/* Main Footer Content */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "48px",
            marginBottom: "48px",
          }}
        >
          {/* Brand Column */}
          <div>
            <Link
              href="/"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                textDecoration: "none",
                marginBottom: "16px",
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, #3b82f6, #06b6d4)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "20px",
                }}
              >
                <HiOutlineRocketLaunch color="white" />
              </div>
              <span
                className="gradient-text"
                style={{ fontSize: "1.3rem", fontWeight: 700, letterSpacing: "-0.5px" }}
              >
                KINETIX
              </span>
            </Link>
            <p
              style={{
                color: "var(--color-text-secondary)",
                fontSize: "0.9rem",
                lineHeight: 1.7,
                maxWidth: "300px",
              }}
            >
              Empowering creators and innovators to bring their ideas to life
              through community-powered crowdfunding.
            </p>

            {/* Social Icons */}
            <div
              style={{
                display: "flex",
                gap: "12px",
                marginTop: "24px",
              }}
            >
              <SocialIcon href="https://linkedin.com" icon={<FiLinkedin size={18} />} />
              <SocialIcon href="https://github.com" icon={<FiGithub size={18} />} />
              <SocialIcon href="https://facebook.com" icon={<FiFacebook size={18} />} />
              <SocialIcon href="https://twitter.com" icon={<FiTwitter size={18} />} />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4
              style={{
                color: "var(--color-text-primary)",
                fontSize: "0.95rem",
                fontWeight: 600,
                marginBottom: "20px",
                letterSpacing: "0.5px",
                textTransform: "uppercase",
              }}
            >
              Quick Links
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <FooterLink href="/" label="Home" />
              <FooterLink href="/campaigns" label="Explore Campaigns" />
              <FooterLink href="/register" label="Start a Campaign" />
              <FooterLink href="/login" label="Sign In" />
            </div>
          </div>

          {/* For Creators */}
          <div>
            <h4
              style={{
                color: "var(--color-text-primary)",
                fontSize: "0.95rem",
                fontWeight: 600,
                marginBottom: "20px",
                letterSpacing: "0.5px",
                textTransform: "uppercase",
              }}
            >
              For Creators
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <FooterLink href="/register" label="Launch Your Campaign" />
              <FooterLink href="#how-it-works" label="How It Works" />
              <FooterLink href="#categories" label="Campaign Categories" />
              <FooterLink href="#" label="Creator Resources" />
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4
              style={{
                color: "var(--color-text-primary)",
                fontSize: "0.95rem",
                fontWeight: 600,
                marginBottom: "20px",
                letterSpacing: "0.5px",
                textTransform: "uppercase",
              }}
            >
              Get in Touch
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  color: "var(--color-text-secondary)",
                  fontSize: "0.9rem",
                }}
              >
                <FiMail size={16} style={{ color: "var(--color-primary-light)" }} />
                support@kinetix.com
              </div>
              <p
                style={{
                  color: "var(--color-text-secondary)",
                  fontSize: "0.85rem",
                  lineHeight: 1.6,
                }}
              >
                Have a question or need help? We are here for you 24/7.
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div
          style={{
            height: "1px",
            background: "linear-gradient(90deg, transparent, var(--color-border-light), transparent)",
            marginBottom: "24px",
          }}
        />

        {/* Bottom Bar */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <p
            style={{
              color: "var(--color-text-muted)",
              fontSize: "0.85rem",
            }}
          >
            © {currentYear} KINETIX. All rights reserved.
          </p>
          <p
            style={{
              color: "var(--color-text-muted)",
              fontSize: "0.85rem",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            Built with <FiHeart size={14} style={{ color: "#ef4444" }} /> by Rahat
          </p>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ href, icon }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        width: "40px",
        height: "40px",
        borderRadius: "10px",
        background: "rgba(59, 130, 246, 0.08)",
        border: "1px solid rgba(59, 130, 246, 0.15)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--color-text-secondary)",
        transition: "all 0.3s ease",
        textDecoration: "none",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "rgba(59, 130, 246, 0.15)";
        e.currentTarget.style.borderColor = "rgba(59, 130, 246, 0.3)";
        e.currentTarget.style.color = "#60a5fa";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "rgba(59, 130, 246, 0.08)";
        e.currentTarget.style.borderColor = "rgba(59, 130, 246, 0.15)";
        e.currentTarget.style.color = "var(--color-text-secondary)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {icon}
    </a>
  );
}

function FooterLink({ href, label }) {
  return (
    <Link
      href={href}
      style={{
        color: "var(--color-text-secondary)",
        textDecoration: "none",
        fontSize: "0.9rem",
        transition: "all 0.2s ease",
      }}
      onMouseEnter={(e) => {
        e.target.style.color = "#60a5fa";
        e.target.style.paddingLeft = "4px";
      }}
      onMouseLeave={(e) => {
        e.target.style.color = "var(--color-text-secondary)";
        e.target.style.paddingLeft = "0";
      }}
    >
      {label}
    </Link>
  );
}
