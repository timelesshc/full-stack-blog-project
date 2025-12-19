const Post = require("../models/Post");
const File = require("../models/File");
const asyncHandler = require("express-async-handler");

// rendering post form
exports.getPostForm = asyncHandler((req, res) => {
  res.render("newPost.ejs", {
    title: "Create Post",
    user: req.user,
    error: "",
    success: "",
  });
});

exports.createPost = asyncHandler(async (req, res) => {
  const { title, content } = req.body;
  // validation
  if (!req.files || req.files.length === 0) {
    return res.render("newPost.ejs", {
      title: "Create Post",
      user: req.user,
      error: "At least one image is required",
    });
  }

  const images = await Promise.all(
    req.files.map(async (file) => {
      // save the image to database
      const newFile = new File({
        url: file.path,
        public_id: file.filename,
        uploaded_by: req.user._id,
      });
      await newFile.save();
      return {
        url: newFile.url,
        public_id: newFile.public_id,
      };
    })
  );

  // create new post
  const newPost = new Post({
    title,
    content,
    author: req.user._id,
    images: images,
  });
  await newPost.save();
  res.render("newPost.ejs", {
    title: "Create Post",
    user: req.user,
    success: "Post created successfully!",
    error: "",
  });
});

// get all posts
exports.getPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find().populate("author", "username");
  res.render("posts.ejs", {
    title: "Posts",
    posts: posts,
    user: req.user,
    success: "",
    error: "",
  });
});

// get post by id
exports.getPostById = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id)
    .populate("author", "username");
  res.render("postDetails", {
    title: post.title,
    post: post,
    user: req.user,
    success: "",
    error: "",
  });
});
