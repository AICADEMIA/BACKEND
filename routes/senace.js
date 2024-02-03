import express from 'express';
import { createTeamsMeeting } from '../controllers/seance.js';

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
  
      // Do not send a response here; it's already being handled in createTeamsMeeting
  
    } catch (error) {
      console.error('Error in route handler:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
export default router;
