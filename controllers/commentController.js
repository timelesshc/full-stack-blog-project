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

    //redirect to post details
    res.redirect(`/posts/${postId}`);
});

// get comment form
exports.getEditCommentForm = asyncHandler(async (req, res) => {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
        return res.render("postDetails", {
            title: "Post",
            comment,
            user: req.user,
            error: "You are not authorized to edit this comment",
        });
    }
    res.render("editComment.ejs", {
        title: "Edit Comment",
        comment,
        user: req.user,
        error: "",
        success: "",
    });
});

// update comment
exports.updateComment = asyncHandler(async (req, res) => {
    const { content } = req.body;
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
        return res.render("postDetails", {
            title: "Post",
            comment,
            user: req.user,
            error: "Comment not found",
            success: "",
        });
    }
    if (comment.author.toString() !== req.user._id.toString()) {
        return res.render("postDetails", {
            title: "Post",
            comment,
            user: req.user,
            success: "",
            error: "Unauthorized action",
        });
    }
    comment.content = content || comment.content;
    await comment.save();
    res.redirect(`/posts/${comment.post}`);
});

// delete comment
exports.deleteComment = asyncHandler(async (req, res) => {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
        return res.render("postDetails", {
            title: "Post",
            comment,
            user: req.user,
            error: "Comment not found",
        });
    }   
    if (comment.author.toString() !== req.user._id.toString()) {
        return res.render("postDetails", {
            title: "Post",
            comment,
            user: req.user,
            success: "",
            error: "Unauthorized action",
        });
    }
    await Comment.findByIdAndDelete(req.params.id);
    res.redirect(`/posts/${comment.post}`);
});