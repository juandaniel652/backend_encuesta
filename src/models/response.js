import db from '../config/db.js';

export const existsForCampaign = async (campaignId, clientId) => {
  const { data } = await db
    .from('responses')
    .select('id')
    .eq('campaign_id', campaignId)
    .eq('client_id', clientId)
    .single();

  return !!data;
};

export const create = async (campaignId, clientId) => {
  const { data } = await db
    .from('responses')
    .insert({ campaign_id: campaignId, client_id: clientId })
    .select()
    .single();

  return data;
};
