'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { updatePassword } from '@/lib/auth'
import { toast, Toaster } from 'react-hot-toast'
import { Loader2, Lock } from 'lucide-react'

export default function UpdatePasswordPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [refreshToken, setRefreshToken] = useState<string | null>(null)
  const [newPassword, setNewPassword] = useState('')

  // Extract tokens from URL
  useEffect(() => {
    if (typeof window === 'undefined') return

    const searchParams = new URLSearchParams(window.location.search)
    let access = searchParams.get('access_token')
    let refresh = searchParams.get('refresh_token')

    if (!access || !refresh) {
      const hashParams = new URLSearchParams(window.location.hash.substring(1))
      access = access || hashParams.get('access_token')
      refresh = refresh || hashParams.get('refresh_token')
    }

    if (!access || !refresh) {
      setErrorMsg('Invalid or expired reset link. Please request a new one.')
    } else {
      setAccessToken(access)
      setRefreshToken(refresh)
    }
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long.')
      return
    }

    if (!accessToken || !refreshToken) {
      setErrorMsg('Missing tokens. Please use the reset link again.')
      return
    }

    setLoading(true)
    const { error } = await updatePassword(newPassword, accessToken, refreshToken)
    setLoading(false)

    if (error) {
      console.error(error)
      toast.error(error.message || 'Failed to update password')
    } else {
      toast.success('Password updated successfully! Please sign in.')
      router.push('/signin')
    }
  }

  if (errorMsg) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-red-600">{errorMsg}</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <Toaster position="top-center" />
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <div className="flex flex-col items-center mb-6">
          <Lock className="h-12 w-12 text-blue-600 mb-2" />
          <h1 className="text-2xl font-bold text-gray-800">Update Password</h1>
          <p className="text-sm text-gray-500 mt-1">
            Enter a new password with at least 6 characters.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              New Password
            </label>
            <input
              type="password"
              className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              Password must be at least 6 characters long.
            </p>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  )
}
