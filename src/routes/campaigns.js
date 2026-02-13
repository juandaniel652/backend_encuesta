import { Router } from 'express';
import {
  getCampaigns,
  getCampaignById,
  saveCampaignFull
} from '../services/campaignsService.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const data = await getCampaigns();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const data = await getCampaignById(req.params.id);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id/full', async (req, res) => {
  try {
    const { id } = req.params;
    const { campaign, questions } = req.body;

    const result = await saveCampaignFull(id, campaign, questions);
    res.json(result);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
