"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signUp } from '../../../lib/auth'

export default function SignUpPage() {
  const router = useRouter()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSignUp = async () => {
    if (!email || !password || !firstName || !lastName) {
      alert('Please fill all fields')
      return
    }

    setLoading(true)
    const { data, error } = await signUp(email, password, firstName, lastName)
    setLoading(false)

    if (error) {
      alert(error.message)
    } else {
      alert('Check your email to confirm your account!')
      router.push('/signin')
    }
  }

  return (
    <div className="flex flex-col gap-4 max-w-md mx-auto mt-20 p-4 border rounded shadow">
      <h1 className="text-2xl font-bold text-center">Sign Up</h1>

      <input
        type="text"
        placeholder="First Name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        className="border p-2 rounded"
      />
      <input
        type="text"
        placeholder="Last Name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        className="border p-2 rounded"
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 rounded"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 rounded"
      />

      <button
        onClick={handleSignUp}
        disabled={loading}
        className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
      >
        {loading ? 'Signing Up...' : 'Sign Up'}
      </button>

      <p className="text-center text-sm mt-2">
        Already have an account?{' '}
        <Link href="/signin" className="text-blue-500 underline">
          Login
        </Link>
      </p>
    </div>
  )
}
