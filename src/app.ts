import express from "express";
const app = express();

app.get("/", async (req, res) => {
    res.send("Server working perfectly🙂")
})

export default app;
