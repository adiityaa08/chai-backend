import {v2 as cloudinary} from "cloudinary";
import fs from "fs";


    // Configuration
    cloudinary.config({ 
        cloud_name:process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
    });

    const uploadonCloudinary= async (filepath)=>{
        try {
            if(!filepath)return null
            //upload the file cloudinary
            const response=await cloudinary.uploader.upload(filepath,{
                resource_type:"auto"
            })
            // file has been uploaded
            console.log("file has been uploaded",response.url);
            return response;
        } catch (error) {
            fs.unlinkSync(filepath)
            return null
        }

        //remove the locally saved temporaray file as file upload has been failed
    }

export {uploadonCloudinary}