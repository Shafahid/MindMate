import React from "react";
import Link from "next/link";

function DashboardHome() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-violet-700">Welcome to MindMate Dashboard</h1>
      <p className="mb-4 text-gray-600">Select a section to get started:</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <Link href="/dashboard/chatbot" className="block bg-white border rounded-lg shadow-sm p-6 hover:shadow-md transition">
          <h2 className="text-xl font-semibold mb-2 text-violet-600">Chatbot</h2>
          <p className="text-gray-500">AI-powered support and conversation.</p>
        </Link>
        <Link href="/dashboard/moodboard" className="block bg-white border rounded-lg shadow-sm p-6 hover:shadow-md transition">
          <h2 className="text-xl font-semibold mb-2 text-violet-600">Moodboard</h2>
          <p className="text-gray-500">Track and visualize your mood trends.</p>
        </Link>
        <Link href="/dashboard/moodkit" className="block bg-white border rounded-lg shadow-sm p-6 hover:shadow-md transition">
          <h2 className="text-xl font-semibold mb-2 text-violet-600">Moodkit</h2>
          <p className="text-gray-500">Personalized wellness tools.</p>
        </Link>
        <Link href="/dashboard/community" className="block bg-white border rounded-lg shadow-sm p-6 hover:shadow-md transition">
          <h2 className="text-xl font-semibold mb-2 text-violet-600">Community</h2>
          <p className="text-gray-500">Connect and share with peers.</p>
        </Link>
        <Link href="/dashboard/helphub" className="block bg-white border rounded-lg shadow-sm p-6 hover:shadow-md transition">
          <h2 className="text-xl font-semibold mb-2 text-violet-600">Helphub</h2>
          <p className="text-gray-500">Access mental health resources.</p>
        </Link>
      </div>
    </div>
  );
}

export default DashboardHome;
