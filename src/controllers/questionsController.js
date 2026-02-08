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



export const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('questions')
      .delete()
      .eq('id', id);

    if (error) {
      if (error.code === '23503') {
        return res.status(400).json({
          error: 'No se puede borrar una pregunta que ya tiene respuestas'
        });
      }
      throw error;
    }

    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

