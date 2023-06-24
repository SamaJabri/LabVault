# LabVault

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)]()

This is the backend and frontend components of LabVault, a Laboratory Test Documents Archive. The backend handles data processing, analysis, and storage and the frontend handles what's seen by the user and the state management.

## Technologies Used

This project was developed using the PERN stack (PostgreSQL, Express, ReactJs, Node.js)

- Frontend: [ReactJs](https://react.dev/)
- State-management: [Zustand](https://zustand-demo.pmnd.rs/)
- Backend and API handling: [Node.js](https://nodejs.org/en), [Express](https://expressjs.com/), & [TypeScript](https://www.typescriptlang.org/)
- Image processing: [Python](https://www.python.org/) & [Pytesseract](https://pypi.org/project/pytesseract/)
- Database: [PostgreSQL](https://www.postgresql.org/)

## Table of Contents

- [Introduction](#introduction)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Documentation](#documentation)
- [Notes](#notes)
- [Contact](#contact)

## Introduction

In today's digital age, individuals often face challenges in managing their lab test results, which are
typically scattered across various documents and hard copies. LabVault web application addresses this
issue by offering a convenient solution for users to consolidate and access their lab test results in one
place.
Furthermore, the application goes beyond simple result storage. It leverages image processing techniques
to extract relevant data from user-provided images, enabling seamless integration of test results into the
system. This feature eliminates the need for manual data entry and streamlines the result management
process.

## Installation

Clone the repository: `git clone https://github.com/SamaJabri/LabVault`

### Backend

1. Navigate inside backend folder: `cd server/`
2. Install backend dependencies: `npm install`
3. Set up environment variables: Copy the `.env.example` file and rename it to `.env`. Fill in the required values. More in [configuration](#configuration).
4. Setup Python packages: `pip install -r python-reqs.txt`
5. Download Tesseract OCR:

- Visit the Tesseract OCR website (https://github.com/tesseract-ocr/tesseract) or the official repository.
- Follow the instructions specific to your operating system to download the Tesseract OCR software.
- Make sure to note the installation path of Tesseract OCR on your system.

6. Set the Path to Tesseract OCR in your application:

- Navigate to `src/python/image_processing.py` which contains: `path_to_tesseract = r"C:/Program Files/Tesseract-OCR/tesseract.exe"`.
- Modify the path according to the installation path of Tesseract OCR on your system.
- Update the line to reflect the correct path.

These installation steps will ensure that both the Node.js backend and Python image processing components are properly set up with the necessary dependencies and configurations.

### Database

Before proceeding with this, make sure you set the `POSTGRES_URL` in the `.env` file. Check [configuration](#configuration).

1. Go to `server/src/controllers/samples.ts` file.
2. Uncomment the `setupDb()` function call on line 150 to setup the db.

### Frontend

1. Navigate inside frontend folder: `cd client/`
2. Install frontend dependencies: `npm install`

## Configuration

- The `.env.example` file serves as a template for the `.env` file that needs to be created. It provides an example of the required environment variables and their expected values. Before running the application, make a copy of this file and rename it to `.env`. Then, replace the placeholders with actual values.
- The `POSTGRES_URL` environment variable is used to specify the connection URL for the PostgreSQL database.
- The `PORT` environment variable is used to specify the port on which the LabVault application will run. The default value is `3000`, but you can change it if necessary.

You can find more info in the `.env.example` file.

## Usage

1. Navigate to the server side: `cd server/`
2. Start the backend server: `npm run dev`
3. The backend API will be accessible at `http://localhost:3000` or your customized port number.
4. Open another terminal and Navigate to the client side: `cd client/`
5. Start the [Vite](https://vitejs.dev/) development server: `npm run dev`
6. The project will now be hosted on `http://localhost:5173/`
7. As test user credentials, you can use "Sama" as both the username and the password.

Make sure you connected a reliable database connection so the application won't show server errors.

## Documentation

- Full project documentation, including framework usage in detail and UML diagrams, is available [here](https://drive.google.com/file/d/1IFdpmK_x_vtRFhVSTRConuQfe3kXrnou/view?usp=drive_link).

## Notes

- For this version the application works on pdfs only.
- The application supports pdfs that contain latin letters only.

## Contact

- For any inquiries or support, please email at sama.jabri@outlook.com.
