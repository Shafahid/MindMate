"use client";
import React, { useState } from "react";
import { submitMood } from "@/lib/api/user_services";

function MoodboardPage() {
  const [moodText, setMoodText] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [moods, setMoods] = useState<Array<{ moodText: string; label?: string; confidence?: number; entry_id?: string; emoji?: string }>>([]);

  const emojis = ["😊", "😢", "😡", "😱", "😴", "😇", "😎", "🤔", "😭", "🥳", "😐", "😃", "😔", "😤", "😆", "😳"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setFeedback(null);
    const moodToSend = selectedEmoji ? `${selectedEmoji} ${moodText}`.trim() : moodText;
    const res = await submitMood(moodToSend);
    setLoading(false);
    if (res.error) {
      setError(res.error);
    } else {
      setFeedback(res.reason || "Mood submitted!");
      setMoods([
        { moodText: moodToSend, label: res.label, confidence: res.confidence, entry_id: res.entry_id, emoji: selectedEmoji },
        ...moods,
      ]);
      setMoodText("");
      setSelectedEmoji("");
    }
  };

  return (
    <div className="max-w-xl mx-auto py-10">
      <h2 className="text-2xl font-bold mb-4">Moodboard</h2>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex gap-2 mb-2 flex-wrap">
          {emojis.map(emoji => (
            <button
              type="button"
              key={emoji}
              className={`text-2xl px-2 py-1 rounded border ${selectedEmoji === emoji ? "border-violet-600 bg-violet-50" : "border-gray-200 bg-white"}`}
              onClick={() => setSelectedEmoji(emoji)}
              disabled={loading}
            >
              {emoji}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 border rounded px-3 py-2"
            value={moodText}
            onChange={e => setMoodText(e.target.value)}
            placeholder="How are you feeling today? (text)"
            disabled={loading}
            required={!selectedEmoji}
          />
          <button
            type="submit"
            className="bg-violet-600 text-white px-4 py-2 rounded"
            disabled={loading || (!moodText.trim() && !selectedEmoji)}
          >
            {loading ? "Sending..." : "Send Mood"}
          </button>
        </div>
      </form>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {feedback && <div className="text-green-600 mb-2">{feedback}</div>}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Your Mood Entries</h3>
        {moods.length === 0 ? (
          <div className="text-gray-500">No moods submitted yet.</div>
        ) : (
          <ul className="space-y-4">
            {moods.map((mood, idx) => (
              <li key={(mood.entry_id ?? idx.toString())} className="bg-white border rounded p-4 shadow flex items-center gap-3">
                {mood.emoji && <span className="text-2xl">{mood.emoji}</span>}
                <div>
                  <div className="mb-2 text-gray-800">{mood.moodText}</div>
                  <div className="text-xs text-gray-500">Label: {mood.label} | Confidence: {mood.confidence}</div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default MoodboardPage;