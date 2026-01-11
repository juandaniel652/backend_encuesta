const express = require('express');
const cors = require('cors');
const app = express();
const usersRoutes = require('./routes/users');

app.use('/api/users', usersRoutes);
app.use('/api/responses', responsesRoutes);
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/users', usersRoutes);

// Middleware de errores
app.use(require('./middlewares/errorHandler'));

module.exports = app;
