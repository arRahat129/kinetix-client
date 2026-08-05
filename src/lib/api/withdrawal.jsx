import { serverFetch } from "../core/server";

export const getCreatorWithdrawals = async (creatorEmail) => {
  if (!creatorEmail) return { success: false, data: [] };
  return await serverFetch(`/api/withdrawals/creator?creatorEmail=${encodeURIComponent(creatorEmail)}`);
};
