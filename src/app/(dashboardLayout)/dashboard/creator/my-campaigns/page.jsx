'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSession } from '@/lib/auth-client';
import { getMyCampaigns } from '@/lib/api/campaign';
import { updateCampaign, deleteCampaign } from '@/lib/actions/campaign';
import { CampaignTable } from '@/components/dashboard/creator-campaigns/CampaignTable';
import { CampaignCards } from '@/components/dashboard/creator-campaigns/CampaignCards';
import { CampaignModal } from '@/components/dashboard/creator-campaigns/CampaignModal';
import { FiSearch, FiFilter, FiRefreshCw, FiPlusCircle, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function MyCampaignsPage() {
    const { data: session } = useSession();
    const userId = session?.user?.id;
    // console.log(userId)
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Filters & Pagination state
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('');
    const [sortBy, setSortBy] = useState('deadline');
    const [sortOrder, setSortOrder] = useState('desc');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    // Modal State
    const [modalState, setModalState] = useState({
        isOpen: false,
        mode: null,
        campaign: null
    });

    const fetchCampaigns = useCallback(async () => {
        if (!userId) return;

        setLoading(true);
        try {
            const res = await getMyCampaigns({
                userId,
                search,
                status,
                sortBy,
                sortOrder,
                page,
                limit: 6
            });

            if (res?.data) {
                setCampaigns(res.data);
                setTotalPages(res.totalPages || 1);
                setTotalItems(res.total || 0);
            }
        } catch (error) {
            console.error('Failed to fetch campaigns:', error);
        } finally {
            setLoading(false);
        }
    }, [userId, search, status, sortBy, sortOrder, page]);

    useEffect(() => {
        let isMounted = true;

        if (userId) {
            Promise.resolve().then(() => {
                if (isMounted) fetchCampaigns();
            });
        }

        return () => {
            isMounted = false;
        };
    }, [fetchCampaigns, userId]);

    const handleOpenModal = (mode, campaign) => {
        setModalState({
            isOpen: true,
            mode,
            campaign
        });
    };

    const handleCloseModal = () => {
        setModalState({
            isOpen: false,
            mode: null,
            campaign: null
        });
    };

    const handleUpdateCampaign = async (id, updatedData) => {
        setIsSubmitting(true);
        try {
            const result = await updateCampaign(id, updatedData);
            if (result && (result.acknowledged || result.modifiedCount > 0)) {
                handleCloseModal();
                toast.success('Campaign Updated Successfully!');
                fetchCampaigns();
            }
        } catch (error) {
            console.error('Error updating campaign:', error);
            toast.error(`Something went wrong || ${error.message}`)
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteCampaign = async (id) => {
        setIsSubmitting(true);
        try {
            const result = await deleteCampaign(id);
            if (result && result.success) {
                handleCloseModal();
                toast.success('Campaign Deleted Successfully!');
                fetchCampaigns();
            }
        } catch (error) {
            console.error('Error deleting campaign:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                        My Campaigns
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Manage, edit, and track the progress of your crowdfunding projects.
                    </p>
                </div>
                <Link
                    href="/dashboard/creator/add-campaign"
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                >
                    <FiPlusCircle className="w-4 h-4" />
                    Create Campaign
                </Link>
            </div>

            {/* Filter and Search Controls */}
            <div className="p-5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-1/3">
                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search campaigns by title..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1);
                        }}
                        className="w-full pl-11 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all shadow-sm"
                    />
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 mr-2 hidden sm:flex">
                        <FiFilter className="w-4 h-4" /> Filters
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <select
                            value={status}
                            onChange={(e) => {
                                setStatus(e.target.value);
                                setPage(1);
                            }}
                            className="flex-1 sm:flex-none px-4 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer shadow-sm appearance-none"
                        >
                            <option value="">All Statuses</option>
                            <option value="approved">Approved</option>
                            <option value="pending">Pending</option>
                            <option value="rejected">Rejected</option>
                        </select>

                        <select
                            value={`${sortBy}-${sortOrder}`}
                            onChange={(e) => {
                                const [b, o] = e.target.value.split('-');
                                setSortBy(b);
                                setSortOrder(o);
                                setPage(1);
                            }}
                            className="flex-1 sm:flex-none px-4 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer shadow-sm appearance-none"
                        >
                            <option value="deadline-desc">Newest Deadline</option>
                            <option value="deadline-asc">Oldest Deadline</option>
                            <option value="funding_goal-desc">Goal (High - Low)</option>
                            <option value="funding_goal-asc">Goal (Low - High)</option>
                        </select>

                        <button
                            onClick={() => fetchCampaigns()}
                            title="Refresh"
                            className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all shadow-sm"
                        >
                            <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Campaign Content */}
            {loading ? (
                <div className="py-20 flex flex-col items-center justify-center text-gray-400">
                    <FiRefreshCw className="w-8 h-8 animate-spin text-indigo-500 mb-3" />
                    <p className="text-sm">Loading your campaigns...</p>
                </div>
            ) : campaigns.length === 0 ? (
                <div className="py-16 text-center rounded-2xl border border-dashed border-gray-300 dark:border-gray-800 bg-white/30 dark:bg-gray-900/30 p-8">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">No campaigns found</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-md mx-auto">
                        {search || status ? 'No campaigns match your current filters. Try resetting search or filter options.' : "You haven't created any campaigns yet."}
                    </p>
                </div>
            ) : (
                <>
                    {/* Desktop Table View */}
                    <CampaignTable
                        campaigns={campaigns}
                        onView={(item) => handleOpenModal('view', item)}
                        onEdit={(item) => handleOpenModal('edit', item)}
                        onDelete={(item) => handleOpenModal('delete', item)}
                    />

                    {/* Mobile & Tablet Responsive Grid View */}
                    <CampaignCards
                        campaigns={campaigns}
                        onView={(item) => handleOpenModal('view', item)}
                        onEdit={(item) => handleOpenModal('edit', item)}
                        onDelete={(item) => handleOpenModal('delete', item)}
                    />

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-800">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                Showing page <span className="font-semibold text-gray-900 dark:text-white">{page}</span> of{' '}
                                <span className="font-semibold text-gray-900 dark:text-white">{totalPages}</span> ({totalItems} total)
                            </span>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors"
                                >
                                    <FiChevronLeft className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                    className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors"
                                >
                                    <FiChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Modal Handler Component */}
            <CampaignModal
                key={modalState.campaign?._id || 'new'}
                isOpen={modalState.isOpen}
                mode={modalState.mode}
                campaign={modalState.campaign}
                onClose={handleCloseModal}
                onSubmit={modalState.mode === 'edit' ? handleUpdateCampaign : handleDeleteCampaign}
                isSubmitting={isSubmitting}
            />
        </div>
    );
}
