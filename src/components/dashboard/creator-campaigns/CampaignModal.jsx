'use client';

import React, { useState, useEffect } from 'react';
import { FiX, FiAlertTriangle, FiEdit3, FiEye } from 'react-icons/fi';

export const CampaignModal = ({ isOpen, mode, campaign, onClose, onSubmit, isSubmitting }) => {
    const [formData, setFormData] = useState({});
    const [showConfirm, setShowConfirm] = useState(false);

    useEffect(() => {
        if (campaign && mode === 'edit') {
            setFormData({
                campaign_title: campaign.campaign_title || '',
                campaign_story: campaign.campaign_story || '',
                category: campaign.category ? String(campaign.category).toLowerCase() : '',
                funding_goal: campaign.funding_goal || '',
                minimum_Contribution: campaign.minimum_Contribution || '',
                deadline: campaign.deadline ? String(campaign.deadline).split('T')[0] : '',
                reward_info: campaign.reward_info || '',
                campaign_image_url: campaign.campaign_image_url || ''
            });
        }
        setShowConfirm(false);
    }, [campaign, isOpen, mode]);

    if (!isOpen || !campaign) return null;

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (mode === 'edit') {
            setShowConfirm(true);
        }
    };

    const handleConfirmSubmit = () => {
        if (mode === 'edit') {
            const updatedData = {};
            for (const key in formData) {
                let origValue = campaign[key] !== undefined ? campaign[key] : '';
                let formValue = formData[key];

                if (key === 'deadline' && origValue) {
                    origValue = String(origValue).split('T')[0];
                }
                if (key === 'category' && origValue) {
                    origValue = String(origValue).toLowerCase();
                }
                
                // For number fields, compare as numbers if possible
                if (key === 'funding_goal' || key === 'minimum_Contribution') {
                    if (Number(formValue) !== Number(origValue)) {
                        updatedData[key] = Number(formValue);
                    }
                } else if (formValue !== origValue) {
                    updatedData[key] = formValue;
                }
            }
            
            if (Object.keys(updatedData).length === 0) {
                onClose();
                return;
            }
            
            onSubmit(campaign._id, updatedData);
        } else if (mode === 'delete') {
            onSubmit(campaign._id);
        }
        setShowConfirm(false);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
            <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-gray-200 dark:border-gray-800 relative my-8">
                {/* Header */}
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-100 dark:border-gray-800">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        {mode === 'edit' && <FiEdit3 className="text-amber-500" />}
                        {mode === 'delete' && <FiAlertTriangle className="text-rose-500" />}
                        {mode === 'view' && <FiEye className="text-indigo-500" />}
                        {mode === 'edit' && 'Edit Campaign'}
                        {mode === 'delete' && 'Delete Campaign'}
                        {mode === 'view' && 'Campaign Details'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                        <FiX className="w-5 h-5" />
                    </button>
                </div>

                {/* Body Content */}
                {mode === 'view' && (
                    <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
                        {campaign.campaign_image_url && (
                            <img
                                src={campaign.campaign_image_url}
                                alt={campaign.campaign_title}
                                className="w-full h-48 rounded-xl object-cover border border-gray-200 dark:border-gray-700"
                            />
                        )}
                        <div>
                            <span className="text-xs uppercase font-semibold text-gray-400 block mb-1">Title</span>
                            <p className="font-semibold text-base text-gray-900 dark:text-white">{campaign.campaign_title}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl">
                            <div>
                                <span className="text-xs uppercase font-semibold text-gray-400 block mb-1">Category</span>
                                <p className="font-medium text-gray-900 dark:text-white">{campaign.category || 'N/A'}</p>
                            </div>
                            <div>
                                <span className="text-xs uppercase font-semibold text-gray-400 block mb-1">Status</span>
                                <span className="capitalize font-medium text-gray-900 dark:text-white">{campaign.status}</span>
                            </div>
                            <div>
                                <span className="text-xs uppercase font-semibold text-gray-400 block mb-1">Goal Amount</span>
                                <p className="font-medium text-gray-900 dark:text-white">${campaign.funding_goal || 0}</p>
                            </div>
                            <div>
                                <span className="text-xs uppercase font-semibold text-gray-400 block mb-1">Min Contribution</span>
                                <p className="font-medium text-emerald-600 dark:text-emerald-400">${campaign.minimum_Contribution || 0}</p>
                            </div>
                        </div>
                        <div>
                            <span className="text-xs uppercase font-semibold text-gray-400 block mb-1">Campaign Story</span>
                            <p className="whitespace-pre-line bg-gray-50 dark:bg-gray-800/40 p-3 rounded-xl text-xs leading-relaxed max-h-40 overflow-y-auto">
                                {campaign.campaign_story || 'No story provided.'}
                            </p>
                        </div>
                        {campaign.reward_info && (
                            <div>
                                <span className="text-xs uppercase font-semibold text-gray-400 block mb-1">Reward Info</span>
                                <p className="bg-gray-50 dark:bg-gray-800/40 p-3 rounded-xl text-xs">{campaign.reward_info}</p>
                            </div>
                        )}
                        <div className="pt-4 flex justify-end border-t border-gray-100 dark:border-gray-800">
                            <button
                                onClick={onClose}
                                className="px-5 py-2 rounded-xl text-sm font-medium bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}

                {mode === 'edit' && !showConfirm && (
                    <form onSubmit={handleFormSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">
                                Title
                            </label>
                            <input
                                type="text"
                                value={formData.campaign_title || ''}
                                onChange={(e) => setFormData({ ...formData, campaign_title: e.target.value })}
                                required
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none transition-all text-sm"
                            />
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">
                                    Category
                                </label>
                                <select
                                    value={formData.category || ''}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    required
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none transition-all text-sm"
                                >
                                    <option value="">Select Category</option>
                                    <option value="technology">Technology</option>
                                    <option value="art">Art</option>
                                    <option value="community">Community</option>
                                    <option value="health">Health</option>
                                    <option value="education">Education</option>
                                    <option value="environment">Environment</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">
                                    Deadline
                                </label>
                                <input
                                    type="date"
                                    value={formData.deadline || ''}
                                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                                    required
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none transition-all text-sm"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">
                                    Funding Goal
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    value={formData.funding_goal || ''}
                                    onChange={(e) => setFormData({ ...formData, funding_goal: e.target.value })}
                                    required
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none transition-all text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">
                                    Min Contribution
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    value={formData.minimum_Contribution || ''}
                                    onChange={(e) => setFormData({ ...formData, minimum_Contribution: e.target.value })}
                                    required
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none transition-all text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">
                                Campaign Story
                            </label>
                            <textarea
                                rows={3}
                                value={formData.campaign_story || ''}
                                onChange={(e) => setFormData({ ...formData, campaign_story: e.target.value })}
                                required
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none transition-all text-sm resize-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">
                                Reward Information
                            </label>
                            <input
                                type="text"
                                value={formData.reward_info || ''}
                                onChange={(e) => setFormData({ ...formData, reward_info: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none transition-all text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">
                                Image URL
                            </label>
                            <input
                                type="url"
                                value={formData.campaign_image_url || ''}
                                onChange={(e) => setFormData({ ...formData, campaign_image_url: e.target.value })}
                                required
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none transition-all text-sm"
                            />
                        </div>
                        <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 dark:border-gray-800">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-5 py-2.5 rounded-xl text-sm font-medium bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-5 py-2.5 rounded-xl text-sm font-medium bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/20 hover:opacity-95 transition-opacity"
                            >
                                Save Changes
                            </button>
                        </div>
                    </form>
                )}

                {/* Edit Confirmation Alert */}
                {mode === 'edit' && showConfirm && (
                    <div className="space-y-4 py-2">
                        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-sm flex items-start gap-3">
                            <FiAlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                            <div>
                                <h4 className="font-bold">Confirm Update</h4>
                                <p className="text-xs mt-1">Are you sure you want to update this campaign's details?</p>
                            </div>
                        </div>
                        <div className="pt-2 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setShowConfirm(false)}
                                disabled={isSubmitting}
                                className="px-5 py-2 rounded-xl text-sm font-medium bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors"
                            >
                                Back
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirmSubmit}
                                disabled={isSubmitting}
                                className="px-5 py-2 rounded-xl text-sm font-medium bg-amber-600 hover:bg-amber-700 text-white transition-colors flex items-center gap-2"
                            >
                                {isSubmitting ? 'Updating...' : 'Yes, Update'}
                            </button>
                        </div>
                    </div>
                )}

                {/* Delete Confirmation Alert */}
                {mode === 'delete' && (
                    <div className="space-y-4 py-2">
                        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-300 text-sm flex items-start gap-3">
                            <FiAlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                            <div>
                                <h4 className="font-bold">Confirm Deletion</h4>
                                <p className="text-xs mt-1">
                                    Are you sure you want to delete <span className="font-semibold">{campaign.campaign_title}</span>? This will refund all approved supporters and cannot be undone.
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
                                onClick={handleConfirmSubmit}
                                disabled={isSubmitting}
                                className="px-5 py-2 rounded-xl text-sm font-medium bg-rose-600 hover:bg-rose-700 text-white transition-colors flex items-center gap-2"
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
