import express from 'express';
import cors from 'cors';
import { pool } from './db.js';
import campaignsRoutes from './routes/campaigns.js';
import questionsRoutes from './routes/questions.js';
import responsesRoutes from './routes/responses.js';
import answersRoutes from './routes/answers.js';

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/campaigns', campaignsRoutes);
app.use('/api/questions', questionsRoutes);
app.use('/api/responses', responsesRoutes);
app.use('/api/answers', answersRoutes);

// Ruta raíz
app.get('/', (req, res) => {
  res.send('✅ API de encuestas activa');
});

// Arranque
app.listen(PORT, () => {
  console.log(`✅ Servidor backend corriendo en http://localhost:${PORT}`);
});
