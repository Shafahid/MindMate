import React from "react";
import Link from "next/link";

const dashboardLinks = [
  { name: "Chatbot", href: "/dashboard/chatbot" },
  { name: "Moodboard", href: "/dashboard/moodboard" },
  { name: "Moodkit", href: "/dashboard/moodkit" },
  { name: "Community", href: "/dashboard/community" },
  { name: "Helphub", href: "/dashboard/helphub" },
];

function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-56 bg-white border-r shadow-sm py-8 px-4 flex flex-col gap-4">
        <h2 className="text-xl font-bold mb-6 text-violet-700">Dashboard</h2>
        <nav className="flex flex-col gap-2">
          {dashboardLinks.map(link => (
            <Link
              key={link.name}
              href={link.href}
              className="px-3 py-2 rounded hover:bg-violet-50 text-gray-700 font-medium transition-colors"
              prefetch={false}
            >
              {link.name}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}

export default DashboardLayout;
