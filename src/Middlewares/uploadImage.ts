import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../utils/cloudinary';

const storage = new CloudinaryStorage({
    cloudinary,
    params : async (req,file) => {
        return {
            folder : "productImages", //all images will go in "productImages" folder
            allowed_formats : ["jpg",'png','jpeg','webp']
        }
    }
})

const upload = multer({storage});

export default upload;