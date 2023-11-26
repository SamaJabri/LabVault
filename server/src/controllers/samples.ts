import { Request, Response } from "express";
import pgPromise from "pg-promise";
import fs from "fs";
//import { v2 as cloudinary } from "cloudinary";
import { spawn } from "child_process";

import {
  hematologyLaboratory,
  biochemistryLaboratory,
  hormonLaboratory,
  HBA1CLaboratory,
  elisaLaboratory,
} from "../data/examination-names.js";

//import hematology from "../data/hematology.json";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);

require("dotenv").config();

const hematologyFile = require("../../hematology.json");
const biochemistryFile = require("../../biochemistry.json");
const hormonFile = require("../../hormon.json");
const hba1cFile = require("../../hba1c.json");
const elisaFile = require("../../elisa.json");

const db = pgPromise()(process.env.POSTGRES_URL || "");

type Examination = {
  exam: String;
  value: Number;
};

type Laboratory = Examination[];

const setupDb = async () => {
  await db.none(`
    DROP TABLE IF EXISTS laboratories;

    CREATE TABLE laboratories (
      id SERIAL NOT NULL PRIMARY KEY,
      name VARCHAR(255) NOT NULL
    );
  `);

  await db.none(`
    DROP TABLE IF EXISTS doctors;

    CREATE TABLE doctors (
      id SERIAL NOT NULL PRIMARY KEY,
      name VARCHAR(255) NOT NULL
    );
  `);

  await db.none(`
    DROP TABLE IF EXISTS patients;

    CREATE TABLE patients (
      id SERIAL NOT NULL PRIMARY KEY,
      tc INTEGER,
      name VARCHAR(255) NOT NULL,
      surname VARCHAR(255) NOT NULL,
      gender VARCHAR(255),
      email VARCHAR(255),
      username VARCHAR(255) NOT NULL,
      password VARCHAR(255) NOT NULL,
      age INTEGER,
      weight INTEGER,
      height INTEGER,
      img_src VARCHAR(255)
    );
  `);

  await db.none(`
    DROP TABLE IF EXISTS patients_info;

    CREATE TABLE patients_info (
      id INTEGER NOT NULL PRIMARY KEY,
      birthday TIMESTAMP,
      age INTEGER,
      FOREIGN KEY (id) REFERENCES patients (id)
    );
  `);

  await db.none(`
    DROP TABLE IF EXISTS samples;

    CREATE TABLE samples (
      id SERIAL NOT NULL PRIMARY KEY,
      patient_id INTEGER NOT NULL,
      doctor_id INTEGER NOT NULL,
      request_time TIMESTAMP NOT NULL,
      acceptance_time TIMESTAMP NOT NULL,
      time TIMESTAMP NOT NULL,
      type VARCHAR(255),
      FOREIGN KEY (patient_id) REFERENCES patients (id),
      FOREIGN KEY (doctor_id) REFERENCES doctors (id)
    );
  `);

  await db.none(`
    DROP TABLE IF EXISTS sample_in_lab;

    CREATE TABLE sample_in_lab (
      id SERIAL NOT NULL PRIMARY KEY,
      sample_id INTEGER NOT NULL,
      lab_id INTEGER NOT NULL,
      expert_approval_time TIMESTAMP NOT NULL,
      FOREIGN KEY (sample_id) REFERENCES samples (id),
      FOREIGN KEY (lab_id) REFERENCES laboratories (id)
    );
  `);

  await db.none(`
    DROP TABLE IF EXISTS examinations_info;

    CREATE TABLE examinations_info (
      name VARCHAR(255) NOT NULL PRIMARY KEY,
      unit VARCHAR(255) NOT NULL,
      starting_normal_range INTEGER NOT NULL,
      ending_normal_range INTEGER NOT NULL
    )
  `);

  await db.none(`
    DROP TABLE IF EXISTS examinations;

    CREATE TABLE examinations (
      id SERIAL NOT NULL PRIMARY KEY,
      sample_id INTEGER NOT NULL,
      sample_in_lab_id INTEGER NOT NULL,
      name VARCHAR(255) NOT NULL,
      result INTEGER,
      situation VARCHAR(255),
      is_favorite BOOLEAN DEFAULT false,
      FOREIGN KEY (sample_id) REFERENCES samples (id),
      FOREIGN KEY (sample_in_lab_id) REFERENCES sample_in_lab (id),
      FOREIGN KEY (name) REFERENCES examinations_info (name)
    )
  `);

  await db.none(
    `INSERT INTO examinations (id, sample_id, sample_in_lab_id, name, unit, starting_normal_range, ending_normal_range, date, isFavorite) VALUES (0, 0, 0, 'MCV', 'mg', 15, 20, '2023-04-04', true)`
  );

  const examinations = await db.many(`SELECT * FROM examinations;`);
  console.log(examinations);
};

//setupDb();

const getAllExaminations = async (req: Request, res: Response) => {
  /* const examinations = await db.many(
    `SELECT DISTINCT ON (name) * FROM examinations ORDER BY name, id DESC;`
  ); */

  //const { id: patientId } = req.params;

  const samples = await getSamples(req, res);

  const samplesIds = samples.map((sample) => sample.id);

  const examinations = await db.manyOrNone(
    `SELECT e.id, e.sample_id, e.sample_in_lab_id, e.name, e.result, e.situation, e.is_favorite,
    ei.unit, ei.starting_normal_range, ei.ending_normal_range, sil.expert_approval_time as date
    FROM examinations e
    INNER JOIN examinations_info ei ON e.name = ei.name
    INNER JOIN sample_in_lab sil ON e.sample_in_lab_id = sil.id
    WHERE e.sample_id = ANY($1)`,
    [samplesIds]
  );

  if (examinations.length === 0) {
    res.status(404).json({ msg: "No examinations found" });
  } else {
    res.status(200).json(examinations);
    return examinations;
  }
};

const getDistinctExaminations = async (req: Request, res: Response) => {
  const samples = await getSamples(req, res);

  const samplesIds = samples.map((sample) => sample.id);

  const examinations = await db.manyOrNone(
    `SELECT DISTINCT ON (e.name)
    e.id, e.sample_id, e.sample_in_lab_id, e.name, e.result, e.situation, e.is_favorite,
    ei.unit, ei.starting_normal_range, ei.ending_normal_range, sil.expert_approval_time as date
    FROM examinations e
    INNER JOIN examinations_info ei ON e.name = ei.name
    INNER JOIN sample_in_lab sil ON e.sample_in_lab_id = sil.id
    WHERE e.sample_id = ANY($1)
    ORDER BY e.name, e.id DESC;`,
    [samplesIds]
  );

  examinations
    ? res.status(200).json(examinations)
    : res.status(404).json({ msg: "No examinations added yet" });
};

const getExamination = async (req: Request, res: Response) => {
  const { id } = req.params;

  const examination = await db.manyOrNone(
    `SELECT e.id, e.sample_id, e.sample_in_lab_id, e.name, e.result, e.situation, e.is_favorite,
    ei.unit, ei.starting_normal_range, ei.ending_normal_range, sil.expert_approval_time as date
    FROM examinations e
    INNER JOIN examinations_info ei ON e.name = ei.name
    INNER JOIN sample_in_lab sil ON e.sample_in_lab_id = sil.id
    WHERE e.id = $1`,
    Number(id)
  );

  res.status(200).json(examination);
};

const getExaminationsForSample = async (req: Request, res: Response) => {
  const { id } = req.params;

  const examinations = await db.manyOrNone(
    `SELECT e.id, e.sample_id, e.sample_in_lab_id, e.name, e.result, e.situation, e.is_favorite,
    ei.unit, ei.starting_normal_range, ei.ending_normal_range
    FROM examinations e
    INNER JOIN examinations_info ei ON e.name = ei.name
    WHERE e.sample_in_lab_id = $1;`,
    Number(id)
  );

  examinations
    ? res.status(200).json(examinations)
    : res.status(404).json({ msg: "No examiantions found" });

  return examinations;
};

// Not Used
const getFavorites = async (req: Request, res: Response) => {
  const favorites = await db.manyOrNone(`
    SELECT * FROM examinations WHERE is_favorite = true`);

  favorites
    ? res.status(200).json(favorites)
    : res.status(404).json({ msg: "No favorite examinations found" });
};

const addExamination = async (req: Request, res: Response) => {
  const { sample_id, sample_in_lab_id, name, value, situation } = req.body;

  // check if the name exists in the examinations_info table
  const examinationInfo = await db.oneOrNone(
    `SELECT * FROM examinations_info WHERE name = $1`,
    [name]
  );

  // if examinationInfo is null, then the name does not exist in the examinations_info table
  if (!examinationInfo) {
    throw new Error(
      `Name ${name} does not exist in the examinations_info table`
    );
  }

  await db.none(
    `INSERT INTO examinations (
            sample_id,
            sample_in_lab_id,
            name,
            result,
            situation
        )
        VALUES (
            $1, $2, $3, $4, $5
        )`,
    [sample_id, sample_in_lab_id, name, value, situation]
  );

  // return res.status(201).json({ msg: "Examination was added." });
};

const updateExamination = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { is_favorite } = req.body;

  await db.none(`UPDATE examinations SET is_favorite = $1 WHERE id = $2`, [
    is_favorite,
    Number(id),
  ]);

  res.status(200).json({ msg: "Examination updated successfully" });
};

const getExamiantionInfo = async (req: Request, res: Response) => {
  const info = await db.many(`SELECT * FROM examinations_info`);

  info
    ? res.status(200).json(info)
    : res.status(404).json({ msg: "No data found" });
};

const getSamples = async (req: Request, res: Response) => {
  const patient_id = req.query.patient_id;

  const samples = await db.manyOrNone(
    `SELECT * FROM samples WHERE patient_id = $1;`,
    patient_id
  );

  //res.status(200).json(samples);
  return samples;
};

const addSample = async (req: Request, res: Response) => {
  const { patient_id, request_time, acceptance_time, date, type } = req.body;

  const doctor = await getDoctor(req, res);

  // Check if it already exists
  const currentSample = await db.oneOrNone(
    `SELECT * FROM samples WHERE patient_id = $1 AND doctor_id = $2 AND time = $3;`,
    [patient_id, doctor.id, date]
  );

  if (currentSample) {
    //res.status(422).json({ msg: "Sample already exists." });
    return { id: currentSample.id };
  } else {
    const newSample = await db.one(
      `INSERT INTO samples (
            patient_id,
            doctor_id,
            request_time,
            acceptance_time,
            time,
            type
        )
        VALUES (
            $1, $2, $3, $4, $5, $6
        )
        RETURNING id`,
      [patient_id, doctor.id, request_time, acceptance_time, date, type]
    );

    // res.status(201).json({ msg: "Sample was added." });

    return { id: newSample.id };
  }
};

const getSamplesInLab = async (req: Request, res: Response) => {
  const samples = await getSamples(req, res);

  const samplesIds = samples.map((sample) => sample.id);

  const samplesInLab = await db.manyOrNone(
    `SELECT
      s.id,
      s.expert_approval_time,
      l.name AS lab_name,
      d.name AS doctor_name
    FROM
      sample_in_lab s
      JOIN laboratories l ON s.lab_id = l.id
      JOIN samples sa ON s.sample_id = sa.id
      JOIN doctors d ON sa.doctor_id = d.id
    WHERE
      s.sample_id = ANY($1);`,
    [samplesIds]
  );

  res.status(200).json(samplesInLab);
  return samplesInLab;
};

const addSampleInLabProcess = async (
  req: Request,
  res: Response,
  lab: Laboratory,
  labName: String,
  sample: { id: Number }
) => {
  const { date } = req.body;

  const { id } = await getLaboratory(labName);

  // Check if it already exists
  const currentSampleInLab = await db.oneOrNone(
    `SELECT * FROM sample_in_lab WHERE sample_id = $1 AND lab_id = $2;`,
    [sample.id, id]
  );

  if (currentSampleInLab) {
    throw new Error("Sample already exists.");
    //return res.status(422).json({ msg: "Sample already exists." });
  } else {
    const sampleInLab = await db.one(
      `INSERT INTO sample_in_lab (
            sample_id,
            lab_id,
            expert_approval_time
        )
        VALUES (
            $1, $2, $3
        )
        RETURNING id`,
      [sample.id, id, date]
    );

    lab.map(async (examination: Examination) => {
      req.body.sample_id = sample.id;
      req.body.sample_in_lab_id = sampleInLab.id;
      req.body.name = examination.exam;
      req.body.value = examination.value;

      await addExamination(req, res);
    });
  }
};

const addSampleInLab = async (req: Request, res: Response) => {
  const { hematology, biochemistry, hormon, hba1c, elisa } = req.body;

  const sample = await addSample(req, res);

  try {
    if (hematology) {
      await addSampleInLabProcess(
        req,
        res,
        hematology,
        "Hematology Laboratory",
        sample
      );
    }
    if (biochemistry) {
      await addSampleInLabProcess(
        req,
        res,
        biochemistry,
        "Biochemistry Laboratory",
        sample
      );
    }
    if (hormon) {
      await addSampleInLabProcess(
        req,
        res,
        hormon,
        "Hormon Laboratory",
        sample
      );
    }
    if (hba1c) {
      await addSampleInLabProcess(req, res, hba1c, "HBA1C Laboratory", sample);
    }
    if (elisa) {
      await addSampleInLabProcess(req, res, elisa, "Elisa Laboratory", sample);
    }
  } catch (error) {
    if (error instanceof Error) {
      if (
        error.message.includes("does not exist in the examinations_info table")
      ) {
        return res.status(500).json({ msg: error.message });
      } else {
        console.log(error);

        return res.status(422).json({ msg: error.message });
      }
    } else {
      console.log(error);
      return res.status(500).json({ msg: "Server error." });
    }
  }

  return res.status(201).json({ msg: "Test was added." });
};

const getDoctor = async (req: Request, res: Response) => {
  const { doctor_name } = req.body;

  const doctor = await db.oneOrNone(
    `SELECT * FROM doctors WHERE name = $1`,
    doctor_name.toUpperCase()
  );

  if (doctor) {
    //res.status(200).json(doctor);
    return { id: doctor.id };
  } else {
    const newDoctor = await addDoctor(req, res);

    return { id: newDoctor.id };
  }
};

const addDoctor = async (req: Request, res: Response) => {
  const { doctor_name } = req.body;

  const newDoctor = await db.one(
    `INSERT INTO doctors (name) VALUES($1) RETURNING id`,
    doctor_name.toUpperCase()
  );

  //res.status(201).json({ msg: "Doctor was added." });

  return { id: newDoctor.id };
};

const getLaboratory = async (labName: String) => {
  const laboratory = await db.one(
    `SELECT id FROM laboratories WHERE name = $1`,
    labName
  );

  return { id: laboratory.id };
};

// Not used
const getLaboratoryName = async (req: Request, res: Response) => {
  const { id } = req.params;

  const laboratory = await db.one(
    `SELECT * FROM laboratories WHERE id = $1`,
    id
  );

  laboratory
    ? res.status(200).json(laboratory)
    : res.status(404).json({ msg: "No lab found" });
  return laboratory;
};

const getPatient = async (req: Request, res: Response) => {
  const { id } = req.params;

  const patient = await db.one(
    `SELECT * FROM patients WHERE id = $1`,
    Number(id)
  );

  const patientAge = await db.one(
    `SELECT * FROM patients_info WHERE id = $1`,
    Number(id)
  );

  const patientInfo = { ...patient, ...patientAge };

  res.status(200).json(patientInfo);

  return patientInfo;
};

const authorizeLogin = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const patient = await db.oneOrNone(
    `SELECT * FROM patients WHERE username = $1`,
    username
  );

  if (!patient) {
    return res
      .status(404)
      .json({ msg: "User data not found, try signing up first" });
  } else {
    const patientAge = await db.oneOrNone(
      `SELECT * FROM patients_info WHERE id = $1`,
      patient.id
    );

    const patientInfo = { ...patient, ...patientAge };

    if (patient && patient.password !== password) {
      return res.status(401).json({ msg: "Wrong username or password" });
    } else {
      return res.status(200).json(patientInfo);
    }
  }
};

const addPatient = async (req: Request, res: Response) => {
  const {
    tc,
    name,
    surname,
    username,
    password,
    email,
    gender,
    weight,
    height,
    img_src,
    birthday,
  } = req.body;

  // Check if user already exists
  const doesPatientExist = await db.oneOrNone(
    `SELECT * FROM patients WHERE username = $1`,
    username
  );

  if (doesPatientExist) {
    return res.status(409).json({ msg: "Username taken" });
  } else {
    const newPatient = await db.one(
      `
        INSERT INTO patients (
            tc,
            name,
            surname,
            username,
            password,
            email,
            gender,
            weight,
            height,
            img_src
        ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10
        ) RETURNING *;
    `,
      [
        tc,
        name,
        surname,
        username,
        password,
        email,
        gender,
        weight,
        height,
        img_src,
      ]
    );

    const patientAge = await db.one(
      `INSERT INTO patients_info (id, birthday) VALUES ($1, $2) RETURNING *;`,
      [newPatient.id, birthday]
    );

    const patientInfo = { ...newPatient, ...patientAge };

    return res.status(201).json(patientInfo);
  }
};

const updatePatient = async (req: Request, res: Response) => {
  const { id, tc, name, surname, email, gender, weight, height, birthday } =
    req.body;

  const updatedPatient = await db.oneOrNone(
    `UPDATE patients
    SET tc = $1, name = $2, surname = $3,
    email = $4, gender = $5, weight = $6,
    height = $7
    WHERE id = $8
    RETURNING *`,
    [tc, name, surname, email, gender, weight, height, id]
  );

  const updatedAge = await db.oneOrNone(
    `UPDATE patients_info
    SET birthday = $1
    WHERE id = $2
    RETURNING *`,
    [birthday, id]
  );

  const patientNewInfo = { ...updatedPatient, ...updatedAge };

  patientNewInfo
    ? res.status(200).json(patientNewInfo)
    : res.status(500).json({ msg: "Something went wrong, please try again!" });
};

const updatePatientAvatar = async (req: Request, res: Response) => {
  const { id, img_src } = req.body;

  const updatedPatient = await db.oneOrNone(
    `UPDATE patients SET img_src = $1 WHERE id = $2 RETURNING *`,
    [img_src, id]
  );

  const patientInfo = await db.one(
    `
      SELECT *
      FROM patients
      INNER JOIN patients_info ON patients.id = patients_info.id
      WHERE patients.id = $1
      `,
    id
  );

  updatedPatient
    ? res.status(200).json(patientInfo)
    : res.status(500).json({ msg: "Something went wrong, please try again!" });
};

// Image processing functions

// Function to find numeric values in the file
function getFirstNumericValue(str: String) {
  const regexNumber = /\d+(\.\d+)?/;
  const regexDate = /\d{1,2}\/\d{1,2}\/\d{4}/;
  const regexLetters = /[a-zA-Z]+/;

  const lines = str.split(" ");

  let matchValue = null;

  for (let line of lines) {
    if (!regexDate.test(line)) {
      // Ignore lines that match the date pattern
      matchValue = line.match(regexNumber); // Search for the first numerical value in the line

      // Stop searching if a numerical value is found
      if (matchValue && !matchValue.input?.match(regexLetters)) {
        break;
      }
    }
  }

  return matchValue ? parseFloat(matchValue[0]) : null;
}

// Function to get the best match
// Example:
// Kolesterol with Kolesterol, HDL Kolesterol
// --> Returns Kolestrol
const getAccurateMatch = (
  labName: string,
  labs: string[]
): string | undefined => {
  let maxMatchLength = 0;
  let mostAccurateMatch: string | undefined;

  for (let i = 0; i < labs.length; i++) {
    const lab = labs[i];

    // Check if the lab name is contained in the string or vice versa
    if (
      labName.toUpperCase().includes(lab.toUpperCase()) ||
      lab.toUpperCase().includes(labName.toUpperCase())
    ) {
      // Find the length of the longest common substring
      const longestCommonSubstring = labName
        .split("")
        .filter((char) => lab.toUpperCase().includes(char.toUpperCase()))
        .join("");
      const commonSubstringLength = longestCommonSubstring.length;

      if (commonSubstringLength > maxMatchLength) {
        maxMatchLength = commonSubstringLength;
        mostAccurateMatch = lab;
      }
    }
  }

  return mostAccurateMatch;
};

// Process the data and split it to different files
const processFile = (inputFile: string, req: Request, res: Response) =>
  fs.promises
    .readFile(inputFile, { encoding: "utf8" })
    .then((data) => {
      const lines = data.split("\n");
      const hematologyData: {}[] = [];
      const biochemistryData = [];
      const HormonData = [];
      const HBA1CData = [];
      const ElisaData = [];

      for (let j = 0; j < hematologyLaboratory.length; j++) {
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].includes(hematologyLaboratory[j])) {
            const line = lines[i].split(" ");

            line.map((data) => {
              if (data === hematologyLaboratory[j]) {
                const value = getFirstNumericValue(lines[i]);

                hematologyData.push({ exam: hematologyLaboratory[j], value });
              }
            });
          }
        }
      }

      for (let i = 0; i < lines.length; i++) {
        const labName = getAccurateMatch(lines[i], biochemistryLaboratory);
        const value = getFirstNumericValue(lines[i]);

        labName && value && biochemistryData.push({ exam: labName, value });
      }

      /*         for (let j = 0; j < biochemistryLaboratory.length; j++) {
          for (let i = 0; i < lines.length; i++) {
            if (lines[i].includes(biochemistryLaboratory[j])) {
              const value = getFirstNumericValue(lines[i]);

              biochemistryData.push({ exam: biochemistryLaboratory[j], value });
            }
          }
        }  */

      for (let i = 0; i < lines.length; i++) {
        const labName = getAccurateMatch(lines[i], hormonLaboratory);
        const value = getFirstNumericValue(lines[i]);

        labName && value && HormonData.push({ exam: labName, value });
      }

      for (let i = 0; i < lines.length; i++) {
        const labName = getAccurateMatch(lines[i], HBA1CLaboratory);
        const value = getFirstNumericValue(lines[i]);

        labName && value && HBA1CData.push({ exam: labName, value });
      }

      for (let i = 0; i < lines.length; i++) {
        const labName = getAccurateMatch(lines[i], elisaLaboratory);
        const value = getFirstNumericValue(lines[i]);

        labName && value && ElisaData.push({ exam: labName, value });
      }

      req.body.hematology = hematologyData.length > 0 && hematologyData;
      req.body.biochemistry = biochemistryData.length > 0 && biochemistryData;
      req.body.hormon = HormonData.length > 0 && HormonData;
      req.body.hba1c = HBA1CData.length > 0 && HBA1CData;
      req.body.elisa = ElisaData.length > 0 && ElisaData;

      return {
        Hematology: JSON.stringify(hematologyData, null, 2),
        Biochemistry: JSON.stringify(biochemistryData, null, 2),
        Hormon: JSON.stringify(HormonData, null, 2),
        HBA1C: JSON.stringify(HBA1CData, null, 2),
        Elisa: JSON.stringify(ElisaData, null, 2),
      };
    })
    .then((filteredData) => {
      return Promise.all([
        fs.promises.writeFile("hematology.json", filteredData.Hematology),
        fs.promises.writeFile("biochemistry.json", filteredData.Biochemistry),
        fs.promises.writeFile("hormon.json", filteredData.Hormon),
        fs.promises.writeFile("hba1c.json", filteredData.HBA1C),
        fs.promises.writeFile("elisa.json", filteredData.Elisa),
      ]);
    })
    .then(async () => {
      console.log("Filtered lines saved to output file");

      await addSampleInLab(req, res);

      //return res.status(201).json({ msg: "Test was added." });
    })
    .catch((err) => console.error(err));

// Upload request
const uploadTest = (req: Request, res: Response) => {
  const { img_src } = req.body;

  if (!img_src) {
    return res.status(404).json({ msg: "File not found!" });
  }

  // Run python script for image processing
  const pythonScript = spawn("python", ["./src/python/main.py", img_src]);

  pythonScript.stdout.on("data", (data) => console.log(`stdout: ${data}`));
  pythonScript.stderr.on("data", (data) => console.log(`stderr: ${data}`));
  pythonScript.on("close", async (code) => {
    console.log(`child process exited with code ${code}`);
    //res.send(`File processed successfully. Exit code: ${code}`);

    await processFile("file.txt", req, res);
  });
  //return res;
  //res.status(201).json({ msg: "File processed successfully." });
};

export {
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
};
