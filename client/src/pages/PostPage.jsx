import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import Loading from "../components/Loading";
import { toast } from "react-hot-toast";
import { useAuth } from "@clerk/clerk-react";
import { ChevronLeft } from "lucide-react";
import PostWithComments from "../components/PostWithComments";
import Comments from "../components/Comments";

const PostPage = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const token = await getToken();
        const { data } = await api.get(`/api/post/${postId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (data.success) setPost(data.post);
        else toast.error(data.message || "Failed to fetch post");
      } catch (error) {
        toast.error(error.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId, getToken]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loading />
      </div>
    );

  if (!post)
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center px-4">
        <p className="text-gray-500 text-lg sm:text-xl mb-4">Post not found</p>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition"
        >
          Go Back
        </button>
      </div>
    );

  return (
    <div className="flex flex-col h-screen mx-auto p-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-gray-200 transition"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl sm:text-2xl font-semibold">Post</h1>
      </div>

      {/* Post */}
      <div className="flex-shrink-0 mb-4">
        <PostWithComments post={post} />
      </div>

      {/* Comments */}
      <div className="flex-1 overflow-y-auto">
        <Comments postId={post._id} />
      </div>
    </div>
  );
};

export default PostPage;
