import express from "express";
import {
  acceptConnectionRequest,
  discoverUsers,
  followUser,
  getConnections,
  getUserData,
  getUserProfile,
  sendConnectionRequest,
  unfollowUser,
  updateUserData,
} from "../controller/user.controller.js";
import { protect } from "../middleware/auth.js";
import upload from "../configs/multer.js";

const userRouter = express.Router();

userRouter.get("/data", protect, getUserData);
userRouter.post(
  "/update",
  upload.fields([
    { name: "profile_picture", maxCount: 1 },
    { name: "cover_photo", maxCount: 1 },
  ]),
  protect,
  updateUserData
);
userRouter.post("/discover", protect, discoverUsers);
userRouter.post("/follow", protect, followUser);
userRouter.post("/unfollow", protect, unfollowUser);
userRouter.post("/connection", protect, sendConnectionRequest);
userRouter.post("/accept", protect, acceptConnectionRequest);
userRouter.get("/connections", protect, getConnections);
userRouter.post("/profiles", protect, getUserProfile);

export default userRouter;
