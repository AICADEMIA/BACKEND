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
  export function getAllClassesWithProfesseurs(req, res) {
    Classe.find() 
      .populate('professeur', 'firstname lastname') 
      .then(classes => {
        const formattedClasses = classes.map(classe => {
          const {_doc: {professeur, ...classData}} = classe;
          const profName = `${professeur.firstname} ${professeur.lastname}`;
          return {...classData, profName};
        });
  
        res.status(200).json(formattedClasses);
      })
      .catch(error => {
        console.error(error);
        res.status(500).json({ error: 'Error fetching classes' });
      });
  }
  