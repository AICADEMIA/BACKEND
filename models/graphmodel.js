/*
{description:"Group 3A66",displayName:"3A66",groupTypes:["Unified"],isAssignableToRole:false,mailEnabled:true,securityEnabled:true,mailNickname:"3a66","owners@odata.bind":["https://graph.microsoft.com/v1.0/users/81386dce-d860-4600-8d05-3258caa56b04"],"members@odata.bind":["https://graph.microsoft.com/v1.0/users/jalila.jalila@WWLx255327.onmicrosoft.com"]}
*/


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



export default mongoose.model("Graph", graphSchema);;
