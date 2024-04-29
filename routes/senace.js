import express from 'express';
import { createTeamsMeeting ,getLastAddedSeance ,GetEvent } from '../controllers/seance.js';
import Seance from '../models/seance.js';
import { uploadMultiple } from '../middlewares/multer-config.js';
import { logRequest } from '../middlewares/error-handler.js';

const router = express.Router();







router.post('/', uploadMultiple, async (req, res) => {
  try {
    const { subject, start, end, attendees, ChapitreName } = req.body;

    if (!attendees || !Array.isArray(attendees) || attendees.length === 0) {
        console.error('La liste des participants est vide ou non définie.');
        return res.status(400).json({ error: 'Attendees list is empty or not defined' });
    }

    const startDateTime = new Date(start.dateTime);
    const endDateTime = new Date(end.dateTime);

    if (isNaN(startDateTime) || isNaN(endDateTime)) {
        console.error('Les valeurs de date ne sont pas valides.');
        return res.status(400).json({ error: 'Invalid date format' });
    }

    const formattedAttendees = attendees.map(attendee => ({
      emailAddress: {
          address: attendee.emailAddress.address.toString(),
      },
      type: attendee.type
    }));
    

  const meetingData = {
    subject,
    start: {
      dateTime: startDateTime.toISOString(),
      timeZone: start.timeZone
    },
    end: {
      dateTime: endDateTime.toISOString(),
      timeZone: end.timeZone
    },
    attendees: formattedAttendees,
    allowNewTimeProposals: true,
    isOnlineMeeting: true,
    onlineMeetingProvider: 'teamsForBusiness',
    categories: [
      "Green category"
  ],
  };
  
  await createTeamsMeeting(res, meetingData);

    const newSeance = new Seance({
        title: subject,
        datetimedebut: startDateTime,
        datetimefin: endDateTime,
        cour: req.files.cour[0].path,
        ppt: req.files.ppt[0].path,
        ChapitreName
    });

    const savedSeance = await newSeance.save();

    res.status(201).json(savedSeance);
  } catch (error) {
    console.error('Error in route handler:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



  router.get('/last', getLastAddedSeance);


  router.get('/event',GetEvent);






  
export default router;
