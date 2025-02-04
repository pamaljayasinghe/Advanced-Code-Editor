const express = require("express");
const cors = require("cors");
const { Server } = require("socket.io");
const http = require("http");
const { exec } = require("child_process");
const fs = require("fs").promises;
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mysql = require("mysql2/promise");
require("dotenv").config();

const app = express();
const server = http.createServer(app);

// Create Socket.IO server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

// Create temp directory for code execution
const tempDir = path.join(__dirname, "temp");
fs.mkdir(tempDir, { recursive: true }).catch(console.error);

// Database connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "code_editor",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Auth Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  jwt.verify(
    token,
    process.env.JWT_SECRET || "your-secret-key",
    (err, user) => {
      if (err) {
        return res.status(403).json({ message: "Invalid token" });
      }
      req.user = user;
      next();
    }
  );
};

// Auth Routes
app.post("/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const connection = await pool.getConnection();

    try {
      // Check if user exists
      const [existingUsers] = await connection.query(
        "SELECT * FROM users WHERE email = ?",
        [email]
      );

      if (existingUsers.length > 0) {
        return res.status(400).json({ message: "Email already registered" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert user
      const [result] = await connection.query(
        "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
        [name, email, hashedPassword]
      );

      const token = jwt.sign(
        { id: result.insertId, email },
        process.env.JWT_SECRET || "your-secret-key",
        { expiresIn: "24h" }
      );

      res.status(201).json({
        token,
        user: {
          id: result.insertId,
          name,
          email,
        },
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Error registering user" });
  }
});

app.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const connection = await pool.getConnection();

    try {
      const [users] = await connection.query(
        "SELECT * FROM users WHERE email = ?",
        [email]
      );

      if (users.length === 0) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const user = users[0];
      const validPassword = await bcrypt.compare(password, user.password);

      if (!validPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET || "your-secret-key",
        { expiresIn: "24h" }
      );

      res.json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Error logging in" });
  }
});

// Code Execution Function
async function executeCode(code, language) {
  const timestamp = Date.now();
  let filename, command;

  switch (language.toLowerCase()) {
    case "javascript":
      filename = `code_${timestamp}.js`;
      command = `node ${filename}`;
      break;
    case "python":
      filename = `code_${timestamp}.py`;
      command = `python3 ${filename}`;
      break;
    case "java":
      filename = "Main.java";
      command = `javac ${filename} && java Main`;
      break;
    case "cpp":
      filename = `code_${timestamp}.cpp`;
      const executableName =
        process.platform === "win32" ? "program.exe" : "program";
      command = `g++ ${filename} -o ${executableName} && ./${executableName}`;
      break;
    default:
      throw new Error("Unsupported language");
  }

  const filePath = path.join(tempDir, filename);

  try {
    await fs.mkdir(tempDir, { recursive: true });
    await fs.writeFile(filePath, code);

    return new Promise((resolve, reject) => {
      exec(
        command,
        { cwd: tempDir, timeout: 10000, maxBuffer: 1024 * 1024 },
        async (error, stdout, stderr) => {
          try {
            await fs.unlink(filePath).catch(console.error);
            if (language.toLowerCase() === "java") {
              await fs
                .unlink(path.join(tempDir, "Main.class"))
                .catch(console.error);
            }
          } catch (cleanupError) {
            console.error("Cleanup error:", cleanupError);
          }

          if (error && !stdout) {
            resolve(stderr || error.message);
          } else {
            resolve(stdout || stderr);
          }
        }
      );
    });
  } catch (error) {
    console.error("Execution error:", error);
    return error.message;
  }
}

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log("Client connected");

  socket.on("userJoined", (user) => {
    socket.user = user;
    const users = Array.from(io.sockets.sockets.values())
      .filter((s) => s.user)
      .map((s) => s.user);
    io.emit("users", users);
  });

  socket.on("runCode", async ({ code, language }) => {
    try {
      const output = await executeCode(code, language);
      socket.emit("runResult", { output });
    } catch (error) {
      socket.emit("runResult", { output: error.message });
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
    const users = Array.from(io.sockets.sockets.values())
      .filter((s) => s.user)
      .map((s) => s.user);
    io.emit("users", users);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
