
import { createMatiere, updateMatiere, deleteMatiere } from '../controllers/matiere.js';
import { uploadMultiple } from '../middlewares/multer-config.js';
import { logRequest } from '../middlewares/error-handler.js';

import express from 'express';

const router = express.Router();

router.post('/',uploadMultiple, createMatiere);


router.put('/:id', updateMatiere);

// Supprimer une matière par ID
router.delete('/:id', deleteMatiere);


export default router;




