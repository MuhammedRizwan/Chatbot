"use client";
import { useState, useRef, useEffect } from "react";
import { PaperClipIcon, FaceSmileIcon, PaperAirplaneIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import EmojiPicker, { Theme } from "emoji-picker-react";

export default function ChatUI() {
  const [messages, setMessages] = useState<{ id: number; from: string; text: string }[]>([]);

  const [input, setInput] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [menuId, setMenuId] = useState<number | null>(null);


  const emojiRef = useRef<HTMLDivElement>(null);   // 👈 reference to picker

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { id: Date.now(), from: "user", text: input };
    setMessages(prev => [...prev, userMessage]);

    const textToSend = input;
    setInput("");
    setShowEmoji(false);

    try {
      const res = await fetch("/api/chatbot/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: textToSend }),
      });

      const data = await res.json();

      setMessages(prev => [
        ...prev,
        { id: Date.now(), from: "bot", text: data.reply }
      ]);

    } catch (err) {
      setMessages(prev => [
        ...prev,
        { id: Date.now(), from: "bot", text: "Oops — server broke 💀" }
      ]);
    }
  };


  const addEmoji = (e: any) => {
    let sym = e.unified.split("-");
    let codesArray = sym.map((el: string) => "0x" + el);
    let emoji = String.fromCodePoint(...codesArray);
    setInput((prev) => prev + emoji);
  };

  // 👇 close picker when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (emojiRef.current && !emojiRef.current.contains(e.target as Node)) {
        setShowEmoji(false);
      }
    }

    if (showEmoji) {
      document.addEventListener("mousedown", handleClick);
    }

    return () => document.removeEventListener("mousedown", handleClick);
  }, [showEmoji]);

  const startEdit = (msg: any) => {
    setEditingId(msg.id);
    setEditValue(msg.text);
  };

  const saveEdit = async () => {
  const updatedText = editValue;
  const editedMessageId = editingId;

  // 1️⃣ update the user message locally
  setMessages(prev =>
    prev.map(m =>
      m.id === editedMessageId ? { ...m, text: updatedText } : m
    )
  );

  setEditingId(null);
  setEditValue("");

  // 2️⃣ send edited text to backend (new response)
  try {
    const res = await fetch("/api/chatbot/message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: updatedText }),
    });

    const data = await res.json();

    // 3️⃣ append NEW bot reply
    setMessages(prev => [
      ...prev,
      { id: Date.now(), from: "bot", text: data.reply }
    ]);

  } catch (err) {
    setMessages(prev => [
      ...prev,
      { id: Date.now(), from: "bot", text: "Couldn't refresh after edit 😅" }
    ]);
  }
};

  const cancelEdit = () => {
    setEditingId(null);
    setEditValue("");
  };
  const deleteMessage = (id: number) => {
    setMessages(prev => prev.filter(m => m.id !== id));
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setMessages(prev => [
      ...prev,
      { id: Date.now(), from: "user", text: `📎 Sent: ${file.name}` }
    ]);

    try {
      const res = await fetch("/api/chatbot/file", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      setMessages(prev => [
        ...prev,
        { id: Date.now(), from: "bot", text: data.reply }
      ]);
    } catch {
      setMessages(prev => [
        ...prev,
        { id: Date.now(), from: "bot", text: "Couldn't read file 😭" }
      ]);
    }
  };



  return (
    <main className="h-screen w-full bg-gray-100 flex">

      <aside className="w-72 bg-white border-r hidden md:flex flex-col">
        <header className="p-4 border-b font-semibold">
          Chats
        </header>

        <div className="flex-1 overflow-y-auto">
          <div className="p-4 hover:bg-gray-100 cursor-pointer">
            <p className="font-medium">Chatbot</p>
            <p className="text-sm text-gray-500">Always online 🤖</p>
          </div>
        </div>
      </aside>

      {/* Chat Area */}
      <section className="flex-1 flex flex-col">
        {/* Top bar */}
        <header className="p-4 bg-white border-b flex items-center gap-2">
          <div className="font-semibold">Chatbot</div>
        </header>

        {/* Messages */}
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
                <div
                  className="relative group flex justify-between gap-1"
                >
                  <p className="whitespace-pre-line">
                    {msg.text}
                  </p>

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



        {showEmoji && (
          <div
            ref={emojiRef}
            className="absolute bottom-17 left-73 z-50 shadow-xl"
          >
            <EmojiPicker
              onEmojiClick={(emoji) => addEmoji(emoji)}
              theme={Theme.DARK}
              previewConfig={{ showPreview: false }}
            />
          </div>
        )}


        {/* Input */}
        <footer className="p-3 bg-white border-t flex items-center gap-2">
          <button className="p-2 hover:bg-gray-100 rounded" onClick={() => setShowEmoji(!showEmoji)}>
            <FaceSmileIcon className="w-6 h-6" />
          </button>

          <button
            className="p-2 hover:bg-gray-100 rounded"
            onClick={() => document.getElementById("fileInput")?.click()}
          >
            <PaperClipIcon className="w-6 h-6" />
          </button>
          <input
            id="fileInput"
            type="file"
            accept="image/*,.pdf"
            className="hidden"
            onChange={handleFile}
          />

          <textarea
            className="flex-1 border rounded-2xl px-4 py-2 outline-none resize-none leading-tight"
            placeholder="Type a message…"
            value={input}
            rows={1}
            onChange={(e) => setInput(e.target.value)}
          />

          <button
            onClick={sendMessage}
            className="px-4 py-2 bg-green-700 text-white rounded-full"
          >
            <PaperAirplaneIcon className="w-6 h-7 rounded-full" />
          </button>
        </footer>
      </section>
    </main>
  );
}
