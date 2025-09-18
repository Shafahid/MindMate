'use client'

import { useState } from 'react'
import { Mail, Loader2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { forgotPassword } from '../../../lib/auth'
import toast, { Toaster } from 'react-hot-toast'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return toast.error('Please enter your email')

    setLoading(true)
    const { data, error } = await forgotPassword(email)
    setLoading(false)

    if (error) toast.error(error.message)
    else setSent(true)
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Toaster position="top-center" />
      <div className="w-full max-w-md border rounded-lg p-8 shadow bg-white">
        {!sent ? (
          <>
            <h2 className="text-2xl font-semibold mb-4 text-center">Forgot Password?</h2>
            <p className="text-sm mb-6 text-center">Enter your email to receive a reset link.</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-purple-600 text-white rounded-lg py-2 text-sm flex items-center justify-center"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Send Reset Link'}
              </button>
            </form>
            <Link href="/signin" className="block mt-4 text-center text-sm text-purple-600 hover:underline">
              Back to Sign In
            </Link>
          </>
        ) : (
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4">Check Your Email</h2>
            <p className="text-sm mb-4">A password reset link has been sent to:</p>
            <p className="font-medium mb-4">{email}</p>
            <Link href="/signin" className="text-purple-600 hover:underline">Back to Sign In</Link>
          </div>
        )}
      </div>
    </div>
  )
}
