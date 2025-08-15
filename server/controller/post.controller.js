import imagekit from "../configs/imagekit.js";
import User from "../models/user.model.js";
import Post from "../models/post.model.js";

export const addPost = async (req, res) => {
  try {
    const authObj =
      typeof req.auth === "function" ? req.auth() : req.auth || {};
    const userId = authObj.userId || authObj.user?.id || req.user?._id;

    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthenticated" });
    }

    const content = req.body.content;
    const post_type = req.body.post_type;
    const images = req.files || [];

    let image_urls = [];

    if (images.length) {
      image_urls = await Promise.all(
        images.map(async (image) => {
          const response = await imagekit.upload({
            file: image.buffer,
            fileName: image.originalname,
            folder: "Posts",
          });

          const filePath = response.filePath || response.path;
          const url = filePath
            ? imagekit.url({
                path: filePath,
                transformation: [
                  { quality: "100" },
                  { format: "webp" },
                  { width: "1280" },
                ],
              })
            : response.url;

          return url;
        })
      );
    }

    const post = await Post.create({
      user: userId,
      content,
      post_type,
      image_urls,
    });

    return res.status(201).json({ success: true, post });
  } catch (err) {
    console.error("Error in addPost:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const getFeedPosts = async (req, res) => {
  try {
    const { userId } = req.auth();
    const user = await User.findById(userId);
    const userIds = [user._id, ...user.connections, ...user.following];
    const posts = await Post.find({ user: { $in: userIds } })
      .populate("user")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      posts,
      message: "Feed posts retrieved successfully",
    });
  } catch (error) {
    console.error("Error getting feed posts:", error);
    res.status(500).json({
      success: false,
      message: "Error getting feed posts",
    });
  }
};

export const likePost = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { postId } = req.params;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    if (post.likes_count.includes(userId)) {
      post.likes_count.pull(userId);
      await post.save();
      return res.status(200).json({
        success: true,
        message: "Post unliked successfully",
      });
    } else {
      post.likes_count.push(userId);
      await post.save();

      res.status(200).json({
        success: true,
        message: "Post liked successfully",
      });
    }
  } catch (error) {
    console.error("Error liking post:", error);
    res.status(500).json({
      success: false,
      message: "Error liking post",
    });
  }
};
