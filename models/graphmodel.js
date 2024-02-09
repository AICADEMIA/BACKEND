/*
{description:"Group 3A66",displayName:"3A66",groupTypes:["Unified"],isAssignableToRole:false,mailEnabled:true,securityEnabled:true,mailNickname:"3a66","owners@odata.bind":["https://graph.microsoft.com/v1.0/users/81386dce-d860-4600-8d05-3258caa56b04"],"members@odata.bind":["https://graph.microsoft.com/v1.0/users/jalila.jalila@WWLx255327.onmicrosoft.com"]}
*/


import mongoose from "mongoose";

const graphSchema = new mongoose.Schema(
    {description:String,
        displayName:String,
        groupTypes:[ 
            "Unified"
        ],

        isAssignableToRole:false,
        mailEnabled:true,
    mailEnabled:true,
    securityEnabled:true,
    mailNickname:String,
   "owners@odata.bind":["https://graph.microsoft.com/v1.0/users/81386dce-d860-4600-8d05-3258caa56b04"],
    "members@odata.bind":["https://graph.microsoft.com/v1.0/users/jalila.jalila@WWLx255327.onmicrosoft.com"]}

);



export default mongoose.model("Graph", graphSchema);;
           