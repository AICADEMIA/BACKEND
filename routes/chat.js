import {chatgpt } from '../controllers/chat.js';

import express from 'express';

const router = express.Router();

router.post('/',chatgpt);

export default router;
