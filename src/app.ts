import express from "express";
import { postRouter } from "./modules/post/post.routes";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import cors from "cors";
import { commentRouter } from "./modules/comments/comment.route";
const app = express();

app.use(
  cors({
    origin: process.env.APP_URL || "http://localhost:4000",
    credentials: true,
  })
);

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json());

//post router
app.use("/api/v1", postRouter);

//comment router
app.use("/api/v1", commentRouter);

app.get("/", async (req, res) => {
  res.send("Server working perfectly🙂");
});

export default app;
