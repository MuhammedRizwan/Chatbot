"use client";
import React from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

export default function MobileDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <aside className="absolute left-0 top-0 h-full w-72 bg-white border-r flex flex-col">
        <header className="p-4 border-b flex items-center justify-between">
          <div className="font-semibold">Chats</div>
          <button className="p-2" onClick={onClose}>
            <XMarkIcon className="w-5 h-5" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto">
          <div className="p-4 hover:bg-gray-100 cursor-pointer">
            <p className="font-medium">Chatbot</p>
            <p className="text-sm text-gray-500">Always online 🤖</p>
          </div>
        </div>
      </aside>
    </div>
  );
}
