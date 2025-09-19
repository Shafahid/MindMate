"use client"

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '../../lib/supabase'
import { Loader2, Mail, Calendar, User, Edit2, Save, X, ShieldCheck, KeyRound, Lock, ArrowLeft } from 'lucide-react'

interface ProfileMetaForm {
  first_name: string
  last_name: string
}

export default function ProfilePage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sessionUser, setSessionUser] = useState<any>(null)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState<ProfileMetaForm>({ first_name: '', last_name: '' })
  const [pwEditing, setPwEditing] = useState(false)
  const [pwForm, setPwForm] = useState({ password: '', confirm: '' })
  const [pwSaving, setPwSaving] = useState(false)
  const [pwError, setPwError] = useState<string | null>(null)
  const [pwSuccess, setPwSuccess] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError(null)
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error) {
        setError(error.message)
      } else {
        setSessionUser(user)
        setForm({
          first_name: user?.user_metadata?.first_name || '',
          last_name: user?.user_metadata?.last_name || ''
        })
      }
      setLoading(false)
    }
    load()

  const { data: listener } = supabase.auth.onAuthStateChange((_evt: string, session: any) => {
      const u = session?.user
      setSessionUser(u)
      if (u) {
        setForm({
          first_name: u.user_metadata?.first_name || '',
          last_name: u.user_metadata?.last_name || ''
        })
      }
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  const handleSave = async () => {
    if (!sessionUser) return
    setSaving(true)
    const { error } = await supabase.auth.updateUser({
      data: { first_name: form.first_name, last_name: form.last_name }
    })
    if (error) {
      setError(error.message)
    } else {
      setEditing(false)
    }
    setSaving(false)
  }

  const handlePasswordSave = async () => {
    setPwError(null)
    setPwSuccess(null)
    if (!pwForm.password || !pwForm.confirm) {
      setPwError('Please fill both password fields.')
      return
    }
    if (pwForm.password.length < 8) {
      setPwError('Password must be at least 8 characters.')
      return
    }
    if (pwForm.password !== pwForm.confirm) {
      setPwError('Passwords do not match.')
      return
    }
    setPwSaving(true)
    const { error } = await supabase.auth.updateUser({ password: pwForm.password })
    if (error) {
      setPwError(error.message)
    } else {
      setPwSuccess('Password updated successfully.')
      setPwEditing(false)
      setPwForm({ password: '', confirm: '' })
    }
    setPwSaving(false)
  }

  // Layout states
  if (loading) {
    return (
      <main className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-12 border border-violet-200 text-center">
          <div className="flex items-center justify-center gap-3 text-violet-600">
            <Loader2 className="h-6 w-6 animate-spin" /> 
            <span className="font-nohemi font-medium">Loading profile...</span>
          </div>
        </div>
      </main>
    )
  }

  if (!sessionUser) {
    return (
      <main className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-12 border border-violet-200 text-center">
          <div className="mx-auto h-20 w-20 rounded-full bg-gradient-to-r from-violet-500 to-violet-600 flex items-center justify-center mb-6">
            <User className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold font-nohemi text-violet-700 mb-4">You are not signed in</h1>
          <p className="text-gray-600 font-nohemi mb-6">Please sign in to view and edit your profile.</p>
          <a 
            href="/signin" 
            className="inline-flex items-center bg-gradient-to-r from-violet-600 to-violet-700 text-white px-8 py-3 rounded-xl font-nohemi font-semibold shadow-lg hover:from-violet-700 hover:to-violet-800 transition-all duration-200 transform hover:scale-105"
          >
            Go to Sign In
          </a>
        </div>
      </main>
    )
  }

  return (
    <main className="max-w-4xl mx-auto space-y-6 mt-10">
      {/* Header Section */}
      <div className="bg-white/80 rounded-3xl p-8 border border-violet-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            
            <div>
              <h1 className="text-4xl font-bold font-nohemi text-violet-700 tracking-wide">Profile</h1>
              <p className="text-gray-600 font-nohemi mt-1">Manage your personal information and account settings</p>
            </div>
          </div>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm text-gray-700 
              font-nohemi font-medium rounded-xl border border-gray-300 shadow-md
              hover:bg-gray-50 hover:scale-105 hover:shadow-lg
              focus:ring-2 focus:ring-gray-400 focus:outline-none transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="text-red-700 font-nohemi font-medium">{error}</div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Summary Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-violet-200">
            <div className="text-center space-y-4">
              <div className="mx-auto h-24 w-24 rounded-full bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center text-white text-3xl font-bold font-nohemi shadow-lg">
                {form.first_name?.[0]?.toUpperCase() || sessionUser.email?.[0]?.toUpperCase() || 'U'}
              </div>
              <div>
                <h2 className="text-2xl font-bold font-nohemi text-gray-900">
                  {(form.first_name + ' ' + form.last_name).trim() || 'Unnamed User'}
                </h2>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <div className="flex items-center gap-1 bg-green-50 text-green-700 px-3 py-1 rounded-full border border-green-200">
                    <ShieldCheck className="h-4 w-4" /> 
                    <span className="text-sm font-nohemi font-medium">Active Account</span>
                  </div>
                </div>
              </div>
              <div className="text-sm font-nohemi text-gray-600 leading-relaxed bg-gradient-to-r from-violet-50 to-white p-4 rounded-xl border border-violet-100">
                Your profile information helps us personalize your MindMate experience.
              </div>
            </div>
          </div>

          
        </div>

        {/* Main editable area */}
        {/* Form Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Account Information Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-violet-200">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-bold font-nohemi text-violet-700 mb-2">Account Information</h3>
                <p className="text-gray-600 font-nohemi">Manage your account details and personal info.</p>
              </div>
              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-500 to-violet-600 
                    text-white font-nohemi font-medium rounded-xl shadow-lg border border-violet-500
                    hover:from-violet-600 hover:to-violet-700 hover:scale-105 hover:shadow-violet-200/50
                    focus:ring-2 focus:ring-violet-500 focus:outline-none transition-all duration-200"
                >
                  <Edit2 className="w-4 h-4" /> Edit
                </button>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 
                      text-white font-nohemi font-medium rounded-xl shadow-lg border border-emerald-500
                      hover:from-emerald-600 hover:to-emerald-700 hover:scale-105 hover:shadow-emerald-200/50
                      focus:ring-2 focus:ring-emerald-500 focus:outline-none 
                      disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100
                      transition-all duration-200"
                  >
                    {saving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Saving
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Save
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => { setEditing(false); setForm({ first_name: sessionUser.user_metadata?.first_name || '', last_name: sessionUser.user_metadata?.last_name || '' }) }}
                    className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm text-gray-700 
                      font-nohemi font-medium rounded-xl border border-gray-300 shadow-md
                      hover:bg-gray-50 hover:scale-105 hover:shadow-lg
                      focus:ring-2 focus:ring-gray-400 focus:outline-none transition-all duration-200"
                  >
                    <X className="w-4 h-4" /> Cancel
                  </button>
                </div>
              )}
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium font-nohemi text-gray-700 flex items-center gap-2">
                  <User className="w-4 h-4 text-violet-500" /> First Name
                </label>
                <input
                  type="text"
                  disabled={!editing}
                  value={form.first_name}
                  onChange={e => setForm(f => ({ ...f, first_name: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-violet-200 bg-white/80 backdrop-blur-sm 
                    font-nohemi text-gray-900 placeholder-gray-500 
                    focus:ring-2 focus:ring-violet-500 focus:border-violet-500 focus:outline-none 
                    disabled:bg-gray-100 disabled:text-gray-500 disabled:border-gray-200
                    transition-all duration-200 hover:border-violet-300"
                  placeholder="Enter first name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium font-nohemi text-gray-700 flex items-center gap-2">
                  <User className="w-4 h-4 text-violet-500" /> Last Name
                </label>
                <input
                  type="text"
                  disabled={!editing}
                  value={form.last_name}
                  onChange={e => setForm(f => ({ ...f, last_name: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-violet-200 bg-white/80 backdrop-blur-sm 
                    font-nohemi text-gray-900 placeholder-gray-500 
                    focus:ring-2 focus:ring-violet-500 focus:border-violet-500 focus:outline-none 
                    disabled:bg-gray-100 disabled:text-gray-500 disabled:border-gray-200
                    transition-all duration-200 hover:border-violet-300"
                  placeholder="Enter last name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium font-nohemi text-gray-700 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-violet-500" /> Email
                </label>
                <input
                  type="email"
                  disabled
                  value={sessionUser.email}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-100 
                    font-nohemi text-gray-700"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium font-nohemi text-gray-700 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-violet-500" /> Account Created
                </label>
                <input
                  type="text"
                  disabled
                  value={new Date(sessionUser.created_at).toLocaleString()}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-100 
                    font-nohemi text-gray-700"
                />
              </div>
            </div>
          </div>

          {/* Password Change Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-violet-200">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-bold font-nohemi text-violet-700 mb-2 flex items-center gap-2">
                  <KeyRound className="w-6 h-6 text-violet-500" /> 
                  Change Password
                </h3>
                <p className="text-gray-600 font-nohemi">Update your account password for enhanced security.</p>
              </div>
              {!pwEditing ? (
                <button
                  onClick={() => { setPwEditing(true); setPwError(null); setPwSuccess(null); }}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-500 to-violet-600 
                    text-white font-nohemi font-medium rounded-xl shadow-lg border border-violet-500
                    hover:from-violet-600 hover:to-violet-700 hover:scale-105 hover:shadow-violet-200/50
                    focus:ring-2 focus:ring-violet-500 focus:outline-none transition-all duration-200"
                >
                  <Edit2 className="w-4 h-4" /> Update
                </button>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={handlePasswordSave}
                    disabled={pwSaving}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 
                      text-white font-nohemi font-medium rounded-xl shadow-lg border border-emerald-500
                      hover:from-emerald-600 hover:to-emerald-700 hover:scale-105 hover:shadow-emerald-200/50
                      focus:ring-2 focus:ring-emerald-500 focus:outline-none 
                      disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100
                      transition-all duration-200"
                  >
                    {pwSaving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Saving
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Save
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => { setPwEditing(false); setPwForm({ password: '', confirm: '' }); setPwError(null); setPwSuccess(null); }}
                    className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm text-gray-700 
                      font-nohemi font-medium rounded-xl border border-gray-300 shadow-md
                      hover:bg-gray-50 hover:scale-105 hover:shadow-lg
                      focus:ring-2 focus:ring-gray-400 focus:outline-none transition-all duration-200"
                  >
                    <X className="w-4 h-4" /> Cancel
                  </button>
                </div>
              )}
            </div>

            {pwError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                <div className="text-red-700 font-nohemi font-medium">{pwError}</div>
              </div>
            )}
            {pwSuccess && (
              <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                <div className="text-emerald-700 font-nohemi font-medium">{pwSuccess}</div>
              </div>
            )}

            <div className="grid gap-6 md:grid-cols-2 mb-6">
              <div className="space-y-2">
                <label className="text-sm font-medium font-nohemi text-gray-700 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-violet-500" /> New Password
                </label>
                <input
                  type="password"
                  disabled={!pwEditing}
                  value={pwForm.password}
                  onChange={e => setPwForm(f => ({ ...f, password: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-violet-200 bg-white/80 backdrop-blur-sm 
                    font-nohemi text-gray-900 placeholder-gray-500 
                    focus:ring-2 focus:ring-violet-500 focus:border-violet-500 focus:outline-none 
                    disabled:bg-gray-100 disabled:text-gray-500 disabled:border-gray-200
                    transition-all duration-200 hover:border-violet-300"
                  placeholder="Enter new password"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium font-nohemi text-gray-700 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-violet-500" /> Confirm Password
                </label>
                <input
                  type="password"
                  disabled={!pwEditing}
                  value={pwForm.confirm}
                  onChange={e => setPwForm(f => ({ ...f, confirm: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-violet-200 bg-white/80 backdrop-blur-sm 
                    font-nohemi text-gray-900 placeholder-gray-500 
                    focus:ring-2 focus:ring-violet-500 focus:border-violet-500 focus:outline-none 
                    disabled:bg-gray-100 disabled:text-gray-500 disabled:border-gray-200
                    transition-all duration-200 hover:border-violet-300"
                  placeholder="Re-enter password"
                />
              </div>
            </div>

            <div className="bg-gradient-to-r from-violet-50 to-white p-4 rounded-xl border border-violet-100">
              <p className="text-sm font-nohemi text-gray-600 leading-relaxed">
                Use a strong password (12+ characters recommended). If you forget it later, use the 
                Forgot Password link on sign in to reset via email.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}