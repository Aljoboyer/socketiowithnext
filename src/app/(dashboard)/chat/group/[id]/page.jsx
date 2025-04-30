"use client"

import { getSocket } from '@/utils/socket';
import { useParams } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react'

export default function page() {
  const params = useParams();
  const id = params.id;
    
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  
  const [userData, setUserData] = useState(null);

  const socket = getSocket();

  useEffect(() => {
    // Only runs on the client
    const storedUserData = localStorage.getItem("userdata");
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }
  }, []);

    const handleSend = () => {
      socket.emit("group-message", {
        groupId: id,
        sender: userData?.user_id,
        message: newMessage
      });
    };
   
    const selectedUserRef = useRef(id);

    useEffect(() => {
        if(id){
            selectedUserRef.current = id;
            socket.emit("join-group", {groupId: id });
        }
    }, [id]);

    useEffect(() => {
        const handlePrivateMessage = (msg) => {
          const current = selectedUserRef.current;
          const isCurrentChat = msg.from === current || msg.to === current;
         
          if (isCurrentChat) {
            setMessages((prev) => [...prev, msg]);
          } else {
            // Optional: show notification for other chat
            console.log("📬 Message from another user, not shown in current chat.");
          }
        };
      
        socket.on("group-message", handlePrivateMessage);
      
        return () => {
          socket.off("group-message", handlePrivateMessage);
        };
      }, []);

  useEffect(() => {
    const handlePrivateMessage = (msg) => {
      const current = selectedUserRef.current;
     
      if (current == msg.groupId) {
        setMessages((prev) => [...prev, msg]);
      } else {
        // Optional: show notification for other chat
        console.log("📬 Message from another user, not shown in current chat.");
      }
    };
  
    socket.on("group-message", handlePrivateMessage);
  
    return () => {
      socket.off("group-message", handlePrivateMessage);
    };

  },[])
  return (
   <>
   {/* Header */}
   <div className="flex items-center justify-between px-4 py-3 border-b bg-white">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-300 rounded-full flex items-center justify-center text-white font-bold uppercase">
                  {/* {selectedUser.name[0]} */} M
                </div>
                <h2 className="text-lg font-semibold">{id}</h2>
              </div>
            </div>
    {/* Message List */}
    <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              {messages.map((item, index) => (
                <div
                  key={index}
                  className={`mb-3 max-w-xs px-4 py-2 rounded-lg ${
                    item?.sender === userData?.user_id
                      ? "bg-blue-500 text-white ml-auto"
                      : "bg-white border"
                  }`}
                >
                  <p
                  className="font-bold text-green-600 "
                  >{item?.sender !== userData?.user_id ? item?.sender : ''}</p>
                  <p>{item?.message}</p>
                  <span className="block text-xs text-right text-gray-400 mt-1">
                    {item?.timestamp}
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
  )
}
