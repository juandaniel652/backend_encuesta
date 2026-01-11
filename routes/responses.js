import express from 'express';
import { pool } from '../db.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Obtener respuestas por campaña
router.get('/:campaign_id', async (req, res) => {
  const { campaign_id } = req.params;
  const [rows] = await pool.query(
    'SELECT * FROM responses WHERE campaign_id = ? ORDER BY created_at DESC',
    [campaign_id]
  );
  res.json(rows);
});

// Crear respuesta (de un cliente)
router.post('/', async (req, res) => {
  const { campaign_id, client_number, client_name } = req.body;
  const id = uuidv4();
  const created_at = new Date();

  await pool.query(
    'INSERT INTO responses (id, campaign_id, client_number, client_name, created_at) VALUES (?, ?, ?, ?, ?)',
    [id, campaign_id, client_number, client_name, created_at]
  );

  res.json({ id, message: 'Respuesta registrada' });
});

export default router;
