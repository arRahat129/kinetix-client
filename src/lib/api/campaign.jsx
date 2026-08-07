import { serverFetch } from "../core/server";

export const getMyCampaigns = async ({ userId, search = '', status = '', sortBy = 'deadline', sortOrder = 'desc', page = 1, limit = 10 }) => {
    const params = new URLSearchParams();
    const targetUserId = userId;
    // console.log("targetUserId", targetUserId);
    if (targetUserId) params.append('userId', targetUserId);
    if (search) params.append('search', search);
    if (status) params.append('status', status);
    if (sortBy) params.append('sortBy', sortBy);
    if (sortOrder) params.append('sortOrder', sortOrder);
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());

    return await serverFetch(`/api/campaigns/my-campaigns?${params.toString()}`);
};

export const getCampaignById = async (id) => {
    return await serverFetch(`/api/campaigns/${id}`);
};



export const getApprovedCampaigns = async ({ search = '', category = '', sortBy = 'createdAt', sortOrder = 'desc', page = 1, limit = 10 } = {}) => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (category) params.append('category', category.toLowerCase());
    if (sortBy) params.append('sortBy', sortBy);
    if (sortOrder) params.append('sortOrder', sortOrder);
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());

    return await serverFetch(`/api/campaigns/approved?${params.toString()}`);
};

export const getAllCampaignsAdmin = async ({ search = '', status = '', page = 1, limit = 50 } = {}) => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (status) params.append('status', status);
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());

    return await serverFetch(`/api/admin/campaigns?${params.toString()}`);
};

export const getPendingCampaigns = async ({ search = '', page = 1, limit = 50 } = {}) => {
    return await getAllCampaignsAdmin({ search, status: 'pending', page, limit });
};

export const getTopFundedCampaigns = async (limit = 6) => {
    return await serverFetch(`/api/campaigns/top-funded?limit=${limit}`);
};

export const getPlatformImpactStats = async () => {
    return await serverFetch('/api/platform/impact');
};
