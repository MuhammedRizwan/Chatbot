"use client";
import React, { useRef, useEffect } from "react";
import { PaperClipIcon, FaceSmileIcon, PaperAirplaneIcon } from "@heroicons/react/24/outline";
import EmojiPicker, { Theme } from "emoji-picker-react";

export default function Composer({
  input,
  setInput,
  sendMessage,
  handleFile,
}: {
  input: string;
  setInput: (v: string) => void;
  sendMessage: () => Promise<void> | void;
  handleFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const [showEmoji, setShowEmoji] = React.useState(false);
  const emojiRef = useRef<HTMLDivElement>(null);

  const addEmoji = (e: any) => {
    let sym = e.unified.split("-");
    let codesArray = sym.map((el: string) => "0x" + el);
    let emoji = String.fromCodePoint(...codesArray);
    setInput(input + emoji);
  };

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

  return (
    <>
      {showEmoji && (
        <div ref={emojiRef} className="absolute bottom-18 left-4 md:left-73 z-50 shadow-xl">
          <EmojiPicker onEmojiClick={(emoji) => addEmoji(emoji)} theme={Theme.DARK} previewConfig={{ showPreview: false }} />
        </div>
      )}

      <footer className="p-3 bg-white border-t flex items-center gap-2">
        <button className="p-2 hover:bg-gray-100 rounded" onClick={() => setShowEmoji(!showEmoji)}>
          <FaceSmileIcon className="w-6 h-6" />
        </button>

        <button className="p-2 hover:bg-gray-100 rounded" onClick={() => document.getElementById("fileInput")?.click()}>
          <PaperClipIcon className="w-6 h-6" />
        </button>
        <input id="fileInput" type="file" accept="image/*,.pdf" className="hidden" onChange={handleFile} />

        <textarea
          className="flex-1 border rounded-2xl px-4 py-2 outline-none resize-none leading-tight"
          placeholder="Type a message…"
          value={input}
          rows={1}
          onChange={(e) => setInput(e.target.value)}
        />

        <button onClick={sendMessage} className="px-4 py-2 bg-green-700 text-white rounded-full">
          <PaperAirplaneIcon className="w-6 h-7 rounded-full" />
        </button>
      </footer>
    </>
  );
}
