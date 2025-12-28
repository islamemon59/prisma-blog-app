import express from "express";
import { postRouter } from "./modules/post/post.routes";
const app = express();

app.use(express.json());

app.use("/posts", postRouter);

app.get("/", async (req, res) => {
    res.send("Server working perfectly🙂")
})

export default app;
