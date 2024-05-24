import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: false,
  },
  phone: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  }, 
  codeForget: {
    type: String,
    default: "",
  },
  role: {
    type: String,
    enum: ["superAdmin", "admin","professeur"],
  },
});

const User = mongoose.model("User", userSchema);

export default User;
