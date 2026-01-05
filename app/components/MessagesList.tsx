"use client";
import React from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

type Message = { id: number; from: string; text: string };

export default function MessagesList({
  messages,
  editingId,
  editValue,
  setEditValue,
  startEdit,
  saveEdit,
  cancelEdit,
  deleteMessage,
  menuId,
  setMenuId,
}: {
  messages: Message[];
  editingId: any;
  editValue: string;
  setEditValue: (v: string) => void;
  startEdit: (m: Message) => void;
  saveEdit: () => void;
  cancelEdit: () => void;
  deleteMessage: (id: number) => void;
  menuId: number | null;
  setMenuId: (id: number | null) => void;
}) {
  return (
    <div className="flex-1 p-4 overflow-y-auto space-y-3">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`relative max-w-xs p-2 rounded-lg text-sm ${msg.from === "user"
            ? "ml-auto bg-green-500 text-white"
            : "bg-white border"
            }`}
        >
          {editingId === msg.id ? (
            <div className="space-y-2">
              <input
                className="w-full px-2 py-1 rounded text-black"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
              />

              <div className="flex gap-2 justify-end">
                <button className="text-xs" onClick={saveEdit}>Save</button>
                <button className="text-xs" onClick={cancelEdit}>Cancel</button>
              </div>
            </div>
          ) : (
            <div className="relative group flex justify-between gap-1">
              <p className="whitespace-pre-line">{msg.text}</p>

              {msg.from === "user" && (
                <button
                  onClick={() => setMenuId(menuId === msg.id ? null : msg.id)}
                  className="hidden group-hover:flex absolute top-0 right-1 text-white/80 hover:text-white"
                >
                  <ChevronDownIcon className="w-4 h-4" />
                </button>
              )}
            </div>
          )}

          {menuId === msg.id && (
            <div className="absolute right-0 mt-2 bg-white text-gray-800 border shadow rounded text-sm z-50">
              <button
                className="block px-4 py-2 hover:bg-gray-100 w-full text-left"
                onClick={() => {
                  setMenuId(null);
                  startEdit(msg);
                }}
              >
                Edit
              </button>

              <button
                className="block px-4 py-2 hover:bg-gray-100 w-full text-left text-red-600"
                onClick={() => {
                  setMenuId(null);
                  deleteMessage(msg.id);
                }}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
