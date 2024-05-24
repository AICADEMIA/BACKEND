import mongoose from "mongoose";
import User from "../models/user.js";
import Admin from "../models/admin.js";
import Professeur from "../models/professeur.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import crypto from "crypto";
import { signAccessToken, signRefreshToken } from "../middlewares/auth.js";
import { validationResult } from "express-validator";




export async function createUser(req, res) {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    try {
      const {
        firstname,
        lastname,
        phone,
        email,
        password,
        role,
        organisation,
      } = req.body;
  
      if (role !== "professeur" && role !== "admin" && role !== "superAdmin") {
        return res.status(400).json({ message: "Invalid role" });
      }
  
      const hashPass = await bcrypt.hash(password, 10);

  
      let user;
      if (role === "professeur") {
        user = await Professeur.create({
          firstname,
          lastname,
          phone,
          email,
          password: hashPass,
          role,
         organisation,
        });
      } else if (role === "superAdmin") {

        user = await User.create({
          firstname,
          lastname,
          phone,
          email,
          password: hashPass,
          role: "superAdmin",

        });
      } else if (role === "admin") {
        user = await Admin.create({
          firstname,
          lastname,
          phone,
          email,
          role,
          password: hashPass,
          organisation,
        });
      }
  
  
      return res.status(201).json({ user });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Error creating user", error });
    }
  }
  


  export async function createProf(req, res) {


    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    try {
      const {
        firstname,
        lastname,
        email,
        password,
        role,
        organisation,
      } = req.body;
  
  
      const hashPass = await bcrypt.hash(password, 10);

  
      let user;
    
        user = await Professeur.create({
          firstname,
          lastname,
          email,
          password: hashPass,
          role:"professeur",
        });
  
  
      return res.status(201).json({ user });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Error creating user", error });
    }
  }

/////////////////////////////////

  export async function login(req, res, next) {
    try {
      const { email, password } = req.body;
  
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({
          message: "No user found",
        });
      }

  
      const passwordMatches = await bcrypt.compare(password, user.password);
      if (!passwordMatches) {
        return res.status(401).json({
          message: "Password does not match",
        });
      }
  
      const accessToken = await signAccessToken(user.id);
      const userole = user.role;

      res.status(200).json({
        message: "Login successful",
        accessToken,
         userole     });
    } catch (error) {
      return res.status(500).json({
        message: "Error logging in",
        error,
      });
    }
  }



  export function getAllAdmin(req, res) {
    User.findById(req.auth.userId)
      .then((user) => {
        if (user.role === "superAdmin") {
          // Utilisateurs avec le rôle "admin"
          User.find({
            role: "admin",
            _id: { $ne: req.auth.userId },
          })
            .then((docs) => {
              res.status(200).json(docs);
            })
            .catch((err) => {
              res.status(500).json({ error: err });
            });
        } else {
          res.status(401).json({
            message: "Service only for superadmin",
          });
        }
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  }
  
  


//////////////////////////


export function getAllTeachers(req, res) {
    User.findById(req.auth.userId)
      .then((user) => {
        if (user.role === "admin") {
          // Utilisateurs avec le rôle "admin"
          User.find({
            role: "professeur",
            _id: { $ne: req.auth.userId },
          })
            .then((docs) => {
              res.status(200).json(docs);
            })
            .catch((err) => {
              res.status(500).json({ error: err });
            });
        } else {
          res.status(401).json({
            message: "Service only for superadmin",
          });
        }
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  }
  

  export function updateProfil(req, res) {
    if (!req.auth || !req.auth.userId) {
      return res.status(400).json({ error: "Invalid user ID" });
    }
  
    const updateData = req.body;
  
    // Utilisez directement le modèle User pour mettre à jour le profil
    User.findOneAndUpdate({ _id: req.auth.userId }, updateData, { new: true })
      .then((updatedUser) => {
        if (!updatedUser) {
          return res.status(404).json({ error: "User not found" });
        }
  
        res.status(200).json(updatedUser);
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  }
  


  
  

  export function getTeacherForAdmin(req, res) {
    const AdminId = req.auth.userId;
  
    Admin.findById(AdminId)
      .then((admin) => {
        if (!admin) {
          return res.status(404).json({ message: "admin not found" });
        }
  
        Professeur.find({ superviseur: AdminId })
          .then((prof) => {
            res.status(200).json(prof);
          })
          .catch((err) => {
            res.status(500).json({ error: err });
          });
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  }



  export function consulterProfil(req, res) {
    User.findOne({ _id: req.auth.userId })
      .then((docs) => {
        res.status(200).json(docs);
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  }







  export function assignTeacherToAdmin(req, res) {
    const adminId = req.auth.userId;
    const professeurId = req.params.professeurId;
  
    Admin.findById(adminId)
      .then((admin) => {
        if (!admin) {
          return res.status(404).json({ message: "Vous n'êtes pas un administrateur." });
        }
  
        Professeur.findById(professeurId)
          .then((prof) => {
            if (!prof) {
              return res.status(404).json({ message: "Professeur introuvable." });
            }
  
            // Assigne l'administrateur comme superviseur du professeur
            prof.superviseur = admin;
  
            // Sauvegarde le professeur mis à jour
            return prof.save();
          })
          .then((updatedProf) => {
            res.status(200).json(updatedProf);
          })
          .catch((err) => {
            res.status(500).json({ error: err.message });
          });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  }




  export async function deleteteacher(req, res) {
    const AdminId = req.auth.userId;
    const profId = req.params.prof
    Admin.findById(AdminId)
      .then((admin) => {
        if (!admin) {
          return res.status(404).json({ message: "admin not found" });
        }
        Professeur.findOneAndDelete({ _id : profId })
          .then((prof) => {
            res.status(200).json(prof);
          })
          .catch((err) => {
            res.status(500).json({ error: err });
          });
      })
      .catch((err) => {
        res.status(500).json({ error: err });
        console.log(err)
      });
  }

