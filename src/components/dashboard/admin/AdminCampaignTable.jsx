'use client';

import React from 'react';
import { FiTrash2, FiEye, FiCheckCircle, FiXCircle, FiClock } from 'react-icons/fi';

export const AdminCampaignTable = ({ campaigns, onView, onApprove, onReject, onDelete, highlightId }) => {
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
        <div className="hidden lg:block overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl shadow-xl">
            <table className="w-full text-left text-sm text-gray-600 dark:text-gray-300">
                <thead className="bg-gray-100/70 dark:bg-gray-800/70 uppercase text-xs text-gray-500 dark:text-gray-400 tracking-wider">
                    <tr>
                        <th scope="col" className="px-6 py-4">Campaign</th>
                        <th scope="col" className="px-6 py-4">Creator</th>
                        <th scope="col" className="px-6 py-4">Category</th>
                        <th scope="col" className="px-6 py-4">Goal Amount</th>
                        <th scope="col" className="px-6 py-4">Min Contribution</th>
                        <th scope="col" className="px-6 py-4">Deadline</th>
                        <th scope="col" className="px-6 py-4">Status</th>
                        <th scope="col" className="px-6 py-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                    {campaigns.map((item) => {
                        const isHighlighted = highlightId && (item._id === highlightId || String(item._id) === String(highlightId));
                        return (
                            <tr
                                key={item._id}
                                id={`campaign-row-${item._id}`}
                                className={`transition-all duration-500 ${
                                    isHighlighted
                                        ? 'bg-rose-500/10 dark:bg-rose-950/40 border-2 border-rose-500 shadow-xl animate-pulse'
                                        : 'hover:bg-gray-50/50 dark:hover:bg-gray-800/30'
                                }`}
                            >
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    {item.campaign_image_url ? (
                                        <img src={item.campaign_image_url} alt={item.campaign_title} className="w-12 h-12 rounded-xl object-cover border border-gray-200 dark:border-gray-700" />
                                    ) : (
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
                                            {item.campaign_title?.substring(0, 2).toUpperCase()}
                                        </div>
                                    )}
                                    <div className="max-w-xs">
                                        <div className="font-semibold text-gray-900 dark:text-white truncate" title={item.campaign_title}>
                                            {item.campaign_title}
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[150px]">
                                    {item.creatorName || 'Unknown'}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[150px]">
                                    {item.creatorEmail}
                                </div>
                            </td>
                            <td className="px-6 py-4 font-medium text-gray-700 dark:text-gray-300">
                                {item.category || 'General'}
                            </td>
                            <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                                ${item.funding_goal || 0}
                            </td>
                            <td className="px-6 py-4 font-semibold text-emerald-600 dark:text-emerald-400">
                                ${item.minimum_Contribution || 0}
                            </td>
                            <td className="px-6 py-4 text-xs text-gray-500 dark:text-gray-400">
                                {item.deadline ? new Date(item.deadline).toLocaleDateString() : 'N/A'}
                            </td>
                            <td className="px-6 py-4">
                                {getStatusBadge(item.status)}
                            </td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-1">
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
                            </td>
                        </tr>
                    );
                })}
                </tbody>
            </table>
        </div>
    );
};
