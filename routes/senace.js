import express from 'express';
import { createSeance,getAllSeances } from '../controllers/seance.js';

const router = express.Router();

router.post('/', createSeance);
router.get('/', getAllSeances);


export default router;
