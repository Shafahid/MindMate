
import { supabase } from '../supabase'
// Fetch mood entries for a user
// Fetch mood entries for a user (schema: id, user_id, mood_value, created_at)
export async function fetchUserMoodEntries(userId: string): Promise<any[]> {
	const { data, error } = await supabase
		.from('mood_entries')
		.select('id, user_id, mood_value, created_at')
		.eq('user_id', userId)
		.gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
		.order('created_at', { ascending: true })
	if (error) throw error
	return data || []
}
// Comment moderation API service
export async function submitComment(content: string, postId: string, userId?: string): Promise<{ status?: string; comment_id?: string; reason?: string; model_label?: string; confidence?: number; error?: string }> {
	const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || '';
	try {
		const res = await fetch(`${backendUrl}/comment`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ content, post_id: postId, user_id: userId }),
		});
		const data = await res.json();
		if (!res.ok) {
			return { error: data?.error || data?.reason || 'Comment failed' };
		}
		return data;
	} catch (err: any) {
		return { error: err.message || 'Network error' };
	}
}
// Moodboard API service
export async function submitMood(moodText: string, userId?: string): Promise<{ status?: string; entry_id?: string; label?: string; confidence?: number; reason?: string; error?: string }> {
	const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || '';
	try {
		const res = await fetch(`${backendUrl}/mood`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ mood_text: moodText, user_id: userId }),
		});
		const data = await res.json();
		if (!res.ok) {
			return { error: data?.error || 'Mood submission failed' };
		}
		return data;
	} catch (err: any) {
		return { error: err.message || 'Network error' };
	}
}
// Community Peer Post API service
export async function submitPeerPost(content: string, userId?: string): Promise<{ status?: string; post_id?: string; reason?: string; model_label?: string; confidence?: number; error?: string }> {
	const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || '';
	try {
		const res = await fetch(`${backendUrl}/peer`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ content, user_id: userId }),
		});
		const data = await res.json();
		if (!res.ok) {
			return { error: data?.error || data?.reason || 'Peer post failed' };
		}
		return data;
	} catch (err: any) {
		return { error: err.message || 'Network error' };
	}
}
// Voice Chat API service
export async function sendVoiceMessage(file: File, userId?: string): Promise<{ chat_id?: string; transcribed_text?: string; ai_response?: string; error?: string }> {
	const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || '';
	const formData = new FormData();
	formData.append('file', file);
	if (userId) formData.append('user_id', userId);
	try {
		const res = await fetch(`${backendUrl}/chat/voice`, {
			method: 'POST',
			body: formData,
		});
		if (!res.ok) {
			const errorData = await res.json();
			return { error: errorData.detail || 'Voice chat request failed' };
		}
		return await res.json();
	} catch (err: any) {
		return { error: err.message || 'Network error' };
	}
}
// Chatbot API service
export async function sendChatMessage(messages: Array<{ sender: string; text: string }>, userId?: string): Promise<{ chat_id?: string; response?: string; error?: string }> {
	const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || '';
	try {
		const res = await fetch(`${backendUrl}/chat`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ messages, user_id: userId }),
		});
		if (!res.ok) {
			const errorData = await res.json();
			return { error: errorData.detail || 'Chat request failed' };
		}
		return await res.json();
	} catch (err: any) {
		return { error: err.message || 'Network error' };
	}
}
