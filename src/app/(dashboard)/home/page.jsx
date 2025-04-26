"use client";
import { getSocket } from "@/utils/socket";
import { useEffect, useState } from "react";
import { Bounce, toast } from "react-toastify";

export default function HomePage() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const friendRequests = [
    { id: 1, username: "Alice", email: "alice@email.com", date: "2025-04-10" },
    { id: 2, username: "Bob", email: "bob@email.com", date: "2025-04-11" },
    { id: 3, username: "Charlie", email: "charlie@email.com", date: "2025-04-09" },
  ];
  const [userData, setUserData] = useState({})

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userDatas = JSON.parse(localStorage.getItem("userdata"));
      setUserData(userDatas)
    }
  },[])
    const socket = getSocket();
  
  const filteredRequests = friendRequests.filter((req) => {
    if (!startDate || !endDate) return true;
    const requestDate = new Date(req.date);
    return requestDate >= new Date(startDate) && requestDate <= new Date(endDate);
  });

  // Comment state
  const [comments, setComments] = useState([
  ]);
  const [commentText, setCommentText] = useState("");

  const handleAddComment = () => {
    const commentObj =  { commented_date: Date.now(), commenter_id: userData?.user_id, text: commentText.trim() }
    
    socket.emit('addcomment', commentObj)
    setCommentText("");
  };

  useEffect(() => {
    socket.on("receivedcomments" , (cmnt) => {
      setComments((prev) => [...prev, cmnt])
    })

    return () =>{
      socket.off("receivedcomments")
    }
  },[])


  return (
    <div className="space-y-8">
      {/* Top Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-blue-500 text-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold">Total Users</h2>
          <p className="text-3xl font-bold mt-2">120</p>
        </div>
        <div className="bg-green-500 text-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold">New Messages</h2>
          <p className="text-3xl font-bold mt-2">32</p>
        </div>
        <div className="bg-purple-500 text-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold">Friend Requests</h2>
          <p className="text-3xl font-bold mt-2">5</p>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white p-6 rounded-xl shadow">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
          <h2 className="text-xl font-semibold">Friend Requests</h2>
          <div className="flex gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Start Date</label>
              <input
                type="date"
                className="border rounded px-2 py-1"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">End Date</label>
              <input
                type="date"
                className="border rounded px-2 py-1"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border-b text-left">Username</th>
                <th className="px-4 py-2 border-b text-left">Email</th>
                <th className="px-4 py-2 border-b text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.length > 0 ? (
                filteredRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border-b">{req.username}</td>
                    <td className="px-4 py-2 border-b">{req.email}</td>
                    <td className="px-4 py-2 border-b space-x-2">
                      <button className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">
                        Accept
                      </button>
                      <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                        Reject
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="px-4 py-4 text-center text-gray-500">
                    No friend requests in selected date range.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Comment Section */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Comments</h3>
          <div className="max-h-96 overflow-y-auto space-y-4 mb-4 border p-4 rounded-lg bg-gray-50">
            {comments.map((comment, index) => (
              <div key={index} className="bg-white p-3 rounded shadow">
                <p className="text-sm font-semibold">{comment?.commenter_id}</p>
                <p className="text-gray-700">{comment.text}</p>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Write a comment..."
              className="border rounded w-full px-3 py-2"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
            />
            <button
              onClick={handleAddComment}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Post
            </button>
          </div>
        </div>
      </div>
      
    </div>
  );
}
