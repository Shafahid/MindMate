"use client"

import React, { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { Loader2, Mail, Calendar, User, Edit2, Save, X, ShieldCheck, KeyRound, Lock } from 'lucide-react'

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
      <main className="max-w-4xl mx-auto px-4 py-16">
        <div className="flex items-center gap-3 text-gray-600"><Loader2 className="h-5 w-5 animate-spin" /> Loading profile...</div>
      </main>
    )
  }

  if (!sessionUser) {
    return (
      <main className="max-w-xl mx-auto px-4 py-24 text-center space-y-6">
        <div className="mx-auto h-16 w-16 rounded-full bg-violet-100 flex items-center justify-center">
          <User className="h-8 w-8 text-violet-600" />
        </div>
        <h1 className="text-2xl font-semibold text-gray-900">You are not signed in</h1>
        <p className="text-gray-600 text-sm">Please sign in to view and edit your profile.</p>
        <a href="/signin" className="inline-flex items-center rounded-md bg-violet-600 px-5 py-2.5 text-sm font-medium text-white shadow hover:bg-violet-700 transition">Go to Sign In</a>
      </main>
    )
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-12 space-y-10">
      <header className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">Profile</h1>
        <p className="text-gray-600 text-sm md:text-base">Manage your personal information associated with your MindMate account.</p>
      </header>

      {error && (
        <div className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      <section className="grid gap-8 md:grid-cols-3">
        {/* Left summary card */}
        <div className="md:col-span-1 space-y-6">
          <div className="rounded-2xl bg-white/70 backdrop-blur-sm shadow-sm ring-1 ring-black/5 p-6 space-y-5">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white text-2xl font-semibold">
                {form.first_name?.[0]?.toUpperCase() || sessionUser.email?.[0]?.toUpperCase() || 'U'}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {(form.first_name + ' ' + form.last_name).trim() || 'Unnamed User'}
                </h2>
                <div className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                  <ShieldCheck className="h-3.5 w-3.5" /> Active Account
                </div>
              </div>
            </div>
            <div className="text-xs text-gray-500 leading-relaxed">
              Your profile information helps us personalize your experience. Only your email is required.
            </div>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white p-6 shadow-md space-y-4">
            <h3 className="text-sm font-medium tracking-wide opacity-90">Account Tips</h3>
            <ul className="space-y-2 text-xs opacity-90">
              <li>• Keep your info updated for a tailored experience.</li>
              <li>• Use a strong password and never share credentials.</li>
              <li>• Contact support if you notice suspicious activity.</li>
            </ul>
          </div>
        </div>

        {/* Main editable area */}
        <div className="md:col-span-2 space-y-8">
          <div className="rounded-2xl bg-white/70 backdrop-blur-sm shadow-sm ring-1 ring-black/5 p-6 space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Account Information</h3>
              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className="inline-flex items-center gap-1.5 rounded-md border border-violet-200 bg-white px-3 py-1.5 text-xs font-medium text-violet-700 hover:bg-violet-600 hover:text-white hover:border-violet-600 transition"
                >
                  <Edit2 className="h-3.5 w-3.5" /> Edit
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="inline-flex items-center gap-1.5 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition disabled:opacity-50"
                  >
                    {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />} Save
                  </button>
                  <button
                    onClick={() => { setEditing(false); setForm({ first_name: sessionUser.user_metadata?.first_name || '', last_name: sessionUser.user_metadata?.last_name || '' }) }}
                    className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 transition"
                  >
                    <X className="h-3.5 w-3.5" /> Cancel
                  </button>
                </div>
              )}
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-600 flex items-center gap-1">
                  <User className="h-3.5 w-3.5 text-violet-500" /> First Name
                </label>
                <input
                  type="text"
                  disabled={!editing}
                  value={form.first_name}
                  onChange={e => setForm(f => ({ ...f, first_name: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 bg-white/60 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 disabled:bg-gray-100 disabled:text-gray-500"
                  placeholder="Enter first name"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-600 flex items-center gap-1">
                  <User className="h-3.5 w-3.5 text-violet-500" /> Last Name
                </label>
                <input
                  type="text"
                  disabled={!editing}
                  value={form.last_name}
                  onChange={e => setForm(f => ({ ...f, last_name: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 bg-white/60 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 disabled:bg-gray-100 disabled:text-gray-500"
                  placeholder="Enter last name"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-600 flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5 text-violet-500" /> Email
                </label>
                <input
                  type="email"
                  disabled
                  value={sessionUser.email}
                  className="w-full rounded-lg border border-gray-200 bg-gray-100 px-3 py-2 text-sm text-gray-700"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-600 flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-violet-500" /> Created
                </label>
                <input
                  type="text"
                  disabled
                  value={new Date(sessionUser.created_at).toLocaleString()}
                  className="w-full rounded-lg border border-gray-200 bg-gray-100 px-3 py-2 text-xs text-gray-700"
                />
              </div>
            </div>
          </div>
          {/* Password Change Section */}
          <div className="rounded-2xl bg-white/70 backdrop-blur-sm shadow-sm ring-1 ring-black/5 p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2"><KeyRound className="h-4 w-4 text-violet-500" /> Change Password</h3>
              {!pwEditing ? (
                <button
                  onClick={() => { setPwEditing(true); setPwError(null); setPwSuccess(null); }}
                  className="inline-flex items-center gap-1.5 rounded-md border border-violet-200 bg-white px-3 py-1.5 text-xs font-medium text-violet-700 hover:bg-violet-600 hover:text-white hover:border-violet-600 transition"
                >
                  <Edit2 className="h-3.5 w-3.5" /> Update
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handlePasswordSave}
                    disabled={pwSaving}
                    className="inline-flex items-center gap-1.5 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition disabled:opacity-50"
                  >
                    {pwSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />} Save
                  </button>
                  <button
                    onClick={() => { setPwEditing(false); setPwForm({ password: '', confirm: '' }); setPwError(null); setPwSuccess(null); }}
                    className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 transition"
                  >
                    <X className="h-3.5 w-3.5" /> Cancel
                  </button>
                </div>
              )}
            </div>
            {pwError && <div className="text-xs rounded-md bg-red-50 border border-red-200 text-red-600 px-3 py-2">{pwError}</div>}
            {pwSuccess && <div className="text-xs rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 px-3 py-2">{pwSuccess}</div>}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-600 flex items-center gap-1">
                  <Lock className="h-3.5 w-3.5 text-violet-500" /> New Password
                </label>
                <input
                  type="password"
                  disabled={!pwEditing}
                  value={pwForm.password}
                  onChange={e => setPwForm(f => ({ ...f, password: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 bg-white/60 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 disabled:bg-gray-100 disabled:text-gray-500"
                  placeholder="Enter new password"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-600 flex items-center gap-1">
                  <Lock className="h-3.5 w-3.5 text-violet-500" /> Confirm Password
                </label>
                <input
                  type="password"
                  disabled={!pwEditing}
                  value={pwForm.confirm}
                  onChange={e => setPwForm(f => ({ ...f, confirm: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 bg-white/60 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 disabled:bg-gray-100 disabled:text-gray-500"
                  placeholder="Re-enter password"
                />
              </div>
            </div>
            <p className="text-[11px] text-gray-500 leading-relaxed">Use a strong password (12+ chars recommended). If you forget it later, use the Forgot Password link on sign in to reset via email.</p>
          </div>
        </div>
      </section>
    </main>
  )
}