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


router.post('/', async (req, res) => {
  const { campaign_id, text, type } = req.body;

  try {
    const { data: lastQuestions, error: posError } = await supabase
      .from('questions')
      .select('position')
      .eq('campaign_id', campaign_id)
      .order('position', { ascending: false })
      .limit(1);

    if (posError) throw posError;

    const nextPosition = lastQuestions.length > 0
      ? lastQuestions[0].position + 1
      : 1;

    const { data, error } = await supabase
      .from('questions')
      .insert([{
        campaign_id,
        text,
        type,
        position: nextPosition,
        is_active: true
      }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (err) {
    console.error('CREATE QUESTION ERROR:', err);
    res.status(500).json({ error: err.message });
  }
});



export default router;
