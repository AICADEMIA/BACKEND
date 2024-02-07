import OpenAI from 'openai';
import fs from 'fs';
import 'dotenv/config'; 

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
  });

export  async function chat(req, res)  {
    try {
      const userInput = req.body.userInput;
  
      if (!userInput) {
        return res.status(400).json({ error: 'Input text is required.' });
      }
  
      const content = fs.readFileSync('./data.txt', 'utf-8');
  
      const response = await  openai.chat.completions.create({
        engine: 'gpt-3.5-turbo',
        prompt: `\n${content}`,
        messages: [
          { role: 'user', content: " c'est quoi une classe ?:" },
        ],
        max_tokens: 150,
      });
  
      if (
        response.choices &&
        response.choices.length > 0 &&
        response.choices[0].text !== undefined
      ) {
        const output = response.choices[0].text.trim();
        return res.json({ result: output });
      } else {
        console.error('Unexpected response from OpenAI:', response);
        return res.status(500).json({ error: 'Unexpected response from OpenAI.' });
      }
    } catch (error) {
      console.error('Error generating text:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  };