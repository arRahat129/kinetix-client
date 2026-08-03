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

export const getApprovedCampaigns = async ({ search = '', category = '', minGoal = '', maxGoal = '', sortBy = 'createdAt', sortOrder = 'desc', page = 1, limit = 10 } = {}) => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (category) params.append('category', category);
    if (minGoal) params.append('minGoal', minGoal);
    if (maxGoal) params.append('maxGoal', maxGoal);
    if (sortBy) params.append('sortBy', sortBy);
    if (sortOrder) params.append('sortOrder', sortOrder);
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());

    return await serverFetch(`/api/campaigns/approved?${params.toString()}`);
};
