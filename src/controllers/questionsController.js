// controllers/questionsController.js
import { supabase } from '../config/supabaseClient.js';

export const createQuestion = async (req, res) => {
  const { campaign_id, text, type, position } = req.body;

  const { data, error } = await supabase
    .from('questions')
    .insert([{
      campaign_id,
      text,
      type,
      position
    }])
    .select()
    .single();

  if (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
};
