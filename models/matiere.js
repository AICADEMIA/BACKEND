import mongoose from "mongoose";

const MatiereSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  chapitre: {
    type: Number,
    required: true,
  },
  ppt: {
    type: String,
    required: false,
  },
  cour: {
    type: String,
    required: true,
  },
  charge: {
    type: Number,
    required: true,
  },
});

const Matiere = mongoose.model("Matiere", MatiereSchema);

export default Matiere;
