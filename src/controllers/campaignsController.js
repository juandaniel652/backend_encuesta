import {
  getCampaigns as getCampaignsService,
  getCampaignById as getCampaignByIdService,
  createCampaign as createCampaignService
} from '../services/campaignsService.js';

// función util de normalización
function normalizeCampaign(campaign) {
  if (!campaign?.questions) return campaign;

  campaign.questions.forEach(q => {
    q.options = q.question_options || [];
    delete q.question_options;
  });

  return campaign;
}

export async function getCampaigns(req, res) {
  try {
    const data = await getCampaignsService();
    const normalized = data.map(normalizeCampaign);
    res.json(normalized);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error getting campaigns' });
  }
}

export async function getCampaignById(req, res) {
  try {
    const { id } = req.params;
    const data = await getCampaignByIdService(id);
    const normalized = normalizeCampaign(data);
    res.json(normalized);
  } catch (err) {
    console.error(err);
    res.status(404).json({ error: 'Campaign not found' });
  }
}

export async function createCampaign(req, res) {
  try {
    const data = await createCampaignService(req.body);
    const normalized = normalizeCampaign(data);
    res.json(normalized);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
}
