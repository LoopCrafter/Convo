import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [process.env.CLIENT_URL],
    credentials: true,
  },
});
const onlineUsers = new Map();
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  if (userId) {
    onlineUsers.set(userId, socket.id);
  }
  io.emit("online-users", Array.from(onlineUsers.keys()));

  socket.on("disconnect", () => {
    if (userId) {
      onlineUsers.delete(userId);
    }
    io.emit("online-users", Array.from(onlineUsers.keys()));
  });
});
export { app, server, io };
