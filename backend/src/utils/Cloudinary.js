import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const  uploadToCloudinary = async (localFilePath) => {
    console.log(localFilePath,"-----------------------------");
    
    try {
        if (!localFilePath) {
            throw new Error("Local file path is required for uploading to Cloudinary");
            return null;
        }
        const result = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto", // Automatically detect the file type (image, video, etc.)
        });
        // console.log("File uploaded on cloudinary = ", result);
        if (localFilePath) fs.unlinkSync(localFilePath); // Delete the local file after uploading to Cloudinary
        return result;
    } catch (error) {
        if (localFilePath) {
            try {
                fs.unlinkSync(localFilePath);
            } catch (cleanupError) {
                console.error("Error deleting local file after failed Cloudinary upload:", cleanupError);
            }
        }
        console.error("Error uploading file to Cloudinary:", error);
        return null;
    }
}


export {uploadToCloudinary};