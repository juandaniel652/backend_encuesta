console.log("BODY RECIBIDO:", req.body);

import { Router } from 'express';
import {
  getCampaigns,
  createCampaign
} from '../controllers/campaignsController.js';

const router = Router();

router.get('/', getCampaigns);
router.post('/', createCampaign);

export default router;
