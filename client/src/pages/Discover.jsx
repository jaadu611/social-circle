import React, { useState } from "react";
import { dummyConnectionsData } from "../assets/assets";
import { Search } from "lucide-react";
import UserCard from "../components/UserCard";
import Loading from "../components/Loading";

const Discover = () => {
  const [input, setInput] = useState("");
  const [users, setUsers] = useState(dummyConnectionsData);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    if (e.key === "Enter") {
      setUsers([]);
      setLoading(true);
      setTimeout(() => {
        setUsers(dummyConnectionsData);
        setLoading(false);
      }, 1000);
    }
  };

  return (
    <div className="h-screen bg-gradient-to-b from-slate-50 to-white flex flex-col">
      {/* Sticky Header + Search */}
      <div className="sticky top-0 z-10 border-b border-gray-200 px-4 py-6">
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
                placeholder="Search people by name, username, bio, or location..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyUp={handleSearch}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable User Section */}
      <div className="flex-1 overflow-y-auto px-4 py-6 no-scrollbar">
        {loading ? (
          <Loading height="60vh" />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {users.map((user) => (
              <UserCard key={user._id} user={user} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Discover;
