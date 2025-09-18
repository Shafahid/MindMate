'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { updatePassword } from '@/lib/auth'
import { toast } from 'react-hot-toast'

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

    // First try query params (?access_token=...&refresh_token=...)
    const searchParams = new URLSearchParams(window.location.search)
    let access = searchParams.get('access_token')
    let refresh = searchParams.get('refresh_token')

    

    // Fallback to hash fragment (#access_token=...&refresh_token=...)
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
      toast.success('Password updated successfully! Please log in.')
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
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow">
        <h1 className="mb-4 text-xl font-semibold">Update Your Password</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">New Password</label>
            <input
              type="password"
              className="w-full rounded border px-3 py-2"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  )
}
