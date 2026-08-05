'use server';

import { serverMutation } from "../core/server";

export const createWithdrawal = async (withdrawalData) => {
  const result = await serverMutation('/api/withdrawals', withdrawalData, 'POST');
  return result;
};

export const updateWithdrawal = async (id, withdrawalData) => {
  const result = await serverMutation(`/api/withdrawals/${id}`, withdrawalData, 'PATCH');
  return result;
};

export const deleteWithdrawal = async (id) => {
  const result = await serverMutation(`/api/withdrawals/${id}`, {}, 'DELETE');
  return result;
};

export const updateWithdrawalStatus = async (id, statusData) => {
  const result = await serverMutation(`/api/admin/withdrawals/${id}/status`, statusData, 'PATCH');
  return result;
};
