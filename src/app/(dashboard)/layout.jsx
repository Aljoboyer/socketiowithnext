"use client"

// src/app/(dashboard)/layout.jsx

import Link from "next/link";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen">
           {/* Right Side - Sidebar */}
      <aside className="w-64 bg-white border-l border-gray-200 p-4">
        <nav className="space-y-4">
          <Link href="/dashboard/home" className="block text-gray-700 hover:text-blue-600">
            Home
          </Link>
          <Link href="/dashboard/chat" className="block text-gray-700 hover:text-blue-600">
            Chat
          </Link>
          <Link href="/dashboard/profile" className="block text-gray-700 hover:text-blue-600">
            Profile
          </Link>
        </nav>
      </aside>
      
      {/* Left Side - Page Content */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">{children}</div>
    </div>
  );
}
