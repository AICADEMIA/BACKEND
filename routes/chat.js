import {chat } from '../controllers/chat.js';

import express from 'express';

const router = express.Router();

router.post('/',chat);

export default router;
