import {
  ChevronLeftIcon,
  ChevronRight,
  Heart,
  MessageCircle,
  Share2,
} from "lucide-react";
import moment from "moment";
import DOMPurify from "dompurify";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "@clerk/clerk-react";
import api from "../api/axios.js";
import { toast } from "react-hot-toast";
import Loading from "./Loading.jsx";

const PostCard = ({ post, activeLink = true }) => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likes, setLikes] = useState(post.likes_count || []);
  const currentUser = useSelector((state) => state.user.value);
  const [loading, setLoading] = useState(true);
  const { getToken } = useAuth();

  const formatHashtags = (html) =>
    html.replace(
      /#(\w+)/g,
      (match) =>
        `<span class="inline-block text-purple-600 font-medium hover:bg-purple-100 px-1 rounded cursor-pointer transition-all duration-150">${match}</span>`
    );

  const prevImage = () =>
    setCurrentIndex((prev) =>
      prev === 0 ? post.image_urls.length - 1 : prev - 1
    );

  const nextImage = () =>
    setCurrentIndex((prev) =>
      prev === post.image_urls.length - 1 ? 0 : prev + 1
    );

  const handleLike = async () => {
    const token = await getToken();

    try {
      const { data } = await api.post(
        `/api/post/like/${post._id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (data.success) {
        setLikes((prev) => {
          if (prev.includes(currentUser._id)) {
            return prev.filter((id) => id !== currentUser._id);
          } else {
            return [...prev, currentUser._id];
          }
        });
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 space-y-4 w-full min-w-[100px] sm:min-w-[120px] max-w-[calc(100vw-2rem)] transform-gpu"
      style={{ willChange: "transform" }}
    >
      {/* User Header */}
      <div
        onClick={
          activeLink ? () => navigate(`/profile/${post.user._id}`) : undefined
        }
        className="inline-flex group items-center gap-3 cursor-pointer"
      >
        <img
          src={post.user.profile_picture}
          alt={post.user.full_name}
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full shadow-md transition-all duration-300 group-hover:ring-2 group-hover:ring-offset-2 group-hover:ring-indigo-500 object-cover"
        />
        <div className="flex flex-col justify-center text-sm sm:text-base">
          <span className="relative w-fit text-gray-700 font-semibold transition-colors duration-200 group-hover:text-indigo-600 after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[1.5px] after:bg-indigo-500 after:scale-x-0 group-hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-left">
            {post.user.full_name}
          </span>
          <span className="text-gray-500 text-xs sm:text-sm">
            @{post.user.username} • {moment(post.createdAt).fromNow()}
          </span>
        </div>
      </div>

      {/* Post Content */}
      {post.content && (
        <div
          className="text-gray-800 text-sm sm:text-base whitespace-pre-line break-words leading-relaxed"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(formatHashtags(post.content)),
          }}
        />
      )}

      {/* Image Carousel */}
      {Array.isArray(post.image_urls) && post.image_urls.length > 0 && (
        <div className="relative w-full overflow-hidden rounded-lg">
          <AnimatePresence mode="wait">
            {loading && <Loading height="100px" />}

            <motion.img
              key={currentIndex}
              src={post.image_urls[currentIndex]}
              alt={`post-${currentIndex}`}
              className="w-full max-w-[300px] h-auto mx-auto block object-cover rounded-lg shadow-sm object-center"
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
                <ChevronLeftIcon className="relative left-0" />
              </button>
              <button
                type="button"
                onClick={nextImage}
                className="absolute top-1/2 right-3 -translate-y-1/2 bg-black/50 cursor-pointer text-white p-2 rounded-full hover:bg-black/70 transition"
              >
                <ChevronRight />
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

      {/* Post Actions */}
      <div className="flex flex-wrap items-center gap-5 text-gray-600 text-sm pt-5 border-t border-gray-200">
        <div className="flex items-center gap-1">
          <Heart
            onClick={handleLike}
            className={`w-5 h-5 cursor-pointer transition-colors duration-200 ${
              likes.includes(currentUser?._id)
                ? "text-red-500 fill-red-500"
                : "hover:text-red-500"
            }`}
          />
          <span className="w-2 text-center">{likes.length}</span>
        </div>

        <div className="flex items-center gap-1">
          <MessageCircle className="w-5 h-5 cursor-pointer hover:text-indigo-500 transition" />
          <span className="w-2 text-center">{post.comments_count || 0}</span>
        </div>

        <div className="flex items-center gap-1">
          <Share2 className="w-5 h-5 cursor-pointer hover:text-indigo-500 transition" />
          <span className="w-2 text-center">{post.shares_count || 0}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default PostCard;
