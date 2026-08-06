'use server';

import { serverMutation } from "../core/server";

export const createReview = async (reviewData) => {
    const result = await serverMutation('/api/reviews', reviewData, 'POST');
    return result;
};

export const toggleFeaturedReview = async (id, isFeatured) => {
    const result = await serverMutation(`/api/admin/reviews/${id}/featured`, { isFeatured }, 'PATCH');
    return result;
};

export const deleteReview = async (id) => {
    const result = await serverMutation(`/api/admin/reviews/${id}`, {}, 'DELETE');
    return result;
};
