import {runModel } from '../controllers/chat.js';

import express from 'express';

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const userContent = req.body.userContent; // Supposons que le contenu de l'utilisateur est envoyé dans la propriété userContent du corps de la requête
        await runModel(res,userContent); // Passez userContent à la fonction runModel
    } catch (error) {
        console.error('Erreur lors de l\'exécution du modèle :', error);
        console.log(error)
    }
});


export default router;
