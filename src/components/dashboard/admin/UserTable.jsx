'use client';

import React from 'react';
import { FiEdit3, FiTrash2, FiEye, FiShield, FiDollarSign } from 'react-icons/fi';

export const UserTable = ({ users, onView, onEditRole, onDelete }) => {
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
        <div className="hidden lg:block overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl shadow-xl">
            <table className="w-full text-left text-sm text-gray-600 dark:text-gray-300">
                <thead className="bg-gray-100/70 dark:bg-gray-800/70 uppercase text-xs text-gray-500 dark:text-gray-400 tracking-wider">
                    <tr>
                        <th scope="col" className="px-6 py-4">User</th>
                        <th scope="col" className="px-6 py-4">Email</th>
                        <th scope="col" className="px-6 py-4">Role</th>
                        <th scope="col" className="px-6 py-4">Credits</th>
                        <th scope="col" className="px-6 py-4">Joined Date</th>
                        <th scope="col" className="px-6 py-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                    {users.map((item) => (
                        <tr key={item._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    {item.image ? (
                                        <img src={item.image} alt={item.name} className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-gray-700" />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                                            {item.name?.substring(0, 2).toUpperCase() || 'US'}
                                        </div>
                                    )}
                                    <div className="font-semibold text-gray-900 dark:text-white truncate max-w-xs">
                                        {item.name || 'Unnamed User'}
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                                {item.email}
                            </td>
                            <td className="px-6 py-4">
                                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${getRoleBadge(item.role)}`}>
                                    <FiShield className="w-3 h-3" />
                                    {item.role || 'Supporter'}
                                </span>
                            </td>
                            <td className="px-6 py-4 font-semibold text-emerald-600 dark:text-emerald-400">
                                {item.credits || 0}
                            </td>
                            <td className="px-6 py-4 text-xs text-gray-500 dark:text-gray-400">
                                {item.createdAt ? new Date(item.createdAt.$date || item.createdAt).toLocaleDateString() : 'N/A'}
                            </td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-1">
                                    <button
                                        onClick={() => onView(item)}
                                        title="View User Details"
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
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
