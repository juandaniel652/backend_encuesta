import { createQuestion as createQuestionService } from '../services/campaignsService.js';

export async function createQuestion(req, res) {
  try {
    const data = await createQuestionService(req.body);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
}
