// socket.js
"use client";

import { io } from "socket.io-client";

let socket = null;

export const getSocket = () => {
  if (!socket) {
    if (typeof window !== "undefined") {
      const userData = JSON.parse(localStorage.getItem("userdata"));

      if (userData?.user_id) {
        socket = io("http://localhost:8000", {
          query: { userId: userData.user_id },
        });
      } else {
        console.error("No user data found in localStorage");
      }
    }
  }
  return socket;
};
