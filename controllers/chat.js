import OpenAI from 'openai';
import fs from 'fs';
import 'dotenv/config'; 

const OPENAI_API_KEY = "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";

const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
  });
  export async function chatgpt(req, res) {
    try {
  
      const content1 = fs.readFileSync('./data.txt', 'utf-8');
      console.log(content1);
  
      // Ajoutez le message d'introduction au début de chaque segment de contenu
      const contentWithIntroduction = addIntroduction(content1);
  
      // Divisez le contenu avec l'introduction en segments plus petits (par exemple, 2000 caractères par segment)
      const segments = splitContent(contentWithIntroduction, 2000);
  
      let generatedResponses = [];
  
      // Envoyez chaque segment au modèle pour générer une réponse
      for (const segment of segments) {
        const response = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'user', content: `Tu es un enseignant et tu dois commencer par te presenter comme un enseignant et apres en se basant sur le fichier data.txt (sans avouer que tu se base sur lui ) donne moi un cour complet ` },
            { role: 'assistant', content: segment }
          ],
          max_tokens: 2000
        });
  
        if (response.choices && response.choices.length > 0) {
          generatedResponses.push(response.choices[0].message.content.trim());
        }
      }
  
      // Concaténez les réponses générées pour former une réponse complète et bien structurée
      let result = generatedResponses.join(' ');
  
      // Supprimer le message d'introduction des réponses générées sauf pour la première réponse
      result = result.replace(addIntroduction(''), '');
  
      return res.json({ result });
    } catch (error) {
      console.error('Error generating text:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
  
  function addIntroduction(content) {
    const introduction = "Bonjour, je suis votre enseignante. Je m'appelle Farah et je vais vous assister dans ce cours. ";
    return introduction + content;
  }
  
  function splitContent(content, maxLength) {
    const segments = [];
    for (let i = 0; i < content.length; i += maxLength) {
      segments.push(content.substring(i, i + maxLength));
    }
    return segments;
  }
  