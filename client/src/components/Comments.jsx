import React, { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "react-hot-toast";
import moment from "moment";
import api from "../api/axios.js";
import { Link } from "react-router-dom";
import Loading from "./Loading.jsx";
import AnimatedTrash from "./AnimatedTrash.jsx";
import AnimatedHeart from "./AnimatedHeart.jsx";

const Comments = ({ postId }) => {
  const { getToken, userId } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [fetching, setFetching] = useState(true);
  const [posting, setPosting] = useState(false);
  const [hoveredTrash, setHoveredTrash] = useState({});

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setFetching(true);
        const token = await getToken();
        const { data } = await api.get(`/api/post/${postId}/comments`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setComments(data.comments || []);
      } catch (err) {
        console.error("Failed to load comments:", err);
        toast.error("Failed to load comments");
      } finally {
        setFetching(false);
      }
    };
    if (postId) fetchComments();
  }, [postId, getToken]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setPosting(true);
    try {
      const token = await getToken();
      const { data } = await api.post(
        `/api/post/${postId}/comment`,
        { content: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        setComments((prev) => [data.comment, ...prev]);
        setNewComment("");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add comment");
    } finally {
      setPosting(false);
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
    // Optimistic update
    setComments((prev) =>
      prev.map((c) => {
        if (c._id === commentId) {
          const isLiked = c.likes?.includes(userId);
          const updatedLikes = isLiked
            ? c.likes.filter((id) => id !== userId)
            : [...(c.likes || []), userId];
          return { ...c, likes: updatedLikes };
        }
        return c;
      })
    );

    try {
      const token = await getToken();
      const { data } = await api.post(
        `/api/post/${postId}/comment/${commentId}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setComments((prev) =>
        prev.map((c) => (c._id === commentId ? { ...c, likes: data.likes } : c))
      );
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to like comment");
      setComments((prev) =>
        prev.map((c) => {
          if (c._id === commentId) {
            const isLiked = c.likes?.includes(userId);
            const revertedLikes = isLiked
              ? c.likes.filter((id) => id !== userId)
              : [...(c.likes || []), userId];
            return { ...c, likes: revertedLikes };
          }
          return c;
        })
      );
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Comment Input */}
      <form
        onSubmit={handleAddComment}
        className="flex items-center gap-2 bg-white border border-gray-300 p-2 sm:p-3 sticky rounded-br-2xl rounded-bl-2xl top-0 z-10"
      >
        <input
          type="text"
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="flex-1 min-w-0 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          disabled={posting}
        />
        <button
          type="submit"
          disabled={posting}
          className="bg-indigo-500 text-white cursor-pointer px-3 py-2 rounded-lg text-sm font-medium hover:bg-indigo-600 transition disabled:opacity-50 min-w-[60px]"
        >
          {posting ? "Posting..." : "Post"}
        </button>
      </form>

      {/* Comments List */}
      <div
        className="space-y-4 overflow-y-auto h-full"
        style={{
          transform: "translateZ(0)",
          willChange: "transform, scroll",
        }}
      >
        {fetching ? (
          <div className="flex justify-center py-10">
            <Loading />
          </div>
        ) : comments.length > 0 ? (
          comments.map((comment) => {
            const isLiked = comment.likes?.includes(userId);

            return (
              <div
                key={comment._id}
                className="flex gap-3 p-4 rounded-2xl bg-white border border-gray-300"
              >
                {/* Avatar */}
                <Link to={`/profile/${comment.user?._id}`} className="shrink-0">
                  <img
                    loading="lazy"
                    src={comment.user?.profile_picture}
                    alt={comment.user?.full_name || "User"}
                    className="w-10 h-10 sm:w-11 sm:h-11 rounded-full shadow-md transition-all duration-300 hover:ring-2 hover:ring-offset-2 hover:ring-indigo-500 object-cover cursor-pointer"
                  />
                </Link>

                {/* Comment Content */}
                <div className="flex flex-col flex-1">
                  <div className="flex items-center justify-between">
                    {/* Name + Time */}
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/profile/${comment.user?._id}`}
                        className="relative w-fit text-gray-700 font-semibold text-sm sm:text-base transition-colors duration-200 hover:text-indigo-600 cursor-pointer"
                      >
                        {comment.user?.full_name}
                        <span className="absolute left-0 bottom-0 w-full h-[1.5px] bg-indigo-500 scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"></span>
                      </Link>
                      <span className="text-xs text-gray-400">
                        • {moment(comment.createdAt).fromNow()}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1">
                      {/* Like Button */}
                      <div className="flex items-center gap-1">
                        <AnimatedHeart
                          liked={isLiked}
                          onClick={() => handleLikeComment(comment._id)}
                          size={16}
                        />
                        {/* Fixed width for like count */}
                        <span className="text-sm text-gray-600 w-2 text-center inline-block">
                          {comment.likes?.length || 0}
                        </span>
                      </div>

                      {/* Delete Button */}
                      {comment.user?._id === userId && (
                        <button
                          onClick={() => handleDeleteComment(comment._id)}
                          onMouseEnter={() =>
                            setHoveredTrash((prev) => ({
                              ...prev,
                              [comment._id]: true,
                            }))
                          }
                          onMouseLeave={() =>
                            setHoveredTrash((prev) => ({
                              ...prev,
                              [comment._id]: false,
                            }))
                          }
                          className="p-1 hover:bg-red-100 rounded-full transition cursor-pointer"
                          title="Delete comment"
                        >
                          <AnimatedTrash
                            className="w-6 h-6"
                            hover={hoveredTrash[comment._id] || false}
                          />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Comment Text */}
                  <p className="text-sm text-gray-700 leading-snug mt-1">
                    {comment.content}
                  </p>
                </div>
              </div>
            );
          })
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
