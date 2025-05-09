import express from 'express';
import { createGroup,createTeam ,getAll } from '../controllers/classe.js';
import Group from '../models/group.js';
import Classe from '../models/classe.js';
import Graph from'../models/graphmodel.js'
const router = express.Router();


router.route("/").get(getAll);


router.post('/', async (req, res) => {
  try {
    const graph = new Graph(req.body);
    console.log("from post man", req.body);

    const nouvelleClasse = new Classe({
      classeName: req.body.classeName,
      etudiants: req.body.etudiants, 
      professeur: req.body.professeurId 
    });

    const classeEnregistre = await nouvelleClasse.save();

    const meetingData = graph;

    await createGroup(res, req.body);

    res.status(201).json({ classe: classeEnregistre }); 
  } catch (error) {
    console.error('Error in route handler:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


  

  router.post('/team', async (req, res) => {
    try {
      const { description, groupname } = req.body;
  
      // Recherchez le groupid correspondant au groupname dans la collection Group
      const existingGroup = await Group.findOne({ nom: groupname });
  
      // Console Log pour vérifier l'ID du groupe
      console.log(existingGroup.groupid);
  
      if (!existingGroup) {
        // Si le groupe n'est pas trouvé, renvoyez une erreur
        return res.status(404).json({ error: 'Group not found' });
      }
  
      // Vérifiez le type de l'ID du groupe
      console.log(typeof existingGroup.groupid);
  
      const template = `https://graph.microsoft.com/v1.0/teamsTemplates('standard')`;
      const group = `https://graph.microsoft.com/v1.0/groups/${existingGroup.groupid}`;
  
      // Console Log pour vérifier l'URL construite
      console.log(group);
  
      // Appelez createTeamsMeeting avec les données de réunion fournies dynamiquement
      const meetingData = { description, 'template@odata.bind': template, 'group@odata.bind': group };
      await createTeam(res, meetingData);
  
    } catch (error) {
      console.error('Error in route handler:', error);
  
      // Envoyer une réponse d'erreur au client
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  
  
export default router;