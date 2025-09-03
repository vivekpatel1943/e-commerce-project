import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import { ConfigOptions } from 'cloudinary';


// configuring the environment variables
dotenv.config();

const cloudinaryConfig: ConfigOptions = {
    cloud_name: process.env.cloudinary_cloud_name as string,
    api_key: process.env.cloudinary_api_key as string,
    api_secret: process.env.cloudinary_api_secret as string
}

cloudinary.config(cloudinaryConfig);

export default cloudinary;

