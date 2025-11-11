import { Router } from 'express';
import { handleChat } from '../controllers/chat.controller';

const router = Router();

// POST /api/chat (HU-04, HU-07, HU-08, HU-09)
router.post('/chat', handleChat);

export default router;
