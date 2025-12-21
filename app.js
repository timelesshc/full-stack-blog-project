require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const passportConfig = require("./config/passport");
const passport = require("passport");
const session = require("express-session");
const User = require("./models/User");
const MongoStore = require("connect-mongo").default;
const { log } = require("node:console");
const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");
const errorHandler = require("./middlewares/errorHandler");
const commentRoutes = require("./routes/commentRoutes");
const methodOverride = require("method-override");
const userRoutes = require("./routes/userRoutes");

// port
const PORT = process.env.PORT || 3000;

// middleware
app.use(express.urlencoded({ extended: true }));

// session middleware
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
  })
);

// method override middleware
app.use(methodOverride("_method"));

// initialize passport
passportConfig(passport);
app.use(passport.initialize());
app.use(passport.session());

// Ejs
app.set("view engine", "ejs");

// render home page
app.get("/", (req, res) => {
  res.render("home.ejs", {
    user: req.user,
    title: "Home",
    error: "",
  });
});

// routes
app.use("/auth", authRoutes);
app.use("/posts", postRoutes);
app.use("/", commentRoutes);
app.use("/users", userRoutes);

// error handling middleware
app.use(errorHandler);

// start server
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database connection error:", error);
  });
