import axios from 'axios';
import pkg from '@microsoft/microsoft-graph-client';
const { Client, auth } = pkg;
import dotenv from 'dotenv';
import Seance from '../models/seance.js';

dotenv.config();
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
export async function createSeance(req, res) {
  try {
    const {
      title,
      matiereId,
      classeId,
      datetimedebut,
      datetimefin,
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

    // Répondez avec le JSON de la séance créée
    res.status(201).json({
      message: 'Seance and event created successfully.',
      seance: newSeance,
    });
  } catch (error) {
    console.error('Error creating seance and event:', error);

    // Répondez avec une erreur JSON
    res.status(500).json({
      error: 'Error creating seance and event',
      message: error.message,
    });
  }
}



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
