import mongoose from "mongoose";

const SeanceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  matiere: { type: mongoose.Types.ObjectId, ref: "Matiere", default: null },
  classe: { type: mongoose.Types.ObjectId, ref: "Classe", default: null },
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
 
}, { timestamps: true }); 

const Seance = mongoose.model("Seance", SeanceSchema);

export default Seance;

