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
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, client_type, date_start, date_end } = req.body;

    const { data, error } = await supabase
      .from('campaigns')
      .update({ name, client_type, date_start, date_end })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.json(data);
  } catch (err) {
    console.error('UPDATE CAMPAIGN ERROR:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
