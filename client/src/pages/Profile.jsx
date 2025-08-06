import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { dummyPostsData, dummyUserData } from "../assets/assets";
import Loading from "../components/Loading";
import UserProfileInfo from "../components/UserProfileInfo";
import PostCard from "../components/PostCard";
import moment from "moment";
import ProfileModel from "../components/ProfileModel";

const Profile = () => {
  const { profileId } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState("Posts");
  const [showEdit, setShowEdit] = useState(false);

  const fetchUser = async () => {
    setUser(dummyUserData);
    setPosts(dummyPostsData);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return user ? (
    <div className="relative h-full overflow-y-scroll bg-gray-50 p-6">
      <div className="max-w-[100vw] mx-auto">
        {/* profile card */}
        <div className="bg-white rounded-2xl shadow overflow-hidden">
          {/* cover photo */}
          <div className="h-40 md:h-56 bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200">
            {user.cover_photo && (
              <img
                src={user.cover_photo}
                alt=""
                className="h-full w-full object-cover"
              />
            )}
          </div>

          {/* user info */}
          <UserProfileInfo
            user={user}
            posts={posts}
            profileId={profileId}
            setShowEdit={setShowEdit}
          />
        </div>

        {/* tabs */}
        <div className="mt-6">
          <div className="relative bg-white rounded-xl shadow p-1 flex max-w-md mx-auto overflow-hidden">
            <div
              className={`absolute top-1 left-0 h-[calc(100%-0.5rem)] w-1/3 bg-indigo-600 rounded-lg transition-all duration-300 ease-in-out transform ${
                activeTab === "Posts"
                  ? "translate-x-1"
                  : activeTab === "Media"
                  ? "translate-x-full"
                  : "translate-x-[198%]"
              }`}
            />

            {["Posts", "Media", "Likes"].map((tab) => (
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

          {/* posts */}
          {activeTab === "Posts" && (
            <div className="mt-6 flex flex-col items-center gap-6">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} activeLink={false} />
              ))}
            </div>
          )}

          {/* media */}
          {activeTab === "Media" && (
            <div className="grid custom-cols-connections gap-4 mt-6 mx-auto">
              {posts
                .filter((post) => post.image_urls.length > 0)
                .flatMap((post) =>
                  post.image_urls.map((image, index) => (
                    <Link
                      target="_blank"
                      to={image}
                      key={`${post._id}-${index}`}
                      className="relative group"
                    >
                      <img
                        src={image}
                        alt=""
                        className="w-full aspect-video object-cover rounded-md"
                      />
                      <p className="absolute bottom-0 right-0 text-xs p-1 px-3 backdrop-blur-xl text-white opacity-0 group-hover:opacity-100 transition duration-300">
                        Posted {moment(post.createdAt).fromNow()}
                      </p>
                    </Link>
                  ))
                )}
            </div>
          )}
        </div>
      </div>
      <div>
        {/* edit profile model */}
        {showEdit && <ProfileModel setShowEdit={setShowEdit} />}
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default Profile;
