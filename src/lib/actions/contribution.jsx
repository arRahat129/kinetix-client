'use server';

import { serverMutation } from "../core/server";

export const createContribution = async (contributionData) => {
  const result = await serverMutation('/api/contributions', contributionData, 'POST');
  return result;
};

export const approveContribution = async (id) => {
  const result = await serverMutation(`/api/contributions/${id}/approve`, {}, 'PATCH');
  return result;
};

export const rejectContribution = async (id) => {
  const result = await serverMutation(`/api/contributions/${id}/reject`, {}, 'PATCH');
  return result;
};
