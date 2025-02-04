const express = require("express");
const http = require("http");
const cors = require("cors");
const initializeSocket = require("./socket");
const authRoutes = require("./routes/auth");
const filesRoutes = require("./routes/files");
require("dotenv").config();

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

// Initialize Socket.IO
const io = initializeSocket(server);

// Routes
app.use("/auth", authRoutes);
app.use("/files", filesRoutes);

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
