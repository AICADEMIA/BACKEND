import fs from 'fs';
import 'dotenv/config'; 
import fetch from 'node-fetch';

// Importez le module 'fs' pour lire le contenu du fichier
export async function runModel(res,userContent) {
    const content1 = fs.readFileSync('./data.txt', 'utf-8');
    const url = 'http://localhost:11434/api/chat ';
    const data = {
        model: 'arr-llama',
        messages: [
            { role: 'user', content: content1 },
        ] 
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' }
        });
    
        if (!response.ok) {
            throw new Error(`Erreur HTTP ! statut : ${response.status}`);
        }
    
        // Parse the response body
        const responseBody = await response.text();
    
        console.log("Response from API:", responseBody);
    
        const messagesArray = responseBody.split('\n').map(line => {
            if (line.trim() !== '') {
                return JSON.parse(line.trim()).message.content;
            }
            return ''; // Ignore les lignes vides
        });

        // Divisez le messagesArray en plusieurs parties
        const parts = chunkArray(messagesArray, 5); // Divisez en parties de 5 messages

        // Traitez chaque partie séparément
        const results = parts.map((part, index) => {
            // Ajoutez l'introduction au contenu du modèle seulement pour la première partie
            const result = index === 0 ? addIntroduction(part.join('')) : part.join('');
            console.log(result);
            return result;
        });
    
        res.status(200).json({ message: results });
    
    } catch (error) {
        console.error('Erreur lors de l\'exécution du modèle :', error);
        res.status(500).json({ error: error.message });
    }
}

// Fonction pour diviser un array en plusieurs sous-arrays
function chunkArray(array, chunkSize) {
    var index = 0;
    var arrayLength = array.length;
    var tempArray = [];
  
    for (index = 0; index < arrayLength; index += chunkSize) {
        const chunk = array.slice(index, index+chunkSize);
        tempArray.push(chunk);
    }

    return tempArray;
}



function addIntroduction(content) {
    const introduction = "salut, je suis votre enseignant, je m'appelle Dali. et je vais vous aider aujourd'hui. ";
    return introduction + content;
}

