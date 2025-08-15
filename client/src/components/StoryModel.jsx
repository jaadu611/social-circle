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
    if (file) {
      if (file.type.startsWith("video")) {
        if (file.size > MAX_VIDEO_SIZE_MB * 1024 * 1024) {
          toast.error(`File cant be more than ${MAX_VIDEO_SIZE_MB} MB`);
          setMedia(null);
          setPreviewUrl(null);
          return;
        }
        const video = document.createElement("video");
        video.preload = "metadata";
        video.onloadedmetadata = () => {
          window.URL.revokeObjectURL(video.src);
          if (video.duration > MAX_VIDEO_DURATION_SECONDS) {
            toast.error(
              `Video duration cant be more than ${MAX_VIDEO_DURATION_SECONDS} seconds`
            );
          } else {
            setMedia(file);
            setPreviewUrl(URL.createObjectURL(file));
            setText("");
            setMode("media");
          }
        };
        video.src = URL.createObjectURL(file);
      } else if (file.type.startsWith("image")) {
        setMedia(file);
        setPreviewUrl(URL.createObjectURL(file));
        setText("");
        setMode("media");
      }
    }
  };

  const handleCreateStory = async () => {
    const media_type =
      mode === "media"
        ? media?.type.startsWith("image")
          ? "image"
          : "video"
        : "text";

    if (media_type === "text" && !text) {
      toast.error("Please enter some text");
    }

    let formData = new FormData();
    formData.append("content", text);
    formData.append("media_type", media_type);
    formData.append("media", media);
    formData.append("background_color", background);

    const token = await getToken();

    try {
      const { data } = await api.post("/api/story/create", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setShowModel(false);
        toast.success("Story posted");
        fetchStories();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="fixed inset-0 z-110 min-h-screen bg-black/80 backdrop-blur text-white flex justify-center items-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-4 flex justify-between items-center">
          <button
            onClick={() => setShowModel(false)}
            className="text-white cursor-pointer"
          >
            <X className="hover:scale-105 transition-all duration-200 hover:bg-gray-500/10 rounded-full p-1 size-8" />
          </button>
          <h2 className="text-lg font-semibold">Create Story</h2>
          <span className="w-10" />
        </div>
        <div
          className="rounded-lg h-96 flex justify-center items-center relative"
          style={{ backgroundColor: background }}
        >
          {mode === "text" && (
            <textarea
              className="bg-transparent h-full w-full p-6 text-lg resize-none focus:outline-none placeholder-opacity-70"
              style={{
                color: textColor,
                caretColor: textColor,
                backgroundColor: background,
              }}
              placeholder="What's on your mind?"
              onChange={(e) => setText(e.target.value)}
              value={text}
            />
          )}

          {mode === "media" &&
            previewUrl &&
            (media?.type.startsWith("image") ? (
              <img
                src={previewUrl}
                alt=""
                className="h-full"
              />
            ) : (
              <video src={previewUrl} className="object-contain max-h-full" />
            ))}
        </div>
        <div className="flex mt-4 gap-2 justify-center">
          {bgColors.map((color) => (
            <div
              key={color}
              className="w-6 h-6 rounded-full cursor-pointer border border-gray-300"
              style={{ backgroundColor: color }}
              onClick={() => setBackground(color)}
            />
          ))}
        </div>
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => {
              setMode("text");
              setMedia(null);
              setPreviewUrl(null);
            }}
            className={`flex-1 cursor-pointer transition-all duration-200 flex items-center justify-center gap-2 p-2 rounded ${
              mode === "text"
                ? "bg-white text-black hover:bg-gray-300"
                : "bg-zinc-700 hover:bg-zinc-800"
            }`}
          >
            <TextIcon size={18} /> Text
          </button>
          <label
            className={`flex-1 flex items-center transition-all duration-200 justify-center gap-2 p-2 rounded cursor-pointer ${
              mode === "media"
                ? "bg-white text-black hover:bg-gray-300"
                : "bg-zinc-700 hover:bg-zinc-800"
            }`}
          >
            <input
              onChange={handleMediaUpload}
              type="file"
              accept="image/*, video/*"
              hidden
            />
            <Upload size={18} /> Photo/Video
          </label>
        </div>
        <button
          onClick={() =>
            toast.promise(handleCreateStory(), {
              loading: "Saving...",
            })
          }
          className="flex items-center justify-center gap-2 text-white py-3 mt-4 w-full rounded bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 active:scale-95 transition cursor-pointer"
        >
          <Sparkle size={18} /> Create Story
        </button>
      </div>
    </div>
  );
};

export default StoryModel;
