import type { AnalyticsSnapshot } from '@/app/sga/types'

const DEFAULT_GRAPH_VERSION = process.env.INSTAGRAM_GRAPH_VERSION || 'v21.0'
const GRAPH_BASE_URL = `https://graph.facebook.com/${DEFAULT_GRAPH_VERSION}`

interface InstagramMediaItem {
  id: string
  caption?: string
  timestamp?: string
  like_count?: number
  comments_count?: number
}

interface GraphListResponse<T> {
  data: T[]
}

interface GraphInsightEntry {
  name: string
  values?: Array<{ value: number | string }>
}

interface GraphInsightsResponse {
  data?: GraphInsightEntry[]
}

function getInstagramConfig() {
  const igUserId = process.env.INSTAGRAM_USER_ID
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN

  if (!igUserId || !accessToken) {
    throw new Error('Missing INSTAGRAM_USER_ID or INSTAGRAM_ACCESS_TOKEN environment variables')
  }

  return { igUserId, accessToken }
}

async function graphRequest<T>(path: string, params: Record<string, string>): Promise<T> {
  const { accessToken } = getInstagramConfig()

  const query = new URLSearchParams({
    ...params,
    access_token: accessToken,
  })

  const response = await fetch(`${GRAPH_BASE_URL}${path}?${query.toString()}`, {
    cache: 'no-store',
  })

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`Instagram Graph API error: ${response.status} ${err}`)
  }

  return (await response.json()) as T
}

function toNumber(value: unknown): number {
  if (typeof value === 'number') return value
  if (typeof value === 'string') {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : 0
  }
  return 0
}

function startOfMonthIso(now: Date): string {
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0)).toISOString()
}

function daysAgoIso(now: Date, days: number): string {
  return new Date(now.getTime() - days * 24 * 60 * 60 * 1000).toISOString()
}

function getLatestInsightValue(insights: GraphInsightEntry[] | undefined, name: string): number {
  const insight = insights?.find((entry) => entry.name === name)
  const latest = insight?.values?.[0]?.value
  return toNumber(latest)
}

function getEngagement(item: InstagramMediaItem): number {
  return toNumber(item.like_count) + toNumber(item.comments_count)
}

function topPostLabel(item: InstagramMediaItem | undefined): string {
  if (!item) return 'No recent post data'

  const caption = (item.caption || '').trim()
  if (!caption) return `Post ${item.id}`

  return caption.length > 80 ? `${caption.slice(0, 77)}...` : caption
}

export async function getInstagramAnalyticsSnapshot(): Promise<AnalyticsSnapshot> {
  const { igUserId } = getInstagramConfig()
  const now = new Date()
  const monthStart = startOfMonthIso(now)
  const weekStart = daysAgoIso(now, 7)

  const [insightsResponse, mediaResponse] = await Promise.all([
    graphRequest<GraphInsightsResponse>(`/${igUserId}/insights`, {
      metric: 'follower_count',
      period: 'day',
    }),
    graphRequest<GraphListResponse<InstagramMediaItem>>(`/${igUserId}/media`, {
      fields: 'id,caption,timestamp,like_count,comments_count',
      limit: '100',
    }),
  ])

  const media = mediaResponse.data || []
  const weekPosts = media.filter((item) => item.timestamp && item.timestamp >= weekStart)
  const monthPosts = media.filter((item) => item.timestamp && item.timestamp >= monthStart)

  const topPost = [...monthPosts].sort((a, b) => getEngagement(b) - getEngagement(a))[0]

  return {
    totalFollowers: getLatestInsightValue(insightsResponse.data, 'follower_count'),
    weeklyEngagement: weekPosts.reduce((sum, item) => sum + getEngagement(item), 0),
    postsThisMonth: monthPosts.length,
    topPerformingPost: topPostLabel(topPost),
  }
}
