import express from "express";
import "express-async-errors";
import morgan from "morgan";
import multer from "multer";
import cors from "cors";
//import { CloudinaryStorage } from "multer-storage-cloudinary";

import {
  getAllExaminations,
  getDistinctExaminations,
  getExamination,
  getExaminationsForSample,
  getFavorites,
  addExamination,
  updateExamination,
  getExamiantionInfo,
  getSamples,
  addSample,
  getSamplesInLab,
  addSampleInLab,
  getDoctor,
  addDoctor,
  getLaboratory,
  getLaboratoryName,
  getPatient,
  addPatient,
  authorizeLogin,
  updatePatient,
  updatePatientAvatar,
  uploadTest,
} from "./controllers/samples.js";
import upload from "./cloudinary.js";

/* Data files */
//import INIT_EXAMINATIONS from "./data/examinations.js";

//let examinations = INIT_EXAMINATIONS;

const app = express();
const port = process.env.PORT || 3000;

app.use(morgan("dev"));
app.use(express.json());
app.use(cors());

// Get all examinations
app.get("/examinations", getAllExaminations);

// Get distinct (on name) examinations for display reasons in the home page
app.get("/home", getDistinctExaminations);

// Get a specific examination
app.get("/examinations/:id", getExamination);

// Get favorite examinations
app.get("/favorites", getFavorites);

// Add an examination
app.post("/examinations", addExamination);

// Update an examination
app.put("/examinations/:id", updateExamination);

// Get all examinations info
app.get("/examinations-info", getExamiantionInfo);

// Get samples for current patient
app.get("/samples", getSamples);

// Patient adds a new sample
app.post("/samples", addSample);

// Patients tests (Tests page)
app.get("/tests", getSamplesInLab);

// Patients test results (A certain test page/TestDetails Page)
app.get("/tests/:id", getExaminationsForSample);

// Patient adds a new lab test
// Here we should specify that a new sample was added &
// add the new examinations from this lab test
app.post("/tests", addSampleInLab);

// Get a doctor
// We will find them by name and it will be sent from another request
// that will contain it, that's why we don't need to say /:id here
app.get("/doctor", getDoctor);

// Add a doctor
app.post("/doctor", addDoctor);

// Get laboratory data
app.get("/laboratory", getLaboratory);

// Get laboratory name (not used)
app.get("/laboratory/:id", getLaboratoryName);

// Get patient data (Profile)
app.get("/patient/:id", getPatient);

// Add a new patient (Sign Up)
app.post("/sign-up", addPatient);

// Login patient (Login)
app.post("/login", authorizeLogin);

// Update current patient data
app.put("/patient", updatePatient);

// Update current patient avatar
app.put("/patient-avatar", updatePatientAvatar);

app.post("/upload", uploadTest);

app.listen(port, () => console.log(`Server Running on port ${port}`));
