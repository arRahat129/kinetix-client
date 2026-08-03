'use client';

import React from 'react';
import { FiTrash2, FiEye, FiShield } from 'react-icons/fi';

export const UserCards = ({ users, onView, onEditRole, onDelete }) => {
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
        <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-4">
            {users.map((item) => (
                <div
                    key={item._id}
                    className="p-5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl shadow-lg flex flex-col justify-between hover:border-indigo-500/40 transition-all space-y-4"
                >
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                            {item.image ? (
                                <img src={item.image} alt={item.name} className="w-12 h-12 rounded-full object-cover border border-gray-200 dark:border-gray-700" />
                            ) : (
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
                                    {item.name?.substring(0, 2).toUpperCase() || 'US'}
                                </div>
                            )}
                            <div>
                                <h3 className="font-bold text-gray-900 dark:text-white line-clamp-1">
                                    {item.name || 'Unnamed User'}
                                </h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[180px]">
                                    {item.email}
                                </p>
                            </div>
                        </div>
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${getRoleBadge(item.role)}`}>
                            <FiShield className="w-3 h-3" />
                            {item.role || 'Supporter'}
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 bg-gray-50 dark:bg-gray-800/40 p-3 rounded-xl border border-gray-100 dark:border-gray-800">
                        <div>
                            <span className="block text-[10px] uppercase tracking-wider text-gray-400">Credits</span>
                            <span className="font-bold text-sm text-emerald-600 dark:text-emerald-400">{item.credits || 0}</span>
                        </div>
                        <div>
                            <span className="block text-[10px] uppercase tracking-wider text-gray-400">Joined</span>
                            <span className="font-medium text-xs text-gray-700 dark:text-gray-300">
                                {item.createdAt ? new Date(item.createdAt.$date || item.createdAt).toLocaleDateString() : 'N/A'}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800/80">
                        <span className="text-xs text-gray-400">Actions</span>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => onView(item)}
                                title="View Details"
                                className="p-2 text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 rounded-lg transition-colors"
                            >
                                <FiEye className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => onEditRole(item)}
                                title="Update Role"
                                className="p-2 text-gray-600 hover:text-amber-600 dark:text-gray-400 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 rounded-lg transition-colors"
                            >
                                <FiShield className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => onDelete(item)}
                                title="Remove User"
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
