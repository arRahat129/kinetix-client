'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getAllReportsAdmin } from '@/lib/api/reports';
import { updateReportStatus, deleteReport } from '@/lib/actions/reports';
import {
  FiPieChart, FiSearch, FiFilter, FiRefreshCw, FiEye,
  FiExternalLink, FiCheckCircle, FiXCircle, FiTrash2,
  FiChevronLeft, FiChevronRight, FiClock, FiAlertTriangle, FiX
} from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function AdminReportsPage() {
  const router = useRouter();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filters & Pagination
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Selected Report Modal
  const [selectedReport, setSelectedReport] = useState(null);

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAllReportsAdmin({
        search,
        status: statusFilter,
        page,
        limit: 10
      });

      if (res?.data) {
        setReports(res.data);
        setTotalPages(res.totalPages || 1);
        setTotalItems(res.total || 0);
      } else {
        setReports([]);
        setTotalPages(1);
        setTotalItems(0);
      }
    } catch (error) {
      console.error('Failed to fetch reports:', error);
      toast.error(error.message || 'Failed to fetch reports');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, page]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handleTakeAction = (campaignId) => {
    if (!campaignId) {
      toast.error("Campaign ID not found");
      return;
    }
    router.push(`/dashboard/admin/manage-campaigns?highlight=${campaignId}`);
  };

  const handleUpdateStatus = async (reportId, newStatus) => {
    setIsSubmitting(true);
    const toastId = toast.loading(`Updating report status...`);
    try {
      const res = await updateReportStatus(reportId, newStatus);
      if (res?.success) {
        toast.success(`Report marked as ${newStatus}`, { id: toastId });
        if (selectedReport?._id === reportId) {
          setSelectedReport(prev => prev ? { ...prev, status: newStatus } : null);
        }
        fetchReports();
      } else {
        throw new Error(res?.message || 'Failed to update report status');
      }
    } catch (err) {
      toast.error(err.message || 'Update failed', { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteReport = async (reportId) => {
    if (!confirm("Are you sure you want to delete this report?")) return;
    setIsSubmitting(true);
    const toastId = toast.loading("Deleting report...");
    try {
      const res = await deleteReport(reportId);
      if (res?.success) {
        toast.success("Report deleted", { id: toastId });
        if (selectedReport?._id === reportId) {
          setSelectedReport(null);
        }
        fetchReports();
      } else {
        throw new Error(res?.message || "Failed to delete report");
      }
    } catch (err) {
      toast.error(err.message || "Delete failed", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'resolved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <FiCheckCircle size={12} /> Resolved
          </span>
        );
      case 'dismissed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20">
            <FiXCircle size={12} /> Dismissed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <FiClock size={12} /> Pending Review
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <FiPieChart className="text-rose-500" />
            Campaign Reports
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Review user reports, inspect flagged campaigns, and take administrative actions.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-1/3">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by campaign, user, or reason..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-11 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-rose-500/50 transition-all shadow-sm"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400">
            <FiFilter className="w-4 h-4" /> Status:
          </div>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-rose-500/50 cursor-pointer shadow-sm"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="resolved">Resolved</option>
            <option value="dismissed">Dismissed</option>
          </select>

          <button
            onClick={() => {
              fetchReports();
              toast.success('Reports list refreshed!');
            }}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-rose-500 transition-all shadow-sm"
          >
            <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Reports Table / Card Content */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-slate-400">
          <FiRefreshCw className="w-8 h-8 animate-spin text-rose-500 mb-3" />
          <p className="text-sm">Loading campaign reports...</p>
        </div>
      ) : reports.length === 0 ? (
        <div className="py-16 text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-white/30 dark:bg-slate-900/30 p-8">
          <FiAlertTriangle className="w-10 h-10 text-slate-400 mx-auto mb-3 opacity-60" />
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">No reports found</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
            {search || statusFilter ? 'No reports match your current filter criteria.' : 'There are currently no reports submitted by users.'}
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl shadow-xl">
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-100/70 dark:bg-slate-800/70 uppercase text-xs text-slate-500 dark:text-slate-400 tracking-wider">
                <tr>
                  <th scope="col" className="px-6 py-4">Reported Campaign</th>
                  <th scope="col" className="px-6 py-4">Reporter</th>
                  <th scope="col" className="px-6 py-4">Reason</th>
                  <th scope="col" className="px-6 py-4">Date</th>
                  <th scope="col" className="px-6 py-4">Status</th>
                  <th scope="col" className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {reports.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {item.campaignImage ? (
                          <img src={item.campaignImage} alt={item.campaignName} className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-slate-700" />
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-amber-500 flex items-center justify-center text-white font-bold text-xs">
                            {(item.campaignName || 'C')[0].toUpperCase()}
                          </div>
                        )}
                        <div className="max-w-xs">
                          <div className="font-semibold text-slate-900 dark:text-white truncate" title={item.campaignName}>
                            {item.campaignName || 'Untitled Campaign'}
                          </div>
                          <div className="text-xs text-slate-400 truncate">
                            Creator: {item.creatorName || item.creatorEmail || 'Unknown'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {item.userImage ? (
                          <img src={item.userImage} alt={item.userName} className="w-7 h-7 rounded-full object-cover" />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-slate-300 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-700 dark:text-slate-300">
                            {(item.userName || '?')[0].toUpperCase()}
                          </div>
                        )}
                        <div>
                          <div className="text-xs font-semibold text-slate-900 dark:text-white">{item.userName}</div>
                          <div className="text-[11px] text-slate-400">{item.userEmail}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs font-medium border border-rose-200 dark:border-rose-900">
                        {item.reason}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-400">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(item.status)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* View details */}
                        <button
                          onClick={() => setSelectedReport(item)}
                          title="View Details"
                          className="p-2 text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 rounded-lg transition-colors"
                        >
                          <FiEye className="w-4 h-4" />
                        </button>

                        {/* Take Action -> Jump to campaign in manage-campaigns */}
                        <button
                          onClick={() => handleTakeAction(item.campaignId)}
                          title="Take Action (Go to Campaign)"
                          className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold transition-all shadow flex items-center gap-1.5"
                        >
                          <FiExternalLink className="w-3.5 h-3.5" />
                          <span>Take Action</span>
                        </button>

                        {/* Mark Resolved */}
                        {item.status !== 'resolved' && (
                          <button
                            onClick={() => handleUpdateStatus(item._id, 'resolved')}
                            title="Mark Resolved"
                            className="p-2 text-slate-600 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-lg transition-colors"
                          >
                            <FiCheckCircle className="w-4 h-4" />
                          </button>
                        )}

                        {/* Delete */}
                        <button
                          onClick={() => handleDeleteReport(item._id)}
                          title="Delete Report"
                          className="p-2 text-slate-600 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
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

          {/* Mobile Grid View */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden">
            {reports.map((item) => (
              <div key={item._id} className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 shadow-sm space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {item.campaignImage ? (
                      <img src={item.campaignImage} alt={item.campaignName} className="w-12 h-12 rounded-xl object-cover" />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-amber-500 flex items-center justify-center text-white font-bold">
                        {(item.campaignName || 'C')[0].toUpperCase()}
                      </div>
                    )}
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-1">{item.campaignName}</h4>
                      <p className="text-xs text-slate-400">By: {item.creatorName || 'Unknown'}</p>
                    </div>
                  </div>
                  {getStatusBadge(item.status)}
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-xs space-y-1">
                  <p className="font-semibold text-rose-600 dark:text-rose-400">Reason: {item.reason}</p>
                  {item.details && <p className="text-slate-600 dark:text-slate-300 italic line-clamp-2">&ldquo;{item.details}&rdquo;</p>}
                  <p className="text-[11px] text-slate-400 pt-1">Reported by {item.userName} ({item.userEmail}) on {new Date(item.createdAt).toLocaleDateString()}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => setSelectedReport(item)}
                    className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold flex items-center gap-1"
                  >
                    <FiEye size={14} /> View Details
                  </button>

                  <button
                    onClick={() => handleTakeAction(item.campaignId)}
                    className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold transition flex items-center gap-1"
                  >
                    <FiExternalLink size={13} /> Take Action
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Page <span className="font-semibold text-slate-900 dark:text-white">{page}</span> of{' '}
                <span className="font-semibold text-slate-900 dark:text-white">{totalPages}</span> ({totalItems} total reports)
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 transition-colors"
                >
                  <FiChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 transition-colors"
                >
                  <FiChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Report Details Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FiAlertTriangle className="text-rose-500" /> Report Details
              </h3>
              <button
                onClick={() => setSelectedReport(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Campaign Section */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 space-y-3">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Campaign Information</p>
              <div className="flex items-center gap-3">
                {selectedReport.campaignImage && (
                  <img src={selectedReport.campaignImage} alt={selectedReport.campaignName} className="w-14 h-14 rounded-xl object-cover" />
                )}
                <div>
                  <p className="font-bold text-slate-900 dark:text-white text-base">{selectedReport.campaignName}</p>
                  <p className="text-xs text-slate-500">ID: {selectedReport.campaignId}</p>
                  <p className="text-xs text-slate-400 mt-0.5">Creator: {selectedReport.creatorName} ({selectedReport.creatorEmail})</p>
                </div>
              </div>
            </div>

            {/* Reporter Section */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 space-y-3">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Reporting User</p>
              <div className="flex items-center gap-3">
                {selectedReport.userImage ? (
                  <img src={selectedReport.userImage} alt={selectedReport.userName} className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-slate-300 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-700 dark:text-slate-200">
                    {(selectedReport.userName || '?')[0]}
                  </div>
                )}
                <div>
                  <p className="font-bold text-slate-900 dark:text-white text-sm">{selectedReport.userName}</p>
                  <p className="text-xs text-slate-400">{selectedReport.userEmail}</p>
                  <p className="text-[11px] text-slate-400">User ID: {selectedReport.userId}</p>
                </div>
              </div>
            </div>

            {/* Concern Details */}
            <div className="space-y-2">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Reason & Complaint</p>
              <p className="text-sm font-semibold text-rose-600 dark:text-rose-400">{selectedReport.reason}</p>
              <p className="text-sm text-slate-700 dark:text-slate-300 p-3 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 leading-relaxed whitespace-pre-line">
                {selectedReport.details || 'No additional details provided.'}
              </p>
            </div>

            {/* Footer Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => handleTakeAction(selectedReport.campaignId)}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-2"
              >
                <FiExternalLink size={14} /> Go to Campaign in Dashboard
              </button>

              <div className="flex items-center gap-2">
                {selectedReport.status !== 'resolved' && (
                  <button
                    onClick={() => handleUpdateStatus(selectedReport._id, 'resolved')}
                    className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold transition"
                  >
                    Mark Resolved
                  </button>
                )}
                <button
                  onClick={() => setSelectedReport(null)}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
