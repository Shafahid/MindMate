"use client";
import React, { useState, useEffect } from "react";
import { submitPeerPost, submitComment } from "@/lib/api/user_services";
import { supabase } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/auth";
import { Heart, ThumbsUp, MessageCircle, Clock, Users, Send, Plus, MoreVertical, Trash2, Edit2 } from "lucide-react";

const REACTION_EMOJIS = ["👍", "❤️", "😢", "😡"];

function CommunityPage() {
  const [postContent, setPostContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [user, setUser] = useState<any>(null);
  const [posts, setPosts] = useState<Array<any>>([]);
  const [reactions, setReactions] = useState<Record<string, Record<string, number>>>({});
  const [userReactions, setUserReactions] = useState<Record<string, string>>({});
  const [comments, setComments] = useState<Record<string, Array<any>>>({});
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [showPostForm, setShowPostForm] = useState(false);
  // Edit states
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editingPostContent, setEditingPostContent] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingCommentContent, setEditingCommentContent] = useState("");
  const [showPostMenuId, setShowPostMenuId] = useState<string | null>(null);
  const [showCommentMenuId, setShowCommentMenuId] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    async function fetchUser() {
      const { user } = await getCurrentUser();
      setUser(user);
      if (user) {
        // Fetch profile for first_name
        const { data: profileData } = await supabase
          .from('profiles')
          .select('first_name')
          .eq('id', user.id)
          .single();
        setProfile(profileData);
      }
    }
    fetchUser();
  }, []);
  // Delete post
  const handleDeletePost = async (postId: string) => {
    await supabase.from('user_posts').delete().eq('id', postId);
    setShowPostMenuId(null);
    // Refresh posts
    const { data, error } = await supabase
      .from('user_posts')
      .select('id, user_id, title, content, is_anonymous, created_at')
      .order('created_at', { ascending: false });
    if (!error && data) {
      setPosts(data);
    }
    setFeedback('Post deleted!');
  };

  // Delete comment
  const handleDeleteComment = async (commentId: string) => {
    await supabase.from('user_comments').delete().eq('id', commentId);
    setShowCommentMenuId(null);
    // Refresh comments
    const { data: commentsData } = await supabase
      .from('user_comments')
      .select('id, post_id, user_id, content, is_anonymous, created_at')
      .order('created_at', { ascending: true });
    const commentMap: Record<string, Array<any>> = {};
    if (commentsData) {
      commentsData.forEach((c: any) => {
        if (!commentMap[c.post_id]) commentMap[c.post_id] = [];
        commentMap[c.post_id].push(c);
      });
      setComments(commentMap);
    }
    setFeedback('Comment deleted!');
  };

  useEffect(() => {
    async function fetchAll() {
      const { data: postsData } = await supabase
        .from("user_posts")
        .select("id, user_id, title, content, is_anonymous, created_at")
        .order("created_at", { ascending: false });
      if (postsData) setPosts(postsData);

      const { data: reactionsData } = await supabase
        .from("post_reactions")
        .select("post_id, reaction_emoji");
      const reactionMap: Record<string, Record<string, number>> = {};
      if (reactionsData) {
        reactionsData.forEach((r: any) => {
          if (!reactionMap[r.post_id]) reactionMap[r.post_id] = {};
          reactionMap[r.post_id][r.reaction_emoji] = (reactionMap[r.post_id][r.reaction_emoji] || 0) + 1;
        });
        setReactions(reactionMap);
      }

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
    if (res.error || res.status === "rejected") {
      setError("Your post does not meet our community standards. Please rephrase and try again.");
      return;
    }
    setFeedback(res.status === "accepted" ? "Your post was published!" : res.reason || "Post rejected.");
    setPostContent("");
    setShowPostForm(false);
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
      const { data, error } = await supabase
        .from("user_posts")
        .select("id, user_id, title, content, is_anonymous, created_at")
        .order("created_at", { ascending: false });
      if (!error && data) {
        setPosts(data);
      }
    }
  };

  const handleReact = async (postId: string, emoji: string) => {
    if (!user) return;
    await supabase.from("post_reactions").upsert([
      {
        post_id: postId,
        user_id: user.id,
        reaction_emoji: emoji,
        created_at: new Date().toISOString(),
      },
    ]);
    const { data: reactionsData } = await supabase
      .from("post_reactions")
      .select("reaction_emoji")
      .eq("post_id", postId);
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
    setUserReactions(prev => ({ ...prev, [postId]: emoji }));
  };

  const handleCommentSubmit = async (e: React.FormEvent, postId: string) => {
    e.preventDefault();
    if (!user) return;
    const content = commentInputs[postId]?.trim();
    if (!content) return;
    // Moderate comment before storing
    const res = await submitComment(content, postId, user.id);
    if (res.error || res.status === "rejected") {
      setError("Your comment does not meet our community standards. Please rephrase and try again.");
      return;
    }
    if (res.status === "accepted") {
      await supabase.from("user_comments").insert([
        {
          post_id: postId,
          user_id: user.id,
          content,
          is_anonymous: true,
          created_at: new Date().toISOString(),
        },
      ]);
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
    }
  };

  // Edit post handler
  const handleEditPost = (post: any) => {
    setEditingPostId(post.id);
    setEditingPostContent(post.content);
    setError("");
    setFeedback(null);
  };

  // Save edited post
  const handleSaveEditPost = async (post: any) => {
    setLoading(true);
    setError("");
    setFeedback(null);
    if (!user) {
      setError("You must be logged in to edit.");
      setLoading(false);
      return;
    }
    // Moderate updated post
    const res = await submitPeerPost(editingPostContent, user.id);
    setLoading(false);
    if (res.error || res.status === "rejected") {
      setError("Your update does not meet our community standards. Please rephrase and try again.");
      return;
    }
    if (res.status === "accepted") {
      await supabase.from("user_posts").update({ content: editingPostContent, title: editingPostContent.slice(0, 50) }).eq("id", post.id);
      setEditingPostId(null);
      setEditingPostContent("");
      // Refresh posts
      const { data, error } = await supabase
        .from("user_posts")
        .select("id, user_id, title, content, is_anonymous, created_at")
        .order("created_at", { ascending: false });
      if (!error && data) {
        setPosts(data);
      }
      setFeedback("Post updated!");
    }
  };

  // Edit comment handler
  const handleEditComment = (comment: any) => {
    setEditingCommentId(comment.id);
    setEditingCommentContent(comment.content);
    setError("");
    setFeedback(null);
  };

  // Save edited comment
  const handleSaveEditComment = async (comment: any) => {
    if (!user) return;
    // Moderate updated comment
    const res = await submitComment(editingCommentContent, comment.post_id, user.id);
    if (res.error || res.status === "rejected") {
      setError("Your update does not meet our community standards. Please rephrase and try again.");
      return;
    }
    if (res.status === "accepted") {
      await supabase.from("user_comments").update({ content: editingCommentContent }).eq("id", comment.id);
      setEditingCommentId(null);
      setEditingCommentContent("");
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
      setFeedback("Comment updated!");
    }
  };

  // Cancel edit
  const handleCancelEdit = () => {
    setEditingPostId(null);
    setEditingPostContent("");
    setEditingCommentId(null);
    setEditingCommentContent("");
    setError("");
    setFeedback(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Section */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-violet-200">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-r from-violet-500 to-violet-600 rounded-2xl">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold font-nohemi text-violet-700 tracking-wide">
                Community Hub
              </h1>
              <p className="text-gray-600 font-nohemi mt-1">Share your thoughts and connect with others</p>
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-violet-600">{posts.length}</div>
            <div className="text-sm text-gray-500 font-nohemi">Posts</div>
          </div>
        </div>

        {/* Create Post Button */}
        {!showPostForm ? (
          <button
            onClick={() => setShowPostForm(true)}
            className="w-full bg-gradient-to-r from-violet-100 to-violet-50 hover:from-violet-200 hover:to-violet-100 border-2 border-dashed border-violet-300 rounded-2xl p-6 transition-all duration-200 group transform hover:scale-105"
          >
            <div className="flex items-center justify-center gap-3">
              <Plus className="w-6 h-6 text-violet-600 group-hover:scale-110 transition-transform" />
              <span className="text-violet-700 font-nohemi font-normal cursor-pointer text-lg">
                Share your thoughts with the community...
              </span>
            </div>
          </button>
        ) : (
          /* Create Post Form */
          <div className="bg-gradient-to-br from-violet-50 to-white rounded-2xl p-6 border border-violet-200">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-md font-nohemi font-normal text-violet-700 mb-2">
                  What's on your mind?
                </label>
                <textarea
                  className="w-full border-2 border-violet-200 rounded-xl px-4 py-3 font-nohemi focus:outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100 bg-white/70 backdrop-blur-sm shadow-sm resize-none"
                  rows={4}
                  value={postContent}
                  onChange={e => setPostContent(e.target.value)}
                  placeholder="Share your thoughts, experiences, or ask for support..."
                  disabled={loading}
                  required
                />
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowPostForm(false);
                    setPostContent("");
                  }}
                  className="px-6 py-2 font-nohemi font-semibold text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-violet-700 text-white px-6 py-3 rounded-xl font-nohemi font-semibold shadow-lg hover:from-violet-700 hover:to-violet-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
                  disabled={loading || !postContent.trim()}
                >
                  <Send className="w-4 h-4" />
                  {loading ? "Posting..." : "Share Post"}
                </button>
              </div>
            </form>
          </div>
        )}

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
              <span className="font-nohemi font-medium">{feedback}</span>
            </div>
          </div>
        )}
      </div>

      {/* Posts Section */}
      <div className="space-y-6">
        {posts.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-12 border border-violet-200 text-center">
            <div className="text-6xl mb-4">💭</div>
            <h3 className="text-2xl font-nohemi font-bold text-violet-700 mb-2">No posts yet</h3>
            <p className="text-gray-600 font-nohemi">Be the first to share your thoughts with the community!</p>
          </div>
        ) : (
          posts.map((post, idx) => (
            <div key={post.id || idx} className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-violet-200 overflow-hidden">
              {/* Post Header */}
              <div className="p-6 bg-gradient-to-r from-violet-50 to-white border-b border-violet-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-violet-500 to-violet-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">A</span>
                    </div>
                    <div>
                      <div className="font-nohemi font-semibold text-gray-800 relative">
                        {user && post.user_id === user.id
                          ? `You (${profile?.first_name || 'User'})`
                          : "Anonymous"}
                        {/* Three-dot menu for own post */}
                        {user && post.user_id === user.id && (
                          <button
                            className="ml-2 p-1 rounded-full hover:bg-violet-100"
                            onClick={() => setShowPostMenuId(showPostMenuId === post.id ? null : post.id)}
                            aria-label="Post menu"
                          >
                            <MoreVertical className="w-5 h-5 text-violet-700" />
                          </button>
                        )}
                        {/* Removed extra edit button for own post, only three-dot menu is shown */}
                        {showPostMenuId === post.id && (
                          <div className="absolute z-10 right-0 mt-2 bg-white border border-violet-200 rounded-xl shadow-lg py-2 w-32">
                            <button
                              className="flex items-center gap-2 px-4 py-2 w-full hover:bg-violet-50 text-violet-700"
                              onClick={() => { setShowPostMenuId(null); handleEditPost(post); }}
                            >
                              <Edit2 className="w-4 h-4" /> Edit
                            </button>
                            <button
                              className="flex items-center gap-2 px-4 py-2 w-full hover:bg-red-50 text-red-600"
                              onClick={() => handleDeletePost(post.id)}
                            >
                              <Trash2 className="w-4 h-4" /> Delete
                            </button>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        {new Date(post.created_at).toLocaleDateString()} at {new Date(post.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Post Content */}
              <div className="p-6">
                {/* Edit post UI for owner */}
                {user && post.user_id === user.id && editingPostId === post.id ? (
                  <div className="mb-4">
                    <textarea
                      className="w-full border-2 border-violet-200 rounded-xl px-4 py-3 font-nohemi focus:outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100 bg-white/70 backdrop-blur-sm shadow-sm resize-none mb-2"
                      rows={4}
                      value={editingPostContent}
                      onChange={e => setEditingPostContent(e.target.value)}
                    />
                    <div className="flex gap-2">
                      <button
                        className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-nohemi font-semibold shadow-lg hover:from-emerald-600 hover:to-emerald-700"
                        onClick={() => handleSaveEditPost(post)}
                        disabled={loading || !editingPostContent.trim()}
                      >Save</button>
                      <button
                        className="px-4 py-2 bg-white border border-gray-300 rounded-xl font-nohemi font-medium text-gray-700 hover:bg-gray-50"
                        onClick={handleCancelEdit}
                      >Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-800 font-nohemi leading-relaxed mb-4">
                    {post.content}
                  </div>
                )}
                {/* Removed extra edit button for own post. Only three-dot menu is used. */}

                {/* Reactions */}
                <div className="flex gap-2 mb-4">
                  {REACTION_EMOJIS.map(emoji => (
                    <button
                      key={emoji}
                      className={`flex items-center gap-1 px-3 py-2 rounded-xl border-2 transition-all duration-200 transform hover:scale-105 ${
                        userReactions[post.id] === emoji 
                          ? "border-violet-400 bg-violet-50 shadow-md" 
                          : "border-gray-200 bg-white hover:border-violet-200 hover:bg-violet-50"
                      }`}
                      onClick={() => handleReact(post.id, emoji)}
                      disabled={!user}
                    >
                      <span className="text-lg">{emoji}</span>
                      <span className="text-sm font-nohemi font-semibold text-gray-600">
                        {(reactions[post.id] && typeof reactions[post.id][emoji] === 'number') ? reactions[post.id][emoji] : 0}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Comments Section */}
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-4 border border-gray-100">
                  <div className="flex items-center gap-2 mb-3">
                    <MessageCircle className="w-4 h-4 text-violet-600" />
                    <h4 className="text-sm font-nohemi font-semibold text-violet-700">Comments</h4>
                  </div>

                  {/* Add Comment Form */}
                  <form onSubmit={e => handleCommentSubmit(e, post.id)} className="flex gap-2 mb-4">
                    <input
                      type="text"
                      className="flex-1 border-2 border-gray-200 rounded-xl px-3 py-2 font-nohemi text-sm focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 bg-white"
                      value={commentInputs[post.id] || ""}
                      onChange={e => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                      placeholder="Add a thoughtful comment..."
                      disabled={!user}
                      required
                    />
                    <button
                      type="submit"
                      className="bg-gradient-to-r from-violet-600 to-violet-700 text-white px-4 py-2 rounded-xl font-nohemi font-semibold shadow-md hover:from-violet-700 hover:to-violet-800 disabled:opacity-50 transition-all duration-200 transform hover:scale-105"
                      disabled={!user || !(commentInputs[post.id] || "").trim()}
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>

                  {/* Comments List */}
                  <div className="space-y-3">
                    {(comments[post.id] || []).map((comment: any) => (
                      <div key={comment.id} className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm">
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-bold text-xs">A</span>
                          </div>
                          <div className="flex-1">
                            {/* Edit comment UI for owner */}
                            {user && comment.user_id === user.id && editingCommentId === comment.id ? (
                              <div className="mb-2">
                                <textarea
                                  className="w-full border-2 border-violet-200 rounded-xl px-3 py-2 font-nohemi text-sm focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 bg-white mb-2"
                                  rows={2}
                                  value={editingCommentContent}
                                  onChange={e => setEditingCommentContent(e.target.value)}
                                />
                                <div className="flex gap-2">
                                  <button
                                    className="px-3 py-1 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-nohemi font-semibold shadow-lg hover:from-emerald-600 hover:to-emerald-700"
                                    onClick={() => handleSaveEditComment(comment)}
                                    disabled={!editingCommentContent.trim()}
                                  >Save</button>
                                  <button
                                    className="px-3 py-1 bg-white border border-gray-300 rounded-xl font-nohemi font-medium text-gray-700 hover:bg-gray-50"
                                    onClick={handleCancelEdit}
                                  >Cancel</button>
                                </div>
                              </div>
                            ) : (
                              <div className="text-sm font-nohemi text-gray-800 leading-relaxed">
                                {comment.content}
                              </div>
                            )}
                            {/* Three-dot menu for own comment, aligned at end */}
                            {user && comment.user_id === user.id && (
                              <div className="relative flex justify-end items-center" style={{ minHeight: '32px' }}>
                                <button
                                  className="p-1 rounded-full hover:bg-violet-100"
                                  onClick={() => setShowCommentMenuId(showCommentMenuId === comment.id ? null : comment.id)}
                                  aria-label="Comment menu"
                                  style={{ marginLeft: 'auto' }}
                                >
                                  <MoreVertical className="w-4 h-4 text-violet-700" />
                                </button>
                                {showCommentMenuId === comment.id && (
                                  <div className="absolute z-10 right-0 mt-2 bg-white border border-violet-200 rounded-xl shadow-lg py-2 w-28">
                                    <button
                                      className="flex items-center gap-2 px-4 py-2 w-full hover:bg-violet-50 text-violet-700"
                                      onClick={() => { setShowCommentMenuId(null); handleEditComment(comment); }}
                                    >
                                      <Edit2 className="w-4 h-4" /> Edit
                                    </button>
                                    <button
                                      className="flex items-center gap-2 px-4 py-2 w-full hover:bg-red-50 text-red-600"
                                      onClick={() => handleDeleteComment(comment.id)}
                                    >
                                      <Trash2 className="w-4 h-4" /> Delete
                                    </button>
                                  </div>
                                )}
                              </div>
                            )}
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-gray-500 font-nohemi">
                                {user && comment.user_id === user.id
                                  ? `You (${profile?.first_name || 'User'})`
                                  : "Anonymous"}
                              </span>
                              <span className="text-xs text-gray-400">•</span>
                              <span className="text-xs text-gray-400">
                                {new Date(comment.created_at).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {(!comments[post.id] || comments[post.id].length === 0) && (
                      <div className="text-center py-4 text-gray-500 text-sm font-nohemi">
                        No comments yet. Be the first to comment!
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default CommunityPage;