import React, { use, useEffect, useState } from "react";
import "./App.css";
import JoinCreateRoom from "./components/JoinCreateRoom/JoinCreateRoom";
import { Route, Router, Routes } from "react-router-dom";
import Room from "./components/room.js/room";
import io from "socket.io-client";
import { toast, ToastContainer } from "react-toastify";

// const serverUrl = 'http://localhost:5000';
const connectionOption = {
  "force new connection": true,
  reconnectionAttempts: "Infinity",
  timeout: 10000,
  transports: ["websocket"],
};

const socket = io(import.meta.env.VITE_BACKEND_URL, connectionOption);

const App = () => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    socket.on("userIsJoined", (data) => {
      if (data.success) {
        console.log("User joined successfully");
        setUsers(data.users);
      } else {
        console.error("Failed to join user");
      }
    });
    socket.on("allUsers", (data) => {
      setUsers(data);
    });
    socket.on("userJoinedMessageBroadcasted", (data) => {
      console.log(`${data} has joined the room`);
      toast.info(`${data} has joined the room`);
    });

    socket.on("userLeftMessageBroadcasted", (data) => {
      console.log(`${data} has left the room`);
      toast.info(`${data} has left the room`);
    });
  }, []);

  return (
    <>
      <ToastContainer />
      <Routes>
        <Route
          path="/"
          element={<JoinCreateRoom socket={socket} setUser={setUser} />}
        />
        <Route
          path="/room/:roomId"
          element={<Room user={user} socket={socket} users={users} />}
        />
      </Routes>
    </>
  );
};

export default App;
