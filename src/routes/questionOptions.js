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
      .eq('is_active', true)
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
  const { question_id, text } = req.body;

  if (typeof text !== 'string') {
    return res.status(400).json({
      error: 'text debe ser string'
    });
  }

  try {
    // 1. Traer última posición
    const { data: lastOptions, error: posError } = await supabase
      .from('question_options')
      .select('position')
      .eq('question_id', question_id)
      .order('position', { ascending: false })
      .limit(1);

    if (posError) throw posError;

    const nextPosition = lastOptions.length > 0
      ? lastOptions[0].position + 1
      : 1;

    // 2. Insertar
    const { data, error } = await supabase
      .from('question_options')
      .insert([{
        question_id,
        text,
        position: nextPosition,
        is_active: true
      }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);

  } catch (err) {
    console.error('CREATE QUESTION OPTION ERROR:', err);
    res.status(500).json({ error: err.message });
  }
});
