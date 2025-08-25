import React, {
  useEffect,
  createContext,
  useRef,
  useMemo,
  useState,
  Suspense,
  lazy,
} from "react";
import { Route, Routes } from "react-router-dom";
import { useUser, useAuth } from "@clerk/clerk-react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";

import Login from "./pages/Login";
import Layout from "./pages/Layout";
import { Toaster } from "react-hot-toast";
import Loading from "./components/Loading";

import { fetchUser } from "./features/userSlice";

// Lazy-load non-critical pages
const Feed = lazy(() => import("./pages/Feed"));
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
  const [socketConnected, setSocketConnected] = useState(false);

  // Lazy-init socket only after user logs in and feed is loaded
  useEffect(() => {
    if (!user || socketRef.current || !socketConnected) return;

    socketRef.current = io(import.meta.env.VITE_BASEURL);

    socketRef.current.on("connect", () => {
      console.log(`User connected with socket id: ${socketRef.current.id}`);
      setSocketConnected(true);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [user, socketConnected]);

  // Fetch only critical user data first
  useEffect(() => {
    if (!user) return;

    getToken().then((token) => {
      dispatch(fetchUser(token)); // critical
      // Lazy-load other data after initial render
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
    return <Login />;
  }

  return (
    <SocketContext.Provider value={socketValue}>
      <Toaster />
      <Suspense fallback={<Loading />}>
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
            <Route path="post/:postId" element={<PostPage />} />
          </Route>
        </Routes>
      </Suspense>
    </SocketContext.Provider>
  );
};

export default App;
