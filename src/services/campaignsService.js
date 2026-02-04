import { supabase } from '../config/db.js';

// services/campaignsService.js
export async function getCampaigns() {
  const { data, error } = await supabase
    .from('campaigns')
    .select(`
      *,
      questions (
        *,
        question_options (*)
      )
    `)
    .order('position', { foreignTable: 'questions' });

  if (error) throw error;
  return data;
}


function validateCampaign(payload) {
  if (!payload?.name) return false;
  if (!Array.isArray(payload.questions)) return false;
  if (payload.questions.length === 0) return false;

  for (const q of payload.questions) {
    if (!q.text) return false;
  }

  return true;
}

export async function createCampaign(payload) {
  if (!validateCampaign(payload)) {
    const err = new Error('Invalid campaign data');
    err.status = 400;
    throw err;
  }

  return payload;
}


