import axios from 'axios';
import { ClientSecretCredential } from '@azure/identity';
import { Client } from '@microsoft/microsoft-graph-client';
import 'dotenv/config'; 
import Seance from "../models/seance.js"
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


export const createTeamsMeeting = async (res, meetingData) => {
  try {
    const accessToken = await authProvider.getAccessToken();
    const userId = '81386dce-d860-4600-8d05-3258caa56b04'; // Replace with the user ID


    const response = await axios.post(`https://graph.microsoft.com/v1.0/users/${userId}/events`, meetingData, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
    });


    //console.log('Meeting created:', response.data);

  } catch (error) {
    console.error('Error creating meeting:');

  }
};





export const updateonline = async (res, meetingData) => {
  try {
    const accessToken = await authProvider.getAccessToken();
    const userId = '81386dce-d860-4600-8d05-3258caa56b04'; // Replace with the user ID
    const onlineMeetingId = '223587619080'

    const response = await axios.patch(`https://graph.microsoft.com/v1.0/me/onlineMeetings/${onlineMeetingId}`, meetingData, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
    });


    console.log('Meeting created:', response.data);

  } catch (error) {
    console.error('Error creating meeting:', error);

  }
};








export const createonline = async (res, meetingData) => {
  try {
    const accessToken = await authProvider.getAccessToken();
    const userId = '81386dce-d860-4600-8d05-3258caa56b04'; // Replace with the user ID
    const onlineMeetingId = '606569077'

    const response = await axios.post(`https://graph.microsoft.com/v1.0/me/onlineMeetings`, meetingData, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
    });


    console.log('Meeting created:', response.data);

  } catch (error) {
    console.error('Error creating meeting:', error);

  }
};













  export async function getLastAddedSeance(req, res) {
    try {
      const lastSeance = await Seance.findOne().sort({ createdAt: -1 });
      res.status(200).json(lastSeance);
    } catch (error) {
      console.error("Error while fetching last added seance:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  export function getAllSeances(req, res) {
    Seance.find({ professeur: req.auth.userId })
  
      .then((docs) => {
        res.status(200).json(docs);
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
}




  export async function GetEvent(req, res) {
    try {
      // Obtention de l'access token
      const accessToken = await authProvider.getAccessToken();
  
      const userId = '81386dce-d860-4600-8d05-3258caa56b04'; // Replace with the user ID

      const response = await axios.get(`https://graph.microsoft.com/v1.0/users/${userId}/events?$select=subject,organizer,attendees,start,end,location,categories,onlineMeeting`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
      });
  
      // Retourne les données de réponse
      res.status(200).json(response.data);
  
    } catch (error) {
      // Gestion des erreurs
     console.error('Error getting event:', error);
  
      // Log des détails de l'erreur
      console.error('Error details:', error.response.data);
  
      // Envoi d'une réponse d'erreur
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  
   