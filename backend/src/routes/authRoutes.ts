import { Router } from 'express';
import { register, login } from '../controllers/authControllers.ts';
import express from 'express';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

export default router;
