import Post from "../models/post.model.js";

export const getComments = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId).populate(
      "comments.user",
      "full_name username profile_picture"
    );

    if (!post)
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });

    res.json({ success: true, comments: post.comments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const likeComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const userId = req.user.id;

    // Find the post with the comment
    const post = await Post.findById(postId);
    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    // Find the specific comment
    const comment = post.comments.id(commentId);
    if (!comment) {
      return res
        .status(404)
        .json({ success: false, message: "Comment not found" });
    }

    // Toggle like
    const alreadyLiked = comment.likes.some(
      (id) => id.toString() === userId.toString()
    );

    if (alreadyLiked) {
      comment.likes = comment.likes.filter(
        (id) => id.toString() !== userId.toString()
      );
    } else {
      comment.likes.push(userId);
    }

    // Save the post (which includes the updated comment)
    await post.save();

    res.status(200).json({
      success: true,
      likes: comment.likes,
    });
  } catch (err) {
    console.error("Error liking comment:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    if (!content)
      return res
        .status(400)
        .json({ success: false, message: "Comment cannot be empty" });

    const post = await Post.findById(postId);
    if (!post)
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });

    const comment = { user: userId, content };
    post.comments.unshift(comment);
    await post.save();

    const populatedPost = await Post.findById(postId).populate(
      "comments.user",
      "full_name username profile_picture"
    );
    const newComment = populatedPost.comments[0];

    res.json({ success: true, comment: newComment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const userId = req.user.id;

    const post = await Post.findById(postId);
    if (!post)
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });

    const comment = post.comments.id(commentId);
    if (!comment)
      return res
        .status(404)
        .json({ success: false, message: "Comment not found" });

    if (comment.user.toString() !== userId.toString())
      return res.status(403).json({ success: false, message: "Unauthorized" });

    comment.deleteOne();
    await post.save();

    res.json({ success: true, message: "Comment deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
