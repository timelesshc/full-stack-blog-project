const Post = require("../models/Post");

// rendering post form
exports.getPostForm = (req, res) => {
  res.render("newPost.ejs", {
    title: "Create Post",
    user: req.user,
    error: "",
  });
}

exports.createPost = async (req, res) => {
  const { title, content } = req.body;
  const newPost = await Post.create({
    title,
    content,
    author: req.user._id,
  });
  console.log(newPost);
  
  res.redirect("/posts");
};