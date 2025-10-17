import { Router } from 'express';
import {
  createSubscription,
  getSubscriptions,
  getSubscriptionById,
  joinSubscription,
} from '../controllers/subscriptionController.ts';
import { authMiddleware } from '../middlewares/authMiddleware.ts';

const router = Router();

// Routes protégées par JWT
router.post('/', authMiddleware, createSubscription);
router.get('/', authMiddleware, getSubscriptions);
router.get('/:id', authMiddleware, getSubscriptionById);
router.post('/:id/join', authMiddleware, joinSubscription);

export default router;
