const express = require("express");
const userRoutes = express.Router();
const User = require("../models/User");
const {getLogin, login, getRegister, register, logout } = require("../controllers/authController");

// render login page
userRoutes.get("/login", getLogin);

// main logic for user login
userRoutes.post("/login", login);

// render register page
userRoutes.get("/register", getRegister);

// main logic for user registration
userRoutes.post("/register", register); 

// logout route
userRoutes.get("/logout", logout);

module.exports = userRoutes;