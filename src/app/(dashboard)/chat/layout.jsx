"use client";
import { getSocket } from "@/utils/socket";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function ChatLayout({ children }) {
  const socket = getSocket();
  const router = useRouter();
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeUsers, setActiveUsers] = useState([]);
  const [userData, setUserData] = useState({});
  const selectedUserRef = useRef(selectedUser);

  // Group creation state
  const [showGroupCreate, setShowGroupCreate] = useState(false);
  const [selectedGroupUsers, setSelectedGroupUsers] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [userGroups, setUserGroups] = useState([])

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userDatas = JSON.parse(localStorage.getItem("userdata"));
      setUserData(userDatas);
    }
  }, []);

  useEffect(() => {
    selectedUserRef.current = selectedUser;
  }, [selectedUser]);

  const fetchActiveUser = async () => {
    const response = await fetch(
      `http://localhost:8000/api/v1/common/get-active-user?current_user=${userData?.user_id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    if (response.ok) {
      setActiveUsers(data);
    } else {
      console.error("Failed to fetch user:", data?.error || response.statusText);
    }
  };

  useEffect(() => {
    if (userData?.user_id) {
      fetchActiveUser();
    }
  }, [userData?.user_id]);

  useEffect(() => {
    socket.emit("join", {
      userId: userData?.user_id,
    });
  }, []);

  const params = useParams();
  const id = params.id;

  const handleCreateGroup = async() => {
    
    const reqData = {group_name: groupName, userIds: [...selectedGroupUsers, userData?.user_id]}

    const response = await fetch('http://localhost:8000/api/v1/group/create-group', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reqData),
    });

    setShowGroupCreate(false);
    setSelectedGroupUsers([]);
    setGroupName("");
  };

  
  const fetchUserGroups = async () => {
    const response = await fetch(
      `http://localhost:8000/api/v1/group/user-group/${userData?.user_id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();
    if (data?.msg !== 'No Group Found') {
      setUserGroups(data)
    } else {
      setUserGroups([])

      console.error("Failed to fetch user:", data?.error || response.statusText);
    }
  };


  useEffect(() => {
    if(userData?.user_id){
      fetchUserGroups()
    }
  },[userData?.user_id])

  const [onlineUsers, setOnlineUsers] = useState([]);
  const onlineUsersRef = useRef(onlineUsers); 

  useEffect(() => {
    onlineUsersRef.current = onlineUsers;
  }, [onlineUsers]);

  useEffect(() => {
    socket.on("onlineUsers", (users) => {
      console.log('checking ==>', users)
      setOnlineUsers(users);
    });

    socket.on("userOnline", (userId) => {
      if (!onlineUsersRef.current.includes(userId)) {
        setOnlineUsers((prev) => [...prev, userId]);
      }
    });

    socket.on("userOffline", (userId) => {
      setOnlineUsers((prev) => prev.filter((id) => id !== userId));
    });

    return () => {
      socket.off("onlineUsers");
      socket.off("userOnline");
      socket.off("userOffline");
      // socket.disconnect();
    };
  }, []);


  console.log("onlineUsers ===>", onlineUsers)

  return (
    <div className="flex h-full">
      {/* Chat List */}
      <div className="w-1/3 border-r border-gray-300 p-4 overflow-y-auto">
        
        {/* New Group Create Section */}
        <div className="mb-6">
          {!showGroupCreate ? (
            <button
              onClick={() => setShowGroupCreate(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Add Group
            </button>
          ) : (
            <div className="flex flex-col gap-4">
              {/* Group Name Input */}
              <input
                type="text"
                placeholder="Group Name"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="border p-2 rounded-md"
              />

              {/* Multiselect */}
              <select
                multiple
                value={selectedGroupUsers}
                onChange={(e) => {
                  const selectedOptions = Array.from(e.target.selectedOptions).map(
                    (option) => option.value
                  );
                  setSelectedGroupUsers(selectedOptions);
                }}
                className="border p-2 rounded-md"
              >
                {activeUsers?.map((user) => (
                  <option key={user.user_id} value={user.user_id}>
                    {user.name}
                  </option>
                ))}
              </select>

              {/* Create Group Button */}
              <button
                onClick={handleCreateGroup}
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
              >
                Create Group
              </button>
            </div>
          )}
        </div>
        
        <h2 className="text-xl font-semibold mb-4">Groups</h2>

        <ul className="space-y-2">
          {userGroups?.map((group) => (
            <li
              key={group.group_id}
              onClick={() => {
                router.push(`/chat//group/${group?.group_id}`);
              }}
              className={`cursor-pointer p-3 rounded-lg ${
                id === group?.group_id ? "bg-blue-100" : "hover:bg-gray-100"
              }`}
            >
              <h3 className="font-medium">{group?.group_name}</h3>
              <p className="text-sm text-gray-500 truncate">{group?.users?.length} Members</p>
            </li>
          ))}
        </ul>
        {/* Messages Heading */}
        <h2 className="text-xl font-semibold mb-4">Messages</h2>

        {/* User List */}
        <ul className="space-y-2">
          {activeUsers?.map((user) => (
            <li
              key={user.user_id}
              onClick={() => {
                router.push(`/chat/${user?.user_id}`);
              }}
              className={`cursor-pointer p-3 rounded-lg ${
                id === user?.user_id ? "bg-blue-100" : "hover:bg-gray-100"
              }`}
            >
              <div className="flex flex-row items-center">
              <h3 className="font-medium">{user?.name}</h3>
              {
                onlineUsers.includes(user?.user_id) ? <div className="h-[10px] w-[10px] bg-green-600 rounded-full ms-2"></div> : ''
              }
              </div>
              <p className="text-sm text-gray-500 truncate">{user?.lastMessage}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Chat Inbox */}
      <div className="flex-1 flex flex-col">{children}</div>
    </div>
  );
}
