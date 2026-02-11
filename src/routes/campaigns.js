import { Router } from 'express';
import { supabase } from '../config/db.js';

const router = Router();

router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('campaigns')
    .select('*');

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Campaign
    const { data: campaign, error: campErr } = await supabase
      .from('campaigns')
      .select('*')
      .eq('id', id)
      .single();

    if (campErr) throw campErr;

    // Questions
    const { data: questions, error: qErr } = await supabase
      .from('questions')
      .select('*')
      .eq('campaign_id', id)
      .eq('is_active', true)
      .order('position');

    if (qErr) throw qErr;

    // Options
    for (const q of questions) {
      const { data: options, error: oErr } = await supabase
        .from('question_options')
        .select('*')
        .eq('question_id', q.id)
        .eq('is_active', true)
        .order('position');

      if (oErr) throw oErr;
      q.options = options || [];
    }

    res.json({
      ...campaign,
      questions
    });

  } catch (err) {
    console.error('GET CAMPAIGN FULL ERROR', err);
    res.status(500).json({ error: err.message });
  }
});


router.put('/:id/full', async (req, res) => {
  const { id } = req.params;
  const { campaign, questions } = req.body;

  try {
    // actualizar campaña
    const { error: campaignError } = await supabase
      .from('campaigns')
      .update(campaign)
      .eq('id', id);

    if (campaignError) throw campaignError;

    // actualizar preguntas
    for (const q of questions) {
      await supabase
        .from('questions')
        .update({
          text: q.text,
          type: q.type,
          position: q.position,
          is_active: q.is_active
        })
        .eq('id', q.id);
    }

    res.json({ success: true });
  } catch (err) {
    console.error('FULL SAVE ERROR:', err);
    res.status(500).json({ error: err.message });
  }
});



export default router;
