"use client";
import React, { useState, useRef } from "react";
import { sendChatMessage, sendVoiceMessage } from "@/lib/api/user_services";

function ChatbotPage() {
  const [messages, setMessages] = useState<Array<{ sender: string; text: string }>>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setLoading(true);
    setError("");
    setMessages((prev) => [...prev, { sender: "user", text: input }]);
    const res = await sendChatMessage(input);
    setLoading(false);
    if (res.error) {
      setError(res.error);
    } else {
      setMessages((prev) => [...prev, { sender: "ai", text: res.response || "" }]);
    }
    setInput("");
  };

  const handleVoice = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    setLoading(true);
    setError("");
    const res = await sendVoiceMessage(e.target.files[0]);
    setLoading(false);
    if (res.error) {
      setError(res.error);
    } else {
      setMessages((prev) => [
        ...prev,
        { sender: "user", text: res.transcribed_text || "[Voice]" },
        { sender: "ai", text: res.ai_response || "" },
      ]);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="max-w-xl mx-auto py-10">
      <h2 className="text-2xl font-bold mb-4">MindMate Chatbot</h2>
      <div className="border rounded p-4 bg-white mb-4 h-64 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="text-gray-400">Start chatting with MindMate!</div>
        ) : (
          <ul className="space-y-2">
            {messages.map((msg, idx) => (
              <li key={idx} className={msg.sender === "user" ? "text-right" : "text-left"}>
                <span className={msg.sender === "user" ? "bg-violet-100 px-2 py-1 rounded" : "bg-gray-100 px-2 py-1 rounded"}>{msg.text}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      <form onSubmit={handleSend} className="flex gap-2 mb-2">
        <input
          type="text"
          className="flex-1 border rounded px-3 py-2"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type your message..."
          disabled={loading}
          required
        />
        <button type="submit" className="bg-violet-600 text-white px-4 py-2 rounded" disabled={loading || !input.trim()}>
          Send
        </button>
      </form>
      <div className="mb-2">
        <input
          type="file"
          accept="audio/*"
          ref={fileInputRef}
          onChange={handleVoice}
          disabled={loading}
        />
        <span className="ml-2 text-sm text-gray-500">Send voice message</span>
      </div>
      {error && <div className="text-red-500 mt-2">{error}</div>}
    </div>
  );
}

export default ChatbotPage;