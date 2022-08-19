const path = require("path");
const socketio = require("socket.io");
const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const serverSocket = socketio(server);
const formatMessage = require("./utils/messages");
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./utils/users");

app.use(express.static(path.join(__dirname, "./public")));

const port = process.env.PORT || 8000;

const userchat = "Mironshoh";

serverSocket.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    socket.emit("message", formatMessage(userchat, "Wellcome to ChatCord!"));
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(userchat, `${user.username} has joined  the chat`)
      );
    serverSocket.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  // console.log("New Ws Connection...");

  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);
    serverSocket
      .to(user.room)
      .emit("message", formatMessage(user.username, msg));
  });
  socket.on("disconnect", () => {
    const user = userLeave(socket.id);
    if (user) {
      serverSocket
        .to(user.room)
        .emit(
          "message",
          formatMessage(userchat, `${user.username}  has left  the chat`)
        );
    }
  });
});

server.listen(port, () => {
  console.log(`app is listened by ${port} port`);
});
