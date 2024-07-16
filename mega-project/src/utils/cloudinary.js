import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    //upload the file on cloudinary
    const uploadResult = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    //file successfully uploaded
    // console.log(uploadResult);
    console.log("file is upload on cloudinary", uploadResult.url);
    return uploadResult;
  } catch (error) {
    // unlink the file
    fs.unlinkSync(localFilePath); // remove the local temporary file as the upload operation failed
    return null;
  }
};


export {uploadOnCloudinary};