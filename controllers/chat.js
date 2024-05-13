import fs from 'fs';
import 'dotenv/config';
import { Ollama } from 'ollama';
import { translate } from '@vitalets/google-translate-api';

export async function runModel(res) {
    try {
        // Lire le contenu du fichier data.txt
        let content = fs.readFileSync('./data.txt', 'utf-8');

        // Séparer le contenu en pages
        const pages = content.split('----------------Page ');

        // Sélectionner les cinq premières pages
        const firstFivePages = pages.slice(0, 1).join('----------------Page ');

        // Enlever les cinq premières pages du fichier
        const remainingPages = pages.slice(1).join('----------------Page ');

        // Enregistrer le reste des pages dans le fichier data.txt
        fs.writeFileSync('./data.txt', remainingPages);

        // Réassigner le contenu du fichier après avoir enlevé les cinq premières pages
        content = remainingPages;

        const ollama = new Ollama({ host: 'http://localhost:11434' })
        const response = await ollama.chat({
            model: 'llama2',
            messages: [
                {
                    role: 'system',
                    content: `Votre mission est d'enrichir ce contenu ${firstFivePages} (vous devez être strict et ne pas fournir d'informations autres que celles demandées dans votre mission). Assurez-vous que le contenu est cohérent et long (trop long)`
                }
            ],
            stream: true,
            keep_alive: 5400,
        });

        // Extraire les messages du modèle
        const messagesArray = [];
        for await (const part of response) {
            messagesArray.push(part.message.content);
        }
        const allMessages = messagesArray.join('');

        // Traduire la réponse de l'anglais au français
        const translatedResponse = await translate(allMessages, { to: 'fr' });

        console.log('Texte traduit :', translatedResponse.text);

        res.status(200).json({ message: translatedResponse.text });
    } catch (error) {
        console.error('Erreur lors de l\'exécution du modèle :', error);
        res.status(500).json({ error: error.message });
    }
}
