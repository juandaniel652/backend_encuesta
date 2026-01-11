import db from '../config/db.js';

export const saveResponse = async (payload) => {
  const { error } = await db.rpc('save_response', {
    p_campaign_id: payload.campaignId,
    p_client_number: payload.clientNumber,
    p_client_name: payload.clientName,
    p_answers: payload.answers
  });

  if (error) {
    if (error.code === '23505') {
      throw new Error('Este cliente ya respondió la encuesta');
    }
    throw error;
  }
};
