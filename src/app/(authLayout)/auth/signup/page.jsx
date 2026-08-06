"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { signUp, signIn } from "@/lib/auth-client";
import { uploadToImgBB } from "@/lib/imgbb";
import { FaEye, FaEyeSlash, FaGoogle, FaEnvelope, FaLock, FaUser, FaCloudUploadAlt, FaArrowRight, FaIdBadge, FaCoins, FaTrash } from "react-icons/fa";

function SignUpForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get("redirectTo") || searchParams.get("callbackURL") || "/dashboard";

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [role, setRole] = useState("Supporter");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [uploadingImage, setUploadingImage] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const nameRegex = /^[a-zA-Z\s]{2,50}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,16}$/;

    const handleFileUpload = async (file) => {
        if (!file) return;
        setUploadingImage(true);
        setError("");
        try {
            const url = await uploadToImgBB(file);
            setImageUrl(url);
        } catch (err) {
            setError(err.message || "Image upload failed.");
        } finally {
            setUploadingImage(false);
        }
    };

    const handlePaste = async (e) => {
        const items = e.clipboardData?.items;
        if (!items) return;
        for (const item of items) {
            if (item.type.indexOf("image") !== -1) {
                const blob = item.getAsFile();
                if (blob) {
                    await handleFileUpload(blob);
                    break;
                }
            }
        }
    };

    const handleRemoveImage = () => {
        setImageUrl("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!name || !nameRegex.test(name.trim())) {
            setError("Please enter a valid name (2-50 characters, letters only).");
            return;
        }

        if (!email || !emailRegex.test(email.trim())) {
            setError("Please enter a valid email address.");
            return;
        }

        if (!passwordRegex.test(password)) {
            setError("Password must be 8-16 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);
        try {
            const defaultCredits = role === "Creator" ? 20 : 50;
            const res = await signUp.email({
                email,
                password,
                name,
                image: imageUrl,
                role,
                credits: defaultCredits,
            });

            if (res?.error) {
                setError(res.error.message || "Registration failed.");
            } else {
                if (res?.data?.token) {
                    localStorage.setItem("access-token", res.data.token);
                }
                router.push(redirectTo);
            }
        } catch (err) {
            setError(err.message || "Something went wrong during sign up.");
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

    const currentCredits = role === "Creator" ? 20 : 50;

    return (
        <div className="bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-blue-500/5 dark:shadow-blue-950/20 backdrop-blur-xl transition-colors duration-300">
            <div className="text-center mb-5">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Create Account</h1>
                <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1">Join KINETIX crowdfunding community</p>

                <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-semibold">
                    <FaCoins className="text-amber-500" />
                    <span>Bonus Gift: <strong>{currentCredits} Credits</strong> upon registration!</span>
                </div>
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-600 dark:text-red-400 text-xs text-center font-medium">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
                <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                    <div className="relative">
                        <FaUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-sm" />
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="John Doe"
                            className="w-full bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                        />
                    </div>
                </div>

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
                            className="w-full bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Account Role</label>
                    <div className="relative">
                        <FaIdBadge className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-sm" />
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                        >
                            <option value="Supporter" className="bg-white dark:bg-slate-900">Supporter (50 Free Credits)</option>
                            <option value="Creator" className="bg-white dark:bg-slate-900">Creator (20 Free Credits)</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Profile Image (URL or Upload / Paste)
                    </label>

                    {imageUrl ? (
                        <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                            <div className="flex items-center gap-3">
                                <div className="relative w-10 h-10 rounded-full overflow-hidden border border-blue-500">
                                    <Image
                                        src={imageUrl}
                                        alt="Profile preview"
                                        fill
                                        className="object-cover"
                                        unoptimized
                                    />
                                </div>
                                <span className="text-xs text-slate-600 dark:text-slate-300 truncate max-w-[180px]">
                                    Image uploaded
                                </span>
                            </div>
                            <button
                                type="button"
                                onClick={handleRemoveImage}
                                className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors"
                                title="Remove image"
                            >
                                <FaTrash className="text-sm" />
                            </button>
                        </div>
                    ) : (
                        <div className="flex gap-2 items-center">
                            <div className="relative flex-1">
                                <input
                                    type="url"
                                    value={imageUrl}
                                    onChange={(e) => setImageUrl(e.target.value)}
                                    onPaste={handlePaste}
                                    placeholder="Paste image URL or image clip..."
                                    className="w-full bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all"
                                />
                            </div>
                            <label className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs px-3 py-2.5 rounded-xl cursor-pointer flex items-center gap-1.5 transition-colors border border-slate-200 dark:border-slate-700 font-medium">
                                <FaCloudUploadAlt className="text-blue-600 dark:text-blue-400 text-sm" />
                                <span>{uploadingImage ? "Uploading..." : "Upload"}</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => handleFileUpload(e.target.files[0])}
                                />
                            </label>
                        </div>
                    )}
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
                            className="w-full bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-10 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 text-sm focus:outline-none"
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                    {password && (
                        <div className="mt-2 grid grid-cols-2 gap-1 text-[11px]">
                            <span className={password.length >= 8 && password.length <= 16 ? "text-emerald-500" : "text-slate-400"}>
                                ✓ 8-16 Characters
                            </span>
                            <span className={/[A-Z]/.test(password) ? "text-emerald-500" : "text-slate-400"}>
                                ✓ 1 Uppercase
                            </span>
                            <span className={/[a-z]/.test(password) ? "text-emerald-500" : "text-slate-400"}>
                                ✓ 1 Lowercase
                            </span>
                            <span className={/\d/.test(password) ? "text-emerald-500" : "text-slate-400"}>
                                ✓ 1 Number
                            </span>
                            <span className={/[^a-zA-Z0-9]/.test(password) ? "text-emerald-500" : "text-slate-400"}>
                                ✓ 1 Special Character
                            </span>
                        </div>
                    )}
                </div>

                <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Confirm Password</label>
                    <div className="relative">
                        <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-sm" />
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-10 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 text-sm focus:outline-none"
                        >
                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading || uploadingImage}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 px-4 rounded-xl text-sm transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
                >
                    {loading ? "Creating Account..." : <><span>Sign Up</span><FaArrowRight className="text-xs" /></>}
                </button>
            </form>

            <div className="relative my-5 text-center">
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
                className="w-full bg-blue-100 dark:bg-blue-950 hover:bg-blue-200 dark:hover:bg-blue-800 text-slate-800 dark:text-white font-medium py-2.5 px-4 rounded-xl text-sm border border-blue-200 dark:border-blue-800 flex items-center justify-center gap-2 transition-all"
            >
                <FaGoogle className="text-blue-500" />
                <span>Google</span>
            </button>

            <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-800/80 text-center">
                <p className="text-xs text-slate-600 dark:text-slate-400">
                    Already have an account?{" "}
                    <Link
                        href={`/auth/signin${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''}`}
                        className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                    >
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default function SignUpPage() {
    return (
        <Suspense fallback={
            <div className="bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-center">
                <p className="text-slate-400 text-sm">Loading sign up...</p>
            </div>
        }>
            <SignUpForm />
        </Suspense>
    );
}