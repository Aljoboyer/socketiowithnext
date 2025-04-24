"use client";
import { Children, useEffect, useRef, useState } from "react";

export default function ChatPage({children}) {
 
  return (
    <div className="flex h-full">
      <div className="flex items-center justify-center h-full text-gray-400 text-lg">
            No message selected
          </div>
    </div>
  );
}
