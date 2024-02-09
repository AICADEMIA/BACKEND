import Classe from '../models/classe.js';
import Group from '../models/group.js';
import axios from 'axios';
import { ClientSecretCredential } from '@azure/identity';
import { Client } from '@microsoft/microsoft-graph-client';
import 'dotenv/config'; 

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const tenantId = process.env.TENANT_ID;

const scopes = ['https://graph.microsoft.com/.default'];
// Initialize the credential
const credential = new ClientSecretCredential(tenantId, clientId, clientSecret);

// Custom auth provider
const authProvider = {
  getAccessToken: async () => {
    try {
      const accessToken = await credential.getToken(['https://graph.microsoft.com/.default']);
      return accessToken.token; // Return the token
    } catch (error) {
      throw new Error(`Failed to retrieve an access token: ${error}`);
    }
  },
};

const graphClient = Client.initWithMiddleware({ authProvider });

export const createGroup = async (res, meetingData) => {
  try {
    const accessToken = await authProvider.getAccessToken();
    const userId = '81386dce-d860-4600-8d05-3258caa56b04'; 

    const response = await axios.post(`https://graph.microsoft.com/v1.0/groups`, meetingData, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
    });

    console.log('Meeting created:', response.data);

    const groupToSave = new Group({
      groupid: response.data.id,  // Utilisez response.data au lieu de createdGroup
      nom: response.data.displayName,  // Utilisez response.data au lieu de createdGroup
    });

    await groupToSave.save();

    // Send a response to the client après l'enregistrement
    res.status(201).json(response.data);
    
  } catch (error) {
    console.error('Error creating meeting:', error);

    // Send an error response to the client
    res.status(500).json({ error: 'Internal Server Error' });
  }
};







export const createTeam = async (res, meetingData) => {
  try {
    const accessToken = await authProvider.getAccessToken();
    const userId = '81386dce-d860-4600-8d05-3258caa56b04'; 

    const response = await axios.post(`https://graph.microsoft.com/v1.0/teams`, meetingData, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
    });

    console.log('Meeting created:', response.data);

    // Send a response to the client après l'enregistrement
    res.status(201).json(response.data);
    
  } catch (error) {
    console.error('Error creating meeting:', error);

    // Send an error response to the client
    res.status(500).json({ error: 'Internal Server Error' });
  }
};






export async function getAllGroups(req, res) {
  try {
    const groups = await Group.find()
     .populate("group", "nom")  

    res.status(200).json({ groups });
    console.log(matiere)
  } catch (error) {
    console.error('Error getting all groups:', error);
    res.status(500).json({ error: 'Error getting all groups' });
  }
}










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
  