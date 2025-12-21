const express = require("express");
const userRoutes = express.Router();
const User = require("../models/User");
const { ensureAuthenticated } = require("../middlewares/auth");
const { getUserProfile, getEditProfileForm, updateProfile, deleteAccount} = require("../controllers/userController");
const upload = require("../middlewares/upload");

// render login page
userRoutes.get("/profile", ensureAuthenticated, getUserProfile);

// render edit profile form
userRoutes.get("/edit", ensureAuthenticated, getEditProfileForm);
userRoutes.post("/profile", ensureAuthenticated, upload.single("profilePicture"), updateProfile);
userRoutes.post("/delete", ensureAuthenticated, deleteAccount);
module.exports = userRoutes;
