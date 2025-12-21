const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const File = require("../models/File");
const upload = require("../middlewares/upload");
const cloudinary = require("../config/cloudinary");
const Comment = require("../models/Comment");
const Post = require("../models/Post");

// get user profile
exports.getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  if (!user) {
    return res.render("login.ejs", {
      title: "Login",
      error: "User not found. Please log in again.",
      user: req.user,
    });
  }

  // fetch user's posts
  const Post = require("../models/Post");
  const posts = await Post.find({ author: user._id }).sort({ createdAt: -1 });
  res.render("profile.ejs", {
    title: "User Profile",
    user,
    posts,
    error: "",
    postCount: posts.length,
  });
});

// get edit profile form
exports.getEditProfileForm = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  if (!user) {
    return res.render("login.ejs", {
      title: "Login",
      error: "User not found. Please log in again.",
      user: req.user,
    });
  }
  res.render("editProfile.ejs", {
    title: "Edit Profile",
    user,
    error: "",
    success: "",
  });
});

// update profile
exports.updateProfile = asyncHandler(async (req, res) => {
  const { username, email, bio } = req.body;
  const user = await User.findById(req.user._id).select("-password");
  if (!user) {
    return res.render("login.ejs", {
      title: "Login",
      error: "User not found. Please log in again.",
      user: req.user,
    });
  }
  user.username = username || user.username;
  user.email = email || user.email;
  user.bio = bio || user.bio;
  if (req.file) {
    if (user.profilePicture && user.profilePicture.public_id) {
      await cloudinary.uploader.destroy(user.profilePicture.public_id);
    }
    const file = new File({
      url: req.file.path || req.file.url,
      public_id: req.file.filename || req.file.public_id,
      uploaded_by: req.user._id,
    });
    await file.save();
    user.profilePicture = {
      url: file.url,
      public_id: file.public_id,
    };
  }
  await user.save();

  res.render("editProfile.ejs", {
    title: "Edit Profile",
    user,
    error: "",
    success: "Profile updated successfully.",
  });
});

// delete user account
exports.deleteAccount = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    return res.render("login.ejs", {
      title: "Login",
      error: "User not found. Please log in again.",
      user: req.user,
    });
  }
  // Delete profile picture from Cloudinary
  if (user.profilePicture && user.profilePicture.public_id) {
    await cloudinary.uploader.destroy(user.profilePicture.public_id);
  }
  // Delete user's posts
  const posts = await Post.find({ author: req.user._id });
  for (const post of posts) {
    // Delete post images from Cloudinary
    for (const img of post.images) {
      await cloudinary.uploader.destroy(img.public_id);
    }
    await Comment.deleteMany({ post: post._id });
    await Post.findByIdAndDelete(post._id);
  }
  // Delete user's comments
  await Comment.deleteMany({ author: req.user._id });

  // delete file records uploaded by user
  const files = await File.find({ uploaded_by: req.user._id });
  for (const file of files) {
    await cloudinary.uploader.destroy(file.public_id);
  }

  // delete user
  await User.findByIdAndDelete(req.user._id);
  res.redirect("/auth/register");
});
