// services/campaignsService.js
import { Router } from 'express';
import { supabase } from '../config/db.js';

export async function saveCampaignFull(campaignId, campaignData, questions = []) {
  // 1️⃣ Actualizar campaña
  await supabase('campaigns')
    .where({ id: campaignId })
    .update(campaignData);

  // 2️⃣ Obtener preguntas existentes
  const existingQuestions = await supabase('questions')
    .where({ campaign_id: campaignId });

  const incomingIds = questions.map(q => q.id).filter(Boolean);

  // 3️⃣ Borrar preguntas que ya no están en el payload
  const questionsToDelete = existingQuestions
    .filter(q => !incomingIds.includes(q.id))
    .map(q => q.id);

  if (questionsToDelete.length > 0) {
    await supabase('questions')
      .whereIn('id', questionsToDelete)
      .del();
  }

  // 4️⃣ Insertar o actualizar preguntas nuevas
  for (const q of questions) {
    if (q.id) {
      // actualizar
      await supabase('questions')
        .where({ id: q.id })
        .update(q);
    } else {
      // insertar nueva pregunta
      await supabase('questions')
        .insert({ ...q, campaign_id: campaignId });
    }
  }

  return { campaign: { id: campaignId, ...campaignData }, questions };
}

export default routes;