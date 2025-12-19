const express = require("express");
const commentRoutes = express.Router();
const { addComment, deleteComment } = require("../controllers/commentController");
const { ensureAuthenticated } = require("../middlewares/auth");

// add comment
commentRoutes.post("/posts/:id/comments", ensureAuthenticated, addComment);

module.exports = commentRoutes;