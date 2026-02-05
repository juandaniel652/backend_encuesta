export async function getCampaignById(id) {
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
  return data;
}
