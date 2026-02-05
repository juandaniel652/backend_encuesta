import { getCampaigns as getCampaignsService,
         getCampaignById as getCampaignByIdService,
         createCampaign as createCampaignService } 
from '../services/campaignsService.js';

export async function getCampaigns(req, res) {
  try {
    const data = await getCampaignsService();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error getting campaigns' });
  }
}

export async function getCampaignById(req, res) {
  try {
    const { id } = req.params;
    const data = await getCampaignByIdService(id);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(404).json({ error: 'Campaign not found' });
  }
}

export async function createCampaign(req, res) {
  try {
    const data = await createCampaignService(req.body);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
}
