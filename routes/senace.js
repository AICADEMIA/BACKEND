import express from 'express';
import { createSeance,getAllSeances,createTeamsMeeting } from '../controllers/seance.js';

const router = express.Router();

router.post('/', createSeance);
router.post('/create', async (req, res) => {
    try {
      const { subject, start, end, attendees, allowNewTimeProposals, isOnlineMeeting ,onlineMeetingProvider} = req.body;
  
      if (!subject || !start || !end || !attendees) {
        return res.status(400).json({ error: 'Missing required fields in the request body' });
      }
  
      const meetingData = { subject, start, end, attendees, allowNewTimeProposals, isOnlineMeeting ,onlineMeetingProvider};
      await createTeamsMeeting(res, meetingData);
  
  
    } catch (error) {
      console.error('Error in route handler:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });router.get('/', getAllSeances);


export default router;
