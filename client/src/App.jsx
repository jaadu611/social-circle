import React, { useEffect, createContext, useRef, useMemo } from "react";
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

export const SocketContext = createContext();

const App = () => {
  const { getToken, isLoaded: authLoaded } = useAuth();
  const { isLoaded: userLoaded, user } = useUser();
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.user.loading);

  const socketRef = useRef(null);

  // Initialize socket after user exists
  useEffect(() => {
    if (!user || socketRef.current) return;

    socketRef.current = io(import.meta.env.VITE_BASEURL);

    return () => {
      socketRef.current?.disconnect();
    };
  }, [user]);

  // Fetch user and connections
  useEffect(() => {
    if (!user) return;

    getToken().then((token) => {
      dispatch(fetchUser(token));
      dispatch(fetchConnections(token));
    });
  }, [user, getToken, dispatch]);

  // Memoize socket context (always called, never conditionally)
  const socketValue = useMemo(() => socketRef.current, [socketRef.current]);

  // Conditional rendering after hooks
  if (!authLoaded || !userLoaded || loading) {
    return <Loading />;
  }

  if (!user) {
    return <Login />;
  }

  return (
    <SocketContext.Provider value={socketValue}>
      <Toaster />
      <Routes>
        <Route path="/" element={<Layout />}>
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
