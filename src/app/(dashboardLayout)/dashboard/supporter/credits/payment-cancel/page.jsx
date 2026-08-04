"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiXCircle, FiRefreshCw, FiGrid } from 'react-icons/fi';
import { Button, Card } from '@heroui/react';

export default function PaymentCancelPage() {
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get('redirectTo') || '/dashboard';
    const router = useRouter();

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4 sm:p-6 text-slate-900 dark:text-slate-100 transition-colors">
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="max-w-md w-full"
            >
                <Card className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200 dark:border-slate-800 shadow-2xl rounded-3xl p-6 sm:p-8 text-center space-y-6">

                    {/* Icon Badge */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                        className="w-20 h-20 rounded-full bg-gradient-to-tr from-rose-500 to-amber-500 text-white flex items-center justify-center mx-auto text-4xl shadow-xl shadow-rose-500/25"
                    >
                        <FiXCircle />
                    </motion.div>

                    <div className="space-y-2">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-semibold uppercase tracking-wider">
                            Payment Cancelled
                        </span>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                            Checkout Was Cancelled
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                            No charges were processed. You can retry purchasing credits anytime to support your favorite campaigns.
                        </p>
                    </div>

                    {/* Action buttons */}
                    <div className="space-y-3 pt-2">
                        <Button
                            color="primary"
                            size="lg"
                            onPress={() => router.push('/dashboard/supporter/credits')}
                            className="w-full font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white rounded-xl shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
                        >
                            <FiRefreshCw />
                            <span>Retry Credit Purchase</span>
                        </Button>

                        <Button
                            variant="bordered"
                            size="lg"
                            onPress={() => router.push(redirectTo)}
                            className="w-full font-semibold border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-center gap-2"
                        >
                            <FiGrid />
                            <span>Return to Dashboard</span>
                        </Button>
                    </div>

                </Card>
            </motion.div>
        </div>
    );
}
