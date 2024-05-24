import mongoose from "mongoose";
const Schema = mongoose.Schema;
import User from "../models/user.js";

const professeurSchema = new Schema(
  {
    organisation: { type: String, required: false },


    Classe: { type: mongoose.Types.ObjectId, ref: "Classe", default: null },  

  },

  {
    discriminatorKey: "role",
  }
);

const Professeur = User.discriminator("Professeur", professeurSchema);
export default Professeur;
