import { Router } from 'express';
import { createQuestion } from '../controllers/questionsController.js';

const router = Router();

// POST /questions
router.post('/', createQuestion);

export default router;
