const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');

const app = express();

const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json());

// Debug middleware — remove after delete is confirmed working
app.use('/api/tasks', (req, res, next) => {
  console.log(`[${req.method}] /api/tasks${req.path} | auth: ${req.headers.authorization?.slice(0, 40) ?? 'NONE'}`);
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

app.get('/', (_req, res) => res.json({ status: 'API is running' }));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('❌ DB connection error:', err.message);
    process.exit(1);
  });