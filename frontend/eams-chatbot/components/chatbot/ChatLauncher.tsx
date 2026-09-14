"use client";

import { useState } from "react";
import ChatWindow from "./ChatWindow";

export default function ChatLauncher() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-5 right-5 z-50 sm:bottom-7 sm:right-7">
      {isOpen && (
        <section className="absolute bottom-16 right-0 w-[min(24rem,calc(100vw-2.5rem))] overflow-hidden rounded-2xl border border-cyan-200 bg-white shadow-2xl shadow-cyan-950/25">
          <header className="flex items-center justify-between bg-cyan-700 px-4 py-3 text-white">
            <div><p className="text-sm font-bold">EAMS Assistant</p><p className="text-[11px] text-cyan-100">Secure workplace support</p></div>
            <button onClick={() => setIsOpen(false)} aria-label="Close assistant" className="rounded-md px-2 py-1 text-lg leading-none hover:bg-cyan-600">×</button>
          </header>
          <ChatWindow compact />
        </section>
      )}
      <button onClick={() => setIsOpen((open) => !open)} aria-label={isOpen ? "Close assistant" : "Open assistant"} className="grid h-14 w-14 place-items-center rounded-full bg-cyan-600 text-xl text-white shadow-lg shadow-cyan-900/30 transition hover:scale-105 hover:bg-cyan-700 focus:outline-none focus:ring-4 focus:ring-cyan-200">
        {isOpen ? "×" : "◌"}
      </button>
    </div>
  );
}
