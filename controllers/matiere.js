import Matiere from '../models/matiere.js';
import { recognizeText } from '../config/ocr.js';
import path from 'path';
import { promisify } from 'util';

import fs from 'fs';
import PDFParser from 'pdf2json';


 async function extractTextFromPDF(pdfFilePath) {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser(this,1);

    pdfParser.on('pdfParser_dataError', errData => {
      reject(errData.parserError);
    });

    pdfParser.on('pdfParser_dataReady', () => {
      const extractedText = pdfParser.getRawTextContent();
      resolve(extractedText); // Résoudre la promesse avec extractedText
    });

    pdfParser.loadPDF(pdfFilePath);
  });
}


export async function createMatiere(req, res) {
  try {
    const { title, chapitre, charge } = req.body;

    // Créer une nouvelle instance de Matiere avec les chemins de fichier
    const newMatiere = new Matiere({ 
      title, 
      chapitre, 
      charge, 
    });

    const savedMatiere = await newMatiere.save();
    

    res.status(201).json(savedMatiere);
  } catch (error) {
    console.error('Erreur lors de la création de la Matiere:', error);
    res.status(500).json({ error: 'Erreur lors de la création de la Matiere' });
  } 
}

// Update Matiere by ID
export async function updateMatiere(req, res) {
  try {
    const { title, chapitre, charge } = req.body;
    const updatedMatiere = await Matiere.findByIdAndUpdate(
      req.params.id,
      { title, chapitre , charge },
      { new: true }
    );
    if (!updatedMatiere) {
      return res.status(404).json({ error: 'Matiere not found' });
    }
    res.status(200).json(updatedMatiere);
  } catch (error) {
    console.error('Error updating Matiere:', error);
    res.status(500).json({ error: 'Error updating Matiere' });
  }
}

export async function deleteMatiere(req, res) {
  try {
    const deletedMatiere = await Matiere.findByIdAndDelete(req.params.id);
    if (!deletedMatiere) {
      return res.status(404).json({ error: 'Matiere not found' });
    }
    res.status(200).json(deletedMatiere);
  } catch (error) {
    console.error('Error deleting Matiere:', error);
    res.status(500).json({ error: 'Error deleting Matiere' });
  }
}



export function getAllMatiere(req, res) {
  Matiere.find()

    .then((docs) => {
      res.status(200).json(docs);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
}