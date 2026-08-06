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
    <footer className="relative bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 transition-colors duration-300 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div>
            <Link href="/" className="flex items-center gap-2.5 no-underline mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-xl text-white shadow-sm shrink-0">
                <HiOutlineRocketLaunch color="white" size={22} />
              </div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-500 via-cyan-500 to-indigo-500 bg-clip-text text-transparent">
                KINETIX
              </span>
            </Link>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed max-w-xs">
              Empowering creators and innovators to bring their ideas to life
              through community-powered crowdfunding.
            </p>

            {/* Social Icons */}
            <div className="flex gap-3 mt-6">
              <SocialIcon href="https://www.linkedin.com/in/mohammad-ashikur-rahman-rahat/" icon={<FiLinkedin size={18} />} />
              <SocialIcon href="https://github.com/arRahat129" icon={<FiGithub size={18} />} />
              <SocialIcon href="https://x.com/A_R_Rahat" icon={<FiTwitter size={18} />} />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-slate-900 dark:text-white text-xs font-bold uppercase tracking-wider mb-5">
              Quick Links
            </h4>
            <div className="flex flex-col gap-3">
              <FooterLink href="/" label="Home" />
              <FooterLink href="/campaigns" label="Explore Campaigns" />
              <FooterLink href="/auth/signup" label="Start a Campaign" />
              <FooterLink href="/auth/signin" label="Sign In" />
            </div>
          </div>

          {/* For Creators */}
          <div>
            <h4 className="text-slate-900 dark:text-white text-xs font-bold uppercase tracking-wider mb-5">
              For Creators
            </h4>
            <div className="flex flex-col gap-3">
              <FooterLink href="/auth/signup" label="Launch Your Campaign" />
              <FooterLink href="#how-it-works" label="How It Works" />
              <FooterLink href="#categories" label="Campaign Categories" />
              <FooterLink href="#" label="Creator Resources" />
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-slate-900 dark:text-white text-xs font-bold uppercase tracking-wider mb-5">
              Get in Touch
            </h4>
            <div className="flex flex-col gap-3.5">
              <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300 text-sm">
                <FiMail size={16} className="text-blue-500" />
                <span><Link href="mailto:[rahashik129@gmail.com]">rahashik129@gmail.com</Link></span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
                Have a question or need help? We are here for you 24/7.
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-slate-200 dark:bg-slate-800 mb-6" />

        {/* Bottom Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-slate-500 dark:text-slate-400 text-xs">
            © {currentYear} KINETIX. All rights reserved.
          </p>
          <p className="text-slate-500 dark:text-slate-400 text-xs flex items-center gap-1">
            <span>Built with</span>
            <FiHeart size={14} className="text-rose-500 fill-rose-500" />
            <span>by Rahat</span>
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
      className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-300 dark:hover:border-blue-700 transition duration-200 no-underline hover:-translate-y-0.5"
    >
      {icon}
    </a>
  );
}

function FooterLink({ href, label }) {
  return (
    <Link
      href={href}
      className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-all duration-200 no-underline hover:translate-x-1"
    >
      {label}
    </Link>
  );
}
