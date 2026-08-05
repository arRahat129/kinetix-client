import { serverFetch } from "../core/server";

export const getContributions = async ({
  supporterEmail = '',
  creatorEmail = '',
  campaignId = '',
  status = '',
  search = '',
  sortBy = 'createdAt',
  sortOrder = 'desc',
  page = 1,
  limit = 10
} = {}) => {
  const params = new URLSearchParams();
  if (supporterEmail) params.append('supporterEmail', supporterEmail);
  if (creatorEmail) params.append('creatorEmail', creatorEmail);
  if (campaignId) params.append('campaignId', campaignId);
  if (status) params.append('status', status);
  if (search) params.append('search', search);
  if (sortBy) params.append('sortBy', sortBy);
  if (sortOrder) params.append('sortOrder', sortOrder);
  if (page) params.append('page', page.toString());
  if (limit) params.append('limit', limit.toString());

  return await serverFetch(`/api/contributions?${params.toString()}`);
};

export const getSupporterStats = async (supporterEmail) => {
  if (!supporterEmail) return { success: false, message: 'Missing supporter email' };
  return await serverFetch(`/api/supporter/stats?supporterEmail=${encodeURIComponent(supporterEmail)}`);
};

export const getCreatorStats = async ({ creatorEmail, userId } = {}) => {
  const params = new URLSearchParams();
  if (creatorEmail) params.append('creatorEmail', creatorEmail);
  if (userId) params.append('userId', userId);
  return await serverFetch(`/api/creator/stats?${params.toString()}`);
};
