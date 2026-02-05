import { Router } from 'express';
import {
  createQuestion
} from '../controllers/questionsController.js';

const router = Router();

router.post('/questions', createQuestion);

export default router;