// services/questionsService.js
import { supabase } from '../config/db.js';

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
