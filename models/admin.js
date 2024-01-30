import mongoose from "mongoose";
const Schema = mongoose.Schema;
import User from "../models/user.js";

const adminSchema = new Schema(
  {
    organisation: { type: String, required: true },

  },

  {
    discriminatorKey: "role",
  }
);

const Admin = User.discriminator("Admin", adminSchema);
export default Admin;
