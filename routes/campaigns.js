import express from 'express';
import { pool } from '../db.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Obtener todas las campañas
router.get('/', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM campaigns ORDER BY created_at DESC');
  res.json(rows);
});

// Crear nueva campaña
router.post('/', async (req, res) => {
  const { name, date_start, date_end } = req.body;
  const id = uuidv4();
  const created_at = new Date();

  await pool.query(
    'INSERT INTO campaigns (id, name, date_start, date_end, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
    [id, name, date_start, date_end, created_at, created_at]
  );

  res.json({ id, message: 'Campaña creada correctamente' });
});

export default router;
