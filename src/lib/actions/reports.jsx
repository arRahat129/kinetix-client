'use server';

import { serverMutation } from "../core/server";

export const createReport = async (reportData) => {
    const result = await serverMutation('/api/reports', reportData, 'POST');
    return result;
};

export const updateReportStatus = async (id, status) => {
    const result = await serverMutation(`/api/admin/reports/${id}/status`, { status }, 'PATCH');
    return result;
};

export const deleteReport = async (id) => {
    const result = await serverMutation(`/api/admin/reports/${id}`, {}, 'DELETE');
    return result;
};
