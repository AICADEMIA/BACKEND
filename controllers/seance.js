import dotenv from 'dotenv';
import Seance from '../models/seance.js';
import axios from 'axios';
import { ClientSecretCredential } from '@azure/identity';
import { Client } from '@microsoft/microsoft-graph-client';
import Classe from '../models/classe.js'


dotenv.config();

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const tenantId = process.env.TENANT_ID;

const scopes = ['https://graph.microsoft.com/.default'];
const credential = new ClientSecretCredential(tenantId, clientId, clientSecret);

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

export async function createSeance2(req, res) {
  try {
    const {
      title,
      matiereId,
      classeId,
      datetimedebut,
      datetimefin,
      email
    } = req.body;

    const newSeance = new Seance({
      title,
      matiere: matiereId,
      classe: classeId,
      datetimedebut,
      datetimefin,
    });

    await newSeance.save();

    console.log('Seance created successfully.');

    res.status(201).json({
      message: 'Seance and event created successfully.',
      seance: newSeance,
    });
  } catch (error) {
    console.error('Error creating seance and event:', error);

    res.status(500).json({
      error: 'Error creating seance and event',
      message: error.message,
    });
  }
}

export async function createSeance(req, res) {
  try {
    const {
      title,
      matiereId,
      classeId,
      datetimedebut,
      datetimefin,
    } = req.body;

    const classe = await Classe.findById(classeId);
    if (!classe) {
      return res.status(404).json({ error: 'Classe not found' });
    }

    console.log("classe is ",classe)
    const emails = classe.etudiants.map(etudiant => etudiant.email);

    console.log("the emails are",emails)

    const attendees = emails.map(email => ({
      emailAddress: { address: email, name: "" }, 
      type: "required"
    }));

    const newSeance = new Seance({
      title,
      matiere: matiereId,
      classe: classeId,
      datetimedebut,
      datetimefin,
    });

    await newSeance.save();

    console.log('Seance created successfully.');

    const meetingData = {
      subject: title,
      start: {
        dateTime: datetimedebut,
        timeZone: "Europe/Paris"
      },
      end: {
        dateTime: datetimefin,
        timeZone: "Europe/Paris"
      },
      location: {
        displayName: "ESPRIT"
      },
      attendees,
      allowNewTimeProposals: true,
      isOnlineMeeting: true,
      onlineMeetingProvider: "teamsForBusiness"
    };

    await createTeamsMeeting(res, meetingData);

  } catch (error) {
    console.error('Error creating seance and event:', error);
    res.status(500).json({
      error: 'Error creating seance and event',
      message: error.message,
    });
  }
}









/*
// Ensure all required environment variables are defined
if (!process.env.CLIENT_ID || !process.env.CLIENT_SECRET || !process.env.TENANT_ID) {
  throw new Error('Missing required environment variables: CLIENT_ID, CLIENT_SECRET, or TENANT_ID');
}

//const client_id = process.env.CLIENT_ID;
//const client_secret = process.env.CLIENT_SECRET;
//const tenant_id = process.env.TENANT_ID;
//const resource = 'https://graph.microsoft.com';
//const user_email = 'email_de_l_utilisateur'; // Replace with actual user email

const client = Client.init({
  authProvider: auth.getClientCredentialsProvider({
    clientId: client_id,
    clientSecret: client_secret,
  }),
});

async function getAccessToken() {
  try {
    const response = await axios.post(
      `https://login.microsoftonline.com/${tenant_id}/oauth2/token`,
      null,
      {
        params: {
          grant_type: 'client_credentials',
          client_id,
          client_secret,
          resource,
        },
      }
    );

    return response.data.access_token;
  } catch (error) {
    console.error('Error fetching access token:', error);
    throw error; // Rethrow to allow handling in higher-level functions
  }
}

async function createEvent(seanceId) {
  try {
    const seance = await Seance.findById(seanceId);
    if (!seance) {
      throw new Error(`Seance not found for ID: ${seanceId}`);
    }

    const calendars = await client.api('/me/calendars').get();
    const userCalendar = calendars.value.find((calendar) =>
      calendar.name.toLowerCase() === user_email.toLowerCase()
    );
    if (!userCalendar) {
      throw new Error(`User calendar not found for: ${user_email}`);
    }

    const eventData = {
      subject: seance.title,
      start: { dateTime: seance.datetimedebut, timeZone: 'UTC' },
      end: { dateTime: seance.datetimefin, timeZone: 'UTC' },
    };

    const newEvent = await client.api(`/me/calendars/${userCalendar.id}/events`).post(eventData);
    console.log('Event created successfully:', newEvent);
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
}
*/




export async function getAllSeances(req, res) {
  try {
    const seances = await Seance.find()
     .populate("matiere", "title") 
     .populate('classe', "classeName"); 

    res.status(200).json({ seances });
   // console.log(matiere)
  } catch (error) {
    console.error('Error getting all seances:', error);
    res.status(500).json({ error: 'Error getting all seances' });
  }
}
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



