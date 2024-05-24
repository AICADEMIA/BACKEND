import mongoose from "mongoose";

const SeanceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  matiere: String,
  classe: String,
  datetimedebut: { type: Date },
  datetimefin: { type: Date},
  ppt: {
    type: String,
    required: false,
  },
  cour: {
    type: String,
    required: false,
  },
  ChapitreName: {
    type: String,
    required: false,
  },
  professeur: { type: mongoose.Types.ObjectId, ref: "Professeur", default: null },  

}, { timestamps: true }); 

const Seance = mongoose.model("Seance", SeanceSchema);

export default Seance;

