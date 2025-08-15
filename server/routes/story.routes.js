import express from "express";
import { addUserStory, getStories } from "../controller/story.controller.js";
import upload from "../configs/multer.js";
import { protect } from "../middleware/auth.js";

const storyRouter = express.Router();

storyRouter.post("/create", upload.single("media"), protect, addUserStory);
storyRouter.get("/get", protect, getStories);

export default storyRouter;
