import express from "express";
import upload from "../configs/multer.js";
import { protect } from "../middleware/auth.js";
import {
  addPost,
  getFeedPosts,
  likePost,
  getPostById,
  deletePost,
  sharePost,
} from "../controller/post.controller.js";

import {
  getComments,
  addComment,
  deleteComment,
  likeComment,
} from "../controller/comments.controller.js";

const postsRouter = express.Router();

postsRouter.post("/add", protect, upload.array("images", 4), addPost);
postsRouter.get("/feed", protect, getFeedPosts);
postsRouter.post("/like/:postId", protect, likePost);
postsRouter.post("/share/:postId", protect, sharePost);
postsRouter.get("/:postId", protect, getPostById);
postsRouter.delete("/:postId", protect, deletePost);

postsRouter.get("/:postId/comments", protect, getComments);
postsRouter.post("/:postId/comment", protect, addComment);
postsRouter.delete("/:postId/comment/:commentId", protect, deleteComment);
postsRouter.post("/:postId/comment/:commentId/like", protect, likeComment);

export default postsRouter;
