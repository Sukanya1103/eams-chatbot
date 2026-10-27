"use client";

import { useState } from "react";
import ChatWindow from "./ChatWindow";

export default function ChatLauncher() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-5 right-5 z-50 sm:bottom-7 sm:right-7">
      {isOpen && (
        <section className="absolute bottom-16 right-0 w-[min(24rem,calc(100vw-2.5rem))] overflow-hidden rounded-2xl border border-blue-200 bg-white shadow-2xl shadow-cyan-950/25">
          <header className="flex items-center justify-between bg-[#24445F] px-4 py-3 text-white">
            <div><p className="text-sm font-bold">EAMS Assistant</p><p className="text-[11px] text-blue-100">Secure workplace support</p></div>
            <button onClick={() => setIsOpen(false)} aria-label="Close assistant" className="rounded-md px-2 py-1 text-lg leading-none hover:bg-[#3B82F6]">×</button>
          </header>
          <ChatWindow compact />
        </section>
      )}
      <button onClick={() => setIsOpen((open) => !open)} aria-label={isOpen ? "Close assistant" : "Open assistant"} className="grid h-14 w-14 place-items-center rounded-full bg-[#3B82F6] text-xl text-white shadow-lg shadow-blue-900/30 transition hover:scale-105 hover:bg-[#24445F] focus:outline-none focus:ring-4 focus:ring-blue-200">
        {isOpen ? "×" : "◌"}
      </button>
    </div>
  );
}
