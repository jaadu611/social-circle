import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { useUser, useAuth } from "@clerk/clerk-react";

import Login from "./pages/Login";
import Feed from "./pages/Feed";
import Messages from "./pages/Messages";
import ChatBox from "./pages/ChatBox";
import Connections from "./pages/Connections";
import Discover from "./pages/Discover";
import Profile from "./pages/Profile";
import CreatePost from "./pages/CreatePost";
import Layout from "./pages/Layout";
import { Toaster } from "react-hot-toast";
import Loading from "./components/Loading";

const App = () => {
  const { getToken } = useAuth();
  const { isLoaded, user } = useUser();

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const token = await getToken();

        const res = await fetch("http://localhost:3000/api/user/data", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        console.log("Backend Response:", data); // 🔍 Debug backend response
      }
    };

    fetchUserData();
  }, [user]);

  if (!isLoaded) {
    return <Loading />;
  }

  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/" element={!user ? <Login /> : <Layout />}>
          <Route index element={<Feed />} />
          <Route path="messages" element={<Messages />} />
          <Route path="messages/:userId" element={<ChatBox />} />
          <Route path="connections" element={<Connections />} />
          <Route path="discover" element={<Discover />} />
          <Route path="profile" element={<Profile />} />
          <Route path="profile/:profileId" element={<Profile />} />
          <Route path="Create-post" element={<CreatePost />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
