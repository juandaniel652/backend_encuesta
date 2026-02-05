import { Router } from 'express';
import {
  getCampaigns,
  getCampaignById,   // 👈 NUEVO
  createCampaign
} from '../controllers/campaignsController.js';

const router = Router();

router.get('/', getCampaigns);
router.get('/:id', getCampaignById);   // 👈 NUEVO
router.post('/', createCampaign);

export default router;
