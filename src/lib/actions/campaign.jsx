'use server';

import { serverMutation } from "../core/server";

export const createCampaign = async (campaignData) => {
    const result = await serverMutation('/api/campaigns', campaignData, 'POST');
    return result;
}