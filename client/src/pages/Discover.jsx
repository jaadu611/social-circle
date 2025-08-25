import React, { useState, useMemo, useEffect } from "react";
import { Search } from "lucide-react";
import UserCard from "../components/UserCard";
import Loading from "../components/Loading";
import api from "../api/axios";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";

const Discover = () => {
  const [input, setInput] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const { getToken, isLoaded } = useAuth();

  useEffect(() => {
    if (!isLoaded || !input.trim()) {
      setUsers([]);
      return;
    }

    const fetchUsers = async () => {
      try {
        setLoading(true);
        const token = await getToken();
        const { data } = await api.post(
          "/api/user/discover",
          { input },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (data.success) setUsers(data.users);
        else toast.error(data.message || "Failed to fetch users");
      } catch (error) {
        toast.error(error.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [input, getToken, isLoaded]);

  // Memoize users grid
  const usersGrid = useMemo(() => {
    if (users.length === 0 && input.trim() !== "" && !loading) {
      return (
        <p className="text-center text-gray-500 col-span-full">
          No users found starting with "{input}"
        </p>
      );
    }
    return users.map((user) => (
      <UserCard key={user._id} user={user} loading="lazy" />
    ));
  }, [users, input, loading]);

  if (!isLoaded) return <Loading height="60vh" />;

  return (
    <div className="h-screen bg-gradient-to-b from-slate-50 to-white flex flex-col">
      <div className="sticky top-0 z-10 border-b border-gray-200 px-4 py-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-4">
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-1">
              Discover People
            </h1>
            <p className="text-slate-600 text-sm sm:text-base">
              Connect with amazing people and grow your network
            </p>
          </div>
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search people by name..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6">
        {input.length > 0 ? (
          loading ? (
            <Loading height="60vh" />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto transition-all duration-300">
              {usersGrid}
            </div>
          )
        ) : (
          <p className="text-center text-gray-400 text-sm sm:text-base mt-12">
            Start typing to search for your friends
          </p>
        )}
      </div>
    </div>
  );
};

export default Discover;
