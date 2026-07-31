"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FiMenu, FiX, FiGithub } from "react-icons/fi";
import { HiOutlineRocketLaunch } from "react-icons/hi2";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsMobileMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        padding: isScrolled ? "12px 0" : "20px 0",
        background: isScrolled
          ? "rgba(6, 11, 24, 0.85)"
          : "transparent",
        backdropFilter: isScrolled ? "blur(20px)" : "none",
        borderBottom: isScrolled
          ? "1px solid rgba(59, 130, 246, 0.1)"
          : "none",
        transition: "all 0.3s ease",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            textDecoration: "none",
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
            style={{
              fontSize: "1.4rem",
              fontWeight: 700,
              letterSpacing: "-0.5px",
            }}
            className="gradient-text"
          >
            KINETIX
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
          className="hidden md:flex"
        >
          <NavLink href="/" label="Home" />
          <NavLink href="/campaigns" label="Explore Campaigns" />
          <NavLink href="/login" label="Login" />
          <NavLink href="/register" label="Register" />
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
            style={{
              marginLeft: "8px",
              padding: "10px 20px",
              fontSize: "0.85rem",
            }}
          >
            <FiGithub size={16} />
            Join as Developer
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden"
          style={{
            background: "rgba(59, 130, 246, 0.1)",
            border: "1px solid rgba(59, 130, 246, 0.2)",
            borderRadius: "10px",
            padding: "10px",
            color: "#60a5fa",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        style={{
          position: "absolute",
          top: "100%",
          left: 0,
          right: 0,
          background: "rgba(6, 11, 24, 0.95)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(59, 130, 246, 0.1)",
          padding: isMobileMenuOpen ? "20px 24px" : "0 24px",
          maxHeight: isMobileMenuOpen ? "400px" : "0",
          overflow: "hidden",
          transition: "all 0.3s ease",
          display: "flex",
          flexDirection: "column",
          gap: "4px",
        }}
        className="md:hidden"
      >
        <MobileNavLink href="/" label="Home" onClick={() => setIsMobileMenuOpen(false)} />
        <MobileNavLink href="/campaigns" label="Explore Campaigns" onClick={() => setIsMobileMenuOpen(false)} />
        <MobileNavLink href="/login" label="Login" onClick={() => setIsMobileMenuOpen(false)} />
        <MobileNavLink href="/register" label="Register" onClick={() => setIsMobileMenuOpen(false)} />
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary"
          style={{
            marginTop: "8px",
            justifyContent: "center",
            padding: "12px 20px",
            fontSize: "0.9rem",
          }}
        >
          <FiGithub size={16} />
          Join as Developer
        </a>
      </div>
    </nav>
  );
}

function NavLink({ href, label }) {
  return (
    <Link
      href={href}
      style={{
        color: "#94a3b8",
        textDecoration: "none",
        fontSize: "0.9rem",
        fontWeight: 500,
        padding: "8px 16px",
        borderRadius: "8px",
        transition: "all 0.2s ease",
      }}
      onMouseEnter={(e) => {
        e.target.style.color = "#e2e8f0";
        e.target.style.background = "rgba(59, 130, 246, 0.08)";
      }}
      onMouseLeave={(e) => {
        e.target.style.color = "#94a3b8";
        e.target.style.background = "transparent";
      }}
    >
      {label}
    </Link>
  );
}

function MobileNavLink({ href, label, onClick }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      style={{
        color: "#94a3b8",
        textDecoration: "none",
        fontSize: "1rem",
        fontWeight: 500,
        padding: "14px 16px",
        borderRadius: "10px",
        transition: "all 0.2s ease",
        display: "block",
      }}
      onMouseEnter={(e) => {
        e.target.style.color = "#e2e8f0";
        e.target.style.background = "rgba(59, 130, 246, 0.08)";
      }}
      onMouseLeave={(e) => {
        e.target.style.color = "#94a3b8";
        e.target.style.background = "transparent";
      }}
    >
      {label}
    </Link>
  );
}
