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

export async function saveCampaignFull(id, campaign, questions) {

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

  await supabase
    .from('questions')
    .delete()
    .eq('campaign_id', id);

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
