import express from 'express';
import { createTeamsMeeting,updateonline,createonline,getAllSeances ,getLastAddedSeance ,GetEvent } from '../controllers/seance.js';
import Seance from '../models/seance.js';
import { uploadMultiple } from '../middlewares/multer-config.js';
import { logRequest } from '../middlewares/error-handler.js';
import axios from 'axios';
import cron from 'node-cron';
import path from 'path';
import { promisify } from 'util';
import auth from "../middlewares/auth.js";
import fs from 'fs';
import PDFParser from 'pdf2json';

const router = express.Router();


router.route("/").get(auth,getAllSeances);


const scheduleCronJob = async (start, ChapitreName) => {
  try {
    const startDate = new Date(start);
    if (isNaN(startDate)) throw new Error('Invalid start date');

    console.log('Start date:', startDate);

    // Convertir la date en format cron
    const job = cron.schedule(
      `${startDate.getMinutes()} ${startDate.getHours()} ${startDate.getDate()} ${
        startDate.getMonth() + 1
      } *`,
      async () => {
        console.log('Cron job triggered at:', new Date());
        try {
          // Envoi de la requête à l'URL
          await axios.post('http://127.0.0.1:5000/run_script', { ChapitreName });
          console.log('Request sent successfully.');
        } catch (error) {
          console.error('Error sending request:', error);
        }
        job.destroy();
      },
      {
        timezone: 'Europe/Paris',
        scheduled: true // Planifier immédiatement
      }
    );

    console.log('Cron job scheduled successfully for:', startDate);
  } catch (error) {
    console.error('Error in scheduling cron job:', error);
  }
};



async function extractTextFromPDF(pdfFilePath) {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser(this,1);

    pdfParser.on('pdfParser_dataError', errData => {
      reject(errData.parserError);
    });

    pdfParser.on('pdfParser_dataReady', () => {
      const extractedText = pdfParser.getRawTextContent();
      resolve(extractedText); // Résoudre la promesse avec extractedText
    });

    pdfParser.loadPDF(pdfFilePath);
  });
}





router.post('/',auth, uploadMultiple, async (req, res) => {
  try {
    console.log('Date de l\'ajout de la séance :', new Date());

    const { title, datetimedebut, datetimefin, ChapitreName ,cour , ppt } = req.body;

    const start = new Date(datetimedebut);
    const end = new Date(datetimefin);


    const meetingData = {
      subject: title,
      start: {
        dateTime: start.toISOString(),
        timeZone: "UTC"
      },
      end: {
        dateTime: end.toISOString(),
        timeZone: "UTC"
      },
      attendees: [
        { emailAddress: { address: "mohamedali.charfeddine1@esprit.tn" }, type: "required" },
        { emailAddress: { address: "mohamedislem.samaali@esprit.tn" }, type: "required" }
      ],
      isOrganizer: false,
      organizer: {
        emailAddress: {
          address: "mohamedali.charfeddine1@esprit.tn",
          name: "Dali"
        }
      },
      isOnlineMeeting: true,
      onlineMeetingProvider: 'teamsForBusiness',
      categories: ["Green category"]
    };

    await createTeamsMeeting(res, meetingData);

    const courFile = req.files['cour'] ? req.files['cour'][0] : null;
    const pptFile = req.files['ppt'] ? req.files['ppt'][0] : null;
    
    const newSeance = new Seance({
      title,
      datetimedebut: start.toISOString(),
      datetimefin: end.toISOString(),
      cour: courFile ? courFile.path : null,
      ppt: pptFile ? pptFile.path : null,
      ChapitreName,
      professeur : req.auth.userId
    });
    
    if (courFile) {
      const pdfFilePath = courFile.path;
      const extractedText = await extractTextFromPDF(pdfFilePath);
      fs.writeFileSync('./data.txt', extractedText);
    }
    

    const savedSeance = await newSeance.save();

    // Schedule the cron job for the specified start date
    await scheduleCronJob(start, ChapitreName);

    res.status(201).json(savedSeance);
  } catch (error) {
    console.error('Error in route handler:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

  router.get('/last', getLastAddedSeance);


  router.get('/event',GetEvent);




  










router.patch('/patch', async (req, res) => {
  try {

  const meetingData = {
    isDialInBypassEnabled: true,
  scope: "everyone",
  };
  
  await updateonline(res, meetingData);
    res.status(201).json("good");
  } catch (error) {
    console.error('Error in route handler:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




router.post('/post', async (req, res) => {
  try {

  const meetingData = {
    startDateTime: '2024-07-12T14:30:34.2444915-07:00',
  endDateTime: '2024-07-12T15:00:34.2464912-07:00',
  subject: 'User meeting',
  joinMeetingIdSettings: {
    isPasscodeRequired: false
  }
  };
  
  await createonline(res, meetingData);
    res.status(201).json("good");
  } catch (error) {
    console.error('Error in route handler:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
  
export default router;

