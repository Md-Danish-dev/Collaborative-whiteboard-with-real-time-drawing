import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";

const JoinCreateRoom = ({ socket, setUser }) => {
  const [roomId, setRoomId] = useState(uuidv4());
  const [userName, setUserName] = useState("");
  const [copied, setCopied] = useState(false);
  const [generateUId, setGenerateUId] = useState(false);
  const [accessType, setAccessType] = useState(""); // Edit/View access to share with friends

  const [joinRoomId, setJoinRoomId] = useState("");
  const [joinUserName, setJoinUserName] = useState("");

  const navigate = useNavigate();

  const CopyGeneratedRoomId = () => {
    navigator.clipboard.writeText(roomId);
    setCopied(true);
    setTimeout(() => setCopied(false), 600);
  };

  const handleCreateRoom = (e) => {
    e.preventDefault();
    if (!userName || accessType === "") {
      alert(
        "Please enter your name and select one access type for friends (Edit/View)"
      );
      return;
    }

    const roomData = {
      userName,
      roomId,
      userId: uuidv4(),
      host: true,
      presenter: true,
      friendsAccess: accessType,
    };

    localStorage.setItem(`access-${roomId}`, accessType);

    setUser(roomData);
    socket.emit("userJoined", roomData);
    navigate(`/room/${roomId}`);
  };

  const handleJoinRoom = (e) => {
    e.preventDefault();
    if (!joinUserName || !joinRoomId) {
      alert("Please enter your name and room ID");
      return;
    }

    const access = localStorage.getItem(`access-${joinRoomId}`);
    if (!access) {
      alert("This room does not exist or access information is not available.");
      return;
    }

    const roomData = {
      userName: joinUserName,
      roomId: joinRoomId,
      userId: uuidv4(),
      host: false,
      presenter: access === "edit",
    };

    setUser(roomData);
    socket.emit("userJoined", roomData);
    navigate(`/room/${joinRoomId}`);
  };

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white flex flex-col items-center justify-center py-10">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-12 tracking-wide px-4">
        Welcome to the Realtime Whiteboard App
      </h1>

      <div className="w-screen grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 px-4 md:px-8">
        <div className="bg-[#1e293b] border border-blue-500 rounded-xl shadow-xl p-8 w-full">
          <h2 className="text-2xl font-semibold text-center text-blue-400 mb-6">
            Create Room
          </h2>
          <form>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Enter Your Name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-col gap-2 mb-4">
              <p className="text-sm text-gray-300">
                Choose the access type for others:
              </p>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="access"
                  value="edit"
                  checked={accessType === "edit"}
                  onChange={(e) => setAccessType(e.target.value)}
                />
                <span>Allow Friends to Edit</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="access"
                  value="view"
                  checked={accessType === "view"}
                  onChange={(e) => setAccessType(e.target.value)}
                />
                <span>Allow Friends to View Only</span>
              </label>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              <input
                type="text"
                value={roomId}
                readOnly
                className="flex-1 min-w-[150px] px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded"
              />
              <button
                type="button"
                onClick={() => {
                  setRoomId(uuidv4());
                  setGenerateUId(true);
                  setTimeout(() => setGenerateUId(false), 600);
                }}
                className={`px-4 py-2 bg-blue-600 hover:bg-blue-700 text-sm rounded cursor-pointer ${
                  generateUId ? "text-green-400 font-semibold" : "text-white"
                }`}
              >
                {generateUId ? "Generated!" : "Generate"}
              </button>
              <button
                type="button"
                onClick={CopyGeneratedRoomId}
                className={`px-4 py-2 bg-gray-700 hover:bg-gray-600  text-sm rounded cursor-pointer ${
                  copied ? "text-green-400 font-semibold" : "text-white"
                }`}
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <button
              type="submit"
              onClick={handleCreateRoom}
              className="w-full bg-white text-blue-400 font-semibold py-2 rounded hover:bg-gray-200 transition-all cursor-pointer"
            >
              Create Room
            </button>
          </form>
        </div>

        {/* Join Room */}
        <div className="bg-[#0f172a] border border-green-500 rounded-xl shadow-xl p-8 w-full">
          <h2 className="text-2xl font-semibold text-center text-green-400 mb-6">
            Join Room
          </h2>
          <form>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Your Name"
                value={joinUserName}
                onChange={(e) => setJoinUserName(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="mb-6">
              <input
                type="text"
                placeholder="Room ID"
                value={joinRoomId}
                onChange={(e) => setJoinRoomId(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <button
              type="submit"
              onClick={handleJoinRoom}
              className="w-full bg-white text-green-400 font-semibold py-2 rounded hover:bg-gray-200 transition-all cursor-pointer"
            >
              Join Room
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JoinCreateRoom;
