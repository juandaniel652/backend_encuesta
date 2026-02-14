import { supabase } from '../config/db.js'; // Import correcto

export async function saveCampaignFull(campaignId, campaignData, questions = []) {
  // 1️⃣ Actualizar campaña
  const { error: campaignError } = await supabase
    .from('campaigns')
    .update(campaignData)
    .eq('id', campaignId);

  if (campaignError) throw campaignError;

  // 2️⃣ Obtener preguntas existentes
  const { data: existingQuestions, error: fetchError } = await supabase
    .from('questions')
    .select('id')
    .eq('campaign_id', campaignId);

  if (fetchError) throw fetchError;

  const existingIds = existingQuestions.map(q => q.id);
  const incomingIds = questions.map(q => q.id).filter(Boolean);

  // 3️⃣ Borrar preguntas que ya no están en el payload
  const questionsToDelete = existingIds.filter(id => !incomingIds.includes(id));
  if (questionsToDelete.length) {
    await supabase
      .from('questions')
      .delete()
      .in('id', questionsToDelete);
  }

  // 4️⃣ Insertar o actualizar preguntas
  for (const q of questions) {
    if (q.id) {
      // Actualizar pregunta existente
      await supabase
        .from('questions')
        .update({
          text: q.text,
          type: q.type,
          position: q.position,
          is_active: q.is_active
        })
        .eq('id', q.id);
      
      // Actualizar opciones
      if (q.options?.length) {
        const { data: existingOptions } = await supabase
          .from('question_options')
          .select('id')
          .eq('question_id', q.id);

        const existingOptionIds = existingOptions.map(o => o.id);
        const incomingOptionIds = q.options.map(o => o.id).filter(Boolean);

        // Borrar opciones que ya no están
        const optionsToDelete = existingOptionIds.filter(id => !incomingOptionIds.includes(id));
        if (optionsToDelete.length) {
          await supabase
            .from('question_options')
            .delete()
            .in('id', optionsToDelete);
        }

        // Insertar o actualizar opciones
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
      // Insertar nueva pregunta
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

      // Insertar opciones nuevas
      if (q.options?.length) {
        const optionsToInsert = q.options
          .filter(o => o.is_active !== false)
          .map(o => ({ question_id: newQuestion.id, text: o.text, is_active: true }));

        if (optionsToInsert.length) {
          await supabase
            .from('question_options')
            .insert(optionsToInsert);
        }
      }
    }
  }

  return { ok: true, campaign: { id: campaignId, ...campaignData }, questions };
}
