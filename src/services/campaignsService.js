import { supabase } from '../config/db.js';

export async function saveCampaignFull(id, campaign, questions) {

  // 1. Update campaign
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

  // 2. Borrar preguntas viejas
  await supabase
    .from('questions')
    .delete()
    .eq('campaign_id', id);

  // 3. Insertar preguntas nuevas
  for (const q of questions) {
    const { data: newQuestion, error: qError } = await supabase
      .from('questions')
      .insert([{
        campaign_id: id,
        text: q.text,
        type: q.type,
        position: q.position
      }])
      .select()
      .single();

    if (qError) throw qError;

    // 4. Insertar opciones
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
