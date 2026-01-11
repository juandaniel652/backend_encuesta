import express from 'express';
import { pool } from '../db.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Obtener preguntas de una campaña
router.get('/:campaign_id', async (req, res) => {
  const { campaign_id } = req.params;
  const [rows] = await pool.query(
    'SELECT * FROM questions WHERE campaign_id = ?',
    [campaign_id]
  );
  res.json(rows);
});

// Crear pregunta con opciones
router.post('/', async (req, res) => {
  const { campaign_id, text, type, options } = req.body;
  const question_id = uuidv4();

  await pool.query(
    'INSERT INTO questions (id, campaign_id, text, type) VALUES (?, ?, ?, ?)',
    [question_id, campaign_id, text, type]
  );

  if (Array.isArray(options)) {
    for (const opt of options) {
      const option_id = uuidv4();
      await pool.query(
        'INSERT INTO options (id, question_id, text) VALUES (?, ?, ?)',
        [option_id, question_id, opt]
      );
    }
  }

  res.json({ question_id, message: 'Pregunta creada con opciones' });
});

export default router;
