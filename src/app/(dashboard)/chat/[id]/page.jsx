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
  const [showTyping, setShowTyping] = useState(false)
  
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
    const personalIdRef = useRef(userData);

    useEffect(() => {
        if(id){
            selectedUserRef.current = id;
        }
        
    }, [id]);

    useEffect(() => {
        const handlePrivateMessage = (msg) => {
          const current = selectedUserRef.current;
          const isCurrentChat = msg.from === current || msg.to === current;
         
          if (isCurrentChat) {
            setMessages((prev) => [...prev, msg]);
          } else {
            
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
      personalIdRef.current = userData?.user_id
    }
  },[id, userData?.user_id])

  useEffect(() => {
    const handlePrivateTyping = (data) => {
      const current = selectedUserRef.current;
      if (data.fromUserId == current) {
        setShowTyping(true)
      } 
    };
    const handlePrivateTypingOff = (data) => {
      const current = selectedUserRef.current;
      if (data.fromUserId == current) {
        setShowTyping(false)
      } 
    };
    socket.on("typingstatuson", handlePrivateTyping);
    socket.on("typingstatusoff", handlePrivateTypingOff);

    return () => {
      socket.off('typingstatuson');
      socket.off('typingstatusoff');
    }

  },[])

  const onChangeHandler = (value) => {
    setNewMessage(value)
    const typObj = {fromUserId: userData?.user_id, toUserId: id}

    socket.emit("typingon", typObj)
  }

  const onBlurHandler = () => {
    const typObj = {fromUserId: userData?.user_id, toUserId: id}

    socket.emit("typingoff", typObj)
  }
  
  useEffect(() => {
    if(personalIdRef.current && selectedUserRef.current){
      socket.emit("messageSeen", { fromUserId: personalIdRef.current, toUserId: selectedUserRef.current});
    }
  }, [personalIdRef.current,selectedUserRef.current]); 

  const [messageStatus, setMessageStatus] = useState('')
  
  useEffect(() => {
    socket.on("messageDelivered", (data) => {
      // console.log('checked', data)
      setMessageStatus("delivered")
    });
    
    socket.on("messageSeenReceived", (data) => {
      console.log('checked 222', data)

      setMessageStatus("seen")
    });
    
    return () => {
      socket.off("messageDelivered")
      socket.off("messageSeenReceived")
    }
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
              {messageStatus === "seen" && <span>✔✔ Seen</span>}
              {messageStatus === "delivered" && <span>✔✔ Delivered</span>}
              {/* {messageStatus === "sent" && <span>✔ Sent</span>} */}

            </div>
              {showTyping && <p className='p-4 font-medium text-blue-500'>Typing...</p>}
            {/* Input Area */}
            <div className="p-4 border-t bg-white">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Type your message..."
                  value={newMessage}
                  onBlur={onBlurHandler}
                  onChange={(e) => {
                    onChangeHandler(e.target.value)
                  }}
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
