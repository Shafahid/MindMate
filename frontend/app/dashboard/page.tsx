"use client"

import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { getCurrentUser } from '@/lib/auth'
import { fetchUserMoodEntries } from '@/lib/api/user_services'
import { 
  Calendar as CalendarIcon,
  TrendingUp,
  TrendingDown,
  Heart,
  Brain,
  Users,
  MessageCircle,
  Sparkles,
  AlertTriangle,
  CheckCircle,
  Target,
  Activity,
  Sun,
  Moon,
  Cloud,
  Zap
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import ActivityCalendar from 'react-activity-calendar'
import { format, subDays, parseISO } from 'date-fns'

interface MoodEntry {
  id: string
  mood_value: string
  created_at: string
  user_id: string
}

interface UserProfile {
  id: string
  first_name: string
  last_name: string
  created_at: string
}

interface MoodStats {
  positive: number
  negative: number
  neutral: number
  total: number
  negativeRatio: number
}

interface DailyMotivation {
  quote: string
  author: string
  category: string
}

export default function DashboardPage() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([])
  const [moodStats, setMoodStats] = useState<MoodStats>({ positive: 0, negative: 0, neutral: 0, total: 0, negativeRatio: 0 })
  const [loading, setLoading] = useState(true)
  const [heatmapData, setHeatmapData] = useState<any[]>([])
  const [chartData, setChartData] = useState<any[]>([])
  const [dailyMotivation, setDailyMotivation] = useState<DailyMotivation>({
    quote: "Every day is a new beginning. Take a deep breath, smile, and start again.",
    author: "Unknown",
    category: "motivation"
  })

  // Motivational quotes pool
  const motivationalQuotes = [
    { quote: "Your mental health is a priority. Your happiness is essential. Your self-care is a necessity.", author: "Unknown", category: "self-care" },
    { quote: "It's okay to not be okay. What's not okay is staying that way and not seeking help.", author: "Unknown", category: "support" },
    { quote: "Healing isn't linear. Progress isn't always forward. Be patient with yourself.", author: "Unknown", category: "healing" },
    { quote: "You are stronger than you think, braver than you feel, and more loved than you know.", author: "Unknown", category: "strength" },
    { quote: "Small steps every day lead to big changes over time.", author: "Unknown", category: "progress" },
    { quote: "Your current situation is not your final destination.", author: "Unknown", category: "hope" },
    { quote: "Mental health is not a destination, but a process. It's about how you drive, not where you're going.", author: "Noam Shpancer", category: "journey" },
    { quote: "You don't have to be positive all the time. It's perfectly okay to feel sad, angry, annoyed, frustrated, scared, or anxious.", author: "Lori Deschene", category: "acceptance" }
  ]

  useEffect(() => {
    fetchUserProfile()
    fetchMoodEntriesFromService()
    setRandomMotivation()
  }, [])

  const fetchUserProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        
        if (profile) {
          setUser(profile)
        } else {
          // Create a fallback profile if none exists
          setUser({ 
            id: user.id, 
            first_name: user.user_metadata?.first_name || 'User',
            last_name: user.user_metadata?.last_name || '',
            created_at: new Date().toISOString()
          })
        }
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
    }
  }

  // Fetch mood entries using API service from user_services.ts
  const fetchMoodEntriesFromService = async () => {
    setLoading(true)
    try {
      const { user } = await getCurrentUser()
      if (!user) return setLoading(false)
      // Use fetchUserMoodEntries from user_services.ts
      const entries = await fetchUserMoodEntries(user.id)
      setMoodEntries(entries)
      calculateMoodStats(entries)
      generateHeatmapData(entries)
      generateChartData(entries)
    } catch (error) {
      console.error('Error fetching mood entries:', error)
    } finally {
      setLoading(false)
    }
  }

  // Use mood_value directly as 'positive', 'neutral', or 'negative'

  const calculateMoodStats = (entries: MoodEntry[]) => {
    const stats = entries.reduce(
      (acc, entry) => {
        const moodLabel = entry.mood_value.toLowerCase() as 'positive' | 'neutral' | 'negative'
        if (moodLabel === 'positive' || moodLabel === 'neutral' || moodLabel === 'negative') {
          acc[moodLabel]++
        }
        acc.total++
        return acc
      },
      { positive: 0, negative: 0, neutral: 0, total: 0, negativeRatio: 0 }
    )
    stats.negativeRatio = stats.total > 0 ? (stats.negative / stats.total) * 100 : 0
    setMoodStats(stats)
  }

  const generateHeatmapData = (entries: MoodEntry[]) => {
    const moodToLevel = {
      positive: 4,
      neutral: 2,
      negative: 1
    }
    const data = entries.map(entry => {
      const moodLabel = entry.mood_value.toLowerCase() as 'positive' | 'neutral' | 'negative'
      const level = moodToLevel[moodLabel] ?? 0
      return {
        date: format(parseISO(entry.created_at), 'yyyy-MM-dd'),
        count: level,
        level
      }
    })
    setHeatmapData(data)
  }

  const generateChartData = (entries: MoodEntry[]) => {
    const groupedByDate = entries.reduce((acc: any, entry) => {
      const date = format(parseISO(entry.created_at), 'MMM dd')
      const moodLabel = entry.mood_value.toLowerCase() as 'positive' | 'neutral' | 'negative'
      if (!acc[date]) {
        acc[date] = { date, positive: 0, negative: 0, neutral: 0 }
      }
      if (moodLabel === 'positive' || moodLabel === 'neutral' || moodLabel === 'negative') {
        acc[date][moodLabel]++
      }
      return acc
    }, {})
    const chartData = Object.values(groupedByDate).map((day: any) => ({
      ...day,
      moodScore: (day.positive * 3 + day.neutral * 2 + day.negative * 1) / (day.positive + day.neutral + day.negative)
    }))
    setChartData(chartData)
  }

  const setRandomMotivation = () => {
    const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]
    setDailyMotivation(randomQuote)
  }

  const getMoodRecommendation = () => {
    if (moodStats.total === 0) {
      return {
        type: 'none',
        title: 'No Mood Data Yet',
        message: 'Log your mood to get personalized recommendations.',
        icon: <AlertTriangle className="w-6 h-6" />,
        color: 'gray'
      }
    }
    if (moodStats.negativeRatio >= 70) {
      return {
        type: 'urgent',
        title: 'Consider Professional Support',
        message: 'Your recent mood patterns suggest you might benefit from speaking with a mental health professional. Remember, seeking help is a sign of strength.',
        icon: <AlertTriangle className="w-6 h-6" />,
        color: 'red'
      }
    } else if (moodStats.negativeRatio >= 50) {
      return {
        type: 'moderate',
        title: 'Focus on Self-Care',
        message: 'Your mood has been fluctuating. Try our breathing exercises, meditation, or journaling tools to help improve your well-being.',
        icon: <Heart className="w-6 h-6" />,
        color: 'orange'
      }
    } else {
      return {
        type: 'positive',
        title: 'Keep Up the Great Work!',
        message: 'Your mood patterns look healthy. Continue with your current self-care routine and consider sharing your positivity with the community.',
        icon: <CheckCircle className="w-6 h-6" />,
        color: 'green'
      }
    }
  }

  const recommendation = getMoodRecommendation()

  const pieData = [
    { name: 'Positive', value: moodStats.positive, fill: '#10B981' },
    { name: 'Neutral', value: moodStats.neutral, fill: '#F59E0B' },
    { name: 'Negative', value: moodStats.negative, fill: '#EF4444' }
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-violet-500"></div>
      </div>
    )
  }

  return (
    <main className="max-w-7xl mx-auto space-y-4 p-6">
      {/* Welcome Header */}
      <div className="p-4">
        <div className="flex items-start gap-4">
          <h1 className="text-4xl font-bold font-nohemi text-gray-700 tracking-wide">
            Hi, {user ? `${user.first_name} ${user.last_name}`.trim() || 'there' : 'there'}! 👋
          </h1>

        </div>
      </div>

      
      {/* Mood Recommendation */}
      <div className={`bg-white/80 rounded-3xl p-8 border ${
        recommendation.color === 'red' ? 'border-red-300' : 
        recommendation.color === 'orange' ? 'border-orange-300' : 'border-green-300'
      }`}>
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-2xl ${
            recommendation.color === 'red' ? 'bg-gradient-to-r from-red-500 to-red-600' :
            recommendation.color === 'orange' ? 'bg-gradient-to-r from-orange-500 to-orange-600' :
            'bg-gradient-to-r from-green-500 to-green-600'
          }`}>
            <div className="text-white">{recommendation.icon}</div>
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold font-nohemi text-gray-900 mb-2">{recommendation.title}</h3>
            <p className="text-gray-700 font-nohemi">{recommendation.message}</p>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white/80 rounded-3xl shadow-md p-6 border border-violet-300">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-xl">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-nohemi text-gray-600">Positive Days</p>
              <p className="text-2xl font-bold font-nohemi text-gray-900">{moodStats.positive}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/80 rounded-3xl shadow-md p-6 border border-violet-300">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-xl">
              <TrendingDown className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-nohemi text-gray-600">Challenging Days</p>
              <p className="text-2xl font-bold font-nohemi text-gray-900">{moodStats.negative}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/80 rounded-3xl shadow-md p-6 border border-violet-300">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-violet-100 rounded-xl">
              <Activity className="w-6 h-6 text-violet-600" />
            </div>
            <div>
              <p className="text-sm font-nohemi text-gray-600">Total Entries</p>
              <p className="text-2xl font-bold font-nohemi text-gray-900">{moodStats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/80  rounded-3xl shadow-md p-6 border border-violet-300">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-xl">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-nohemi text-gray-600">Mood Score</p>
              <p className="text-2xl font-bold font-nohemi text-gray-900">
                {moodStats.total > 0 ? Math.round(((moodStats.positive * 3 + moodStats.neutral * 2 + moodStats.negative * 1) / moodStats.total) * 10) / 10 : 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mood Trend Chart */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-violet-200">
          <h3 className="text-xl font-normal font-nohemi text-violet-700 mb-6 flex items-center gap-2">
            <TrendingUp className="w-6 h-6" />
            Mood Trend (30 Days)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 3]} tick={{ fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                  border: '1px solid #d1d5db',
                  borderRadius: '8px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="moodScore" 
                stroke="#8b5cf6" 
                strokeWidth={3}
                dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#8b5cf6', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Mood Distribution */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-violet-200">
          <h3 className="text-xl font-normal font-nohemi text-violet-700 mb-6 flex items-center gap-2">
            <Brain className="w-6 h-6" />
            Mood Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-4">
            {pieData.map((entry, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: entry.fill }}></div>
                <span className="text-sm font-nohemi text-gray-700">{entry.name}: {entry.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Calendar Heatmap */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-violet-200">
        <h3 className="text-xl font-normal font-nohemi text-violet-700 mb-8 flex items-center gap-2">
          <CalendarIcon className="w-6 h-6" />
          Mood Calendar (Past 30 Days)
        </h3>
        <div className="w-full px-4">
          <ActivityCalendar
            data={heatmapData}
            colorScheme="light"
            theme={{
              light: ['#ebedf0', '#fca5a5', '#fde047', '#86efac', '#22c55e'],
              dark: ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'],
            }}
            labels={{
              months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
              weekdays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
              totalCount: '{{count}} mood entries in the last month',
              legend: {
                less: 'Less',
                more: 'More'
              }
            }}
            showWeekdayLabels
            hideTotalCount
            hideColorLegend={false}
            blockSize={16}
            blockMargin={4}
            fontSize={14}
          />
        </div>
        <div className="text-xs text-gray-500 font-nohemi mt-6 text-center">
          Track your daily mood patterns - Each square represents a day
        </div>
        
        {/* Mood Legend */}
        <div className="mt-6 bg-gray-50 rounded-xl p-4">
          <h4 className="text-sm font-bold font-nohemi text-gray-700 mb-3 text-center">Mood Intensity Scale</h4>
          <div className="flex justify-center items-center gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: '#ebedf0' }}></div>
              <span className="text-xs font-nohemi text-gray-600">No Entry</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: '#fca5a5' }}></div>
              <span className="text-xs font-nohemi text-gray-600">Negative</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: '#fde047' }}></div>
              <span className="text-xs font-nohemi text-gray-600">Neutral</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: '#22c55e' }}></div>
              <span className="text-xs font-nohemi text-gray-600">Positive</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white/80 rounded-3xl shadow-xl p-6 border border-violet-400 hover:scale-105 transition-all duration-200 cursor-pointer">
          <div className="text-center space-y-3">
            <div className="p-3 bg-violet-100 rounded-2xl w-fit mx-auto">
              <Brain className="w-8 h-8 text-violet-600" />
            </div>
            <h4 className="font-bold font-nohemi text-gray-900">Self-Help Toolkit</h4>
            <p className="text-sm font-nohemi text-gray-600">Breathing, meditation, journaling tools</p>
          </div>
        </div>

        <div className="bg-white/80  rounded-3xl shadow-xl p-6 border border-violet-400 hover:scale-105 transition-all duration-200 cursor-pointer">
          <div className="text-center space-y-3">
            <div className="p-3 bg-blue-100 rounded-2xl w-fit mx-auto">
              <Activity className="w-8 h-8 text-blue-600" />
            </div>
            <h4 className="font-bold font-nohemi text-gray-900">Mood Tracker</h4>
            <p className="text-sm font-nohemi text-gray-600">Log your daily mood and feelings</p>
          </div>
        </div>

        <div className="bg-white/80  rounded-3xl shadow-xl p-6 border border-violet-400 hover:scale-105 transition-all duration-200 cursor-pointer">
          <div className="text-center space-y-3">
            <div className="p-3 bg-green-100 rounded-2xl w-fit mx-auto">
              <Users className="w-8 h-8 text-green-600" />
            </div>
            <h4 className="font-bold font-nohemi text-gray-900">Community</h4>
            <p className="text-sm font-nohemi text-gray-600">Connect with peers and share support</p>
          </div>
        </div>

        <div className="bg-white/80 rounded-3xl shadow-xl p-6 border border-violet-400 hover:scale-105 transition-all duration-200 cursor-pointer">
          <div className="text-center space-y-3">
            <div className="p-3 bg-purple-100 rounded-2xl w-fit mx-auto">
              <MessageCircle className="w-8 h-8 text-purple-600" />
            </div>
            <h4 className="font-bold font-nohemi text-gray-900">AI Chatbot</h4>
            <p className="text-sm font-nohemi text-gray-600">Get instant support and guidance</p>
          </div>
        </div>
      </div>
    </main>
  )
}
