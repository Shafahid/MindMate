"use client";
import React, { useState, useEffect } from "react";
import { submitMood } from "@/lib/api/user_services";
import { supabase } from "@/lib/supabase";

const EMOJIS = ["😊", "😢", "😡", "😱", "😴", "😍", "🤔", "😇"];

function MoodboardPage() {
  const [moodText, setMoodText] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [recentMoods, setRecentMoods] = useState<Array<any>>([]);

  useEffect(() => {
    async function fetchMoods() {
      const { data } = await supabase
        .from("mood_history")
        .select("id, mood_text, mood_emoji, created_at")
        .order("created_at", { ascending: false })
        .limit(10);
      if (data) setRecentMoods(data);
    }
    fetchMoods();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setFeedback(null);
    if (!selectedEmoji) {
      setError("Please select an emoji.");
      setLoading(false);
      return;
    }
    const res = await submitMood(moodText + " " + selectedEmoji);
    setLoading(false);
    if (res.error) {
      setError(res.error);
    } else {
      setFeedback("Mood submitted!");
      setMoodText("");
      setSelectedEmoji("");
      const { data } = await supabase
        .from("mood_history")
        .select("id, mood_text, mood_emoji, created_at")
        .order("created_at", { ascending: false })
        .limit(10);
      if (data) setRecentMoods(data);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-10">
      <h2 className="text-2xl font-bold mb-4">Moodboard</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 mb-4">
        <textarea
          className="border rounded px-3 py-2"
          value={moodText}
          onChange={e => setMoodText(e.target.value)}
          placeholder="How are you feeling today?"
          disabled={loading}
          required
        />
        <div className="flex gap-2 flex-wrap mb-2">
          {EMOJIS.map(emoji => (
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
        <button
          type="submit"
          className="bg-violet-600 text-white px-4 py-2 rounded"
          disabled={loading || !moodText.trim() || !selectedEmoji}
        >
          {loading ? "Submitting..." : "Submit Mood"}
        </button>
      </form>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {feedback && <div className="text-green-600 mb-2">{feedback}</div>}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Recent Moods</h3>
        {recentMoods.length === 0 ? (
          <div className="text-gray-500">No moods yet.</div>
        ) : (
          <ul className="space-y-2">
            {recentMoods.map((mood: any) => (
              <li key={mood.id} className="bg-white border rounded p-2 flex items-center gap-2">
                <span className="text-2xl">{mood.mood_emoji || ""}</span>
                <span className="text-gray-800">{mood.mood_text}</span>
                <span className="ml-auto text-xs text-gray-400">{new Date(mood.created_at).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default MoodboardPage;