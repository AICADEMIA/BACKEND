import mongoose from "mongoose";

const GroupeSchema = new mongoose.Schema({
  groupid: {
    type: String,
    required: true,
  },
  nom: {
    type: String,
    required: true,
  },
});

const Group = mongoose.model("Group", GroupeSchema);

export default Group;
