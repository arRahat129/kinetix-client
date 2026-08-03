'use server';

import { serverMutation } from "../core/server";

export const deleteUser = async (id) => {
    const result = await serverMutation(`/api/admin/users/${id}`, {}, 'DELETE');
    return result;
};

export const updateUserRole = async (id, role) => {
    const result = await serverMutation(`/api/admin/users/${id}/role`, { role }, 'PATCH');
    return result;
};
