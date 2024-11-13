const express = require("express");
const path = require("path");
const postRouter = require("./routes/postRouter");
const authRouter = require("./routes/authRouter");
const cors = require("cors");
const app = express();

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.json());
app.use(cors());

app.use("/api/v1/posts", postRouter);
app.use("/api/v1/", authRouter);

module.exports = app;
