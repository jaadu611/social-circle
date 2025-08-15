import express from "express";
import upload from "../configs/multer.js";
import { protect } from "../middleware/auth.js";
import {
  getChatMessages,
  sendMessage,
} from "../controller/message.controller.js";

const messageRouter = express.Router();

messageRouter.post("/get", protect, getChatMessages);
messageRouter.post("/send", protect, upload.single("image"), sendMessage);

export default messageRouter;
