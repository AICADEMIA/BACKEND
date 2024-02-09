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
import chatRoute from "./routes/chat.js";


const app = express();

const server = http.createServer(app);

const port = process.env.PORT || 9090;
mongoose.set("strictQuery", false);

mongoose
  .connect("mongodb+srv://dali:KHe3zKln4Z1t1298@cluster0.4n6wuk0.mongodb.net/pfe", {
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
app.use("/chat",chatRoute)

app.use(notFoundError);
app.use(errorHandler);


server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
