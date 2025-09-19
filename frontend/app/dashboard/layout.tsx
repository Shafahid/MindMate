// app/dashboard/layout.tsx
import Link from "next/link";
import { Bot, Users, LifeBuoy, BarChart2, Hammer, User, LogOut } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-700 via-violet-100 to-white">
      {/* Sidebar */}
      <aside className="w-72 bg-gradient-to-b from-violet-200 to-gray-100 shadow-xl rounded-r-3xl p-6 flex flex-col justify-between border-r border-violet-300">
        <div>
          <div className="flex flex-col items-center mb-10">
            <img src="/mindmate.png" alt="Logo" className="w-16 h-16 mb-4 rounded-2xl border-2 border-violet-500" />
            <h2 className="text-3xl font-bold font-nohemi text-violet-700 tracking-wide mb-2">MindMate</h2>
            <span className="text-xl text-gray-800 font-light font-nohemi">Mental Health Buddy</span>
          </div>
          <nav className="flex flex-col gap-2 font-nohemi text-center ">
            <Link href="/dashboard/chatbot" className="flex items-center gap-2 px-6 py-2 rounded-md bg-white/70 hover:bg-border-200 text-gray-900 font-medium shadow transition-all">
              <Bot className="w-5 h-5" /> Chatbot
            </Link>
            <Link href="/dashboard/community" className="flex items-center gap-2 px-6 py-2 rounded-md bg-white/70 hover:bg-border-200 text-gray-900 font-medium shadow transition-all">
              <Users className="w-5 h-5" /> Community
            </Link>
            <Link href="/dashboard/helphub" className="flex items-center gap-2 px-6 py-2 rounded-md bg-white/70 hover:bg-border-200 text-gray-900 font-medium shadow transition-all">
              <LifeBuoy className="w-5 h-5" /> HelpHub
            </Link>
            <Link href="/dashboard/moodboard" className="flex items-center gap-2 px-6 py-2 rounded-md bg-white/70 hover:bg-border-200 text-gray-900 font-medium shadow transition-all">
              <BarChart2 className="w-5 h-5" /> MoodBoard
            </Link>
            <Link href="/dashboard/moodkit" className="flex items-center gap-2 px-6 py-2 rounded-md bg-white/70 hover:bg-border-200 text-gray-900 font-medium shadow transition-all">
              <Hammer className="w-5 h-5" /> MoodKit
            </Link>
          </nav>
        </div>
        <div className="flex flex-col items-center gap-4 mt-10">
          <Link href="/profile" className="font-nohemi flex items-center gap-2 px-4 py-2 rounded-xl bg-white/70 hover:bg-violet-200 text-violet-700 font-medium shadow transition-all w-full justify-center">
            <User className="w-5 h-5" /> Profile
          </Link>
          <Link href="/logout" className="font-nohemi flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold shadow w-full justify-center">
            <LogOut className="w-5 h-5" /> Logout
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 lg:p-12 bg-gradient-to-br from-white via-purple-50 to-violet-100 rounded-l-3xl shadow-lg">{children}</main>
    </div>
  );
}
