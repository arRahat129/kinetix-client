"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "@/lib/auth-client";
import { FaEye, FaEyeSlash, FaGoogle, FaEnvelope, FaLock, FaArrowRight } from "react-icons/fa";

export default function SignInPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get("redirectTo") || searchParams.get("callbackURL") || "/dashboard";

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // Regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!email || !password) {
            setError("Please fill in all required fields.");
            return;
        }

        if (!emailRegex.test(email)) {
            setError("Please enter a valid email address.");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }

        setLoading(true);
        try {
            const res = await signIn.email({
                email,
                password,
                callbackURL: redirectTo
            });

            if (res?.error) {
                setError(res.error.message || "Invalid credentials. Please try again.");
            } else {
                if (res?.data?.token) {
                    localStorage.setItem("access-token", res.data.token);
                }
                router.push(redirectTo);
            }
        } catch (err) {
            setError(err.message || "Something went wrong during sign in.");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            await signIn.social({
                provider: "google",
                callbackURL: redirectTo
            });
        } catch (err) {
            setError("Google sign-in failed. Please try again.");
        }
    };

    return (
        <div className="bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-blue-500/5 dark:shadow-blue-950/20 backdrop-blur-xl transition-colors duration-300">
            <div className="text-center mb-6">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Welcome Back</h1>
                <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1">Sign in to manage campaigns and contributions</p>
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-600 dark:text-red-400 text-xs text-center font-medium">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                    <div className="relative">
                        <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-sm" />
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="name@example.com"
                            className="w-full bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Password</label>
                    <div className="relative">
                        <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-sm" />
                        <input
                            type={showPassword ? "text" : "password"}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-10 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 text-sm focus:outline-none"
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 px-4 rounded-xl text-sm transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    {loading ? "Signing In..." : <><span>Sign In</span><FaArrowRight className="text-xs" /></>}
                </button>
            </form>

            <div className="relative my-6 text-center">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
                </div>
                <span className="relative bg-white dark:bg-slate-900 px-3 text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wider font-semibold">
                    Or continue with
                </span>
            </div>

            <button
                type="button"
                onClick={handleGoogleSignIn}
                className="w-full bg-slate-100 dark:bg-slate-950 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-800 dark:text-white font-medium py-2.5 px-4 rounded-xl text-sm border border-slate-200 dark:border-slate-800 flex items-center justify-center gap-2 transition-all"
            >
                <FaGoogle className="text-red-500" />
                <span>Google</span>
            </button>

            {/* Switch to SignUp option */}
            <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-800/80 text-center">
                <p className="text-xs text-slate-600 dark:text-slate-400">
                    Don&apos;t have an account?{" "}
                    <Link 
                        href={`/auth/signup${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''}`} 
                        className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                    >
                        Create an Account
                    </Link>
                </p>
            </div>
        </div>
    );
}