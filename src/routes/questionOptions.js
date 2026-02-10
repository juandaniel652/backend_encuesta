import { Router } from 'express';
import { supabase } from '../config/db.js';

const router = Router();

/**
 * GET /question-options/:questionId
 * Devuelve todas las opciones de una pregunta
 */
router.get('/:questionId', async (req, res) => {
  const { questionId } = req.params;

  try {
    const { data, error } = await supabase
      .from('question_options')
      .select('id, question_id, text, position, is_active')
      .eq('question_id', questionId)
      .order('position', { ascending: true });

    if (error) throw error;

    res.json(data || []);
  } catch (err) {
    console.error('GET QUESTION OPTIONS ERROR:', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /question-options
 * Crea una nueva opción para una pregunta
 * body: { question_id, text, position }
 */
router.post('/', async (req, res) => {
  const { question_id, text, position } = req.body;

  try {
    const { data, error } = await supabase
      .from('question_options')
      .insert([{ question_id, text, position }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (err) {
    console.error('CREATE QUESTION OPTION ERROR:', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * DELETE /question-options/:id
 * Borra una opción
 */
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const { data, error } = await supabase
      .from('question_options')
      .delete()
      .eq('id', id)
      .select();

    if (error) throw error;
    if (!data || data.length === 0) return res.status(404).json({ error: 'Option not found' });

    res.json({ success: true, deleted: data[0] });
  } catch (err) {
    console.error('DELETE QUESTION OPTION ERROR:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
