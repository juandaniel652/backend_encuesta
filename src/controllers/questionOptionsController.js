import { createQuestionOption as createOptionService } from '../services/campaignsService.js';

export async function createQuestionOption(req, res) {
  try {
    const { question_id, text } = req.body;

    if (!question_id || !text) {
      return res.status(400).json({ error: 'question_id y text son obligatorios' });
    }

    const option = await createOptionService({ question_id, text });
    res.json(option);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
}
