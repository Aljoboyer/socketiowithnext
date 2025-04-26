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
      const msgObj = {
        toUserId: id,     // Receiver's userId
        fromUserId: userData?.user_id,  // Sender's userId
        message: newMessage,
      }
      socket.emit("sendPrivateMessage", msgObj);
      const uiMsgObj = {
        to: id,     // Receiver's userId
        from: userData?.user_id,  // Sender's userId
        msg: newMessage,
      }
     setMessages((prev) => [...prev, uiMsgObj])
    };
   

    const selectedUserRef = useRef(id);

    useEffect(() => {
        if(id){
            selectedUserRef.current = id;
        }
    }, [id]);

    useEffect(() => {
        const handlePrivateMessage = (msg) => {
          const current = selectedUserRef.current;
          const isCurrentChat = msg.from === current || msg.to === current;
          console.log('Checking.... ===>', msg, current)
          if (isCurrentChat) {
            setMessages((prev) => [...prev, msg]);
          } else {
            // Optional: show notification for other chat
            console.log("📬 Message from another user, not shown in current chat.");
          }
        };
      
        socket.on("receivePrivateMessage", handlePrivateMessage);
      
        return () => {
          socket.off("receivePrivateMessage", handlePrivateMessage);
        };
      }, []);

  const fetchChat = async (e) => {
    const response = await fetch(
      `http://localhost:8000/api/v1/chat/get-one-to-one-chat?user1=${userData?.user_id}&user2=${id}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    
    // Parse response data
    const data = await response.json();
    
    // Handle response
    if (response.ok) {
      setMessages(data)
      // Do something with `data`, like updating state
    } else {
      console.error("Failed to fetch messages:", data?.error || response.statusText);
    }
    
  };

  useEffect(() => {
    if(id && userData?.user_id){
      fetchChat()
    }
  },[id, userData?.user_id])

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
                    item?.from === userData?.user_id
                      ? "bg-blue-500 text-white ml-auto"
                      : "bg-white border"
                  }`}
                >
                  <p>{item?.msg}</p>
                  <span className="block text-xs text-right text-gray-400 mt-1">
                    {item?.createdAt}
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
