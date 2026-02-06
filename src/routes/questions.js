import { Router } from 'express';
import { createQuestion } from '../controllers/questionsController.js';
import { deleteQuestion } from '../controllers/questionsController.js';

const router = Router();

// POST /questions
router.post('/', createQuestion);
router.delete('/:id', deleteQuestion);


export default router;
