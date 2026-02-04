// controllers/questionOptionsController.js
export const createQuestionOption = async (req, res) => {
  const { question_id, text, position } = req.body;

  const { data, error } = await supabase
    .from('question_options')
    .insert([{ question_id, text, position }])
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};
