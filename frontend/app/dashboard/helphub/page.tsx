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
    <main className="max-w-4xl mx-auto space-y-6">
      {/* Header Section */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-violet-200">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-gradient-to-r from-violet-500 to-violet-600 rounded-2xl">
            <LifeBuoy className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold font-nohemi text-violet-700 tracking-wide">
              Help Hub
            </h1>
            <p className="text-gray-600 font-nohemi mt-1">
              Find mental health support resources across Bangladesh
            </p>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-blue-50 to-violet-50 rounded-2xl p-4 border border-blue-200">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-nohemi text-gray-800 leading-relaxed">
                Find free and low‑cost mental health support across helplines, universities and online services in Bangladesh. 
                <span className="font-semibold"> Always call emergency services if you or someone else is in immediate danger.</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-6 border border-violet-200">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="flex-1 max-w-md">
            <label htmlFor="search" className="block text-sm font-nohemi text-violet-700 mb-2">
              Search resources
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-violet-400" />
              <input
                id="search"
                type="text"
                placeholder="Name, tag, keyword..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full border-2 border-violet-200 rounded-xl px-4 py-3 pl-10 font-nohemi focus:outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100 bg-white/70 backdrop-blur-sm shadow-sm"
              />
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as ResourceCategory)} className="w-full md:w-auto">
            <TabsList className="flex rounded-2xl bg-gradient-to-r from-violet-100 to-violet-50 p-1 gap-1 h-auto border border-violet-200">
              { (Object.keys(categoryMeta) as ResourceCategory[]).map(cat => (
                <TabsTrigger
                  key={cat}
                  value={cat}
                  className="data-[state=active]:bg-white data-[state=active]:text-violet-700 data-[state=active]:shadow-md px-4 py-3 rounded-xl text-sm font-nohemi  text-gray-600 hover:text-violet-700 transition-all duration-200 transform hover:scale-105 flex items-center gap-2"
                >
                  {categoryMeta[cat].icon}
                  <span>{categoryMeta[cat].label}</span>
                </TabsTrigger>
              )) }
            </TabsList>
          </Tabs>
        </div>

        {/* Active Category Description */}
        <div className="mt-4 p-3 bg-gradient-to-r from-violet-50 to-white rounded-xl border border-violet-100">
          <div className="flex items-center gap-2 text-sm font-nohemi text-violet-700">
            <ShieldCheck className="h-4 w-4 text-violet-500" />
            <span className="font-medium">{categoryMeta[activeTab].description}</span>
          </div>
        </div>
      </div>

      {/* Resource Cards */}
      <div className="space-y-6">
        {filtered.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-12 border border-violet-200 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-nohemi font-bold text-violet-700 mb-2">No resources found</h3>
            <p className="text-gray-600 font-nohemi">Try a different search or category.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map(r => (
              <article
                key={r.id}
                className="group bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-violet-200 overflow-hidden  transition-all duration-300 transform"
              >
                {/* Card Header */}
                <div className="p-6 bg-gradient-to-r from-violet-50 to-white border-b border-violet-100">
                  <h2 className="text-xl font-nohemi font-bold text-gray-900 mb-2 group-hover:text-violet-700 transition-colors">
                    {r.name}
                  </h2>
                  <p className="text-sm font-nohemi text-gray-600 leading-relaxed">
                    {r.description}
                  </p>
                </div>

                {/* Card Content */}
                <div className="p-6 space-y-4">
                  <div className="space-y-3">
                    {r.phone && (
                      <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl border border-green-200">
                        <div className="p-2 bg-green-500 rounded-full">
                          <Phone className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <div className="text-xs font-nohemi  text-green-700 uppercase tracking-wide">Phone</div>
                          <div className="font-nohemi font-bold text-green-800">{r.phone}</div>
                        </div>
                      </div>
                    )}
                    
                    {r.availability && (
                      <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl border border-blue-200">
                        <div className="p-2 bg-blue-500 rounded-full">
                          <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
                        </div>
                        <div>
                          <div className="text-xs font-nohemi font-semibold text-blue-700 uppercase tracking-wide">Availability</div>
                          <div className="font-nohemi font-medium text-blue-800">{r.availability}</div>
                        </div>
                      </div>
                    )}
                    
                    {r.location && (
                      <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl border border-purple-200">
                        <div className="p-2 bg-purple-500 rounded-full">
                          <Building2 className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <div className="text-xs font-nohemi font-semibold text-purple-700 uppercase tracking-wide">Location</div>
                          <div className="font-nohemi font-medium text-purple-800">{r.location}</div>
                        </div>
                      </div>
                    )}
                  </div>

                  {r.languages && (
                    <div className="space-y-2">
                      <div className="text-xs font-nohemi font-semibold text-gray-700 uppercase tracking-wide">Languages</div>
                      <div className="flex flex-wrap gap-2">
                        {r.languages.map(l => (
                          <span key={l} className="bg-gradient-to-r from-violet-100 to-violet-50 text-violet-700 px-3 py-1 rounded-full text-xs font-nohemi border border-violet-200">
                            {l}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {r.tags && (
                    <div className="space-y-2">
                      <div className="text-xs font-nohemi font-semibold text-gray-700 uppercase tracking-wide">Specialties</div>
                      <div className="flex flex-wrap gap-2">
                        {r.tags.map(tag => (
                          <span key={tag} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-nohemi font-medium border border-gray-200 group-hover:bg-violet-50 group-hover:text-violet-700 group-hover:border-violet-200 transition-all">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Footer */}
                <div className="p-6 bg-gradient-to-r from-gray-50 to-white border-t border-gray-100">
                  <div className="flex gap-3">
                    {r.website && (
                      <Link
                        href={r.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-violet-700 text-white px-4 py-2 rounded-xl font-nohemi font-semibold shadow-lg hover:from-violet-700 hover:to-violet-800 transition-all duration-200 transform hover:scale-105 flex-1 justify-center"
                      >
                        <Globe className="h-4 w-4" />
                        Visit Website
                      </Link>
                    )}
                    {r.phone && (
                      <a
                        href={`tel:${r.phone.replace(/[^+\d]/g,'')}`}
                        className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-xl font-nohemi font-semibold shadow-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 transform hover:scale-105 flex-1 justify-center"
                      >
                        <Phone className="h-4 w-4" />
                        Call Now
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-6 border border-violet-200">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-red-100 rounded-full">
            <ShieldCheck className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <div className="text-sm font-nohemi font-semibold text-red-700 mb-1">Important Notice</div>
            <p className="text-sm font-nohemi text-gray-600 leading-relaxed">
              MindMate is not a crisis service. If you are in immediate danger or thinking about harming yourself, 
              contact local emergency services or a trusted adult immediately.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}