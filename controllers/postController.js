const Post = require("../models/Post");
const File = require("../models/File");
const Comment = require("../models/Comment");
const asyncHandler = require("express-async-handler");
const cloudinary = require("../config/cloudinary");

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
        url: file.url,
        public_id: file.public_id,
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
    .populate("author", "username")
    .populate({
      path: "comments",
      populate: { path: "author", model: "User", select: "username" },
    });
  res.render("postDetails", {
    title: post.title,
    post: post,
    user: req.user,
    success: "",
    error: "",
  });
});

// get edit post form
exports.getEditPostForm = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.render("postDetails.ejs", {
      title: "Posts",
      posts: [],
      user: req.user,
      error: "Post not found",
      success: "",
    });
  }
  res.render("editPost.ejs", {
    title: "Edit Post",
    post: post,
    user: req.user,
    error: "",
    success: "",
  });
});

// update post
exports.updatePost = asyncHandler(async (req, res) => {
  const { title, content } = req.body;
  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.render("postDetails.ejs", {
      title: "Posts",
      posts: [],
      user: req.user,
      error: "Post not found",
      success: "",
    });
  }

  if (post.author.toString() !== req.user._id.toString()) {
    return res.render("postDetails.ejs", {
      title: "Posts",
      posts: [],
      user: req.user,
      error: "You are not authorized to edit this post",
      success: "",
    });
  }
  post.title = title || post.title;
  post.content = content || post.content;
  if (req.files && req.files.length > 0) {
    // Delete existing images from Cloudinary
    await Promise.all(
      post.images.map(async (img) => {
        await cloudinary.uploader.destroy(img.public_id);
      })
    );
    // Upload new images
    post.images = await Promise.all(
      req.files.map(async (file) => {
        // save the image to database
        const newFile = new File({
          url: file.url,
          public_id: file.public_id,
          uploaded_by: req.user._id,
        });
        await newFile.save();
        return {
          url: newFile.url,
          public_id: newFile.public_id,
        };
      })
    );
  }
  // If no new files, keep existing images

  await post.save();
  res.redirect(`/posts/${post._id}`);
});

// delete post
exports.deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.render("postDetails.ejs", {
      title: "Posts",
      posts: [],
      user: req.user,
      error: "Post not found",
      success: "",
    });
  }
  if (post.author.toString() !== req.user._id.toString()) {
    return res.render("postDetails.ejs", {
      title: "Posts",
      posts: [],
      user: req.user,
      error: "You are not authorized to delete this post",
      success: "",
    });
  }
  await Promise.all(
    post.images.map(async (img) => {
      await cloudinary.uploader.destroy(img.public_id);
    })
  );
  await Post.findByIdAndDelete(req.params.id);
  res.redirect("/posts");
});
