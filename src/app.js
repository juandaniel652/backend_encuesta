import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import campaignsRoutes from './routes/campaigns.js';
import errorHandler from './middlewares/errorHandler.js';

console.log('APP FILE LOADED');

const app = express();

/* ===== Middlewares globales ===== */
app.use(cors());
app.use(express.json());

/* ===== Healthcheck (producción) ===== */
app.get('/ping', (req, res) => {
  res.json({ ok: true, status: 'alive' });
});

/* ===== Routes ===== */
app.use('/api/campaigns', campaignsRoutes);

/* ===== Error handler (SIEMPRE al final) ===== */
app.use(errorHandler);

export default app;
