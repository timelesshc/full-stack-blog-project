const express = require("express");
const postRoutes = express.Router();
const { getPostForm, createPost } = require("../controllers/postController");
const upload = require("../middlewares/upload");

// get post form
postRoutes.get("/add", getPostForm);

// post logic
postRoutes.post("/add", upload.single("image"), createPost);

module.exports = postRoutes;