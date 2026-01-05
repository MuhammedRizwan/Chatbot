"use client";
import React from "react";
import { Bars3Icon } from "@heroicons/react/24/outline";

export default function Header({ onOpenSidebar }: { onOpenSidebar: () => void }) {
  return (
    <header className="p-4 bg-white border-b flex items-center gap-2">
      <button className="md:hidden p-2" onClick={onOpenSidebar}>
        <Bars3Icon className="w-6 h-6" />
      </button>

      <div>
        <div className="font-semibold">Chatbot</div>
        <p className="text-sm text-gray-400">Repond your message and explain about images and pdf given</p>
      </div>
    </header>
  );
}
