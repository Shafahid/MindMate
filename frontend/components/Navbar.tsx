'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function Navbar() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    // Get current user
    const session = supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null)
    })

    // Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  return (
    <nav className="w-full bg-white shadow px-6 py-4 flex items-center justify-between">
      <Link href="/" className="text-2xl font-bold text-purple-600">
        MindMate
      </Link>

      <div className="flex items-center space-x-4">
        {!user ? (
          <>
            <Link
              href="/signin"
              className="px-4 py-2 rounded-lg border border-purple-600 text-purple-600 hover:bg-purple-50"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700"
            >
              Sign Up
            </Link>
          </>
        ) : (
          <>
            <Link
              href="/dashboard"
              className="px-4 py-2 rounded-lg border border-purple-600 text-purple-600 hover:bg-purple-50"
            >
              Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  )
}
