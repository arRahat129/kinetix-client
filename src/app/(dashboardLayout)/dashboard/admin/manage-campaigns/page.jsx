'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getAllCampaignsAdmin } from '@/lib/api/campaign';
import { updateCampaignStatus, deleteCampaign } from '@/lib/actions/campaign';
import { AdminCampaignTable } from '@/components/dashboard/admin/AdminCampaignTable';
import { AdminCampaignCards } from '@/components/dashboard/admin/AdminCampaignCards';
import { AdminCampaignModal } from '@/components/dashboard/admin/AdminCampaignModal';
import { FiSearch, FiFilter, FiRefreshCw, FiLayers, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function ManageCampaignsPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const highlightId = searchParams.get('highlight');

    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Filters & Pagination state
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
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
        setLoading(true);
        try {
            const res = await getAllCampaignsAdmin({
                search,
                status: statusFilter,
                page,
                limit: 8
            });

            if (res?.data) {
                setCampaigns(res.data);
                setTotalPages(res.totalPages || 1);
                setTotalItems(res.total || 0);
            } else {
                setCampaigns([]);
                setTotalPages(1);
                setTotalItems(0);
            }
        } catch (error) {
            console.error('Failed to fetch campaigns:', error);
            toast.error(error.message || 'Failed to fetch campaigns');
        } finally {
            setLoading(false);
        }
    }, [search, statusFilter, page]);

    useEffect(() => {
        fetchCampaigns();
    }, [fetchCampaigns]);

    useEffect(() => {
        if (highlightId && !loading && campaigns.length > 0) {
            const timer = setTimeout(() => {
                const rowEl = document.getElementById(`campaign-row-${highlightId}`);
                const cardEl = document.getElementById(`campaign-card-${highlightId}`);
                const targetEl = rowEl || cardEl;
                if (targetEl) {
                    targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [highlightId, loading, campaigns]);

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

    const handleUpdateStatus = async (campaignId, status) => {
        setIsSubmitting(true);
        const toastId = toast.loading(`Updating status to ${status}...`);
        try {
            const result = await updateCampaignStatus(campaignId, status);
            if (result && (result.success || result.result?.modifiedCount > 0 || result.result?.acknowledged)) {
                toast.success(`Campaign has been ${status}!`, { id: toastId });
                handleCloseModal();
                fetchCampaigns();
                router.refresh();
            } else {
                throw new Error(result?.message || 'Failed to update campaign status');
            }
        } catch (error) {
            console.error('Error updating campaign status:', error);
            toast.error(error.message || 'Failed to update status', { id: toastId });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteCampaign = async (campaignId) => {
        setIsSubmitting(true);
        const toastId = toast.loading('Deleting campaign...');
        try {
            const result = await deleteCampaign(campaignId);
            if (result && (result.success || result.deleteResult?.deletedCount > 0)) {
                toast.success('Campaign deleted successfully!', { id: toastId });
                handleCloseModal();
                fetchCampaigns();
                router.refresh();
            } else {
                throw new Error(result?.message || 'Failed to delete campaign');
            }
        } catch (error) {
            console.error('Error deleting campaign:', error);
            toast.error(error.message || 'Failed to delete campaign', { id: toastId });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
                        <FiLayers className="text-indigo-600 dark:text-indigo-400" />
                        Manage Campaigns
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Review submitted campaigns, approve or reject proposals, and delete invalid projects.
                    </p>
                </div>
            </div>

            {/* Filter and Search Controls */}
            <div className="p-5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-1/3">
                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search by title or creator..."
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
                        <FiFilter className="w-4 h-4" /> Filter:
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <select
                            value={statusFilter}
                            onChange={(e) => {
                                setStatusFilter(e.target.value);
                                setPage(1);
                            }}
                            className="flex-1 sm:flex-none px-4 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer shadow-sm"
                        >
                            <option value="">All Statuses</option>
                            <option value="pending">Pending Approvals</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                        </select>

                        <button
                            onClick={() => {
                                fetchCampaigns();
                                toast.success('Campaigns list refreshed!');
                            }}
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
                    <p className="text-sm">Loading campaigns...</p>
                </div>
            ) : campaigns.length === 0 ? (
                <div className="py-16 text-center rounded-2xl border border-dashed border-gray-300 dark:border-gray-800 bg-white/30 dark:bg-gray-900/30 p-8">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">No campaigns found</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-md mx-auto">
                        {search || statusFilter ? 'No campaigns match your current filters.' : 'There are no campaigns registered in the system.'}
                    </p>
                </div>
            ) : (
                <>
                    {/* Desktop Table View (lg screen) */}
                    <AdminCampaignTable
                        campaigns={campaigns}
                        highlightId={highlightId}
                        onView={(item) => handleOpenModal('view', item)}
                        onApprove={(item) => handleOpenModal('status', { ...item, _targetStatus: 'approved' })}
                        onReject={(item) => handleOpenModal('status', { ...item, _targetStatus: 'rejected' })}
                        onDelete={(item) => handleOpenModal('delete', item)}
                    />

                    {/* Mobile & Tablet Responsive Grid View (sm & md screens) */}
                    <AdminCampaignCards
                        campaigns={campaigns}
                        highlightId={highlightId}
                        onView={(item) => handleOpenModal('view', item)}
                        onApprove={(item) => handleOpenModal('status', { ...item, _targetStatus: 'approved' })}
                        onReject={(item) => handleOpenModal('status', { ...item, _targetStatus: 'rejected' })}
                        onDelete={(item) => handleOpenModal('delete', item)}
                    />

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-800">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                Page <span className="font-semibold text-gray-900 dark:text-white">{page}</span> of{' '}
                                <span className="font-semibold text-gray-900 dark:text-white">{totalPages}</span> ({totalItems} total campaigns)
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
            <AdminCampaignModal
                key={modalState.campaign?._id || 'admin-modal'}
                isOpen={modalState.isOpen}
                mode={modalState.mode}
                campaign={modalState.campaign}
                onClose={handleCloseModal}
                onSubmitStatus={handleUpdateStatus}
                onSubmitDelete={handleDeleteCampaign}
                isSubmitting={isSubmitting}
            />
        </div>
    );
}
