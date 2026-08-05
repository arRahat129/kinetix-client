'use server';

import { serverMutation } from "../core/server";

export const createWithdrawal = async (withdrawalData) => {
  const result = await serverMutation('/api/withdrawals', withdrawalData, 'POST');
  return result;
};
