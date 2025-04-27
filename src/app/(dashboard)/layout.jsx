"use client"
import Link from "next/link";
import { useRouter } from 'next/navigation';
import 'react-toastify/dist/ReactToastify.css';
import { Bounce, toast, ToastContainer } from 'react-toastify';
import { useEffect } from "react";
import { getSocket } from "@/utils/socket";

export default function DashboardLayout({ children }) {
    const router = useRouter();  
    const socket = getSocket();
    
    const showNotification = (notify) => {
      toast.info(`🦄 ${notify}`, {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
            });
    }

    useEffect(() => {
      socket.on("notifyuser", (notification) => {
        showNotification(notification)
      })

      return () =>{
        socket.off("notifyuser")
      }
    },[])


    useEffect(() => {
      socket.on("newBlogPosted", (notification) => {
        console.log('Client check', notification)
        showNotification(notification)
      })

      return () =>{
        socket.off("newBlogPosted")
      }
    },[])


  return (
    <div className="flex flex-col h-screen">
       <ToastContainer />
      {/* Sticky Navbar */}
      <header className="sticky top-0 z-10 bg-white border-b shadow-sm px-6 py-4 flex items-center justify-between">
        {/* App Name */}
        <div className="text-xl font-bold text-blue-600">MyApp</div>

        {/* Profile Section */}
        <div className="relative group">
          <div className="w-10 h-10 rounded-full overflow-hidden border cursor-pointer">
            <img
              src="https://i.pravatar.cc/300"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Dropdown (on hover) */}
          <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none group-hover:pointer-events-auto">
            <ul className="text-sm text-gray-700">
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Profile</li>
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Settings</li>
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Logout</li>
            </ul>
          </div>
         
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <aside className="w-64 bg-white border-l p-4">
          <nav className="space-y-4">
            <Link href="/home" className="block text-gray-700 hover:text-blue-600">
              Home
            </Link>
            <Link href="/chat" className="block text-gray-700 hover:text-blue-600">
              Chat
            </Link>
            <Link href="/blog" className="block text-gray-700 hover:text-blue-600">
              Blog
            </Link>
          </nav>
          <button onClick={() => {
            localStorage.removeItem('userdata')
      router.push('/')
            
          }} className="text-blue-700 font-bold text-lg cursor-pointer">Logout</button>
        </aside>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">{children}</div>

      
      </div>
    </div>
  );
}
