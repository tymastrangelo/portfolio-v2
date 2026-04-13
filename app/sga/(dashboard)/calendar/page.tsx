'use client'

import { useEffect, useState } from 'react'
import { useSession } from '@/lib/sga-session'
import type { CalendarPost, ContentRequest, Task } from '@/app/sga/types'

interface CalendarPostLocal extends CalendarPost {
  _temp?: boolean
}

export default function CalendarPage() {
  const { user } = useSession()
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 3)) // April 2026
  const [calendarPosts, setCalendarPosts] = useState<CalendarPostLocal[]>([
    {
      id: 'cal-1',
      post_date: '2026-04-15',
      content_type: 'reel',
      series: "Michael's Minutes",
      caption: "Week 5 recap - student leadership highlights",
      media_files: [],
      posted: false,
      related_request_id: 'req-1002',
    },
  ])
  const [requests, setRequests] = useState<ContentRequest[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    post_date: '',
    content_type: 'post' as const,
    series: '',
    caption: '',
  })

  useEffect(() => {
    const loadRequests = async () => {
      try {
        const res = await fetch('/api/sga/requests', { cache: 'no-store' })
        if (res.ok) {
          const data = await res.json()
          setRequests(data.filter((r: ContentRequest) => !r.archived))
        }
      } catch (error) {
        console.error('Failed to load requests:', error)
      }
    }

    const loadTasks = async () => {
      try {
        const res = await fetch('/api/sga/tasks', { cache: 'no-store' })
        if (res.ok) {
          const data = await res.json()
          setTasks(data.filter((t: Task) => !t.archived && t.status !== 'completed'))
        }
      } catch (error) {
        console.error('Failed to load tasks:', error)
      }
    }

    loadRequests()
    loadTasks()
  }, [])

  const daysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay()

  const days = Array.from({ length: daysInMonth(currentMonth) }, (_, i) => i + 1)
  const emptyDays = Array.from({ length: firstDayOfMonth(currentMonth) }, () => null)
  const calendarDays = [...emptyDays, ...days]

  const handleAddPost = () => {
    if (!formData.post_date || !formData.series || !formData.caption) {
      alert('Please fill in all required fields')
      return
    }

    const newPost: CalendarPostLocal = {
      id: `cal-${Date.now()}`,
      post_date: formData.post_date,
      content_type: formData.content_type,
      series: formData.series,
      caption: formData.caption,
      media_files: [],
      posted: false,
      _temp: true,
    }

    setCalendarPosts([...calendarPosts, newPost])
    setFormData({
      post_date: '',
      content_type: 'post',
      series: '',
      caption: '',
    })
    setShowAddForm(false)
  }

  const getPostsForDate = (day: number) => {
    const dateStr = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
      .toISOString()
      .split('T')[0]
    return calendarPosts.filter((p) => p.post_date === dateStr)
  }

  const getDeadlinesForDate = (day: number) => {
    const dateStr = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
      .toISOString()
      .split('T')[0]

    let items: Array<{ type: 'request' | 'task' | 'post'; id: string; item: any }> = []

    // Add calendar posts
    const posts = calendarPosts.filter((p) => p.post_date === dateStr)
    items.push(...posts.map((p) => ({ type: 'post' as const, id: p.id, item: p })))

    // Add requests (only if admin)
    if (user?.role === 'admin') {
      const reqsForDate = requests.filter((r) => r.posting_deadline.split('T')[0] === dateStr)
      items.push(...reqsForDate.map((r) => ({ type: 'request' as const, id: r.id, item: r })))
    }

    // Add tasks (only if assigned to user, unless admin)
    const tasksForDate = tasks.filter((t) => {
      const taskDate = t.due_date.split('T')[0]
      if (user?.role === 'admin') {
        return taskDate === dateStr
      }
      return taskDate === dateStr && t.assigned_to.includes(user?.username || '')
    })
    items.push(...tasksForDate.map((t) => ({ type: 'task' as const, id: t.id, item: t })))

    return items
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Content Calendar</h1>
          <p className="text-slate-600">Plan and schedule social posts</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
        >
          {showAddForm ? 'Cancel' : '+ Add Post'}
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-4">
          <h3 className="font-semibold text-slate-900">New Calendar Post</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="date"
              value={formData.post_date}
              onChange={(e) => setFormData({ ...formData, post_date: e.target.value })}
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <select
              value={formData.content_type}
              onChange={(e) => setFormData({ ...formData, content_type: e.target.value as any })}
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="reel">Reel</option>
              <option value="post">Post</option>
              <option value="story">Story</option>
            </select>

            <select
              value={formData.series}
              onChange={(e) => setFormData({ ...formData, series: e.target.value })}
              className="px-3 py-2 col-span-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select series...</option>
              <option value="Michael's Minutes">Michael&apos;s Minutes</option>
              <option value="Meet Your Rep">Meet Your Rep</option>
              <option value="Campus Spotlight">Campus Spotlight</option>
              <option value="Monthly Recap">Monthly Recap</option>
              <option value="Event Coverage">Event Coverage</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <textarea
            placeholder="Caption..."
            value={formData.caption}
            onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="flex gap-3">
            <button
              onClick={handleAddPost}
              className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition"
            >
              Schedule Post
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Month Header & Nav */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
          className="px-4 py-2 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition"
        >
          ← Previous
        </button>
        <h2 className="text-xl font-bold text-slate-900">
          {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h2>
        <button
          onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
          className="px-4 py-2 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition"
        >
          Next →
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        {/* Day headers */}
        <div className="grid grid-cols-7 gap-0 bg-slate-100">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="p-3 text-center font-semibold text-slate-900 text-sm border-b border-slate-200">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-0 bg-white">
          {calendarDays.map((day, idx) => (
            <div
              key={idx}
              className={`min-h-24 border border-slate-200 p-2 ${
                day === null ? 'bg-slate-50' : ''
              }`}
            >
              {day !== null && (
                <div>
                  <p className="text-sm font-semibold text-slate-900 mb-1">{day}</p>
                  <div className="space-y-1">
                    {getDeadlinesForDate(day).map((item) => (
                      <DeadlineCard key={`${item.type}-${item.id}`} type={item.type} item={item.item} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
        <p className="text-sm font-medium text-slate-900 mb-2">Calendar Legend:</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span>Reel</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span>Post</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-purple-500 rounded"></div>
            <span>Story</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded"></div>
            <span>Task</span>
          </div>
          {user?.role === 'admin' && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded"></div>
              <span>Request</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function CalendarPostCard({ post }: { post: CalendarPostLocal }) {
  const colorMap = {
    reel: 'bg-blue-100 text-blue-700',
    post: 'bg-green-100 text-green-700',
    story: 'bg-purple-100 text-purple-700',
  }

  const color = colorMap[post.content_type] || 'bg-slate-100 text-slate-700'

  return (
    <div className={`${color} text-xs px-2 py-1 rounded truncate cursor-pointer hover:opacity-75 transition`}>
      {post.series}
      {post._temp && ' (temp)'}
    </div>
  )
}

function DeadlineCard({
  type,
  item,
}: {
  type: 'post' | 'task' | 'request'
  item: CalendarPostLocal | Task | ContentRequest
}) {
  if (type === 'post') {
    const post = item as CalendarPostLocal
    const colorMap = {
      reel: 'bg-blue-100 text-blue-700',
      post: 'bg-green-100 text-green-700',
      story: 'bg-purple-100 text-purple-700',
    }
    const color = colorMap[post.content_type] || 'bg-slate-100 text-slate-700'
    return (
      <div className={`${color} text-xs px-2 py-1 rounded truncate cursor-pointer hover:opacity-75 transition`}>
        {post.series}
        {post._temp && ' (temp)'}
      </div>
    )
  }

  if (type === 'task') {
    const task = item as Task
    return (
      <div className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded truncate cursor-pointer hover:opacity-75 transition" title={task.name}>
        ✓ {task.name}
      </div>
    )
  }

  if (type === 'request') {
    const request = item as ContentRequest
    return (
      <div className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded truncate cursor-pointer hover:opacity-75 transition" title={request.event_topic}>
        📝 {request.event_topic}
      </div>
    )
  }

  return null
}
