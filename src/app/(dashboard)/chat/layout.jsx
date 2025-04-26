"use client";
import { useRouter } from "next/navigation";
import { Children, useEffect, useRef, useState } from "react";
import { socket } from "../home/page";

export default function ChatLayout({children}) {
    const router = useRouter()
  const [selectedUser, setSelectedUser] = useState(null);
 
  const [activeUsers, setActiveUsers] = useState([])
  const selectedUserRef = useRef(selectedUser);

 
  useEffect(() => {
    selectedUserRef.current = selectedUser;
  }, [selectedUser]);

  const fetchActiveUser = async (e) => {
    const response = await fetch(`http://localhost:8000/api/v1/common/get-active-user?current_user=${userData?.user_id}`,
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
      setActiveUsers(data)
    } else {
      console.error("Failed to fetch user:", data?.error || response.statusText);
    }
    
  };
  
  useEffect(() => {
   if(userData?.user_id){
    fetchActiveUser()
   }
  },[userData?.user_id])

   useEffect(() => {
    socket.emit("join", {
        userId: userData?.user_id, // Use unique ID from auth system
      });
      }, []);

  return (
    <div className="flex h-full">
      {/* Chat List */}
      <div className="w-1/3 border-r border-gray-300 p-4 overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Messages</h2>
        <ul className="space-y-2">
          {activeUsers?.map((user) => (
            <li
              key={user.user_id}
              onClick={() => {
                router.push(`/chat/${user?.user_id}`)
              }}
              className={`cursor-pointer p-3 rounded-lg ${
                selectedUser?.user_id === user?.user_id
                  ? "bg-blue-100"
                  : "hover:bg-gray-100"
              }`}
            >
              <h3 className="font-medium">{user?.name}</h3>
              <p className="text-sm text-gray-500 truncate">{user?.lastMessage}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Chat Inbox */}
      <div className="flex-1 flex flex-col">
            {children}
      </div>
    </div>
  );
}
