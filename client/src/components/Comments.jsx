// src/components/Comments.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "react-hot-toast";
import moment from "moment";
import api from "../api/axios.js";
import { Link } from "react-router-dom";
import { Heart, Trash2 } from "lucide-react"; // icons

const Comments = ({ postId }) => {
  const { getToken, userId } = useAuth(); // <-- now we have userId
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const token = await getToken();
        const { data } = await api.get(`/api/post/${postId}/comments`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setComments(data.comments || []);
      } catch (err) {
        console.error("Failed to load comments:", err);
      }
    };
    if (postId) fetchComments();
  }, [postId, getToken]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setLoading(true);
    try {
      const token = await getToken();
      const { data } = await api.post(
        `/api/post/${postId}/comment`,
        { content: newComment },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (data.success) {
        setComments((prev) => [data.comment, ...prev]);
        setNewComment("");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add comment");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const token = await getToken();
      await api.delete(`/api/post/${postId}/comment/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setComments((prev) => prev.filter((c) => c._id !== commentId));
      toast.success("Comment deleted");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete comment");
    }
  };

  const handleLikeComment = async (commentId) => {
    try {
      const token = await getToken();
      const { data } = await api.post(
        `/api/post/${postId}/comment/${commentId}/like`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setComments((prev) =>
        prev.map((c) => (c._id === commentId ? { ...c, likes: data.likes } : c))
      );
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to like comment");
    }
  };

  return (
    <div className="mt-5">
      {/* New Comment Input */}
      <form
        onSubmit={handleAddComment}
        className="flex items-center gap-3 mb-5 bg-gray-50 p-3 rounded-xl shadow-sm"
      >
        <input
          type="text"
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="flex-1 bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-500 cursor-pointer text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-600 transition disabled:opacity-50"
        >
          {loading ? "Posting..." : "Post"}
        </button>
      </form>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div
              key={comment._id}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition"
            >
              {/* Avatar */}
              <Link to={`/profile/${comment.user?._id}`} className="shrink-0">
                <img
                  src={comment.user?.profile_picture}
                  alt={comment.user?.full_name}
                  loading="lazy"
                  className="w-10 h-10 rounded-full object-cover border border-gray-200"
                />
              </Link>

              {/* Comment Content */}
              <div className="flex flex-col flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Link
                      to={`/profile/${comment.user?._id}`}
                      className="text-sm font-semibold text-gray-800 hover:text-indigo-600 transition"
                    >
                      {comment.user?.full_name}
                    </Link>
                    <span className="text-xs text-gray-400">
                      • {moment(comment.createdAt).fromNow()}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleLikeComment(comment._id)}
                      className="flex items-center gap-1 text-gray-500 hover:text-red-500 transition text-sm"
                    >
                      <Heart
                        size={16}
                        className={
                          comment.likes?.includes(userId)
                            ? "fill-red-500 text-red-500"
                            : ""
                        }
                      />
                      <span>{comment.likes?.length || 0}</span>
                    </button>

                    {comment.user?._id === userId && (
                      <button
                        onClick={() => handleDeleteComment(comment._id)}
                        className="text-gray-400 hover:text-red-500 transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>

                <p className="text-sm text-gray-700 leading-snug mt-1">
                  {comment.content}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-400 text-center py-4">
            No comments yet. Be the first! 🚀
          </p>
        )}
      </div>
    </div>
  );
};

export default Comments;
