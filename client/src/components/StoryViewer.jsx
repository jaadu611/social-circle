import { X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const StoryViewer = ({ viewStory, setViewStory }) => {
  const [progress, setProgress] = useState(0);
  const [isLightBg, setIsLightBg] = useState(false);

  // Progress for non-video stories
  useEffect(() => {
    if (!viewStory || viewStory.media_type === "video") return;

    setProgress(0);
    let elapsed = 0;

    const progressInterval = setInterval(() => {
      elapsed += 100;
      setProgress((elapsed / 10000) * 100);
    }, 100);

    const timer = setTimeout(() => setViewStory(null), 10000);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(timer);
    };
  }, [viewStory, setViewStory]);

  // Determine if background is light for text contrast
  useEffect(() => {
    if (!viewStory?.background_color) return;

    const hex = viewStory.background_color.replace("#", "");
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;

    setIsLightBg(brightness > 155);
  }, [viewStory]);

  if (!viewStory) return null;

  const renderContent = () => {
    switch (viewStory.media_type) {
      case "image":
        return (
          <img
            src={viewStory.media_url}
            alt=""
            className="w-full h-full object-contain rounded-2xl shadow-2xl"
          />
        );
      case "video":
        return (
          <video
            src={viewStory.media_url}
            autoPlay
            playsInline
            className="w-full h-full rounded-2xl shadow-2xl"
            onEnded={() => setViewStory(null)}
          />
        );
      case "text":
        return (
          <div
            className="w-full h-full flex items-center justify-center p-8 text-3xl sm:text-4xl font-semibold text-center leading-relaxed tracking-wide"
            style={{ color: isLightBg ? "#1f2937" : "#f8fafc" }}
          >
            {viewStory.content}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className="fixed inset-0 h-screen z-[110] flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: viewStory.background_color }}
    >
      {/* Progress bar for non-video */}
      {viewStory.media_type !== "video" && (
        <div className="absolute top-0 left-0 w-full h-1 bg-black/30">
          <div
            className="h-full bg-white/90 transition-all duration-100 linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* User info */}
      <Link to={`/profile/${viewStory.user._id}`}>
        <div className="absolute top-4 left-4 flex items-center gap-3 p-2.5 pr-4 rounded-full backdrop-blur-md bg-black/50 shadow-lg border border-white/20 cursor-pointer transform transition-all duration-200 hover:scale-105 hover:bg-black/70 z-30">
          {viewStory.user?.profile_picture && (
            <img
              src={viewStory.user.profile_picture}
              alt={viewStory.user.full_name || "User"}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-white/70 shadow-md"
            />
          )}
          <span className="text-white font-semibold text-sm sm:text-base tracking-wide truncate max-w-[200px]">
            {viewStory.user?.full_name}
          </span>
        </div>
      </Link>

      {/* Close button */}
      <button
        onClick={() => setViewStory(null)}
        className="absolute top-4 right-4 z-30 text-3xl font-bold focus:outline-none bg-white/20 hover:bg-white/30 rounded-full p-1.5 transition"
      >
        <X
          className={`h-7 w-7 sm:h-8 sm:w-8 hover:scale-110 transition cursor-pointer ${
            isLightBg ? "text-black" : "text-white"
          }`}
        />
      </button>

      {/* Story content */}
      <div className="flex items-center justify-center w-full h-full px-0">
        {renderContent()}
      </div>
    </div>
  );
};

export default StoryViewer;
