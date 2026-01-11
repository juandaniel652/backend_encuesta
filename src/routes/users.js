import { Router } from 'express';
import { login } from '../controllers/usersControllers.js';

const router = Router();

router.post('/login', login);

export default router;
