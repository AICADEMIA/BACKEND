import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import cors from "cors";
import path from "path";
import http from "http";

import {errorHandler, notFoundError } from "./middlewares/error-handler.js";

import userRoute from "./routes/user.js";
import seanceRoute from "./routes/senace.js";
import classeRoute from "./routes/classe.js";
import matiereRoute from "./routes/matiere.js";

const app = express();
const databaseName = 'AICademia';

const server = http.createServer(app);


const port = process.env.PORT || 9090;
mongoose.set("strictQuery", false);
var mongoDBLink;
mongoDBLink = `mongodb://127.0.0.1/${databaseName}`;
mongoose
  .connect(mongoDBLink, {
  })
  .then(() => console.log("connected"))
  .catch((error) => console.log(error));


app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/img", express.static("public"));

app.use((req, res, next) => {
  console.log("middleware just ran");
  next();
});




app.use("/user", userRoute);
app.use("/seance",seanceRoute)
app.use("/matiere",matiereRoute)
app.use("/classe",classeRoute)

app.use(notFoundError);
app.use(errorHandler);


server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
