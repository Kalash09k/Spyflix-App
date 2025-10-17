import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import authRoutes from '../src/routes/authRoutes.ts';
import { authMiddleware } from './middlewares/authMiddleware.ts';
import subscriptionRoutes from '../src/routes/subscriptionRoutes.ts';

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/subscriptions', subscriptionRoutes);

app.get('/api/protected', authMiddleware, (req, res) => {
  res.json({ message: `Bonjour user ${(req as any).userId}` });
});
app.get('/api/health', (req, res) => res.json({ status: 'Backend OK' }));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
