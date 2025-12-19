const auth = require("../middlewares/auth");
const Comment = require("../models/Comment");
const Post = require("../models/Post");
const asyncHandler = require("express-async-handler");

exports.addComment = asyncHandler(async (req, res) => {
    const{content} = req.body;
    const postId = req.params.id;
    // find the post
    const post = await Post.findById(postId);
    if (!post) {
        return res.render("postDetails", {
            title:"Post",
            post,
            user: req.user,
            success: "",
            error: "Post not found",
        });
    }
    if (!content || content.trim() === "") {
        return res.render("postDetails", {
            title: "Post",
            post,
            user: req.user,
            success: "",
            error: "Comment content cannot be empty",
        });
    }
    // create new comment
    const newComment = new Comment({
        content,
        post: postId,
        author: req.user._id,
    });
    await newComment.save();

    // push comment
    post.comments.push(newComment._id);
    await post.save();
    console.log(post);

    //redirect to post details
    res.redirect(`/posts/${postId}`);
});