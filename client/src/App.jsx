import React, {
  useEffect,
  createContext,
  useRef,
  useMemo,
  Suspense,
  lazy,
  useState,
} from "react";
import { Route, Routes } from "react-router-dom";
import { useUser, useAuth } from "@clerk/clerk-react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";

import Login from "./pages/Login";
import Layout from "./pages/Layout";
import { Toaster } from "react-hot-toast";
import Loading from "./components/Loading";
import Feed from "./pages/Feed";

import { fetchUser } from "./features/userSlice";

const Messages = lazy(() => import("./pages/Messages"));
const ChatBox = lazy(() => import("./pages/ChatBox"));
const Connections = lazy(() => import("./pages/Connections"));
const Discover = lazy(() => import("./pages/Discover"));
const Profile = lazy(() => import("./pages/Profile"));
const CreatePost = lazy(() => import("./pages/CreatePost"));
const PostPage = lazy(() => import("./pages/PostPage"));

export const SocketContext = createContext();

const App = () => {
  const { getToken, isLoaded: authLoaded } = useAuth();
  const { isLoaded: userLoaded, user } = useUser();
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.user.loading);

  const socketRef = useRef(null);

  // Dynamic viewport height state
  const [appHeight, setAppHeight] = useState(window.innerHeight);

  useEffect(() => {
    const handleResize = () => setAppHeight(window.innerHeight);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!user || socketRef.current) return;

    socketRef.current = io(import.meta.env.VITE_BASEURL, {
      transports: ["websocket"],
    });

    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [user]);

  // Fetch user + connections
  useEffect(() => {
    if (!user) return;

    getToken().then((token) => {
      dispatch(fetchUser(token));

      setTimeout(() => {
        import("./features/connectionSlice").then(({ fetchConnections }) => {
          dispatch(fetchConnections(token));
        });
      }, 0);
    });
  }, [user, getToken, dispatch]);

  const socketValue = useMemo(() => socketRef.current, [socketRef.current]);

  if (!authLoaded || !userLoaded || loading) {
    return <Loading />;
  }

  if (!user) {
    return (
      <div style={{ height: appHeight }}>
        <Login />
      </div>
    );
  }

  return (
    <div style={{ height: appHeight }}>
      <SocketContext.Provider value={socketValue}>
        <Toaster />
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Feed />} />
              <Route path="messages" element={<Messages />} />
              <Route
                path="messages/:userId"
                element={<ChatBox user={user} />}
              />
              <Route path="connections" element={<Connections />} />
              <Route path="discover" element={<Discover />} />
              <Route path="profile" element={<Profile />} />
              <Route path="profile/:profileId" element={<Profile />} />
              <Route path="Create-post" element={<CreatePost />} />
              <Route path="post/:postId" element={<PostPage />} />
            </Route>
          </Routes>
        </Suspense>
      </SocketContext.Provider>
    </div>
  );
};

export default App;
