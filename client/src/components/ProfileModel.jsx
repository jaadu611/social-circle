import React, { use, useState } from "react";
import { Pencil } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../features/userSlice";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";

const ProfileModel = ({ setShowEdit }) => {
  const dispatch = useDispatch();
  const { getToken } = useAuth();

  const user = useSelector((state) => state.user.value);

  const [editForm, setEditForm] = useState({
    username: user.username,
    bio: user.bio,
    location: user.location,
    profile_picture: null,
    cover_photo: null,
    full_name: user.full_name,
  });

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      const userData = new FormData();
      const {
        username,
        full_name,
        bio,
        location,
        profile_picture,
        cover_photo,
      } = editForm;

      userData.append("username", username);
      userData.append("full_name", full_name);
      userData.append("bio", bio);
      userData.append("location", location);

      if (profile_picture) userData.append("profile_picture", profile_picture);
      if (cover_photo) userData.append("cover_photo", cover_photo);

      const token = await getToken();
      dispatch(updateUser({ userData, token }));
      setShowEdit(false);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] overflow-y-auto bg-black/50 px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-xl p-6 relative transform-gpu transition-all duration-300 ease-in-out">
        <div className="relative w-full h-48 overflow-hidden rounded-lg group">
          <input
            type="file"
            accept="image/*"
            id="cover_photo"
            hidden
            onChange={(e) => {
              setEditForm({
                ...editForm,
                cover_photo: e.target.files[0],
              });
            }}
          />

          <label
            htmlFor="cover_photo"
            className="relative w-full h-full cursor-pointer"
          >
            {!user.cover_photo && !editForm.cover_photo && (
              <div className="w-full h-full bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200" />
            )}

            {(user.cover_photo || editForm.cover_photo) && (
              <img
                src={
                  editForm.cover_photo
                    ? URL.createObjectURL(editForm.cover_photo)
                    : user.cover_photo
                }
                alt="Cover"
                className="w-full h-full object-cover"
              />
            )}

            <div className="absolute inset-0 hidden group-hover:flex items-center justify-center bg-black/20">
              <Pencil className="w-5 h-5 text-white" />
            </div>
          </label>
        </div>

        <div className="-mt-12 mb-4 w-full flex justify-center">
          <div className="relative group">
            <input
              type="file"
              accept="image/*"
              id="profile_picture"
              hidden
              onChange={(e) => {
                setEditForm({
                  ...editForm,
                  profile_picture: e.target.files[0],
                });
              }}
            />
            <label htmlFor="profile_picture">
              <img
                src={
                  editForm.profile_picture
                    ? URL.createObjectURL(editForm.profile_picture)
                    : user.profile_picture
                }
                alt="Profile"
                className="w-40 h-40 rounded-full border-4 border-white object-cover"
              />
              <div className="absolute inset-0 hidden cursor-pointer group-hover:flex items-center justify-center bg-black/20 rounded-full">
                <Pencil className="w-5 h-5 text-white" />
              </div>
            </label>
          </div>
        </div>

        <h1 className="text-center text-2xl font-semibold text-gray-800">
          Edit Profile
        </h1>

        <form
          className="space-y-4"
          onSubmit={(e) =>
            toast.promise(handleSaveProfile(e), {
              loading: "Saving...",
              success: "Profile updated!",
              error: "Failed to update profile.",
            })
          }
        >
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                Full Name
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                placeholder="Enter your full name"
                value={editForm.full_name}
                onChange={(e) =>
                  setEditForm({ ...editForm, full_name: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                Username
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                placeholder="Enter your username"
                value={editForm.username}
                onChange={(e) =>
                  setEditForm({ ...editForm, username: e.target.value })
                }
              />
            </div>

            <div>
              <label className="flex items-center justify-between text-sm font-medium text-gray-800 mb-2">
                Bio
                <span className="text-xs relative text-gray-500 top-2">
                  {editForm.bio.replace(/\r\n|\r/g, "\n").length}/160
                </span>
              </label>

              <textarea
                rows={3}
                maxLength={160}
                className="w-full resize-none px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition no-scrollbar placeholder-gray-400"
                placeholder="Write something about yourself"
                value={editForm.bio}
                onChange={(e) =>
                  setEditForm({ ...editForm, bio: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                Location
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                placeholder="Where do you live?"
                value={editForm.location}
                onChange={(e) =>
                  setEditForm({ ...editForm, location: e.target.value })
                }
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 gap-3">
            <button
              type="button"
              onClick={() => setShowEdit(false)}
              className="px-6 py-2 bg-red-500 cursor-pointer text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-colors cursor-pointer"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileModel;
