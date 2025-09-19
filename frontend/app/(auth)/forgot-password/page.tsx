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
    const { error } = await forgotPassword(email)
    setLoading(false)

    if (error) toast.error(error.message)
    else {
      setSent(true)
      toast.success('Reset link sent to your email!')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-100 via-white to-purple-50 p-4">
      <Toaster position="top-center" />
      <div className="w-full max-w-md rounded-2xl border border-purple-200 bg-white shadow-lg p-8">
        {!sent ? (
          <>
            <h2 className="text-3xl font-bold mb-2 text-center text-purple-700">Forgot Password?</h2>
            <p className="text-sm text-gray-600 mb-8 text-center">
              Don’t worry! Enter your email below and we’ll send you a reset link.
            </p>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-purple-600 hover:bg-purple-700 transition text-white rounded-lg py-2.5 text-sm font-medium flex items-center justify-center"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Send Reset Link'}
              </button>
            </form>
            <div className="mt-6 text-center">
              <Link
                href="/signin"
                className="inline-flex items-center text-sm text-purple-600 hover:underline"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Sign In
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-3 text-green-600">Check Your Email</h2>
            <p className="text-sm text-gray-600 mb-2">We’ve sent a reset link to:</p>
            <p className="font-medium text-purple-700 mb-6">{email}</p>
            <Link
              href="/signin"
              className="inline-block bg-purple-600 hover:bg-purple-700 transition text-white rounded-lg px-6 py-2 text-sm font-medium"
            >
              Back to Sign In
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
