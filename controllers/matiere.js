import Matiere from '../models/matiere.js';

export async function createMatiere(req, res) {
    try {
      const { title, chapitre, charge } = req.body;
      const { ppt, cour } = req.files;  // Ajout de cette ligne pour récupérer les fichiers PPT et PDF
  
      const newMatiere = new Matiere({ title, chapitre, charge });
  
      if (ppt) {
        newMatiere.ppt = ppt[0].filename;
      }
  
      if (cour) {
        newMatiere.cour = cour[0].filename;
      }
  
      const savedMatiere = await newMatiere.save();
      res.status(201).json(savedMatiere);
    } catch (error) {
      console.error('Error creating Matiere:', error);
      res.status(500).json({ error: 'Error creating Matiere' });
    }
  }
// Get all Matieres
export async function getAllMatieres(req, res) {
  try {
    const matieres = await Matiere.find();
    res.status(200).json(matieres);
  } catch (error) {
    console.error('Error getting all Matieres:', error);
    res.status(500).json({ error: 'Error getting all Matieres' });
  }
}

// Get Matiere by ID
export async function getMatiereById(req, res) {
  try {
    const matiere = await Matiere.findById(req.params.id);
    if (!matiere) {
      return res.status(404).json({ error: 'Matiere not found' });
    }
    res.status(200).json(matiere);
  } catch (error) {
    console.error('Error getting Matiere by ID:', error);
    res.status(500).json({ error: 'Error getting Matiere by ID' });
  }
}

// Update Matiere by ID
export async function updateMatiere(req, res) {
  try {
    const { title, chapitre, ppt, cour, charge } = req.body;
    const updatedMatiere = await Matiere.findByIdAndUpdate(
      req.params.id,
      { title, chapitre, ppt, cour, charge },
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
