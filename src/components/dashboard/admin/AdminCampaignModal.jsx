'use client';

import React, { useState, useEffect } from 'react';
import { FiX, FiAlertTriangle, FiCheckCircle, FiXCircle, FiEye, FiClock } from 'react-icons/fi';

export const AdminCampaignModal = ({ isOpen, mode, campaign, onClose, onSubmitStatus, onSubmitDelete, isSubmitting }) => {
    const [targetStatus, setTargetStatus] = useState('approved');
    const [showConfirmInView, setShowConfirmInView] = useState(false);

    useEffect(() => {
        if (campaign?._targetStatus) {
            setTargetStatus(campaign._targetStatus);
        } else {
            setTargetStatus('approved');
        }
        setShowConfirmInView(false);
    }, [campaign, isOpen, mode]);

    if (!isOpen || !campaign) return null;

    const handleActionClickInView = (status) => {
        setTargetStatus(status);
        setShowConfirmInView(true);
    };

    const handleConfirmStatusChange = () => {
        onSubmitStatus(campaign._id, targetStatus);
    };

    const handleConfirmDelete = () => {
        onSubmitDelete(campaign._id);
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'approved':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        <FiCheckCircle className="w-3.5 h-3.5" /> Approved
                    </span>
                );
            case 'rejected':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                        <FiXCircle className="w-3.5 h-3.5" /> Rejected
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                        <FiClock className="w-3.5 h-3.5" /> Pending
                    </span>
                );
        }
    };

    const isApproveMode = targetStatus === 'approved';

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
            <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-gray-200 dark:border-gray-800 relative my-8">
                {/* Header */}
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-100 dark:border-gray-800">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        {mode === 'view' && <FiEye className="text-indigo-500" />}
                        {mode === 'status' && isApproveMode && <FiCheckCircle className="text-emerald-500" />}
                        {mode === 'status' && !isApproveMode && <FiXCircle className="text-rose-500" />}
                        {mode === 'delete' && <FiAlertTriangle className="text-rose-500" />}
                        {mode === 'view' && 'Campaign Details'}
                        {mode === 'status' && (isApproveMode ? 'Approve Campaign' : 'Reject Campaign')}
                        {mode === 'delete' && 'Delete Campaign'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                        <FiX className="w-5 h-5" />
                    </button>
                </div>

                {/* View Mode */}
                {mode === 'view' && (
                    <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
                        {campaign.campaign_image_url && (
                            <img
                                src={campaign.campaign_image_url}
                                alt={campaign.campaign_title}
                                className="w-full h-52 rounded-xl object-cover border border-gray-200 dark:border-gray-700 shadow-md"
                            />
                        )}
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <span className="text-xs uppercase font-semibold text-gray-400 block mb-1">Title</span>
                                <h3 className="font-bold text-lg text-gray-900 dark:text-white">{campaign.campaign_title}</h3>
                            </div>
                            {getStatusBadge(campaign.status)}
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gray-50 dark:bg-gray-800/50 p-3.5 rounded-xl border border-gray-100 dark:border-gray-800">
                            <div>
                                <span className="text-[10px] uppercase font-semibold text-gray-400 block mb-0.5">Category</span>
                                <p className="font-medium text-gray-900 dark:text-white">{campaign.category || 'N/A'}</p>
                            </div>
                            <div>
                                <span className="text-[10px] uppercase font-semibold text-gray-400 block mb-0.5">Goal Amount</span>
                                <p className="font-bold text-gray-900 dark:text-white">${campaign.funding_goal || 0}</p>
                            </div>
                            <div>
                                <span className="text-[10px] uppercase font-semibold text-gray-400 block mb-0.5">Min Contribution</span>
                                <p className="font-bold text-emerald-600 dark:text-emerald-400">${campaign.minimum_Contribution || 0}</p>
                            </div>
                            <div>
                                <span className="text-[10px] uppercase font-semibold text-gray-400 block mb-0.5">Deadline</span>
                                <p className="font-medium text-gray-900 dark:text-white">
                                    {campaign.deadline ? new Date(campaign.deadline).toLocaleDateString() : 'N/A'}
                                </p>
                            </div>
                        </div>

                        <div className="p-3.5 bg-gray-50 dark:bg-gray-800/40 rounded-xl border border-gray-100 dark:border-gray-800 flex items-center gap-3">
                            {campaign.creatorProfileImg ? (
                                <img src={campaign.creatorProfileImg} alt={campaign.creatorName} className="w-10 h-10 rounded-full object-cover" />
                            ) : (
                                <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">
                                    {campaign.creatorName?.substring(0, 2).toUpperCase() || 'CR'}
                                </div>
                            )}
                            <div>
                                <span className="text-[10px] uppercase font-semibold text-gray-400 block">Creator</span>
                                <p className="font-semibold text-sm text-gray-900 dark:text-white">{campaign.creatorName || 'Unknown Creator'}</p>
                                <p className="text-xs text-gray-500">{campaign.creatorEmail}</p>
                            </div>
                        </div>

                        <div>
                            <span className="text-xs uppercase font-semibold text-gray-400 block mb-1">Campaign Story</span>
                            <p className="whitespace-pre-line bg-gray-50 dark:bg-gray-800/40 p-3.5 rounded-xl text-xs leading-relaxed max-h-40 overflow-y-auto border border-gray-100 dark:border-gray-800">
                                {campaign.campaign_story || 'No story provided.'}
                            </p>
                        </div>

                        {campaign.reward_info && (
                            <div>
                                <span className="text-xs uppercase font-semibold text-gray-400 block mb-1">Reward Info</span>
                                <p className="bg-gray-50 dark:bg-gray-800/40 p-3.5 rounded-xl text-xs border border-gray-100 dark:border-gray-800">{campaign.reward_info}</p>
                            </div>
                        )}

                        {/* Confirmation area if triggered inside view mode */}
                        {showConfirmInView ? (
                            <div className={`p-4 rounded-xl border text-sm flex items-start gap-3 mt-4 ${
                                isApproveMode
                                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                                    : 'bg-rose-500/10 border-rose-500/20 text-rose-700 dark:text-rose-300'
                            }`}>
                                {isApproveMode ? <FiCheckCircle className="w-5 h-5 shrink-0 mt-0.5" /> : <FiXCircle className="w-5 h-5 shrink-0 mt-0.5" />}
                                <div className="flex-1">
                                    <h4 className="font-bold">Confirm {isApproveMode ? 'Approval' : 'Rejection'}</h4>
                                    <p className="text-xs mt-1">
                                        Are you sure you want to {isApproveMode ? 'approve' : 'reject'} this campaign?
                                    </p>
                                    <div className="pt-3 flex gap-2">
                                        <button
                                            onClick={handleConfirmStatusChange}
                                            disabled={isSubmitting}
                                            className={`px-4 py-1.5 rounded-lg text-xs font-semibold text-white shadow ${
                                                isApproveMode ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
                                            }`}
                                        >
                                            {isSubmitting ? 'Updating...' : `Yes, ${isApproveMode ? 'Approve' : 'Reject'}`}
                                        </button>
                                        <button
                                            onClick={() => setShowConfirmInView(false)}
                                            className="px-4 py-1.5 rounded-lg text-xs font-medium bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="pt-4 flex justify-between items-center border-t border-gray-100 dark:border-gray-800">
                                <div className="flex gap-2">
                                    {campaign.status !== 'approved' && (
                                        <button
                                            onClick={() => handleActionClickInView('approved')}
                                            className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
                                        >
                                            <FiCheckCircle className="w-4 h-4" /> Approve
                                        </button>
                                    )}
                                    {campaign.status !== 'rejected' && (
                                        <button
                                            onClick={() => handleActionClickInView('rejected')}
                                            className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white transition-colors flex items-center gap-1.5 shadow-md shadow-rose-500/20"
                                        >
                                            <FiXCircle className="w-4 h-4" /> Reject
                                        </button>
                                    )}
                                </div>
                                <button
                                    onClick={onClose}
                                    className="px-5 py-2 rounded-xl text-sm font-medium bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Direct Status Confirmation Dialog (when clicking Approve/Reject icon directly from table/card) */}
                {mode === 'status' && (
                    <div className="space-y-4 py-2">
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
                            {campaign.campaign_image_url ? (
                                <img src={campaign.campaign_image_url} alt={campaign.campaign_title} className="w-12 h-12 rounded-xl object-cover" />
                            ) : (
                                <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold">
                                    {campaign.campaign_title?.substring(0, 2).toUpperCase()}
                                </div>
                            )}
                            <div>
                                <h4 className="font-bold text-sm text-gray-900 dark:text-white line-clamp-1">{campaign.campaign_title}</h4>
                                <p className="text-xs text-gray-500">By {campaign.creatorName || campaign.creatorEmail}</p>
                            </div>
                        </div>

                        <div className={`p-4 rounded-xl border text-sm flex items-start gap-3 ${
                            isApproveMode
                                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                                : 'bg-rose-500/10 border-rose-500/20 text-rose-700 dark:text-rose-300'
                        }`}>
                            {isApproveMode ? (
                                <FiCheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
                            ) : (
                                <FiXCircle className="w-5 h-5 shrink-0 mt-0.5" />
                            )}
                            <div>
                                <h4 className="font-bold">Confirm Campaign {isApproveMode ? 'Approval' : 'Rejection'}</h4>
                                <p className="text-xs mt-1">
                                    Are you sure you want to mark <span className="font-semibold">{campaign.campaign_title}</span> as{' '}
                                    <span className="font-bold uppercase">{targetStatus}</span>?
                                    {isApproveMode
                                        ? ' This campaign will become live and visible to all Supporters.'
                                        : ' This campaign will be rejected and hidden from Supporters.'}
                                </p>
                            </div>
                        </div>

                        <div className="pt-2 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={isSubmitting}
                                className="px-5 py-2 rounded-xl text-sm font-medium bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirmStatusChange}
                                disabled={isSubmitting}
                                className={`px-5 py-2 rounded-xl text-sm font-medium text-white transition-colors flex items-center gap-2 shadow-md ${
                                    isApproveMode
                                        ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20'
                                        : 'bg-rose-600 hover:bg-rose-700 shadow-rose-500/20'
                                }`}
                            >
                                {isSubmitting ? 'Updating...' : `Yes, ${isApproveMode ? 'Approve Campaign' : 'Reject Campaign'}`}
                            </button>
                        </div>
                    </div>
                )}

                {/* Delete Confirmation Alert Dialog */}
                {mode === 'delete' && (
                    <div className="space-y-4 py-2">
                        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-300 text-sm flex items-start gap-3">
                            <FiAlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
                            <div>
                                <h4 className="font-bold">Delete Campaign</h4>
                                <p className="text-xs mt-1">
                                    Are you sure you want to delete <span className="font-semibold">{campaign.campaign_title}</span>? This will permanently delete the campaign and refund any approved supporters.
                                </p>
                            </div>
                        </div>
                        <div className="pt-2 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={isSubmitting}
                                className="px-5 py-2 rounded-xl text-sm font-medium bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirmDelete}
                                disabled={isSubmitting}
                                className="px-5 py-2 rounded-xl text-sm font-medium bg-rose-600 hover:bg-rose-700 text-white transition-colors flex items-center gap-2 shadow-md shadow-rose-500/20"
                            >
                                {isSubmitting ? 'Deleting...' : 'Yes, Delete Campaign'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
