"use client";
import React from "react";

export default function Sidebar() {
  return (
    <aside className="w-72 bg-white border-r hidden md:flex flex-col">
      <header className="p-4 border-b font-semibold">Chats</header>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4 hover:bg-gray-100 cursor-pointer">
          <p className="font-medium">Chatbot</p>
          <p className="text-sm text-gray-500">Always online 🤖</p>
        </div>
      </div>
    </aside>
  );
}
