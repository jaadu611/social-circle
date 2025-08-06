import { X } from "lucide-react";
import React, { useEffect, useState } from "react";

const StoryViewer = ({ viewStory, setViewStory }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let timer, progressInterval;

    if (viewStory && viewStory.media_type !== "video") {
      setProgress(0);
      let elapsed = 0;

      progressInterval = setInterval(() => {
        elapsed += 100;
        setProgress((elapsed / 10000) * 100);
      }, 100);

      timer = setTimeout(() => {
        setViewStory(null);
      }, 10000);
    }

    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
    };
  }, [viewStory, setViewStory]);

  if (!viewStory) return null;

  const renderContent = () => {
    switch (viewStory.media_type) {
      case "image":
        return (
          <img
            src={viewStory.media_url}
            className="max-h-screen max-w-full object-contain"
          />
        );

      case "video":
        return (
          <video
            onEnded={() => setViewStory(null)}
            src={viewStory.media_url}
            className="max-h-screen"
            autoPlay
          />
        );

      case "text":
        return (
          <div className="w-full h-full flex items-center justify-center p-8 text-white text-2xl text-center">
            {viewStory.content}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className="fixed inset-0 h-screen bg-black/90 z-110 flex items-center justify-center"
      style={{
        backgroundColor:
          viewStory.media_type === "text"
            ? viewStory.background_color
            : "#000000",
      }}
    >
      {/* progress bar */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gray-700">
        <div
          className="h-full bg-white transition-all duration-100 linear"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* user info */}
      <div className="absolute top-4 left-4 flex items-center space-x-2 p-2 px-4 sm:p-4 sm:px-8 backdrop-blur-2xl rounded bg-black/50">
        <img
          src={viewStory.user?.profile_picture}
          alt=""
          className="size-7 sm:size-8 rounded-full object-cover border border-white"
        />
        <div className="text-white font-medium flex items-center gap-1.5">
          <span>{viewStory.user?.full_name}</span>
        </div>
      </div>

      {/* close button */}
      <button
        onClick={() => setViewStory(null)}
        className="absolute top-4 right-4 text-white text-3xl font-bold focus:outline-none"
      >
        <X className="h-8 w-8 hover:scale-110 transition cursor-pointer" />
      </button>

      {/* content wrapper */}
      <div className="flex max-w-[90vw] max-h-[90vh] items-center justify-center">
        {renderContent()}
      </div>
    </div>
  );
};

export default StoryViewer;
