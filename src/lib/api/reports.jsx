import { serverFetch } from "../core/server";

export const getAllReportsAdmin = async ({ search = '', status = '', page = 1, limit = 10 } = {}) => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (status) params.append('status', status);
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());

    return await serverFetch(`/api/admin/reports?${params.toString()}`);
};

export const getReportById = async (id) => {
    return await serverFetch(`/api/reports/${id}`);
};
