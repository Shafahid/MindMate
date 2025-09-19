// lib/auth.ts
import { supabase } from './supabase'

type SupabaseResult<T = any> = Promise<{ data?: T; error?: any }>
// Sign up
export const signUp = async (
  email: string,
  password: string,
  firstName?: string,
  lastName?: string
) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName || '',
        last_name: lastName || ''
      }
    }
  })
  return { data, error }
}

// Sign in
export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  return { data, error }
}

// Sign out
export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

// Get current user
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser()
  return { user, error }
}

export async function forgotPassword(email: string): SupabaseResult {
  if (typeof window === 'undefined') {
    throw new Error('forgotPassword must be called from the browser')
  }
  const redirectTo = `${window.location.origin}/update-password` // keep this route consistent with your app
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo })
  return { data, error }
}

/**
 * updatePassword:
 * - first sets session using tokens (access + refresh)
 * - then calls updateUser to change password
 * Returns { data, error } from supabase.auth.updateUser
 */
export async function updatePassword(
  newPassword: string,
  accessToken: string,
  refreshToken: string
): SupabaseResult {
  if (!accessToken || !refreshToken) {
    return { error: new Error('Missing access or refresh token') }
  }

  // set session for the client
  const { error: setError } = await supabase.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken,
  })
  if (setError) return { error: setError }

  // update the password for the current (now-set) session
  const { data, error } = await supabase.auth.updateUser({ password: newPassword })
  return { data, error }
}