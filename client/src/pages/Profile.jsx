import React, { useEffect, useState, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Loading from "../components/Loading";
import UserProfileInfo from "../components/UserProfileInfo";
import PostCard from "../components/PostCard";
import moment from "moment";
import ProfileModel from "../components/ProfileModel";
import api from "../api/axios";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";

const CACHE_EXPIRATION = 5 * 60 * 1000; // 5 minutes

const Profile = () => {
  const currentUser = useSelector((state) => state.user.value);
  const { getToken } = useAuth();
  const { profileId } = useParams();

  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState("Posts");
  const [showEdit, setShowEdit] = useState(false);

  const cacheKey = `profile_${profileId || currentUser?._id}`;

  const fetchUser = async (profileId) => {
    try {
      const token = await getToken();

      const { data } = await api.post(
        `/api/user/profiles`,
        { profileId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        // Optimize images
        const optimizedPosts = data.posts.map((post) => ({
          ...post,
          image_urls: post.image_urls.map((url) =>
            url.replace("/tr:q-100:f-webp:w-1280/", "/tr:q-70:f-webp:w-400/")
          ),
        }));

        const optimizedUser = {
          ...data.profile,
          cover_photo: data.profile.cover_photo
            ? data.profile.cover_photo.replace(
                "/tr:q-100:f-webp:w-1280/",
                "/tr:q-70:f-webp:w-600/"
              )
            : null,
        };

        setUser(optimizedUser);
        setPosts(optimizedPosts);

        // Save to cache with timestamp
        const cacheData = {
          user: optimizedUser,
          posts: optimizedPosts,
          timestamp: Date.now(),
        };
        localStorage.setItem(cacheKey, JSON.stringify(cacheData));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to fetch user profile");
    }
  };

  useEffect(() => {
    const loadProfile = async () => {
      // Try to load from cache
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        const expired = Date.now() - parsed.timestamp > CACHE_EXPIRATION;
        if (!expired) {
          setUser(parsed.user);
          setPosts(parsed.posts);
        }
      }

      // Always fetch fresh data in background to update cache
      await fetchUser(profileId || currentUser?._id);
    };

    loadProfile();
  }, [profileId, currentUser]);

  // Prepare media posts for Media tab
  const mediaPosts = useMemo(
    () =>
      posts
        .filter((post) => post.image_urls.length > 0)
        .flatMap((post) =>
          post.image_urls.map((image, index) => ({
            image,
            postId: post._id,
            createdAt: post.createdAt,
            index,
          }))
        ),
    [posts]
  );

  if (!user) return <Loading />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section with Cover Photo */}
      <div className="relative w-full">
        {/* Cover Photo Container */}
        

        {/* Profile Info Container - Overlapping the cover photo */}
        <div className="relative -mt-16 sm:-mt-20 md:-mt-24 lg:-mt-28 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-36">
            <div className="relative max-w-7xl h-48 sm:h-64 md:h-80 lg:h-96 overflow-hidden rounded-tr-2xl rounded-tl-2xl">
          {user.cover_photo ? (
            <img
              src={user.cover_photo.replace(
                "/tr:q-100:f-webp:w-1280/",
                "/tr:q-70:f-webp:w-600/"
              )}
              alt={`${user.name} Cover`}
              className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-500 transform hover:scale-105"
              loading="lazy"
              width={1200}
              height={400}
            />
          ) : (
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-violet-600 via-purple-600 to-blue-600" />
          )}
        </div>
            <UserProfileInfo
              user={user}
              posts={posts}
              profileId={profileId}
              setShowEdit={setShowEdit}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Navigation Tabs */}
        <div className="mt-8 mb-8">
          <div className="flex justify-center">
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-1.5 shadow-lg border border-white/20">
              <div className="flex space-x-1">
                {["Posts", "Media"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`relative cursor-pointer px-6 py-3 rounded-xl font-medium text-sm transition-all duration-300 ease-out ${
                      activeTab === tab
                        ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg transform scale-105"
                        : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                    }`}
                  >
                    {tab}
                    {activeTab === tab && (
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 opacity-20 animate-pulse" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-8 xl:col-span-9">
            {activeTab === "Posts" && (
              <div className="space-y-6">
                {posts.length > 0 ? (
                  posts.map((post, index) => (
                    <div
                      key={post._id}
                      className="transform transition-all duration-300 hover:scale-[1.02]"
                      style={{
                        animationDelay: `${index * 100}ms`,
                      }}
                    >
                      <PostCard post={post} activeLink={false} />
                    </div>
                  ))
                ) : (
                  <div className="text-center py-16">
                    <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-violet-100 to-indigo-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-12 h-12 text-violet-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      No posts yet
                    </h3>
                    <p className="text-gray-500">
                      Start sharing your thoughts with the world!
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "Media" && (
              <div className="space-y-6">
                {mediaPosts.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                    {mediaPosts.map(({ image, postId, createdAt }, index) => (
                      <Link
                        target="_blank"
                        to={image}
                        key={`${postId}-${index}`}
                        className="group relative aspect-square overflow-hidden rounded-2xl bg-gray-100 transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
                        style={{
                          animationDelay: `${index * 50}ms`,
                        }}
                      >
                        <img
                          src={image}
                          alt=""
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          loading="lazy"
                        />
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        {/* Date Badge */}
                        <div className="absolute bottom-2 left-2 right-2">
                          <div className="bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                            <p className="text-xs font-medium text-gray-800 truncate">
                              {moment(createdAt).fromNow()}
                            </p>
                          </div>
                        </div>
                        {/* View Icon */}
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="bg-white/90 backdrop-blur-sm rounded-full p-2">
                            <svg
                              className="w-4 h-4 text-gray-800"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                              />
                            </svg>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-12 h-12 text-pink-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      No media yet
                    </h3>
                    <p className="text-gray-500">
                      Share some photos to get started!
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar - Hidden on mobile, visible on large screens */}
          <div className="hidden lg:block lg:col-span-4 xl:col-span-3">
            <div className="sticky top-6 space-y-6">
              {/* Stats Card */}
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Profile Stats
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Total Posts</span>
                    <span className="font-semibold text-violet-600">
                      {posts.length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Media Posts</span>
                    <span className="font-semibold text-violet-600">
                      {mediaPosts.length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Member Since</span>
                    <span className="font-semibold text-violet-600">
                      {moment(user.createdAt).format("MMM YYYY")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              {posts.length > 0 && (
                <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Recent Activity
                  </h3>
                  <div className="space-y-3">
                    {posts.slice(0, 3).map((post) => (
                      <div
                        key={post._id}
                        className="flex items-start space-x-3"
                      >
                        <div className="w-2 h-2 bg-violet-500 rounded-full mt-2 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-600 truncate">
                            {post.content || "Shared a post"}
                          </p>
                          <p className="text-xs text-gray-400">
                            {moment(post.createdAt).fromNow()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Profile Edit Modal */}
      {showEdit && <ProfileModel setShowEdit={setShowEdit} />}
    </div>
  );
};

export default Profile;
