const express = require("express");
const commentRoutes = express.Router();
const { addComment, deleteComment, getEditCommentForm, updateComment } = require("../controllers/commentController");
const { ensureAuthenticated } = require("../middlewares/auth");

// add comment
commentRoutes.post("/posts/:id/comments", ensureAuthenticated, addComment);

// get comment form
commentRoutes.get("/comments/:id/edit", getEditCommentForm);

// update comment
commentRoutes.put("/comments/:id", ensureAuthenticated, updateComment);

// delete comment
commentRoutes.delete("/comments/:id", ensureAuthenticated, deleteComment);

module.exports = commentRoutes;