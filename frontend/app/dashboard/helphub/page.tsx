"use client"

import React, { useState, useMemo } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Phone, Globe, ShieldCheck, Search, ExternalLink, GraduationCap, LifeBuoy, Building2 } from 'lucide-react'
import Link from 'next/link'

type ResourceCategory = 'helpline' | 'university' | 'online'

interface SupportResource {
  id: string
  name: string
  category: ResourceCategory
  description: string
  phone?: string
  website?: string
  location?: string
  availability?: string
  languages?: string[]
  tags?: string[]
}

const resources: SupportResource[] = [
  {
    id: 'kaan-pete-roi',
    name: 'Kaan Pete Roi',
    category: 'helpline',
    description: 'Bangladesh’s first emotional support and suicide prevention helpline.',
    phone: '09612-226-738',
    website: 'https://www.kaanpeteroi.org',
    availability: 'Everyday 3PM – 3AM',
    languages: ['Bangla', 'English'],
    tags: ['Suicide Prevention', 'Emotional Support']
  },
  {
    id: 'sajida',
    name: 'Sajida Foundation Mental Health',
    category: 'helpline',
    description: 'Psychosocial support & counseling services promoting community wellbeing.',
    phone: '01713-332-441',
    website: 'https://sajidafoundation.org',
    availability: 'Office Hours',
    languages: ['Bangla', 'English'],
    tags: ['Counseling', 'Community']
  },
  {
    id: 'brac-university',
    name: 'BRAC University Counseling Unit',
    category: 'university',
    description: 'On‑campus psychological counseling and wellbeing programs for students.',
    phone: 'N/A',
    website: 'https://www.bracu.ac.bd',
    location: 'BRAC University, Dhaka',
    availability: 'Appointments',
    tags: ['Students', 'On-Campus']
  },
  {
    id: 'nsu-wellness',
    name: 'North South University Wellness Center',
    category: 'university',
    description: 'Mental health services, peer clubs & psychoeducation for NSU students.',
    website: 'https://www.northsouth.edu',
    location: 'NSU, Dhaka',
    availability: 'Appointments',
    tags: ['Students', 'Workshops']
  },
  {
    id: 'life-spring-bd',
    name: 'Life Spring BD',
    category: 'online',
    description: 'Online & in-person counseling and psychotherapy services in Bangladesh.',
    website: 'https://www.lifespringint.com/',
    availability: 'Appointment based',
    languages: ['Bangla', 'English'],
    tags: ['Counseling', 'Therapy']
  },
  {
    id: 'moner-bari',
    name: 'Moner Bari',
    category: 'online',
    description: 'Affordable virtual counseling sessions with licensed practitioners.',
    website: 'https://monerbari.com',
    availability: 'Flexible scheduling',
    tags: ['Affordable', 'Counseling']
  }
]

const categoryMeta: Record<ResourceCategory, { label: string; icon: React.ReactNode; description: string }> = {
  helpline: {
    label: 'Helpline',
    icon: <LifeBuoy className="h-4 w-4" />,
    description: 'Immediate emotional support & crisis assistance'
  },
  university: {
    label: 'University Counselor',
    icon: <GraduationCap className="h-4 w-4" />,
    description: 'On‑campus wellbeing & counseling services'
  },
  online: {
    label: 'Online Service',
    icon: <Globe className="h-4 w-4" />,
    description: 'Virtual platforms & remote therapy options'
  }
}

export default function HelpHubPage() {
  const [query, setQuery] = useState('')
  const [activeTab, setActiveTab] = useState<ResourceCategory>('helpline')

  const filtered = useMemo(() => {
    return resources.filter(r =>
      r.category === activeTab &&
      (r.name.toLowerCase().includes(query.toLowerCase()) ||
        r.description.toLowerCase().includes(query.toLowerCase()) ||
        r.tags?.some(t => t.toLowerCase().includes(query.toLowerCase())) )
    )
  }, [activeTab, query])

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-8 py-10 space-y-10">
      <header className="space-y-4 text-center md:text-left">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">Help Hub</h1>
        <p className="text-gray-600 max-w-2xl text-sm md:text-base">
          Find free and low‑cost mental health support across helplines, universities and online services in Bangladesh. Always call emergency services if you or someone else is in immediate danger.
        </p>
      </header>

      <div className="flex flex-col gap-6">
        {/* Search + Tabs */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="w-full md:max-w-sm">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Search resources</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                id="search"
                type="text"
                placeholder="Name, tag, keyword..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white/60 backdrop-blur px-9 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
              />
            </div>
          </div>
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as ResourceCategory)} className="w-full md:w-auto">
            <TabsList className="flex rounded-xl bg-violet-100/60 p-1 gap-1 h-auto">
              { (Object.keys(categoryMeta) as ResourceCategory[]).map(cat => (
                <TabsTrigger
                  key={cat}
                  value={cat}
                  className="data-[state=active]:bg-white data-[state=active]:text-violet-700 data-[state=active]:shadow-sm px-3 py-2 rounded-lg text-xs md:text-sm font-medium text-gray-600 hover:text-violet-700 transition"
                >
                  {categoryMeta[cat].icon}
                  <span>{categoryMeta[cat].label}</span>
                </TabsTrigger>
              )) }
            </TabsList>
          </Tabs>
        </div>

        {/* Active Category Description */}
        <div className="text-sm text-gray-600 flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-violet-500" />
          <span>{categoryMeta[activeTab].description}</span>
        </div>

        {/* Resource Cards */}
        <section aria-live="polite" className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.length === 0 && (
            <div className="col-span-full rounded-xl border border-dashed p-10 text-center text-gray-500">
              No resources found. Try a different search.
            </div>
          )}
          {filtered.map(r => (
            <article
              key={r.id}
              className="group relative overflow-hidden rounded-2xl bg-white/70 backdrop-blur-sm border border-gray-200 hover:border-violet-300 shadow-sm hover:shadow-md transition-all ring-1 ring-black/5"
            >
              <div className="p-5 space-y-4">
                <header className="space-y-1">
                  <h2 className="text-lg font-semibold tracking-tight text-gray-900 pr-6">
                    {r.name}
                  </h2>
                  <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                    {r.description}
                  </p>
                </header>
                <dl className="grid gap-2 text-xs text-gray-600">
                  {r.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-3.5 w-3.5 text-violet-500" />
                      <dd className="font-medium tracking-wide">Call: {r.phone}</dd>
                    </div>
                  )}
                  {r.availability && (
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                      <dd>{r.availability}</dd>
                    </div>
                  )}
                  {r.location && (
                    <div className="flex items-center gap-2">
                      <Building2 className="h-3.5 w-3.5 text-violet-500" />
                      <dd>{r.location}</dd>
                    </div>
                  )}
                  {r.languages && (
                    <div className="flex items-center gap-2 flex-wrap">
                      {r.languages.map(l => (
                        <span key={l} className="rounded-md bg-violet-100 text-violet-700 px-2 py-0.5 font-medium">
                          {l}
                        </span>
                      ))}
                    </div>
                  )}
                </dl>
                {r.tags && (
                  <div className="flex flex-wrap gap-2">
                    {r.tags.map(tag => (
                      <span key={tag} className="inline-flex items-center rounded-full bg-gray-100 text-gray-600 px-2.5 py-0.5 text-[11px] font-medium group-hover:bg-violet-50 group-hover:text-violet-700 transition">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="border-t bg-gradient-to-r from-violet-50 to-white px-5 py-3 flex items-center justify-between">
                <div className="flex gap-2">
                  {r.website && (
                    <Link
                      href={r.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-md border border-violet-200 bg-white px-3 py-1.5 text-xs font-medium text-violet-700 hover:bg-violet-600 hover:text-white hover:border-violet-600 transition"
                    >
                      Visit <ExternalLink className="h-3.5 w-3.5" />
                    </Link>
                  )}
                  {r.phone && (
                    <a
                      href={`tel:${r.phone.replace(/[^+\d]/g,'')}`}
                      className="inline-flex items-center gap-1.5 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition"
                    >
                      Call
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </section>

        <footer className="pt-6 border-t border-gray-200 text-[11px] text-gray-500 leading-relaxed">
          <p>
            MindMate is not a crisis service. If you are in immediate danger or thinking about harming yourself, contact local emergency services or a trusted adult immediately.
          </p>
        </footer>
      </div>
    </main>
  )
}