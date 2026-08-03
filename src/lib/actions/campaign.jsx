'use server';

import { serverMutation } from "../core/server";

export const createCampaign = async (campaignData) => {
    const result = await serverMutation('/api/campaigns', campaignData, 'POST');
    return result;
}

export const updateCampaign = async (id, updatedData) => {
    const result = await serverMutation(`/api/campaigns/${id}`, updatedData, 'PATCH');
    return result;
}

export const deleteCampaign = async (id) => {
    const result = await serverMutation(`/api/campaigns/${id}`, {}, 'DELETE');
    return result;
}

export const updateCampaignStatus = async (id, status) => {
    const result = await serverMutation(`/api/admin/campaigns/${id}/status`, { status }, 'PATCH');
    return result;
}
