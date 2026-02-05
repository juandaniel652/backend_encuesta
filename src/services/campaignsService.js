import { supabase } from '../config/db.js';

// services/campaignsService.js
export async function getCampaigns() {
  const { data, error } = await supabase
    .from('campaigns')
    .select(`
      *,
      questions (
        *,
        question_options!question_options_question_id_fkey (*)
      )
    `)
    .order('position', { foreignTable: 'questions' });

  if (error) throw error;
  return data;
}


export async function createCampaign(payload) {
  if (!validateCampaign(payload)) {
    const err = new Error('Invalid campaign data');
    err.status = 400;
    throw err;
  }

  return payload;
}


