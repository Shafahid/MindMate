"use client";
import React, { useState, useRef } from "react";
import { sendChatMessage, sendVoiceMessage } from "@/lib/api/user_services";
import Image from "next/image";
import ReactMarkdown from "react-markdown";

function ChatbotPage() {
  const [messages, setMessages] = useState<Array<{ sender: string; text: string }>>([]);
  const [input, setInput] = useState("");
  const [loadingText, setLoadingText] = useState(false);
  const [loadingVoice, setLoadingVoice] = useState(false);
  const [error, setError] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setLoadingText(true);
    setError("");
    // Prepare last 4 messages + new user message
    const contextMessages = [...messages, { sender: "user", text: input }].slice(-5);
    const res = await sendChatMessage(contextMessages);
    setLoadingText(false);
    setMessages((prev) => [...prev, { sender: "user", text: input }]);
    if (res.error) {
      setError(res.error);
    } else {
      setMessages((prev) => [...prev, { sender: "ai", text: res.response || "" }]);
    }
    setInput("");
  };

  const startRecording = async () => {
    try {
      setError("");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.addEventListener("dataavailable", (event) => {
        audioChunksRef.current.push(event.data);
      });

      mediaRecorder.addEventListener("stop", () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        setAudioBlob(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      });

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      setError("Failed to access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const sendVoiceRecording = async () => {
    if (!audioBlob) return;
    setLoadingVoice(true);
    setError("");
    // Create a File object from the Blob
    const audioFile = new File([audioBlob], "recording.wav", { type: "audio/wav" });
    const res = await sendVoiceMessage(audioFile);
    setLoadingVoice(false);
    if (res.error) {
      setError(res.error);
    } else {
      // Only show the first MindMate response (first non-empty line)
      let aiText = res.ai_response || "";
      const lines = aiText.split(/\r?\n/).map(l => l.trim()).filter(l => l);
      const firstResponse = lines.length > 0 ? lines[0] : aiText;
      setMessages((prev) => [
        ...prev,
        { sender: "user", text: res.transcribed_text || "[Voice]" },
        { sender: "ai", text: firstResponse },
      ]);
    }
    setAudioBlob(null);
  };

  const cancelRecording = () => {
    setAudioBlob(null);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-violet-200">
        <h2 className="text-4xl font-bold font-nohemi text-violet-700 mb-8 text-center tracking-wide">
          MindMate Chatbot
        </h2>
        
        {/* Chat Messages */}
        <div className="bg-gradient-to-br from-violet-50 to-white rounded-2xl p-6 mb-6 h-80 overflow-y-auto shadow-inner border border-violet-100">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <Image src="/mindmate.png" alt="MindMate Logo" width={100} height={100} className="rounded-2xl border-2 border-violet-500" />
                </div>
                <div className="text-violet-600 font-nohemi text-lg">Start chatting with MindMate!</div>
                <div className="text-gray-500 text-sm mt-2">Type a message or record your voice</div>
              </div>
            </div>
          ) : (
            <ul className="space-y-4">
              {messages.map((msg, idx) => (
                <li key={idx} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm ${
                    msg.sender === "user" 
                      ? "bg-gradient-to-r from-violet-500 to-violet-600 text-white" 
                      : "bg-white border border-violet-100 text-gray-800"
                  }`}>
                    {msg.sender === "ai" ? (
                      <ReactMarkdown>{msg.text}</ReactMarkdown>
                    ) : (
                      <span className="font-nohemi text-sm">{msg.text}</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Text Input Form */}
        <form onSubmit={handleSend} className="flex gap-3 mb-6">
          <input
            type="text"
            className="flex-1 border-2 border-violet-200 rounded-xl px-4 py-3 font-nohemi focus:outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100 bg-white/70 backdrop-blur-sm shadow-sm"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type your message here..."
            disabled={loadingText}
            required
          />
          <button 
            type="submit" 
            className="bg-gradient-to-r from-violet-600 to-violet-700 text-white px-6 py-3 rounded-xl font-nohemi font-semibold shadow-lg hover:from-violet-700 hover:to-violet-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105" 
            disabled={loadingText || !input.trim()}
          >
            {loadingText ? "Sending..." : "Send"}
          </button>
        </form>
        
        {/* Voice Recording Section */}
        <div className="bg-gradient-to-br from-violet-100 to-white rounded-2xl p-6 shadow-lg border border-violet-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-violet-500 rounded-full">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                  <path d="M12 2a3 3 0 00-3 3v6a3 3 0 006 0V5a3 3 0 00-3-3z"/>
                  <path d="M19 10v1a7 7 0 01-14 0v-1a1 1 0 012 0v1a5 5 0 0010 0v-1a1 1 0 012 0z"/>
                </svg>
              </div>
              <span className="text-lg font-nohemi font-semibold text-violet-700">Voice Message</span>
            </div>
            {isRecording && (
              <div className="flex items-center text-red-500">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse mr-2"></div>
                <span className="text-sm font-nohemi font-medium">Recording...</span>
              </div>
            )}
          </div>
          
          {!audioBlob ? (
            <div className="flex gap-3">
              {!isRecording ? (
                <button 
                  onClick={startRecording}
                  disabled={loadingVoice || isRecording}
                  className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-violet-700 text-white px-6 py-3 rounded-xl font-nohemi font-semibold shadow-lg hover:from-violet-700 hover:to-violet-800 disabled:opacity-50 transition-all duration-200 transform hover:scale-105"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2a3 3 0 00-3 3v6a3 3 0 006 0V5a3 3 0 00-3-3z"/>
                    <path d="M19 10v1a7 7 0 01-14 0v-1a1 1 0 012 0v1a5 5 0 0010 0v-1a1 1 0 012 0z"/>
                    <path d="M12 18.5a1 1 0 011 1v1a1 1 0 01-2 0v-1a1 1 0 011-1z"/>
                  </svg>
                  Start Recording
                </button>
              ) : (
                <button 
                  onClick={stopRecording}
                  className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-xl font-nohemi font-semibold shadow-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 transform hover:scale-105"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="6" y="6" width="12" height="12" rx="2"/>
                  </svg>
                  Stop Recording
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
                <div className="p-2 bg-green-500 rounded-full">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                    <path d="M20 12a8 8 0 11-16 0 8 8 0 0116 0zm-3.97-3.03a.75.75 0 00-1.08.02L11 12.99l-1.94-2.01a.75.75 0 00-1.08 1.04L10.47 14l.53.53.53-.53 3.5-3.5a.75.75 0 00-.02-1.08z"/>
                  </svg>
                </div>
                <span className="text-green-700 font-nohemi font-medium">Recording ready to send!</span>
              </div>
              {/* Audio playback for confirmation */}
              <div className="mb-2">
                {audioBlob && (
                  <audio controls src={URL.createObjectURL(audioBlob)} />
                )}
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={sendVoiceRecording}
                  disabled={loadingVoice}
                  className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl font-nohemi font-semibold shadow-lg hover:from-green-600 hover:to-green-700 disabled:opacity-50 transition-all duration-200 transform hover:scale-105"
                >
                  {loadingVoice ? "Sending..." : "Send Voice Message"}
                </button>
                <button 
                  onClick={cancelRecording}
                  disabled={loadingVoice}
                  className="bg-gradient-to-r from-gray-400 to-gray-500 text-white px-6 py-3 rounded-xl font-nohemi font-semibold shadow-lg hover:from-gray-500 hover:to-gray-600 disabled:opacity-50 transition-all duration-200 transform hover:scale-105"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
        
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-center gap-2 text-red-700">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              <span className="font-nohemi font-medium">{error}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatbotPage;