"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    FiSearch, FiFilter, FiRefreshCw, FiChevronLeft, FiChevronRight,
    FiGrid, FiList, FiX
} from "react-icons/fi";
import { HiOutlineSparkles, HiOutlineRocketLaunch } from "react-icons/hi2";
import { getApprovedCampaigns } from "@/lib/api/campaign";
import CampaignCard from "@/components/campaigns/CampaignCard";
import { SlidersHorizontal } from "lucide-react";

const CATEGORIES = [
    "All", "Technology", "Art", "Community", "Health",
    "Education", "Environment", "Science", "Food",
];

const SORT_OPTIONS = [
    { value: "createdAt-desc", label: "Newest First" },
    { value: "createdAt-asc", label: "Oldest First" },
    { value: "funding_goal-desc", label: "Goal: High → Low" },
    { value: "funding_goal-asc", label: "Goal: Low → High" },
    { value: "deadline-asc", label: "Ending Soon" },
];

function CampaignCardSkeleton() {
    return (
        <div className="h-[380px] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 animate-pulse">
            <div className="h-48 bg-slate-200 dark:bg-slate-800" />
            <div className="p-5 space-y-3">
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-lg w-4/5" />
                <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-lg w-3/5" />
                <div className="h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full mt-4" />
                <div className="flex justify-between mt-2">
                    <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-lg w-1/3" />
                    <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-lg w-1/4" />
                </div>
            </div>
        </div>
    );
}

export default function ExploreCampaignsPage() {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [category, setCategory] = useState("");
    const [sortValue, setSortValue] = useState("createdAt-desc");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [showFilters, setShowFilters] = useState(false);
    const [minGoal, setMinGoal] = useState("");
    const [maxGoal, setMaxGoal] = useState("");
    const searchRef = useRef(null);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1);
        }, 450);
        return () => clearTimeout(timer);
    }, [search]);

    const [sortBy, sortOrder] = sortValue.split("-");

    const fetchCampaigns = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getApprovedCampaigns({
                search: debouncedSearch,
                category: category === "All" ? "" : category,
                minGoal,
                maxGoal,
                sortBy,
                sortOrder,
                page,
                limit: 9,
            });
            if (res?.data) {
                setCampaigns(res.data);
                setTotalPages(res.totalPages || 1);
                setTotal(res.total || 0);
            }
        } catch (err) {
            console.error("Failed to fetch campaigns:", err);
        } finally {
            setLoading(false);
        }
    }, [debouncedSearch, category, minGoal, maxGoal, sortBy, sortOrder, page]);

    useEffect(() => {
        fetchCampaigns();
    }, [fetchCampaigns]);

    const handleCategoryClick = (cat) => {
        setCategory(cat === "All" ? "" : cat);
        setPage(1);
    };

    const handleClearFilters = () => {
        setSearch("");
        setDebouncedSearch("");
        setCategory("");
        setSortValue("createdAt-desc");
        setMinGoal("");
        setMaxGoal("");
        setPage(1);
    };

    const activeFiltersCount = [
        debouncedSearch,
        category && category !== "All",
        minGoal,
        maxGoal,
        sortValue !== "createdAt-desc",
    ].filter(Boolean).length;

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-[#060b18] transition-colors">

            {/* ── Hero Banner ─────────────────────────────── */}
            <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 py-20 px-6">
                {/* decorative blobs */}
                <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/5 blur-3xl pointer-events-none" />
                <div className="absolute -bottom-16 -left-16 w-72 h-72 rounded-full bg-white/5 blur-3xl pointer-events-none" />

                <div className="relative max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 border border-white/20 text-white text-xs font-semibold uppercase tracking-wider mb-5">
                            <HiOutlineSparkles size={14} />
                            Explore All Campaigns
                        </div>
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight mb-4">
                            Discover &amp;{" "}
                            <span className="text-yellow-300">Support</span>
                        </h1>
                        <p className="text-white/75 text-base sm:text-lg max-w-xl mx-auto">
                            Browse approved campaigns from visionary creators. Find something that
                            inspires you and make a difference.
                        </p>
                    </motion.div>

                    {/* Big Search */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.15 }}
                        className="mt-8 relative max-w-xl mx-auto"
                    >
                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                            ref={searchRef}
                            type="text"
                            placeholder="Search campaigns…"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            id="campaign-search"
                            className="w-full pl-12 pr-12 py-3.5 rounded-2xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-white/30 dark:border-slate-700 shadow-xl outline-none focus:ring-2 focus:ring-white/50 text-sm font-medium placeholder:text-slate-400"
                        />
                        {search && (
                            <button
                                onClick={() => setSearch("")}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >
                                <FiX size={16} />
                            </button>
                        )}
                    </motion.div>
                </div>
            </section>

            {/* ── Category Tabs ────────────────────────────── */}
            <div className="sticky top-0 z-20 bg-white/90 dark:bg-[#060b18]/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="flex items-center gap-2 overflow-x-auto py-3 scrollbar-hide">
                        {CATEGORIES.map((cat) => {
                            const active = cat === "All" ? !category || category === "" : category === cat;
                            return (
                                <button
                                    key={cat}
                                    onClick={() => handleCategoryClick(cat)}
                                    className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${active
                                            ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/25"
                                            : "bg-transparent border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400"
                                        }`}
                                >
                                    {cat}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* ── Controls Bar ─────────────────────────────── */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    {/* Result count */}
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        {loading ? (
                            <span className="inline-block w-24 h-4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                        ) : (
                            <>
                                Showing <span className="font-semibold text-slate-900 dark:text-white">{campaigns.length}</span>{" "}
                                of <span className="font-semibold text-slate-900 dark:text-white">{total}</span> campaigns
                            </>
                        )}
                    </p>

                    <div className="flex items-center gap-2">
                        {/* Advanced Filter Toggle */}
                        <button
                            onClick={() => setShowFilters((v) => !v)}
                            className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${showFilters || activeFiltersCount > 0
                                    ? "bg-blue-600 border-blue-600 text-white"
                                    : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-blue-400"
                                }`}
                        >
                            <SlidersHorizontal size={13} />
                            Filters
                            {activeFiltersCount > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
                                    {activeFiltersCount}
                                </span>
                            )}
                        </button>

                        {/* Sort */}
                        <select
                            value={sortValue}
                            onChange={(e) => { setSortValue(e.target.value); setPage(1); }}
                            className="px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-blue-500/30 cursor-pointer appearance-none"
                        >
                            {SORT_OPTIONS.map((o) => (
                                <option key={o.value} value={o.value}>{o.label}</option>
                            ))}
                        </select>

                        {/* Refresh */}
                        <button
                            onClick={() => fetchCampaigns()}
                            title="Refresh"
                            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                            <FiRefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                        </button>
                    </div>
                </div>

                {/* Advanced Filters Panel */}
                <AnimatePresence>
                    {showFilters && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.25 }}
                            className="overflow-hidden"
                        >
                            <div className="mt-3 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 backdrop-blur-sm flex flex-wrap gap-4 items-end">
                                <div className="flex flex-col gap-1 min-w-[130px]">
                                    <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                        Min Goal (credits)
                                    </label>
                                    <input
                                        type="number"
                                        value={minGoal}
                                        onChange={(e) => { setMinGoal(e.target.value); setPage(1); }}
                                        placeholder="e.g. 1000"
                                        className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-blue-500/30"
                                    />
                                </div>
                                <div className="flex flex-col gap-1 min-w-[130px]">
                                    <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                        Max Goal (credits)
                                    </label>
                                    <input
                                        type="number"
                                        value={maxGoal}
                                        onChange={(e) => { setMaxGoal(e.target.value); setPage(1); }}
                                        placeholder="e.g. 50000"
                                        className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-blue-500/30"
                                    />
                                </div>
                                {activeFiltersCount > 0 && (
                                    <button
                                        onClick={handleClearFilters}
                                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
                                    >
                                        <FiX size={12} /> Clear All Filters
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* ── Campaign Grid ─────────────────────────────── */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array.from({ length: 9 }).map((_, i) => (
                            <CampaignCardSkeleton key={i} />
                        ))}
                    </div>
                ) : campaigns.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="py-24 flex flex-col items-center text-center gap-4"
                    >
                        <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                            <HiOutlineRocketLaunch className="w-9 h-9 text-slate-400" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 dark:text-white">No campaigns found</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs">
                            {debouncedSearch || category || minGoal || maxGoal
                                ? "Try adjusting your search or filters."
                                : "No approved campaigns available yet. Check back soon!"}
                        </p>
                        {activeFiltersCount > 0 && (
                            <button
                                onClick={handleClearFilters}
                                className="mt-2 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition"
                            >
                                Clear Filters
                            </button>
                        )}
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {campaigns.map((campaign, i) => (
                            <CampaignCard key={campaign._id} campaign={campaign} index={i} />
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {!loading && totalPages > 1 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="flex items-center justify-center gap-3 mt-12"
                    >
                        <button
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
                        >
                            <FiChevronLeft size={16} /> Previous
                        </button>

                        <div className="flex items-center gap-1">
                            {Array.from({ length: totalPages }, (_, i) => i + 1)
                                .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                                .reduce((acc, p, idx, arr) => {
                                    if (idx > 0 && p - arr[idx - 1] > 1) acc.push("...");
                                    acc.push(p);
                                    return acc;
                                }, [])
                                .map((p, i) =>
                                    p === "..." ? (
                                        <span key={`dot-${i}`} className="px-2 text-slate-400">…</span>
                                    ) : (
                                        <button
                                            key={p}
                                            onClick={() => setPage(p)}
                                            className={`w-9 h-9 rounded-xl text-sm font-semibold border transition-all ${page === p
                                                    ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/25"
                                                    : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:border-blue-400 hover:text-blue-600"
                                                }`}
                                        >
                                            {p}
                                        </button>
                                    )
                                )}
                        </div>

                        <button
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
                        >
                            Next <FiChevronRight size={16} />
                        </button>
                    </motion.div>
                )}
            </div>
        </main>
    );
}
