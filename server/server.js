import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDb from "./configs/db.js";
import { inngest, functions } from "./inngest/index.js";
import { serve } from "inngest/express";
import { clerkMiddleware } from "@clerk/express";
import userRouter from "./routes/user.routes.js";
import postsRouter from "./routes/posts.routes.js";
import storyRouter from "./routes/story.routes.js";
import messageRoutes from "./routes/message.routes.js";
import http from "http";
import { initializeSocket } from "./configs/socket/index.js";

const app = express();
await connectDb();

app.use(clerkMiddleware());
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => res.send("got it"));

app.use("/api/inngest", serve({ client: inngest, functions }));
app.use("/api/user", userRouter);
app.use("/api/post", postsRouter);
app.use("/api/story", storyRouter);
app.use("/api/message", messageRoutes);

const server = http.createServer(app);
const io = initializeSocket(server);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export { io };
