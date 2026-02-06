import express from 'express';
import { createQuestionOption } from '../controllers/questionOptionsController.js';

const router = express.Router();

router.post('/', createQuestionOption);

export default router;
