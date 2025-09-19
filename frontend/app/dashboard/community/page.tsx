"use client";
import React, { useState, useEffect } from "react";
import { submitPeerPost } from "@/lib/api/user_services";
import { supabase } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/auth";

const REACTION_EMOJIS = ["👍", "❤️", "😢", "😡"];

function CommunityPage() {
  const [postContent, setPostContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [user, setUser] = useState<any>(null);
  const [posts, setPosts] = useState<Array<any>>([]);
  const [reactions, setReactions] = useState<Record<string, Record<string, number>>>({}); // post_id: {emoji: count}
  const [userReactions, setUserReactions] = useState<Record<string, string>>({}); // post_id: emoji
  const [comments, setComments] = useState<Record<string, Array<any>>>({}); // post_id: comments[]
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

  // Fetch logged-in user
  useEffect(() => {
    async function fetchUser() {
      const { user } = await getCurrentUser();
      setUser(user);
    }
    fetchUser();
  }, []);

  // Fetch posts, reactions, and comments from Supabase
  useEffect(() => {
    async function fetchAll() {
      // Posts
      const { data: postsData } = await supabase
        .from("user_posts")
        .select("id, user_id, title, content, is_anonymous, created_at")
        .order("created_at", { ascending: false });
      if (postsData) setPosts(postsData);

      // Reactions
      const { data: reactionsData } = await supabase
        .from("post_reactions")
        .select("post_id, reaction_emoji");
      // Aggregate counts manually
      const reactionMap: Record<string, Record<string, number>> = {};
      if (reactionsData) {
        reactionsData.forEach((r: any) => {
          if (!reactionMap[r.post_id]) reactionMap[r.post_id] = {};
          reactionMap[r.post_id][r.reaction_emoji] = (reactionMap[r.post_id][r.reaction_emoji] || 0) + 1;
        });
        setReactions(reactionMap);
      }

      // User's own reactions
      if (user) {
        const { data: userReactData } = await supabase
          .from("post_reactions")
          .select("post_id, reaction_emoji")
          .eq("user_id", user.id);
        const userReactMap: Record<string, string> = {};
        if (userReactData) {
          userReactData.forEach((r: any) => {
            userReactMap[r.post_id] = r.reaction_emoji;
          });
          setUserReactions(userReactMap);
        }
      }

      // Comments
      const { data: commentsData } = await supabase
        .from("user_comments")
        .select("id, post_id, user_id, content, is_anonymous, created_at")
        .order("created_at", { ascending: true });
      const commentMap: Record<string, Array<any>> = {};
      if (commentsData) {
        commentsData.forEach((c: any) => {
          if (!commentMap[c.post_id]) commentMap[c.post_id] = [];
          commentMap[c.post_id].push(c);
        });
        setComments(commentMap);
      }
    }
    fetchAll();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setFeedback(null);
    if (!user) {
      setError("You must be logged in to post.");
      setLoading(false);
      return;
    }
    const res = await submitPeerPost(postContent, user.id);
    setLoading(false);
    if (res.error) {
      setError(res.error);
    } else {
      setFeedback(res.status === "accepted" ? "Your post was published!" : res.reason || "Post rejected.");
      setPostContent("");
      // If accepted, store in Supabase user_posts and refresh posts
      if (res.status === "accepted") {
        await supabase.from("user_posts").insert([
          {
            user_id: user.id,
            title: postContent.slice(0, 50),
            content: postContent,
            is_anonymous: true,
            created_at: new Date().toISOString(),
          },
        ]);
        // Refresh posts
        const { data, error } = await supabase
          .from("user_posts")
          .select("id, user_id, title, content, is_anonymous, created_at")
          .order("created_at", { ascending: false });
        if (!error && data) {
          setPosts(data);
        }
      }
    }
  };

  // Handle reaction click
  const handleReact = async (postId: string, emoji: string) => {
    if (!user) return;
    // Upsert reaction (unique per user per post)
    await supabase.from("post_reactions").upsert([
      {
        post_id: postId,
        user_id: user.id,
        reaction_emoji: emoji,
        created_at: new Date().toISOString(),
      },
    ], { onConflict: "post_id,user_id" });
    // Refresh reactions for this post only
    const { data: reactionsData } = await supabase
      .from("post_reactions")
      .select("reaction_emoji")
      .eq("post_id", postId);
    // Aggregate counts manually
    const counts: Record<string, number> = {};
    if (reactionsData) {
      reactionsData.forEach((r: any) => {
        counts[r.reaction_emoji] = (counts[r.reaction_emoji] || 0) + 1;
      });
    }
    setReactions(prev => ({
      ...prev,
      [postId]: counts,
    }));
    // Update user's own reactions
    setUserReactions(prev => ({ ...prev, [postId]: emoji }));
  };

  // Handle comment submit
  const handleCommentSubmit = async (e: React.FormEvent, postId: string) => {
    e.preventDefault();
    if (!user) return;
    const content = commentInputs[postId]?.trim();
    if (!content) return;
    await supabase.from("user_comments").insert([
      {
        post_id: postId,
        user_id: user.id,
        content,
        is_anonymous: true,
        created_at: new Date().toISOString(),
      },
    ]);
    // Refresh comments
    const { data: commentsData } = await supabase
      .from("user_comments")
      .select("id, post_id, user_id, content, is_anonymous, created_at")
      .order("created_at", { ascending: true });
    const commentMap: Record<string, Array<any>> = {};
    if (commentsData) {
      commentsData.forEach((c: any) => {
        if (!commentMap[c.post_id]) commentMap[c.post_id] = [];
        commentMap[c.post_id].push(c);
      });
      setComments(commentMap);
    }
    setCommentInputs(prev => ({ ...prev, [postId]: "" }));
  };

  return (
    <div className="max-w-2xl mx-auto py-10">
      <h2 className="text-2xl font-bold mb-4">Community Newsfeed</h2>
      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <input
          type="text"
          className="flex-1 border rounded px-3 py-2"
          value={postContent}
          onChange={e => setPostContent(e.target.value)}
          placeholder="Share your thoughts..."
          disabled={loading}
          required
        />
        <button
          type="submit"
          className="bg-violet-600 text-white px-4 py-2 rounded"
          disabled={loading || !postContent.trim()}
        >
          {loading ? "Posting..." : "Post"}
        </button>
      </form>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {feedback && <div className="text-green-600 mb-2">{feedback}</div>}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Recent Posts</h3>
        {posts.length === 0 ? (
          <div className="text-gray-500">No posts yet.</div>
        ) : (
          <ul className="space-y-4">
            {posts.map((post, idx) => (
              <li key={post.id || idx} className="bg-white border rounded p-4 shadow">
                <div className="mb-2 text-gray-800">{post.content}</div>
                <div className="text-xs text-gray-500">Posted {post.is_anonymous ? "anonymously" : "by user"} on {new Date(post.created_at).toLocaleString()}</div>
                {/* Reactions */}
                <div className="flex gap-2 mt-2">
                  {REACTION_EMOJIS.map(emoji => (
                    <button
                      key={emoji}
                      className={`px-2 py-1 rounded border ${userReactions[post.id] === emoji ? "border-violet-600 bg-violet-50" : "border-gray-200 bg-white"}`}
                      onClick={() => handleReact(post.id, emoji)}
                      disabled={!user}
                    >
                      <span className="text-xl">{emoji}</span>
                      <span className="ml-1 text-xs">{(reactions[post.id] && typeof reactions[post.id][emoji] === 'number') ? reactions[post.id][emoji] : 0}</span>
                    </button>
                  ))}
                </div>
                {/* Comments */}
                <div className="mt-4">
                  <h4 className="text-sm font-semibold mb-2">Comments</h4>
                  <form onSubmit={e => handleCommentSubmit(e, post.id)} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      className="flex-1 border rounded px-2 py-1"
                      value={commentInputs[post.id] || ""}
                      onChange={e => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                      placeholder="Add a comment..."
                      disabled={!user}
                      required
                    />
                    <button
                      type="submit"
                      className="bg-violet-600 text-white px-3 py-1 rounded"
                      disabled={!user || !(commentInputs[post.id] || "").trim()}
                    >
                      Comment
                    </button>
                  </form>
                  <ul className="space-y-2">
                    {(comments[post.id] || []).map((comment: any) => (
                      <li key={comment.id} className="bg-gray-50 border rounded px-2 py-1">
                        <span className="text-xs text-gray-700">{comment.content}</span>
                        <span className="ml-2 text-xs text-gray-400">{new Date(comment.created_at).toLocaleString()}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default CommunityPage;