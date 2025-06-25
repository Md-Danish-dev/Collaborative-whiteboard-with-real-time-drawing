const express = require('express');
const app = express();
const server = require('http').createServer(app);
const { Server } = require('socket.io');
const cors = require('cors');
const { addUser, removeUser, getUser } = require('./utils/users');

app.use(cors());

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.get("/", (req, res) => {
  res.send("Hello, server is running");
});

let globalRoomId;
let globalimgURL = null;

io.on('connection', (socket) => {
  socket.on("userJoined", (data) => {
    const { userName, roomId, userId, host, presenter } = data;
    globalRoomId = roomId;
    socket.join(roomId);

    const users = addUser({ userName, roomId, userId, host, presenter, socketId: socket.id });

    socket.emit("userIsJoined", { success: true, users });
    socket.broadcast.to(roomId).emit("userJoinedMessageBroadcasted", userName);
    io.to(roomId).emit("allUsers", users); 
   
    if (globalimgURL) {
      socket.emit("whiteboardResponse", { imgURL: globalimgURL });
    }
  });

  
  socket.on("whiteboardData", (imgURL) => {
    globalimgURL = imgURL;
    socket.broadcast.to(globalRoomId).emit("whiteboardResponse", { imgURL });
  });

 
  socket.on("whiteboardElementFromClient", (element) => {
    socket.broadcast.to(globalRoomId).emit("whiteboardElementFromServer", element);
  });

  
  socket.on("whiteboardStateUpdate", ({ elements, history }) => {
    socket.broadcast.to(globalRoomId).emit("whiteboardStateFromServer", {
      elements,
      history
    });
  });

  
  socket.on("message", (data) => {
    const { message } = data;
    const user = getUser(socket.id);
    if(user){
  
      socket.broadcast;
      socket.broadcast.to(globalRoomId).emit("messageResponse", {
        message,
        userName: user.userName,
        });
    }
    
  });

 
  socket.on("disconnect", () => {
    const user = getUser(socket.id);
    if (user) {
      removeUser(socket.id);
      socket.broadcast.to(globalRoomId).emit("userLeftMessageBroadcasted", user.userName);

    }
  });
});

const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
