"use client";
import React, { useState, useEffect } from "react";
import { submitMood } from "@/lib/api/user_services";
import { supabase } from "@/lib/supabase";
import { BarChart2, Calendar, Clock, Sparkles, TrendingUp } from "lucide-react";

const EMOJIS = ["😊", "😢", "😡", "😱", "😴", "😍", "🤔", "😇"];

function MoodboardPage() {
  const [moodText, setMoodText] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [recentMoods, setRecentMoods] = useState<Array<any>>([]);

  async function fetchRecentMoods() {
    const { user } = await import("@/lib/auth").then(mod => mod.getCurrentUser());
    if (!user) {
      setRecentMoods([]);
      return;
    }
    const { data } = await supabase
      .from("mood_entries")
      .select("id, mood_value, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10);
    if (data) setRecentMoods(data);
  }

  useEffect(() => {
    fetchRecentMoods();
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
    // Get current user
    const { user } = await import("@/lib/auth").then(mod => mod.getCurrentUser());
    if (!user) {
      setError("You must be logged in to submit your mood.");
      setLoading(false);
      return;
    }
    // Call backend /mood endpoint for verdict
    const res = await submitMood(moodText + " " + selectedEmoji, user.id);
    if (res.error) {
      setError(res.error);
      setLoading(false);
      return;
    }
    // Map verdict to mood_value
    let mood_value: "positive" | "neutral" | "negative" = "neutral";
    if (res.label === "positive") mood_value = "positive";
    else if (res.label === "negative") mood_value = "negative";
    // Store in mood_entries table
    const { error: dbError } = await supabase.from("mood_entries").insert([
      {
        user_id: user.id,
        mood_value,
        created_at: new Date().toISOString(),
      },
    ]);
    setLoading(false);
    if (dbError) {
      setError(dbError.message || "Failed to save mood entry.");
      return;
    }
    setFeedback(`Mood submitted! Verdict: ${mood_value}`);
    setMoodText("");
    setSelectedEmoji("");
    // After submitting, refresh recent moods from DB
    await fetchRecentMoods();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Section */}
      <div className="bg-white/80  rounded-3xl shadow-md p-8 border border-violet-200">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-r from-violet-500 to-violet-600 rounded-2xl">
              <BarChart2 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold font-nohemi text-violet-700 tracking-wide">
                MoodBoard
              </h1>
              <p className="text-gray-600 font-nohemi mt-1">Track your emotions and wellbeing journey</p>
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-violet-600">{recentMoods.length}</div>
            <div className="text-sm text-gray-500 font-nohemi">Entries</div>
          </div>
        </div>
      </div>

      {/* Mood Entry Form */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-violet-200">
        <div className="flex items-center gap-3 mb-6">
         
          <h2 className="text-2xl font-bold font-nohemi text-gray-700">How are you feeling today?</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-nohemi  text-gray-700 mb-2">
              Share your thoughts
            </label>
            <textarea
              className="w-full border-2 border-violet-200 rounded-xl px-4 py-3 font-nohemi focus:outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100 bg-white/70 backdrop-blur-sm shadow-sm resize-none"
              rows={4}
              value={moodText}
              onChange={e => setMoodText(e.target.value)}
              placeholder="Describe how you're feeling, what's on your mind, or what happened today..."
              disabled={loading}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-nohemi font-semibold text-gray-700 mb-3">
              Choose your mood
            </label>
            <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
              {EMOJIS.map(emoji => (
                <button
                  type="button"
                  key={emoji}
                  className={`aspect-square text-3xl rounded-2xl border-2 transition-all duration-200 transform hover:scale-110 ${
                    selectedEmoji === emoji 
                      ? "border-violet-400 bg-gradient-to-br from-violet-50 to-violet-100 shadow-lg scale-110" 
                      : "border-gray-200 bg-white hover:border-violet-200 hover:bg-violet-50"
                  }`}
                  onClick={() => setSelectedEmoji(emoji)}
                  disabled={loading}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={() => {
                setMoodText("");
                setSelectedEmoji("");
              }}
              className="px-6 py-2 font-nohemi font-semibold text-gray-600 hover:text-gray-800 transition-colors"
            >
              Clear
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-violet-700 text-white px-8 py-3 rounded-xl font-nohemi font-semibold shadow-lg hover:from-violet-700 hover:to-violet-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
              disabled={loading || !moodText.trim() || !selectedEmoji}
            >
              <TrendingUp className="w-4 h-4" />
              {loading ? "Submitting..." : "Log Mood"}
            </button>
          </div>
        </form>

        {/* Feedback Messages */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-center gap-2 text-red-700">
              <span className="font-nohemi font-medium">{error}</span>
            </div>
          </div>
        )}
        {feedback && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl">
            <div className="flex items-center gap-2 text-green-700">
              <Sparkles className="w-4 h-4" />
              <span className="font-nohemi font-medium">{feedback}</span>
            </div>
          </div>
        )}
      </div>

      {/* Recent Moods Section */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-violet-200 overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-violet-50 to-white border-b border-violet-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-violet-500 to-violet-600 rounded-xl">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold font-nohemi text-violet-700">Recent Mood Entries</h3>
          </div>
        </div>

        <div className="p-6">
          {recentMoods.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📊</div>
              <h3 className="text-2xl font-nohemi font-bold text-violet-700 mb-2">No mood entries yet</h3>
              <p className="text-gray-600 font-nohemi">Start tracking your emotions to see your mood journey!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {[...recentMoods].slice(0, 5).map((mood: any) => (
                <div key={mood.id} className="bg-gradient-to-r from-white to-violet-50 rounded-2xl p-4 border border-violet-100 hover:shadow-md transition-all duration-200 group">
                  <div className="flex items-start gap-4">
                    <div className="text-4xl group-hover:scale-110 transition-transform duration-200">
                      {mood.mood_emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-gray-800 font-nohemi leading-relaxed mb-2">
                        {mood.mood_text || mood.mood_value}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span className="font-nohemi">
                          {new Date(mood.created_at).toLocaleDateString()} at {new Date(mood.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MoodboardPage;