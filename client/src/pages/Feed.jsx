import React, { useEffect, useState } from "react";
import { dummyPostsData } from "../assets/assets";
import Loading from "../components/Loading";
import StoriesBar from "../components/StoriesBar";
import PostCard from "../components/PostCard";
import RecentMessages from "../components/RecentMessages";

const Feed = () => {
  const [feeds, setFeeds] = useState([]);
  const [loading, setLoading] = useState([true]);

  const fetchFeeds = async () => {
    setFeeds(dummyPostsData);
    setLoading(false);
  };

  useEffect(() => {
    fetchFeeds();
  }, []);

  return !loading ? (
    <div className="h-full overflow-y-scroll no-scrollbar p-4 flex justify-center xl:justify-between gap-4 max-w-7xl mx-auto">
      {/* Main content area */}
      <div className="flex-1 w-full xl:max-w-[800px]">
        <StoriesBar />
        <div className="space-y-6">
          {feeds.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      </div>

      {/* Right sidebar */}
      <div className="hidden xl:block w-[400px] sticky top-0">
        <RecentMessages />
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default Feed;
