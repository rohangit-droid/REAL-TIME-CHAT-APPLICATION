const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// ⬇️ In-memory message history
const messages = [];

io.on("connection", (socket) => {
  console.log("✅ New user connected");

  // Send previous messages to this new user
  socket.emit("chat_history", messages);

  // When a user sends a message
  socket.on("send_message", (data) => {
    messages.push(data);              // Save in server memory
    io.emit("receive_message", data); // Send to all users
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected");
  });
});

server.listen(3001, () => {
  console.log("🚀 Server running on port 3001");
});
