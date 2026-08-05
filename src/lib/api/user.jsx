import { serverFetch } from "../core/server";

export const getAllUsers = async ({ search = '', role = '' } = {}) => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (role) params.append('role', role);

    return await serverFetch(`/api/admin/users?${params.toString()}`);
};

export const getAdminStats = async () => {
    return await serverFetch("/api/admin/stats");
};
