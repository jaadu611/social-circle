import imagekit from "../configs/imagekit.js";
import User from "../models/user.model.js";
import fs from "fs";

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
    let { username, bio, location, full_name } = req.body;
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

    const updatedUser = await User.findByIdAndUpdate(userId, {
      username,
      bio,
      location,
      full_name,
    });

    const profile = req.files?.profile?.[0];
    const cover = req.files?.cover?.[0];

    if (profile) {
      const buffer = fs.readFileSync(profile.path);
      const response = await imagekit.upload({
        file: buffer,
        fileName: profile.originalname,
      });

      const url = imagekit.url({
        path: response.path,
        transformation: [
          { quality: "auto" },
          { format: "webp" },
          { width: "512" },
        ],
      });

      updateUserData.profile_picture = url;
    }

    if (cover) {
      const buffer = fs.readFileSync(cover.path);
      const response = await imagekit.upload({
        file: buffer,
        fileName: cover.originalname,
      });

      const url = imagekit.url({
        path: response.path,
        transformation: [
          { quality: "auto" },
          { format: "webp" },
          { width: "1280" },
        ],
      });

      updateUserData.cover_photo = url;
    }

    const user = await User.findByIdAndUpdate(userId, updatedUser, {
      new: true,
    });

    res
      .status(200)
      .json({ success: true, user, message: "User data updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const discoverUsers = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { input } = req.body;

    const allUsers = await User.find({
      $or: [
        { username: new RegExp(input, "i") },
        { email: new RegExp(input, "i") },
        { full_name: new RegExp(input, "i") },
        { location: new RegExp(input, "i") },
      ],
    });

    const filteredUsers = allUsers.filter(
      (user) => user._id.toString() !== userId
    );
    res.status(200).json({ success: true, users: filteredUsers });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const followUser = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { id } = req.body;

    const user = await User.findById(userId);

    if (user.following.includes(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Already following this user" });
    }

    user.following.push(id);
    await user.save();

    const toUser = await User.findById(id);
    toUser.followers.push(userId);
    await toUser.save();

    res
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
      await Connection.create({
        from_user_id: userId,
        to_user_id: id,
      });

      res.status(200).json({
        success: true,
        message: "Connection request sent successfully",
      });
    } else if (existingConnection && existingConnection.status === "pending") {
      res.status(400).json({
        success: false,
        message: "Connection request already sent",
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
    const user = await User.findById(userId).populate(
      "connections followers following"
    );

    const connections = user.connections;
    const followers = user.followers;
    const following = user.following;

    const pendingConnections = (
      await connections
        .find({
          to_user_id: userId,
          status: "pending",
        })
        .populate("from_user_id")
    ).map((connection) => connection.from_user_id);

    res.status(200).json({
      success: true,
      connections,
      followers,
      following,
      pendingConnections,
    });
  } catch (error) {
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
