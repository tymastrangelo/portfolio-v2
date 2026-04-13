'use client'

import { useEffect, useState } from 'react'
import { dashboardSettings } from '@/app/sga/data'
import type { AnalyticsSnapshot, ContentRequest } from '@/app/sga/types'

export default function AnalyticsPage() {
  const [requests, setRequests] = useState<ContentRequest[]>([])
  const [instagramStats, setInstagramStats] = useState<AnalyticsSnapshot>(
    dashboardSettings.analytics
  )

  useEffect(() => {
    let isMounted = true

    const load = async () => {
      try {
        const [requestsRes, instagramRes] = await Promise.all([
          fetch('/api/sga/requests', { cache: 'no-store' }),
          fetch('/api/sga/instagram', { cache: 'no-store' }),
        ])

        if (requestsRes.ok && isMounted) {
          const data = (await requestsRes.json()) as ContentRequest[]
          setRequests(data)
        }

        if (instagramRes.ok && isMounted) {
          const instagramData = (await instagramRes.json()) as AnalyticsSnapshot
          setInstagramStats(instagramData)
        }
      } catch (error) {
        console.error('Failed to load analytics requests:', error)
      }
    }

    load()

    // Keep analytics current while the dashboard remains open.
    const interval = setInterval(load, 5 * 60 * 1000)

    return () => {
      isMounted = false
      clearInterval(interval)
    }
  }, [])

  const activeRequests = requests.filter((r) => !r.archived)
  const totalRequests = activeRequests.length
  const postedRequests = activeRequests.filter((r) => r.status === 'posted').length
  const avgCompletionRate = totalRequests > 0 ? Math.round((postedRequests / totalRequests) * 100) : 0

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Analytics (in progress)</h1>
        <p className="text-slate-600">Social media metrics and team performance</p>
      </div>

      {/* Main Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon="👥"
          label="Total Followers"
          value={instagramStats.totalFollowers.toLocaleString()}
          change="+2.3%"
        />
        <MetricCard
          icon="💬"
          label="Weekly Engagement"
          value={instagramStats.weeklyEngagement.toLocaleString()}
          change="+14.2%"
        />
        <MetricCard
          icon="📰"
          label="Posts This Month"
          value={instagramStats.postsThisMonth.toString()}
          change="+4"
        />
        <MetricCard
          icon="✅"
          label="Completion Rate"
          value={`${avgCompletionRate}%`}
          change={`${postedRequests}/${totalRequests}`}
        />
      </div>

      {/* Request Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Request Status Breakdown</h2>
          <div className="space-y-3">
            <StatusBar
              label="Submitted"
              count={activeRequests.filter((r) => r.status === 'submitted').length}
              total={totalRequests}
              color="bg-gray-400"
            />
            <StatusBar
              label="Assigned"
              count={activeRequests.filter((r) => r.status === 'assigned').length}
              total={totalRequests}
              color="bg-blue-400"
            />
            <StatusBar
              label="In Progress"
              count={activeRequests.filter((r) => r.status === 'in_progress').length}
              total={totalRequests}
              color="bg-yellow-400"
            />
            <StatusBar
              label="In Review"
              count={activeRequests.filter((r) => r.status === 'in_review').length}
              total={totalRequests}
              color="bg-purple-400"
            />
            <StatusBar
              label="Approved"
              count={activeRequests.filter((r) => r.status === 'approved').length}
              total={totalRequests}
              color="bg-green-400"
            />
            <StatusBar
              label="Posted"
              count={activeRequests.filter((r) => r.status === 'posted').length}
              total={totalRequests}
              color="bg-emerald-500"
            />
          </div>
        </div>

        {/* Content Types */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Content Types Used</h2>
          <div className="space-y-3">
            {(['video', 'graphic', 'post', 'reel', 'story', 'carousel'] as const).map((type) => {
              const count = activeRequests.filter((r) => r.content_types.includes(type)).length
              return (
                <div key={type} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700 capitalize">{type}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500"
                        style={{ width: `${(count / totalRequests) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-slate-600 w-8 text-right">{count}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Top Performers */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Top Performing Post</h2>
        <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-900">
            <span className="font-semibold">{instagramStats.topPerformingPost}</span>
          </p>
          <p className="text-xs text-blue-700 mt-2">Updated automatically from Instagram data.</p>
        </div>
      </div>
    </div>
  )
}

function MetricCard({
  icon,
  label,
  value,
  change,
}: {
  icon: string
  label: string
  value: string
  change: string
}) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4">
      <p className="text-2xl mb-2">{icon}</p>
      <p className="text-xs text-slate-600 mb-1">{label}</p>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
      <p className="text-xs text-green-600 font-medium mt-2">{change}</p>
    </div>
  )
}

function StatusBar({
  label,
  count,
  total,
  color,
}: {
  label: string
  count: number
  total: number
  color: string
}) {
  const percentage = total > 0 ? (count / total) * 100 : 0

  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-slate-700">{label}</span>
        <span className="text-sm font-medium text-slate-600">
          {count} {percentage > 0 && `(${Math.round(percentage)}%)`}
        </span>
      </div>
      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
        <div className={`h-full ${color}`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  )
}
