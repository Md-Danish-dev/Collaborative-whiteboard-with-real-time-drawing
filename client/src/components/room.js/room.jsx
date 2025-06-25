import React, { useEffect, useRef, useState } from "react";
import Canvas from "../canvas/canvas";
import { FaUser, FaTimes } from "react-icons/fa";
import Chat from "../chatbar/chatbar";

const Room = ({ user, socket, users }) => {
  const canvasRef = useRef(null);
  const ctx = useRef(null);
  const [color, setColor] = useState("#000000");
  const [elements, setElements] = useState([]);
  const [tool, setTool] = useState("pencil");
  const [history, setHistory] = useState([]);
  const [strokeWidth, setStrokeWidth] = useState(3);
  const sideBarRef = useRef(null);
  const [openedChatTab, setOpenedChatTab] = useState(false);

  const undo = () => {
    if (elements.length === 0) return;
    const newHistory = [...history, elements[elements.length - 1]];
    const newElements = elements.slice(0, -1);
    setHistory(newHistory);
    setElements(newElements);
    socket.emit("whiteboardStateUpdate", {
      elements: newElements,
      history: newHistory,
    });
  };

  const redo = () => {
    if (history.length === 0) return;
    const newElements = [...elements, history[history.length - 1]];
    const newHistory = history.slice(0, -1);
    setElements(newElements);
    setHistory(newHistory);
    socket.emit("whiteboardStateUpdate", {
      elements: newElements,
      history: newHistory,
    });
  };

  const clearCanvas = () => {
    setElements([]);
    setHistory([]);
    socket.emit("whiteboardStateUpdate", { elements: [], history: [] });
  };

  const saveCanvas = () => {
    const originalCanvas = canvasRef.current;
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = originalCanvas.width;
    tempCanvas.height = originalCanvas.height;
    const tempCtx = tempCanvas.getContext("2d");
    tempCtx.fillStyle = "white";
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
    tempCtx.drawImage(originalCanvas, 0, 0);
    const dataUrl = tempCanvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = "whiteboard.png";
    link.href = dataUrl;
    link.click();
  };

  const openSideBar = () => {
    if (sideBarRef.current) {
      sideBarRef.current.classList.remove("-translate-x-full");
    }
  };

  const closeSideBar = () => {
    if (sideBarRef.current) {
      sideBarRef.current.classList.add("-translate-x-full");
    }
  };

  useEffect(() => {
    if (user?.presenter) {
      socket.on("whiteboardElementFromServer", (element) => {
        setElements((prev) => [...prev, element]);
      });
    }

    socket.on("whiteboardStateFromServer", ({ elements, history }) => {
      setElements(elements);
      setHistory(history);
    });

    return () => {
      socket.off("whiteboardElementFromServer");
      socket.off("whiteboardStateFromServer");
    };
  }, [socket, user?.presenter]);

  return (
    <div className="bg-gradient-to-br from-black via-gray-900 to-gray-800 min-h-screen text-white w-full overflow-x-hidden overflow-y-hidden">
      <div className="flex flex-col items-center px-4 py-6">
        <div className="w-full flex flex-col sm:flex-row justify-between items-center mb-6 px-4">
          <button
            onClick={openSideBar}
            className="fixed top-4 left-2 z-50 bg-blue-600 hover:bg-gray-700 text-white px-4 py-2 rounded shadow flex items-center gap-2"
          >
            <FaUser className="h-5 w-5  text-white" />
            Users
          </button>
          <button
            onClick={() => setOpenedChatTab(true)}
            className="fixed top-4 left-30 z-50 bg-blue-600 hover:bg-gray-700 text-white px-4 py-2 rounded shadow flex items-center gap-2"
          >
            <FaUser className="h-5 w-5 text-white" />
            Chats
          </button>
          <div
            ref={sideBarRef}
            className="fixed top-0 left-0 h-full w-64 bg-gray-900 text-white shadow-lg transform -translate-x-full transition-transform duration-300 z-50"
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <h2 className="text-lg font-semibold">Participants</h2>
              <button onClick={closeSideBar}>
                <FaTimes className="h-5 w-5 text-white" />
              </button>
            </div>
            <div className="overflow-y-auto max-h-full p-4 space-y-2">
              {users?.map((usr, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-2 p-2 rounded ${
                    usr.userId === user?.userId ? "bg-blue-700" : "bg-gray-800"
                  }`}
                >
                  <FaUser className="h-5 w-5 text-white" />
                  <span className="text-sm">
                    {usr.userName} {usr.userId === user?.userId && "(You)"}
                  </span>
                </div>
              ))}
            </div>
          </div>
          {openedChatTab && (
            <Chat setOpenedChatTab={setOpenedChatTab} socket={socket} />
          )}

          <h1 className="text-3xl font-bold tracking-wide mt-7 left-1">
            Users Online: {users.length}
          </h1>

          {user && user.presenter && (
            <div className="flex flex-wrap items-center justify-center gap-4 mt-4 sm:mt-0">
              <label className="flex items-center gap-2">
                <span>Color:</span>
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-10 h-10 border-none rounded-full"
                />
              </label>

              <label className="flex items-center gap-2">
                <span>Size:</span>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={strokeWidth}
                  onChange={(e) => setStrokeWidth(Number(e.target.value))}
                  className="w-24 cursor-pointer accent-yellow-400"
                />
              </label>

              <select
                value={tool}
                onChange={(e) => setTool(e.target.value)}
                className="bg-white text-black px-4 py-2 rounded shadow-md"
              >
                <option value="pencil">✏️ Pencil</option>
                <option value="line">📏 Line</option>
                <option value="rect">▭ Rectangle</option>
                <option value="circle">⚪ Circle</option>
                <option value="eraser">🧽 Erase</option>
                <option value="text">🔤 Text</option>
              </select>

              <button
                onClick={undo}
                className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded shadow-md"
              >
                ↶ Undo
              </button>
              <button
                onClick={redo}
                className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded shadow-md"
              >
                ↷ Redo
              </button>
              <button
                onClick={clearCanvas}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded shadow-md"
              >
                🗑️ Clear
              </button>
              <button
                onClick={saveCanvas}
                className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded shadow-md"
              >
                💾 Save
              </button>
            </div>
          )}
        </div>

        <div className="w-full flex justify-center">
          <Canvas
            canvasRef={canvasRef}
            ctx={ctx}
            color={color}
            setElements={setElements}
            elements={elements}
            tool={tool}
            strokeWidth={strokeWidth}
            user={user}
            socket={socket}
          />
        </div>
        <p className="text-center text-md text-green-300 mt-2">
          Welcome to the collaborative whiteboard! Made with ❤️ by Md Danish.
        </p>
      </div>
    </div>
  );
};

export default Room;
