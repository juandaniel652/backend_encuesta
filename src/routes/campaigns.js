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

  const { data, error } = await supabase
    .from('campaigns')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return res.status(404).json({ error: error.message });
  res.json(data);
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
    // 1. Update campaign
    await supabase.from('campaigns')
      .update(campaign)
      .eq('id', id);

    // 2. Update questions
    for (const q of questions) {
      await supabase.from('questions')
        .update({
          text: q.text,
          is_active: q.is_active !== false
        })
        .eq('id', q.id);

      // 3. Update options
      for (const o of q.options) {
        await supabase.from('question_options')
          .update({
            text: o.text,
            is_active: o.is_active !== false
          })
          .eq('id', o.id);
      }
    }

    res.json({ success: true });
  } catch (err) {
    console.error('SAVE FULL CAMPAIGN ERROR', err);
    res.status(500).json({ error: err.message });
  }
});


export default router;
