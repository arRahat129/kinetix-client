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

export const updateContribution = async (id, contributionData) => {
  const result = await serverMutation(`/api/contributions/${id}`, contributionData, 'PATCH');
  return result;
};

export const deleteContribution = async (id) => {
  const result = await serverMutation(`/api/contributions/${id}`, {}, 'DELETE');
  return result;
};
