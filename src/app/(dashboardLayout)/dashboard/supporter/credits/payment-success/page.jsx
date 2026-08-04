"use client";

import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiArrowRight, FiZap, FiAlertCircle } from 'react-icons/fi';
import { Button, Card } from '@heroui/react';
import toast from 'react-hot-toast';
import { HiShieldCheck } from 'react-icons/hi2';

export default function PaymentSuccessPage() {
    const searchParams = useSearchParams();
    const sessionId = searchParams.get('session_id');
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [paymentData, setPaymentData] = useState(null);
    const [errorMsg, setErrorMsg] = useState('');
    const [countdown, setCountdown] = useState(5);
    const verifiedRef = useRef(false);

    useEffect(() => {
        if (!sessionId) {
            setErrorMsg('No session ID found in request.');
            setLoading(false);
            return;
        }

        if (verifiedRef.current) return;
        verifiedRef.current = true;

        fetch('/api/payments/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionId }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    setPaymentData(data);
                    toast.success(`Success! Added ${data.credits} credits to your account.`);
                } else {
                    setErrorMsg(data.error || 'Payment verification failed.');
                    toast.error(data.error || 'Verification failed.');
                }
            })
            .catch((err) => {
                console.error('Verify error:', err);
                setErrorMsg('An unexpected error occurred during verification.');
            })
            .finally(() => {
                setLoading(false);
            });
    }, [sessionId]);

    const targetRoute = paymentData?.redirectTo || '/dashboard';

    // Decrement countdown timer
    useEffect(() => {
        if (!paymentData || errorMsg) return;

        const timer = setInterval(() => {
            setCountdown((prev) => Math.max(0, prev - 1));
        }, 1000);

        return () => clearInterval(timer);
    }, [paymentData, errorMsg]);

    // Handle navigation when countdown reaches 0
    useEffect(() => {
        if (countdown === 0 && paymentData && !errorMsg) {
            router.push(targetRoute);
        }
    }, [countdown, paymentData, errorMsg, targetRoute, router]);

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4 sm:p-6 text-slate-900 dark:text-slate-100 transition-colors">
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="max-w-md w-full"
            >
                <Card className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200 dark:border-slate-800 shadow-2xl rounded-3xl p-6 sm:p-8 text-center space-y-6">

                    {loading ? (
                        <div className="py-12 space-y-4 flex flex-col items-center">
                            <div className="w-16 h-16 rounded-full border-4 border-primary-500/30 border-t-primary-500 animate-spin" />
                            <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                                Verifying your payment with Stripe...
                            </p>
                        </div>
                    ) : errorMsg ? (
                        <div className="py-6 space-y-4">
                            <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center mx-auto text-3xl">
                                <FiAlertCircle />
                            </div>
                            <h2 className="text-2xl font-bold text-rose-600 dark:text-rose-400">
                                Payment Verification Issue
                            </h2>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                {errorMsg}
                            </p>
                            <div className="pt-4 flex flex-col gap-2">
                                <Button
                                    color="primary"
                                    size="lg"
                                    onPress={() => router.push('/dashboard/supporter/credits')}
                                    className="w-full font-semibold rounded-xl"
                                >
                                    Try Purchasing Again
                                </Button>
                                <Button
                                    variant="flat"
                                    size="lg"
                                    onPress={() => router.push('/dashboard')}
                                    className="w-full font-semibold rounded-xl"
                                >
                                    Return to Dashboard
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Animated Success Badge */}
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                                className="w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center mx-auto text-4xl shadow-xl shadow-emerald-500/25"
                            >
                                <FiCheckCircle />
                            </motion.div>

                            <div className="space-y-2">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold uppercase tracking-wider">
                                    <HiShieldCheck /> Payment Completed
                                </span>
                                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                                    Credits Unlocked!
                                </h1>
                                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                                    Your account has been successfully credited and transaction recorded.
                                </p>
                            </div>

                            {/* Summary Card */}
                            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-3 text-left">
                                <div className="flex items-center justify-between text-xs sm:text-sm">
                                    <span className="text-slate-500 dark:text-slate-400">Credits Added</span>
                                    <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-base flex items-center gap-1">
                                        <FiZap /> +{paymentData.credits?.toLocaleString()} Credits
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-xs sm:text-sm pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                                    <span className="text-slate-500 dark:text-slate-400">Amount Paid</span>
                                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                                        ${paymentData.amount} USD
                                    </span>
                                </div>
                                {paymentData.email && (
                                    <div className="flex items-center justify-between text-xs sm:text-sm pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                                        <span className="text-slate-500 dark:text-slate-400">Account</span>
                                        <span className="font-mono text-xs text-slate-600 dark:text-slate-300 truncate max-w-[180px]">
                                            {paymentData.email}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="space-y-3 pt-2">
                                <Button
                                    color="primary"
                                    size="lg"
                                    onPress={() => router.push(targetRoute)}
                                    className="w-full font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
                                >
                                    <span>Proceed to Dashboard</span>
                                    <FiArrowRight />
                                </Button>

                                <p className="text-xs text-slate-400">
                                    Redirecting automatically in <span className="font-bold text-primary-500">{countdown}s</span>...
                                </p>
                            </div>
                        </>
                    )}

                </Card>
            </motion.div>
        </div>
    );
}