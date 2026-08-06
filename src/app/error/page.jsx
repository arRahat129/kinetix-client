'use client';

import Link from 'next/link';
import { FiAlertTriangle, FiHome, FiRefreshCw } from 'react-icons/fi';
import { useEffect, useState } from 'react';

export default function ErrorPage() {
    const [dots, setDots] = useState('');

    // Animated dots for dramatic effect
    useEffect(() => {
        const interval = setInterval(() => {
            setDots(prev => prev.length >= 3 ? '' : prev + '.');
        }, 500);
        return () => clearInterval(interval);
    }, []);

    const handleRetry = () => {
        window.location.reload();
    };

    return (
        <div className="min-h-screen bg-[#060b18] flex items-center justify-center px-4 relative overflow-hidden">
            {/* Ambient background glows */}
            <div className="absolute top-[-15%] left-[50%] -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-blue-700/10 blur-[130px] pointer-events-none" />
            <div className="absolute bottom-[-15%] left-[-10%] w-[400px] h-[400px] rounded-full bg-blue-900/20 blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[-15%] right-[-10%] w-[400px] h-[400px] rounded-full bg-sky-800/15 blur-[100px] pointer-events-none" />

            {/* Subtle noise texture */}
            <div
                className="absolute inset-0 opacity-[0.015] pointer-events-none"
                style={{
                    backgroundImage: 'radial-gradient(circle, #3b82f6 1px, transparent 1px)',
                    backgroundSize: '30px 30px'
                }}
            />

            <div className="relative z-10 max-w-lg w-full text-center">
                {/* Icon badge with warning pulse */}
                <div className="flex justify-center mb-8">
                    <div className="relative">
                        <div className="w-28 h-28 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shadow-xl shadow-blue-500/10 rotate-3">
                            <FiAlertTriangle className="w-12 h-12 text-blue-300" />
                        </div>
                        <div className="absolute inset-0 rounded-2xl border-2 border-blue-400/20 animate-ping rotate-3" />
                    </div>
                </div>

                {/* Code */}
                <p className="text-sm font-semibold tracking-[0.3em] text-blue-400/70 uppercase mb-3">
                    System Error
                </p>

                {/* Heading */}
                <h1 className="text-5xl font-bold text-white mb-4 leading-tight">
                    Something broke
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-sky-400 text-2xl mt-1 font-mono font-medium">
                        Reloading{dots}
                    </span>
                </h1>

                {/* Terminal-style error box */}
                <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4 mb-8 font-mono text-xs text-left mx-auto max-w-xs">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                        <span className="ml-2 text-slate-500 text-[10px]">error.log</span>
                    </div>
                    <p className="text-blue-300/70">{'>'} <span className="text-slate-400">status:</span> <span className="text-red-400">500</span></p>
                    <p className="text-blue-300/70">{'>'} <span className="text-slate-400">type:</span> <span className="text-amber-400">InternalServerError</span></p>
                    <p className="text-blue-300/70">{'>'} <span className="text-slate-400">message:</span> <span className="text-slate-300">Unexpected error occurred</span></p>
                </div>

                {/* Description */}
                <p className="text-slate-400 text-base leading-relaxed mb-8 max-w-sm mx-auto">
                    An unexpected error occurred on our end. Our team has been notified. Try refreshing the page or head back home.
                </p>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button
                        onClick={handleRetry}
                        className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-sky-600 text-white font-semibold text-sm shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105 transition-all duration-200 cursor-pointer"
                    >
                        <FiRefreshCw className="w-4 h-4" />
                        Try Again
                    </button>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 font-semibold text-sm hover:bg-white/10 hover:border-blue-500/30 hover:text-white transition-all duration-200"
                    >
                        <FiHome className="w-4 h-4" />
                        Go Home
                    </Link>
                </div>

                {/* Footer note */}
                <div className="mt-14 pt-8 border-t border-white/5">
                    <p className="text-slate-600 text-xs">
                        Persistent issue?{' '}
                        <span className="text-blue-400 cursor-pointer hover:text-blue-300 transition-colors">
                            Contact support
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
}
