import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import moment from "moment";
import { motion } from "framer-motion";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import api from "../api/axios";

import StoryModel from "./StoryModel";
import StoryViewer from "./StoryViewer";
import tinycolor from "tinycolor2";

const StoriesBar = () => {
  const { getToken } = useAuth();
  const [showModel, setShowModel] = useState(false);
  const [viewStory, setViewStory] = useState(null);
  const [stories, setStories] = useState([]);

  const fetchStories = async () => {
    try {
      const token = await getToken();
      const { data } = await api.get("/api/story/get", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) setStories(data.stories);
      else toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  const isLightColor = (color) => tinycolor(color).isLight();

  return (
    <div className="w-full overflow-x-auto ">
      <div className="inline-flex gap-3 sm:gap-4 md:gap-5">
        {/* Create Story */}
        <motion.div
          layout
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={() => setShowModel(true)}
          className="shrink-0 w-[90px] sm:w-[100px] md:w-[110px] aspect-[3/4] rounded-lg border-2 border-dashed border-indigo-300 bg-gradient-to-b from-indigo-50 to-white flex flex-col items-center justify-center text-center cursor-pointer transition-transform duration-300 transform-gpu hover:from-indigo-100 hover:to-indigo-50"
        >
          <div className="size-10 bg-indigo-500 rounded-full flex items-center justify-center mb-2">
            <Plus className="w-5 h-5 text-white" />
          </div>
          <p className="text-[11px] sm:text-xs font-medium text-slate-700 px-1">
            Create Story
          </p>
        </motion.div>

        {/* Story Items */}
        {stories.map((story) => {
          const lightBg = isLightColor(story.background_color);
          return (
            <motion.div
              key={story._id}
              layout
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setViewStory(story)}
              className="relative shrink-0 w-[90px] sm:w-[100px] md:w-[110px] aspect-[3/4] rounded-xl overflow-hidden cursor-pointer group will-change-transform transform-gpu transition-all duration-300 border-2 border-gray-500/40"
            >
              {/* Media */}
              {story.media_type !== "text" && story.media_url && (
                <div className="absolute inset-0 z-0">
                  {story.media_type === "image" ? (
                    <img
                      src={story.media_url}
                      alt=""
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                  ) : (
                    <video
                      src={story.media_url}
                      className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                      muted
                      playsInline
                      autoPlay
                      loop
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 z-10 transition-all duration-300 group-hover:from-black/50" />
                </div>
              )}

              {/* Text story */}
              {story.content && (
                <div
                  className="absolute inset-0 z-20 flex items-center justify-center p-2 text-center"
                  style={{ backgroundColor: story.background_color }}
                >
                  <p
                    className="text-xs sm:text-sm font-medium z-30 truncate drop-shadow-md"
                    style={{ color: lightBg ? "#000" : "#fff" }}
                  >
                    {story.content}
                  </p>
                </div>
              )}

              {/* Avatar */}
              {story.user && (
                <img
                  src={story.user.profile_picture}
                  alt=""
                  loading="lazy"
                  className="absolute top-2 left-2 size-8 rounded-full ring-2 shadow-md z-30 transition-all duration-300 ring-amber-400"
                />
              )}

              {/* Timestamp */}
              <p className="absolute bottom-1 right-1 bg-black/50 text-white text-[10px] px-1.5 py-0.5 rounded-md shadow-sm backdrop-blur-sm z-30 transition-all duration-300 group-hover:bg-black/70">
                {moment(story.createdAt).fromNow()}
              </p>
            </motion.div>
          );
        })}
      </div>

      {showModel && (
        <StoryModel setShowModel={setShowModel} fetchStories={fetchStories} />
      )}
      {viewStory && (
        <StoryViewer viewStory={viewStory} setViewStory={setViewStory} />
      )}
    </div>
  );
};

export default StoriesBar;
