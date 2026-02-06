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

  // 1. Insert campaign
  const { data: campaign, error } = await supabase
    .from('campaigns')
    .insert([{
      name: payload.name,
      client_type: payload.clientType,
      date_start: payload.dateStart,
      date_end: payload.dateEnd
    }])
    .select()
    .single();

  if (error) throw error;

  // 2. Insert questions
  for (const q of payload.questions) {
    const { data: question } = await supabase
      .from('questions')
      .insert([{
        campaign_id: campaign.id,
        text: q.text,
        type: q.type,
        position: q.position
      }])
      .select()
      .single();

    // 3. Insert options
    if (q.options?.length) {
      const options = q.options.map(opt => ({
        question_id: question.id,
        text: opt.text
      }));

      await supabase.from('question_options').insert(options);
    }
  }

  return campaign;
}

export async function createQuestion(payload) {
  const { data, error } = await supabase
    .from('questions')
    .insert([{
      campaign_id: payload.campaign_id,
      text: payload.text,
      type: payload.type,
      position: payload.position
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteQuestion(id) {
  const { error } = await supabase
    .from('questions')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function createQuestionOption({ question_id, text }) {
  const { data, error } = await supabase
    .from('question_options')
    .insert([{ question_id, text }])
    .select()
    .single();

  if (error) throw error;
  return data;
}
