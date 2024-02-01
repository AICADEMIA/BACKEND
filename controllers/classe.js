import Classe from '../models/classe.js';

export function createClasse(req, res) {
    const { professeurId, etudiants ,classeName} = req.body;
  

  
  
    const newClasse = new Classe({
    classeName : classeName,
      professeur: professeurId,
      etudiants: etudiants.map((etudiant) => ({ email: etudiant.email })),
    });
  
    newClasse.save()
      .then((createdClasse) => {
        res.status(201).json(createdClasse);
      })
      .catch((error) => {
        console.error(error); 
        res.status(500).json({ error: 'Error creating classe' });
      });
  }
  