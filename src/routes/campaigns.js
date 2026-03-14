// src/routes/campaigns.js
import { Router } from 'express';
import { supabase } from '../config/db.js';

const router = Router();

// 🔹 Obtener todas las campañas (solo activas)
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('campaigns')
      .select(`
        *,
        questions (
          *,
          question_options!question_options_question_id_fkey (*)
        )
      `)
      .eq('is_active', true)
      .eq('questions.is_active', true)
      .eq('questions.question_options.is_active', true)
      .order('position', { foreignTable: 'questions' });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Crear nueva campaña
router.post('/', async (req, res) => {
  try {
    const { name, client_type, is_active } = req.body;

    const { data, error } = await supabase
      .from('campaigns')
      .insert({
        name: name || 'Nueva campaña',
        client_type: client_type || 'without_clients',
        is_active: is_active ?? true
      })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Obtener campaña por id (solo activa)
router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('campaigns')
      .select(`
        *,
        questions (
          *,
          question_options!question_options_question_id_fkey (*)
        )
      `)
      .eq('id', req.params.id)
      .eq('is_active', true)
      .eq('questions.is_active', true)
      .eq('questions.question_options.is_active', true)
      .single();

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Guardar campaña completa
router.put('/:id/full', async (req, res) => {
  try {
    const { campaign, questions } = req.body;
    const campaignId = req.params.id;

    // 1️⃣ Actualizar campaña
    const { error: campaignError } = await supabase
      .from('campaigns')
      .update({
        name: campaign.name,
        client_type: campaign.client_type,
        date_start: campaign.date_start,
        date_end: campaign.date_end
      })
      .eq('id', campaignId);

    if (campaignError) throw campaignError;

    // 2️⃣ Preguntas existentes (incluye inactivas)
    const { data: existingQuestions, error: fetchError } = await supabase
      .from('questions')
      .select('id')
      .eq('campaign_id', campaignId);

    if (fetchError) throw fetchError;

    const existingIds = existingQuestions.map(q => q.id);
    const incomingIds = questions.map(q => q.id).filter(Boolean);

    // 3️⃣ Soft delete preguntas que ya no existen
    const questionsToDelete = existingIds.filter(id => !incomingIds.includes(id));
    if (questionsToDelete.length) {
      await supabase
        .from('questions')
        .update({ is_active: false })
        .in('id', questionsToDelete);
    }

    // 4️⃣ Insertar o actualizar preguntas y opciones
    for (const q of questions) {
      if (q.id) {
        // actualizar pregunta
        await supabase
          .from('questions')
          .update({
            text: q.text,
            type: q.type,
            position: q.position,
            is_active: q.is_active
          })
          .eq('id', q.id);

        // opciones
        if (q.options?.length) {
          const { data: existingOptions } = await supabase
            .from('question_options')
            .select('id')
            .eq('question_id', q.id);

          const existingOptionIds = existingOptions.map(o => o.id);
          const incomingOptionIds = q.options.map(o => o.id).filter(Boolean);

          // soft delete opciones
          const optionsToDelete = existingOptionIds.filter(id => !incomingOptionIds.includes(id));
          if (optionsToDelete.length) {
            await supabase
              .from('question_options')
              .update({ is_active: false })
              .in('id', optionsToDelete);
          }

          for (const o of q.options) {
            if (o.id) {
              await supabase
                .from('question_options')
                .update({ text: o.text, is_active: o.is_active })
                .eq('id', o.id);
            } else if (o.is_active !== false) {
              await supabase
                .from('question_options')
                .insert({ question_id: q.id, text: o.text, is_active: true });
            }
          }
        }

      } else if (q.is_active !== false) {
        // nueva pregunta
        const { data: newQuestion, error: insertError } = await supabase
          .from('questions')
          .insert({
            campaign_id: campaignId,
            text: q.text,
            type: q.type,
            position: q.position,
            is_active: true
          })
          .select()
          .single();

        if (insertError) throw insertError;

        if (q.options?.length) {
          const optionsToInsert = q.options
            .filter(o => o.is_active !== false)
            .map(o => ({ question_id: newQuestion.id, text: o.text, is_active: true }));

          if (optionsToInsert.length) {
            await supabase.from('question_options').insert(optionsToInsert);
          }
        }
      }
    }

    res.json({ ok: true });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Borrar campaña completa (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    const campaignId = req.params.id;

    const { data: questions } = await supabase
      .from('questions')
      .select('id')
      .eq('campaign_id', campaignId);

    const questionIds = questions.map(q => q.id);

    if (questionIds.length) {
      await supabase
        .from('question_options')
        .update({ is_active: false })
        .in('question_id', questionIds);

      await supabase
        .from('questions')
        .update({ is_active: false })
        .in('id', questionIds);
    }

    await supabase
      .from('campaigns')
      .update({ is_active: false })
      .eq('id', campaignId);

    res.json({ ok: true });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// 🔹 Exportar router
export default router;
