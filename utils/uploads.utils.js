import { __dirname } from "../utils/path.utils.js";
import fs from "fs/promises";

export const cleanUpUploadsFolder = async () => {
  const uploadFiles = await fs.readdir('uploads/');
  const deletePromises = [];
  
  uploadFiles.forEach(file => {
    const filePath = `uploads/${file}`;
    deletePromises.push(fs.rm(filePath));
  })

  await Promise.all(deletePromises);
};