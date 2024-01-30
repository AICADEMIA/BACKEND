import mongoose from "mongoose";

const SeanceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  matiere: { type: mongoose.Types.ObjectId, ref: "Matiere", default: null },  

  classe: { type: mongoose.Types.ObjectId, ref: "Classe", default: null },  

  datedebut: { type: Date },
  datefin: { type: Date},


});

const Seance = mongoose.model("Seance", SeanceSchema);

export default Seance;
