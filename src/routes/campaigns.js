import { supabase } from '../config/db.js';

router.put('/:id/full', async (req, res) => {
  const { id } = req.params;
  const { campaign, questions } = req.body;

  try {
    // 1. Update campaign
    await supabase
      .from('campaigns')
      .update(campaign)
      .eq('id', id);

    // 2. Update questions
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

    // 3. Devolver campaña fresca
    const { data, error } = await supabase
      .from('campaigns')
      .select(`
        *,
        questions (
          *,
          question_options (*)
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;

    res.json(data);
  } catch (err) {
    console.error('FULL CAMPAIGN UPDATE ERROR:', err);
    res.status(500).json({ error: err.message });
  }
});
