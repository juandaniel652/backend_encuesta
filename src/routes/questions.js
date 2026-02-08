import { Router } from 'express';
import { supabase } from '../config/db.js';

const router = Router();

/**
 * GET /questions/campaign/:campaignId
 * Devuelve todas las preguntas de una campaña
 */
router.get('/campaign/:campaignId', async (req, res) => {
  const { campaignId } = req.params;

  try {
    const { data, error } = await supabase
      .from('questions')
      .select('id, campaign_id, text, type, position')
      .eq('campaign_id', campaignId)
      .eq('is_active', true)
      .order('position', { ascending: true });

    if (error) throw error;

    res.json(data || []);
  } catch (err) {
    console.error('GET QUESTIONS ERROR:', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /questions
 * Crea una nueva pregunta en Supabase
 * body: { campaign_id, text, type, position }
 */
router.post('/', async (req, res) => {
  const { campaign_id, text, type, position } = req.body;

  try {
    const { data, error } = await supabase
      .from('questions')
      .insert([{ campaign_id, text, type, position }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (err) {
    console.error('CREATE QUESTION ERROR:', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * DELETE /questions/:id
 * Borra una pregunta
 */
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const { data, error } = await supabase
      .from('questions')
      .update({ is_active: false })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Question not found' });

    res.json({ success: true, deleted: data });
  } catch (err) {
    console.error('SOFT DELETE QUESTION ERROR:', err);
    res.status(500).json({ error: err.message });
  }
});


export default router;
