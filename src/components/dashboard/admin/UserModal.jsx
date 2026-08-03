'use client';

import React, { useState, useEffect } from 'react';
import { FiX, FiAlertTriangle, FiUserCheck, FiEye, FiShield, FiMail, FiDollarSign, FiCalendar } from 'react-icons/fi';

export const UserModal = ({ isOpen, mode, user, onClose, onSubmitRole, onSubmitDelete, isSubmitting }) => {
    const [selectedRole, setSelectedRole] = useState(user?.role || 'Supporter');
    const [showConfirm, setShowConfirm] = useState(false);

    useEffect(() => {
        if (user) {
            setSelectedRole(user.role || 'Supporter');
        }
        setShowConfirm(false);
    }, [user, isOpen, mode]);

    if (!isOpen || !user) return null;

    const handleRoleSubmit = (e) => {
        e.preventDefault();
        setShowConfirm(true);
    };

    const handleConfirmRoleChange = () => {
        onSubmitRole(user._id, selectedRole);
        setShowConfirm(false);
    };

    const handleConfirmDelete = () => {
        onSubmitDelete(user._id);
    };

    const getRoleBadge = (role) => {
        switch (role) {
            case 'Admin':
                return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20';
            case 'Creator':
                return 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20';
            default:
                return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
            <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 dark:border-gray-800 relative my-8">
                {/* Header */}
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-100 dark:border-gray-800">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        {mode === 'editRole' && <FiShield className="text-indigo-500" />}
                        {mode === 'delete' && <FiAlertTriangle className="text-rose-500" />}
                        {mode === 'view' && <FiEye className="text-indigo-500" />}
                        {mode === 'editRole' && 'Update User Role'}
                        {mode === 'delete' && 'Remove User'}
                        {mode === 'view' && 'User Details'}
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
                        <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
                            {user.image ? (
                                <img src={user.image} alt={user.name} className="w-16 h-16 rounded-full object-cover border-2 border-indigo-500/30" />
                            ) : (
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold">
                                    {user.name?.substring(0, 2).toUpperCase() || 'US'}
                                </div>
                            )}
                            <div>
                                <h3 className="font-bold text-lg text-gray-900 dark:text-white">{user.name}</h3>
                                <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    <FiMail className="w-3.5 h-3.5" />
                                    <span>{user.email}</span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-800/40 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                            <div>
                                <span className="text-xs uppercase font-semibold text-gray-400 block mb-1">Role</span>
                                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${getRoleBadge(user.role)}`}>
                                    <FiShield className="w-3 h-3" /> {user.role || 'Supporter'}
                                </span>
                            </div>
                            <div>
                                <span className="text-xs uppercase font-semibold text-gray-400 block mb-1">Credits</span>
                                <p className="font-bold text-base text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                    <FiDollarSign className="w-4 h-4" /> {user.credits || 0}
                                </p>
                            </div>
                            {user.createdAt && (
                                <div className="col-span-2">
                                    <span className="text-xs uppercase font-semibold text-gray-400 block mb-1">Joined Date</span>
                                    <p className="text-xs text-gray-600 dark:text-gray-300 flex items-center gap-1.5">
                                        <FiCalendar className="w-3.5 h-3.5" />
                                        {new Date(user.createdAt.$date || user.createdAt).toLocaleString()}
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="pt-4 flex justify-end border-t border-gray-100 dark:border-gray-800">
                            <button
                                onClick={onClose}
                                className="px-5 py-2.5 rounded-xl text-sm font-medium bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}

                {mode === 'editRole' && !showConfirm && (
                    <form onSubmit={handleRoleSubmit} className="space-y-4">
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                            {user.image ? (
                                <img src={user?.image} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                            ) : (
                                <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                                    {user.name?.substring(0, 2).toUpperCase() || 'US'}
                                </div>
                            )}
                            <div>
                                <p className="font-semibold text-sm text-gray-900 dark:text-white">{user.name}</p>
                                <p className="text-xs text-gray-500">{user.email}</p>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">
                                Select User Role
                            </label>
                            <select
                                value={selectedRole}
                                onChange={(e) => setSelectedRole(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm cursor-pointer"
                            >
                                <option value="Admin">Admin</option>
                                <option value="Creator">Creator</option>
                                <option value="Supporter">Supporter</option>
                            </select>
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
                                className="px-5 py-2.5 rounded-xl text-sm font-medium bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/20 hover:opacity-95 transition-opacity flex items-center gap-2"
                            >
                                <FiUserCheck /> Update Role
                            </button>
                        </div>
                    </form>
                )}

                {/* Role Update Confirmation Dialog */}
                {mode === 'editRole' && showConfirm && (
                    <div className="space-y-4 py-2">
                        <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-700 dark:text-indigo-300 text-sm flex items-start gap-3">
                            <FiShield className="w-5 h-5 shrink-0 mt-0.5 text-indigo-600 dark:text-indigo-400" />
                            <div>
                                <h4 className="font-bold">Confirm Role Change</h4>
                                <p className="text-xs mt-1">
                                    Are you sure you want to change <span className="font-semibold">{user.name}</span>'s role to <span className="font-bold uppercase text-indigo-600 dark:text-indigo-400">{selectedRole}</span>?
                                </p>
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
                                onClick={handleConfirmRoleChange}
                                disabled={isSubmitting}
                                className="px-5 py-2 rounded-xl text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white transition-colors flex items-center gap-2 shadow-md shadow-indigo-500/20"
                            >
                                {isSubmitting ? 'Updating...' : 'Yes, Confirm Change'}
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
                                <h4 className="font-bold">Remove User</h4>
                                <p className="text-xs mt-1">
                                    Are you sure you want to remove <span className="font-semibold">{user.name} ({user.email})</span>? This will permanently delete the user from the database.
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
                                {isSubmitting ? 'Removing...' : 'Yes, Delete User'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
