"use client"; 

import { useEffect, useRef, useState } from "react";
import BlogItem from "./_components/BlogItem";
import { getSocket } from "@/utils/socket";

export default function BlogWithComments() {
  const [newComment, setNewComment] = useState("");
  const [blogs, setBlogs] = useState([]);
  const socket = getSocket();
  const [userData, setUserData] = useState({})
  const blogRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userDatas = JSON.parse(localStorage.getItem("userdata"));
      setUserData(userDatas)
    }
  },[])
  
  const addCommentToUi = (comnt, allblogs) => {
  
    const blogDataMap = allblogs?.map((item) => {
      if(item?.blog_id == comnt?.blog_id){
        const commentArr = item?.comments ? item?.comments : []
        const newItem = {...item, comments: [...commentArr, {...comnt, commenter_id: userData?.user_id ? userData?.user_id : comnt?.commenter_id}]}
        return newItem
      }
      else{
        return item
      }
    })
    blogRef.current = blogDataMap
    setBlogs(blogDataMap)

  }

  const handleSubmit = (e) => {
    e.preventDefault();
    addCommentToUi(newComment, blogs)
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

    useEffect(() => {
      if(blogs?.length > 0){
        blogRef.current = blogs
      }
    },[blogs?.length])

    useEffect(() => {
      const handleAddComnt = (comnt) => {
        const blogCurr = blogRef.current
        if(blogCurr){
          console.log('comment here ==>', comnt)
          addCommentToUi(comnt, blogCurr)
        }
      }
      socket.on("commentadded", handleAddComnt)

      return () =>{
        socket.off("commentadded")
      }
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
          userData={userData}
          />
        ))
      }
   </div>
  );
}
