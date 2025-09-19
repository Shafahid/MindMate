"use client";
import React, { useState, useRef } from "react";
import { sendChatMessage, sendVoiceMessage } from "@/lib/api/user_services";

function ChatbotPage() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [voiceLoading, setVoiceLoading] = useState(false);
  const [voiceResponse, setVoiceResponse] = useState<{ transcribed_text?: string; ai_response?: string } | null>(null);
  const [voiceError, setVoiceError] = useState("");
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [audioUrl, setAudioUrl] = useState<string>("");

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResponse("");
    const res = await sendChatMessage(input);
    setLoading(false);
    if (res.error) {
      setError(res.error);
    } else {
      setResponse(res.response || "");
    }
  };

  // Voice recording logic
  const handleStartRecording = async () => {
    setVoiceError("");
    setVoiceResponse(null);
    setAudioChunks([]);
    setAudioUrl("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new window.MediaRecorder(stream);
      setMediaRecorder(recorder);
      setRecording(true);
      recorder.start();
      const chunks: Blob[] = [];
      recorder.ondataavailable = (e: BlobEvent) => {
        if (e.data.size > 0) chunks.push(e.data);
      };
      recorder.onstop = () => {
        setAudioChunks(chunks);
        const audioBlob = new Blob(chunks, { type: "audio/webm" });
        setAudioUrl(URL.createObjectURL(audioBlob));
      };
    } catch (err: any) {
      setVoiceError("Microphone access denied or unavailable.");
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorder && recording) {
      mediaRecorder.stop();
      setRecording(false);
    }
  };

  const handleSendRecording = async () => {
    if (audioChunks.length === 0) return;
    setVoiceLoading(true);
    setVoiceError("");
    setVoiceResponse(null);
    const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
    const file = new File([audioBlob], "voice-message.webm", { type: "audio/webm" });
    const res = await sendVoiceMessage(file);
    setVoiceLoading(false);
    if (res.error) {
      setVoiceError(res.error);
    } else {
      setVoiceResponse({
        transcribed_text: res.transcribed_text,
        ai_response: res.ai_response,
      });
    }
    setAudioChunks([]);
    setAudioUrl("");
  };

  return (
    <div className="max-w-xl mx-auto py-10">
      <h2 className="text-2xl font-bold mb-4">MindMate Chatbot</h2>
      <form onSubmit={handleSend} className="flex gap-2 mb-4">
        <input
          type="text"
          className="flex-1 border rounded px-3 py-2"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type your message..."
          disabled={loading}
          required
        />
        <button
          type="submit"
          className="bg-violet-600 text-white px-4 py-2 rounded"
          disabled={loading || !input.trim()}
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </form>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {response && (
        <div className="bg-gray-100 p-4 rounded shadow mb-4">
          <strong>AI Response:</strong>
          <div className="mt-2">{response}</div>
        </div>
      )}

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-2">Or record and send a voice message:</h3>
        <div className="flex gap-2 mb-2">
          {!recording ? (
            <button
              type="button"
              className="bg-violet-600 text-white px-4 py-2 rounded"
              onClick={handleStartRecording}
              disabled={voiceLoading}
            >
              Start Recording
            </button>
          ) : (
            <button
              type="button"
              className="bg-red-500 text-white px-4 py-2 rounded"
              onClick={handleStopRecording}
            >
              Stop Recording
            </button>
          )}
          {audioUrl && !recording && (
            <button
              type="button"
              className="bg-green-600 text-white px-4 py-2 rounded"
              onClick={handleSendRecording}
              disabled={voiceLoading}
            >
              Send Voice
            </button>
          )}
        </div>
        {audioUrl && !recording && (
          <audio controls src={audioUrl} className="mb-2" />
        )}
        {voiceLoading && <div className="text-violet-600 mb-2">Processing voice message...</div>}
        {voiceError && <div className="text-red-500 mb-2">{voiceError}</div>}
        {voiceResponse && (
          <div className="bg-gray-100 p-4 rounded shadow">
            <strong>Transcribed Text:</strong>
            <div className="mt-2 mb-2">{voiceResponse.transcribed_text}</div>
            <strong>AI Response:</strong>
            <div className="mt-2">{voiceResponse.ai_response}</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatbotPage;