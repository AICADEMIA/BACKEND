import { createClasse } from '../controllers/classe.js';

import express from 'express';

const router = express.Router();

router.post('/', createClasse);


export default router;
