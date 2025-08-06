import { Heart, MessageCircle, Share2 } from "lucide-react";
import moment from "moment";
import DOMPurify from "dompurify";
import React, { useState } from "react";
import { dummyUserData } from "../assets/assets";
import { useNavigate } from "react-router-dom";

const PostCard = ({ post, activeLink = true }) => {
  const navigate = useNavigate();
  const [likes, setLikes] = useState(post.likes_count || []);
  const currentUser = dummyUserData;

  const formatHashtags = (html) => {
    return html.replace(/#(\w+)/g, (match) => {
      return `<span class="inline-block text-purple-600 font-medium hover:bg-purple-100 px-1 rounded cursor-pointer transition-all duration-100">${match}</span>`;
    });
  };

  const handleLike = async () => {
    // placeholder for like functionality
  };

  return (
    <div className="bg-white rounded-xl shadow p-4 sm:p-5 space-y-4 w-full min-w-[100px] sm:min-w-[120px] max-w-[calc(100vw-2rem)]">
      {/* user info */}
      <div
        onClick={
          activeLink ? () => navigate(`/profile/${post.user._id}`) : undefined
        }
        className="inline-flex group items-center gap-3 cursor-pointer"
      >
        <img
          src={post.user.profile_picture}
          alt={post.user.full_name}
          className="size-10 sm:size-12 rounded-full shadow transition-all duration-300 group-hover:ring-2 group-hover:ring-offset-2 group-hover:ring-indigo-500"
        />
        <div className="flex flex-col justify-center text-sm sm:text-base">
          <span className="relative text-gray-700 font-medium transition-colors duration-200 group-hover:text-indigo-600 after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[1.5px] after:bg-indigo-500 after:scale-x-0 group-hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-left">
            {post.user.full_name}
          </span>
          <span className="text-gray-500 text-xs sm:text-sm">
            @{post.user.username} • {moment(post.createdAt).fromNow()}
          </span>
        </div>
      </div>

      {/* content */}
      {post.content && (
        <div
          className="text-gray-800 text-sm sm:text-base whitespace-pre-line break-words"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(formatHashtags(post.content)),
          }}
        />
      )}

      {/* images */}
      {post.image_urls.length > 0 && (
        <div
          className={`grid gap-2 ${
            post.image_urls.length === 1 ? "grid-cols-1" : "grid-cols-2"
          }`}
        >
          {post.image_urls.map((image, index) => (
            <img
              key={index}
              src={image}
              alt="post"
              className={`w-full object-cover rounded-lg ${
                post.image_urls.length === 1 ? "h-auto max-h-[500px]" : "h-48"
              }`}
            />
          ))}
        </div>
      )}

      {/* actions */}
      <div className="flex flex-wrap items-center gap-4 text-gray-600 text-sm pt-2 border-t border-gray-200">
        {/* like */}
        <div className="flex items-center gap-1">
          <Heart
            onClick={handleLike}
            className={`w-5 h-5 cursor-pointer transition-colors duration-200 ${
              likes.includes(currentUser._id)
                ? "text-red-500 fill-red-500"
                : "hover:text-red-500"
            }`}
          />
          <span>{likes.length}</span>
        </div>

        {/* comments */}
        <div className="flex items-center gap-1">
          <MessageCircle className="w-5 h-5" />
          <span>{post.comments_count || 12}</span>
        </div>

        {/* share */}
        <div className="flex items-center gap-1">
          <Share2 className="w-5 h-5" />
          <span>{post.shares_count || 12}</span>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
