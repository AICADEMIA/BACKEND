import { createClasse, getAllClassesWithProfesseurs } from '../controllers/classe.js';

import express from 'express';

const router = express.Router();

router.post('/', createClasse)
router.get('/all',getAllClassesWithProfesseurs);


export default router;
