import React, { useState } from "react";
import { dummyUserData } from "../assets/assets";
import { Image, X, Loader } from "lucide-react";
import toast from "react-hot-toast";

const CreatePost = () => {
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const user = dummyUserData;

  const handleSubmit = async () => {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-slate-100 py-10 px-4">
      <div className="max-w-[100vw] mx-auto bg-white rounded-xl shadow-lg p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center gap-3">
          <img
            src={user.profile_picture}
            alt="Profile"
            className="w-14 h-14 rounded-full border border-gray-300 object-cover"
          />
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {user.full_name}
            </h2>
            <p className="text-sm text-gray-500">@{user.username}</p>
          </div>
        </div>

        {/* Textarea + Images */}
        <div className="space-y-3">
          <div className="relative">
            <div className="absolute top-2 right-3 text-sm text-gray-400">
              {content.length}/280
            </div>
            <textarea
              className="w-full min-h-[160px] max-h-[300px] resize-none border border-gray-300 rounded-md p-4 text-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition placeholder-gray-400"
              placeholder="What's happening?"
              onChange={(e) => setContent(e.target.value)}
              value={content}
            />
          </div>

          {images.length > 0 ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 p-4 mt-2 border border-dashed border-gray-300 rounded-lg bg-gray-50">
              {images.map((image, i) => (
                <div
                  key={i}
                  className="relative w-full aspect-square rounded-md overflow-hidden group"
                >
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`upload-${i}`}
                    className="h-full object-contain transition-transform border-2 border-gray-300 rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setImages(images.filter((_, index) => index !== i))
                    }
                    className="absolute top-1 cursor-pointer right-1 bg-black/60 hover:bg-black p-1 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-sm text-gray-400 border border-dashed border-gray-300 rounded-md py-8">
              Uploaded Images Will be Shown Here
            </p>
          )}
        </div>

        {/* Bottom Bar */}
        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <label
            htmlFor="images"
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-indigo-600 cursor-pointer transition"
          >
            <Image className="w-5 h-5" />
            <span>Add images</span>
          </label>
          <input
            type="file"
            id="images"
            accept="image/*"
            hidden
            multiple
            onChange={(e) => setImages([...images, ...e.target.files])}
          />
          <button
            onClick={() =>
              toast.promise(handleSubmit(), {
                loading: "uploading...",
                success: <p>Post Added</p>,
                error: <p>Post Not Added</p>,
              })
            }
            disabled={loading || (!content && images.length === 0)}
            className="px-5 py-2 rounded-md cursor-pointer text-white font-medium bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {loading ? (
              <Loader className="animate-spin w-4 h-4" />
            ) : (
              "Publish Post"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
