import React, { useEffect, useState, useMemo } from "react";
import Loading from "../components/Loading";
import StoriesBar from "../components/StoriesBar";
import PostCard from "../components/PostCard";
import { useAuth } from "@clerk/clerk-react";
import api from "../api/axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

const Feed = () => {
  const [feeds, setFeeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getToken, isLoaded } = useAuth();

  const fetchFeeds = async () => {
    if (!isLoaded) return;

    try {
      setLoading(true);
      const token = await getToken();
      const res = await api.get("/api/post/feed", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) setFeeds(res.data.posts);
      else toast.error(res.data.message || "Failed to fetch feed");
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeeds();
  }, [isLoaded]);

  // Memoize feed items for performance
  const feedItems = useMemo(
    () =>
      feeds.map((post, index) => (
        <motion.div
          key={post._id}
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 70,
            damping: 20,
            delay: index * 0.05,
          }}
          style={{
            willChange: "transform",
            transform: "translateZ(0)",
          }}
        >
          <PostCard post={post} loading="lazy" />
        </motion.div>
      )),
    [feeds]
  );

  if (!isLoaded || loading) return <Loading />;

  return (
    <div className="p-4 flex justify-center xl:justify-between gap-6 mx-auto flex-1 h-full">
      <div className="flex-1 w-full flex flex-col">
        {/* Stories */}
        <div className="mb-6">
          <StoriesBar />
        </div>

        {/* Feed */}
        <div className="space-y-6 border-t border-gray-200 pt-6 flex-1 flex flex-col">
          {feedItems.length > 0 ? (
            feedItems
          ) : (
            <div className="flex-1">
              <p className="flex items-center justify-center pb-30 flex-col text-gray-500 py-10 bg-gray-50 rounded-xl shadow-lg h-full w-full border border-gray-200">
                No Posts Yet 🙁 <br />
                <span className="text-sm text-gray-400">
                  Follow others to see their posts
                </span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Feed;
