'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { getAllReviewsAdmin } from '@/lib/api/reviews';
import { toggleFeaturedReview, deleteReview } from '@/lib/actions/reviews';
import {
  FiStar, FiSearch, FiRefreshCw, FiEye,
  FiTrash2, FiChevronLeft, FiChevronRight, FiCheckCircle, FiX
} from 'react-icons/fi';
import toast from 'react-hot-toast';

function StarRating({ value }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <FiStar
          key={star}
          className={`w-4 h-4 ${
            star <= value
              ? 'fill-amber-400 text-amber-400'
              : 'text-slate-300 dark:text-slate-700'
          }`}
        />
      ))}
    </div>
  );
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filters & Pagination
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Modal State
  const [selectedReview, setSelectedReview] = useState(null);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAllReviewsAdmin({
        search,
        page,
        limit: 10
      });

      if (res?.data) {
        setReviews(res.data);
        setTotalPages(res.totalPages || 1);
        setTotalItems(res.total || 0);
      } else {
        setReviews([]);
        setTotalPages(1);
        setTotalItems(0);
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
      toast.error(error.message || 'Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  }, [search, page]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleToggleFeatured = async (reviewId, currentFeaturedState) => {
    setIsSubmitting(true);
    const newFeaturedState = !currentFeaturedState;
    const toastId = toast.loading(newFeaturedState ? 'Marking as featured...' : 'Unmarking featured...');
    try {
      const res = await toggleFeaturedReview(reviewId, newFeaturedState);
      if (res?.success) {
        toast.success(newFeaturedState ? 'Review set as featured on homepage!' : 'Review removed from featured.', { id: toastId });
        if (selectedReview?._id === reviewId) {
          setSelectedReview(prev => prev ? { ...prev, isFeatured: newFeaturedState } : null);
        }
        fetchReviews();
      } else {
        throw new Error(res?.message || 'Failed to toggle featured status');
      }
    } catch (err) {
      toast.error(err.message || 'Action failed', { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    setIsSubmitting(true);
    const toastId = toast.loading('Deleting review...');
    try {
      const res = await deleteReview(reviewId);
      if (res?.success) {
        toast.success('Review deleted successfully!', { id: toastId });
        if (selectedReview?._id === reviewId) {
          setSelectedReview(null);
        }
        fetchReviews();
      } else {
        throw new Error(res?.message || 'Failed to delete review');
      }
    } catch (err) {
      toast.error(err.message || 'Delete failed', { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <FiStar className="text-amber-400 fill-amber-400" />
            Manage Reviews & Testimonials
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Review supporter feedback, toggle featured status for homepage testimonials, and delete inappropriate content.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-1/3">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by campaign, user, or review text..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-11 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-amber-500/50 transition-all shadow-sm"
          />
        </div>

        <button
          onClick={() => {
            fetchReviews();
            toast.success('Reviews list refreshed!');
          }}
          className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-amber-500 transition-all shadow-sm flex items-center gap-2 text-xs font-semibold"
        >
          <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      {/* Reviews Content */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-slate-400">
          <FiRefreshCw className="w-8 h-8 animate-spin text-amber-400 mb-3" />
          <p className="text-sm">Loading reviews...</p>
        </div>
      ) : reviews.length === 0 ? (
        <div className="py-16 text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-white/30 dark:bg-slate-900/30 p-8">
          <FiStar className="w-10 h-10 text-slate-400 mx-auto mb-3 opacity-60" />
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">No reviews found</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
            {search ? 'No reviews match your current search.' : 'There are currently no reviews submitted for campaigns.'}
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl shadow-xl">
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-100/70 dark:bg-slate-800/70 uppercase text-xs text-slate-500 dark:text-slate-400 tracking-wider">
                <tr>
                  <th scope="col" className="px-6 py-4">User</th>
                  <th scope="col" className="px-6 py-4">Campaign</th>
                  <th scope="col" className="px-6 py-4">Rating</th>
                  <th scope="col" className="px-6 py-4">Review</th>
                  <th scope="col" className="px-6 py-4">Featured</th>
                  <th scope="col" className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {reviews.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {item.userImage ? (
                          <img src={item.userImage} alt={item.userName} className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700" />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                            {(item.userName || '?')[0].toUpperCase()}
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white text-xs">{item.userName}</p>
                          <p className="text-[11px] text-slate-400">{item.userEmail}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 max-w-xs">
                        {item.campaignImage && (
                          <img src={item.campaignImage} alt={item.campaignName} className="w-8 h-8 rounded-lg object-cover" />
                        )}
                        <span className="font-medium text-slate-800 dark:text-slate-200 truncate" title={item.campaignName}>
                          {item.campaignName}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <StarRating value={item.rating} />
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 max-w-xs italic">
                        &ldquo;{item.comment}&rdquo;
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleFeatured(item._id, item.isFeatured)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold transition-all border ${
                          item.isFeatured
                            ? 'bg-amber-400/20 text-amber-600 dark:text-amber-300 border-amber-400/30'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700 hover:border-amber-400'
                        }`}
                      >
                        {item.isFeatured ? '★ Featured' : 'Mark Featured'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedReview(item)}
                          title="View Review Details"
                          className="p-2 text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 rounded-lg transition-colors"
                        >
                          <FiEye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteReview(item._id)}
                          title="Delete Review"
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
            {reviews.map((item) => (
              <div key={item._id} className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    {item.userImage ? (
                      <img src={item.userImage} alt={item.userName} className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">
                        {(item.userName || '?')[0].toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">{item.userName}</p>
                      <p className="text-[10px] text-slate-400">{new Date(item.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <StarRating value={item.rating} />
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs">
                  <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1 line-clamp-1">
                    Campaign: {item.campaignName}
                  </p>
                  <p className="text-slate-600 dark:text-slate-300 italic line-clamp-3">&ldquo;{item.comment}&rdquo;</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => handleToggleFeatured(item._id, item.isFeatured)}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition border ${
                      item.isFeatured
                        ? 'bg-amber-400/20 text-amber-600 dark:text-amber-300 border-amber-400/30'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {item.isFeatured ? '★ Featured' : 'Mark Featured'}
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedReview(item)}
                      className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-indigo-600"
                    >
                      <FiEye size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteReview(item._id)}
                      className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-rose-600"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Page <span className="font-semibold text-slate-900 dark:text-white">{page}</span> of{' '}
                <span className="font-semibold text-slate-900 dark:text-white">{totalPages}</span> ({totalItems} total reviews)
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

      {/* View Review Modal */}
      {selectedReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FiStar className="text-amber-400 fill-amber-400" /> Review Details
              </h3>
              <button
                onClick={() => setSelectedReview(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <FiX size={18} />
              </button>
            </div>

            {/* Reviewer Profile */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              {selectedReview.userImage ? (
                <img src={selectedReview.userImage} alt={selectedReview.userName} className="w-10 h-10 rounded-full object-cover" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                  {(selectedReview.userName || '?')[0].toUpperCase()}
                </div>
              )}
              <div>
                <p className="font-bold text-slate-900 dark:text-white text-sm">{selectedReview.userName}</p>
                <p className="text-xs text-slate-400">{selectedReview.userEmail}</p>
              </div>
            </div>

            {/* Campaign info */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 space-y-1">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Campaign</p>
              <p className="font-bold text-slate-900 dark:text-white text-sm">{selectedReview.campaignName}</p>
              <p className="text-xs text-slate-400">Creator: {selectedReview.creatorName} ({selectedReview.creatorEmail})</p>
            </div>

            {/* Rating and Comment */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Rating</span>
                <StarRating value={selectedReview.rating} />
              </div>
              <div className="p-4 rounded-xl bg-amber-50/40 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/30 text-sm text-slate-800 dark:text-slate-200 leading-relaxed italic">
                &ldquo;{selectedReview.comment}&rdquo;
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => handleToggleFeatured(selectedReview._id, selectedReview.isFeatured)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition border ${
                  selectedReview.isFeatured
                    ? 'bg-amber-400/20 text-amber-600 border-amber-400/40'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 border-slate-200 dark:border-slate-700'
                }`}
              >
                {selectedReview.isFeatured ? '★ Featured on Homepage' : 'Mark as Featured'}
              </button>

              <button
                onClick={() => setSelectedReview(null)}
                className="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
