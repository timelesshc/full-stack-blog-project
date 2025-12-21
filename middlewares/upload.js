const multer = require("multer");
const CloudinaryStorage = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "full-stack-blog",
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});

const upload = multer({ storage });
module.exports = upload;
