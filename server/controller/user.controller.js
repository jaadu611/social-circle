import imagekit from "../configs/imagekit.js";
import { inngest } from "../inngest/index.js";
import Connection from "../models/connection.model.js";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";

export const getUserData = async (req, res) => {
  try {
    const { userId } = req.auth();
    const user = await User.findById(userId).select("-password -__v");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found", userId });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const updateUserData = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { username, bio, location, full_name } = req.body;

    const tempUser = await User.findById(userId);
    if (!tempUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (tempUser.username !== username) {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Username already exists",
        });
      }
    }

    let updateData = { username, bio, location, full_name };

    if (req.files?.profile_picture?.[0]) {
      const profile = req.files.profile_picture[0];
      const response = await imagekit.upload({
        file: profile.buffer,
        fileName: profile.originalname,
      });
      updateData.profile_picture = response.url;
    }

    if (req.files?.cover_photo?.[0]) {
      const cover = req.files.cover_photo[0];
      const response = await imagekit.upload({
        file: cover.buffer,
        fileName: cover.originalname,
      });
      updateData.cover_photo = response.url;
    }

    const user = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    });

    res.status(200).json({
      success: true,
      user,
      message: "User data updated successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const discoverUsers = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { input } = req.body;

    if (!input || input.trim() === "") {
      return res.status(200).json({ success: true, users: [] });
    }

    const matchingUsers = await User.find({
      _id: { $ne: userId },
      full_name: { $regex: `^${input}`, $options: "i" },
    });

    res.status(200).json({ success: true, users: matchingUsers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const followUser = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { id } = req.body;

    const user = await User.findById(userId);

    if (user.following.includes(id)) {
      user.following.pull(id);
      await user.save();

      const toUser = await User.findById(id);
      toUser.followers.pull(userId);
      await toUser.save();

      return res
        .status(200)
        .json({ success: true, message: "User unfollowed successfully" });
    }

    user.following.push(id);
    await user.save();

    const toUser = await User.findById(id);
    toUser.followers.push(userId);
    await toUser.save();

    return res
      .status(200)
      .json({ success: true, message: "User followed successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const unfollowUser = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { id } = req.body;

    const user = await User.findById(userId);

    if (!user.following.includes(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Not following this user" });
    }

    user.following.pull(id);
    await user.save();

    const toUser = await User.findById(id);
    toUser.followers.pull(userId);
    await toUser.save();

    res
      .status(200)
      .json({ success: true, message: "User unfollowed successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const sendConnectionRequest = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { id } = req.body;

    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const connectionRequests = await Connection.find({
      from_user_id: userId,
      createdAt: { $gte: last24Hours },
    });

    if (connectionRequests.length >= 20) {
      res.json({
        success: false,
        message: "You can only send 20 connection requests in 24 hours.",
      });
    }

    const existingConnection = await Connection.findOne({
      $or: [
        { from_user_id: userId, to_user_id: id },
        { from_user_id: id, to_user_id: userId },
      ],
    });

    if (!existingConnection) {
      const newConnection = await Connection.create({
        from_user_id: userId,
        to_user_id: id,
      });

      await inngest.send({
        name: "app/connection-request",
        data: { connectionId: newConnection._id },
      });

      res.status(200).json({
        success: true,
        message: "Connection request sent successfully",
      });
    } else if (existingConnection && existingConnection.status === "pending") {
      return res.status(200).json({
        success: true,
        message: "Connection request pending",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "You are already connected with this user",
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getConnections = async (req, res) => {
  try {
    const { userId } = req.auth();

    const user = await User.findById(userId)
      .populate("connections")
      .populate("followers")
      .populate("following");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found in database",
      });
    }

    const pendingConnections = await Connection.find({
      to_user_id: userId,
      status: "pending",
    }).populate("from_user_id");

    res.status(200).json({
      success: true,
      connections: user.connections,
      followers: user.followers,
      following: user.following,
      pendingConnections: pendingConnections.map((c) => c.from_user_id),
    });
  } catch (error) {
    console.error("Error fetching connections:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const acceptConnectionRequest = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { id } = req.body;

    const connection = await Connection.findOne({
      from_user_id: id,
      to_user_id: userId,
      status: "pending",
    });

    if (!connection) {
      return res
        .status(404)
        .json({ success: false, message: "Connection request not found" });
    }

    const user = await User.findById(userId);
    user.connections.push(id);
    await user.save();

    const toUser = await User.findById(id);
    toUser.connections.push(userId);
    await toUser.save();

    connection.status = "accepted";
    await connection.save();

    res.status(200).json({
      success: true,
      message: "Connection request accepted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const { profileId } = req.body;
    const profile = await User.findById(profileId).select("-password -__v");
    if (!profile) {
      return res
        .status(404)
        .json({ success: false, message: "Profile not found" });
    }

    const posts = await Post.find({ user: profileId })
      .populate("user")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, profile, posts });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
