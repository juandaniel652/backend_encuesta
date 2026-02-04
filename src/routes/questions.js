import { Router } from 'express';
import {
  createQuestion
} from '../controllers/questionsController.js';

const router = Router();

router.get('/', getCampaigns);
router.post('/', createCampaign);

export default router;