import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

import { createServer } from "http";
import { Server } from "socket.io";
import connectDB from './db/index.js';
import { app } from './app.js';

const port = process.env.PORT || 8000;

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: process.env.CORS_ORIGIN, credentials: true }
});

const onlineUsers = new Map();

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log(userId,"userId socket connection");
  
  if (userId) {
    onlineUsers.set(userId, socket.id);
    console.log(`User connected: ${userId}`);
    console.log("Online users:", [...onlineUsers]); // ✅ debug
  }

  socket.on("disconnect", () => {                  // ✅ missing disconnect handler added
    onlineUsers.delete(userId);
    console.log(`User disconnected: ${userId}`);
  });
});

export { io, onlineUsers };

connectDB()
  .then(() => {
    httpServer.listen(port, () => {
      console.log(`Server is running on ${port}`);
    });
  })
  .catch((err) => {
    console.log("MongoDb connection error: ", err);
  });