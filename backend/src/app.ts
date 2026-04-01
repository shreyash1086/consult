import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import adminRoutes from './routes/admin.routes';
import assessmentRoutes from './routes/assessment.routes';
import trainerRoutes from './routes/trainer.routes';

dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/trainer', trainerRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

export default app;
