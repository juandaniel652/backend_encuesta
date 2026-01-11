import express from 'express';
import cors from 'cors';
import usersRoutes from './routes/users.js';
import responsesRoutes from './routes/responses.js';
import errorHandler from './middlewares/errorHandler.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/users', usersRoutes);
app.use('/responses', responsesRoutes);

app.use(errorHandler);

export default app;
