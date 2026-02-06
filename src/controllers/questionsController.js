// controllers/questionsController.js
import { createQuestion as createQuestionService } from '../services/questionsService.js';

export async function createQuestion(req, res) {
  try {
    const payload = req.body; // { campaign_id, text, type, position }
    const question = await createQuestionService(payload);
    res.json(question);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
