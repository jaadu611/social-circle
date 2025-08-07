import express from "express";
import {
  acceptConnectionRequest,
  discoverUsers,
  followUser,
  getConnections,
  getUserData,
  sendConnectionRequest,
  unfollowUser,
  updateUserData,
} from "../controller/user.controller.js";
import { protect } from "../middleware/auth.js";
import upload from "../configs/multer.js";

const userRouter = express.Router();

userRouter.get("/", protect, (req, res) => {
  res.json({
    success: true,
    message: "You are authorized!",
    userId: req.userId,
  });
});
userRouter.get("/data", protect, getUserData);
userRouter.post(
  "/update",
  upload.fields([
    { name: "profile", maxCount: 1 },
    { name: "cover", maxCount: 1 },
  ]),
  protect,
  updateUserData
);
userRouter.post("/discover", protect, discoverUsers);
userRouter.post("/follow", protect, followUser);
userRouter.post("/unfollow", protect, unfollowUser);
userRouter.post("/connection", protect, sendConnectionRequest);
userRouter.post("/accept", protect, acceptConnectionRequest);
userRouter.post("/connections", protect, getConnections);

export default userRouter;
