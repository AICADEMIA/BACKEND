import fs from 'fs';
import 'dotenv/config'; 
import fetch from 'node-fetch';
import { translate } from '@vitalets/google-translate-api';
let currentPageIndex = 0;

export async function runModel(res) {
    try {
        const content = fs.readFileSync('./data.txt', 'utf-8');
        const pages = splitIntoPages(content);

        const url = 'http://localhost:11434/api/generate';
        const data = {
            model: 'llama2',
            prompt: '',
            stream: true,
        };

        if (currentPageIndex < pages.length) {
            // Ajouter l'introduction uniquement si currentPageIndex est 0
            let prompt = (currentPageIndex === 0) 
                ? addIntroduction(pages[currentPageIndex] + "\n" + (pages[currentPageIndex + 1] || '')) 
                : pages[currentPageIndex] + "\n" + (pages[currentPageIndex + 1] || '');

            data.prompt = prompt;

            const response = await fetch(url, {
                method: 'POST',
                body: JSON.stringify(data),
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            let responseBody = '';
            for await (const chunk of response.body) {
                responseBody += chunk;
            }

            const messages = responseBody.trim().split('\n').map(line => JSON.parse(line).response);
            const formattedMessages = messages.map(formatMessage).join('');

            const translatedResponse = await translate(formattedMessages, { to: 'fr' });

            res.status(200).json({ message: formatTranslatedMessage(translatedResponse.text) });
            
            currentPageIndex += 2; // Move to the next pair of pages
        } else {
            res.status(200).json({ message: "Le cours est terminé." });
        }
    } catch (error) {
        console.error('Error running the model:', error);
        res.status(500).json({ error: error.message });
    }
}

function formatMessage(message) {
    // Replace newlines with spaces and insert newlines after punctuation
    return message.replace(/\\n/g, ' ').replace(/([.,!])/g, '$1\n');
}

function formatTranslatedMessage(message) {
    // Ensure each '\n' is converted to an actual newline in the JSON response
    return message.split('\n').join('\n');
}

function addIntroduction(content) {
    const introduction = "Vous êtes un enseignant expérimenté. Voici un résumé des points principaux couverts que vous devez enrichir pour un cours complet : ";
    return introduction + content;
}

function splitIntoPages(content) {
    // Split content into pages based on the specified delimiter
    const pages = content.split(/-{4,}Page \(\d+\) Break-{4,}/);
    return pages.filter(page => page.trim() !== '');
}
