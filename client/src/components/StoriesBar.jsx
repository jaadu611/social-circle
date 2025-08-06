import React, { useState } from "react";
import { Plus } from "lucide-react";
import moment from "moment";
import StoryModel from "./StoryModel";
import StoryViewer from "./StoryViewer";
import { dummyStoriesData } from "../assets/assets";
import { motion } from "framer-motion";

const StoriesBar = ({ stories = dummyStoriesData }) => {
  const [showModel, setShowModel] = useState(false);
  const [viewStory, setViewStory] = useState(null);

  return (
    <div className="w-full overflow-x-auto no-scrollbar">
      <div className="inline-flex gap-3 sm:gap-4 md:gap-5 pb-2 sm:pb-3">
        {/* Add Story Card */}
        <motion.div
          layout
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={() => setShowModel(true)}
          className="shrink-0 w-[90px] sm:w-[100px] md:w-[110px] aspect-[3/4] rounded-lg border-2 border-dashed border-indigo-300 bg-gradient-to-b from-indigo-50 to-white flex flex-col items-center justify-center text-center cursor-pointer hover:shadow-lg hover:scale-105 transition-transform duration-300 transform-gpu will-change-transform"
        >
          <div className="size-10 bg-indigo-500 rounded-full flex items-center justify-center mb-2">
            <Plus className="w-5 h-5 text-white" />
          </div>
          <p className="text-[11px] sm:text-xs font-medium text-slate-700 px-1">
            Create Story
          </p>
        </motion.div>

        {/* Story Cards */}
        {stories.map((story, index) => (
          <motion.div
            layout
            key={index}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setViewStory(story)}
            className="relative shrink-0 w-[90px] sm:w-[100px] md:w-[110px] aspect-[3/4] rounded-lg overflow-hidden cursor-pointer group will-change-transform transform-gpu"
          >
            {/* Media Background */}
            {story.media_type !== "text" && story.media_url && (
              <div className="absolute inset-0 z-0">
                {story.media_type === "image" ? (
                  <img
                    src={story.media_url}
                    alt=""
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                  />
                ) : (
                  <video
                    src={story.media_url}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                  />
                )}
                <div className="absolute inset-0 bg-black/50 z-10 transition-all duration-200" />
              </div>
            )}

            {/* Text Overlay */}
            {story.content && (
              <div className="absolute inset-0 z-20 bg-gradient-to-b from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transition flex items-center justify-center px-2 text-center">
                <p className="text-white text-xs sm:text-sm font-medium z-30 truncate">
                  {story.content}
                </p>
              </div>
            )}

            {/* Profile Picture */}
            <img
              src={story.user.profile_picture}
              alt=""
              className="absolute top-2 left-2 size-8 rounded-full ring-2 ring-white z-30"
            />

            {/* Timestamp */}
            <p className="absolute bottom-1 right-2 text-white/70 text-[10px] z-30">
              {moment(story.createdAt).fromNow()}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Story Modal */}
      {showModel && (
        <StoryModel setShowModel={setShowModel} fetchStories={() => {}} />
      )}

      {/* View Story */}
      {viewStory && (
        <StoryViewer viewStory={viewStory} setViewStory={setViewStory} />
      )}
    </div>
  );
};

export default StoriesBar;
