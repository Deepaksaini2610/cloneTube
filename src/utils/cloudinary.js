import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


const storage = new cloudinary({
    cloudinary:cloudinary,
    params:{
        folder:"uploads",
        allowed_formats:['jpg','png','jpeg']
    }
})

module.exports = {
    storage,
    cloudinary
}