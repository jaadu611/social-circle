import React, { useEffect, useState, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Loading from "../components/Loading";
import UserProfileInfo from "../components/UserProfileInfo";
import PostCard from "../components/PostCard";
import moment from "moment";
import ProfileModel from "../components/ProfileModel";
import api from "../api/axios";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import { fetchConnections } from "../features/connectionSlice";

const Profile = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.value);
  const { getToken } = useAuth();
  const { profileId } = useParams();

  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState("Posts");
  const [showEdit, setShowEdit] = useState(false);

  const fetchUser = async (profileId) => {
    try {
      const token = await getToken();
      const { data } = await api.post(
        `/api/user/profiles`,
        { profileId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        // Optimize cover photo & post images with ImageKit
        const optimizedPosts = data.posts.map((post) => ({
          ...post,
          image_urls: post.image_urls.map((url) =>
            url.replace("/tr:q-100:f-webp:w-1280/", "/tr:q-70:f-webp:w-400/")
          ),
        }));

        setUser({
          ...data.profile,
          cover_photo: data.profile.cover_photo
            ? data.profile.cover_photo.replace(
                "/tr:q-100:f-webp:w-1280/",
                "/tr:q-70:f-webp:w-600/"
              )
            : null,
        });
        setPosts(optimizedPosts);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to fetch user profile");
    }
  };

  useEffect(() => {
    if (profileId) {
      fetchUser(profileId);
    } else if (currentUser?._id) {
      fetchUser(currentUser._id);
    }
  }, [profileId, currentUser]);

  // Memoize posts with images for Media tab
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
    <div className="relative h-full overflow-y-scroll bg-gray-50 p-6">
      <div className="max-w-[60vw] mx-auto">
        <div className="bg-white rounded-2xl shadow overflow-hidden">
          <div className="h-40 md:h-56 bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200">
            {user.cover_photo && (
              <img
                src={user.cover_photo}
                alt=""
                className="h-full w-full object-cover"
                loading="lazy"
                width={600}
                height={200}
              />
            )}
          </div>

          <UserProfileInfo
            user={user}
            posts={posts}
            profileId={profileId}
            setShowEdit={setShowEdit}
          />
        </div>

        <div className="mt-6">
          <div className="relative bg-white rounded-xl shadow p-1 flex max-w-sm mx-auto overflow-hidden">
            <div
              className={`absolute top-1 left-0 h-[calc(100%-0.5rem)] w-1/2 bg-indigo-600 rounded-lg transition-all duration-300 ease-in-out transform ${
                activeTab === "Posts"
                  ? "translate-x-1"
                  : activeTab === "Media"
                  ? "translate-x-full"
                  : "translate-x-[198%]"
              }`}
            />

            {["Posts", "Media"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative flex-1 px-4 cursor-pointer py-2 text-sm font-medium z-10 transition-colors duration-200 rounded-lg
                  ${
                    activeTab === tab
                      ? "text-white"
                      : "text-gray-600 hover:text-indigo-600"
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === "Posts" && (
            <div className="mt-6 flex flex-col items-center gap-6">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} activeLink={false} />
              ))}
            </div>
          )}

          {activeTab === "Media" && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mt-4 mx-auto">
              {mediaPosts.length > 0 ? (
                mediaPosts.map(({ image, postId, createdAt }, index) => (
                  <Link
                    target="_blank"
                    to={image}
                    key={`${postId}-${index}`}
                    className="relative group w-full"
                  >
                    <img
                      src={image}
                      alt=""
                      className="w-full h-48 sm:h-56 md:h-64 lg:h-72 object-cover rounded-md"
                      loading="lazy"
                      width={400}
                      height={300}
                    />
                    <p className="absolute bottom-0 right-0 text-xs p-1 px-3 backdrop-blur-xl text-white opacity-0 group-hover:opacity-100 transition duration-300">
                      Posted {moment(createdAt).fromNow()}
                    </p>
                  </Link>
                ))
              ) : (
                <p className="text-gray-500 text-center col-span-full">
                  No media yet
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {showEdit && <ProfileModel setShowEdit={setShowEdit} />}
    </div>
  );
};

export default Profile;
