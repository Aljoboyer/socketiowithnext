"use client"; // (if you use Next.js 13+ app directory, otherwise ignore this)

import { useEffect, useState } from "react";
import BlogItem from "./_components/BlogItem";
import { getSocket } from "@/utils/socket";

export default function BlogWithComments() {
  const [comments, setComments] = useState([
    "This is a comment! Very insightful blog.",
    "Loved reading this. Keep it up!",
  ]);
  const [newComment, setNewComment] = useState("");
  const [blogs, setBlogs] = useState([]);
  const socket = getSocket();
  const [userData, setUserData] = useState({})

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userDatas = JSON.parse(localStorage.getItem("userdata"));
      setUserData(userDatas)
    }
  },[])
  
  const handleSubmit = (e) => {
    e.preventDefault();

    // setComments([newComment, ...comments]);
    // setNewComment(""); 

    socket.emit("commentedonpost", {...newComment, commenter_id: userData?.user_id})
  };

   const fetchBlogs = async (e) => {
      const response = await fetch('http://localhost:8000/api/v1/blog/allblog',
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
        setBlogs(data)
      } else {
        console.error("Failed to fetch user:", data?.error || response.statusText);
      }
      
    };
    
    useEffect(() => {
      fetchBlogs()
    },[])

  return (
   <div className="w-full px-6 py-6 bg-gray-100 h-auto flex flex-row flex-wrap">
      {
        blogs?.map((item) => (
          <BlogItem 
          key={item?.blog_id}
          blog={item}
          newComment={newComment}
          setNewComment={setNewComment}
          handleSubmit={handleSubmit}
          comments={comments}
          userData={userData}
          />
        ))
      }
   </div>
  );
}
