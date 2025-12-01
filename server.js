// Simple Express backend for Rooted & Risen (development only)
const express = require("express");
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const cors = require("cors");

const DATA_FILE = path.join(__dirname, "posts.json");
const SECRET = process.env.RAR_SECRET || "dev-secret-change-me";
const DEMO_USER = { username: "talitha", password: "rise123" }; // change in production

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Ensure data file exists
if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, JSON.stringify({ posts: [] }, null, 2));

// Login (demo)
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  if (username === DEMO_USER.username && password === DEMO_USER.password) {
    const token = jwt.sign({ username }, SECRET, { expiresIn: "30d" });
    return res.json({ token });
  }
  res.status(401).json({ message: "Invalid credentials" });
});

// Get posts
app.get("/api/posts", (req, res) => {
  const data = JSON.parse(fs.readFileSync(DATA_FILE));
  res.json({ posts: data.posts });
});

// Create post (auth)
app.post("/api/posts", (req, res) => {
  const auth = req.headers.authorization || "";
  const token = auth.replace("Bearer ", "");
  try {
    jwt.verify(token, SECRET);
  } catch (e) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const data = JSON.parse(fs.readFileSync(DATA_FILE));
  const post = req.body;
  data.posts.push(post);
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  res.json({ post });
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log("Rooted & Risen backend listening on port", port));
