import { v2 as cloudinary } from "cloudinary";
import { Request } from "express";
import multer from "multer";

type DestinationCallback = (error: Error | null, destination: string) => void;
type FileNameCallback = (error: Error | null, filename: string) => void;

// Configs to upload user lab test results to Cloudinary
/* cloudinary.config({
  cloud_name: "df9xmfkp1",
  api_key: "649263616249734",
  api_secret: "ZrutNKYKhcj_ULOZmwFZkR0rcts",
}); */

// Set up multer to parse the file upload request
const storage = multer.diskStorage({
  destination: (
    request: Request,
    file: Express.Multer.File,
    cb: DestinationCallback
  ): void => {
    cb(null, "./src/python/data");
  },
  filename: (
    req: Request,
    file: Express.Multer.File,
    cb: FileNameCallback
  ): void => {
    console.log(file);

    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

export default upload;
