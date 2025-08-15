import React, { useEffect, createContext, useRef } from "react";
import { Route, Routes } from "react-router-dom";
import { useUser, useAuth } from "@clerk/clerk-react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";

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

import { fetchUser } from "./features/userSlice";
import { fetchConnections } from "./features/connectionSlice";

// Create Socket.IO context
export const SocketContext = createContext();

const App = () => {
  const { getToken } = useAuth();
  const { isLoaded, user } = useUser();
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.user.loading);

  // Initialize socket only once using useRef
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io(import.meta.env.VITE_BASEURL);

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  // Fetch user data and connections when user is loaded
  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      const token = await getToken();
      dispatch(fetchUser(token));
      dispatch(fetchConnections(token));
    };

    fetchData();
  }, [user]);

  if (!isLoaded || loading || !socketRef.current) {
    return <Loading />;
  }

  return (
    <SocketContext.Provider value={socketRef.current}>
      <Toaster />
      <Routes>
        <Route path="/" element={!user ? <Login /> : <Layout />}>
          <Route index element={<Feed />} />
          <Route path="messages" element={<Messages />} />
          <Route path="messages/:userId" element={<ChatBox user={user} />} />
          <Route path="connections" element={<Connections />} />
          <Route path="discover" element={<Discover />} />
          <Route path="profile" element={<Profile />} />
          <Route path="profile/:profileId" element={<Profile />} />
          <Route path="Create-post" element={<CreatePost />} />
        </Route>
      </Routes>
    </SocketContext.Provider>
  );
};

export default App;
