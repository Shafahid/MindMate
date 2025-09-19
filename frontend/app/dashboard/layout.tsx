import React from 'react'

export const metadata = {
  title: 'Dashboard | MindMate'
}

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-violet-50 to-indigo-50">
      {/* Placeholder for future sidebar / topbar */}
      <div className="mx-auto max-w-7xl px-4 py-8">
        {children}
      </div>
    </div>
  )
}
