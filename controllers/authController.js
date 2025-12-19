const User = require("../models/User");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const asyncHandler = require("express-async-handler");

// render login page
exports.getLogin = asyncHandler((req, res) => {
  res.render("login.ejs", {
    title: "Login",
    error: "",
    user: req.user,
  });
});

// render login page
exports.login = asyncHandler(async (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      console.error("Login error:", err);
      return next(err);
    }
    if (!user) {
      return res.render("login.ejs", {
        title: "Login",
        user: req.user,
        error: info.message,
      });
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.redirect("/");
    });
  })(req, res, next);
});

// get resigter page
exports.getRegister = asyncHandler((req, res) => {
  res.render("register.ejs", {
    title: "Register",
    user: req.user,
    error: "",
  });
});

// main logic for user registration
exports.register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  try {
    // check if user already exists
    const user = await User.findOne({ email });
    if (user) {
      return res.render("register.ejs", {
        title: "Register",
        user: req.user,
        error: "User already exists",
      });
    } else {
      // create new user
      // hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      // save user
      const newUser = await User.create({
        username,
        email,
        password: hashedPassword,
      });
      res.redirect("/auth/login");
    }
  } catch (error) {
    res.render("register.ejs", {
      title: "Register",
      user: req.user,
      error: error.message,
    });
  }
});

// logout user
exports.logout = asyncHandler((req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/auth/login");
  });
});
