"use client";
import { useState } from "react";

const mockUsers = [
  { id: 1, name: "Alice", lastMessage: "Hi, how are you?" },
  { id: 2, name: "Bob", lastMessage: "Check this out!" },
  { id: 3, name: "Charlie", lastMessage: "Long time no see!" },
];

const mockMessages = [
  { id: 1, from: "Alice", text: "Hi!", time: "10:00 AM" },
  { id: 2, from: "me", text: "Hello Alice!", time: "10:01 AM" },
];

export default function ChatPage() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState(mockMessages);
  const [newMessage, setNewMessage] = useState("");

  const handleSend = () => {
    if (newMessage.trim() !== "") {
      setMessages([...messages, { id: Date.now(), from: "me", text: newMessage, time: "Now" }]);
      setNewMessage("");
    }
  };

  return (
    <div className="flex h-full">
      {/* Chat List */}
      <div className="w-1/3 border-r border-gray-300 p-4 overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Messages</h2>
        <ul className="space-y-2">
          {mockUsers.map((user) => (
            <li
              key={user.id}
              onClick={() => {
                setSelectedUser(user);
                setMessages(mockMessages); // Reset with dummy messages
              }}
              className={`cursor-pointer p-3 rounded-lg ${
                selectedUser?.id === user.id
                  ? "bg-blue-100"
                  : "hover:bg-gray-100"
              }`}
            >
              <h3 className="font-medium">{user.name}</h3>
              <p className="text-sm text-gray-500 truncate">{user.lastMessage}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Chat Inbox */}
      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b bg-white">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-300 rounded-full flex items-center justify-center text-white font-bold uppercase">
                  {selectedUser.name[0]}
                </div>
                <h2 className="text-lg font-semibold">{selectedUser.name}</h2>
              </div>
            </div>

            {/* Message List */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`mb-3 max-w-xs px-4 py-2 rounded-lg ${
                    msg.from === "me"
                      ? "bg-blue-500 text-white ml-auto"
                      : "bg-white border"
                  }`}
                >
                  <p>{msg.text}</p>
                  <span className="block text-xs text-right text-gray-400 mt-1">
                    {msg.time}
                  </span>
                </div>
              ))}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t bg-white">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />
                <button
                  onClick={handleSend}
                  className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition"
                >
                  Send
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400 text-lg">
            No message selected
          </div>
        )}
      </div>
    </div>
  );
}
