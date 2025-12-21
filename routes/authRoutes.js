const express = require("express");
const authRoutes = express.Router();
const User = require("../models/User");
const {getLogin, login, getRegister, register, logout } = require("../controllers/authController");

// render login page
authRoutes.get("/login", getLogin);

// main logic for user login
authRoutes.post("/login", login);

// render register page
authRoutes.get("/register", getRegister);

// main logic for user registration
authRoutes.post("/register", register); 

// logout route
authRoutes.get("/logout", logout);

module.exports = authRoutes;