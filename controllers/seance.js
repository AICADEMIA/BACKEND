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

    console.log('Meeting created:', response.data);

    // Send a response to the client
    res.status(201).json(response.data);
  } catch (error) {
    console.error('Error creating meeting:', error);

    // Send an error response to the client
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


//createTeamsMeeting().then(() => console.log('Teams meeting creation attempted.'));


export async function getAllSeances(req, res) {
  try {
    const seances = await Seance.find()
     .populate("matiere", "title")  
     .populate('classe', "classeName"); 

    res.status(200).json({ seances });
    console.log(matiere)
  } catch (error) {
    console.error('Error getting all seances:', error);
    res.status(500).json({ error: 'Error getting all seances' });
  }
}
