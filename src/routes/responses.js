import { Router } from 'express';
import { createResponse } from '../controllers/responsesController.js';

const router = Router();

router.post('/', createResponse);

export default router;
