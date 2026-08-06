'use client';

import Link from 'next/link';
import { FiShield, FiHome, FiLogOut } from 'react-icons/fi';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';

export default function ForbiddenPage() {
    const router = useRouter();

    const handleSignOut = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push('/auth/signin');
                }
            }
        });
    };

    return (
        <div className="min-h-screen bg-[#060b18] flex items-center justify-center px-4 relative overflow-hidden">
            {/* Ambient background glows */}
            <div className="absolute top-[-20%] left-[50%] -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full bg-blue-500/10 blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full bg-violet-500/10 blur-[100px] pointer-events-none" />

            {/* Subtle grid */}
            <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                    backgroundImage: 'linear-gradient(#4f8ef7 1px, transparent 1px), linear-gradient(90deg, #4f8ef7 1px, transparent 1px)',
                    backgroundSize: '60px 60px'
                }}
            />

            <div className="relative z-10 max-w-lg w-full text-center">
                {/* Icon badge */}
                <div className="flex justify-center mb-8">
                    <div className="relative">
                        <div className="w-28 h-28 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shadow-lg shadow-indigo-500/10">
                            <FiShield className="w-12 h-12 text-indigo-400" />
                        </div>
                        {/* Orbiting dot */}
                        <div className="absolute inset-0 rounded-full border border-indigo-500/20 animate-spin [animation-duration:4s]">
                            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-indigo-400 shadow-md shadow-indigo-400/60" />
                        </div>
                    </div>
                </div>

                {/* Code */}
                <p className="text-sm font-semibold tracking-[0.3em] text-indigo-400/70 uppercase mb-3">
                    Error 403
                </p>

                {/* Heading */}
                <h1 className="text-5xl font-bold text-white mb-4 leading-tight">
                    Forbidden
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400 text-3xl mt-1">
                        Insufficient Permissions
                    </span>
                </h1>

                {/* Description */}
                <p className="text-slate-400 text-base leading-relaxed mb-10 max-w-sm mx-auto">
                    Your account doesn&apos;t have permission to access this resource. Try signing in with a different account.
                </p>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button
                        onClick={handleSignOut}
                        className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-105 transition-all duration-200 cursor-pointer"
                    >
                        <FiLogOut className="w-4 h-4" />
                        Sign Out
                    </button>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 font-semibold text-sm hover:bg-white/10 hover:border-indigo-500/30 hover:text-white transition-all duration-200"
                    >
                        <FiHome className="w-4 h-4" />
                        Go Home
                    </Link>
                </div>

                {/* Info note */}
                <div className="mt-14 pt-8 border-t border-white/5">
                    <p className="text-slate-600 text-xs">
                        If you believe this is a mistake, please contact{' '}
                        <span className="text-indigo-400">support</span>.
                    </p>
                </div>
            </div>
        </div>
    );
}
