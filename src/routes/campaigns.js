// services/campaignsService.js
import db from '../config/db.js'; // tu configuración de DB

export async function saveCampaignFull(campaignId, campaignData, questions = []) {
  // 1️⃣ Actualizar campaña
  await db('campaigns')
    .where({ id: campaignId })
    .update(campaignData);

  // 2️⃣ Obtener preguntas existentes
  const existingQuestions = await db('questions')
    .where({ campaign_id: campaignId });

  const incomingIds = questions.map(q => q.id).filter(Boolean);

  // 3️⃣ Borrar preguntas que ya no están en el payload
  const questionsToDelete = existingQuestions
    .filter(q => !incomingIds.includes(q.id))
    .map(q => q.id);

  if (questionsToDelete.length > 0) {
    await db('questions')
      .whereIn('id', questionsToDelete)
      .del();
  }

  // 4️⃣ Insertar o actualizar preguntas nuevas
  for (const q of questions) {
    if (q.id) {
      // actualizar
      await db('questions')
        .where({ id: q.id })
        .update(q);
    } else {
      // insertar nueva pregunta
      await db('questions')
        .insert({ ...q, campaign_id: campaignId });
    }
  }

  return { campaign: { id: campaignId, ...campaignData }, questions };
}
