
import { createMatiere, getAllMatieres, getMatiereById, updateMatiere, deleteMatiere } from '../controllers/matiere.js';
import { uploadSingle } from '../middlewares/multer-config.js';
import { logRequest } from '../middlewares/error-handler.js';

import express from 'express';

const router = express.Router();

router.post('/',uploadSingle, createMatiere);

// Obtenir toutes les matières
router.get('/', getAllMatieres);

// Obtenir une matière par ID
router.get('/:id', getMatiereById);

// Mettre à jour une matière par ID
router.put('/:id', updateMatiere);

// Supprimer une matière par ID
router.delete('/:id', deleteMatiere);


export default router;




