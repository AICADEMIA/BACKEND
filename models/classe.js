import mongoose from "mongoose";


const EtudiantSchema = new mongoose.Schema({
    email: {
      type: String,
      required: true,
      unique: true,
    },
  });

const ClasseSchema = new mongoose.Schema({
   etudiants: [EtudiantSchema], 

  professeur: { type: mongoose.Types.ObjectId, ref: "Professeur", default: null },  

});

const Classe = mongoose.model("Classe", ClasseSchema);

export default Classe;
