import { serverFetch } from "../core/server";

export const getCreatorWithdrawals = async (creatorEmail) => {
  if (!creatorEmail) return { success: false, data: [] };
  return await serverFetch(`/api/withdrawals/creator?creatorEmail=${encodeURIComponent(creatorEmail)}`);
};

export const getAdminWithdrawals = async ({ status = '', search = '', page = 1, limit = 10 } = {}) => {
  const params = new URLSearchParams();
  if (status) params.append('status', status);
  if (search) params.append('search', search);
  if (page) params.append('page', page.toString());
  if (limit) params.append('limit', limit.toString());
  return await serverFetch(`/api/admin/withdrawals?${params.toString()}`);
};
