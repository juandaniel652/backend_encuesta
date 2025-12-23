import express from 'express';
import { pool } from '../db.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Registrar respuestas individuales a preguntas
router.post('/', async (req, res) => {
  const { response_id, answers } = req.body;

  for (const ans of answers) {
    const id = uuidv4();
    await pool.query(
      'INSERT INTO answers (id, response_id, question_id, response_text) VALUES (?, ?, ?, ?)',
      [id, response_id, ans.question_id, ans.response_text]
    );
  }

  res.json({ message: 'Respuestas guardadas correctamente' });
});

// Obtener respuestas por response_id
router.get('/:response_id', async (req, res) => {
  const { response_id } = req.params;
  const [rows] = await pool.query(
    'SELECT * FROM answers WHERE response_id = ?',
    [response_id]
  );
  res.json(rows);
});

export default router;
