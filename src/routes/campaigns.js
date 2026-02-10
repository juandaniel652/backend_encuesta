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
  const { name, client_type, date_start, date_end } = req.body;

  const { data, error } = await supabase
    .from('campaigns')
    .insert([{ name, client_type, date_start, date_end }])
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

// UPDATE (el que te falla)
router.put('/:id/full', async (req, res) => {
  const { id } = req.params;
  const { campaign, questions } = req.body;

  try {
    // 1. update campaign
    await supabase
      .from('campaigns')
      .update(campaign)
      .eq('id', id);

    // 2. questions
    for (const q of questions) {

      let questionId = q.id;

      if (!questionId) {
        // INSERT
        const { data: newQ } = await supabase
          .from('questions')
          .insert([{
            campaign_id: id,
            text: q.text,
            position: q.position,
            is_active: true
          }])
          .select()
          .single();

        questionId = newQ.id;
      } else {
        // UPDATE
        await supabase
          .from('questions')
          .update({
            text: q.text,
            position: q.position,
            is_active: q.is_active !== false
          })
          .eq('id', questionId);
      }

      // 3. options
      for (const o of q.options || []) {

        if (!o.id) {
          await supabase
            .from('question_options')
            .insert([{
              question_id: questionId,
              text: o.text,
              is_active: true
            }]);
        } else {
          await supabase
            .from('question_options')
            .update({
              text: o.text,
              is_active: o.is_active !== false
            })
            .eq('id', o.id);
        }
      }
    }

    res.json({ success: true });

  } catch (err) {
    console.error('FULL SAVE ERROR:', err);
    res.status(500).json({ error: err.message });
  }
});


export default router;
