const express = require('express');
const dotenv = require('dotenv');
const http = require('http');
const connectDB = require('./config/db.js');
const userRouter = require('./routes/user.js');
const chatRouter = require('./routes/chat.js');
const { notFound, errorHandler } = require('./Error/error.js');
const cors = require('cors');
const { Server } = require('socket.io');

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true
  }
});

const userSocketMap = {};
global.userSocketMap = userSocketMap; 

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log("User connected:", userId);

  if (userId) userSocketMap[userId] = socket.id;
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("User disconnected:", userId);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

global.io = io;

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use('/api/user', userRouter);
app.use('/api/chat', chatRouter);

app.use(notFound);
app.use(errorHandler);

if(process.env.NODE_ENV !== "production"){
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server is running`);
});
}

exports.default = server;