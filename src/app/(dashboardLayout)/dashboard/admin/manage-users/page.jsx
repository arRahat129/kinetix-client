'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getAllUsers } from '@/lib/api/user';
import { updateUserRole, deleteUser } from '@/lib/actions/user';
import { UserTable } from '@/components/dashboard/admin/UserTable';
import { UserCards } from '@/components/dashboard/admin/UserCards';
import { UserModal } from '@/components/dashboard/admin/UserModal';
import { FiSearch, FiFilter, FiRefreshCw, FiUsers, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function ManageUsersPage() {
    const router = useRouter();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Filter & Pagination state
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [page, setPage] = useState(1);
    const itemsPerPage = 8;

    // Modal State
    const [modalState, setModalState] = useState({
        isOpen: false,
        mode: null,
        user: null
    });

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getAllUsers({ search, role: roleFilter });
            console.log(res)
            if (res?.data) {
                setUsers(res.data);
            } else {
                setUsers([]);
            }
        } catch (error) {
            console.error('Failed to fetch users:', error);
            toast.error(error.message || 'Failed to load users');
        } finally {
            setLoading(false);
        }
    }, [search, roleFilter]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleOpenModal = (mode, user) => {
        setModalState({
            isOpen: true,
            mode,
            user
        });
    };

    const handleCloseModal = () => {
        setModalState({
            isOpen: false,
            mode: null,
            user: null
        });
    };

    const handleUpdateRole = async (userId, newRole) => {
        setIsSubmitting(true);
        const toastId = toast.loading('Updating user role...');
        try {
            const result = await updateUserRole(userId, newRole);
            if (result && (result.success || result.result?.modifiedCount > 0 || result.result?.acknowledged)) {
                toast.success(`User role successfully changed to ${newRole}!`, { id: toastId });
                handleCloseModal();
                fetchUsers();
                router.refresh();
            } else {
                throw new Error(result?.message || 'Failed to update role');
            }
        } catch (error) {
            console.error('Error updating user role:', error);
            toast.error(error.message || 'Failed to update user role', { id: toastId });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteUser = async (userId) => {
        setIsSubmitting(true);
        const toastId = toast.loading('Removing user...');
        try {
            const result = await deleteUser(userId);
            if (result && (result.success || result.result?.deletedCount > 0)) {
                toast.success('User removed from system successfully!', { id: toastId });
                handleCloseModal();
                fetchUsers();
                router.refresh();
            } else {
                throw new Error(result?.message || 'Failed to delete user');
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            toast.error(error.message || 'Failed to delete user', { id: toastId });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Client-side pagination math
    const totalPages = Math.ceil(users.length / itemsPerPage) || 1;
    const paginatedUsers = users.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    return (
        <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
                        <FiUsers className="text-indigo-600 dark:text-indigo-400" />
                        Manage Users
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        View user details, update user roles, or remove users from the platform.
                    </p>
                </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="p-5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-1/3">
                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
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
                            value={roleFilter}
                            onChange={(e) => {
                                setRoleFilter(e.target.value);
                                setPage(1);
                            }}
                            className="flex-1 sm:flex-none px-4 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer shadow-sm"
                        >
                            <option value="">All Roles</option>
                            <option value="Admin">Admin</option>
                            <option value="Creator">Creator</option>
                            <option value="Supporter">Supporter</option>
                        </select>

                        <button
                            onClick={() => {
                                fetchUsers();
                                toast.success('Users list refreshed!');
                            }}
                            title="Refresh"
                            className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all shadow-sm"
                        >
                            <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            {loading ? (
                <div className="py-20 flex flex-col items-center justify-center text-gray-400">
                    <FiRefreshCw className="w-8 h-8 animate-spin text-indigo-500 mb-3" />
                    <p className="text-sm">Loading platform users...</p>
                </div>
            ) : users.length === 0 ? (
                <div className="py-16 text-center rounded-2xl border border-dashed border-gray-300 dark:border-gray-800 bg-white/30 dark:bg-gray-900/30 p-8">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">No users found</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-md mx-auto">
                        {search || roleFilter ? 'No users match your filter criteria.' : 'There are currently no users registered in the database.'}
                    </p>
                </div>
            ) : (
                <>
                    {/* Desktop Table View (lg screen) */}
                    <UserTable
                        users={paginatedUsers}
                        onView={(u) => handleOpenModal('view', u)}
                        onEditRole={(u) => handleOpenModal('editRole', u)}
                        onDelete={(u) => handleOpenModal('delete', u)}
                    />

                    {/* Mobile & Tablet Card View (sm & md screens) */}
                    <UserCards
                        users={paginatedUsers}
                        onView={(u) => handleOpenModal('view', u)}
                        onEditRole={(u) => handleOpenModal('editRole', u)}
                        onDelete={(u) => handleOpenModal('delete', u)}
                    />

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-800">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                Page <span className="font-semibold text-gray-900 dark:text-white">{page}</span> of{' '}
                                <span className="font-semibold text-gray-900 dark:text-white">{totalPages}</span> ({users.length} total users)
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

            {/* Modal Component */}
            <UserModal
                key={modalState.user?._id || 'modal'}
                isOpen={modalState.isOpen}
                mode={modalState.mode}
                user={modalState.user}
                onClose={handleCloseModal}
                onSubmitRole={handleUpdateRole}
                onSubmitDelete={handleDeleteUser}
                isSubmitting={isSubmitting}
            />
        </div>
    );
}
