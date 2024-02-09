import express from 'express';
import { createTeamsMeeting } from '../controllers/seance.js';
import Seance from "../models/seance.js"
import Seance from '../models/seance.js';

const router = express.Router();
router.post('/', async (req, res) => {
    try {
      const { subject, start, end, attendees, allowNewTimeProposals, isOnlineMeeting ,onlineMeetingProvider} = req.body;
  
      // Validate that required fields are present
      if (!subject || !start || !end || !attendees) {
        return res.status(400).json({ error: 'Missing required fields in the request body' });
      }
  
      // Call createTeamsMeeting with the dynamically provided meetingData
      const meetingData = { subject, start, end, attendees, allowNewTimeProposals, isOnlineMeeting ,onlineMeetingProvider};
      await createTeamsMeeting(res, meetingData);
  
      const newSeance = new Seance({ 
        title:subject, 
        datetimedebut:start, 
        datetimefin:end, 
      });
  
      const savedSeance = await newSeance.save();

      res.status(201).json(savedMatiere);

    } catch (error) {
      console.error('Error in route handler:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  



  
export default router;
