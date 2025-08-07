import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDb from "./configs/db.js";
import { inngest, functions } from "./inngest/index.js";
import { serve } from "inngest/express";
import { clerkMiddleware } from "@clerk/express";
import userRouter from "./routes/user.routes.js";

const app = express();

await connectDb();

app.use(clerkMiddleware());
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("got it");
});
app.use("/api/inngest", serve({ client: inngest, functions }));
app.use("/api/user", userRouter);

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
