import { createQuestion as createQuestionService } from '../services/campaignsService.js';
import { deleteQuestion as deleteQuestionService } from '../services/campaignsService.js';

export async function createQuestion(req, res) {
  try {
    const data = await createQuestionService(req.body);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
}



export async function deleteQuestion(req, res) {
  try {
    const { id } = req.params;
    await deleteQuestionService(id);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
}

