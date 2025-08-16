import { Sparkle, TextIcon, Upload, X } from "lucide-react";
import tinycolor from "tinycolor2";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "@clerk/clerk-react";
import api from "../api/axios.js";

const StoryModel = ({ setShowModel, fetchStories }) => {
  const colorPalette = {
    white: "#ffffff",
    gray: "#94a3b8",
    yellow: "#facc15",
    blue: "#3b82f6",
    pink: "#ec4899",
    green: "#22c55e",
    peach: "#fb923c",
    violet: "#8b5cf6",
    slate: "#64748b",
    orange: "#f97316",
    red: "#ef4444",
    teal: "#14b8a6",
    purple: "#a855f7",
    indigo: "#6366f1",
  };
  const bgColors = Object.values(colorPalette);

  const [mode, setMode] = useState("text");
  const [background, setBackground] = useState(bgColors[0]);
  const [text, setText] = useState("");
  const [media, setMedia] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const textColor = tinycolor(background).isLight() ? "#1f2937" : "#f8fafc";
  const { getToken } = useAuth();

  const MAX_VIDEO_DURATION_SECONDS = 60;
  const MAX_VIDEO_SIZE_MB = 50;

  const handleMediaUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isVideo = file.type.startsWith("video");
    const isImage = file.type.startsWith("image");

    if (isVideo && file.size > MAX_VIDEO_SIZE_MB * 1024 * 1024) {
      toast.error(`File can’t be more than ${MAX_VIDEO_SIZE_MB} MB`);
      return;
    }

    if (isVideo) {
      const video = document.createElement("video");
      video.preload = "metadata";
      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        if (video.duration > MAX_VIDEO_DURATION_SECONDS) {
          toast.error(
            `Video duration can’t be more than ${MAX_VIDEO_DURATION_SECONDS} seconds`
          );
        } else {
          setMedia(file);
          setPreviewUrl(URL.createObjectURL(file));
          setText("");
          setMode("media");
        }
      };
      video.src = URL.createObjectURL(file);
    } else if (isImage) {
      setMedia(file);
      setPreviewUrl(URL.createObjectURL(file));
      setText("");
      setMode("media");
    }
  };

  const handleCreateStory = async () => {
    const media_type =
      mode === "media"
        ? media?.type.startsWith("image")
          ? "image"
          : "video"
        : "text";

    if (media_type === "text" && !text.trim()) {
      toast.error("Please enter some text");
      return;
    }

    const formData = new FormData();
    formData.append("content", text);
    formData.append("media_type", media_type);
    if (media) formData.append("media", media);
    formData.append("background_color", background);

    try {
      const token = await getToken();
      const { data } = await api.post("/api/story/create", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        toast.success("Story posted");
        setShowModel(false);
        fetchStories();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex justify-center items-center p-4 bg-black/80 backdrop-blur text-white">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 text-center">
          <button onClick={() => setShowModel(false)} className="text-white">
            <X className="hover:scale-105 transition-all duration-200 rounded-full p-1" />
          </button>
          <h2 className="text-lg font-semibold">Create Story</h2>
          <span className="w-10" />
        </div>

        {/* Story Preview */}
        <div
          className="relative flex justify-center items-center rounded-lg h-96"
          style={{ backgroundColor: background }}
        >
          {mode === "text" && (
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="What's on your mind?"
              className="w-full h-full p-6 text-lg resize-none bg-transparent focus:outline-none placeholder-opacity-70"
              style={{ color: textColor, caretColor: textColor }}
            />
          )}

          {mode === "media" && previewUrl && (
            <>
              {media?.type.startsWith("image") ? (
                <img
                  src={previewUrl}
                  alt=""
                  className="h-full object-contain"
                />
              ) : (
                <video
                  src={previewUrl}
                  className="h-full object-contain"
                  controls
                />
              )}
            </>
          )}
        </div>

        {/* Color Picker */}
        <div className="flex gap-2 mt-4 justify-center flex-wrap">
          {bgColors.map((color) => (
            <div
              key={color}
              className="w-6 h-6 rounded-full cursor-pointer border border-gray-300"
              style={{ backgroundColor: color }}
              onClick={() => setBackground(color)}
            />
          ))}
        </div>

        {/* Mode Switch */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => {
              setMode("text");
              setMedia(null);
              setPreviewUrl(null);
            }}
            className={`flex-1 flex items-center justify-center gap-2 p-2 rounded cursor-pointer transition ${
              mode === "text"
                ? "bg-white text-black hover:bg-gray-300"
                : "bg-zinc-700 hover:bg-zinc-800"
            }`}
          >
            <TextIcon size={18} /> Text
          </button>

          <label
            className={`flex-1 flex items-center justify-center gap-2 p-2 rounded cursor-pointer transition ${
              mode === "media"
                ? "bg-white text-black hover:bg-gray-300"
                : "bg-zinc-700 hover:bg-zinc-800"
            }`}
          >
            <input
              type="file"
              accept="image/*, video/*"
              hidden
              onChange={handleMediaUpload}
            />
            <Upload size={18} /> Photo/Video
          </label>
        </div>

        {/* Submit */}
        <button
          onClick={() =>
            toast.promise(handleCreateStory(), {
              loading: "Saving...",
            })
          }
          className="flex items-center justify-center gap-2 w-full mt-4 py-3 rounded bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 active:scale-95 transition"
        >
          <Sparkle size={18} /> Create Story
        </button>
      </div>
    </div>
  );
};

export default StoryModel;
