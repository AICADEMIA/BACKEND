
import { createMatiere, updateMatiere, deleteMatiere ,getAllMatiere} from '../controllers/matiere.js';
import { uploadMultiple } from '../middlewares/multer-config.js';
import { logRequest } from '../middlewares/error-handler.js';

import express from 'express';

const router = express.Router();

router.post('/',logRequest,uploadMultiple, createMatiere);
router.get('/',getAllMatiere);


router.put('/:id', updateMatiere);

// Supprimer une matière par ID
router.delete('/:id', deleteMatiere);


export default router;




