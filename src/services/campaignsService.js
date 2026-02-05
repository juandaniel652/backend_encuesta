import { supabase } from '../config/db.js';

function validateCampaign(payload) {
  if (!payload?.name) return false;
  return true;
}

// GET ALL
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

// GET BY ID
export async function getCampaignById(id) {
  const { data, error } = await supabase
    .from('campaigns')
    .select(`
      *,
      questions (
        *,
        question_options!question_options_question_id_fkey (*)
      )
    `)
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

// CREATE
export async function createCampaign(payload) {
  if (!validateCampaign(payload)) {
    const err = new Error('Invalid campaign data');
    err.status = 400;
    throw err;
  }

  const { data, error } = await supabase
    .from('campaigns')
    .insert(payload)
    .select()
    .single();

  if (error) throw error;
  return data;
}
