import { serverFetch } from "../core/server";

export const getAllReviewsAdmin = async ({ search = '', page = 1, limit = 10 } = {}) => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());

    return await serverFetch(`/api/admin/reviews?${params.toString()}`);
};

export const getReviewsByCampaignId = async (campaignId, { page = 1, limit = 10 } = {}) => {
    const params = new URLSearchParams();
    if (campaignId) params.append('campaignId', campaignId);
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());

    return await serverFetch(`/api/reviews?${params.toString()}`);
};

export const getFeaturedReviews = async () => {
    return await serverFetch('/api/reviews/featured');
};
