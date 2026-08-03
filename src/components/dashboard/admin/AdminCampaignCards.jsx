'use client';

import React from 'react';
import { FiTrash2, FiEye, FiCheckCircle, FiXCircle, FiClock } from 'react-icons/fi';

export const AdminCampaignCards = ({ campaigns, onView, onApprove, onReject, onDelete }) => {
    const getStatusBadge = (status) => {
        switch (status) {
            case 'approved':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        <FiCheckCircle className="w-3.5 h-3.5" /> Approved
                    </span>
                );
            case 'rejected':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                        <FiXCircle className="w-3.5 h-3.5" /> Rejected
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                        <FiClock className="w-3.5 h-3.5" /> Pending
                    </span>
                );
        }
    };

    return (
        <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-4">
            {campaigns.map((item) => (
                <div
                    key={item._id}
                    className="p-5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl shadow-lg flex flex-col justify-between hover:border-indigo-500/40 transition-all"
                >
                    <div>
                        <div className="flex items-start justify-between gap-3 mb-3">
                            <div className="flex items-center gap-3">
                                {item.campaign_image_url ? (
                                    <img src={item.campaign_image_url} alt={item.campaign_title} className="w-12 h-12 rounded-xl object-cover border border-gray-200 dark:border-gray-700" />
                                ) : (
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
                                        {item.campaign_title?.substring(0, 2).toUpperCase()}
                                    </div>
                                )}
                                <div>
                                    <h3 className="font-bold text-gray-900 dark:text-white line-clamp-1" title={item.campaign_title}>
                                        {item.campaign_title}
                                    </h3>
                                    <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                                        {item.category || 'General'}
                                    </span>
                                </div>
                            </div>
                            {getStatusBadge(item.status)}
                        </div>

                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-1">
                            <span className="font-semibold text-gray-700 dark:text-gray-300">Creator:</span> {item.creatorName || item.creatorEmail}
                        </div>

                        <div className="grid grid-cols-2 gap-2 bg-gray-50 dark:bg-gray-800/40 p-3 rounded-xl mb-4 border border-gray-100 dark:border-gray-800">
                            <div>
                                <span className="block text-[10px] uppercase tracking-wider text-gray-400">Goal Amount</span>
                                <span className="font-bold text-sm text-gray-900 dark:text-white">${item.funding_goal || 0}</span>
                            </div>
                            <div>
                                <span className="block text-[10px] uppercase tracking-wider text-gray-400">Min Contribution</span>
                                <span className="font-bold text-sm text-emerald-600 dark:text-emerald-400">${item.minimum_Contribution || 0}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800/80">
                        <span className="text-xs text-gray-400">
                            Deadline: {item.deadline ? new Date(item.deadline).toLocaleDateString() : 'N/A'}
                        </span>

                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => onView(item)}
                                title="View Details"
                                className="p-2 text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 rounded-lg transition-colors"
                            >
                                <FiEye className="w-4 h-4" />
                            </button>
                            {item.status !== 'approved' && (
                                <button
                                    onClick={() => onApprove(item)}
                                    title="Approve Campaign"
                                    className="p-2 text-gray-600 hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-lg transition-colors"
                                >
                                    <FiCheckCircle className="w-4 h-4" />
                                </button>
                            )}
                            {item.status !== 'rejected' && (
                                <button
                                    onClick={() => onReject(item)}
                                    title="Reject Campaign"
                                    className="p-2 text-gray-600 hover:text-amber-600 dark:text-gray-400 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 rounded-lg transition-colors"
                                >
                                    <FiXCircle className="w-4 h-4" />
                                </button>
                            )}
                            <button
                                onClick={() => onDelete(item)}
                                title="Delete Campaign"
                                className="p-2 text-gray-600 hover:text-rose-600 dark:text-gray-400 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                            >
                                <FiTrash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
