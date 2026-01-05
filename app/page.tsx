"use client";
import { useState } from "react";
import Sidebar from "./components/Sidebar";
import MobileDrawer from "./components/MobileDrawer";
import Header from "./components/Header";
import MessagesList from "./components/MessagesList";
import Composer from "./components/Composer";

export default function ChatUI() {
  const [messages, setMessages] = useState<{ id: number; from: string; text: string }[]>([]);

  const [input, setInput] = useState("");
  const [editingId, setEditingId] = useState<any>(null);
  const [editValue, setEditValue] = useState("");
  const [menuId, setMenuId] = useState<number | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { id: Date.now(), from: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);

    const textToSend = input;
    setInput("");

    try {
      const res = await fetch("/api/chatbot/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: textToSend }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { id: Date.now(), from: "bot", text: data.reply },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), from: "bot", text: "Oops — server broke 💀" },
      ]);
    }
  };

  const startEdit = (msg: any) => {
    setEditingId(msg.id);
    setEditValue(msg.text);
  };

  const saveEdit = async () => {
    const updatedText = editValue;
    const editedMessageId = editingId;

    setMessages((prev) => prev.map((m) => (m.id === editedMessageId ? { ...m, text: updatedText } : m)));

    setEditingId(null);
    setEditValue("");

    try {
      const res = await fetch("/api/chatbot/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: updatedText }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { id: Date.now(), from: "bot", text: data.reply },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), from: "bot", text: "Couldn't refresh after edit 😅" },
      ]);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValue("");
  };

  const deleteMessage = (id: number) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setMessages((prev) => [...prev, { id: Date.now(), from: "user", text: `📎 Sent: ${file.name}` }]);

    try {
      const res = await fetch("/api/chatbot/file", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      setMessages((prev) => [...prev, { id: Date.now(), from: "bot", text: data.reply }]);
    } catch {
      setMessages((prev) => [...prev, { id: Date.now(), from: "bot", text: "Couldn't read file 😭" }]);
    }
  };

  return (
    <main className="h-screen w-full bg-gray-100 flex">
      <Sidebar />

      <MobileDrawer open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <section className="flex-1 flex flex-col">
        <Header onOpenSidebar={() => setSidebarOpen(true)} />

        <MessagesList
          messages={messages}
          editingId={editingId}
          editValue={editValue}
          setEditValue={setEditValue}
          startEdit={startEdit}
          saveEdit={saveEdit}
          cancelEdit={cancelEdit}
          deleteMessage={deleteMessage}
          menuId={menuId}
          setMenuId={setMenuId}
        />

        <Composer input={input} setInput={setInput} sendMessage={sendMessage} handleFile={handleFile} />
      </section>
    </main>
  );
}
