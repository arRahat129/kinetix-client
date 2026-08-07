"use client";

import { useState, Suspense } from 'react';
import { useSession } from '@/lib/auth-client';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiZap, FiShield, FiCreditCard, FiArrowRight } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { Button, Card } from '@heroui/react';
import { FaHandSparkles } from 'react-icons/fa';

const PACKAGES = [
    {
        id: 1,
        credits: 100,
        price: 10,
        badge: 'Starter',
        priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_100 || '',
        popular: false,
        features: ['100 Platform Credits', 'Instant Credit Delivery', 'Supports Any Campaign', 'Standard Support']
    },
    {
        id: 2,
        credits: 300,
        price: 25,
        badge: 'Most Popular',
        priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_300 || '',
        popular: true,
        features: ['300 Platform Credits', '20 Bonus Credits Value', 'Instant Credit Delivery', 'Priority Campaign Perks']
    },
    {
        id: 3,
        credits: 800,
        price: 60,
        badge: 'Pro Supporter',
        priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_800 || '',
        popular: false,
        features: ['800 Platform Credits', 'Save $20 vs Standard', 'Instant Credit Delivery', 'Exclusive Supporter Badge']
    },
    {
        id: 4,
        credits: 1500,
        price: 110,
        badge: 'Ultimate Pack',
        priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_1500 || '',
        popular: false,
        features: ['1500 Platform Credits', 'Maximum Bonus Savings', 'Instant Credit Delivery', 'VIP Platform Status']
    },
];

function PurchaseCreditContent() {
    const { data: session } = useSession();
    const user = session?.user;
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get('redirectTo') || '/dashboard';

    const [loadingId, setLoadingId] = useState(null);

    const handleCheckout = async (pkg) => {
        if (!user?.email) {
            toast.error('Please log in to purchase credits.');
            return;
        }

        setLoadingId(pkg.id);
        try {
            const res = await fetch('/api/checkout_sessions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: pkg.price,
                    credits: pkg.credits,
                    priceId: pkg.priceId,
                    userEmail: user.email,
                    userId: user.id || '',
                    userName: user.name || 'Supporter',
                    userImage: user.image || '',
                    redirectTo,
                }),
            });

            const data = await res.json();
            if (data.url) {
                window.location.assign(data.url);
            } else {
                throw new Error(data.error || 'Failed to initiate Stripe checkout');
            }
        } catch (err) {
            console.error('Checkout Error:', err);
            toast.error(err.message || 'Something went wrong. Please try again.');
        } finally {
            setLoadingId(null);
        }
    };

    return (
        <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 text-slate-900 dark:text-slate-100 transition-colors">
            <div className="max-w-6xl mx-auto space-y-10">

                {/* Header */}
                <div className="text-center space-y-3">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-600 dark:text-primary-400 text-xs font-semibold uppercase tracking-wider">
                        <FaHandSparkles /> Power Your Support
                    </div>
                    <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 dark:from-blue-400 dark:via-indigo-400 dark:to-violet-400 bg-clip-text text-transparent">
                        Purchase Platform Credits
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto text-sm sm:text-base">
                        Select a credit package below to back innovative projects, empower creators, and unlock exclusive rewards.
                    </p>
                </div>

                {/* Security info banner */}
                <div className="flex flex-wrap items-center justify-center gap-6 p-4 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 shadow-sm text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                    <span className="flex items-center gap-2 font-medium">
                        <FiShield className="text-emerald-500 text-base" /> 256-bit Stripe Encryption
                    </span>
                    <span className="flex items-center gap-2 font-medium">
                        <FiZap className="text-amber-500 text-base" /> Instant Credit Delivery
                    </span>
                    <span className="flex items-center gap-2 font-medium">
                        <FiCreditCard className="text-blue-500 text-base" /> Cards Accepted
                    </span>
                </div>

                {/* Pricing Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {PACKAGES.map((pkg, idx) => (
                        <motion.div
                            key={pkg.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: idx * 0.1 }}
                            className="h-full flex"
                        >
                            <Card
                                className={`w-full flex flex-col justify-between p-6 rounded-3xl relative overflow-hidden transition-all duration-300 ${pkg.popular
                                    ? 'bg-gradient-to-b from-primary-500/10 via-indigo-500/5 to-transparent border-2 border-primary-500 shadow-xl shadow-primary-500/10 dark:bg-slate-900/90'
                                    : 'bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-md hover:shadow-xl hover:border-slate-300 dark:hover:border-slate-700'
                                    }`}
                            >
                                {pkg.popular && (
                                    <div className="absolute top-0 right-0">
                                        <span className="px-4 py-1.5 bg-gradient-to-r from-primary-600 to-indigo-600 text-white font-bold text-[10px] uppercase tracking-wider rounded-bl-xl shadow-md">
                                            {pkg.badge}
                                        </span>
                                    </div>
                                )}

                                <div>
                                    {!pkg.popular && (
                                        <span className="inline-block px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-[10px] uppercase tracking-wider rounded-full mb-3">
                                            {pkg.badge}
                                        </span>
                                    )}

                                    <div className="mt-2 space-y-1">
                                        <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white">
                                            {pkg.credits.toLocaleString()}{' '}
                                            <span className="text-base font-semibold text-slate-500">Credits</span>
                                        </h3>
                                        <div className="flex items-baseline gap-1 pt-1">
                                            <span className="text-4xl font-extrabold text-primary-600 dark:text-primary-400">${pkg.price}</span>
                                            <span className="text-xs text-slate-500 dark:text-slate-400">USD</span>
                                        </div>
                                    </div>

                                    <div className="my-6 border-t border-slate-100 dark:border-slate-800 pt-5 space-y-2.5">
                                        {pkg.features.map((feat, fIdx) => (
                                            <div key={fIdx} className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-300">
                                                <FiCheckCircle className="text-emerald-500 shrink-0 text-sm" />
                                                <span>{feat}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <Button
                                    onPress={() => handleCheckout(pkg)}
                                    isLoading={loadingId === pkg.id}
                                    isDisabled={loadingId !== null}
                                    color={pkg.popular ? "primary" : "default"}
                                    size="lg"
                                    className={`w-full font-bold rounded-2xl shadow-md flex items-center justify-center gap-2 transition-all ${pkg.popular
                                        ? 'bg-gradient-to-r from-primary-600 to-indigo-600 text-white hover:opacity-95'
                                        : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90'
                                        }`}
                                >
                                    {loadingId === pkg.id ? 'Redirecting to Stripe...' : (
                                        <>
                                            <span>Buy Now</span>
                                            <FiArrowRight />
                                        </>
                                    )}
                                </Button>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default function PurchaseCreditPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen flex items-center justify-center p-4">
                    <div className="w-12 h-12 rounded-full border-4 border-primary-500/30 border-t-primary-500 animate-spin" />
                </div>
            }
        >
            <PurchaseCreditContent />
        </Suspense>
    );
}