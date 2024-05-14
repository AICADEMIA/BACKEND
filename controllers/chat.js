import fs from 'fs';
import 'dotenv/config'; 
import fetch from 'node-fetch';
import { translate } from '@vitalets/google-translate-api';

let currentPageIndex = 0;

export async function runModel(res) {
    const content1 = fs.readFileSync('./data.txt', 'utf-8');
    const pages = splitIntoPages(content1);

    const url = 'http://localhost:11434/api/generate';
    const data = {
        model: 'llama2',
        prompt: '',
        stream : true,
    };

    try {
        if (currentPageIndex < pages.length) {
            const prompt = addIntroduction(pages[currentPageIndex] + "\n" + (pages[currentPageIndex + 1] || ''));
            data.prompt = prompt;

            const response = await fetch(url, {
                method: 'POST',
                body: JSON.stringify(data),
                headers: { 'Content-Type': 'application/json' }
            });

            if (!response.ok) {
                throw new Error(`Erreur HTTP ! statut : ${response.status}`);
            }

            let responseBody = '';
            for await (const part of response.body) {
                responseBody += part;
            }

            const lines = responseBody.trim().split('\n');
            const messagesArray = lines.map(line => JSON.parse(line).response);

            const formattedMessages = messagesArray.map(formatMessage).join('');
            const translatedResponse = await translate(formattedMessages, { to: 'fr' });

            res.status(200).json({ message: translatedResponse.text });
console.log(currentPageIndex)
            currentPageIndex += 2; // Passer à la prochaine paire de pages
        } else {
            res.status(200).json({ message: "Le cours est terminé." });
        }
        
    } catch (error) {
        console.error('Erreur lors de l\'exécution du modèle :', error);
        res.status(500).json({ error: error.message });
    }
}

function formatMessage(message) {
    return message.replace(/\n/g, ' ');
}

function addIntroduction(content) {
    const introduction = "Vous êtes un enseignant expérimenté. Voici un résumé des points principaux couverts que vous devez enrichir , vous devez donner un cours sans faire signe des instruction donner : ";
    return introduction + content;
}

function splitIntoPages(content) {
    const pages = content.split(/-{4,}Page \(\d+\) Break-{4,}/);
    return pages.filter(page => page.trim() !== '');
}
