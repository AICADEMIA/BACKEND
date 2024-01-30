import { body } from "express-validator";
import auth from "../middlewares/auth.js";
import express from "express";

import {
    assignTeacherToAdmin,
    consulterProfil,
    getTeacherForAdmin,
    updateUser,
    getAllTeachers,
    getAllAdmin,
    login,
    createUser,
 
  } from "../controllers/user.js";

  const router = express.Router();

  router.route("/assignteach/:professeurId").post(auth,assignTeacherToAdmin);
  router.route("/").post(createUser).get(auth,getAllAdmin).put(auth,updateUser);
  router.route("/login").post(login);
  router.route("/teachers").get(auth,getAllTeachers);
  router.route("/techAdmin").get(auth,getTeacherForAdmin);
  router.route("/profil").get(auth,consulterProfil);









  export default router;
