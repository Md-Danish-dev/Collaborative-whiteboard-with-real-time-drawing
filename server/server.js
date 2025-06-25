// const express = require('express');
// const app = express();

// const server = require('http').createServer(app);
// const { Server } = require('socket.io');
// const { addUser, removeUser, getUser } = require('./utils/users');
// const cors = require('cors');

// app.use(cors());
// const io = new Server(server,{
//   cors:{
//     origin:"*", 
//     methods:["GET", "POST"],
//   },
// });
// // routes
// app.get("/", (req, res) => {
//     res.send("hello, server is running");
// });


// let globalRoomId,globalimgURL;
// io.on('connection', (socket) => {

//   socket.on("userJoined", (data) => {
//     const { userName, roomId, userId, host, presenter } = data;
//     globalRoomId = roomId;
//     socket.join(roomId);
//     const users =addUser({ userName, roomId, userId, host, presenter,socketId:socket.id });
//     socket.emit("userIsJoined",{success:true,users});
//     socket.broadcast.to(roomId).emit("userJoinedMessageBroadcasted",userName)
//     socket.broadcast.to(roomId).emit("allUsers",users);
//     socket.broadcast.to(roomId).emit("whiteboardResponse",{
//       imgURL: globalimgURL,
//     });
//   });

//   socket.on("whiteboardData",(data)=>{
//     globalimgURL=data;
//     socket.broadcast.to(globalRoomId).emit("whiteboardResponse",{
//       imgURL: data,
//     });
//   });

//   socket.on("disconnect", () => {
//     const user =getUser(socket.id);
//     if(user){
//       const removedUser= removeUser(socket.id);

//       socket.broadcast.to(globalRoomId).emit("userLeftMessageBroadcasted", user.userName);
//     }
//   });

// });

// const port=process.env.PORT || 5000;

// server.listen(port, () => {
//   console.log(`Server is running on port http://localhost:${port}`);
// });


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

// Routes
app.get("/", (req, res) => {
  res.send("Hello, server is running");
});

// Global state
let globalRoomId;
let globalimgURL = null;

io.on('connection', (socket) => {
  // ✅ User joins a room
  socket.on("userJoined", (data) => {
    const { userName, roomId, userId, host, presenter } = data;
    globalRoomId = roomId;
    socket.join(roomId);

    const users = addUser({ userName, roomId, userId, host, presenter, socketId: socket.id });

    socket.emit("userIsJoined", { success: true, users });
    socket.broadcast.to(roomId).emit("userJoinedMessageBroadcasted", userName);
    io.to(roomId).emit("allUsers", users); // send to all including sender

    // ✅ Send latest image to new joiners (viewers)
    if (globalimgURL) {
      socket.emit("whiteboardResponse", { imgURL: globalimgURL });
    }
  });

  // ✅ Receive latest whiteboard image from presenter and broadcast to viewers
  socket.on("whiteboardData", (imgURL) => {
    globalimgURL = imgURL;
    socket.broadcast.to(globalRoomId).emit("whiteboardResponse", { imgURL });
  });

  // ✅ Broadcast individual element to all other presenters
  socket.on("whiteboardElementFromClient", (element) => {
    socket.broadcast.to(globalRoomId).emit("whiteboardElementFromServer", element);
  });

  // ✅ Whiteboard full state update (for undo/redo)
  socket.on("whiteboardStateUpdate", ({ elements, history }) => {
    socket.broadcast.to(globalRoomId).emit("whiteboardStateFromServer", {
      elements,
      history
    });
  });

  // ✅ Handle chat message and emit to all in room (except sender)
  socket.on("message", (data) => {
    const { message } = data;
    const user = getUser(socket.id);
    if(user){
      // removeUser(socket.id);
      socket.broadcast;
      socket.broadcast.to(globalRoomId).emit("messageResponse", {
        message,
        userName: user.userName,
        });
    }
    // Broadcast to all others
  });

  // ✅ Handle user disconnect
  socket.on("disconnect", () => {
    const user = getUser(socket.id);
    if (user) {
      removeUser(socket.id);
      socket.broadcast.to(globalRoomId).emit("userLeftMessageBroadcasted", user.userName);

      // Optionally update user list
      // const users = getUsersInRoom(globalRoomId);
      // io.to(globalRoomId).emit("allUsers", users);
    }
  });
});

// Server port
const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
