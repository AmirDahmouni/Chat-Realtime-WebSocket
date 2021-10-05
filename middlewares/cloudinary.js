const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const multer = require('multer')
const config = require("config")

cloudinary.config({
    cloud_name: config.get("Cloud name"),
    api_key: config.get("API Key"),
    api_secret: config.get("API Secret")
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: (req, file) => new Date().toISOString() + '-' + file.originalname,
    }
});
exports.parser = multer({ storage: storage });
exports.uploader = cloudinary.uploader;