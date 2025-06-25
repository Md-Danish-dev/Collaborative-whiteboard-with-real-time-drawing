import React, { useEffect, useState } from 'react';
import { FaPaperPlane, FaTimes } from "react-icons/fa";

const Chat = ({ setOpenedChatTab, socket, user }) => {
  const [chat, setChat] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    socket.on("messageResponse", (data) => {
      setChat(prev => [...prev, data]);
    });

  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() !== "") {
        setChat(prev => [...prev, { message, userName: "You" }]);
        socket.emit("message", {
          message 
        });
    }
    setMessage("");
  };

  return (
    <div className="fixed top-0 right-0 h-full w-[26rem] bg-gray-900 text-white shadow-lg z-50 transition-transform transform translate-x-0 rounded-l-xl">
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <h2 className="text-lg font-semibold">Chats</h2>
        <button
          type="button"
          onClick={() => setOpenedChatTab(false)}
          className="focus:outline-none"
        >
          <FaTimes className="h-5 w-5 text-white" />
        </button>
      </div>

      <div className="overflow-y-auto p-4 space-y-3 mb-20 h-[calc(100%-144px)]">
        {chat.length === 0 ? (
          <p className="text-gray-400 text-sm">No messages yet.</p>
        ) : (
          chat.map((msg, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg max-w-[75%] ${
                msg.userName === "You"
                  ? "ml-auto bg-blue-600 text-white"
                  : "mr-auto bg-gray-800"
              }`}
            >
              <p className="text-xs font-semibold mb-1">{msg.userName}</p>
              <p className="text-sm">{msg.message}</p>
            </div>
          ))
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 absolute bottom-0 w-full p-4 border-t border-gray-700 bg-gray-900"
      >
        <input
          type="text"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 px-3 py-2 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
        >
          <FaPaperPlane />
        </button>
      </form>
    </div>
  );
};

export default Chat;
