"use client"; // (if you use Next.js 13+ app directory, otherwise ignore this)

import { useEffect, useState } from "react";
import BlogItem from "./_components/BlogItem";

export default function BlogWithComments() {
  const [comments, setComments] = useState([
    "This is a comment! Very insightful blog.",
    "Loved reading this. Keep it up!",
  ]);
  const [newComment, setNewComment] = useState("");
  const [blogs, setBlogs] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim() === "") return;

    // Add the new comment at the top
    setComments([newComment, ...comments]);
    setNewComment(""); // clear input
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
          comments={comments}/>
        ))
      }
   </div>
  );
}
