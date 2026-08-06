'use client';

import Link from 'next/link';
import { FiCompass, FiHome, FiSearch } from 'react-icons/fi';

export default function NotFoundPage() {
    return (
        <div className="min-h-screen bg-[#060b18] flex items-center justify-center px-4 relative overflow-hidden">
            {/* Ambient background glows */}
            <div className="absolute top-[-20%] left-[50%] -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-cyan-600/10 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-5%] w-[350px] h-[350px] rounded-full bg-blue-500/10 blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-5%] w-[350px] h-[350px] rounded-full bg-sky-500/10 blur-[100px] pointer-events-none" />

            <div className="relative z-10 max-w-lg w-full text-center">
                {/* Big 404 number with glitch effect */}
                <div className="relative mb-4 select-none">
                    <p
                        className="text-[10rem] font-black leading-none text-transparent bg-clip-text bg-gradient-to-b from-blue-400/40 to-transparent"
                        aria-hidden="true"
                    >
                        404
                    </p>
                    <p className="absolute inset-0 text-[10rem] font-black leading-none text-transparent bg-clip-text bg-gradient-to-b from-cyan-300 to-blue-500 opacity-80 [text-shadow:0_0_80px_rgba(99,179,237,0.3)]">
                        404
                    </p>
                </div>

                {/* Icon badge */}
                <div className="flex justify-center mb-6 -mt-4">
                    <div className="w-20 h-20 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shadow-lg shadow-cyan-500/10">
                        <FiCompass className="w-9 h-9 text-cyan-400 animate-spin [animation-duration:8s]" />
                    </div>
                </div>

                {/* Code */}
                <p className="text-sm font-semibold tracking-[0.3em] text-cyan-400/70 uppercase mb-3">
                    Page Not Found
                </p>

                {/* Heading */}
                <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
                    Lost in the void
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 text-2xl mt-1 font-medium">
                        This page doesn&apos;t exist
                    </span>
                </h1>

                {/* Description */}
                <p className="text-slate-400 text-base leading-relaxed mb-10 max-w-sm mx-auto">
                    The page you&apos;re looking for has been moved, deleted, or never existed. Let&apos;s get you back on track.
                </p>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold text-sm shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-105 transition-all duration-200"
                    >
                        <FiHome className="w-4 h-4" />
                        Back to Home
                    </Link>
                    <Link
                        href="/campaigns"
                        className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 font-semibold text-sm hover:bg-white/10 hover:border-cyan-500/30 hover:text-white transition-all duration-200"
                    >
                        <FiSearch className="w-4 h-4" />
                        Browse Campaigns
                    </Link>
                </div>

                {/* Footer note */}
                <div className="mt-14 pt-8 border-t border-white/5">
                    <p className="text-slate-600 text-xs">
                        Tip: Double-check the URL or use the navigation menu to find what you&apos;re looking for.
                    </p>
                </div>
            </div>
        </div>
    );
}
