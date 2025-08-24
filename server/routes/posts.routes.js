import express from "express";
import upload from "../configs/multer.js";
import { protect } from "../middleware/auth.js";
import {
  addPost,
  getFeedPosts,
  likePost,
  getPostById,
  deletePost
} from "../controller/post.controller.js";

const postsRouter = express.Router();

postsRouter.post("/add", protect, upload.array("images", 4), addPost);
postsRouter.get("/feed", protect, getFeedPosts);
postsRouter.post("/like/:postId", protect, likePost);
postsRouter.get("/:postId", protect, getPostById);
postsRouter.delete("/:postId", protect, deletePost);

export default postsRouter;
