"use client"

import React, { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase'
import { getCurrentUser } from '../../../lib/auth'
import { 
  Wind, 
  Brain, 
  PenTool, 
  Heart, 
  Play, 
  Pause, 
  RotateCcw,
  Star,
  StarOff,
  CheckCircle,
  Headphones,
  Eye
} from 'lucide-react'

// Types for our toolkit features
interface ToolkitItem {
  id: string
  title: string
  description: string
  category: string
  duration: string
  isFavorite: boolean
  usageCount: number
}

interface BreathingExercise {
  name: string
  pattern: string
  description: string
  cycles: number
}

interface Meditation {
  name: string
  duration: string
  description: string
  videoId: string
  thumbnail: string
}

interface JournalingPrompt {
  prompt: string
  category: string
}

export default function MoodkitPage() {
  const [activeTab, setActiveTab] = useState('breathing')
  const [journalTitle, setJournalTitle] = useState('')
  const [journalContent, setJournalContent] = useState('')
  const [journalEntries, setJournalEntries] = useState<any[]>([])
  const [journalLoading, setJournalLoading] = useState(false)
  const [journalError, setJournalError] = useState('')
  // Fetch user's journal entries
  const fetchJournalEntries = async () => {
    setJournalLoading(true)
    setJournalError('')
    try {
      const { user } = await getCurrentUser()
      if (!user) {
        setJournalError('User not logged in')
        setJournalLoading(false)
        return
      }
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      if (error) {
        setJournalError(error.message)
      } else {
        setJournalEntries(data || [])
      }
    } catch (err: any) {
      setJournalError(err.message || 'Failed to fetch entries')
    }
    setJournalLoading(false)
  }

  // Store a new journal entry
  const saveJournalEntry = async () => {
    setJournalError('')
    setJournalLoading(true)
    try {
      const { user } = await getCurrentUser()
      if (!user) {
        setJournalError('User not logged in')
        setJournalLoading(false)
        return
      }
      if (!journalContent.trim()) {
        setJournalError('Content cannot be empty')
        setJournalLoading(false)
        return
      }
      const { error } = await supabase
        .from('journal_entries')
        .insert({
          user_id: user.id,
          title: journalTitle,
          content: journalContent
        })
      if (error) {
        setJournalError(error.message)
      } else {
        setJournalTitle('')
        setJournalContent('')
        fetchJournalEntries()
      }
    } catch (err: any) {
      setJournalError(err.message || 'Failed to save entry')
    }
    setJournalLoading(false)
  }

  // Clear journal fields
  const clearJournalFields = () => {
    setJournalTitle('')
    setJournalContent('')
    setJournalError('')
  }

  useEffect(() => {
    if (activeTab === 'journaling') {
      fetchJournalEntries()
    }
    // eslint-disable-next-line
  }, [activeTab])
  const [favorites, setFavorites] = useState<string[]>([])
  const [breathingActive, setBreathingActive] = useState(false)
  const [breathingPhase, setBreathingPhase] = useState('inhale')
  const [breathingCount, setBreathingCount] = useState(4)
  const [selectedBreathing, setSelectedBreathing] = useState(0)
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null)
  const [playingAudioIndex, setPlayingAudioIndex] = useState<number | null>(null)
  const [isAudioPlaying, setIsAudioPlaying] = useState(false)
  const [playingVideoIndex, setPlayingVideoIndex] = useState<number | null>(null)

  // Breathing exercises data
  const breathingExercises: BreathingExercise[] = [
    {
      name: "Box Breathing",
      pattern: "4-4-4-4",
      description: "Inhale 4s → Hold 4s → Exhale 4s → Hold 4s",
      cycles: 5
    },
    {
      name: "4-7-8 Breathing",
      pattern: "4-7-8",
      description: "Inhale 4s → Hold 7s → Exhale 8s",
      cycles: 4
    },
    {
      name: "Mindful Breathing",
      pattern: "Natural",
      description: "Focus on natural breath rhythm",
      cycles: 10
    }
  ]

  // Mini meditations data
  const meditations: Meditation[] = [
    {
      name: "2-Minute Grounding",
      duration: "2 min",
      description: "Sit, close eyes, notice surroundings and breath",
      videoId: "c2thahBgErc",
      thumbnail: "https://img.youtube.com/vi/c2thahBgErc/maxresdefault.jpg"
    },
    {
      name: "Body Scan",
      duration: "5 min", 
      description: "Mentally check tension in each body part and release it",
      videoId: "dsmfIAyiois",
      thumbnail: "https://img.youtube.com/vi/dsmfIAyiois/maxresdefault.jpg"
    },
    {
      name: "Gratitude Moment",
      duration: "3 min",
      description: "Think of 3 things you are grateful for today",
      videoId: "2BLIqXeQB6k",
      thumbnail: "https://img.youtube.com/vi/2BLIqXeQB6k/maxresdefault.jpg"
    }
  ]

  // Journaling prompts
  const journalingPrompts: JournalingPrompt[] = [
    {
      prompt: "What emotion do I feel most strongly today and why?",
      category: "emotional"
    },
    {
      prompt: "One small victory I achieved today...",
      category: "achievement"
    },
    {
      prompt: "Something I can let go of to feel lighter...",
      category: "release"
    },
    {
      prompt: "One thing I appreciate about myself today...",
      category: "self-love"
    },
    {
      prompt: "What would I tell a friend going through what I'm experiencing?",
      category: "perspective"
    },
    {
      prompt: "What am I most looking forward to this week?",
      category: "future"
    }
  ]

  // Tab configuration
  const tabs = [
    { id: 'breathing', label: 'Breathing', icon: <Wind className="w-5 h-5" /> },
    { id: 'meditation', label: 'Meditation', icon: <Brain className="w-5 h-5" /> },
    { id: 'journaling', label: 'Journaling', icon: <PenTool className="w-5 h-5" /> },
    { id: 'audio', label: 'Soothing Audio', icon: <Headphones className="w-5 h-5" /> }
  ]

  // Breathing timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (breathingActive) {
      interval = setInterval(() => {
        setBreathingCount(prev => {
          if (prev <= 1) {
            // Switch phase
            setBreathingPhase(current => {
              if (selectedBreathing === 0) { // Box breathing
                switch (current) {
                  case 'inhale': return 'hold1'
                  case 'hold1': return 'exhale'
                  case 'exhale': return 'hold2'
                  case 'hold2': return 'inhale'
                  default: return 'inhale'
                }
              } else if (selectedBreathing === 1) { // 4-7-8 breathing
                switch (current) {
                  case 'inhale': return 'hold1'
                  case 'hold1': return 'exhale'
                  case 'exhale': return 'inhale'
                  default: return 'inhale'
                }
              } else { // Mindful breathing
                return current === 'inhale' ? 'exhale' : 'inhale'
              }
            })
            
            // Reset count based on exercise and phase
            if (selectedBreathing === 0) return 4 // Box breathing
            if (selectedBreathing === 1) {
              switch (breathingPhase) {
                case 'inhale': return 7
                case 'hold1': return 8
                case 'exhale': return 4
                default: return 4
              }
            }
            return 4 // Default
          }
          return prev - 1
        })
      }, 1000)
    }
    
    return () => clearInterval(interval)
  }, [breathingActive, breathingPhase, selectedBreathing])

  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(fav => fav !== id)
        : [...prev, id]
    )
  }

  const startBreathing = () => {
    setBreathingActive(true)
    setBreathingPhase('inhale')
    setBreathingCount(4)
  }

  const stopBreathing = () => {
    setBreathingActive(false)
    setBreathingPhase('inhale')
    setBreathingCount(4)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const getRandomItem = (array: any[]) => {
    return array[Math.floor(Math.random() * array.length)]
  }

  const playVideo = (index: number) => {
    setPlayingVideoIndex(index)
  }

  const stopVideo = () => {
    setPlayingVideoIndex(null)
  }

  // Audio control functions
  const audioFiles = [
    { 
      name: "Rain Sounds", 
      file: "/Rain_Sounds.mp3", 
      description: "Gentle rainfall for relaxation" 
    },
    { 
      name: "Ocean Waves", 
      file: "/Ocean_Waves.mp3", 
      description: "Calming ocean waves" 
    },
    { 
      name: "Forest Ambience", 
      file: "/Forest_Ambience.mp3", 
      description: "Peaceful forest sounds" 
    },
    { 
      name: "Soft Piano", 
      file: "/Soft Piano.mp3", 
      description: "Soothing piano melodies" 
    },
    { 
      name: "Nature Mix", 
      file: "/nature_mix.mp3", 
      description: "Blend of natural sounds" 
    }
  ]

  const playAudio = (audioFile: string, index: number) => {
    // Stop current audio if playing
    if (currentAudio) {
      currentAudio.pause()
      currentAudio.currentTime = 0
    }

    // Create new audio instance
    const audio = new Audio(audioFile)
    audio.loop = true
    audio.volume = 0.7

    // Set up event listeners
    audio.onplay = () => {
      setIsAudioPlaying(true)
      setPlayingAudioIndex(index)
    }

    audio.onpause = () => {
      setIsAudioPlaying(false)
      setPlayingAudioIndex(null)
    }

    audio.onerror = () => {
      console.error('Error playing audio file:', audioFile)
      setIsAudioPlaying(false)
      setPlayingAudioIndex(null)
    }

    // Play the audio
    audio.play().catch(error => {
      console.error('Error playing audio:', error)
    })

    setCurrentAudio(audio)
  }

  const stopAudio = () => {
    if (currentAudio) {
      currentAudio.pause()
      currentAudio.currentTime = 0
      setCurrentAudio(null)
      setIsAudioPlaying(false)
      setPlayingAudioIndex(null)
    }
  }

  // Cleanup audio when component unmounts
  useEffect(() => {
    return () => {
      if (currentAudio) {
        currentAudio.pause()
        currentAudio.currentTime = 0
      }
    }
  }, [currentAudio])

  return (
    <main className="max-w-7xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-violet-200">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-r from-violet-500 to-violet-600 rounded-2xl">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold font-nohemi text-violet-700 tracking-wide">Self-Help Toolkit</h1>
            <p className="text-gray-600 font-nohemi mt-1">Your personal wellness companion for mental health support</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-6 border border-violet-200">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl font-nohemi font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-violet-500 to-violet-600 text-white shadow-lg border border-violet-500 scale-105'
                  : 'bg-white/60 text-gray-700 border border-gray-200 hover:bg-violet-50 hover:border-violet-300 hover:scale-105'
              }`}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content Sections */}
      <div className="space-y-6">
        {/* Breathing Exercises */}
        {activeTab === 'breathing' && (
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-violet-200">
              <h3 className="text-2xl font-bold font-nohemi text-violet-700 mb-6 flex items-center gap-2">
                <Wind className="w-6 h-6" />
                Guided Breathing Exercises
              </h3>
              
              <div className="space-y-4 mb-6">
                {breathingExercises.map((exercise, index) => (
                  <div 
                    key={index}
                    className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                      selectedBreathing === index 
                        ? 'bg-violet-50 border-violet-300' 
                        : 'bg-white border-gray-200 hover:border-violet-200'
                    }`}
                    onClick={() => setSelectedBreathing(index)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-nohemi font-semibold text-gray-900">{exercise.name}</h4>
                      <span className="text-xs font-nohemi bg-violet-100 text-violet-700 px-2 py-1 rounded-full">
                        {exercise.cycles} cycles
                      </span>
                    </div>
                    <p className="text-sm font-nohemi text-gray-600">{exercise.description}</p>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                {!breathingActive ? (
                  <button
                    onClick={startBreathing}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-500 to-violet-600 
                      text-white font-nohemi font-medium rounded-xl shadow-lg border border-violet-500
                      hover:from-violet-600 hover:to-violet-700 hover:scale-105 hover:shadow-violet-200/50
                      focus:ring-2 focus:ring-violet-500 focus:outline-none transition-all duration-200"
                  >
                    <Play className="w-4 h-4" />
                    Start Exercise
                  </button>
                ) : (
                  <button
                    onClick={stopBreathing}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 
                      text-white font-nohemi font-medium rounded-xl shadow-lg border border-red-500
                      hover:from-red-600 hover:to-red-700 hover:scale-105 hover:shadow-red-200/50
                      focus:ring-2 focus:ring-red-500 focus:outline-none transition-all duration-200"
                  >
                    <Pause className="w-4 h-4" />
                    Stop Exercise
                  </button>
                )}
              </div>
            </div>

            {/* Breathing Visualizer */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-violet-200">
              <div className="text-center space-y-6">
                <h4 className="text-xl font-bold font-nohemi text-gray-900">
                  {breathingExercises[selectedBreathing].name}
                </h4>
                
                {/* Breathing Circle */}
                <div className="flex justify-center">
                  <div className={`w-48 h-48 rounded-full bg-gradient-to-r from-violet-400 to-violet-600 
                    flex items-center justify-center text-white font-nohemi font-bold text-lg
                    transition-transform duration-1000 ${
                      breathingActive 
                        ? (breathingPhase === 'inhale' ? 'scale-110' : 'scale-90')
                        : 'scale-100'
                    }`}
                  >
                    {breathingActive ? (
                      <div className="text-center">
                        <div className="text-2xl mb-2 capitalize">{breathingPhase.replace('1', '').replace('2', '')}</div>
                        <div className="text-4xl">{breathingCount}</div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Eye className="w-12 h-12 mx-auto mb-2" />
                        <div>Ready</div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-gradient-to-r from-violet-50 to-white p-4 rounded-xl border border-violet-100">
                  <p className="text-sm font-nohemi text-gray-700 leading-relaxed">
                    {breathingActive 
                      ? `Focus on your ${breathingPhase.replace('1', '').replace('2', '')} and follow the circle`
                      : "Select an exercise above and click start to begin your breathing session"
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mini Meditations */}
        {activeTab === 'meditation' && (
          <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-2">
            {meditations.map((meditation, index) => (
              <div key={index} className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden border border-violet-200">
                {/* YouTube Player or Thumbnail */}
                <div className="relative">
                  {playingVideoIndex === index ? (
                    <div className="relative">
                      <iframe
                        width="100%"
                        height="400"
                        src={`https://www.youtube.com/embed/${meditation.videoId}?autoplay=1&rel=0`}
                        title={meditation.name}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="rounded-t-3xl"
                      ></iframe>
                      <button
                        onClick={stopVideo}
                        className="absolute top-4 right-4 p-2 bg-black/70 text-white rounded-full hover:bg-black/90 transition-all duration-200"
                      >
                        <Pause className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="relative group cursor-pointer" onClick={() => playVideo(index)}>
                      <img 
                        src={meditation.thumbnail} 
                        alt={meditation.name}
                        className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center">
                        <div className="w-20 h-20 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                          <Play className="w-10 h-10 text-violet-600 ml-1" />
                        </div>
                      </div>
                      <div className="absolute top-3 right-3">
                        <span className="text-sm font-nohemi bg-black/70 text-white px-3 py-1 rounded-full">
                          {meditation.duration}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Content */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="text-xl font-bold font-nohemi text-violet-700">{meditation.name}</h4>
                    <button 
                      onClick={() => toggleFavorite(`meditation-${index}`)}
                      className="p-2 hover:bg-violet-50 rounded-lg transition-all duration-200"
                    >
                      {favorites.includes(`meditation-${index}`) ? (
                        <Star className="w-5 h-5 text-yellow-500 fill-current" />
                      ) : (
                        <StarOff className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  <p className="text-sm font-nohemi text-gray-600 mb-4 leading-relaxed">{meditation.description}</p>
                  
                  <div className="flex gap-3">
                    {playingVideoIndex === index ? (
                      <button 
                        onClick={stopVideo}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 
                          text-white font-nohemi font-medium rounded-xl shadow-lg border border-red-500
                          hover:from-red-600 hover:to-red-700 hover:scale-105 hover:shadow-red-200/50
                          focus:ring-2 focus:ring-red-500 focus:outline-none transition-all duration-200 flex-1"
                      >
                        <Pause className="w-4 h-4" />
                        Close Video
                      </button>
                    ) : (
                      <button 
                        onClick={() => playVideo(index)}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-500 to-violet-600 
                          text-white font-nohemi font-medium rounded-xl shadow-lg border border-violet-500
                          hover:from-violet-600 hover:to-violet-700 hover:scale-105 hover:shadow-violet-200/50
                          focus:ring-2 focus:ring-violet-500 focus:outline-none transition-all duration-200 flex-1"
                      >
                        <Play className="w-4 h-4" />
                        Play Meditation
                      </button>
                    )}
                    <button 
                      onClick={() => window.open(`https://www.youtube.com/watch?v=${meditation.videoId}`, '_blank')}
                      className="px-4 py-3 bg-white/60 border border-gray-200 rounded-xl font-nohemi font-medium text-gray-700
                        hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
                    >
                      Open in YouTube
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Journaling Prompts */}
        {activeTab === 'journaling' && (
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-violet-200">
              <h3 className="text-2xl font-bold font-nohemi text-violet-700 mb-6 flex items-center gap-2">
                <PenTool className="w-6 h-6" />
                Journaling Prompts
              </h3>
              
              <div className="space-y-4 mb-6">
                {journalingPrompts.map((prompt, index) => (
                  <div key={index} className="p-4 bg-white border border-gray-200 rounded-xl hover:border-violet-300 transition-all duration-200">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-nohemi bg-violet-100 text-violet-700 px-2 py-1 rounded-full capitalize">
                        {prompt.category}
                      </span>
                      <button 
                        onClick={() => toggleFavorite(`prompt-${index}`)}
                        className="p-1 hover:bg-violet-50 rounded transition-all duration-200"
                      >
                        {favorites.includes(`prompt-${index}`) ? (
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        ) : (
                          <StarOff className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                    <p className="font-nohemi text-gray-800 italic">"{prompt.prompt}"</p>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => {
                  const randomPrompt = getRandomItem(journalingPrompts)
                  alert(`Random Prompt: "${randomPrompt.prompt}"`)
                }}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-500 to-violet-600 
                  text-white font-nohemi font-medium rounded-xl shadow-lg border border-violet-500
                  hover:from-violet-600 hover:to-violet-700 hover:scale-105 hover:shadow-violet-200/50
                  focus:ring-2 focus:ring-violet-500 focus:outline-none transition-all duration-200"
              >
                <RotateCcw className="w-4 h-4" />
                Random Prompt
              </button>
            </div>

            {/* Journal Writing & List Area */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-violet-200">
              <h4 className="text-xl font-bold font-nohemi text-gray-900 mb-4">Write Your Thoughts</h4>
              {/* Error Message */}
              {journalError && (
                <div className="mb-4 text-red-600 font-nohemi text-sm">{journalError}</div>
              )}
              {/* Title Field */}
              <div className="mb-4">
                <label className="block text-sm font-nohemi font-medium text-gray-700 mb-2">
                  Entry Title
                </label>
                <input 
                  type="text"
                  value={journalTitle}
                  onChange={e => setJournalTitle(e.target.value)}
                  placeholder="Give your journal entry a title..."
                  className="w-full p-3 rounded-xl border border-violet-200 bg-white/80 backdrop-blur-sm 
                    font-nohemi text-gray-900 placeholder-gray-500
                    focus:ring-2 focus:ring-violet-500 focus:border-violet-500 focus:outline-none 
                    transition-all duration-200"
                />
              </div>

              {/* Content Field */}
              <div className="mb-4">
                <label className="block text-sm font-nohemi font-medium text-gray-700 mb-2">
                  Content
                </label>
                <textarea 
                  value={journalContent}
                  onChange={e => setJournalContent(e.target.value)}
                  placeholder="Start writing your thoughts here..."
                  rows={10}
                  className="w-full p-4 rounded-xl border border-violet-200 bg-white/80 backdrop-blur-sm 
                    font-nohemi text-gray-900 placeholder-gray-500 resize-none
                    focus:ring-2 focus:ring-violet-500 focus:border-violet-500 focus:outline-none 
                    transition-all duration-200"
                />
              </div>

              <div className="flex gap-3 mb-6">
                <button
                  onClick={saveJournalEntry}
                  disabled={journalLoading}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 
                    text-white font-nohemi font-medium rounded-xl shadow-lg border border-emerald-500
                    hover:from-emerald-600 hover:to-emerald-700 hover:scale-105 hover:shadow-emerald-200/50
                    focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all duration-200 disabled:opacity-60"
                >
                  <CheckCircle className="w-4 h-4" />
                  {journalLoading ? 'Saving...' : 'Save Entry'}
                </button>
                <button
                  onClick={clearJournalFields}
                  className="px-4 py-2 bg-white/60 border border-gray-200 rounded-xl font-nohemi font-medium text-gray-700
                    hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
                >
                  Clear
                </button>
              </div>

              {/* Journal Entries List */}
              <div>
                <h5 className="text-lg font-bold font-nohemi text-violet-700 mb-3">Your Journal Entries</h5>
                {journalLoading ? (
                  <div className="text-gray-500 font-nohemi">Loading...</div>
                ) : journalEntries.length === 0 ? (
                  <div className="text-gray-500 font-nohemi">No entries yet.</div>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {journalEntries.map(entry => (
                      <div key={entry.id} className="p-4 bg-violet-50 border border-violet-200 rounded-xl">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-nohemi font-semibold text-violet-700">{entry.title || 'Untitled'}</span>
                          <span className="text-xs text-gray-500">{new Date(entry.created_at).toLocaleString()}</span>
                        </div>
                        <div className="text-gray-800 font-nohemi whitespace-pre-line">{entry.content}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Soothing Audio & Visuals */}
        {activeTab === 'audio' && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {audioFiles.map((audio, index) => (
              <div key={index} className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-6 border border-violet-200">
                <div className="text-center space-y-4">
                  <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center text-white transition-all duration-300 ${
                    playingAudioIndex === index 
                      ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 animate-pulse' 
                      : 'bg-gradient-to-r from-violet-500 to-violet-600'
                  }`}>
                    <Headphones className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="font-nohemi font-semibold text-gray-900 mb-1">{audio.name}</h4>
                    <p className="text-xs font-nohemi text-gray-600 mb-2">{audio.description}</p>
                    <span className={`text-xs font-nohemi px-2 py-1 rounded-full ${
                      playingAudioIndex === index 
                        ? 'bg-emerald-100 text-emerald-700' 
                        : 'bg-violet-100 text-violet-700'
                    }`}>
                      {playingAudioIndex === index ? 'Playing' : 'Ready'}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {playingAudioIndex === index ? (
                      <button 
                        onClick={stopAudio}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 
                          text-white font-nohemi font-medium rounded-xl shadow-lg border border-red-500
                          hover:from-red-600 hover:to-red-700 hover:scale-105 hover:shadow-red-200/50
                          focus:ring-2 focus:ring-red-500 focus:outline-none transition-all duration-200 flex-1"
                      >
                        <Pause className="w-4 h-4" />
                        Stop
                      </button>
                    ) : (
                      <button 
                        onClick={() => playAudio(audio.file, index)}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-500 to-violet-600 
                          text-white font-nohemi font-medium rounded-xl shadow-lg border border-violet-500
                          hover:from-violet-600 hover:to-violet-700 hover:scale-105 hover:shadow-violet-200/50
                          focus:ring-2 focus:ring-violet-500 focus:outline-none transition-all duration-200 flex-1"
                      >
                        <Play className="w-4 h-4" />
                        Play
                      </button>
                    )}
                    <button 
                      onClick={() => toggleFavorite(`audio-${index}`)}
                      className="p-2 bg-white/60 border border-gray-200 rounded-xl 
                        hover:bg-violet-50 hover:border-violet-300 transition-all duration-200"
                    >
                      {favorites.includes(`audio-${index}`) ? (
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      ) : (
                        <StarOff className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </main>
  )
}