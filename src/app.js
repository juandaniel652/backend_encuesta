import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import campaignsRoutes from './routes/campaigns.js';
import responsesRoutes from './routes/responses.js';
import questionsRoutes from './routes/questions.js';
import errorHandler from './middlewares/errorHandler.js';

console.log('APP FILE LOADED');

const app = express();

/* ===== CORS de producción ===== */
const allowedOrigins = [
  "https://encuestaestadistica1.netlify.app",
  "https://andros-net.com.ar/encuesta/frontend" ///De agustin
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS bloqueado"));
    }
  },
  credentials: true
}));

/* ===== Middlewares ===== */
app.use(express.json());

/* ===== Healthcheck ===== */
app.get('/ping', (req, res) => {
  res.json({ ok: true, status: 'alive' });
});

/* ===== Routes ===== */
app.use('/api/campaigns', campaignsRoutes);
app.use('/api/responses', responsesRoutes);
app.use('/api/questions', questionsRoutes);


/* ===== Error handler ===== */
app.use(errorHandler);

export default app;
