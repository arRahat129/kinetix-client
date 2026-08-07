import { serverFetch } from "../core/server";

export const getNotifications = async (email, role) => {
    if (!email) return { success: false, data: [] };
    const params = new URLSearchParams();
    params.append('email', email);
    if (role) params.append('role', role);

    return await serverFetch(`/api/notifications?${params.toString()}`);
};

export const markNotificationAsRead = async (id, email) => {
    return await serverFetch(`/api/notifications/${id}/read`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
    });
};

export const markAllNotificationsAsRead = async (email, role) => {
    return await serverFetch(`/api/notifications/read-all`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role })
    });
};
