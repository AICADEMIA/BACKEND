

import mongoose from "mongoose";

const graphSchema = new mongoose.Schema(
    {description:String,
        displayName:String,
        groupTypes:[String],
        isAssignableToRole:Boolean,
        mailEnabled:Boolean,
    mailEnabled:Boolean,
    securityEnabled:Boolean,
    mailNickname:String,
   "owners@odata.bind":[String],
    "members@odata.bind":[String]}



);



export default mongoose.model("Graph", graphSchema);