import User from "../models/user.model.js";
import Story from "../models/story.model.js";
import { inngest } from "../inngest/index.js";
import imagekit from "../configs/imagekit.js";

export const addUserStory = async (req, res) => {
  try {
    const authObj =
      typeof req.auth === "function" ? await req.auth() : req.auth || {};
    const userId = authObj.userId || authObj.user?.id || req.user?._id;

    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthenticated" });
    }

    const { content, media_type, background_color } = req.body;
    const media = req.file;
    let media_url = "";

    if ((media_type === "image" || media_type === "video") && media) {
      if (!media.buffer) {
        throw new Error(
          "File buffer missing. Ensure upload middleware is configured for memory storage."
        );
      }

      const response = await imagekit.upload({
        file: media.buffer,
        fileName: media.originalname,
      });

      media_url = response.url;
    }

    const story = await Story.create({
      user: userId,
      content,
      media_url,
      media_type,
      background_color,
    });

    await inngest.send({
      name: "app/story.delete",
      data: { storyId: story._id },
    });

    return res.status(201).json({
      success: true,
      message: "Story added successfully",
      story,
    });
  } catch (error) {
    console.error("Error in addUserStory:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const getStories = async (req, res) => {
  try {
    const { userId } = req.auth();
    const user = await User.findById(userId).select("-password -__v");

    const userIds = [
      userId,
      ...(user.following || []),
      ...(user.connections || []),
    ];

    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const stories = await Story.find({
      user: { $in: userIds },
      createdAt: { $gte: twentyFourHoursAgo },
    })
      .populate("user")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      stories,
    });
  } catch (error) {
    console.error("Error fetching stories:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
