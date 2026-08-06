'use client';

import Link from 'next/link';
import { FiLock, FiHome, FiLogIn } from 'react-icons/fi';

export default function UnauthorizedPage() {
    return (
        <div className="min-h-screen bg-[#060b18] flex items-center justify-center px-4 relative overflow-hidden">
            {/* Ambient background glows */}
            <div className="absolute top-[-20%] left-[50%] -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full bg-cyan-500/10 blur-[100px] pointer-events-none" />

            <div className="relative z-10 max-w-lg w-full text-center">
                {/* Icon badge */}
                <div className="flex justify-center mb-8">
                    <div className="relative">
                        <div className="w-28 h-28 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shadow-lg shadow-blue-500/10">
                            <FiLock className="w-12 h-12 text-blue-400" />
                        </div>
                        <div className="absolute inset-0 rounded-full bg-blue-500/5 animate-ping" />
                    </div>
                </div>

                {/* Code */}
                <p className="text-sm font-semibold tracking-[0.3em] text-blue-400/70 uppercase mb-3">
                    Error 401
                </p>

                {/* Heading */}
                <h1 className="text-5xl font-bold text-white mb-4 leading-tight">
                    Unauthorized
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 text-3xl mt-1">
                        Access Denied
                    </span>
                </h1>

                {/* Description */}
                <p className="text-slate-400 text-base leading-relaxed mb-10 max-w-sm mx-auto">
                    You need to be signed in to access this page. Please log in with your account to continue.
                </p>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        href="/signin"
                        className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold text-sm shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105 transition-all duration-200"
                    >
                        <FiLogIn className="w-4 h-4" />
                        Sign In
                    </Link>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 font-semibold text-sm hover:bg-white/10 hover:border-blue-500/30 hover:text-white transition-all duration-200"
                    >
                        <FiHome className="w-4 h-4" />
                        Go Home
                    </Link>
                </div>

                {/* Divider line */}
                <div className="mt-14 pt-8 border-t border-white/5">
                    <p className="text-slate-600 text-xs">
                        Already have an account?{' '}
                        <Link href="/signin" className="text-blue-400 hover:text-blue-300 transition-colors">
                            Sign in here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
