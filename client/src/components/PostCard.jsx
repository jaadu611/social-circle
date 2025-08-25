import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import moment from "moment";
import DOMPurify from "dompurify";
import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@clerk/clerk-react";
import api from "../api/axios.js";
import { toast } from "react-hot-toast";
import Loading from "./Loading.jsx";
import AnimatedTrash from "./AnimatedTrash.jsx";
import AnimatedHeart from "./AnimatedHeart.jsx";
import AnimatedShare from "./AnimatedShare.jsx";
import AnimatedMessageCircle from "./AnimatedMessageCircle.jsx";

const PostCard = ({ post, activeLink = true, onDelete }) => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likes, setLikes] = useState(post.likes_count || []);
  const [shares, setShares] = useState(post.shares_count || 0);
  const currentUser = useSelector((state) => state.user.value);
  const [loading, setLoading] = useState(true);
  const { getToken } = useAuth();

  const sanitizedContent = useMemo(() => {
    const formatHashtags = (html) =>
      html.replace(
        /#([\p{L}\p{N}_]+)/gu,
        (match) =>
          `<span class="inline-block text-purple-600 font-medium hover:bg-purple-100 px-1 rounded cursor-pointer transition-all duration-150">${match}</span>`
      );
    return DOMPurify.sanitize(formatHashtags(post.content || ""));
  }, [post.content]);

  const prevImage = () =>
    setCurrentIndex((prev) =>
      prev === 0 ? post.image_urls.length - 1 : prev - 1
    );
  const nextImage = () =>
    setCurrentIndex((prev) =>
      prev === post.image_urls.length - 1 ? 0 : prev + 1
    );

  const handleLike = async () => {
    const alreadyLiked = likes.includes(currentUser?._id);
    setLikes((prev) =>
      alreadyLiked
        ? prev.filter((id) => id !== currentUser._id)
        : [...(prev || []), currentUser._id]
    );

    try {
      const token = await getToken();
      const { data } = await api.post(
        `/api/post/like/${post._id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success && data.likes) setLikes(data.likes);
      else throw new Error(data.message || "Failed to like post");
    } catch (error) {
      // revert UI
      setLikes((prev) =>
        alreadyLiked
          ? [...prev, currentUser._id]
          : prev.filter((id) => id !== currentUser._id)
      );
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const handleShare = async () => {
    const postUrl = `${window.location.origin}/post/${post._id}`;
    const token = await getToken();
    const recordShare = async () => {
      try {
        await api.post(
          `/api/post/share/${post._id}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setShares((prev) => prev + 1);
      } catch {}
    };

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Check out this post by ${post.user?.full_name}`,
          text: post.content?.slice(0, 100) || "",
          url: postUrl,
        });
        await recordShare();
      } catch {
        toast.error("Sharing cancelled or failed");
      }
    } else {
      try {
        await navigator.clipboard.writeText(postUrl);
        toast.success("Post URL copied!");
      } catch {
        toast.error("Failed to copy URL");
      }
    }
  };

  const handleDelete = async () => {
    try {
      const token = await getToken();
      const { data } = await api.delete(`/api/post/${post._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        toast.success("Post deleted successfully!");
        onDelete?.(post._id);
      } else toast.error(data.message || "Failed to delete post");
    } catch (err) {
      toast.error(
        err.response?.data?.message || err.message || "Something went wrong"
      );
    }
  };

  const isLiked = likes.includes(currentUser?._id);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="bg-white rounded-2xl shadow-lg px-4 py-3 space-y-4 w-full max-w-[calc(100vw-2rem)] transform-gpu"
      style={{ willChange: "transform" }}
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <div
          onClick={
            activeLink
              ? () => navigate(`/profile/${post.user?._id}`)
              : undefined
          }
          className="inline-flex group items-center gap-3 cursor-pointer"
        >
          {post.user?.profile_picture && (
            <img
              loading="lazy"
              src={post.user?.profile_picture}
              alt={post.user?.full_name || "User"}
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-full shadow-md transition-all duration-300 group-hover:ring-2 group-hover:ring-offset-2 group-hover:ring-indigo-500 object-cover"
            />
          )}
          <div className="flex flex-col justify-center text-sm sm:text-base">
            <span className="relative w-fit text-gray-700 font-semibold transition-colors duration-200 group-hover:text-indigo-600">
              {post.user?.full_name}
              <span className="absolute left-0 bottom-0 w-full h-[1.5px] bg-indigo-500 scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"></span>
            </span>
            <span className="text-gray-500 text-xs sm:text-sm">
              @{post.user?.username} • {moment(post.createdAt).fromNow()}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      {post.content && (
        <div
          className="text-gray-800 text-sm sm:text-base whitespace-pre-line break-words leading-relaxed"
          dangerouslySetInnerHTML={{ __html: sanitizedContent }}
        />
      )}

      {/* Image Carousel */}
      {Array.isArray(post.image_urls) && post.image_urls.length > 0 && (
        <div className="relative w-full overflow-hidden rounded-lg h-[300px] sm:h-[350px]">
          {loading && <Loading height="100%" />}
          <AnimatePresence mode="wait">
            <motion.img
              key={currentIndex}
              src={post.image_urls[currentIndex]}
              alt={`post-${currentIndex}`}
              loading="lazy"
              className="w-full h-full object-contain rounded-lg shadow-sm object-center"
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              onLoad={() => setLoading(false)}
              onError={() => setLoading(false)}
            />
          </AnimatePresence>

          {post.image_urls.length > 1 && (
            <>
              <button
                type="button"
                onClick={prevImage}
                className="absolute top-1/2 left-3 -translate-y-1/2 bg-black/50 cursor-pointer text-white p-2 rounded-full hover:bg-black/70 transition"
              >
                <ChevronLeftIcon />
              </button>
              <button
                type="button"
                onClick={nextImage}
                className="absolute top-1/2 right-3 -translate-y-1/2 bg-black/50 cursor-pointer text-white p-2 rounded-full hover:bg-black/70 transition"
              >
                <ChevronRightIcon />
              </button>
              <div className="absolute bottom-3 w-full flex justify-center gap-2">
                {post.image_urls.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ease-out transform ${
                      idx === currentIndex
                        ? "bg-white scale-125 shadow-md"
                        : "bg-gray-400/80 scale-100 hover:scale-110 hover:bg-gray-300/90"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between border-t border-gray-200 pt-4">
        <div className="flex flex-wrap items-center gap-3 text-gray-600 text-sm">
          <div className="flex items-center gap-1">
            <AnimatedHeart
              liked={isLiked}
              onClick={handleLike}
              role="button"
              aria-label="Like post"
            />
            <motion.span
              key={likes.length}
              className="min-w-[20px] text-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              {likes.length}
            </motion.span>
          </div>

          <div className="flex items-center gap-1">
            <AnimatedMessageCircle
              role="button"
              onClick={() => navigate(`/post/${post._id}`)}
              aria-label="Comment on post"
              className="w-5 h-5 cursor-pointer hover:text-indigo-500 transition"
            />
            <span className="min-w-[20px] text-center">
              {post.comments.length || 0}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <AnimatedShare
              onClick={handleShare}
              role="button"
              aria-label="Share post"
            />
            <motion.span
              key={shares}
              className="min-w-[20px] text-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              {shares}
            </motion.span>
          </div>
        </div>

        {currentUser?._id === post.user?._id && (
          <button
            onClick={handleDelete}
            className="p-1 hover:bg-red-100 rounded-full transition mt-2 cursor-pointer"
            title="Delete post"
          >
            <AnimatedTrash className="w-8 h-8" />
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default PostCard;
