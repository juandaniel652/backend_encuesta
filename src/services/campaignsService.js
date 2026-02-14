import { supabase } from '../config/db.js';

export async function getCampaigns() {
  const { data, error } = await supabase
    .from('campaigns')
    .select(`
      *,
      questions (
        *,
        question_options!question_options_question_id_fkey (*)
      )
    `)
    .order('position', { foreignTable: 'questions' });

  if (error) throw error;
  return data;
}

export async function getCampaignById(id) {
  const { data, error } = await supabase
    .from('campaigns')
    .select(`
      *,
      questions (
        *,
        question_options!question_options_question_id_fkey (*)
      )
    `)
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

/**
 * Guarda la campaña y sus preguntas/opciones de forma completa.
 * Borra todo lo anterior y regenera posiciones y opciones solo de lo activo.
 */
export async function saveCampaignFull(id, campaign, questions) {
  // 1️⃣ Actualizar campaña
  const { error: campaignError } = await supabase
    .from('campaigns')
    .update({
      name: campaign.name,
      client_type: campaign.client_type,
      date_start: campaign.date_start,
      date_end: campaign.date_end
    })
    .eq('id', id);

  if (campaignError) throw campaignError;

  // 2️⃣ Borrar preguntas y opciones existentes
  const { data: oldQuestions, error: fetchError } = await supabase
    .from('questions')
    .select('id')
    .eq('campaign_id', id);

  if (fetchError) throw fetchError;

  const oldQuestionIds = oldQuestions.map(q => q.id);

  if (oldQuestionIds.length) {
    await supabase
      .from('question_options')
      .delete()
      .in('question_id', oldQuestionIds);

    await supabase
      .from('questions')
      .delete()
      .in('id', oldQuestionIds);
  }

  if (!questions.length) return { ok: true };

  // 3️⃣ Insertar preguntas nuevas con posición regenerada
  let position = 1;

  for (const q of questions) {
    if (q.is_active === false) continue;

    const { data: newQuestion, error: qError } = await supabase
      .from('questions')
      .insert([{
        campaign_id: id,
        text: q.text,
        type: q.type,
        position: position++
      }])
      .select()
      .single();

    if (qError) throw qError;

    // 4️⃣ Insertar opciones activas
    if (q.options?.length) {
      const options = q.options
        .filter(o => o.is_active !== false)
        .map(o => ({
          question_id: newQuestion.id,
          text: o.text
        }));

      if (options.length) {
        await supabase
          .from('question_options')
          .insert(options);
      }
    }
  }

  return { ok: true };
}
