import React, { useEffect, useState } from "react";
import Loading from "../components/Loading";
import StoriesBar from "../components/StoriesBar";
import PostCard from "../components/PostCard";
import RecentMessages from "../components/RecentMessages";
import { useAuth } from "@clerk/clerk-react";
import api from "../api/axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

const Feed = () => {
  const [feeds, setFeeds] = useState([]);
  const [loading, setLoading] = useState([true]);
  const { getToken } = useAuth();

  const fetchFeeds = async () => {
    const token = await getToken();
    try {
      setLoading(true);
      const res = await api.get("/api/post/feed", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setFeeds(res.data.posts);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeeds();
  }, []);

  return !loading ? (
    <div className="overflow-y-scroll no-scrollbar p-4 flex justify-center xl:justify-between gap-4 max-w-7xl mx-auto">
      <div className="flex-1 w-full">
        <StoriesBar />
        <div className="space-y-6">
          {feeds.map((post, index) => (
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
              <PostCard post={post} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default Feed;
