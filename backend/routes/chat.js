import express from 'express';
import chatController from '../controllers/chatController.js';
import { validateQuery } from '../middleware/validation.js';

const router = express.Router();
router.post('/ask', validateQuery, chatController.handleQuery);
router.post('/sync', chatController.syncData);

export default router;